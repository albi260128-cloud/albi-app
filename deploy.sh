#!/bin/bash
# 알비 배포 스크립트

echo "🚀 알비 배포 시작..."

# 1. 최신 코드 커밋
cd /home/user/webapp
git add .

# 커밋 메시지 입력 확인
if [ -z "$1" ]; then
  COMMIT_MSG="🔄 Update from GenSpark AI Developer $(date +%Y-%m-%d)"
else
  COMMIT_MSG="$1"
fi

git commit -m "$COMMIT_MSG" || echo "변경사항 없음 또는 이미 커밋됨"

# 2. GitHub에 푸시
echo "📤 GitHub에 푸시 중..."
git push origin main

# 3. Cloudflare Pages에 배포
echo "☁️  Cloudflare Pages 배포 중..."
npm run deploy

echo ""
echo "✅ 배포 완료!"
echo "🌐 프로덕션: https://albi-app.pages.dev"
echo "🌐 도메인: https://albi.kr (DNS 설정 후)"
