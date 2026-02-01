import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
    // First, drop the table if it exists
    console.log('Dropping existing resources table if exists...');
    await connection.query('DROP TABLE IF EXISTS resources');
    console.log('✅ Dropped existing table (if it existed)');

    // Then create the new table
    console.log('Creating resources table...');
    const createTableSQL = `
      CREATE TABLE resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content LONGTEXT NOT NULL,
        excerpt TEXT,
        category VARCHAR(50) NOT NULL,
        author VARCHAR(100),
        publishedAt DATETIME,
        tags JSON,
        status VARCHAR(20) DEFAULT 'published',
        views INT DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_publishedAt (publishedAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await connection.query(createTableSQL);
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
