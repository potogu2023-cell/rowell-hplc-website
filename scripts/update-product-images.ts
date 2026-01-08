/**
 * 更新产品图片URL脚本
 * 
 * 功能：批量更新55个产品的imageUrl字段
 * 使用方式：pnpm tsx scripts/update-product-images-final.ts
 */

import fs from 'fs';
import path from 'path';
import { getDb } from '../server/db';
import { products } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

// 品牌前缀映射
const BRAND_PREFIX_MAP: Record<string, string> = {
  'Waters': 'WATS',
  'Agilent': 'AGIL',
  'Phenomenex': 'PHEN',
  'Thermo Fisher Scientific': 'THER',
  'Thermo Fisher': 'THER',
  'Shimadzu': 'SHIM',
  'Merck': 'MERC',
  'Restek': 'REST',
  'ACE': 'ACE',
  'Avantor': 'AVAN',
  'Daicel': 'DAIC',
  'Develosil': 'DEVE',
};

// 图片URL映射数据
const IMAGE_URL_MAPPINGS = [
  { id: 245011, productId: 'AGIL-699968-301', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-699968-301.png' },
  { id: 245012, productId: 'AGIL-699968-302', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-699968-302.png' },
  { id: 245013, productId: 'AGIL-699968-902', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-699968-902.png' },
  { id: 245014, productId: 'AGIL-699968-912', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-699968-912.png' },
  { id: 245015, productId: 'AGIL-699968-922', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-699968-922.png' },
  { id: 245016, productId: 'AGIL-699968-932', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-699968-932.png' },
  { id: 245017, productId: 'AGIL-699968-942', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-699968-942.png' },
  { id: 245018, productId: 'AGIL-699968-952', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-699968-952.png' },
  { id: 245019, productId: 'AGIL-699968-962', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-699968-962.png' },
  { id: 245020, productId: 'AGIL-699968-972', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-699968-972.png' },
  { id: 245021, productId: 'AGIL-699968-982', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-699968-982.png' },
  { id: 245022, productId: 'AGIL-820950-901', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820950-901.png' },
  { id: 245023, productId: 'AGIL-820950-902', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820950-902.png' },
  { id: 245024, productId: 'AGIL-820950-922', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820950-922.png' },
  { id: 245025, productId: 'AGIL-820950-932', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820950-932.png' },
  { id: 245026, productId: 'AGIL-820950-942', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820950-942.png' },
  { id: 245027, productId: 'AGIL-820950-952', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820950-952.png' },
  { id: 245028, productId: 'AGIL-820950-962', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820950-962.png' },
  { id: 245029, productId: 'AGIL-820950-972', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820950-972.png' },
  { id: 245030, productId: 'AGIL-820950-982', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820950-982.png' },
  { id: 245031, productId: 'AGIL-820950-992', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820950-992.png' },
  { id: 245032, productId: 'AGIL-820952-901', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820952-901.png' },
  { id: 245033, productId: 'AGIL-820952-902', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820952-902.png' },
  { id: 245034, productId: 'AGIL-820952-922', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820952-922.png' },
  { id: 245035, productId: 'AGIL-820952-932', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820952-932.png' },
  { id: 245036, productId: 'AGIL-820952-942', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820952-942.png' },
  { id: 245037, productId: 'AGIL-820952-952', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820952-952.png' },
  { id: 245038, productId: 'AGIL-820952-962', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820952-962.png' },
  { id: 245039, productId: 'AGIL-820952-972', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820952-972.png' },
  { id: 245040, productId: 'AGIL-820952-982', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820952-982.png' },
  { id: 245041, productId: 'AGIL-820952-992', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820952-992.png' },
  { id: 245042, productId: 'AGIL-820953-901', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820953-901.png' },
  { id: 245043, productId: 'AGIL-820953-902', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820953-902.png' },
  { id: 245044, productId: 'AGIL-820953-922', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820953-922.png' },
  { id: 245045, productId: 'AGIL-820953-932', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820953-932.png' },
  { id: 245046, productId: 'AGIL-820953-942', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820953-942.png' },
  { id: 245047, productId: 'AGIL-820953-952', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820953-952.png' },
  { id: 245048, productId: 'AGIL-820953-962', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820953-962.png' },
  { id: 245049, productId: 'AGIL-820953-972', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820953-972.png' },
  { id: 245050, productId: 'AGIL-820953-982', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820953-982.png' },
  { id: 245051, productId: 'AGIL-820953-992', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820953-992.png' },
  { id: 245052, productId: 'AGIL-820954-901', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820954-901.png' },
  { id: 245053, productId: 'AGIL-820954-902', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820954-902.png' },
  { id: 245054, productId: 'AGIL-820954-922', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820954-922.png' },
  { id: 245055, productId: 'AGIL-820954-932', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820954-932.png' },
  { id: 245056, productId: 'AGIL-820954-942', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820954-942.png' },
  { id: 245057, productId: 'AGIL-820954-952', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-820954-952.png' },
  { productId: 'AGIL-121-1012', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-121-1012.png' },
  { productId: 'AGIL-121-1032', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-121-1032.png' },
  { productId: 'AGIL-121-1034', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-121-1034.png' },
  { productId: 'AGIL-121-1062', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-121-1062.png' },
  { productId: 'AGIL-121-1132', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-121-1132.png' },
  { productId: 'AGIL-121-1134', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-121-1134.png' },
  { productId: 'AGIL-121-1232', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-121-1232.png' },
  { productId: 'AGIL-121-1234', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-121-1234.png' },
  { productId: 'AGIL-121-1262', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-121-1262.png' },
  { productId: 'AGIL-121-1332', imageUrl: 'https://manus-file-upload.s3.us-east-1.amazonaws.com/AGIL-121-1332.png' },
];

async function main() {
  console.log('🚀 开始更新产品图片URL...\n');
  
  const db = getDb();
  
  let successCount = 0;
  let failCount = 0;
  const failedProducts: string[] = [];
  
  for (const mapping of IMAGE_URL_MAPPINGS) {
    try {
      // 优先使用数据库ID更新
      if (mapping.id) {
        const result = await db
          .update(products)
          .set({ imageUrl: mapping.imageUrl })
          .where(eq(products.id, mapping.id));
        
        console.log(`✅ 更新成功 [ID: ${mapping.id}] ${mapping.productId}`);
        successCount++;
      } 
      // 如果没有ID,使用productId更新
      else if (mapping.productId) {
        const result = await db
          .update(products)
          .set({ imageUrl: mapping.imageUrl })
          .where(eq(products.productId, mapping.productId));
        
        console.log(`✅ 更新成功 [ProductID: ${mapping.productId}]`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ 更新失败 [${mapping.productId}]:`, error);
      failCount++;
      failedProducts.push(mapping.productId);
    }
  }
  
  console.log('\n📊 更新完成统计:');
  console.log(`✅ 成功: ${successCount}/${IMAGE_URL_MAPPINGS.length}`);
  console.log(`❌ 失败: ${failCount}/${IMAGE_URL_MAPPINGS.length}`);
  
  if (failedProducts.length > 0) {
    console.log('\n失败的产品ID:');
    failedProducts.forEach(id => console.log(`  - ${id}`));
  }
  
  console.log('\n🎉 图片URL更新完成!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});
