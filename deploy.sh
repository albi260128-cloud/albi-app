#!/bin/bash
# 알비 배포 스크립트

echo "🚀 알비 배포 시작..."

# 1. 최신 코드 커밋
cd /home/user/webapp
git add .
git commit -m "🔄 Update from GenSpark AI Developer $(date +%Y-%m-%d)"

# 2. GitHub에 푸시
git push origin main

# 3. Cloudflare Pages에 배포
npx wrangler pages deploy public --project-name albi-app

echo "✅ 배포 완료!"
echo "🌐 https://albi-app.pages.dev"
