import { pgTable, index, integer, text, decimal, timestamp, foreignKey, json, serial, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const aiCache = pgTable("ai_cache", {
	id: serial().notNull(),
	questionHash: text().notNull(),
	questionKeywords: text(),
	questionSample: text(),
	answer: text().notNull(),
	hitCount: integer().default(0).notNull(),
	likeCount: integer().default(0).notNull(),
	dislikeCount: integer().default(0).notNull(),
	satisfactionRate: decimal({ precision: 5, scale: 2 }),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp().notNull(),
},
(table) => [
	index("ai_cache_questionHash_unique").on(table.questionHash),
	index("idx_ai_cache_questionHash").on(table.questionHash),
]);

export const aiConversationStats = pgTable("ai_conversation_stats", {
	id: serial().notNull(),
	statDate: timestamp().notNull(),
	totalConversations: integer().default(0).notNull(),
	totalMessages: integer().default(0).notNull(),
	avgMessagesPerConversation: decimal({ precision: 5, scale: 2 }),
	likes: integer().default(0).notNull(),
	dislikes: integer().default(0).notNull(),
	satisfactionRate: decimal({ precision: 5, scale: 2 }),
	transferToHuman: integer().default(0).notNull(),
	cacheHits: integer().default(0).notNull(),
	cacheHitRate: decimal({ precision: 5, scale: 2 }),
	llmCost: decimal({ precision: 10, scale: 2 }),
},
(table) => [
	index("ai_conversation_stats_statDate_unique").on(table.statDate),
	index("idx_ai_conversation_stats_statDate").on(table.statDate),
]);

export const aiConversations = pgTable("ai_conversations", {
	id: serial().notNull(),
	userId: integer().references(() => users.id, { onDelete: "cascade" } ),
	sessionId: text().notNull(),
	consentMode: text().notNull(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp(),
	isDeleted: integer().default(0).notNull(),
},
(table) => [
	index("ai_conversations_sessionId_unique").on(table.sessionId),
	index("idx_ai_conversations_userId").on(table.userId),
	index("idx_ai_conversations_sessionId").on(table.sessionId),
	index("idx_ai_conversations_expiresAt").on(table.expiresAt),
]);

export const aiMessages = pgTable("ai_messages", {
	id: serial().notNull(),
	conversationId: integer().notNull().references(() => aiConversations.id, { onDelete: "cascade" } ),
	role: text().notNull(),
	content: text(),
	contentEncrypted: text(),
	feedback: text().default('none'),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => [
	index("idx_ai_messages_conversationId").on(table.conversationId),
	index("idx_ai_messages_feedback_new").on(table.feedback),
	index("idx_ai_messages_createdAt_new").on(table.createdAt),
]);

export const aiQuestionAnalysis = pgTable("ai_question_analysis", {
	id: serial().notNull(),
	questionHash: text().notNull(),
	questionSample: text(),
	askCount: integer().default(0).notNull(),
	likeCount: integer().default(0).notNull(),
	dislikeCount: integer().default(0).notNull(),
	satisfactionRate: decimal({ precision: 5, scale: 2 }),
	lastAskedAt: timestamp(),
},
(table) => [
	index("ai_question_analysis_questionHash_unique").on(table.questionHash),
	index("idx_ai_question_analysis_questionHash").on(table.questionHash),
	index("idx_ai_question_analysis_askCount").on(table.askCount),
	index("idx_ai_question_analysis_satisfactionRate").on(table.satisfactionRate),
]);

export const apiKeys = pgTable("api_keys", {
	id: serial().notNull(),
	keyHash: text().notNull(),
	keyPrefix: text().notNull(),
	name: text().notNull(),
	description: text(),
	createdBy: integer().notNull().references(() => users.id, { onDelete: "cascade" } ),
	permissions: text().default('resources:create').notNull(),
	isActive: integer().default(1).notNull(),
	lastUsedAt: timestamp(),
	expiresAt: timestamp(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => [
	index("api_keys_keyHash_unique").on(table.keyHash),
	index("idx_api_keys_createdBy").on(table.createdBy),
	index("idx_api_keys_isActive").on(table.isActive),
]);

export const cart = pgTable("cart", {
	id: serial().notNull(),
	userId: integer().notNull(),
	productId: integer().notNull(),
	quantity: integer().default(1).notNull(),
	notes: text(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const categories = pgTable("categories", {
	id: serial().notNull(),
	name: text().notNull(),
	nameEn: text(),
	slug: text().notNull(),
	parentId: integer(),
	level: integer().default(1).notNull(),
	displayOrder: integer().default(0),
	isVisible: integer().default(1).notNull(),
	description: text(),
	icon: text(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => [
	index("categories_slug_unique").on(table.slug),
]);

export const conversionFunnel = pgTable("conversion_funnel", {
	id: serial().notNull(),
	statDate: timestamp().notNull(),
	websiteVisits: integer().default(0).notNull(),
	aiConversations: integer().default(0).notNull(),
	productClicks: integer().default(0).notNull(),
	cartAdditions: integer().default(0).notNull(),
	inquiriesSubmitted: integer().default(0).notNull(),
},
(table) => [
	index("conversion_funnel_statDate_unique").on(table.statDate),
	index("idx_conversion_funnel_statDate").on(table.statDate),
]);

export const inquiries = pgTable("inquiries", {
	id: serial().notNull(),
	inquiryNumber: text().notNull(),
	userId: integer().notNull(),
	status: text().default('pending').notNull(),
	urgency: text().default('normal').notNull(),
	budgetRange: text(),
	applicationNotes: text(),
	deliveryAddress: text(),
	totalItems: integer().default(0).notNull(),
	customerNotes: text(),
	adminNotes: text(),
	quotedAt: timestamp(),
	completedAt: timestamp(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	conversationId: integer(),
},
(table) => [
	index("inquiries_inquiryNumber_unique").on(table.inquiryNumber),
]);

export const inquiryItems = pgTable("inquiry_items", {
	id: serial().notNull(),
	inquiryId: integer().notNull(),
	productId: integer().notNull(),
	quantity: integer().default(1).notNull(),
	notes: text(),
	quotedPrice: text(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const llmCostTracking = pgTable("llm_cost_tracking", {
	id: serial().notNull(),
	conversationId: integer().references(() => aiConversations.id, { onDelete: "set null" } ),
	tokenCount: integer().notNull(),
	cost: decimal({ precision: 10, scale: 6 }).notNull(),
	model: text().default('gpt-3.5-turbo').notNull(),
	timestamp: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => [
	index("idx_llm_cost_tracking_conversationId").on(table.conversationId),
	index("idx_llm_cost_tracking_timestamp").on(table.timestamp),
]);

export const productCategories = pgTable("product_categories", {
	id: serial().notNull(),
	productId: integer().notNull().references(() => products.id, { onDelete: "cascade" } ),
	categoryId: integer().notNull().references(() => categories.id, { onDelete: "cascade" } ),
	isPrimary: integer().default(0).notNull(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => [
	index("unique_product_category").on(table.productId, table.categoryId),
]);

export const products = pgTable("products", {
	id: serial().notNull(),
	productId: text().notNull(),
	partNumber: text().notNull(),
	brand: text().notNull(),
	taskId: text().notNull(),
	productName: text(),
	rawData: json(),
	description: text(),
	status: text().default('pending'),
	dataQuality: text(),
	category: text().default('Other'),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	specifications: text(),
	imageUrl: text(),
},
(table) => [
	index("products_productId_unique").on(table.productId),
]);

export const resourceCategories = pgTable("resource_categories", {
	id: serial().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	displayOrder: integer().default(0).notNull(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => [
	index("resource_categories_slug_unique").on(table.slug),
]);

export const resourcePostTags = pgTable("resource_post_tags", {
	postId: integer().notNull().references(() => resources.id, { onDelete: "cascade" } ),
	tagId: integer().notNull().references(() => resourceTags.id, { onDelete: "cascade" } ),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => [
	index("pk_resource_post_tags").on(table.postId, table.tagId),
	index("idx_resource_post_tags_postId").on(table.postId),
	index("idx_resource_post_tags_tagId").on(table.tagId),
]);

export const resourceTags = pgTable("resource_tags", {
	id: serial().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => [
	index("resource_tags_name_unique").on(table.name),
	index("resource_tags_slug_unique").on(table.slug),
]);

export const resources = pgTable("resources", {
	id: serial().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	excerpt: text(),
	metaDescription: text(),
	coverImage: text(),
	authorName: text().default('ROWELL Team'),
	status: text().default('draft').notNull(),
	language: text().default('en').notNull(),
	categoryId: integer(),
	viewCount: integer().default(0).notNull(),
	featured: integer().default(0).notNull(),
	publishedAt: timestamp(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => [
	index("resources_slug_unique").on(table.slug),
	index("idx_resources_status_published").on(table.status, table.publishedAt),
	index("idx_resources_category").on(table.categoryId),
	index("idx_resources_featured").on(table.featured),
	index("idx_resources_language").on(table.language),
]);

export const users = pgTable("users", {
	id: serial().notNull(),
	openId: text().notNull(),
	name: text(),
	email: text(),
	loginMethod: text(),
	role: text().default('user').notNull(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	lastSignedIn: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	company: text(),
	phone: text(),
	country: text(),
	industry: text(),
	purchasingRole: text(),
	annualPurchaseVolume: text(),
	emailVerified: integer().default(0).notNull(),
	password: text(),
	customerTier: text().default('regular'),
	consentMode: text().default('standard'),
	consentTimestamp: timestamp(),
},
(table) => [
	index("users_openId_unique").on(table.openId),
]);
