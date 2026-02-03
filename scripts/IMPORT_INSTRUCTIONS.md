# Resource Articles Import Instructions

## 📋 Overview

This directory contains scripts and SQL files to import 20 HPLC resource articles into the database.

**Articles**:
- 7 Technical Guides
- 7 Application Notes
- 6 Industry Insights

**Total**: 20 articles, all in English, optimized for SEO

---

## 🚀 Method A: Import via Render Shell (Recommended)

### Step 1: Ensure files are committed to GitHub

Files needed:
- `scripts/import_resources.sql` (135KB) - SQL import file with all articles
- `scripts/import_on_render.sh` - Bash script to execute import
- `scripts/import_articles.cjs` - Node.js script to generate SQL (backup)

### Step 2: Open Render Shell

1. Go to https://dashboard.render.com/
2. Select your service: `rowell-hplc-website`
3. Click "Shell" tab in the left sidebar
4. Wait for the shell to connect

### Step 3: Execute import script

In the Render Shell, run:

```bash
cd /opt/render/project/src
bash ./scripts/import_on_render.sh
```

**Expected output**:
```
===================================
Resource Articles Import Script
===================================

✅ SQL file found: 3 lines

Importing resources to database...

Database: rowell_workflow
Host: gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000
User: 4UghFjJ7qjGhgt4.root

✅ Import completed successfully!

Verifying import...
+------------------+
| total_resources  |
+------------------+
|               20 |
+------------------+

===================================
Import completed! Please verify the Resources page on the website.
===================================
```

### Step 4: Verify on website

Visit: https://www.rowellhplc.com/resources

You should see 20 articles displayed.

---

## 🔧 Method B: Import via Node.js (Alternative)

If bash script fails, try Node.js approach:

### Step 1: Create import script

In Render Shell:

```bash
cd /opt/render/project/src

cat > /tmp/import.js << 'EOF'
const fs = require('fs');
const { getDb } = require('./server/db.js');
const { sql } = require('drizzle-orm');

async function importSQL() {
  const db = await getDb();
  const sqlContent = fs.readFileSync('./scripts/import_resources.sql', 'utf-8');
  const statements = sqlContent.split(';').filter(s => s.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      await db.execute(sql.raw(statement));
    }
  }
  
  console.log('✅ Import completed!');
  process.exit(0);
}

importSQL().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
EOF

node /tmp/import.js
```

---

## 📊 Article Details

### Technical Guides (7 articles)
1. TG-001: HPLC Method Development - A Step-by-Step Guide for Beginners
2. TG-002: Troubleshooting Common HPLC Peak Issues
3. TG-003: How to Select the Right HPLC Column for Your Application
4. TG-004: Sample Preparation Techniques for HPLC Analysis
5. TG-005: Mobile Phase Optimization in HPLC
6. TG-006: HPLC System Maintenance and Care
7. TG-007: A Practical Guide to HPLC Column Selection

### Application Notes (7 articles)
1. AN-001: Pharmaceutical Analysis - Assay of Active Ingredients in Tablets
2. AN-002: Food Safety - Detection of Pesticide Residues in Vegetables
3. AN-003: Environmental Analysis - Water Quality Testing for Heavy Metals
4. AN-004: Petrochemical Analysis - Determination of Additives in Gasoline
5. AN-005: Clinical Diagnostics - Analysis of Vitamin D in Human Serum
6. AN-006: Nutraceuticals - Analysis of Curcuminoids in Turmeric Supplements
7. AN-007: Food Analysis - Determination of Artificial Sweeteners in Beverages

### Industry Insights (6 articles)
1. II-001: The Rise of Biopharmaceuticals and the Role of HPLC
2. II-002: Emerging Trends in HPLC Technology
3. II-003: The Impact of AI on Chromatography Data Analysis
4. II-004: HPLC in Forensic Science
5. II-005: The Future of Pharmaceutical Quality Control
6. II-006: HPLC in Cannabis Testing

---

## 🔍 SEO Keywords Covered

- Pharmaceutical Analysis, Active Ingredients, Tablets
- Food Safety, Pesticide Residues, Artificial Sweeteners
- Environmental Analysis, Water Quality, Heavy Metals
- Clinical Diagnostics, Vitamin D, Human Serum
- Petrochemical Analysis, Gasoline Additives
- Forensic Science
- Cannabis Testing
- Biopharmaceuticals
- AI on Chromatography

---

## ⚠️ Troubleshooting

### Error: "Access denied"
- Check if DATABASE_URL in .env is correct
- Verify TiDB Cloud allows connections from Render IP

### Error: "SQL file not found"
- Ensure you're in the correct directory: `/opt/render/project/src`
- Check if files are committed to GitHub and pulled by Render

### Error: "Duplicate entry"
- Articles already exist in database
- To re-import, first delete existing resources:
  ```sql
  DELETE FROM resources WHERE language = 'en';
  DELETE FROM resource_categories;
  ```

---

## 📝 Notes

- All articles are in English (符合SEO要求)
- Publication dates distributed across 2025-08 to 2025-12
- 8 articles marked as "featured" for homepage display
- Author: "Manus AI" (符合品牌策略)
- All articles have status: "published"

---

## ✅ Success Criteria

After import:
1. Resources page shows 20 articles
2. Articles are categorized correctly
3. Search and filter work properly
4. Individual article pages load correctly
5. SEO meta tags are present

