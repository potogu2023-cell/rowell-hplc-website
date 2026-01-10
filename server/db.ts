import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
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
      
      // Check if URL has ssl parameter and remove it
      const hasSSL = connectionString.includes('?ssl=');
      // Remove any SSL parameters from the connection string
      connectionString = connectionString.replace(/\?ssl=.*$/, '');
      console.log('[Database] After removing SSL param:', connectionString);
      console.log('[Database] Has SSL:', hasSSL);
      
      // Parse the connection URL
      // Format: mysql://username:password@host:port/database
      const urlMatch = connectionString.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
      console.log('[Database] URL match result:', urlMatch ? 'SUCCESS' : 'FAILED');
      
      if (!urlMatch) {
        console.error('[Database] Failed to parse DATABASE_URL. Expected format: mysql://username:password@host:port/database');
        throw new Error('Invalid DATABASE_URL format');
      }
      
      const [, user, password, host, port, database] = urlMatch;
      
      // Decode URL-encoded username and password
      const decodedUser = decodeURIComponent(user);
      const decodedPassword = decodeURIComponent(password);
      
      console.log('[Database] Parsed connection info:');
      console.log('[Database]   Host:', host);
      console.log('[Database]   Port:', port);
      console.log('[Database]   User:', decodedUser);
      console.log('[Database]   Database:', database);
      console.log('[Database]   SSL:', hasSSL);
      
      // Create connection pool with proper config
      const connection = mysql.createPool({
        host,
        port: parseInt(port),
        user: decodedUser,
        password: decodedPassword,
        database,
        ssl: hasSSL ? { rejectUnauthorized: true } : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      
      // Test the connection
      try {
        await connection.query('SELECT 1');
        console.log('[Database] Connection test successful');
      } catch (testError: any) {
        console.error('[Database] Connection test failed:', testError.message);
        console.error('[Database] Error code:', testError.code);
        console.error('[Database] SQL state:', testError.sqlState);
        throw testError;
      }
      
      _db = drizzle(connection);
      console.log('[Database] Drizzle initialized successfully');
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function insertProducts(productsData: InsertProduct[]) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot insert products: database not available");
    return [];
  }

  try {
    const result = await db.insert(products).values(productsData);
    return result;
  } catch (error) {
    console.error("[Database] Failed to insert products:", error);
    throw error;
  }
}

export async function getAllProducts() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get products: database not available");
    return [];
  }

  const result = await db.select().from(products);
  return result;
}

export async function getProductsByBrand(brand: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get products: database not available");
    return [];
  }

  const result = await db.select().from(products).where(eq(products.brand, brand));
  return result;
}


// Category queries
export async function getAllCategories() {
  return await getCategoriesWithProductCount();
}

export async function getVisibleCategories() {
  return await getCategoriesWithProductCount();
}

export async function getCategoriesByLevel(level: number) {
  // All categories from crawler_results are level 1
  if (level === 1) {
    return await getCategoriesWithProductCount();
  }
  return [];
}

export async function getCategoryById(id: number) {
  const allCategories = await getCategoriesWithProductCount();
  return allCategories.find(cat => cat.id === id);
}

export async function getChildCategories(parentId: number) {
  // No child categories in crawler_results
  return [];
}

export async function getTopLevelCategories(visibleOnly: boolean = true) {
  // All categories from crawler_results are top-level
  return await getCategoriesWithProductCount();
}

export async function getCategoriesWithProductCount() {
  const db = await getDb();
  if (!db) return [];
  const { products } = await import("../drizzle/schema");
  const { count, sql } = await import("drizzle-orm");
  
  try {
    // Get categories from crawler_results table with product count
    const result = await db
      .select({
        id: sql<number>`ROW_NUMBER() OVER (ORDER BY ${products.category})`,
        name: products.category,
        nameEn: products.category,
        slug: sql<string>`LOWER(REPLACE(${products.category}, ' ', '-'))`,
        parentId: sql<number | null>`NULL`,
        level: sql<number>`1`,
        displayOrder: sql<number>`0`,
        isVisible: sql<number>`1`,
        description: sql<string | null>`NULL`,
        icon: sql<string | null>`NULL`,
        createdAt: sql<string>`NOW()`,
        updatedAt: sql<string>`NOW()`,
        productCount: count(products.id),
      })
      .from(products)
      .where(sql`${products.status} IN ('verified', 'active') AND ${products.category} IS NOT NULL AND ${products.category} != ''`)
      .groupBy(products.category)
      .orderBy(products.category);
    
    return result;
  } catch (error) {
    console.error('[Database] Error in getCategoriesWithProductCount:', error);
    return [];
  }
}



// Authentication queries
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(userData: InsertUser) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create user: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(users).values(userData);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create user:", error);
    throw error;
  }
}

export async function updateUserEmailVerified(email: string, verified: number = 1) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return;
  }

  try {
    await db.update(users)
      .set({ emailVerified: verified })
      .where(eq(users.email, email));
  } catch (error) {
    console.error("[Database] Failed to update email verification:", error);
    throw error;
  }
}

export async function updateUserPassword(email: string, hashedPassword: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update password: database not available");
    return;
  }

  try {
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));
  } catch (error) {
    console.error("[Database] Failed to update password:", error);
    throw error;
  }
}

export async function updateUserProfile(userId: number, profileData: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update profile: database not available");
    return;
  }

  try {
    await db.update(users)
      .set(profileData)
      .where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to update profile:", error);
    throw error;
  }
}



// Cart queries
export async function getCartByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get cart: database not available");
    return [];
  }

  const { cart, products } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  // Join cart with products to get product details
  const result = await db
    .select({
      id: cart.id,
      userId: cart.userId,
      productId: cart.productId,
      quantity: cart.quantity,
      notes: cart.notes,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      product: products,
    })
    .from(cart)
    .leftJoin(products, eq(cart.productId, products.id))
    .where(eq(cart.userId, userId));

  return result;
}

export async function addToCart(userId: number, productId: number, quantity: number = 1, notes?: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add to cart: database not available");
    return undefined;
  }

  const { cart } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");

  // Check if product already in cart
  const existing = await db
    .select()
    .from(cart)
    .where(and(eq(cart.userId, userId), eq(cart.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    // Update quantity
    await db
      .update(cart)
      .set({ 
        quantity: existing[0].quantity + quantity,
        notes: notes || existing[0].notes,
      })
      .where(eq(cart.id, existing[0].id));
    return existing[0].id;
  } else {
    // Insert new
    const result = await db.insert(cart).values({
      userId,
      productId,
      quantity,
      notes: notes || null,
    });
    return result;
  }
}

export async function updateCartItem(cartId: number, quantity: number, notes?: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update cart: database not available");
    return;
  }

  const { cart } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  await db
    .update(cart)
    .set({ 
      quantity,
      notes: notes || null,
    })
    .where(eq(cart.id, cartId));
}

export async function removeFromCart(cartId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot remove from cart: database not available");
    return;
  }

  const { cart } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  await db.delete(cart).where(eq(cart.id, cartId));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot clear cart: database not available");
    return;
  }

  const { cart } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  await db.delete(cart).where(eq(cart.userId, userId));
}

// Inquiry queries
export async function createInquiry(inquiryData: {
  userId: number;
  urgency: "normal" | "urgent" | "very_urgent";
  budgetRange?: string;
  applicationNotes?: string;
  deliveryAddress?: string;
  customerNotes?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create inquiry: database not available");
    return undefined;
  }

  const { inquiries } = await import("../drizzle/schema");

  // Generate inquiry number: INQ-YYYYMMDD-XXX
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  
  // Get count of inquiries today
  const { count, gte } = await import("drizzle-orm");
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayCount = await db
    .select({ count: count() })
    .from(inquiries)
    .where(gte(inquiries.createdAt, todayStart));
  
  const sequence = String((todayCount[0]?.count || 0) + 1).padStart(3, "0");
  const inquiryNumber = `INQ-${dateStr}-${sequence}`;

  const result = await db.insert(inquiries).values({
    inquiryNumber,
    userId: inquiryData.userId,
    urgency: inquiryData.urgency,
    budgetRange: inquiryData.budgetRange || null,
    applicationNotes: inquiryData.applicationNotes || null,
    deliveryAddress: inquiryData.deliveryAddress || null,
    customerNotes: inquiryData.customerNotes || null,
    totalItems: 0,
    status: "pending",
  });

  return { inquiryNumber, insertId: result };
}

export async function addInquiryItems(inquiryId: number, items: Array<{ productId: number; quantity: number; notes?: string }>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add inquiry items: database not available");
    return;
  }

  const { inquiryItems, inquiries } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  // Insert items
  await db.insert(inquiryItems).values(
    items.map(item => ({
      inquiryId,
      productId: item.productId,
      quantity: item.quantity,
      notes: item.notes || null,
    }))
  );

  // Update total items count
  await db
    .update(inquiries)
    .set({ totalItems: items.length })
    .where(eq(inquiries.id, inquiryId));
}

export async function getInquiriesByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get inquiries: database not available");
    return [];
  }

  const { inquiries } = await import("../drizzle/schema");
  const { eq, desc } = await import("drizzle-orm");

  const result = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.userId, userId))
    .orderBy(desc(inquiries.createdAt));

  return result;
}

export async function getInquiryById(inquiryId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get inquiry: database not available");
    return undefined;
  }

  const { inquiries } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  const result = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, inquiryId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getInquiryItems(inquiryId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get inquiry items: database not available");
    return [];
  }

  const { inquiryItems, products } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  const result = await db
    .select({
      id: inquiryItems.id,
      inquiryId: inquiryItems.inquiryId,
      productId: inquiryItems.productId,
      quantity: inquiryItems.quantity,
      notes: inquiryItems.notes,
      quotedPrice: inquiryItems.quotedPrice,
      createdAt: inquiryItems.createdAt,
      product: products,
    })
    .from(inquiryItems)
    .leftJoin(products, eq(inquiryItems.productId, products.id))
    .where(eq(inquiryItems.inquiryId, inquiryId));

  return result;
}


/**
 * Update user's AI advisor consent mode
 */
export async function updateUserConsent(
  userId: number,
  consentMode: "standard" | "privacy"
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update consent: database not available");
    return;
  }

  try {
    await db
      .update(users)
      .set({
        consentMode,
        consentTimestamp: new Date(),
      })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to update user consent:", error);
    throw error;
  }
}
