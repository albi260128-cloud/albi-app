# 알비(ALBI) 디자인 시스템

## 🎨 브랜드 아이덴티티

### 마스코트
- **이름**: 알비 (ALBI)
- **컨셉**: 작은 날개가 달린 개미
- **의미**: "알바하는 벌개미" - 열심히 일하는 이미지
- **특징**: 
  - 귀엽고 친근한 느낌
  - 날개 펄럭이는 애니메이션
  - 브랜드의 친밀한 이미지 전달

### 컬러 팔레트

#### Primary Colors
- **ALBI Orange** (`#FF6B35`)
  - 메인 브랜드 컬러
  - 활력, 열정, 행동을 상징
  - CTA 버튼, 강조 요소에 사용

- **ALBI Blue** (`#004E89`)
  - 보조 브랜드 컬러
  - 신뢰, 안정감, 전문성 상징
  - 네비게이션, 정보성 요소에 사용

#### Accent Colors
- **ALBI Yellow** (`#FFB627`)
  - 포인트 & 보상 표시
  - 긍정적인 피드백, 알비포인트
  
- **Success Green** (`#06D6A0`)
  - 성공, 완료, 인증
  
- **Alert Red** (`#EF4444`)
  - 경고, 중요 알림

#### Gray Scale
- **Gray 900-100**: 텍스트, 배경, 구분선에 사용

---

## 📱 디자인 원칙

1. **심플함 (Simplicity)**
   - 불필요한 요소 제거
   - 핵심 기능 중심의 UI
   - 직관적인 레이아웃

2. **직관성 (Intuitiveness)**
   - 생각 없이 사용 가능한 인터페이스
   - 명확한 라벨과 아이콘
   - 일관된 패턴

3. **일관성 (Consistency)**
   - 모든 페이지에서 동일한 패턴
   - 통일된 컴포넌트 사용
   - 예측 가능한 동작

4. **반응성 (Responsiveness)**
   - 모바일 우선 설계
   - 유연한 그리드 시스템
   - 터치 최적화

---

## 🧩 컴포넌트 라이브러리

### Buttons

#### Primary Button
```html
<button class="btn btn-primary">
  <i class="fas fa-check"></i>
  <span>확인</span>
</button>
```
- **용도**: 주요 액션 (제출, 저장, 확인)
- **색상**: Orange gradient
- **효과**: Hover시 lift effect

#### Secondary Button
```html
<button class="btn btn-secondary">
  <span>취소</span>
</button>
```
- **용도**: 부가 액션
- **색상**: Blue

#### Outline Button
```html
<button class="btn btn-outline">
  <span>더보기</span>
</button>
```
- **용도**: 중요도가 낮은 액션
- **색상**: Border only

#### Sizes
- `.btn-sm`: 작은 버튼
- `.btn-lg`: 큰 버튼
- `.btn-full`: 전체 너비

---

### Cards

#### Job Card
```html
<div class="job-card">
  <div class="job-card-header">
    <!-- 제목, 회사, 시급 -->
  </div>
  <div class="job-card-footer">
    <!-- 태그, 조회수 -->
  </div>
</div>
```
- **용도**: 구인공고 목록
- **효과**: Hover시 shadow & lift

#### Post Card
```html
<div class="post-card">
  <div class="post-card-header">
    <!-- 카테고리, 제목 -->
  </div>
  <div class="post-card-content">
    <!-- 내용 미리보기 -->
  </div>
  <div class="post-card-footer">
    <!-- 작성자, 통계 -->
  </div>
</div>
```
- **용도**: 커뮤니티 게시글
- **효과**: Hover시 shadow

---

### Badges

#### Category Badge
```html
<span class="badge badge-orange">
  <i class="fas fa-coffee"></i>
  카페
</span>
```

#### Status Badge
```html
<span class="badge badge-green">
  <i class="fas fa-check"></i>
  완료
</span>
```

#### Point Badge
```html
<span class="albi-points">
  <i class="fas fa-coins"></i>
  <span>100P</span>
</span>
```

---

### Navigation

#### Top Navigation
```html
<nav class="navbar">
  <div class="container">
    <a href="/" class="navbar-brand">
      <img src="/albi-mascot.svg" class="albi-mascot">
      <span>알비</span>
    </a>
    <!-- 메뉴 항목 -->
  </div>
</nav>
```

#### Bottom Navigation
```html
<nav class="bottom-nav">
  <a href="/" class="nav-item active">
    <i class="nav-item-icon fas fa-home"></i>
    <span>홈</span>
  </a>
  <!-- 기타 메뉴 -->
</nav>
```

---

### Forms

#### Input Field
```html
<div class="form-group">
  <label class="form-label">제목</label>
  <input type="text" class="form-input" placeholder="제목을 입력하세요">
  <span class="form-hint">최소 5자 이상 입력해주세요</span>
</div>
```

#### Textarea
```html
<div class="form-group">
  <label class="form-label">내용</label>
  <textarea class="form-textarea"></textarea>
</div>
```

#### Select
```html
<select class="form-select">
  <option value="all">전체</option>
  <option value="cafe">카페</option>
</select>
```

---

## 🎬 애니메이션

### Hover Effects
- **Lift**: `transform: translateY(-2px)`
- **Shadow**: `box-shadow` increase
- **Color**: Slight lightening

### Loading States
- **Spinner**: Rotating mascot
- **Skeleton**: Pulse animation
- **Progress**: Linear gradient shift

### Transitions
- **Fast**: 150ms - 버튼, 링크
- **Base**: 200ms - 카드, 모달
- **Slow**: 300ms - 페이지 전환

---

## 📐 Spacing System

- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

---

## 📏 Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
```

### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

---

## 🖼️ Iconography

### Icon Library
- **Font Awesome 6.4.0** (Free)
- **일관된 크기**: 16px, 20px, 24px
- **일관된 간격**: 아이콘 + 텍스트는 8px gap

### Common Icons
- 홈: `fa-home`
- 검색: `fa-search`
- 알바: `fa-briefcase`
- 커뮤니티: `fa-comments`
- 스토어: `fa-store`
- 포인트: `fa-coins`
- 좋아요: `fa-heart`
- 댓글: `fa-comment`
- 조회: `fa-eye`

---

## 🌐 Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 768px) {
  /* 모바일 스타일 */
}

@media (min-width: 768px) {
  /* 태블릿 이상 */
}

@media (min-width: 1024px) {
  /* 데스크톱 */
}
```

---

## ✨ 마이크로 인터랙션

### Button Press
- Active state: `transform: scale(0.98)`
- Ripple effect on touch

### Card Tap
- Brief scale down
- Immediate shadow change

### Loading Feedback
- Spinner appears
- Disable interaction
- Color dim

### Success Feedback
- Green checkmark animation
- Toast notification
- Confetti for major actions

---

## 📄 페이지별 적용

### 메인 페이지 (`/`)
- Hero section with gradient animation
- Feature cards with hover effects
- Stats section
- Quick menu grid

### 알바 찾기 (`/jobs`)
- Filter chips
- Job cards with distance badges
- Map view toggle
- Bottom navigation

### 커뮤니티 (`/community.html`)
- Category filter chips
- Post cards
- Sort dropdown
- Infinite scroll support

### 공통 요소
- Top navigation with mascot
- Bottom navigation (4 items)
- Consistent spacing
- Unified color scheme

---

## 🎯 Best Practices

1. **Always use design system classes**
   - ✅ `<button class="btn btn-primary">`
   - ❌ `<button style="background: orange">`

2. **Maintain consistency**
   - Use same spacing throughout
   - Use same border radius
   - Use same shadows

3. **Prioritize accessibility**
   - Sufficient color contrast
   - Touch targets ≥ 44px
   - Clear focus states

4. **Optimize performance**
   - Use CSS variables
   - Minimize animations
   - Optimize images

---

## 📦 Files

- **Design System CSS**: `/public/styles.css`
- **Mascot SVG**: `/public/albi-mascot.svg`
- **Updated Pages**:
  - `/public/index.html`
  - `/public/jobs.html`
  - `/public/community.html`

---

**Last Updated**: 2026-01-28
**Version**: 1.0.0
**Made with ❤️ by ALBI Team**
