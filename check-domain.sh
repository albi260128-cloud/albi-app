#!/bin/bash
# albi.kr 도메인 연결 상태 확인 스크립트

echo "🔍 albi.kr 도메인 연결 상태 확인..."
echo ""

# DNS 조회
echo "📡 DNS 조회 결과:"
host albi.kr 2>/dev/null || echo "아직 DNS가 전파되지 않았습니다."
echo ""

# HTTP 접속 테스트
echo "🌐 HTTP 접속 테스트:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://albi.kr 2>/dev/null)
if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo "✅ HTTP 접속 성공! (Status: $HTTP_STATUS)"
else
    echo "⏳ 아직 접속할 수 없습니다. (Status: $HTTP_STATUS)"
    echo "   DNS 전파를 기다려주세요 (5분~2시간)"
fi
echo ""

# HTTPS 접속 테스트
echo "🔒 HTTPS 접속 테스트:"
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://albi.kr 2>/dev/null)
if [ "$HTTPS_STATUS" = "200" ] || [ "$HTTPS_STATUS" = "301" ] || [ "$HTTPS_STATUS" = "302" ]; then
    echo "✅ HTTPS 접속 성공! (Status: $HTTPS_STATUS)"
    echo "🎉 도메인 연결 완료!"
else
    echo "⏳ 아직 HTTPS 접속할 수 없습니다. (Status: $HTTPS_STATUS)"
    echo "   SSL 인증서 발급을 기다려주세요 (10분~1시간)"
fi
echo ""

echo "💡 팁: DNS 전파는 최대 24시간이 걸릴 수 있습니다."
echo "💡 보통 10분~2시간 내에 완료됩니다."
