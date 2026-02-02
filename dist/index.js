var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  inquiries: () => inquiries,
  inquiryItems: () => inquiryItems,
  products: () => products,
  resourceCategories: () => resourceCategories,
  resources: () => resources,
  users: () => users
});
import { index, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users, products, inquiries, inquiryItems, resources, resourceCategories;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      /**
       * Surrogate primary key. Auto-incremented numeric value managed by the database.
       * Use this for relations between tables.
       */
      id: int("id").autoincrement().primaryKey(),
      /** Manus OAuth identifier (openId) returned from the OAuth callback. Optional for password-based auth. */
      openId: varchar("openId", { length: 64 }).unique(),
      /** Password hash for email/password authentication. Optional for OAuth users. */
      passwordHash: varchar("passwordHash", { length: 255 }),
      name: text("name"),
      email: varchar("email", { length: 320 }).notNull().unique(),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      // Additional user profile fields
      company: varchar("company", { length: 255 }),
      phone: varchar("phone", { length: 50 }),
      country: varchar("country", { length: 100 }),
      industry: varchar("industry", { length: 100 }),
      purchasingRole: varchar("purchasingRole", { length: 100 }),
      annualPurchaseVolume: varchar("annualPurchaseVolume", { length: 100 }),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    products = mysqlTable("products", {
      id: int("id").autoincrement().primaryKey(),
      productId: varchar("productId", { length: 128 }),
      brand: varchar("brand", { length: 100 }),
      partNumber: varchar("partNumber", { length: 128 }),
      specifications: text("specifications"),
      imageUrl: text("imageUrl"),
      dataQuality: varchar("dataQuality", { length: 50 }),
      status: varchar("status", { length: 50 }).default("pending"),
      createdAt: timestamp("createdAt").defaultNow(),
      category: varchar("category", { length: 50 }).default("Other"),
      prefix: varchar("prefix", { length: 16 }).notNull(),
      name: text("name"),
      detailedDescription: text("detailedDescription"),
      particleSize: varchar("particleSize", { length: 50 }),
      poreSize: varchar("poreSize", { length: 50 }),
      columnLength: varchar("columnLength", { length: 50 }),
      innerDiameter: varchar("innerDiameter", { length: 50 }),
      phRange: varchar("phRange", { length: 50 }),
      maxPressure: varchar("maxPressure", { length: 50 }),
      maxTemperature: varchar("maxTemperature", { length: 50 }),
      usp: varchar("usp", { length: 50 }),
      applications: text("applications"),
      catalogUrl: varchar("catalogUrl", { length: 500 }),
      technicalDocsUrl: text("technicalDocsUrl"),
      phaseType: varchar("phaseType", { length: 100 }),
      particleSizeNum: int("particleSizeNum"),
      poreSizeNum: int("poreSizeNum"),
      columnLengthNum: int("columnLengthNum"),
      innerDiameterNum: int("innerDiameterNum"),
      phMin: int("phMin"),
      phMax: int("phMax"),
      productType: varchar("productType", { length: 100 }),
      descriptionQuality: mysqlEnum("descriptionQuality", ["high", "medium", "low", "extracted", "none"]).default("none"),
      slug: varchar("slug", { length: 128 }),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
    });
    inquiries = mysqlTable("inquiries", {
      id: int("id").autoincrement().primaryKey(),
      inquiryNumber: varchar("inquiryNumber", { length: 50 }).notNull().unique(),
      userName: varchar("userName", { length: 100 }).notNull(),
      userEmail: varchar("userEmail", { length: 255 }).notNull(),
      userCompany: varchar("userCompany", { length: 255 }),
      userPhone: varchar("userPhone", { length: 50 }),
      userMessage: text("userMessage"),
      status: mysqlEnum("status", ["pending", "processing", "completed", "cancelled"]).default("pending").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    inquiryItems = mysqlTable("inquiryItems", {
      id: int("id").autoincrement().primaryKey(),
      inquiryId: int("inquiryId").notNull(),
      productId: int("productId").notNull(),
      partNumber: varchar("partNumber", { length: 100 }),
      productName: varchar("productName", { length: 255 }),
      brand: varchar("brand", { length: 100 }),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    resources = mysqlTable(
      "resources",
      {
        id: int().autoincrement().notNull(),
        title: varchar({ length: 255 }).notNull(),
        slug: varchar({ length: 255 }).notNull(),
        content: text().notNull(),
        excerpt: text(),
        category: varchar({ length: 50 }),
        author: varchar({ length: 100 }),
        publishedAt: timestamp({ mode: "string" }),
        tags: json(),
        status: varchar({ length: 20 }),
        views: int().default(0),
        createdAt: timestamp({ mode: "string" }),
        updatedAt: timestamp({ mode: "string" })
      },
      (table) => [
        index("resources_slug_unique").on(table.slug)
      ]
    );
    resourceCategories = mysqlTable(
      "resourceCategories",
      {
        id: int().autoincrement().notNull(),
        slug: varchar({ length: 255 }).notNull(),
        name: varchar({ length: 255 }).notNull(),
        description: text(),
        parentId: int(),
        displayOrder: int().default(0).notNull(),
        createdAt: timestamp({ mode: "string" }).default("CURRENT_TIMESTAMP").notNull(),
        updatedAt: timestamp({ mode: "string" }).defaultNow().onUpdateNow().notNull()
      },
      (table) => [
        index("resourceCategories_slug_unique").on(table.slug),
        index("idx_resourceCategories_parent").on(table.parentId)
      ]
    );
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  createInquiry: () => createInquiry,
  createInquiryItems: () => createInquiryItems,
  createUser: () => createUser,
  getAllProducts: () => getAllProducts,
  getDb: () => getDb,
  getInquiryByNumber: () => getInquiryByNumber,
  getInquiryItems: () => getInquiryItems,
  getProductById: () => getProductById,
  getProductsByIds: () => getProductsByIds,
  getUserByEmail: () => getUserByEmail,
  getUserByOpenId: () => getUserByOpenId,
  updateUserLastSignIn: () => updateUserLastSignIn,
  upsertUser: () => upsertUser
});
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const dbUrl = new URL(process.env.DATABASE_URL);
      const sslParam = dbUrl.searchParams.get("ssl");
      const poolConnection = mysql.createPool({
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port) || 3306,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1),
        // Remove leading '/'
        ssl: sslParam === "true" ? { rejectUnauthorized: true } : void 0
      });
      _db = drizzle(poolConnection);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getProductById(productId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get product: database not available");
    return void 0;
  }
  const { products: products2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const result = await db.select().from(products2).where(eq(products2.id, productId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getProductsByIds(productIds) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get products: database not available");
    return [];
  }
  const { products: products2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const { inArray: inArray2 } = await import("drizzle-orm");
  return await db.select().from(products2).where(inArray2(products2.id, productIds));
}
async function getAllProducts() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get products: database not available");
    return [];
  }
  const { products: products2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  return await db.select().from(products2);
}
async function createInquiry(data) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const { inquiries: inquiries2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const result = await db.insert(inquiries2).values(data);
  return Number(result[0].insertId);
}
async function createInquiryItems(inquiryId, items) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const { inquiryItems: inquiryItems2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const values = items.map((item) => ({
    inquiryId,
    productId: item.productId,
    partNumber: item.partNumber,
    productName: item.productName,
    brand: item.brand
  }));
  await db.insert(inquiryItems2).values(values);
}
async function getInquiryByNumber(inquiryNumber) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get inquiry: database not available");
    return void 0;
  }
  const { inquiries: inquiries2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const result = await db.select().from(inquiries2).where(eq(inquiries2.inquiryNumber, inquiryNumber)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getInquiryItems(inquiryId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get inquiry items: database not available");
    return [];
  }
  const { inquiryItems: inquiryItems2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  return await db.select().from(inquiryItems2).where(eq(inquiryItems2.inquiryId, inquiryId));
}
async function createUser(data) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.insert(users).values({
    email: data.email,
    passwordHash: data.passwordHash,
    name: data.name,
    company: data.company,
    phone: data.phone,
    country: data.country,
    industry: data.industry,
    purchasingRole: data.purchasingRole,
    annualPurchaseVolume: data.annualPurchaseVolume,
    loginMethod: "password",
    role: "user",
    lastSignedIn: /* @__PURE__ */ new Date()
  });
  return Number(result[0].insertId);
}
async function getUserByEmail(email) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateUserLastSignIn(userId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return;
  }
  await db.update(users).set({ lastSignedIn: /* @__PURE__ */ new Date() }).where(eq(users.id, userId));
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/_core/cookies.ts
var cookies_exports = {};
__export(cookies_exports, {
  getSessionCookieOptions: () => getSessionCookieOptions
});
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}
var init_cookies = __esm({
  "server/_core/cookies.ts"() {
    "use strict";
  }
});

// server/password-utils.ts
var password_utils_exports = {};
__export(password_utils_exports, {
  hashPassword: () => hashPassword,
  verifyPassword: () => verifyPassword
});
import bcrypt from "bcryptjs";
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
var init_password_utils = __esm({
  "server/password-utils.ts"() {
    "use strict";
  }
});

// server/products_list_new.ts
var products_list_new_exports = {};
__export(products_list_new_exports, {
  productsListInput: () => productsListInput,
  productsListQuery: () => productsListQuery
});
import { z as z2 } from "zod";
import { eq as eq3, and, gte, lte, inArray, sql } from "drizzle-orm";
async function productsListQuery(input, db) {
  if (!db) return { products: [], total: 0, page: 1, pageSize: 24, totalPages: 0 };
  const { products: products2, productCategories } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const page = input?.page || 1;
  const pageSize = input?.pageSize || 24;
  const offset = (page - 1) * pageSize;
  const conditions = [];
  if (input?.brand) {
    conditions.push(eq3(products2.brand, input.brand));
  }
  if (input?.particleSizeMin !== void 0) {
    conditions.push(gte(products2.particleSizeNum, input.particleSizeMin));
  }
  if (input?.particleSizeMax !== void 0) {
    conditions.push(lte(products2.particleSizeNum, input.particleSizeMax));
  }
  if (input?.poreSizeMin !== void 0) {
    conditions.push(gte(products2.poreSizeNum, input.poreSizeMin));
  }
  if (input?.poreSizeMax !== void 0) {
    conditions.push(lte(products2.poreSizeNum, input.poreSizeMax));
  }
  if (input?.columnLengthMin !== void 0) {
    conditions.push(gte(products2.columnLengthNum, input.columnLengthMin));
  }
  if (input?.columnLengthMax !== void 0) {
    conditions.push(lte(products2.columnLengthNum, input.columnLengthMax));
  }
  if (input?.innerDiameterMin !== void 0) {
    conditions.push(gte(products2.innerDiameterNum, input.innerDiameterMin));
  }
  if (input?.innerDiameterMax !== void 0) {
    conditions.push(lte(products2.innerDiameterNum, input.innerDiameterMax));
  }
  if (input?.phaseTypes && input.phaseTypes.length > 0) {
    conditions.push(inArray(products2.phaseType, input.phaseTypes));
  }
  if (input?.phMin !== void 0) {
    conditions.push(gte(products2.phMax, input.phMin));
  }
  if (input?.phMax !== void 0) {
    conditions.push(lte(products2.phMin, input.phMax));
  }
  let query;
  let countQuery;
  const whereClause = conditions.length > 0 ? and(...conditions) : void 0;
  if (input?.categoryId) {
    const categoryCondition = eq3(productCategories.categoryId, input.categoryId);
    const finalCondition = whereClause ? and(categoryCondition, whereClause) : categoryCondition;
    query = db.select({ product: products2 }).from(products2).innerJoin(productCategories, eq3(products2.id, productCategories.productId)).where(finalCondition).limit(pageSize).offset(offset);
    countQuery = db.select({ count: sql`count(*)` }).from(products2).innerJoin(productCategories, eq3(products2.id, productCategories.productId)).where(finalCondition);
  } else {
    query = db.select().from(products2).where(whereClause).limit(pageSize).offset(offset);
    countQuery = db.select({ count: sql`count(*)` }).from(products2).where(whereClause);
  }
  const [productResults, countResults] = await Promise.all([
    query,
    countQuery
  ]);
  const productList = input?.categoryId ? productResults.map((r) => r.product) : productResults;
  const total = countResults[0]?.count || 0;
  const totalPages = Math.ceil(total / pageSize);
  return {
    products: productList,
    total,
    page,
    pageSize,
    totalPages
  };
}
var productsListInput;
var init_products_list_new = __esm({
  "server/products_list_new.ts"() {
    "use strict";
    productsListInput = z2.object({
      categoryId: z2.number().optional(),
      brand: z2.string().optional(),
      // Advanced filters
      particleSizeMin: z2.number().optional(),
      particleSizeMax: z2.number().optional(),
      poreSizeMin: z2.number().optional(),
      poreSizeMax: z2.number().optional(),
      columnLengthMin: z2.number().optional(),
      columnLengthMax: z2.number().optional(),
      innerDiameterMin: z2.number().optional(),
      innerDiameterMax: z2.number().optional(),
      phaseTypes: z2.array(z2.string()).optional(),
      phMin: z2.number().optional(),
      phMax: z2.number().optional(),
      page: z2.number().min(1).default(1),
      pageSize: z2.number().min(1).max(100).default(24)
    }).optional();
  }
});

// server/inquiryUtils.ts
var inquiryUtils_exports = {};
__export(inquiryUtils_exports, {
  generateInquiryNumber: () => generateInquiryNumber,
  validateInquiryNumber: () => validateInquiryNumber
});
function generateInquiryNumber() {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 900) + 100;
  return `INQ-${year}${month}${day}-${random}`;
}
function validateInquiryNumber(inquiryNumber) {
  const pattern = /^INQ-\d{8}-\d{3}$/;
  return pattern.test(inquiryNumber);
}
var init_inquiryUtils = __esm({
  "server/inquiryUtils.ts"() {
    "use strict";
  }
});

// server/emailService.ts
var emailService_exports = {};
__export(emailService_exports, {
  sendInquiryEmail: () => sendInquiryEmail,
  verifySMTPConnection: () => verifySMTPConnection
});
import nodemailer from "nodemailer";
function getSMTPConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  if (!host || !port || !user || !pass || !from) {
    console.warn("[Email Service] SMTP not configured. Email sending is disabled.");
    console.warn("[Email Service] Required environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM");
    return null;
  }
  return {
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465,
    // true for 465, false for other ports
    auth: {
      user,
      pass
    },
    from
  };
}
function getTransporter() {
  if (transporter) {
    return transporter;
  }
  const config = getSMTPConfig();
  if (!config) {
    return null;
  }
  try {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth
    });
    console.log("[Email Service] SMTP transporter created successfully");
    return transporter;
  } catch (error) {
    console.error("[Email Service] Failed to create SMTP transporter:", error);
    return null;
  }
}
function generateInquiryEmailHTML(data) {
  const productRows = data.products.map((p, index2) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${index2 + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${p.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${p.partNumber}</td>
      </tr>
    `).join("");
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\u8BE2\u4EF7\u786E\u8BA4</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Rowell HPLC \u4EA7\u54C1\u4E2D\u5FC3</h1>
    <p style="margin: 10px 0 0 0; font-size: 14px;">\u4E13\u4E1A\u7684 HPLC \u8272\u8C31\u67F1\u4F9B\u5E94\u5546</p>
  </div>
  
  <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #2563eb; margin-top: 0;">\u8BE2\u4EF7\u786E\u8BA4</h2>
    
    <p>\u5C0A\u656C\u7684 <strong>${data.userName}</strong>\uFF0C</p>
    
    <p>\u611F\u8C22\u60A8\u5BF9 Rowell HPLC \u7684\u5173\u6CE8\uFF01\u60A8\u7684\u8BE2\u4EF7\u5DF2\u6210\u529F\u63D0\u4EA4\uFF0C\u6211\u4EEC\u5C06\u5C3D\u5FEB\u4E0E\u60A8\u8054\u7CFB\u3002</p>
    
    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb;">
      <p style="margin: 5px 0;"><strong>\u8BE2\u4EF7\u5355\u53F7:</strong> ${data.inquiryNumber}</p>
      <p style="margin: 5px 0;"><strong>\u63D0\u4EA4\u65F6\u95F4:</strong> ${data.createdAt.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</p>
      ${data.userCompany ? `<p style="margin: 5px 0;"><strong>\u516C\u53F8:</strong> ${data.userCompany}</p>` : ""}
      ${data.userPhone ? `<p style="margin: 5px 0;"><strong>\u7535\u8BDD:</strong> ${data.userPhone}</p>` : ""}
    </div>
    
    <h3 style="color: #2563eb; margin-top: 20px;">\u8BE2\u4EF7\u4EA7\u54C1</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 10px 0; background-color: white;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left; width: 50px;">#</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">\u4EA7\u54C1\u540D\u79F0</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">\u8D27\u53F7</th>
        </tr>
      </thead>
      <tbody>
        ${productRows}
      </tbody>
    </table>
    
    ${data.userMessage ? `
    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h3 style="color: #2563eb; margin-top: 0;">\u60A8\u7684\u7559\u8A00</h3>
      <p style="margin: 0; white-space: pre-wrap;">${data.userMessage}</p>
    </div>
    ` : ""}
    
    <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0;"><strong>\u23F0 \u54CD\u5E94\u65F6\u95F4:</strong> \u6211\u4EEC\u7684\u9500\u552E\u56E2\u961F\u5C06\u5728 1-2 \u4E2A\u5DE5\u4F5C\u65E5\u5185\u4E0E\u60A8\u8054\u7CFB\u3002</p>
    </div>
    
    <h3 style="color: #2563eb; margin-top: 20px;">\u8054\u7CFB\u6211\u4EEC</h3>
    <p style="margin: 5px 0;">\u{1F4E7} \u90AE\u7BB1: <a href="mailto:sales@rowellhplc.com" style="color: #2563eb;">sales@rowellhplc.com</a></p>
    <p style="margin: 5px 0;">\u{1F4DE} \u7535\u8BDD: +86 XXX-XXXX-XXXX</p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
    
    <p style="color: #6b7280; font-size: 12px; margin: 0;">
      \u6B64\u90AE\u4EF6\u7531\u7CFB\u7EDF\u81EA\u52A8\u53D1\u9001\uFF0C\u8BF7\u52FF\u76F4\u63A5\u56DE\u590D\u3002\u5982\u6709\u95EE\u9898\uFF0C\u8BF7\u901A\u8FC7\u4E0A\u8FF0\u8054\u7CFB\u65B9\u5F0F\u4E0E\u6211\u4EEC\u8054\u7CFB\u3002
    </p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
    <p style="margin: 5px 0;">\xA9 2026 Rowell HPLC \u4EA7\u54C1\u4E2D\u5FC3. All rights reserved.</p>
    <p style="margin: 5px 0;">\u4E13\u4E1A\u7684 HPLC \u8272\u8C31\u67F1\u4F9B\u5E94\u5546\uFF0C\u63D0\u4F9B\u9AD8\u8D28\u91CF\u7684\u5206\u6790\u89E3\u51B3\u65B9\u6848</p>
  </div>
</body>
</html>
  `.trim();
}
function generateInquiryEmailText(data) {
  const productList = data.products.map((p, index2) => `${index2 + 1}. ${p.name} (\u8D27\u53F7: ${p.partNumber})`).join("\n");
  return `
\u5C0A\u656C\u7684 ${data.userName}\uFF0C

\u611F\u8C22\u60A8\u5BF9 Rowell HPLC \u7684\u5173\u6CE8\uFF01

\u60A8\u7684\u8BE2\u4EF7\u5DF2\u6210\u529F\u63D0\u4EA4\uFF0C\u6211\u4EEC\u5C06\u5C3D\u5FEB\u4E0E\u60A8\u8054\u7CFB\u3002

\u8BE2\u4EF7\u5355\u53F7: ${data.inquiryNumber}
\u63D0\u4EA4\u65F6\u95F4: ${data.createdAt.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}
${data.userCompany ? `\u516C\u53F8: ${data.userCompany}
` : ""}${data.userPhone ? `\u7535\u8BDD: ${data.userPhone}
` : ""}
\u8BE2\u4EF7\u4EA7\u54C1:
${productList}

${data.userMessage ? `\u60A8\u7684\u7559\u8A00:
${data.userMessage}

` : ""}\u6211\u4EEC\u7684\u9500\u552E\u56E2\u961F\u5C06\u5728 1-2 \u4E2A\u5DE5\u4F5C\u65E5\u5185\u4E0E\u60A8\u8054\u7CFB\u3002

\u5982\u6709\u4EFB\u4F55\u95EE\u9898\uFF0C\u8BF7\u968F\u65F6\u8054\u7CFB\u6211\u4EEC\uFF1A
\u90AE\u7BB1: sales@rowellhplc.com
\u7535\u8BDD: +86 XXX-XXXX-XXXX

\u795D\u597D\uFF01
Rowell HPLC \u56E2\u961F

---
\u6B64\u90AE\u4EF6\u7531\u7CFB\u7EDF\u81EA\u52A8\u53D1\u9001\uFF0C\u8BF7\u52FF\u76F4\u63A5\u56DE\u590D\u3002
\xA9 2026 Rowell HPLC \u4EA7\u54C1\u4E2D\u5FC3. All rights reserved.
  `.trim();
}
async function sendInquiryEmail(data) {
  try {
    const transporter2 = getTransporter();
    if (!transporter2) {
      console.log("[Email Service] SMTP not configured. Email content logged below:");
      console.log("To:", data.userEmail);
      console.log("Subject:", `\u60A8\u7684\u8BE2\u4EF7\u5DF2\u63D0\u4EA4 - \u8BE2\u4EF7\u5355\u53F7: ${data.inquiryNumber}`);
      console.log("Content (Text):", generateInquiryEmailText(data));
      console.log("[Email Service] To enable real email sending, configure SMTP environment variables.");
      return true;
    }
    const config = getSMTPConfig();
    if (!config) {
      return false;
    }
    const info = await transporter2.sendMail({
      from: `"Rowell HPLC \u4EA7\u54C1\u4E2D\u5FC3" <${config.from}>`,
      to: data.userEmail,
      subject: `\u60A8\u7684\u8BE2\u4EF7\u5DF2\u63D0\u4EA4 - \u8BE2\u4EF7\u5355\u53F7: ${data.inquiryNumber}`,
      text: generateInquiryEmailText(data),
      html: generateInquiryEmailHTML(data)
    });
    console.log("[Email Service] Email sent successfully:", info.messageId);
    console.log("[Email Service] Preview URL:", nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send inquiry email:", error);
    return false;
  }
}
async function verifySMTPConnection() {
  try {
    const transporter2 = getTransporter();
    if (!transporter2) {
      console.warn("[Email Service] SMTP not configured. Cannot verify connection.");
      return false;
    }
    await transporter2.verify();
    console.log("[Email Service] SMTP connection verified successfully");
    return true;
  } catch (error) {
    console.error("[Email Service] SMTP connection verification failed:", error);
    return false;
  }
}
var transporter;
var init_emailService = __esm({
  "server/emailService.ts"() {
    "use strict";
    transporter = null;
  }
});

// server/migrate-db.ts
var migrate_db_exports = {};
__export(migrate_db_exports, {
  migrateDatabase: () => migrateDatabase
});
async function migrateDatabase() {
  const db = await getDb();
  if (!db) {
    console.warn("[Migration] Database not available, skipping migration");
    return;
  }
  try {
    console.log("[Migration] Starting database migration...");
    const checkColumnQuery = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'passwordHash'
    `;
    const result = await db.execute(checkColumnQuery);
    if (Array.isArray(result) && result.length > 0) {
      console.log("[Migration] passwordHash column already exists, skipping migration");
      return;
    }
    console.log("[Migration] Adding password authentication support...");
    await db.execute("ALTER TABLE users MODIFY COLUMN openId VARCHAR(64) NULL");
    console.log("[Migration] \u2713 Modified openId to be nullable");
    await db.execute("ALTER TABLE users ADD COLUMN passwordHash VARCHAR(255) NULL");
    console.log("[Migration] \u2713 Added passwordHash column");
    try {
      await db.execute("ALTER TABLE users MODIFY COLUMN email VARCHAR(320) NOT NULL");
      console.log("[Migration] \u2713 Modified email to be NOT NULL");
    } catch (error) {
      console.log("[Migration] Email column already NOT NULL");
    }
    try {
      await db.execute("CREATE UNIQUE INDEX idx_users_email ON users(email)");
      console.log("[Migration] \u2713 Added unique index on email");
    } catch (error) {
      console.log("[Migration] Email index already exists");
    }
    const newColumns = [
      { name: "company", type: "VARCHAR(255)" },
      { name: "phone", type: "VARCHAR(50)" },
      { name: "country", type: "VARCHAR(100)" },
      { name: "industry", type: "VARCHAR(100)" },
      { name: "purchasingRole", type: "VARCHAR(100)" },
      { name: "annualPurchaseVolume", type: "VARCHAR(100)" }
    ];
    for (const column of newColumns) {
      try {
        await db.execute(`ALTER TABLE users ADD COLUMN ${column.name} ${column.type} NULL`);
        console.log(`[Migration] \u2713 Added ${column.name} column`);
      } catch (error) {
        console.log(`[Migration] ${column.name} column already exists`);
      }
    }
    console.log("[Migration] \u2705 Database migration completed successfully!");
  } catch (error) {
    console.error("[Migration] \u274C Migration failed:", error);
  }
}
var init_migrate_db = __esm({
  "server/migrate-db.ts"() {
    "use strict";
    init_db();
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();
init_cookies();

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/imageSync.ts
init_db();
import { eq as eq2 } from "drizzle-orm";
function registerImageSyncRoutes(app) {
  app.post("/api/admin/imageSync", async (req, res) => {
    try {
      const startTime = Date.now();
      let csvText = "";
      if (req.is("text/csv") || req.is("text/plain")) {
        csvText = req.body;
      } else if (typeof req.body === "string") {
        csvText = req.body;
      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid content type. Please send CSV data with Content-Type: text/csv"
        });
      }
      const lines = csvText.trim().split("\n");
      if (lines.length < 2) {
        return res.status(400).json({
          success: false,
          error: "CSV file must contain header and at least one data row"
        });
      }
      const header = lines[0].trim().toLowerCase();
      if (!header.includes("partnumber") || !header.includes("imageurl")) {
        return res.status(400).json({
          success: false,
          error: 'CSV header must contain "partNumber" and "imageUrl" columns'
        });
      }
      const updates = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(",");
        if (parts.length >= 2) {
          updates.push({
            partNumber: parts[0].trim(),
            imageUrl: parts[1].trim()
          });
        }
      }
      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No valid data rows found in CSV"
        });
      }
      const { products: products2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const db = await getDb();
      if (!db) {
        return res.status(500).json({
          success: false,
          error: "Database not available"
        });
      }
      let successCount = 0;
      let failedCount = 0;
      const failedProducts = [];
      for (const item of updates) {
        try {
          const existingProduct = await db.select({ id: products2.id, productId: products2.productId }).from(products2).where(eq2(products2.partNumber, item.partNumber)).limit(1);
          if (existingProduct.length > 0) {
            await db.update(products2).set({
              imageUrl: item.imageUrl,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq2(products2.partNumber, item.partNumber));
            successCount++;
          } else {
            failedCount++;
            failedProducts.push({
              partNumber: item.partNumber,
              reason: "Product not found"
            });
          }
        } catch (error) {
          failedCount++;
          failedProducts.push({
            partNumber: item.partNumber,
            reason: error.message
          });
        }
      }
      const duration = Date.now() - startTime;
      return res.json({
        success: true,
        summary: {
          totalRows: updates.length,
          successCount,
          failedCount,
          duration: `${(duration / 1e3).toFixed(2)}s`
        },
        failedProducts: failedProducts.length > 0 ? failedProducts : void 0
      });
    } catch (error) {
      console.error("ImageSync API error:", error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  app.get("/api/admin/imageSync/status", async (req, res) => {
    try {
      const { products: products2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const db = await getDb();
      if (!db) {
        return res.status(500).json({
          success: false,
          error: "Database not available"
        });
      }
      const productsWithImages = await db.select().from(products2).where(eq2(products2.imageUrl, ""));
      const totalProducts = await db.select().from(products2);
      const withImages = totalProducts.length - productsWithImages.length;
      return res.json({
        success: true,
        stats: {
          totalProducts: totalProducts.length,
          withImages,
          withoutImages: productsWithImages.length,
          coverageRate: (withImages / totalProducts.length * 100).toFixed(1) + "%"
        }
      });
    } catch (error) {
      console.error("ImageSync status API error:", error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
}

// server/routers.ts
init_cookies();
import { z as z3 } from "zod";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    }),
    register: publicProcedure.input((raw) => {
      return z3.object({
        email: z3.string().email("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u90AE\u7BB1\u5730\u5740"),
        password: z3.string().min(6, "\u5BC6\u7801\u81F3\u5C116\u4E2A\u5B57\u7B26"),
        name: z3.string().min(2, "\u59D3\u540D\u81F3\u5C112\u4E2A\u5B57\u7B26"),
        company: z3.string().optional(),
        phone: z3.string().optional(),
        country: z3.string().optional(),
        industry: z3.string().optional(),
        purchasingRole: z3.string().optional(),
        annualPurchaseVolume: z3.string().optional()
      }).parse(raw);
    }).mutation(async ({ input }) => {
      const { getUserByEmail: getUserByEmail2, createUser: createUser2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_password_utils(), password_utils_exports));
      const existingUser = await getUserByEmail2(input.email);
      if (existingUser) {
        throw new Error("\u8BE5\u90AE\u7BB1\u5DF2\u88AB\u6CE8\u518C");
      }
      const passwordHash = await hashPassword2(input.password);
      const userId = await createUser2({
        email: input.email,
        passwordHash,
        name: input.name,
        company: input.company,
        phone: input.phone,
        country: input.country,
        industry: input.industry,
        purchasingRole: input.purchasingRole,
        annualPurchaseVolume: input.annualPurchaseVolume
      });
      return {
        success: true,
        message: "\u6CE8\u518C\u6210\u529F\uFF01\u8BF7\u767B\u5F55"
      };
    }),
    login: publicProcedure.input((raw) => {
      return z3.object({
        email: z3.string().email("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u90AE\u7BB1\u5730\u5740"),
        password: z3.string().min(1, "\u8BF7\u8F93\u5165\u5BC6\u7801")
      }).parse(raw);
    }).mutation(async ({ input, ctx }) => {
      const { getUserByEmail: getUserByEmail2, updateUserLastSignIn: updateUserLastSignIn2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { verifyPassword: verifyPassword2 } = await Promise.resolve().then(() => (init_password_utils(), password_utils_exports));
      const { setSessionCookie } = await Promise.resolve().then(() => (init_cookies(), cookies_exports));
      const user = await getUserByEmail2(input.email);
      if (!user || !user.passwordHash) {
        throw new Error("\u90AE\u7BB1\u6216\u5BC6\u7801\u9519\u8BEF");
      }
      const isValid = await verifyPassword2(input.password, user.passwordHash);
      if (!isValid) {
        throw new Error("\u90AE\u7BB1\u6216\u5BC6\u7801\u9519\u8BEF");
      }
      await updateUserLastSignIn2(user.id);
      setSessionCookie(ctx.req, ctx.res, {
        userId: user.id,
        openId: user.openId || void 0,
        email: user.email || void 0,
        name: user.name || void 0
      });
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    })
  }),
  // Product routes
  products: router({
    list: publicProcedure.input((raw) => {
      const { productsListInput: productsListInput2 } = (init_products_list_new(), __toCommonJS(products_list_new_exports));
      return productsListInput2.parse(raw);
    }).query(async ({ input }) => {
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { productsListQuery: productsListQuery2 } = await Promise.resolve().then(() => (init_products_list_new(), products_list_new_exports));
      const db = await getDb2();
      return await productsListQuery2(input, db);
    }),
    getByIds: publicProcedure.input((raw) => {
      return z3.object({
        productIds: z3.array(z3.number())
      }).parse(raw);
    }).query(async ({ input }) => {
      const { getProductsByIds: getProductsByIds2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await getProductsByIds2(input.productIds);
    }),
    getBrandStats: publicProcedure.input((raw) => {
      return z3.object({
        categoryId: z3.number().optional()
      }).optional().parse(raw);
    }).query(async ({ input }) => {
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const db = await getDb2();
      if (!db) return {};
      const { products: products2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eq7, sql: sql2 } = await import("drizzle-orm");
      let query = db.select({
        brand: products2.brand,
        count: sql2`count(*)`
      }).from(products2).where(eq7(products2.status, "active"));
      if (input?.categoryId) {
        const { categories } = await Promise.resolve().then(() => (init_schema(), schema_exports));
        query = query.where(eq7(products2.categoryId, input.categoryId));
      }
      const results = await query.groupBy(products2.brand);
      const brandStats = {};
      results.forEach((row) => {
        if (row.brand) {
          brandStats[row.brand] = Number(row.count);
        }
      });
      return brandStats;
    })
  }),
  // Category routes
  category: router({
    getAll: publicProcedure.query(async () => {
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const db = await getDb2();
      if (!db) return [];
      const { products: products2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { sql: sql2, eq: eq7 } = await import("drizzle-orm");
      const results = await db.select({
        name: products2.category,
        count: sql2`count(*)`
      }).from(products2).where(eq7(products2.status, "active")).groupBy(products2.category);
      return results.map((row, index2) => ({
        id: index2 + 1,
        name: row.name || "Other",
        slug: (row.name || "other").toLowerCase().replace(/\s+/g, "-"),
        count: Number(row.count)
      }));
    })
  }),
  // Cart routes (simplified for non-authenticated users)
  cart: router({
    add: publicProcedure.input((raw) => {
      return z3.object({
        productId: z3.number(),
        quantity: z3.number().min(1).default(1)
      }).parse(raw);
    }).mutation(async ({ input }) => {
      return {
        success: true,
        message: "Product added to inquiry list"
      };
    })
  }),
  // Resources routes
  resources: router({
    list: publicProcedure.input((raw) => {
      return z3.object({
        page: z3.number().min(1).optional(),
        pageSize: z3.number().min(1).max(100).optional(),
        search: z3.string().optional(),
        category: z3.string().optional()
      }).optional().parse(raw);
    }).query(async ({ input }) => {
      const page = input?.page || 1;
      const pageSize = input?.pageSize || 12;
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const db = await getDb2();
      if (!db) {
        return { items: [], total: 0, page, pageSize };
      }
      const { resources: resources2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eq7, like, and: and2, desc } = await import("drizzle-orm");
      const conditions = [];
      if (input?.search) {
        conditions.push(
          like(resources2.title, `%${input.search}%`)
        );
      }
      if (input?.category) {
        conditions.push(eq7(resources2.category, input.category));
      }
      const whereClause = conditions.length > 0 ? and2(...conditions) : void 0;
      const allResources = await db.select().from(resources2).where(whereClause);
      const total = allResources.length;
      const offset = (page - 1) * pageSize;
      const results = await db.select().from(resources2).where(whereClause).orderBy(desc(resources2.publishedAt)).limit(pageSize).offset(offset);
      return {
        items: results,
        total,
        page,
        pageSize
      };
    }),
    getBySlug: publicProcedure.input((raw) => {
      return z3.object({
        slug: z3.string()
      }).parse(raw);
    }).query(async ({ input }) => {
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const db = await getDb2();
      if (!db) {
        return null;
      }
      const { resources: resources2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eq7 } = await import("drizzle-orm");
      const results = await db.select().from(resources2).where(eq7(resources2.slug, input.slug)).limit(1);
      return results.length > 0 ? results[0] : null;
    }),
    listCategories: publicProcedure.query(async () => {
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const db = await getDb2();
      if (!db) {
        return [];
      }
      const { resources: resources2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { sql: sql2 } = await import("drizzle-orm");
      const results = await db.select({ category: resources2.category }).from(resources2).groupBy(resources2.category);
      return results.map((r) => r.category).filter(Boolean);
    })
  }),
  // Inquiry routes
  inquiries: router({
    create: publicProcedure.input((raw) => {
      return z3.object({
        productIds: z3.array(z3.number()).min(1, "\u8BF7\u9009\u62E9\u81F3\u5C11\u4E00\u4E2A\u4EA7\u54C1"),
        userInfo: z3.object({
          name: z3.string().min(2, "\u59D3\u540D\u81F3\u5C11 2 \u4E2A\u5B57\u7B26").max(50, "\u59D3\u540D\u6700\u591A 50 \u4E2A\u5B57\u7B26"),
          email: z3.string().email("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u90AE\u7BB1\u5730\u5740"),
          company: z3.string().optional(),
          phone: z3.string().optional(),
          message: z3.string().max(500, "\u7559\u8A00\u6700\u591A 500 \u4E2A\u5B57\u7B26").optional()
        })
      }).parse(raw);
    }).mutation(async ({ input }) => {
      const { createInquiry: createInquiry2, createInquiryItems: createInquiryItems2, getProductsByIds: getProductsByIds2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { generateInquiryNumber: generateInquiryNumber2 } = await Promise.resolve().then(() => (init_inquiryUtils(), inquiryUtils_exports));
      const { sendInquiryEmail: sendInquiryEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
      const inquiryNumber = generateInquiryNumber2();
      const products2 = await getProductsByIds2(input.productIds);
      if (products2.length === 0) {
        throw new Error("\u672A\u627E\u5230\u4EA7\u54C1\u4FE1\u606F");
      }
      const inquiryId = await createInquiry2({
        inquiryNumber,
        userName: input.userInfo.name,
        userEmail: input.userInfo.email,
        userCompany: input.userInfo.company,
        userPhone: input.userInfo.phone,
        userMessage: input.userInfo.message
      });
      const items = products2.map((p) => ({
        productId: p.id,
        partNumber: p.partNumber,
        productName: p.name,
        brand: p.brand
      }));
      await createInquiryItems2(inquiryId, items);
      const emailSent = await sendInquiryEmail2({
        inquiryNumber,
        userName: input.userInfo.name,
        userEmail: input.userInfo.email,
        userMessage: input.userInfo.message,
        products: products2.map((p) => ({
          name: p.name,
          partNumber: p.partNumber
        })),
        createdAt: /* @__PURE__ */ new Date()
      });
      return {
        success: true,
        inquiryNumber,
        message: emailSent ? "\u8BE2\u4EF7\u5DF2\u63D0\u4EA4\uFF0C\u786E\u8BA4\u90AE\u4EF6\u5DF2\u53D1\u9001\u81F3\u60A8\u7684\u90AE\u7BB1" : "\u8BE2\u4EF7\u5DF2\u63D0\u4EA4\uFF0C\u4F46\u90AE\u4EF6\u53D1\u9001\u5931\u8D25\uFF0C\u8BF7\u8BB0\u5F55\u60A8\u7684\u8BE2\u4EF7\u5355\u53F7"
      };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
var plugins = [react()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
init_db();
init_schema();
init_env();
import { eq as eq4 } from "drizzle-orm";
function extractSlugFromPath(path3) {
  const match = path3.match(/^\/resources\/([^\/\?]+)/);
  return match ? match[1] : null;
}
function escapeHtml(text2) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text2.replace(/[&<>"']/g, (m) => map[m]);
}
async function injectSeoMetaTags(template, req) {
  console.log(`[SEO] Processing request: ${req.path}`);
  const slug = extractSlugFromPath(req.path);
  console.log(`[SEO] Extracted slug: ${slug}`);
  if (!slug) {
    console.log(`[SEO] No slug found, skipping injection`);
    return template;
  }
  try {
    const db = await getDb();
    if (!db) {
      return template;
    }
    const articles = await db.select().from(resources).where(eq4(resources.slug, slug)).limit(1);
    if (articles.length === 0 || articles[0].status !== "published") {
      return template;
    }
    const article = articles[0];
    const protocol = req.protocol || "https";
    const host = req.get("host") || "rowellhplc.com";
    const fullUrl = `${protocol}://${host}${req.originalUrl}`;
    const title = article.title || ENV.appTitle;
    const description = article.metaDescription || article.excerpt || "";
    const image = article.coverImage || ENV.appLogo;
    const metaTags = `
    <title>${escapeHtml(title)} | ${ENV.appTitle}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${image}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${fullUrl}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${image}" />
    
    <!-- Article metadata -->
    <meta property="article:published_time" content="${article.publishedAt?.toISOString() || ""}" />
    <meta property="article:author" content="${article.authorName || "ROWELL Team"}" />`;
    template = template.replace(/<title>.*?<\/title>/i, "");
    template = template.replace(
      /(<head[^>]*>)/i,
      `$1${metaTags}`
    );
    console.log(`[SEO] Injected meta tags for: ${article.title}`);
    return template;
  } catch (error) {
    console.error("[SEO] Error injecting meta tags:", error);
    return template;
  }
}
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      template = await injectSeoMetaTags(template, req);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/sitemap.ts
init_db();
init_schema();
init_env();
import { eq as eq5 } from "drizzle-orm";
var BASE_URL = ENV.viteAppTitle?.includes("ROWELL") ? "https://www.rowellhplc.com" : "https://rowell-website-test.manus.space";
var STATIC_PAGES = [
  { path: "/", priority: 1, changefreq: "daily" },
  { path: "/products", priority: 0.9, changefreq: "weekly" },
  { path: "/about", priority: 0.8, changefreq: "monthly" },
  { path: "/resources", priority: 0.9, changefreq: "daily" },
  { path: "/usp-standards", priority: 0.7, changefreq: "monthly" },
  { path: "/applications", priority: 0.7, changefreq: "monthly" },
  { path: "/contact", priority: 0.6, changefreq: "monthly" }
];
function formatDate(date) {
  return date.toISOString().split("T")[0];
}
async function generateSitemap(req, res) {
  try {
    const db = await getDb();
    if (!db) {
      console.error("[Sitemap] Database not available");
      return res.status(500).send("Database not available");
    }
    const articles = await db.select({
      slug: resources.slug,
      updatedAt: resources.updatedAt
    }).from(resources).where(eq5(resources.status, "published"));
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for (const page of STATIC_PAGES) {
      xml += "  <url>\n";
      xml += `    <loc>${BASE_URL}${page.path}</loc>
`;
      xml += `    <lastmod>${formatDate(/* @__PURE__ */ new Date())}</lastmod>
`;
      xml += `    <changefreq>${page.changefreq}</changefreq>
`;
      xml += `    <priority>${page.priority}</priority>
`;
      xml += "  </url>\n";
    }
    for (const article of articles) {
      xml += "  <url>\n";
      xml += `    <loc>${BASE_URL}/resources/${article.slug}</loc>
`;
      xml += `    <lastmod>${formatDate(article.updatedAt)}</lastmod>
`;
      xml += `    <changefreq>monthly</changefreq>
`;
      xml += `    <priority>0.8</priority>
`;
      xml += "  </url>\n";
    }
    xml += "</urlset>";
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
    console.log(`[Sitemap] Generated sitemap with ${STATIC_PAGES.length} static pages and ${articles.length} articles`);
  } catch (error) {
    console.error("[Sitemap] Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
}

// server/seo-meta-injection.ts
init_db();
init_schema();
init_env();
import { eq as eq6 } from "drizzle-orm";
function extractSlugFromPath2(path3) {
  const match = path3.match(/^\/resources\/([^\/\?]+)/);
  return match ? match[1] : null;
}
function generateMetaTags(article, fullUrl) {
  const title = article.title || ENV.appTitle;
  const description = article.metaDescription || article.excerpt || "";
  const image = article.coverImage || ENV.appLogo;
  return `
    <title>${title} | ${ENV.appTitle}</title>
    <meta name="description" content="${escapeHtml2(description)}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:title" content="${escapeHtml2(title)}" />
    <meta property="og:description" content="${escapeHtml2(description)}" />
    <meta property="og:image" content="${image}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${fullUrl}" />
    <meta name="twitter:title" content="${escapeHtml2(title)}" />
    <meta name="twitter:description" content="${escapeHtml2(description)}" />
    <meta name="twitter:image" content="${image}" />
    
    <!-- Article metadata -->
    <meta property="article:published_time" content="${article.publishedAt?.toISOString() || ""}" />
    <meta property="article:author" content="${article.authorName || "ROWELL Team"}" />
  `.trim();
}
function escapeHtml2(text2) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text2.replace(/[&<>"']/g, (m) => map[m]);
}
async function seoMetaInjectionMiddleware(req, res, next) {
  if (req.method !== "GET") {
    return next();
  }
  const slug = extractSlugFromPath2(req.path);
  if (!slug) {
    return next();
  }
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[SEO] Database not available, skipping meta injection");
      return next();
    }
    const articles = await db.select().from(resources).where(eq6(resources.slug, slug)).limit(1);
    if (articles.length === 0) {
      return next();
    }
    const article = articles[0];
    if (article.status !== "published") {
      return next();
    }
    const originalSend = res.send.bind(res);
    res.send = function(data) {
      const contentType = res.getHeader("Content-Type");
      if (typeof contentType === "string" && contentType.includes("text/html") && typeof data === "string") {
        const protocol = req.protocol;
        const host = req.get("host");
        const fullUrl = `${protocol}://${host}${req.originalUrl}`;
        const metaTags = generateMetaTags(article, fullUrl);
        data = data.replace(
          /<title>.*?<\/title>/,
          ""
        );
        data = data.replace(
          /(<meta charset="UTF-8" \/>)/,
          `$1
    ${metaTags}`
        );
        console.log(`[SEO] Injected meta tags for article: ${article.title}`);
      }
      return originalSend(data);
    };
    next();
  } catch (error) {
    console.error("[SEO] Error in meta injection middleware:", error);
    next();
  }
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  try {
    const { migrateDatabase: migrateDatabase2 } = await Promise.resolve().then(() => (init_migrate_db(), migrate_db_exports));
    await migrateDatabase2();
  } catch (error) {
    console.error("[Server] Failed to run database migration:", error);
  }
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  app.use(bodyParser.text({ type: "text/csv", limit: "50mb" }));
  app.use(bodyParser.text({ type: "text/plain", limit: "50mb" }));
  app.use(seoMetaInjectionMiddleware);
  registerOAuthRoutes(app);
  registerImageSyncRoutes(app);
  app.get("/sitemap.xml", generateSitemap);
  app.get("/robots.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(`User-agent: *
Allow: /
Sitemap: ${req.protocol}://${req.get("host")}/sitemap.xml`);
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
