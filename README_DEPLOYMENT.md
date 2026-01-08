# Rowell HPLC 网站 - 部署包

**版本:** 1.0  
**日期:** 2026-01-08  
**状态:** ✅ 代码已准备,可立即部署

---

## 📦 包含内容

- ✅ 完整的前端和后端代码
- ✅ 已修改schema.ts适配crawler_results表
- ✅ 已添加status过滤(active + verified)
- ✅ 环境变量配置文件
- ✅ 部署脚本和文档

---

## 🚀 快速开始

### 最简单的方式(推荐)

```bash
cd /home/ubuntu/rowell-deployment
./deploy-to-vercel.sh
```

这个脚本会:
1. 检查Vercel CLI
2. 登录Vercel(如果需要)
3. 自动部署项目
4. 配置环境变量

---

## 📋 部署方式

### 方式1: 使用部署脚本(最简单)

```bash
./deploy-to-vercel.sh
```

### 方式2: 手动使用Vercel CLI

```bash
vercel login
vercel
```

### 方式3: 通过Git部署

详见: `DEPLOY_TO_VERCEL_MANUAL.md`

---

## ⚙️ 环境变量

部署时需要配置以下环境变量(已包含在`.env.production`):

```bash
DATABASE_URL=mysql://4UghFjJ7qjGhgt4.root:swV7dYB9eJ2GwHDw@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/rowell_workflow?ssl=true
JWT_SECRET=rowell-hplc-production-jwt-secret-2026-please-change-this
NODE_ENV=production
PORT=3000
```

---

## 📊 预期结果

部署成功后:
- **产品数量:** 2384个(active + verified状态)
- **品牌数量:** 4个(Shimadzu, Agilent, Develosil, Phenomenex)
- **功能:** 搜索、筛选、分页、排序

---

## 📁 重要文件

| 文件 | 说明 |
|------|------|
| `DEPLOY_TO_VERCEL_MANUAL.md` | 详细的手动部署指南 |
| `deploy-to-vercel.sh` | 自动部署脚本 |
| `.env.production` | 生产环境变量 |
| `vercel.json` | Vercel配置文件 |
| `package.json` | 项目依赖和脚本 |

---

## ✅ 测试清单

部署后请测试:

- [ ] 首页加载正常
- [ ] 产品列表显示2384个产品
- [ ] 搜索"Shimadzu"返回692个结果
- [ ] 品牌筛选正常(4个品牌)
- [ ] 产品详情页正常
- [ ] API响应正常

---

## 🆘 遇到问题?

1. 查看 `DEPLOY_TO_VERCEL_MANUAL.md` 的"常见问题排查"部分
2. 检查Vercel部署日志
3. 检查Function日志
4. 验证环境变量配置

---

## 📞 技术支持

- **文档:** 查看`DEPLOY_TO_VERCEL_MANUAL.md`
- **日志:** Vercel控制台 → Deployments → Logs
- **数据库:** TiDB Cloud控制台

---

**准备人:** Technical Director  
**日期:** 2026-01-08  
**预计部署时间:** 15-20分钟
