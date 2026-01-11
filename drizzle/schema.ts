import { pgTable, pgEnum, pgSchema, AnyPgColumn, index, serial, text, decimal, timestamp, foreignKey, json, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const aiCache = pgTable("ai_cache", {
	id: serial( ).notNull(),
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

export const aiQuestionKeywords = pgTable("ai_question_keywords", {
	id: serial().notNull(),
	keyword: text().notNull(),
	questionCount: integer().default(0).notNull(),
	lastUsed: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => [
	index("ai_question_keywords_keyword_unique").on(table.keyword),
	index("idx_ai_question_keywords_keyword").on(table.keyword),
]);

export const chromatographyColumns = pgTable("chromatography_columns", {
	id: serial().notNull(),
	name: text().notNull(),
	manufacturer: text(),
	particleSize: decimal({ precision: 5, scale: 2 }),
	length: decimal({ precision: 6, scale: 2 }),
	innerDiameter: decimal({ precision: 5, scale: 2 }),
	phRange: text(),
	maxPressure: integer(),
	maxTemperature: integer(),
	description: text(),
	specifications: json(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const detectors = pgTable("detectors", {
	id: serial().notNull(),
	name: text().notNull(),
	type: text().notNull(),
	manufacturer: text(),
	model: text(),
	wavelengthRange: text(),
	sensitivity: text(),
	flowCellVolume: decimal({ precision: 6, scale: 2 }),
	specifications: json(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const hplcMethods = pgTable("hplc_methods", {
	id: serial().notNull(),
	name: text().notNull(),
	description: text(),
	columnId: integer().references(() => chromatographyColumns.id),
	detectorId: integer().references(() => detectors.id),
	mobilePhase: text(),
	flowRate: decimal({ precision: 5, scale: 2 }),
	injectionVolume: decimal({ precision: 6, scale: 2 }),
	columnTemperature: decimal({ precision: 5, scale: 2 }),
	runTime: integer(),
	detectionWavelength: integer(),
	gradientProgram: json(),
	samplePreparation: text(),
	validationData: json(),
	createdBy: integer().references(() => users.id),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const methodResults = pgTable("method_results", {
	id: serial().notNull(),
	methodId: integer().notNull().references(() => hplcMethods.id, { onDelete: "cascade" } ),
	sampleId: text(),
	runDate: timestamp().notNull(),
	operator: text(),
	retentionTimes: json(),
	peakAreas: json(),
	concentrations: json(),
	recoveryRate: decimal({ precision: 5, scale: 2 }),
	rsd: decimal({ precision: 5, scale: 2 }),
	chromatogramImage: text(),
	rawData: json(),
	notes: text(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const products = pgTable("products", {
	id: serial().notNull(),
	name: text().notNull(),
	category: text().notNull(),
	subCategory: text(),
	model: text(),
	description: text(),
	specifications: json(),
	features: json(),
	applications: json(),
	price: decimal({ precision: 10, scale: 2 }),
	currency: text().default('CNY'),
	stockStatus: text().default('in_stock'),
	leadTime: text(),
	images: json(),
	documents: json(),
	relatedProducts: json(),
	seoTitle: text(),
	seoDescription: text(),
	seoKeywords: text(),
	isActive: integer().default(1).notNull(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const sessions = pgTable("sessions", {
	id: text().notNull(),
	userId: integer().notNull().references(() => users.id, { onDelete: "cascade" } ),
	expiresAt: timestamp({ withTimezone: true }).notNull(),
});

export const users = pgTable("users", {
	id: serial().notNull(),
	username: text().notNull(),
	email: text(),
	passwordHash: text().notNull(),
	role: text().default('user').notNull(),
	fullName: text(),
	organization: text(),
	phone: text(),
	isActive: integer().default(1).notNull(),
	lastLogin: timestamp(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => [
	index("users_username_unique").on(table.username),
	index("users_email_unique").on(table.email),
]);

export const workflowSteps = pgTable("workflow_steps", {
	id: serial().notNull(),
	workflowId: integer().notNull().references(() => workflows.id, { onDelete: "cascade" } ),
	stepNumber: integer().notNull(),
	name: text().notNull(),
	description: text(),
	estimatedDuration: integer(),
	requiredEquipment: json(),
	requiredMaterials: json(),
	safetyNotes: text(),
	qualityCheckpoints: json(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const workflows = pgTable("workflows", {
	id: serial().notNull(),
	name: text().notNull(),
	description: text(),
	category: text(),
	purpose: text(),
	estimatedDuration: integer(),
	difficultyLevel: text(),
	requiredSkills: json(),
	safetyRequirements: text(),
	regulatoryCompliance: json(),
	version: text().default('1.0'),
	status: text().default('draft'),
	createdBy: integer().references(() => users.id),
	approvedBy: integer().references(() => users.id),
	approvedAt: timestamp(),
	createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
});
