import mysql from 'mysql2/promise';

// Parse DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);
const dbConfig = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  ssl: dbUrl.searchParams.get('ssl') === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined
};

console.log('Attempting to connect with config:');
console.log({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: '***' + dbConfig.password.slice(-4),
  database: dbConfig.database,
  ssl: dbConfig.ssl ? 'enabled' : 'disabled'
});

try {
  const connection = await mysql.createConnection(dbConfig);
  console.log('✅ Connected successfully!');
  
  // Test query
  const [rows] = await connection.query('SELECT 1 as test');
  console.log('✅ Query successful:', rows);
  
  await connection.end();
  console.log('✅ Connection closed');
} catch (error) {
  console.error('❌ Connection failed:', error.message);
  console.error('Error code:', error.code);
  console.error('Error number:', error.errno);
  process.exit(1);
}
