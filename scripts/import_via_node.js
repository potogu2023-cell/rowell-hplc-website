#!/usr/bin/env node
/**
 * Import resource articles to database via Node.js
 * This script uses the existing database connection from the application
 */

const fs = require('fs');
const path = require('path');

async function importResources() {
  console.log('===================================');
  console.log('Resource Articles Import Script');
  console.log('(Node.js Version)');
  console.log('===================================\n');

  try {
    // Import database connection
    console.log('Loading database connection...');
    const { getDb } = await import('../server/db.js');
    const { sql } = await import('drizzle-orm');
    
    const db = await getDb();
    if (!db) {
      throw new Error('Failed to connect to database');
    }
    
    console.log('✅ Database connected\n');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'import_resources.sql');
    console.log(`Reading SQL file: ${sqlFilePath}`);
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found: ${sqlFilePath}`);
    }
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`✅ SQL file found: ${statements.length} statements\n`);
    
    // Execute SQL statements
    console.log('Importing resources to database...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.substring(0, 80).replace(/\s+/g, ' ');
      
      try {
        await db.execute(sql.raw(statement));
        successCount++;
        console.log(`[${i + 1}/${statements.length}] ✅ ${preview}...`);
      } catch (err) {
        errorCount++;
        console.error(`[${i + 1}/${statements.length}] ❌ ${preview}...`);
        console.error(`   Error: ${err.message}`);
      }
    }
    
    console.log('\n===================================');
    console.log(`Execution completed!`);
    console.log(`Success: ${successCount}, Errors: ${errorCount}`);
    console.log('===================================\n');
    
    // Verify import
    console.log('Verifying import...\n');
    
    const { resources } = await import('../drizzle/schema.js');
    const countResult = await db.select({ count: sql`count(*)` }).from(resources);
    const totalResources = countResult[0]?.count || 0;
    
    console.log(`Total resources in database: ${totalResources}`);
    
    if (totalResources >= 20) {
      console.log('✅ Import successful! All articles are in the database.\n');
      
      // Show sample
      const samples = await db.select({
        id: resources.id,
        title: resources.title,
        language: resources.language,
        status: resources.status
      }).from(resources).limit(5);
      
      console.log('Sample resources:');
      samples.forEach(r => {
        console.log(`  - [${r.id}] ${r.title} (${r.language}, ${r.status})`);
      });
      
      console.log('\n===================================');
      console.log('✅ Import completed successfully!');
      console.log('Please verify the Resources page:');
      console.log('https://www.rowellhplc.com/resources');
      console.log('===================================\n');
      
      process.exit(0);
    } else {
      console.log(`⚠️  Warning: Expected 20+ resources, but found ${totalResources}`);
      console.log('Some articles may not have been imported correctly.\n');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run import
importResources();
