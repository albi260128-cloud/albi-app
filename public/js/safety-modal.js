/**
 * 알비 체험 안전 약속 모달 시스템
 * 
 * 사용법:
 * 1. HTML에 스크립트 추가: <script src="/js/safety-modal.js"></script>
 * 2. 모달 열기: safetyModal.open('홍대 카페', () => { console.log('동의 완료!'); });
 * 3. 모달 닫기: safetyModal.close();
 * 
 * @class SafetyAgreementModal
 * @version 1.0.0
 */

class SafetyAgreementModal {
  constructor() {
    this.agreements = {
      noWork: false,
      refuseWork: false,
      noTouch: false,
      emergency: false
    };
    this.onConfirmCallback = null;
    this.isInitialized = false;
  }

  /**
   * 모달 초기화
   * 페이지 로드 시 자동으로 호출됨
   */
  init() {
    if (this.isInitialized) {
      console.warn('SafetyAgreementModal already initialized');
      return;
    }

    // 모달 HTML 생성
    const modalHTML = `
      <div id="safetyModal" class="fixed inset-0 bg-black bg-opacity-60 hidden items-center justify-center z-50 p-4" style="z-index: 9999;">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          <!-- 헤더 -->
          <div class="text-center mb-6">
            <div class="text-6xl mb-4">⚠️</div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">중요! 반드시 지켜주세요</h2>
            <p class="text-gray-600 text-sm">
              <strong id="safetyJobTitle">카페 알바</strong> 체험을 위한 안전 약속
            </p>
          </div>

          <!-- 경고 메시지 -->
          <div class="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <div class="flex items-start space-x-2">
              <span class="text-red-500 text-xl">⚠️</span>
              <div class="text-sm text-red-800">
                <strong>위반 시 즉시 체험 중단!</strong><br>
                법적 문제가 발생할 수 있으니 반드시 지켜주세요.
              </div>
            </div>
          </div>

          <!-- 체크박스 목록 -->
          <div class="space-y-4 mb-8">
            <label class="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
              <input type="checkbox" id="agreeNoWork" class="mt-1 w-5 h-5 text-orange-500 rounded focus:ring-orange-500">
              <div class="flex-1">
                <span class="text-sm font-bold text-gray-800">
                  1시간 동안 절대 일하지 않고 <strong class="text-red-600">관찰만 하겠습니다</strong>
                </span>
                <p class="text-xs text-gray-500 mt-1">계산, 서빙, 청소 등 모든 업무 금지</p>
              </div>
            </label>

            <label class="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
              <input type="checkbox" id="agreeRefuseWork" class="mt-1 w-5 h-5 text-orange-500 rounded focus:ring-orange-500">
              <div class="flex-1">
                <span class="text-sm font-bold text-gray-800">
                  사장님이 업무를 지시하면 <strong class="text-red-600">정중히 거절하겠습니다</strong>
                </span>
                <p class="text-xs text-gray-500 mt-1">"죄송하지만 체험 중에는 관찰만 가능합니다"</p>
              </div>
            </label>

            <label class="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
              <input type="checkbox" id="agreeNoTouch" class="mt-1 w-5 h-5 text-orange-500 rounded focus:ring-orange-500">
              <div class="flex-1">
                <span class="text-sm font-bold text-gray-800">
                  매장 물건을 <strong class="text-red-600">함부로 만지지 않겠습니다</strong>
                </span>
                <p class="text-xs text-gray-500 mt-1">도구, 장비, 상품 등 모든 것 접촉 금지</p>
              </div>
            </label>

            <label class="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
              <input type="checkbox" id="agreeEmergency" class="mt-1 w-5 h-5 text-orange-500 rounded focus:ring-orange-500">
              <div class="flex-1">
                <span class="text-sm font-bold text-gray-800">
                  문제 발생 시 즉시 <strong class="text-red-600">긴급신고 버튼</strong>을 누르겠습니다
                </span>
                <p class="text-xs text-gray-500 mt-1">24시간 상담원이 즉시 대응합니다 (1588-0000)</p>
              </div>
            </label>
          </div>

          <!-- 버튼 -->
          <div class="flex space-x-3">
            <button id="safetyCancelBtn"
                    class="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">
              취소
            </button>
            <button id="safetyConfirmBtn"
                    class="flex-1 py-4 rounded-xl font-bold text-white bg-gray-300 cursor-not-allowed transition">
              모든 항목에 체크해주세요
            </button>
          </div>

          <!-- 추가 안내 -->
          <div class="mt-4 text-center">
            <p class="text-xs text-gray-500">
              🔒 안전한 체험을 위한 필수 약속입니다<br>
              위반 시 알비 서비스 이용이 제한될 수 있습니다
            </p>
          </div>
        </div>
      </div>
    `;

    // DOM에 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 이벤트 리스너 등록
    this.attachEventListeners();
    
    this.isInitialized = true;
    console.log('✅ SafetyAgreementModal initialized');
  }

  /**
   * 이벤트 리스너 등록
   */
  attachEventListeners() {
    // 체크박스 이벤트
    const checkboxes = ['agreeNoWork', 'agreeRefuseWork', 'agreeNoTouch', 'agreeEmergency'];
    checkboxes.forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.addEventListener('change', () => this.updateButtonState());
      }
    });

    // 취소 버튼
    const cancelBtn = document.getElementById('safetyCancelBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.close());
    }

    // 확인 버튼
    const confirmBtn = document.getElementById('safetyConfirmBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.confirm());
    }

    // 모달 배경 클릭 시 닫기
    const modal = document.getElementById('safetyModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target.id === 'safetyModal') {
          this.close();
        }
      });
    }

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('safetyModal');
        if (modal && !modal.classList.contains('hidden')) {
          this.close();
        }
      }
    });
  }

  /**
   * 버튼 상태 업데이트
   * 모든 체크박스가 선택되었는지 확인
   */
  updateButtonState() {
    const allChecked = 
      document.getElementById('agreeNoWork')?.checked &&
      document.getElementById('agreeRefuseWork')?.checked &&
      document.getElementById('agreeNoTouch')?.checked &&
      document.getElementById('agreeEmergency')?.checked;

    this.agreements.noWork = document.getElementById('agreeNoWork')?.checked || false;
    this.agreements.refuseWork = document.getElementById('agreeRefuseWork')?.checked || false;
    this.agreements.noTouch = document.getElementById('agreeNoTouch')?.checked || false;
    this.agreements.emergency = document.getElementById('agreeEmergency')?.checked || false;

    const button = document.getElementById('safetyConfirmBtn');
    if (!button) return allChecked;

    if (allChecked) {
      button.className = 'flex-1 py-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg transition cursor-pointer';
      button.innerHTML = '<span class="flex items-center justify-center space-x-2"><span>✓</span><span>동의하고 예약하기</span></span>';
    } else {
      button.className = 'flex-1 py-4 rounded-xl font-bold text-white bg-gray-300 cursor-not-allowed transition';
      button.textContent = '모든 항목에 체크해주세요';
    }

    return allChecked;
  }

  /**
   * 모달 열기
   * @param {string} jobTitle - 직무 제목 (예: "홍대 카페 알바")
   * @param {Function} onConfirm - 동의 완료 시 호출될 콜백 함수
   */
  open(jobTitle = '카페 알바', onConfirm = null) {
    if (!this.isInitialized) {
      this.init();
    }

    // 직무 제목 설정
    const titleElement = document.getElementById('safetyJobTitle');
    if (titleElement) {
      titleElement.textContent = jobTitle;
    }

    // 콜백 함수 저장
    this.onConfirmCallback = onConfirm;
    
    // 모달 표시
    const modal = document.getElementById('safetyModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      
      // body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    console.log('📋 SafetyAgreementModal opened for:', jobTitle);
  }

  /**
   * 모달 닫기
   */
  close() {
    const modal = document.getElementById('safetyModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      
      // body 스크롤 복원
      document.body.style.overflow = '';
    }
    
    // 체크박스 초기화
    ['agreeNoWork', 'agreeRefuseWork', 'agreeNoTouch', 'agreeEmergency'].forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = false;
      }
    });
    
    // 버튼 상태 업데이트
    this.updateButtonState();
    
    // 콜백 초기화
    this.onConfirmCallback = null;

    console.log('📋 SafetyAgreementModal closed');
  }

  /**
   * 동의 확인
   * 모든 항목이 체크되었을 때만 실행
   */
  confirm() {
    if (!this.updateButtonState()) {
      alert('모든 안전 약속에 동의해주세요.');
      return;
    }

    // 동의 내역 저장
    const agreementData = {
      timestamp: new Date().toISOString(),
      agreements: { ...this.agreements },
      jobTitle: document.getElementById('safetyJobTitle')?.textContent || ''
    };

    // LocalStorage에 저장
    try {
      const history = JSON.parse(localStorage.getItem('albi_safety_agreements') || '[]');
      history.unshift(agreementData);
      // 최대 10개만 보관
      if (history.length > 10) {
        history.splice(10);
      }
      localStorage.setItem('albi_safety_agreements', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save agreement history:', error);
    }

    console.log('✅ Safety agreement confirmed:', agreementData);

    // 모달 닫기
    this.close();

    // 콜백 실행
    if (this.onConfirmCallback && typeof this.onConfirmCallback === 'function') {
      this.onConfirmCallback(agreementData);
    }
  }

  /**
   * 동의 내역 조회
   * @returns {Array} 동의 내역 배열
   */
  getAgreementHistory() {
    try {
      return JSON.parse(localStorage.getItem('albi_safety_agreements') || '[]');
    } catch (error) {
      console.error('Failed to load agreement history:', error);
      return [];
    }
  }

  /**
   * 동의 내역 삭제
   */
  clearAgreementHistory() {
    try {
      localStorage.removeItem('albi_safety_agreements');
      console.log('✅ Agreement history cleared');
    } catch (error) {
      console.error('Failed to clear agreement history:', error);
    }
  }

  /**
   * 현재 동의 상태 확인
   * @returns {boolean} 모든 항목 동의 여부
   */
  isAllAgreed() {
    return Object.values(this.agreements).every(v => v === true);
  }

  /**
   * 모달 파괴
   * 필요 시 모달 제거
   */
  destroy() {
    const modal = document.getElementById('safetyModal');
    if (modal) {
      modal.remove();
    }
    this.isInitialized = false;
    console.log('🗑️ SafetyAgreementModal destroyed');
  }
}

// 전역 인스턴스 자동 생성 및 초기화
let safetyModal;

// DOM 로드 완료 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    safetyModal = new SafetyAgreementModal();
    safetyModal.init();
  });
} else {
  // 이미 로드 완료된 경우
  safetyModal = new SafetyAgreementModal();
  safetyModal.init();
}

// 모듈 방식 지원
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SafetyAgreementModal;
}
