# Rowell HPLC - 全球色谱解决方案

完整的全栈HPLC产品展示网站,包含2384+产品,支持AI智能推荐。

## 技术栈

- **前端:** React 19 + TypeScript + TailwindCSS + Vite
- **后端:** Express + tRPC + Node.js
- **数据库:** TiDB Cloud (MySQL兼容)
- **部署:** Railway

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件,填入数据库连接信息

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建生产版本

```bash
# 构建
npm run build

# 启动生产服务器
npm start

# 访问 http://localhost:3000
```

## Railway部署

### 方式1: 通过GitHub自动部署(推荐)

1. Fork或推送此仓库到GitHub
2. 访问 https://railway.app
3. 点击"New Project" → "Deploy from GitHub repo"
4. 选择此仓库
5. 添加环境变量(见下方)
6. 点击"Deploy"

### 方式2: 通过Railway CLI

```bash
# 安装Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init

# 部署
railway up
```

## 环境变量配置

在Railway项目设置中添加以下环境变量:

```
DATABASE_URL=mysql://4bZvb6KDzNvWmHLfyqXD.root:XqRPCJGTuE9YMIBwdGBqmZs7fUyv2Aq2@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/rowell_workflow?ssl={"rejectUnauthorized":true}
NODE_ENV=production
PORT=3000
```

## 域名绑定

1. 在Railway项目设置中点击"Settings" → "Domains"
2. 点击"Add Domain"
3. 输入 `www.rowellhplc.com`
4. 在域名DNS设置中添加CNAME记录:
   - Name: `www`
   - Value: Railway提供的域名(如 `xxx.railway.app`)

## 项目结构

```
rowell-deployment/
├── client/              # 前端代码
│   ├── src/
│   │   ├── pages/      # 页面组件
│   │   ├── components/ # 可复用组件
│   │   └── lib/        # 工具函数
│   └── public/         # 静态资源
├── server/             # 后端代码
│   ├── _core/          # 核心服务器代码
│   └── routers.ts      # API路由
├── drizzle/            # 数据库schema
└── dist/               # 构建输出
    ├── public/         # 前端静态文件
    └── index.js        # 后端服务器
```

## 功能特性

- ✅ 2384+产品展示
- ✅ 智能搜索和筛选
- ✅ 品牌分类浏览
- ✅ AI产品推荐
- ✅ 响应式设计
- ✅ 多语言支持(中英文)
- ✅ WhatsApp集成

## 数据库信息

- **表名:** crawler_results
- **产品数量:** 2384 (active + verified)
- **主要品牌:** Shimadzu, Agilent, Develosil, Phenomenex等

## 支持

如有问题,请联系技术支持。

## 许可证

MIT License
