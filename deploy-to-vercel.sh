#!/bin/bash

echo "🚀 Rowell HPLC - Vercel 部署脚本"
echo "================================"
echo ""

# 检查是否安装了vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "请运行: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI 已安装"
echo ""

# 检查是否已登录
echo "📝 检查登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️  未登录,正在打开登录页面..."
    vercel login
fi

echo "✅ 已登录到 Vercel"
echo ""

# 部署
echo "🚀 开始部署..."
echo ""
vercel --yes \
  --name rowell-hplc-new \
  --build-env DATABASE_URL="mysql://4UghFjJ7qjGhgt4.root:swV7dYB9eJ2GwHDw@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/rowell_workflow?ssl=true" \
  --build-env JWT_SECRET="rowell-hplc-production-jwt-secret-2026" \
  --build-env NODE_ENV="production"

echo ""
echo "✅ 部署完成!"
echo ""
echo "📋 下一步:"
echo "1. 访问 Vercel 控制台查看部署状态"
echo "2. 测试网站功能"
echo "3. 如果需要,推送到生产环境: vercel --prod"
