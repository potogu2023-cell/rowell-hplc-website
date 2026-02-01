import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createTable() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  // Parse MySQL URL
  const url = new URL(dbUrl);
  const config = {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: url.searchParams.get('ssl') === 'true' ? { rejectUnauthorized: false } : undefined
  };

  console.log('Connecting to database...');
  const connection = await mysql.createConnection(config);
  console.log('✅ Connected to database');

  try {
    // Read SQL file
    const sqlFile = join(__dirname, 'create-resources-table.sql');
    const sql = readFileSync(sqlFile, 'utf-8');
    
    console.log('Creating resources table...');
    await connection.query(sql);
    console.log('✅ Resources table created successfully');
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    throw error;
  } finally {
    await connection.end();
    console.log('✅ Connection closed');
  }
}

createTable().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
