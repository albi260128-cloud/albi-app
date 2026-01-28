# SafetyAgreementModal 사용 가이드

## 개요
알비 체험 예약 시 반드시 동의해야 하는 법적 안전장치 모달 시스템입니다.

## 설치

### HTML에 스크립트 추가
```html
<script src="/js/safety-modal.js"></script>
```

## 기본 사용법

### 1. 기본 모달 열기
```javascript
// 가장 간단한 사용법
safetyModal.open();
```

### 2. 직무명과 함께 열기
```javascript
// 직무명을 지정하여 모달 열기
safetyModal.open('홍대 스타벅스 알바');
```

### 3. 콜백 함수와 함께 사용
```javascript
// 동의 완료 시 실행될 콜백 함수 지정
safetyModal.open('강남 편의점 알바', function(data) {
  console.log('✅ 동의 완료!', data);
  
  // 체험 예약 API 호출
  fetch('/api/experiences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job_id: 'job123',
      jobseeker_id: 'user456',
      scheduled_date: '2026-02-01',
      scheduled_time: '14:00',
      safety_agreement: data
    })
  });
});
```

### 4. 화살표 함수로 사용
```javascript
safetyModal.open('이태원 레스토랑', (data) => {
  alert('동의 완료!');
  // 다음 페이지로 이동
  window.location.href = '/experience?job=레스토랑';
});
```

## API 메서드

### open(jobTitle, onConfirm)
모달을 엽니다.

**파라미터:**
- `jobTitle` (string, optional): 직무 제목. 기본값: '카페 알바'
- `onConfirm` (function, optional): 동의 완료 시 실행될 콜백 함수

**예시:**
```javascript
safetyModal.open('홍대 카페', (data) => {
  console.log('동의 완료:', data);
});
```

### close()
모달을 닫습니다.

**예시:**
```javascript
safetyModal.close();
```

### isAllAgreed()
현재 모든 항목에 동의했는지 확인합니다.

**반환값:** `boolean`

**예시:**
```javascript
if (safetyModal.isAllAgreed()) {
  console.log('모두 동의됨');
}
```

### getAgreementHistory()
동의 내역을 조회합니다.

**반환값:** `Array<Object>` - 동의 내역 배열

**예시:**
```javascript
const history = safetyModal.getAgreementHistory();
console.log('총', history.length, '건의 동의 내역');
```

### clearAgreementHistory()
동의 내역을 삭제합니다.

**예시:**
```javascript
safetyModal.clearAgreementHistory();
```

### destroy()
모달을 완전히 제거합니다.

**예시:**
```javascript
safetyModal.destroy();
```

## 실전 예제

### 예제 1: 체험 예약 버튼
```html
<button onclick="startBooking()">체험 예약하기</button>

<script src="/js/safety-modal.js"></script>
<script>
function startBooking() {
  // 안전 동의 모달 열기
  safetyModal.open('홍대 스타벅스 알바', function(agreementData) {
    // 동의 완료 후 실행
    console.log('안전 약속 동의 완료!', agreementData);
    
    // 실제 예약 API 호출
    bookExperience(agreementData);
  });
}

function bookExperience(safetyData) {
  fetch('/api/experiences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job_id: 'job_123',
      jobseeker_id: 'user_456',
      scheduled_date: '2026-02-01',
      scheduled_time: '14:00',
      safety_agreement: safetyData
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('예약이 완료되었습니다!');
      window.location.href = '/experience';
    }
  });
}
</script>
```

### 예제 2: 여러 직무에서 재사용
```javascript
// 구인 공고 목록
const jobs = [
  { id: 1, title: '홍대 스타벅스' },
  { id: 2, title: '강남 편의점' },
  { id: 3, title: '이태원 레스토랑' }
];

// 각 직무마다 동일한 모달 사용
jobs.forEach(job => {
  document.getElementById(`book-${job.id}`).addEventListener('click', () => {
    safetyModal.open(job.title, (data) => {
      console.log(`${job.title} 예약 완료!`, data);
      // 예약 처리...
    });
  });
});
```

### 예제 3: React/Vue 컴포넌트에서 사용
```javascript
// React 예제
function BookingButton({ jobTitle, jobId }) {
  const handleBook = () => {
    safetyModal.open(jobTitle, (data) => {
      // API 호출
      api.bookExperience({
        jobId,
        safetyAgreement: data
      }).then(() => {
        alert('예약 완료!');
      });
    });
  };

  return <button onClick={handleBook}>예약하기</button>;
}
```

## 동의 데이터 구조

콜백 함수로 전달되는 `data` 객체 구조:

```javascript
{
  timestamp: "2026-01-28T21:15:30.123Z",
  agreements: {
    noWork: true,        // 일하지 않기
    refuseWork: true,    // 업무 거절
    noTouch: true,       // 물건 안 만지기
    emergency: true      // 긴급신고
  },
  jobTitle: "홍대 스타벅스 알바"
}
```

## LocalStorage 저장

동의 내역은 자동으로 LocalStorage에 저장됩니다:

**키:** `albi_safety_agreements`

**형식:** JSON 배열 (최대 10개)

**예시:**
```javascript
[
  {
    timestamp: "2026-01-28T21:15:30.123Z",
    agreements: { noWork: true, refuseWork: true, noTouch: true, emergency: true },
    jobTitle: "홍대 스타벅스 알바"
  },
  // ... 최대 10개
]
```

## 스타일 커스터마이징

모달은 Tailwind CSS를 사용합니다. 스타일을 변경하려면:

1. `public/js/safety-modal.js` 파일 수정
2. 클래스명 변경 또는 추가 CSS 작성

## 주의사항

1. ✅ **Tailwind CSS 필수**: 모달이 Tailwind CSS에 의존합니다
2. ✅ **전역 인스턴스**: `safetyModal` 변수가 자동으로 전역에 생성됩니다
3. ✅ **DOM 로드 후 사용**: DOMContentLoaded 이벤트 이후에 사용하세요
4. ✅ **단일 인스턴스**: 하나의 페이지에 하나의 모달만 사용됩니다

## 브라우저 지원

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 라이선스

MIT License

## 버전

현재 버전: **1.0.0**

## 문의

- 이메일: support@albi.co.kr
- GitHub: https://github.com/albi/safety-modal
