import mysql.connector
import os

# Get database credentials from environment
db_host = os.getenv('DATABASE_HOST', 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com')
db_user = os.getenv('DATABASE_USER', '4UghFjJ7qjGhgt4.root')
db_password = os.getenv('DATABASE_PASSWORD', 'swV7dYB9eJ2GwHDw')
db_name = os.getenv('DATABASE_NAME', 'rowell_workflow')

try:
    conn = mysql.connector.connect(
        host=db_host,
        port=4000,
        user=db_user,
        password=db_password,
        database=db_name,
        ssl_disabled=False
    )
    
    cursor = conn.cursor(dictionary=True)
    
    print("=" * 80)
    print("📊 制图团队工作成果验证")
    print("=" * 80)
    
    # 1. 检查crawler_results表中的图片
    print("\n【1. crawler_results表图片统计】")
    cursor.execute("""
        SELECT 
            COUNT(*) as total_with_images
        FROM crawler_results
        WHERE imageUrl IS NOT NULL 
          AND imageUrl != ''
          AND imageUrl LIKE '%cdninstagram.com%'
    """)
    result = cursor.fetchone()
    print(f"包含cdninstagram.com图片的记录数: {result['total_with_images']}")
    
    # 2. 按品牌统计
    print("\n【2. 按品牌统计】")
    cursor.execute("""
        SELECT 
            brand,
            COUNT(*) as count
        FROM crawler_results
        WHERE imageUrl IS NOT NULL 
          AND imageUrl != ''
          AND imageUrl LIKE '%cdninstagram.com%'
        GROUP BY brand
        ORDER BY count DESC
    """)
    brands = cursor.fetchall()
    for brand in brands:
        print(f"  {brand['brand']}: {brand['count']}张")
    
    # 3. 获取前10个产品示例
    print("\n【3. 产品示例 (前10条)】")
    cursor.execute("""
        SELECT 
            id,
            productId,
            partNumber,
            brand,
            productName,
            imageUrl
        FROM crawler_results
        WHERE imageUrl IS NOT NULL 
          AND imageUrl != ''
          AND imageUrl LIKE '%cdninstagram.com%'
        ORDER BY id
        LIMIT 10
    """)
    samples = cursor.fetchall()
    for i, sample in enumerate(samples, 1):
        print(f"\n{i}. {sample['productId']} ({sample['brand']})")
        print(f"   Part Number: {sample['partNumber']}")
        print(f"   图片URL: {sample['imageUrl'][:80]}...")
    
    # 4. 检查这些产品在products表中的状态
    print("\n【4. products表对比检查】")
    cursor.execute("""
        SELECT 
            COUNT(*) as count
        FROM products p
        WHERE EXISTS (
            SELECT 1 FROM crawler_results cr
            WHERE cr.productId = p.productId
              AND cr.imageUrl IS NOT NULL
              AND cr.imageUrl != ''
              AND cr.imageUrl LIKE '%cdninstagram.com%'
        )
    """)
    products_match = cursor.fetchone()
    print(f"在products表中找到匹配的产品数: {products_match['count']}")
    
    # 5. 检查products表中这些产品的imageUrl状态
    cursor.execute("""
        SELECT 
            p.productId,
            p.imageUrl as products_imageUrl,
            cr.imageUrl as crawler_imageUrl
        FROM products p
        INNER JOIN crawler_results cr ON p.productId = cr.productId
        WHERE cr.imageUrl IS NOT NULL
          AND cr.imageUrl != ''
          AND cr.imageUrl LIKE '%cdninstagram.com%'
        LIMIT 5
    """)
    comparison = cursor.fetchall()
    print("\n【5. 数据对比示例】")
    for item in comparison:
        print(f"\n产品ID: {item['productId']}")
        print(f"  products表imageUrl: {item['products_imageUrl'] or '(空)'}")
        print(f"  crawler_results表imageUrl: {item['crawler_imageUrl'][:60]}...")
    
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 80)
    print("✅ 验证完成!")
    print("=" * 80)
    
except Exception as e:
    print(f"❌ 错误: {e}")
    import traceback
    traceback.print_exc()
