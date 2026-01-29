import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table for HPLC products
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  partNumber: varchar("partNumber", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }),
  particleSize: varchar("particleSize", { length: 50 }),
  poreSize: varchar("poreSize", { length: 50 }),
  length: varchar("length", { length: 50 }),
  innerDiameter: varchar("innerDiameter", { length: 50 }),
  phRange: varchar("phRange", { length: 50 }),
  maxPressure: varchar("maxPressure", { length: 50 }),
  maxTemperature: varchar("maxTemperature", { length: 50 }),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Inquiries table for batch inquiry requests
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  inquiryNumber: varchar("inquiryNumber", { length: 50 }).notNull().unique(),
  userName: varchar("userName", { length: 100 }).notNull(),
  userEmail: varchar("userEmail", { length: 255 }).notNull(),
  userCompany: varchar("userCompany", { length: 255 }),
  userPhone: varchar("userPhone", { length: 50 }),
  userMessage: text("userMessage"),
  status: mysqlEnum("status", ["pending", "processing", "completed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * Inquiry items table for products in each inquiry
 */
export const inquiryItems = mysqlTable("inquiryItems", {
  id: int("id").autoincrement().primaryKey(),
  inquiryId: int("inquiryId").notNull(),
  productId: int("productId").notNull(),
  partNumber: varchar("partNumber", { length: 100 }),
  productName: varchar("productName", { length: 255 }),
  brand: varchar("brand", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InquiryItem = typeof inquiryItems.$inferSelect;
export type InsertInquiryItem = typeof inquiryItems.$inferInsert;