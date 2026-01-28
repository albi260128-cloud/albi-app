# 🐜 알비 (ALBI) - 1시간 직장체험 플랫폼

> 알바, 1시간만 구경하고 결정하세요. 면접 부담 없이, 텃세 걱정 없이.

**Hono + Cloudflare Pages로 구현된 현대적인 웹 애플리케이션**

## 📋 프로젝트 개요

알비는 구직자와 구인자를 연결하는 혁신적인 1시간 직장체험 플랫폼입니다.

### 핵심 특징

- **🎯 1시간 시각체험**: 일하지 않고 관찰만! 직장 분위기를 미리 확인
- **🤖 AI 면접**: Cloudflare Workers AI를 활용한 자동 면접 시스템
- **💰 급여계산기**: 주휴수당 자동 계산 기능
- **📊 D1 데이터베이스**: Cloudflare D1 SQLite 기반 데이터 관리
- **⚡ 엣지 배포**: 전세계 어디서나 빠른 응답 속도

## 🚀 현재 구현 상태

### ✅ 완료된 기능

1. **프론트엔드 페이지**
   - 메인 랜딩 페이지 (`/`)
   - AI 챗봇 페이지 (`/chat.html`)
   - 급여계산기 페이지 (`/calculator.html`)

2. **백엔드 API**
   - ✅ AI 챗봇 API (`POST /api/chat`)
   - ✅ 급여 계산 API (`POST /api/calculator/wage`)
   - ✅ 사용자 목록 조회 (`GET /api/users`)
   - ✅ 구인 공고 목록 조회 (`GET /api/jobs`)
   - ✅ 체험 예약 API (`POST /api/experiences`)
   - ✅ 헬스체크 (`GET /api/health`)

3. **데이터베이스**
   - ✅ D1 SQLite 스키마 설계
   - ✅ 샘플 데이터 생성
   - ✅ 인덱스 최적화

### 🚧 추가 개발 예정

- 사용자 인증 시스템
- 체험 예약 관리 시스템
- 리뷰 및 평점 시스템
- 알비포인트 적립/사용 시스템
- 관리자 대시보드

## 🛠️ 기술 스택

### 프론트엔드
- **HTML5 + TailwindCSS**: 반응형 UI
- **Vanilla JavaScript**: 순수 자바스크립트 (프레임워크 없음)

### 백엔드
- **Hono**: 초고속 웹 프레임워크
- **Cloudflare Pages Functions**: 서버리스 API
- **Cloudflare Workers AI**: AI 챗봇 (Llama-3-8b-instruct)

### 데이터베이스
- **Cloudflare D1**: SQLite 기반 관리형 데이터베이스

### 개발 도구
- **TypeScript**: 타입 안정성
- **Wrangler**: Cloudflare CLI 도구
- **Git**: 버전 관리

## 📦 프로젝트 구조

\`\`\`
albi-app/
├── functions/
│   └── api/
│       └── [[path]].ts          # 모든 API 라우트
├── public/
│   ├── index.html               # 메인 페이지
│   ├── chat.html                # AI 챗봇
│   └── calculator.html          # 급여계산기
├── src/
│   ├── types.ts                 # TypeScript 타입 정의
│   └── utils.ts                 # 유틸리티 함수
├── schema.sql                   # D1 데이터베이스 스키마
├── wrangler.toml                # Cloudflare 설정
├── package.json                 # 의존성 관리
└── tsconfig.json                # TypeScript 설정
\`\`\`

## 🚀 빠른 시작

### 1. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 2. 로컬 데이터베이스 초기화

\`\`\`bash
npm run db:local
\`\`\`

### 3. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 http://localhost:3000 접속

### 4. API 테스트

\`\`\`bash
# 헬스체크
curl http://localhost:3000/api/health

# 급여 계산
curl -X POST http://localhost:3000/api/calculator/wage \\
  -H "Content-Type: application/json" \\
  -d '{"hourlyWage":12000,"weeklyHours":20}'

# 사용자 목록
curl http://localhost:3000/api/users
\`\`\`

## 📡 공개 URL

현재 개발 서버는 다음 URL에서 접근 가능합니다:

- **메인 페이지**: https://3000-is6fz7wmwyawlr7nfbeuf-5c13a017.sandbox.novita.ai
- **AI 챗봇**: https://3000-is6fz7wmwyawlr7nfbeuf-5c13a017.sandbox.novita.ai/chat.html
- **급여계산기**: https://3000-is6fz7wmwyawlr7nfbeuf-5c13a017.sandbox.novita.ai/calculator.html
- **API 헬스체크**: https://3000-is6fz7wmwyawlr7nfbeuf-5c13a017.sandbox.novita.ai/api/health

## 📚 API 문서

### AI 챗봇 API

**POST** `/api/chat`

요청:
\`\`\`json
{
  "message": "카페 알바를 찾고 있어요",
  "userType": "jobseeker"  // 또는 "employer"
}
\`\`\`

응답:
\`\`\`json
{
  "success": true,
  "data": {
    "role": "assistant",
    "content": "안녕하세요! 알비입니다 🐜 카페 알바 관심이 있으시군요..."
  }
}
\`\`\`

### 급여 계산 API

**POST** `/api/calculator/wage`

요청:
\`\`\`json
{
  "hourlyWage": 12000,
  "weeklyHours": 20
}
\`\`\`

응답:
\`\`\`json
{
  "success": true,
  "data": {
    "weeklyHours": 20,
    "weeklyBasePay": 240000,
    "weeklyHolidayPay": 48000,
    "weeklyTotal": 288000,
    "monthlyEstimate": 1251360,
    "hasHolidayPay": true,
    "explanation": "주 20시간 근무로 주휴수당 적용..."
  }
}
\`\`\`

### 사용자 목록 API

**GET** `/api/users`

응답:
\`\`\`json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user001",
        "email": "jobseeker1@albi.co.kr",
        "user_type": "jobseeker",
        "name": "김구직",
        "albi_points": 50,
        "trust_score": 5.0
      }
    ],
    "count": 4
  }
}
\`\`\`

## 🗄️ 데이터베이스 스키마

### 주요 테이블

- **users**: 사용자 정보
- **jobs**: 구인 공고
- **experiences**: 1시간 체험 예약
- **point_transactions**: 알비포인트 거래 내역
- **ai_interviews**: AI 면접 기록

상세 스키마는 `schema.sql` 파일 참조

## 🎯 주요 명령어

\`\`\`bash
# 개발 서버 실행
npm run dev

# 로컬 DB 초기화
npm run db:local

# 프로덕션 DB 초기화 (Cloudflare API 토큰 필요)
npm run db:init

# 프로덕션 배포 (Cloudflare API 토큰 필요)
npm run deploy

# 포트 정리
npm run clean-port

# Git 커밋
npm run git:commit "커밋 메시지"
\`\`\`

## 🚀 프로덕션 배포

### 사전 준비

1. Cloudflare 계정 생성
2. API 토큰 생성 (https://dash.cloudflare.com/profile/api-tokens)
3. D1 데이터베이스 생성

### 배포 단계

\`\`\`bash
# 1. D1 데이터베이스 생성
npx wrangler d1 create albi-production

# 2. wrangler.toml에 database_id 업데이트

# 3. 프로덕션 DB 초기화
npm run db:init

# 4. 배포
npm run deploy
\`\`\`

## 💡 개발 팁

### 로컬 개발 시 주의사항

1. **Workers AI 사용**: 로컬 개발 중에도 실제 Cloudflare AI를 사용하므로 비용이 발생할 수 있습니다.
2. **D1 데이터베이스**: `--local` 플래그를 사용하면 `.wrangler/state/v3/d1`에 로컬 SQLite 파일이 생성됩니다.
3. **포트 충돌**: 3000번 포트를 사용하므로 다른 서비스와 충돌하지 않도록 주의하세요.

### 문제 해결

**서버가 시작되지 않을 때:**
\`\`\`bash
npm run clean-port
npm run dev
\`\`\`

**데이터베이스 오류 시:**
\`\`\`bash
rm -rf .wrangler/state/v3/d1
npm run db:local
\`\`\`

## 🤝 기여 방법

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 👥 팀

**알비팀** - 1시간 직장체험으로 더 나은 일자리 매칭을 만듭니다.

## 📞 문의

- 이메일: help@albi.co.kr
- 카카오톡: @알비
- 긴급신고: 24시간 운영

---

**Made with ❤️ by Albi Team 🐜**

*"알바, 1시간만 구경하고 결정하세요!"*
