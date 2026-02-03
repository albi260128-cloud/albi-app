# 알비(ALBI) - 1시간 직장체험 플랫폼

## 프로젝트 개요
- **이름**: 알비(ALBI)
- **목표**: AI 면접 시스템을 통한 스마트 알바 매칭 플랫폼
- **핵심 기능**: 
  1. **1시간 시각체험** - 일하기 전에 미리 체험
  2. **AI 스마트 매칭** - 성향 분석 기반 최적 매칭
  3. **알비포인트** - 포인트 적립 및 기프티콘 교환

## 📌 주요 URL
- **Production**: https://3000-is6fz7wmwyawlr7nfbeuf-5c13a017.sandbox.novita.ai
- **GitHub**: (업로드 대기 - setup_github_environment 필요)
- **AI 면접**: /chat.html
- **알바 찾기**: /jobs.html
- **커뮤니티**: /community.html
- **기프티콘 스토어**: /store.html

## 🎯 최근 업데이트 (2026-02-03)

### ⭐ AI 면접 시스템 고도화 완료
**알비의 핵심 차별화 포인트**로, 세계 최고 수준의 AI 면접 시스템 구축:

#### 1. 실전 면접 질문 데이터베이스 (100+ 질문)
- **업종별 특화 질문**
  - 카페: 피크타임 대응, 메뉴 암기, 고객 응대
  - 편의점: 혼자 근무 적응, 야간 근무, 다중 업무 처리
  - 음식점: 팀워크, 체력 관리, 주문 관리
  - 배달: 운전 숙련도, 지리 파악, 악천후 대응
  - 매장 판매: 판매 능력, 트렌드 감각, 장시간 서있기

- **공통 필수 질문 (10개)**
  - 자기소개, 지원 동기, 장단점
  - 근무 가능 시간, 대타 근무, 희망 시급
  - 통근 시간, 시작 가능일, 근무 기간

#### 2. 시나리오 기반 대화 트리
5가지 사용자 유형별 맞춤 대화 시나리오:
- **긴장한 초보**: 안심시키기 → 기본 정보 → 궁금증 해소
- **자신감 경력자**: 경험 탐색 → 성과 확인 → 성장 목표
- **조건 중심**: 조건 이해 → 협상 → 우선순위 파악
- **대인관계 걱정**: 공감 → 선호도 파악 → 대안 제시
- **학습 의지 높음**: 격려 → 목표 설정 → 학습 스타일

#### 3. 빅파이브 성격 모델 기반 분석
- **외향성(Extraversion)**: 대인관계, 에너지원 → 카페/매장 적합성
- **성실성(Conscientiousness)**: 책임감, 계획성 → 편의점 적합성
- **개방성(Openness)**: 학습 의지, 창의성 → 신규 업무 적응력
- **친화성(Agreeableness)**: 협력, 공감 → 음식점 팀워크
- **정서 안정성(Neuroticism)**: 스트레스 대처 → 바쁜 환경 적합성

#### 4. 퍼펙트 매칭 알고리즘
```
종합 점수 = 성향 적합도(40%) + 역량 적합도(30%) + 조건 충족도(20%) + 거리 편의성(10%)
```

**성향 적합도 (40%)**:
- 업종별 필요 성향과 사용자 성향 비교
- 매장 분위기 (바쁨/차분함) 고려
- 빅파이브 모델 기반 정밀 분석

**역량 적합도 (30%)**:
- 필수 역량 (70% 가중치): communication, multitasking, learning_speed 등
- 우대 역량 (30% 가중치): appearance, flexibility, trend_awareness 등
- 경험 보너스: 동일 업종 +20점, 다른 업종 +10점

**조건 충족도 (20%)**:
- 시간대 매칭 (40점)
- 주말 근무 조건 (20점)
- 급여 조건 (30점)
- 회피 조건 체크 (10점)

**거리 편의성 (10%)**:
- 집에서 직장까지 거리 기반 점수

#### 5. 실시간 응답 분석
- **감정 분석**: 긍정/중립/부정 판별
- **확신도 분석**: 높음/중간/낮음
- **키워드 추출**: 성향, 역량, 선호도 자동 파싱
- **시나리오 트리거**: 특정 키워드 감지 시 적절한 시나리오 분기

#### 6. 단계별 진행 시스템
1. **기본 정보 단계**: 업종, 시간, 지역, 경험
2. **성향 분석 단계**: 외향성, 성실성, 개방성, 친화성, 안정성
3. **경험 분석 단계**: 과거 경험, 강점, 약점, 학습 목표
4. **매칭 단계**: 최종 프로필 생성 및 맞춤 공고 추천

### 🎨 UI/UX 개선
- ✅ 메인 페이지 특별 시스템 카드 클릭 가능 (1시간 체험 → /jobs, AI 매칭 → /chat.html, 알비포인트 → /store.html)
- ✅ 알비포인트 코인 이미지 교체 (귀여운 벌 코인 디자인)
- ✅ AI 면접관 캐릭터 통일 (/albi-mascot.svg)
- ✅ 전자계약서 페이지 리디자인 (Tailwind CSS, 깔끔한 폼 레이아웃)
- ✅ 회사소개 페이지 신규 생성 (/company.html)
- ✅ 고객센터 페이지 신규 생성 (/contact.html, FAQ + 1:1 문의)
- ✅ 커뮤니티 게시판 리디자인 (카테고리 필터, 카드 디자인, 호버 애니메이션)
- ✅ 알바 찾기 페이지 리디자인 (리스트/지도 뷰, 위치 기반, 목업 데이터)

## 🏗 데이터 아키텍처

### 주요 데이터 모델

#### UserProfile (구직자 프로필)
```typescript
{
  // 기본 정보
  name, age, location

  // 경험
  experience: {
    hasExperience: boolean
    industries: ['cafe', 'convenience', ...]
    duration: number (개월)
    strengths: string[]
    weaknesses: string[]
  }

  // 성향 (빅파이브 모델, 1-10 점수)
  personality: {
    extraversion: 외향성
    conscientiousness: 성실성
    openness: 개방성
    agreeableness: 친화성
    neuroticism: 신경성(높을수록 안정)
  }

  // 역량 점수 (1-10)
  skills: {
    communication, multitasking, learning_speed,
    teamwork, independence, physical_ability,
    stress_tolerance, problem_solving,
    attention_to_detail, customer_service
  }

  // 선호 조건
  preferences: {
    industries: ['cafe', ...]
    workHours: ['morning', 'afternoon', 'evening', 'night']
    weekends: boolean
    minWage: number
    maxDistance: number (km)
  }

  // 회피 조건
  avoidance: {
    industries: string[]
    conditions: ['night_shift', 'heavy_lifting', ...]
  }
}
```

#### JobPosting (공고)
```typescript
{
  // 기본 정보
  id, employerId, title, industry, location

  // 근무 조건
  workConditions: {
    hours: ['morning', 'afternoon', ...]
    weekends: boolean
    flexible: boolean
    hourlyWage: number
  }

  // 요구 역량
  requirements: {
    essential: { skill: level, ... }  // 필수
    preferred: { skill: level, ... }  // 우대
    experience: boolean
  }

  // 매장 특성
  workplace: {
    size: 'small' | 'medium' | 'large'
    atmosphere: 'calm' | 'moderate' | 'busy'
    teamSize: number
    training: boolean
  }

  benefits: string[]
}
```

#### MatchResult (매칭 결과)
```typescript
{
  jobId: string
  score: number (0-100)
  breakdown: {
    personalityFit: 성향 적합도 (40%)
    skillMatch: 역량 적합도 (30%)
    conditionMatch: 조건 충족도 (20%)
    distance: 거리 편의성 (10%)
  }
  reasons: string[]  // 매칭 이유
  concerns: string[]  // 주의사항
  recommendation: 'high' | 'medium' | 'low'
}
```

### 스토리지 서비스
- **D1 Database** (로컬 개발: .wrangler/state/v3/d1)
  - users: 사용자 정보
  - jobs: 공고 정보
  - applications: 지원 내역
  - experiences: 1시간 체험 예약
  - points: 포인트 거래 내역

## 📋 API 엔드포인트

### AI 면접 시스템
- `POST /api/chat`
  - 요청: `{ message, userType, userId }`
  - 응답: `{ role: 'assistant', content, profile?, sessionData }`
  - 세션 관리: Map 기반 임시 저장 (추후 D1/KV 이전 예정)

### 공고 관리
- `GET /api/jobs` - 활성 공고 목록 (상위 20개)
- `GET /api/jobs/nearby` - 위치 기반 공고 (lat, lng, radius, category, sort)
- `GET /api/jobs/:jobId` - 공고 상세 (조회수 증가)
- `POST /api/jobs` - 공고 등록 (30 알비포인트 차감)

### 1시간 체험
- `POST /api/experiences` - 체험 예약 생성

### 기타
- `POST /api/calculator/wage` - 급여 계산기
- `GET /api/health` - 헬스 체크
- `GET /api/info` - API 정보

## 🚀 실행 방법

### 로컬 개발
```bash
# 의존성 설치
npm install

# 로컬 D1 마이그레이션 적용
npm run db:migrate:local

# 개발 서버 시작 (PM2)
npm run clean-port
pm2 start ecosystem.config.cjs

# 로그 확인
pm2 logs --nostream

# 테스트
curl http://localhost:3000
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"카페 알바 찾고 있어요","userType":"jobseeker"}'
```

### 프로덕션 배포
```bash
# 빌드
npm run build

# Cloudflare Pages 배포
npm run deploy:prod

# D1 마이그레이션 (프로덕션)
npm run db:migrate:prod
```

## 🎓 AI 면접 시스템 사용 가이드

### 구직자용
1. `/chat.html` 접속
2. "구직자" 모드 선택 (기본값)
3. AI 면접관과 대화 시작
4. 4단계 면접 진행:
   - 기본 정보: 업종, 시간, 경험
   - 성향 분석: 성격, 일하는 스타일
   - 경험 분석: 과거 경험, 강점/약점
   - 매칭: 최적 공고 추천
5. 면접 완료 시 프로필 생성 및 매칭 결과 제공

### 사장님용 (구인자)
1. `/chat.html` 접속
2. "구인자" 모드 선택
3. AI 컨설턴트와 대화
4. 사업장 정보 및 요구사항 입력
5. 적합한 알바생 후보 추천 받기

## 🔮 다음 개발 계획

### 필수 완성 항목
1. **GitHub 연동** - setup_github_environment 호출 후 코드 업로드
2. **Cloudflare 배포** - setup_cloudflare_api_key 후 프로덕션 배포
3. **D1 통합** - 세션/프로필 데이터를 D1에 영구 저장
4. **매칭 알고리즘 실전 테스트** - 실제 공고 데이터와 연동
5. **AI 면접 고도화** - 더 많은 시나리오, 더 정교한 분석

### 추가 기능
- 1시간 체험 예약 시스템 완성
- 알비포인트 시스템 (포인트 적립/사용)
- 기프티콘 스토어 실제 상품 연동
- 실시간 알림 시스템
- 리뷰 및 평점 시스템

## 📊 기술 스택
- **Framework**: Hono (Cloudflare Pages Functions)
- **Frontend**: Tailwind CSS, Vanilla JavaScript
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages
- **PM2**: 프로세스 관리 (개발 환경)
- **AI**: 규칙 기반 + 심리학 모델 (빅파이브)

## 📝 마지막 업데이트
- **날짜**: 2026-02-03
- **상태**: ✅ AI 면접 시스템 고도화 완료
- **다음**: GitHub 업로드 대기 (setup_github_environment 필요)
- **테스트 URL**: https://3000-is6fz7wmwyawlr7nfbeuf-5c13a017.sandbox.novita.ai

---

**알비(ALBI)** - AI가 찾아주는 나에게 딱 맞는 알바 🐝
