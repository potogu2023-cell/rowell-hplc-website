// Schema definition for crawler_results table
// This matches the actual table structure in rowell_workflow database

import { mysqlTable, int, varchar, text, timestamp, json, index } from "drizzle-orm/mysql-core"

export const products = mysqlTable("crawler_results", {
	id: int().autoincrement().notNull(),
	taskId: varchar({ length: 50 }).notNull(),
	productId: varchar({ length: 255 }),
	partNumber: varchar({ length: 255 }),
	brand: varchar({ length: 100 }),
	rawData: json(),
	productName: text(),  // Note: This will be mapped to 'name' in the API
	description: text(),
	specifications: text(),  // Note: TEXT type, not JSON
	imageUrl: text(),
	dataQuality: varchar({ length: 50 }),
	status: varchar({ length: 50 }).default('pending'),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
	category: varchar({ length: 50 }).default('Other'),
},
(table) => [
	index("idx_productId").on(table.productId),
	index("idx_brand").on(table.brand),
	index("idx_status").on(table.status),
	index("idx_category").on(table.category),
]);

// Type for the products table
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
