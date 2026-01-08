# Vercel 手动部署指南

**部署包:** rowell-deployment.tar.gz (5.5MB)  
**目标:** 创建新的Vercel测试项目  
**预计时间:** 15-20分钟

---

## 方式1: 使用Git部署 (推荐)

### 步骤1: 创建GitHub仓库

1. 访问 https://github.com/new
2. 仓库名称: `rowell-hplc-new`
3. 设置为Private
4. 不要添加README、.gitignore或license
5. 点击"Create repository"

### 步骤2: 推送代码到GitHub

在本地终端执行:

```bash
cd /home/ubuntu/rowell-deployment

# 添加远程仓库(替换YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/rowell-hplc-new.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤3: 在Vercel导入项目

1. 访问 https://vercel.com/new
2. 选择"Import Git Repository"
3. 选择刚创建的`rowell-hplc-new`仓库
4. 项目配置:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/client`
   - **Install Command:** `npm install`

5. 点击"Deploy"

### 步骤4: 配置环境变量

部署完成后:

1. 进入项目设置: Settings → Environment Variables
2. 添加以下变量:

```
DATABASE_URL = mysql://4UghFjJ7qjGhgt4.root:swV7dYB9eJ2GwHDw@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/rowell_workflow?ssl=true

JWT_SECRET = rowell-hplc-production-jwt-secret-2026-change-this

NODE_ENV = production

PORT = 3000
```

3. 点击"Save"
4. 触发重新部署: Deployments → 最新部署 → ... → Redeploy

---

## 方式2: 直接上传代码

### 步骤1: 准备代码

1. 下载部署包: `/home/ubuntu/rowell-deployment.tar.gz`
2. 解压到本地目录
3. 删除`.git`目录(如果存在)

### 步骤2: 使用Vercel CLI部署

在本地终端执行:

```bash
# 安装Vercel CLI(如果未安装)
npm install -g vercel

# 登录Vercel
vercel login

# 进入项目目录
cd /path/to/rowell-deployment

# 部署
vercel

# 按提示操作:
# - Set up and deploy? Yes
# - Which scope? 选择您的团队
# - Link to existing project? No
# - What's your project's name? rowell-hplc-new
# - In which directory is your code located? ./
# - Want to override the settings? Yes
#   - Build Command: npm run build
#   - Output Directory: dist/client
#   - Development Command: npm run dev
```

### 步骤3: 配置环境变量

```bash
# 添加环境变量
vercel env add DATABASE_URL production
# 粘贴: mysql://4UghFjJ7qjGhgt4.root:swV7dYB9eJ2GwHDw@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/rowell_workflow?ssl=true

vercel env add JWT_SECRET production
# 粘贴: rowell-hplc-production-jwt-secret-2026-change-this

vercel env add NODE_ENV production
# 粘贴: production

# 重新部署
vercel --prod
```

---

## 方式3: 使用Vercel网站上传

### 步骤1: 准备ZIP文件

```bash
cd /home/ubuntu/rowell-deployment
zip -r rowell-deployment.zip . -x "node_modules/*" ".git/*" "dist/*"
```

### 步骤2: 上传到Vercel

1. 访问 https://vercel.com/new
2. 选择"Deploy from a ZIP file"
3. 上传`rowell-deployment.zip`
4. 配置项目设置(同方式1步骤3)
5. 部署

---

## 部署后验证

### 1. 检查部署状态

访问Vercel项目页面,查看部署日志:
- Build logs: 检查构建是否成功
- Function logs: 检查API是否正常

### 2. 测试网站功能

访问部署的URL(例如: `https://rowell-hplc-new.vercel.app`)

**测试清单:**

```bash
# 1. 首页加载
curl https://rowell-hplc-new.vercel.app/

# 2. 产品列表API
curl https://rowell-hplc-new.vercel.app/api/trpc/products.list

# 3. 品牌统计API
curl https://rowell-hplc-new.vercel.app/api/trpc/products.getBrandStats
```

**浏览器测试:**
- [ ] 首页正常显示
- [ ] 产品列表显示2384个产品
- [ ] 搜索"Shimadzu"返回692个结果
- [ ] 品牌筛选正常(4个品牌)
- [ ] 产品详情页正常
- [ ] 图片显示(部分产品可能缺失图片)

### 3. 检查数据库连接

在Vercel Function日志中查找:
- 数据库连接成功的日志
- 查询执行的日志
- 任何错误信息

---

## 常见问题排查

### Q1: 部署失败 - "Build failed"

**检查:**
1. Build logs中的错误信息
2. package.json中的dependencies是否完整
3. Node版本是否兼容(需要18.x或20.x)

**解决:**
```bash
# 在Vercel项目设置中
Settings → General → Node.js Version → 20.x
```

### Q2: API返回500错误

**检查:**
1. 环境变量是否正确配置
2. DATABASE_URL是否包含ssl=true
3. Function logs中的错误信息

**解决:**
- 重新检查环境变量
- 确保数据库IP白名单包含Vercel的IP
- 查看详细错误日志

### Q3: 产品列表为空

**检查:**
1. 数据库连接是否成功
2. status过滤是否正确
3. 数据库中是否有active/verified状态的产品

**解决:**
```sql
-- 在数据库中检查
SELECT COUNT(*) FROM crawler_results WHERE status IN ('active', 'verified');
```

### Q4: 页面显示但样式错乱

**检查:**
1. 静态资源是否正确构建
2. dist/client目录是否包含CSS文件
3. 浏览器控制台是否有404错误

**解决:**
- 检查Build Command是否正确
- 检查Output Directory是否为dist/client
- 重新构建和部署

---

## 性能优化(可选)

部署成功后,可以进行以下优化:

### 1. 添加CDN缓存

在`vercel.json`中添加:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. 配置Redis缓存

添加环境变量:
```
REDIS_URL = redis://...
```

### 3. 启用Analytics

在Vercel项目设置中:
- Analytics → Enable
- Speed Insights → Enable

---

## 下一步

部署成功后:

1. **通知团队**
   - 前端团队: 新网站URL
   - AI图片生成团队: 可以开始工作

2. **监控**
   - 设置Vercel Alerts
   - 监控错误率和性能

3. **决定是否更新生产环境**
   - 如果测试通过,可以更新www.rowellhplc.com
   - 或者保持两个环境并存

---

## 支持

如果遇到问题:
1. 查看Vercel部署日志
2. 查看Function日志
3. 检查数据库连接
4. 参考本文档的常见问题部分

---

**文档创建:** 2026-01-08  
**版本:** 1.0  
**维护:** Technical Director
