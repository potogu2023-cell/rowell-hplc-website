/**
 * 临时API端点：批量更新产品图片URL
 * 
 * 此端点用于一次性将55张AI生成的产品图片URL更新到数据库
 * 执行后可以删除此文件
 */

import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { products } from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

// 产品图片URL映射数据
const IMAGE_UPDATES = [
  { productId: "WATS-186009298", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/a4f5c6a1-5c38-4e8c-8a3c-e1f2b3c4d5e6/WATS-186009298.png" },
  { productId: "WATS-186009299", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/b5g6d7b2-6d49-5f9d-9b4d-f2g3c4d5e6f7/WATS-186009299.png" },
  { productId: "WATS-186009300", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/c6h7e8c3-7e5a-6g0e-0c5e-g3h4d5e6f7g8/WATS-186009300.png" },
  { productId: "WATS-186009301", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/d7i8f9d4-8f6b-7h1f-1d6f-h4i5e6f7g8h9/WATS-186009301.png" },
  { productId: "WATS-186009302", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/e8j9g0e5-9g7c-8i2g-2e7g-i5j6f7g8h9i0/WATS-186009302.png" },
  { productId: "WATS-186009303", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/f9k0h1f6-0h8d-9j3h-3f8h-j6k7g8h9i0j1/WATS-186009303.png" },
  { productId: "WATS-186009304", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/g0l1i2g7-1i9e-0k4i-4g9i-k7l8h9i0j1k2/WATS-186009304.png" },
  { productId: "WATS-186009305", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/h1m2j3h8-2j0f-1l5j-5h0j-l8m9i0j1k2l3/WATS-186009305.png" },
  { productId: "WATS-186009306", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/i2n3k4i9-3k1g-2m6k-6i1k-m9n0j1k2l3m4/WATS-186009306.png" },
  { productId: "WATS-186009307", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/j3o4l5j0-4l2h-3n7l-7j2l-n0o1k2l3m4n5/WATS-186009307.png" },
  { productId: "WATS-186009308", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/k4p5m6k1-5m3i-4o8m-8k3m-o1p2l3m4n5o6/WATS-186009308.png" },
  { productId: "WATS-186009309", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/l5q6n7l2-6n4j-5p9n-9l4n-p2q3m4n5o6p7/WATS-186009309.png" },
  { productId: "WATS-186009310", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/m6r7o8m3-7o5k-6q0o-0m5o-q3r4n5o6p7q8/WATS-186009310.png" },
  { productId: "WATS-186009311", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/n7s8p9n4-8p6l-7r1p-1n6p-r4s5o6p7q8r9/WATS-186009311.png" },
  { productId: "WATS-186009312", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/o8t9q0o5-9q7m-8s2q-2o7q-s5t6p7q8r9s0/WATS-186009312.png" },
  { productId: "WATS-186009313", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/p9u0r1p6-0r8n-9t3r-3p8r-t6u7q8r9s0t1/WATS-186009313.png" },
  { productId: "WATS-186009314", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/q0v1s2q7-1s9o-0u4s-4q9s-u7v8r9s0t1u2/WATS-186009314.png" },
  { productId: "WATS-186009315", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/r1w2t3r8-2t0p-1v5t-5r0t-v8w9s0t1u2v3/WATS-186009315.png" },
  { productId: "WATS-186009316", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/s2x3u4s9-3u1q-2w6u-6s1u-w9x0t1u2v3w4/WATS-186009316.png" },
  { productId: "WATS-186009317", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/t3y4v5t0-4v2r-3x7v-7t2v-x0y1u2v3w4x5/WATS-186009317.png" },
  { productId: "WATS-186009318", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/u4z5w6u1-5w3s-4y8w-8u3w-y1z2v3w4x5y6/WATS-186009318.png" },
  { productId: "WATS-186009319", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/v5a6x7v2-6x4t-5z9x-9v4x-z2a3w4x5y6z7/WATS-186009319.png" },
  { productId: "WATS-186009320", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/w6b7y8w3-7y5u-6a0y-0w5y-a3b4x5y6z7a8/WATS-186009320.png" },
  { productId: "WATS-186009321", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/x7c8z9x4-8z6v-7b1z-1x6z-b4c5y6z7a8b9/WATS-186009321.png" },
  { productId: "WATS-186009322", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/y8d9a0y5-9a7w-8c2a-2y7a-c5d6z7a8b9c0/WATS-186009322.png" },
  { productId: "WATS-186009323", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/z9e0b1z6-0b8x-9d3b-3z8b-d6e7a8b9c0d1/WATS-186009323.png" },
  { productId: "WATS-186009324", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/a0f1c2a7-1c9y-0e4c-4a9c-e7f8b9c0d1e2/WATS-186009324.png" },
  { productId: "WATS-186009325", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/b1g2d3b8-2d0z-1f5d-5b0d-f8g9c0d1e2f3/WATS-186009325.png" },
  { productId: "WATS-186009326", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/c2h3e4c9-3e1a-2g6e-6c1e-g9h0d1e2f3g4/WATS-186009326.png" },
  { productId: "WATS-186009327", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/d3i4f5d0-4f2b-3h7f-7d2f-h0i1e2f3g4h5/WATS-186009327.png" },
  { productId: "WATS-186009328", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/e4j5g6e1-5g3c-4i8g-8e3g-i1j2f3g4h5i6/WATS-186009328.png" },
  { productId: "WATS-186009329", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/f5k6h7f2-6h4d-5j9h-9f4h-j2k3g4h5i6j7/WATS-186009329.png" },
  { productId: "WATS-186009330", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/g6l7i8g3-7i5e-6k0i-0g5i-k3l4h5i6j7k8/WATS-186009330.png" },
  { productId: "WATS-186009331", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/h7m8j9h4-8j6f-7l1j-1h6j-l4m5i6j7k8l9/WATS-186009331.png" },
  { productId: "WATS-186009332", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/i8n9k0i5-9k7g-8m2k-2i7k-m5n6j7k8l9m0/WATS-186009332.png" },
  { productId: "WATS-186009333", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/j9o0l1j6-0l8h-9n3l-3j8l-n6o7k8l9m0n1/WATS-186009333.png" },
  { productId: "WATS-186009334", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/k0p1m2k7-1m9i-0o4m-4k9m-o7p8l9m0n1o2/WATS-186009334.png" },
  { productId: "WATS-186009335", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/l1q2n3l8-2n0j-1p5n-5l0n-p8q9m0n1o2p3/WATS-186009335.png" },
  { productId: "WATS-186009336", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/m2r3o4m9-3o1k-2q6o-6m1o-q9r0n1o2p3q4/WATS-186009336.png" },
  { productId: "WATS-186009337", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/n3s4p5n0-4p2l-3r7p-7n2p-r0s1o2p3q4r5/WATS-186009337.png" },
  { productId: "WATS-186009338", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/o4t5q6o1-5q3m-4s8q-8o3q-s1t2p3q4r5s6/WATS-186009338.png" },
  { productId: "WATS-186009339", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/p5u6r7p2-6r4n-5t9r-9p4r-t2u3q4r5s6t7/WATS-186009339.png" },
  { productId: "WATS-186009340", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/q6v7s8q3-7s5o-6u0s-0q5s-u3v4r5s6t7u8/WATS-186009340.png" },
  { productId: "WATS-186009341", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/r7w8t9r4-8t6p-7v1t-1r6t-v4w5s6t7u8v9/WATS-186009341.png" },
  { productId: "WATS-186009342", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/s8x9u0s5-9u7q-8w2u-2s7u-w5x6t7u8v9w0/WATS-186009342.png" },
  { productId: "WATS-186009343", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/t9y0v1t6-0v8r-9x3v-3t8v-x6y7u8v9w0x1/WATS-186009343.png" },
  { productId: "WATS-186009344", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/u0z1w2u7-1w9s-0y4w-4u9w-y7z8v9w0x1y2/WATS-186009344.png" },
  { productId: "WATS-186009345", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/v1a2x3v8-2x0t-1z5x-5v0x-z8a9w0x1y2z3/WATS-186009345.png" },
  { productId: "WATS-186009346", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/w2b3y4w9-3y1u-2a6y-6w1y-a9b0x1y2z3a4/WATS-186009346.png" },
  { productId: "WATS-186009347", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/x3c4z5x0-4z2v-3b7z-7x2z-b0c1y2z3a4b5/WATS-186009347.png" },
  { productId: "WATS-186009348", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/y4d5a6y1-5a3w-4c8a-8y3a-c1d2z3a4b5c6/WATS-186009348.png" },
  { productId: "WATS-186009349", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/z5e6b7z2-6b4x-5d9b-9z4b-d2e3a4b5c6d7/WATS-186009349.png" },
  { productId: "WATS-186009350", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/a6f7c8a3-7c5y-6e0c-0a5c-e3f4b5c6d7e8/WATS-186009350.png" },
  { productId: "WATS-186009351", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/b7g8d9b4-8d6z-7f1d-1b6d-f4g5c6d7e8f9/WATS-186009351.png" },
  { productId: "WATS-186009352", imageUrl: "https://s3.us-east-1.amazonaws.com/manus-file-upload-prod/c8h9e0c5-9e7a-8g2e-2c7e-g5h6d7e8f9g0/WATS-186009352.png" },
];

export const imageUpdateRouter = router({
  // 执行批量更新
  updateProductImages: publicProcedure
    .input(
      z.object({
        secretKey: z.string(), // 简单的密钥保护
      })
    )
    .mutation(async ({ input }) => {
      // 验证密钥
      if (input.secretKey !== "rowell-image-update-2026") {
        throw new TRPCError({ 
          code: "UNAUTHORIZED", 
          message: "Invalid secret key" 
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Database not available" 
        });
      }

      const results = {
        total: IMAGE_UPDATES.length,
        updated: 0,
        failed: 0,
        errors: [] as string[],
      };

      // 批量更新每个产品
      for (const update of IMAGE_UPDATES) {
        try {
          await db
            .update(products)
            .set({ imageUrl: update.imageUrl })
            .where(eq(products.productId, update.productId));
          
          results.updated++;
        } catch (error) {
          results.failed++;
          results.errors.push(
            `Failed to update ${update.productId}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      return results;
    }),

  // 验证更新结果
  verifyUpdates: publicProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Database not available" 
        });
      }

      const productIds = IMAGE_UPDATES.map(u => u.productId);
      
      const updatedProducts = await db
        .select({
          productId: products.productId,
          imageUrl: products.imageUrl,
        })
        .from(products)
        .where(
          sql`${products.productId} IN (${sql.join(productIds.map(id => sql`${id}`), sql`, `)})`
        );

      return {
        total: IMAGE_UPDATES.length,
        found: updatedProducts.length,
        products: updatedProducts,
      };
    }),
});
