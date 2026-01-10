import mysql.connector
import json
from collections import defaultdict

# Database connection - 使用正确的凭据
conn = mysql.connector.connect(
    host="gateway01.ap-northeast-1.prod.aws.tidbcloud.com",
    port=4000,
    user="4UghFjJ7qjGhgt4.root",
    password="swV7dYB9eJ2GwHDw",
    database="rowell_workflow"
)

cursor = conn.cursor(dictionary=True)

# Query products without images
query = """
SELECT 
    id, sku, name, brand, category, subCategory, 
    imageUrl, price, inStock
FROM products
WHERE imageUrl IS NULL OR imageUrl = '' OR imageUrl = 'N/A'
ORDER BY brand, category, subCategory
LIMIT 1500
"""

cursor.execute(query)
products_without_images = cursor.fetchall()

# Statistics by brand
brand_stats = defaultdict(int)
category_stats = defaultdict(int)

for product in products_without_images:
    brand_stats[product['brand']] += 1
    category_stats[product['category']] += 1

# Save results
with open('/tmp/products_without_images.json', 'w', encoding='utf-8') as f:
    json.dump(products_without_images, f, ensure_ascii=False, indent=2)

# Print summary
print(f"总计缺少图片的产品: {len(products_without_images)}")
print(f"\n按品牌统计:")
for brand, count in sorted(brand_stats.items(), key=lambda x: x[1], reverse=True)[:15]:
    print(f"  {brand}: {count}")

print(f"\n按类别统计:")
for category, count in sorted(category_stats.items(), key=lambda x: x[1], reverse=True):
    print(f"  {category}: {count}")

cursor.close()
conn.close()

print(f"\n详细数据已保存到: /tmp/products_without_images.json")
