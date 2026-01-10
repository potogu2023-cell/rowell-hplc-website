import mysql.connector
from datetime import datetime, timedelta

# Database connection
conn = mysql.connector.connect(
    host="gateway01.ap-northeast-1.prod.aws.tidbcloud.com",
    port=4000,
    user="4UghFjJ7qjGhgt4.root",
    password="swV7dYB9eJ2GwHDw",
    database="rowell_workflow",
    ssl_disabled=False
)

cursor = conn.cursor(dictionary=True)

print("=" * 80)
print("📊 产品图片更新情况检查报告")
print("=" * 80)

# 1. 总体统计
cursor.execute("""
    SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN imageUrl IS NOT NULL AND imageUrl != '' AND imageUrl != 'N/A' THEN 1 ELSE 0 END) as with_images,
        SUM(CASE WHEN imageUrl IS NULL OR imageUrl = '' OR imageUrl = 'N/A' THEN 1 ELSE 0 END) as without_images
    FROM products
""")
stats = cursor.fetchone()

print(f"\n【总体统计】")
print(f"总产品数: {stats['total_products']}")
print(f"已有图片: {stats['with_images']} ({stats['with_images']/stats['total_products']*100:.1f}%)")
print(f"缺少图片: {stats['without_images']} ({stats['without_images']/stats['total_products']*100:.1f}%)")

# 2. 按品牌统计
cursor.execute("""
    SELECT 
        brand,
        COUNT(*) as total,
        SUM(CASE WHEN imageUrl IS NOT NULL AND imageUrl != '' AND imageUrl != 'N/A' THEN 1 ELSE 0 END) as with_images,
        SUM(CASE WHEN imageUrl IS NULL OR imageUrl = '' OR imageUrl = 'N/A' THEN 1 ELSE 0 END) as without_images
    FROM products
    GROUP BY brand
    ORDER BY total DESC
    LIMIT 15
""")
brands = cursor.fetchall()

print(f"\n【按品牌统计】")
print(f"{'品牌':<20} {'总数':>8} {'有图片':>8} {'无图片':>8} {'完成度':>8}")
print("-" * 60)
for brand in brands:
    completion = brand['with_images']/brand['total']*100 if brand['total'] > 0 else 0
    print(f"{brand['brand']:<20} {brand['total']:>8} {brand['with_images']:>8} {brand['without_images']:>8} {completion:>7.1f}%")

# 3. 检查最近更新的图片
cursor.execute("""
    SELECT 
        productId, brand, name, imageUrl, updatedAt
    FROM products
    WHERE imageUrl IS NOT NULL AND imageUrl != '' AND imageUrl != 'N/A'
    ORDER BY updatedAt DESC
    LIMIT 20
""")
recent = cursor.fetchall()

print(f"\n【最近更新的产品图片 (前20条)】")
for i, product in enumerate(recent, 1):
    print(f"{i}. {product['productId']} - {product['brand']} - 更新时间: {product['updatedAt']}")
    print(f"   图片URL: {product['imageUrl'][:80]}...")

# 4. 检查图片URL的来源分布
cursor.execute("""
    SELECT 
        CASE 
            WHEN imageUrl LIKE '%manuscdn.com%' THEN 'ManuscDN'
            WHEN imageUrl LIKE '%cloudfront%' THEN 'CloudFront'
            WHEN imageUrl LIKE '%agilent.com%' THEN 'Agilent官网'
            WHEN imageUrl LIKE '%shimadzu%' THEN 'Shimadzu'
            ELSE '其他'
        END as source,
        COUNT(*) as count
    FROM products
    WHERE imageUrl IS NOT NULL AND imageUrl != '' AND imageUrl != 'N/A'
    GROUP BY source
    ORDER BY count DESC
""")
sources = cursor.fetchall()

print(f"\n【图片来源分布】")
for source in sources:
    print(f"{source['source']}: {source['count']}张")

cursor.close()
conn.close()

print("\n" + "=" * 80)
print("检查完成!")
print("=" * 80)
