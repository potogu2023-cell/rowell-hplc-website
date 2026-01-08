/**
 * 自动更新产品图片URL脚本
 * 
 * 使用方法:
 * 1. 将图片URL映射数据保存为JSON文件
 * 2. 运行: pnpm tsx scripts/auto-update-product-images.ts <json_file_path>
 * 
 * JSON格式示例:
 * [
 *   {"productId": "245011", "imageUrl": "https://..."},
 *   {"productId": "245012", "imageUrl": "https://..."}
 * ]
 */

import { getDb } from '../server/db';
import { products } from '../shared/db-schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

interface ImageUpdate {
  productId: string;
  imageUrl: string;
}

async function updateProductImages(updates: ImageUpdate[]) {
  const db = getDb();
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('开始批量更新产品图片');
  console.log(`总共需要更新 ${updates.length} 个产品`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  
  let successCount = 0;
  let failCount = 0;
  const errors: Array<{ productId: string; error: string }> = [];
  
  for (let i = 0; i < updates.length; i++) {
    const update = updates[i];
    const progress = `[${i + 1}/${updates.length}]`;
    
    try {
      await db
        .update(products)
        .set({ imageUrl: update.imageUrl })
        .where(eq(products.productId, update.productId));
      
      successCount++;
      console.log(`✓ ${progress} ${update.productId}`);
    } catch (error) {
      failCount++;
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push({ productId: update.productId, error: errorMsg });
      console.error(`✗ ${progress} ${update.productId}: ${errorMsg}`);
    }
  }
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('更新完成!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✓ 成功: ${successCount}`);
  console.log(`✗ 失败: ${failCount}`);
  console.log(`  总计: ${updates.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (errors.length > 0) {
    console.log('');
    console.log('失败的产品:');
    errors.forEach(({ productId, error }) => {
      console.log(`  • ${productId}: ${error}`);
    });
  }
  
  return {
    success: successCount,
    failed: failCount,
    total: updates.length,
    errors
  };
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('错误: 请提供JSON文件路径');
    console.error('');
    console.error('使用方法:');
    console.error('  pnpm tsx scripts/auto-update-product-images.ts <json_file_path>');
    console.error('');
    console.error('JSON格式示例:');
    console.error('  [');
    console.error('    {"productId": "245011", "imageUrl": "https://..."},');
    console.error('    {"productId": "245012", "imageUrl": "https://..."}');
    console.error('  ]');
    process.exit(1);
  }
  
  const jsonFilePath = path.resolve(args[0]);
  
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`错误: 文件不存在: ${jsonFilePath}`);
    process.exit(1);
  }
  
  try {
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const updates: ImageUpdate[] = JSON.parse(fileContent);
    
    if (!Array.isArray(updates)) {
      console.error('错误: JSON文件必须包含一个数组');
      process.exit(1);
    }
    
    if (updates.length === 0) {
      console.error('错误: JSON文件中没有数据');
      process.exit(1);
    }
    
    // 验证数据格式
    for (const update of updates) {
      if (!update.productId || !update.imageUrl) {
        console.error('错误: 每个对象必须包含 productId 和 imageUrl 字段');
        process.exit(1);
      }
    }
    
    const result = await updateProductImages(updates);
    
    // 保存结果到文件
    const resultFilePath = jsonFilePath.replace('.json', '_result.json');
    fs.writeFileSync(resultFilePath, JSON.stringify(result, null, 2));
    console.log('');
    console.log(`结果已保存到: ${resultFilePath}`);
    
    process.exit(result.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('错误:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main().catch(console.error);
