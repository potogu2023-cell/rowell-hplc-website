import { COOKIE_NAME } from "@shared/const";
import { z } from 'zod';
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    register: publicProcedure
      .input((raw: unknown) => {
        return z.object({
          email: z.string().email('请输入有效的邮箱地址'),
          password: z.string().min(6, '密码至少6个字符'),
          name: z.string().min(2, '姓名至少2个字符'),
          company: z.string().optional(),
          phone: z.string().optional(),
          country: z.string().optional(),
          industry: z.string().optional(),
          purchasingRole: z.string().optional(),
          annualPurchaseVolume: z.string().optional(),
        }).parse(raw);
      })
      .mutation(async ({ input }) => {
        const { getUserByEmail, createUser } = await import('./db');
        const { hashPassword } = await import('./password-utils');
        
        // Check if user already exists
        const existingUser = await getUserByEmail(input.email);
        if (existingUser) {
          throw new Error('该邮箱已被注册');
        }
        
        // Hash password
        const passwordHash = await hashPassword(input.password);
        
        // Create user
        const userId = await createUser({
          email: input.email,
          passwordHash,
          name: input.name,
          company: input.company,
          phone: input.phone,
          country: input.country,
          industry: input.industry,
          purchasingRole: input.purchasingRole,
          annualPurchaseVolume: input.annualPurchaseVolume,
        });
        
        return {
          success: true,
          message: '注册成功！请登录',
        };
      }),
    login: publicProcedure
      .input((raw: unknown) => {
        return z.object({
          email: z.string().email('请输入有效的邮箱地址'),
          password: z.string().min(1, '请输入密码'),
        }).parse(raw);
      })
      .mutation(async ({ input, ctx }) => {
        const { getUserByEmail, updateUserLastSignIn } = await import('./db');
        const { verifyPassword } = await import('./password-utils');
        const { setSessionCookie } = await import('./_core/cookies');
        
        // Find user
        const user = await getUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new Error('邮箱或密码错误');
        }
        
        // Verify password
        const isValid = await verifyPassword(input.password, user.passwordHash);
        if (!isValid) {
          throw new Error('邮箱或密码错误');
        }
        
        // Update last sign in
        await updateUserLastSignIn(user.id);
        
        // Set session cookie
        setSessionCookie(ctx.req, ctx.res, {
          userId: user.id,
          openId: user.openId || undefined,
          email: user.email || undefined,
          name: user.name || undefined,
        });
        
        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      }),
  }),

  // Product routes
  products: router({
    list: publicProcedure
      .input((raw: unknown) => {
        const { productsListInput } = require('./products_list_new');
        return productsListInput.parse(raw);
      })
      .query(async ({ input }) => {
        const { getDb } = await import('./db');
        const { productsListQuery } = await import('./products_list_new');
        const db = await getDb();
        return await productsListQuery(input, db);
      }),
    
    getByIds: publicProcedure
      .input((raw: unknown) => {
        return z.object({
          productIds: z.array(z.number()),
        }).parse(raw);
      })
      .query(async ({ input }) => {
        const { getProductsByIds } = await import('./db');
        return await getProductsByIds(input.productIds);
      }),
  }),

  // Resources routes
  resources: router({
    list: publicProcedure
      .input((raw: unknown) => {
        return z.object({
          page: z.number().min(1).optional(),
          pageSize: z.number().min(1).max(100).optional(),
          search: z.string().optional(),
          category: z.string().optional(),
        }).optional().parse(raw);
      })
      .query(async ({ input }) => {
        const page = input?.page || 1;
        const pageSize = input?.pageSize || 12;
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) {
          return { resources: [], total: 0, page, pageSize };
        }

        const { resources } = await import('../drizzle/schema');
        const { eq, like, and, desc } = await import('drizzle-orm');

        // Build where conditions
        const conditions: any[] = [];
        if (input?.search) {
          conditions.push(
            like(resources.title, `%${input.search}%`)
          );
        }
        if (input?.category) {
          conditions.push(eq(resources.category, input.category));
        }

        // Get total count
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        const allResources = await db.select().from(resources).where(whereClause);
        const total = allResources.length;

        // Get paginated results
        const offset = (page - 1) * pageSize;
        const results = await db
          .select()
          .from(resources)
          .where(whereClause)
          .orderBy(desc(resources.publishedAt))
          .limit(pageSize)
          .offset(offset);

        return {
          resources: results,
          total,
          page,
          pageSize,
        };
      }),

    getBySlug: publicProcedure
      .input((raw: unknown) => {
        return z.object({
          slug: z.string(),
        }).parse(raw);
      })
      .query(async ({ input }) => {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) {
          return null;
        }

        const { resources } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');

        const results = await db
          .select()
          .from(resources)
          .where(eq(resources.slug, input.slug))
          .limit(1);

        return results.length > 0 ? results[0] : null;
      }),

    listCategories: publicProcedure.query(async () => {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) {
        return [];
      }

      const { resources } = await import('../drizzle/schema');
      const { sql } = await import('drizzle-orm');

      const results = await db
        .select({ category: resources.category })
        .from(resources)
        .groupBy(resources.category);

      return results.map(r => r.category).filter(Boolean);
    }),
  }),

  // Inquiry routes
  inquiries: router({
    create: publicProcedure
      .input((raw: unknown) => {
        return z.object({
          productIds: z.array(z.number()).min(1, '请选择至少一个产品'),
          userInfo: z.object({
            name: z.string().min(2, '姓名至少 2 个字符').max(50, '姓名最多 50 个字符'),
            email: z.string().email('请输入有效的邮箱地址'),
            company: z.string().optional(),
            phone: z.string().optional(),
            message: z.string().max(500, '留言最多 500 个字符').optional(),
          }),
        }).parse(raw);
      })
      .mutation(async ({ input }) => {
        const { createInquiry, createInquiryItems, getProductsByIds } = await import('./db');
        const { generateInquiryNumber } = await import('./inquiryUtils');
        const { sendInquiryEmail } = await import('./emailService');
        
        // Generate unique inquiry number
        const inquiryNumber = generateInquiryNumber();
        
        // Get product details
        const products = await getProductsByIds(input.productIds);
        if (products.length === 0) {
          throw new Error('未找到产品信息');
        }
        
        // Create inquiry record
        const inquiryId = await createInquiry({
          inquiryNumber,
          userName: input.userInfo.name,
          userEmail: input.userInfo.email,
          userCompany: input.userInfo.company,
          userPhone: input.userInfo.phone,
          userMessage: input.userInfo.message,
        });
        
        // Create inquiry items
        const items = products.map(p => ({
          productId: p.id,
          partNumber: p.partNumber,
          productName: p.name,
          brand: p.brand,
        }));
        await createInquiryItems(inquiryId, items);
        
        // Send confirmation email
        const emailSent = await sendInquiryEmail({
          inquiryNumber,
          userName: input.userInfo.name,
          userEmail: input.userInfo.email,
          userMessage: input.userInfo.message,
          products: products.map(p => ({
            name: p.name,
            partNumber: p.partNumber,
          })),
          createdAt: new Date(),
        });
        
        return {
          success: true,
          inquiryNumber,
          message: emailSent 
            ? '询价已提交，确认邮件已发送至您的邮箱' 
            : '询价已提交，但邮件发送失败，请记录您的询价单号',
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
