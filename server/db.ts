import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertProduct, InsertUser, products, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  console.log('[Database] getDb() called. _db exists:', !!_db, 'DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Parse DATABASE_URL
      let connectionString = process.env.DATABASE_URL;
      console.log('[Database] Original DATABASE_URL:', connectionString);
      
      // PostgreSQL connection string format: postgresql://username:password@host:port/database
      // or postgres://username:password@host:port/database
      
      // Create postgres connection
      const client = postgres(connectionString, {
        ssl: 'require', // TiDB Cloud requires SSL
        max: 10, // Connection pool size
      });
      
      // Test the connection
      try {
        await client`SELECT 1`;
        console.log('[Database] Connection test successful');
      } catch (testError: any) {
        console.error('[Database] Connection test failed:', testError.message);
        throw testError;
      }
      
      _db = drizzle(client);
      console.log('[Database] Drizzle initialized successfully');
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  const db = await getDb();
  
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      handle: user.handle,
      username: user.username,
      avatarUrl: user.avatarUrl,
      email: user.email,
    };

    await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.handle,
        set: {
          username: user.username,
          avatarUrl: user.avatarUrl,
          email: user.email,
        },
      });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(handle: string) {
  const db = await getDb();
  
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return null;
  }

  try {
    const result = await db.select().from(users).where(eq(users.handle, handle));
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get user:", error);
    return null;
  }
}

export async function getAllUsers() {
  const db = await getDb();
  
  if (!db) {
    console.warn("[Database] Cannot get all users: database not available");
    return [];
  }

  try {
    return await db.select().from(users);
  } catch (error) {
    console.error("[Database] Failed to get all users:", error);
    return [];
  }
}
