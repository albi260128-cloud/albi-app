# Kakao Maps API 도메인 등록 가이드

## 문제 상황
- ✅ 로컬 개발환경 (localhost:3000): 지도 정상 작동
- ❌ 실제 배포 도메인 (albi.kr, albi-app.pages.dev): 지도 미작동
- **원인**: Kakao Developers에서 도메인이 등록되지 않아 CORS 에러 발생

## 해결 방법

### 1. Kakao Developers 접속
https://developers.kakao.com 접속 후 로그인

### 2. 애플리케이션 선택
- 좌측 메뉴 "내 애플리케이션" 클릭
- 현재 사용 중인 앱 선택 (API 키: `b69e30d2c21d6db82408ee9a2091d293`)

### 3. 플랫폼 설정
1. 좌측 메뉴에서 **"플랫폼"** 클릭
2. "Web 플랫폼 등록" 버튼 클릭
3. 아래 도메인들을 **하나씩** 추가:

```
http://localhost:3000
https://albi.kr
https://www.albi.kr
https://albi-app.pages.dev
https://*.albi-app.pages.dev
```

### 4. 저장 및 확인
- 각 도메인 등록 후 "저장" 버튼 클릭
- 등록된 도메인 목록 확인

## 도메인 등록 전 vs 후 비교

### ❌ 등록 전
```
브라우저 콘솔 에러:
Access to XMLHttpRequest at 'https://dapi.kakao.com/...' 
from origin 'https://albi.kr' has been blocked by CORS policy
```

### ✅ 등록 후
```
브라우저 콘솔:
Kakao Maps API loaded successfully ✅
지도 정상 표시됨
```

## 현재 설정 정보
- **API 키**: `b69e30d2c21d6db82408ee9a2091d293`
- **사용 파일**: `/public/jobs.html` 10번 줄
- **SDK 로드**: `https://dapi.kakao.com/v2/maps/sdk.js?appkey=b69e30d2c21d6db82408ee9a2091d293`

## 주의사항

### ⚠️ 와일드카드 도메인 (*.albi-app.pages.dev)
- Cloudflare Pages 배포 시 랜덤 서브도메인 생성 (예: `https://9459147e.albi-app.pages.dev`)
- 와일드카드 등록으로 모든 배포 URL에서 지도 작동

### ⚠️ 프로토콜 구분
- `http://localhost:3000` (개발 환경)
- `https://albi.kr` (프로덕션 - HTTPS)
- 프로토콜까지 정확히 입력해야 함

### ⚠️ 등록 후 적용 시간
- 도메인 등록 후 즉시 적용됨
- 캐시 문제 발생 시 브라우저 새로고침 (Ctrl+F5)

## 테스트 방법

### 1. 로컬 테스트
```bash
# 로컬 서버 시작
npm run dev

# 브라우저에서 접속
http://localhost:3000/jobs.html
```

### 2. 프로덕션 테스트
```bash
# 배포 후 테스트
https://albi-app.pages.dev/jobs.html
https://albi.kr/jobs.html
```

### 3. 지도 작동 확인
1. `/jobs.html` 페이지 접속
2. 상단 탭에서 **"지도"** 클릭
3. 지도가 표시되는지 확인
4. 브라우저 콘솔(F12)에서 에러 확인

## 문제 해결 (Troubleshooting)

### 문제 1: CORS 에러
```
해결: Kakao Developers에서 도메인 재확인 및 재등록
```

### 문제 2: API 키 invalid
```
해결: jobs.html 10번 줄의 API 키 확인
현재 키: b69e30d2c21d6db82408ee9a2091d293
```

### 문제 3: 지도가 빈 화면
```
해결: 
1. 브라우저 콘솔(F12) 확인
2. 네트워크 탭에서 dapi.kakao.com 요청 상태 확인
3. 위치 권한 허용 여부 확인
```

## 관련 링크
- Kakao Developers 콘솔: https://developers.kakao.com
- Kakao Maps API 문서: https://apis.map.kakao.com/web/
- Kakao Maps SDK 가이드: https://apis.map.kakao.com/web/guide/

## 완료 체크리스트
- [ ] Kakao Developers 로그인
- [ ] 애플리케이션 선택
- [ ] 플랫폼 → Web 플랫폼 등록
- [ ] 5개 도메인 모두 등록 완료
- [ ] 로컬 테스트 (localhost:3000/jobs.html)
- [ ] 프로덕션 테스트 (albi-app.pages.dev/jobs.html)
- [ ] 지도 "리스트/지도" 탭 전환 확인
- [ ] 마커 표시 및 클릭 이벤트 확인

---

**알비(ALBI)** - 1시간 직장체험 플랫폼 🐝
