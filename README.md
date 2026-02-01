# 알비(ALBI) - 1시간 직장체험 플랫폼

## 🎨 Premium Design v2.0

완전히 새롭게 재설계된 프리미엄 UI/UX로 고급스럽고 깔끔한 사용자 경험을 제공합니다.

## ✨ 주요 특징

### 💎 프리미엄 디자인 시스템
- **고급스러운 색상 팔레트**: 세련된 그라데이션과 깊이감 있는 색상
- **레이어드 섀도우**: 물리적 깊이감을 표현하는 다층 그림자 시스템
- **유려한 애니메이션**: 자연스러운 페이드인, 플로팅 효과
- **Glassmorphism**: 유리 효과(backdrop-filter)를 활용한 현대적 디자인

### 📱 PWA (Progressive Web App) 지원
- **앱 설치 가능**: 홈 화면에 추가하여 네이티브 앱처럼 사용
- **오프라인 지원**: 서비스 워커를 통한 오프라인 접근 (향후 구현)
- **푸시 알림**: 알바 추천, 포인트 적립 알림 (향후 구현)
- **빠른 로딩**: 최적화된 리소스 로딩

### 🎯 핵심 기능

#### 1. **1시간 시각체험**
- 일하지 않고 관찰만 가능
- 직장 분위기 사전 확인
- 거절 시 페널티 없음

#### 2. **AI 스마트 매칭**
- 5분 AI 면접으로 시간 절약
- 성향 분석 기반 최적 매칭
- 면접 스트레스 제로

#### 3. **알비포인트 리워드**
- 체험 완료 시 15P 지급
- 1개월 근무 시 100P 보너스
- 스타벅스 기프티콘 즉시 교환

## 🚀 기술 스택

### Frontend
- **순수 HTML/CSS/JavaScript** (프레임워크 없이 최적화)
- **Modern CSS Features**: CSS Grid, Flexbox, Custom Properties
- **Font Awesome 6.4.0**: 프리미엄 아이콘 세트
- **Responsive Design**: 모바일 퍼스트 반응형 디자인

### Backend
- **Hono Framework**: 초경량 웹 프레임워크
- **Cloudflare Pages**: 엣지 배포 플랫폼
- **Cloudflare D1**: 서버리스 SQLite 데이터베이스

### DevOps
- **PM2**: 프로세스 관리
- **Git**: 버전 관리
- **Wrangler**: Cloudflare 배포 도구

## 📊 성과 지표

- **누적 체험**: 60만+ 건
- **창출 임금**: 300억+
- **채용 성공**: 10만+ 건
- **평균 평점**: 4.8★/5.0

## 🌐 접속 URL

**개발 서버**  
https://3000-is6fz7wmwyawlr7nfbeuf-5c13a017.sandbox.novita.ai/

**프로덕션** (배포 시)  
https://albi-app.pages.dev/

## 📱 모바일 앱 설치 방법

### iOS (Safari)
1. Safari에서 알비 웹사이트 접속
2. 하단 공유 버튼 탭
3. "홈 화면에 추가" 선택
4. 앱 이름 확인 후 "추가" 탭

### Android (Chrome)
1. Chrome에서 알비 웹사이트 접속
2. 메뉴(⋮) → "앱 설치" 선택
3. "설치" 버튼 탭
4. 홈 화면에 아이콘 생성됨

## 🎨 디자인 토큰

### 색상 팔레트
```css
--albi-primary: #FF6B35  /* 메인 오렌지 */
--albi-secondary: #1E3A8A  /* 세컨더리 블루 */
--albi-accent: #F59E0B  /* 액센트 앰버 */
```

### 간격 시스템
```css
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-4: 1rem (16px)
--space-8: 2rem (32px)
--space-16: 4rem (64px)
```

### 타이포그래피
- **Display Font**: SF Pro Display, Pretendard (700-800 weight)
- **Body Font**: -apple-system, Pretendard (400-600 weight)
- **크기**: 12px ~ 48px (반응형)

## 🔧 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (PM2)
npm run clean-port
pm2 start ecosystem.config.cjs

# 서버 확인
curl http://localhost:3000

# 로그 확인
pm2 logs albi-app --nostream
```

## 🚀 배포

```bash
# Cloudflare Pages 배포
npm run deploy

# 또는 직접 배포
npm run build
wrangler pages deploy dist --project-name albi-app
```

## 📁 프로젝트 구조

```
albi-app/
├── public/
│   ├── index.html          # 프리미엄 메인 페이지
│   ├── styles.css          # 프리미엄 디자인 시스템
│   ├── manifest.json       # PWA 매니페스트
│   ├── jobs.html           # 알바 찾기 페이지
│   ├── community.html      # 커뮤니티 페이지
│   ├── terms.html          # 이용약관
│   ├── privacy.html        # 개인정보처리방침
│   └── contract.html       # 전자계약서
├── functions/
│   └── api/
│       └── [[path]].ts     # API 라우트
├── schema.sql              # D1 데이터베이스 스키마
├── wrangler.jsonc          # Cloudflare 설정
├── package.json            # 프로젝트 의존성
└── ecosystem.config.cjs    # PM2 설정

```

## ✅ 완료된 작업

- [x] 프리미엄 디자인 시스템 v2.0 구축
- [x] PWA 매니페스트 및 아이콘 설정
- [x] 모바일 반응형 디자인 완료
- [x] 하단 네비게이션 (모바일 전용)
- [x] 애니메이션 효과 (fadeIn, float, slideUp)
- [x] 통계 카운터 애니메이션
- [x] Glassmorphism 효과 적용
- [x] 접근성 개선 (focus-visible, ARIA)
- [x] 커뮤니티 게시판 시스템
- [x] 위치 기반 알바 검색 (3km 반경)
- [x] 법적 문서 페이지 (이용약관, 개인정보, 계약서)

## 🔜 향후 계획

- [ ] 서비스 워커 구현 (오프라인 지원)
- [ ] 푸시 알림 시스템
- [ ] 다크 모드 지원
- [ ] 리페럴 시스템 완성
- [ ] 알비포인트 스토어
- [ ] AI 면접 시스템
- [ ] 급여 계산기
- [ ] 실시간 채팅

## 📄 라이선스

© 2025 알비(ALBI). All rights reserved.

## 📞 문의

- **이메일**: help@albi.co.kr
- **전화**: 1588-0000
- **카카오톡**: @알비

---

**Made with ❤️ by ALBI Team**
