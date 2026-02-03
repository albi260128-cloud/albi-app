/**
 * 알비(ALBI) AI 면접 데이터베이스
 * 100+ 실전 면접 질문과 시나리오 기반 대화 트리
 */

// ========================================
// 업종별 실전 면접 질문 데이터베이스
// ========================================

export const INTERVIEW_QUESTIONS_DB = {
  // 카페 알바 면접
  cafe: [
    {
      id: 'cafe_1',
      question: '카페에서 일해보신 경험이 있으신가요? 어떤 업무를 하셨나요?',
      purpose: 'experience',
      followUp: {
        yes: '그때 가장 힘들었던 점과 보람을 느낀 점을 말씀해주세요.',
        no: '처음이시군요! 카페 일에서 가장 궁금하거나 걱정되는 부분이 있나요?'
      }
    },
    {
      id: 'cafe_2',
      question: '피크타임에 주문이 몰렸을 때, 어떻게 대응하실 건가요?',
      purpose: 'stress_handling',
      keywords: ['침착', '우선순위', '팀워크', '빠르게', '차근차근']
    },
    {
      id: 'cafe_3',
      question: '불친절한 고객을 만나면 어떻게 대처하시겠어요?',
      purpose: 'conflict_resolution',
      keywords: ['공감', '경청', '사과', '해결', '보고']
    },
    {
      id: 'cafe_4',
      question: '커피 메뉴를 외우는 게 자신 있으신가요? 학습 속도는 어떤 편인가요?',
      purpose: 'learning_speed',
      keywords: ['빠르다', '노력', '반복', '메모', '질문']
    },
    {
      id: 'cafe_5',
      question: '오픈이나 마감 시간에 근무 가능한가요?',
      purpose: 'schedule_flexibility',
      keywords: ['가능', '어렵', '조정', '시간']
    }
  ],

  // 편의점 알바 면접
  convenience: [
    {
      id: 'conv_1',
      question: '편의점은 혼자 근무하는 시간이 많은데, 괜찮으신가요?',
      purpose: 'independence',
      keywords: ['괜찮', '좋다', '불안', '혼자', '독립']
    },
    {
      id: 'conv_2',
      question: '야간 근무 가능하신가요? 밤 시간대에 집중력 유지는 어떤가요?',
      purpose: 'night_shift',
      keywords: ['가능', '괜찮', '힘들', '올빼미', '아침형']
    },
    {
      id: 'conv_3',
      question: '편의점 업무(계산, 진열, 청소, 택배 등)가 생각보다 많은데 괜찮으신가요?',
      purpose: 'multitasking',
      keywords: ['괜찮', '해봤', '자신', '배우고']
    },
    {
      id: 'conv_4',
      question: '취객이나 문제 고객을 만났을 때 어떻게 대처하시겠어요?',
      purpose: 'safety_awareness',
      keywords: ['경찰', '신고', '대응', '안전', '도움']
    },
    {
      id: 'conv_5',
      question: '매출 정산이나 재고 관리 같은 꼼꼼한 업무는 어떠신가요?',
      purpose: 'attention_to_detail',
      keywords: ['꼼꼼', '정확', '실수', '체크', '확인']
    }
  ],

  // 음식점 서빙 면접
  restaurant: [
    {
      id: 'rest_1',
      question: '서빙 경험이 있으신가요? 몇 테이블 정도 담당해보셨나요?',
      purpose: 'experience',
      keywords: ['있다', '없다', '테이블', '홀']
    },
    {
      id: 'rest_2',
      question: '무거운 물건을 나르는 것은 어떠신가요? 체력은 괜찮으신가요?',
      purpose: 'physical_ability',
      keywords: ['괜찮', '힘들', '체력', '운동']
    },
    {
      id: 'rest_3',
      question: '주방과 홀이 바쁠 때 소통이 중요한데, 팀워크는 어떠신가요?',
      purpose: 'teamwork',
      keywords: ['좋다', '협력', '소통', '함께']
    },
    {
      id: 'rest_4',
      question: '손님 주문을 잘못 받거나 음식이 늦게 나갔을 때 어떻게 대처하시겠어요?',
      purpose: 'problem_solving',
      keywords: ['사과', '확인', '해결', '보고']
    },
    {
      id: 'rest_5',
      question: '주말이나 공휴일에도 근무 가능하신가요?',
      purpose: 'schedule_flexibility',
      keywords: ['가능', '어렵', '조정', '주말']
    }
  ],

  // 배달 알바 면접
  delivery: [
    {
      id: 'deliv_1',
      question: '오토바이 면허가 있으신가요? 운전 경력은 얼마나 되시나요?',
      purpose: 'qualification',
      keywords: ['있다', '없다', '년', '개월']
    },
    {
      id: 'deliv_2',
      question: '배달 중 길을 잃거나 주소를 찾기 어려울 때 어떻게 하시겠어요?',
      purpose: 'problem_solving',
      keywords: ['지도', '전화', '확인', '길찾기']
    },
    {
      id: 'deliv_3',
      question: '비나 눈 오는 날씨에도 근무 가능하신가요?',
      purpose: 'weather_tolerance',
      keywords: ['가능', '힘들', '조심', '안전']
    },
    {
      id: 'deliv_4',
      question: '피크타임에 배달이 몰리면 어떻게 대처하시겠어요?',
      purpose: 'stress_handling',
      keywords: ['빠르게', '순서', '효율', '침착']
    },
    {
      id: 'deliv_5',
      question: '지리를 빠르게 외우는 편인가요? 지역에 익숙하신가요?',
      purpose: 'spatial_awareness',
      keywords: ['잘 외움', '익숙', '금방', '천천히']
    }
  ],

  // 매장 판매직 면접
  retail: [
    {
      id: 'retail_1',
      question: '고객에게 상품을 적극적으로 추천할 수 있으신가요?',
      purpose: 'sales_ability',
      keywords: ['좋아', '자신', '어렵', '괜찮']
    },
    {
      id: 'retail_2',
      question: '재고 정리나 진열 작업 같은 반복 업무는 어떠신가요?',
      purpose: 'routine_work',
      keywords: ['괜찮', '좋아', '지루', '필요']
    },
    {
      id: 'retail_3',
      question: '하루 종일 서서 일해야 하는데, 체력적으로 괜찮으신가요?',
      purpose: 'stamina',
      keywords: ['괜찮', '힘들', '익숙', '체력']
    },
    {
      id: 'retail_4',
      question: '환불이나 교환 요청 시 어떻게 대응하시겠어요?',
      purpose: 'customer_service',
      keywords: ['정책', '확인', '공감', '해결']
    },
    {
      id: 'retail_5',
      question: '유행이나 트렌드에 관심이 있으신가요?',
      purpose: 'interest',
      keywords: ['좋아', '관심', '따라가', '별로']
    }
  ],

  // 공통 필수 질문
  common: [
    {
      id: 'common_1',
      question: '간단하게 자기소개 부탁드릴게요!',
      purpose: 'introduction',
      keywords: ['학생', '경험', '성격', '관심']
    },
    {
      id: 'common_2',
      question: '우리 매장에 지원하게 된 이유가 무엇인가요?',
      purpose: 'motivation',
      keywords: ['가깝', '관심', '경험', '배우고']
    },
    {
      id: 'common_3',
      question: '본인의 가장 큰 장점은 무엇인가요?',
      purpose: 'strength',
      keywords: ['책임감', '성실', '빠른', '친절', '꼼꼼']
    },
    {
      id: 'common_4',
      question: '단점이 있다면 무엇인가요? 어떻게 개선하고 계신가요?',
      purpose: 'weakness',
      keywords: ['완벽', '조급', '꼼꼼', '노력', '개선']
    },
    {
      id: 'common_5',
      question: '근무 가능한 요일과 시간대를 알려주세요.',
      purpose: 'availability',
      keywords: ['평일', '주말', '오전', '오후', '야간']
    },
    {
      id: 'common_6',
      question: '대타 근무 요청이 있을 때 가능하신가요?',
      purpose: 'flexibility',
      keywords: ['가능', '어렵', '상황', '최대한']
    },
    {
      id: 'common_7',
      question: '희망 시급이 있으신가요?',
      purpose: 'salary_expectation',
      keywords: ['최저', '협의', '원', '적정']
    },
    {
      id: 'common_8',
      question: '출퇴근 소요 시간은 얼마나 되나요?',
      purpose: 'commute',
      keywords: ['분', '가깝', '버스', '도보']
    },
    {
      id: 'common_9',
      question: '언제부터 근무 시작 가능하신가요?',
      purpose: 'start_date',
      keywords: ['바로', '다음주', '협의', '조율']
    },
    {
      id: 'common_10',
      question: '최소 얼마나 일할 수 있으신가요? (근무 기간)',
      purpose: 'commitment',
      keywords: ['개월', '년', '학기', '장기']
    }
  ]
};

// ========================================
// 대화 시나리오 트리 (실전 대화 패턴)
// ========================================

export const CONVERSATION_SCENARIOS = {
  // 시나리오 1: 긴장한 초보 지원자
  nervous_beginner: {
    trigger: ['처음', '긴장', '불안', '걱정'],
    flow: [
      {
        ai: '처음이시라 긴장되시죠? 😊 괜찮아요, 편하게 대화한다고 생각하시면 돼요!',
        purpose: 'reassurance'
      },
      {
        ai: '알바가 처음이신가요? 아니면 이 업종이 처음이신가요?',
        purpose: 'clarification'
      },
      {
        ai: '좋아요! 그럼 가장 궁금하거나 걱정되는 부분을 먼저 이야기해볼까요?',
        purpose: 'engagement'
      }
    ]
  },

  // 시나리오 2: 자신감 넘치는 경력자
  confident_experienced: {
    trigger: ['해봤', '경험', '잘해', '자신'],
    flow: [
      {
        ai: '경험이 있으시군요! 그럼 이전에 어떤 일을 하셨는지 구체적으로 말씀해주세요.',
        purpose: 'detail'
      },
      {
        ai: '그 경험에서 가장 크게 배운 점이나 성장한 부분이 있다면요?',
        purpose: 'learning'
      },
      {
        ai: '이번에는 어떤 점을 더 발전시키고 싶으신가요?',
        purpose: 'motivation'
      }
    ]
  },

  // 시나리오 3: 조건 협의에 민감한 지원자
  condition_focused: {
    trigger: ['시급', '시간', '조건', '급여'],
    flow: [
      {
        ai: '근무 조건이 중요하시군요! 당연한 부분이에요. 😊',
        purpose: 'validation'
      },
      {
        ai: '희망하시는 시급 범위와 근무 가능한 시간대를 알려주세요.',
        purpose: 'negotiation'
      },
      {
        ai: '그 조건 외에 업무 환경에서 중요하게 생각하시는 게 있나요?',
        purpose: 'priorities'
      }
    ]
  },

  // 시나리오 4: 대인관계 걱정하는 지원자
  social_anxious: {
    trigger: ['사람', '어색', '조용', '혼자', '내성적'],
    flow: [
      {
        ai: '사람과의 관계가 조금 부담되시나요? 솔직하게 말씀해주셔서 좋아요!',
        purpose: 'empathy'
      },
      {
        ai: '팀으로 일하는 것과 혼자 집중하는 것 중 어느 게 더 편하신가요?',
        purpose: 'preference'
      },
      {
        ai: '손님 응대가 적은 포지션도 있는데, 관심 있으신가요?',
        purpose: 'solution'
      }
    ]
  },

  // 시나리오 5: 학습 의지 높은 지원자
  eager_learner: {
    trigger: ['배우고', '성장', '발전', '경험', '도전'],
    flow: [
      {
        ai: '배우려는 의지가 느껴져요! 정말 좋은 자세예요 ⭐',
        purpose: 'encouragement'
      },
      {
        ai: '이 알바를 통해 구체적으로 어떤 걸 배우고 싶으신가요?',
        purpose: 'goal_setting'
      },
      {
        ai: '새로운 것을 배울 때 어떤 방식이 가장 잘 맞으세요?',
        purpose: 'learning_style'
      }
    ]
  }
};

// ========================================
// 응답 분석 및 점수 매칭 시스템
// ========================================

export const RESPONSE_SCORING = {
  // 긍정 키워드별 점수
  positive: {
    responsibility: {
      keywords: ['책임감', '끝까지', '약속', '지키다', '성실'],
      score: 10,
      dimension: 'conscientiousness'
    },
    communication: {
      keywords: ['소통', '대화', '협력', '함께', '팀워크'],
      score: 10,
      dimension: 'agreeableness'
    },
    adaptability: {
      keywords: ['적응', '빠르게', '배우고', '유연', '도전'],
      score: 10,
      dimension: 'openness'
    },
    energy: {
      keywords: ['활발', '적극', '좋아', '즐거', '재밌'],
      score: 10,
      dimension: 'extraversion'
    },
    stability: {
      keywords: ['침착', '차분', '괜찮', '문제없', '관리'],
      score: 10,
      dimension: 'neuroticism'
    }
  },

  // 주의 키워드별 감점
  concerns: {
    commitment: {
      keywords: ['짧게', '일단', '생각해보고', '모르겠'],
      score: -5,
      dimension: 'commitment'
    },
    stress: {
      keywords: ['스트레스', '힘들', '압박', '불안'],
      score: -3,
      dimension: 'stress_tolerance'
    },
    conflict: {
      keywords: ['싫어', '갈등', '불편', '마찰'],
      score: -3,
      dimension: 'conflict'
    }
  }
};

// ========================================
// 업종별 필수 역량 매칭 테이블
// ========================================

export const JOB_REQUIREMENTS = {
  cafe: {
    essential: {
      communication: 8,      // 손님 응대
      multitasking: 7,       // 주문·제조·정리
      learning_speed: 7,     // 메뉴 암기
      teamwork: 8,           // 피크타임 협업
      stress_tolerance: 7    // 바쁜 시간대
    },
    preferred: {
      appearance: 6,         // 청결·단정
      flexibility: 6         // 시간 유연성
    }
  },

  convenience: {
    essential: {
      independence: 9,       // 혼자 근무
      attention_to_detail: 8,// 정산·재고
      multitasking: 8,       // 다양한 업무
      problem_solving: 7,    // 돌발 상황
      night_shift: 6         // 야간 근무
    },
    preferred: {
      physical_stamina: 6,   // 장시간 서있기
      safety_awareness: 7    // 안전 대응
    }
  },

  restaurant: {
    essential: {
      physical_ability: 8,   // 체력·무게
      teamwork: 9,           // 홀·주방 협업
      communication: 7,      // 손님·동료
      stress_tolerance: 8,   // 피크타임
      multitasking: 7        // 다테이블 관리
    },
    preferred: {
      flexibility: 7,        // 주말·공휴일
      memory: 6              // 주문 기억
    }
  },

  delivery: {
    essential: {
      driving_skill: 9,      // 운전 숙련도
      spatial_awareness: 8,  // 지리 파악
      independence: 8,       // 혼자 업무
      weather_tolerance: 7,  // 악천후
      time_management: 8     // 배달 시간
    },
    preferred: {
      problem_solving: 7,    // 주소 찾기
      customer_service: 6    // 친절
    }
  },

  retail: {
    essential: {
      customer_service: 9,   // 친절·응대
      sales_ability: 7,      // 상품 추천
      appearance: 8,         // 이미지
      stamina: 7,            // 장시간 서있기
      product_knowledge: 6   // 상품 지식
    },
    preferred: {
      trend_awareness: 6,    // 트렌드
      teamwork: 6            // 협업
    }
  }
};

// ========================================
// AI 피드백 템플릿
// ========================================

export const FEEDBACK_TEMPLATES = {
  strength: [
    '{name}님의 {strength} 역량이 정말 인상적이에요!',
    '{strength}이(가) 강점이시군요. 이 점이 {job}에서 큰 도움이 될 거예요.',
    '{strength} 부분에서 경험이 풍부하시네요!'
  ],
  
  improvement: [
    '{weakness} 부분은 조금 더 보완하면 좋을 것 같아요.',
    '{weakness}은(는) 일하면서 자연스럽게 개선할 수 있어요.',
    '{weakness}이(가) 걱정되신다면, 교육이 잘 되어 있는 곳을 추천드릴게요!'
  ],

  matching: [
    '{name}님께는 {job}을 추천드려요! {reason}',
    '분석 결과, {job}이(가) {name}님과 {percentage}% 매칭돼요.',
    '{name}님의 {strength}을(를) 살릴 수 있는 {job}이 적합해 보여요!'
  ]
};

export default {
  INTERVIEW_QUESTIONS_DB,
  CONVERSATION_SCENARIOS,
  RESPONSE_SCORING,
  JOB_REQUIREMENTS,
  FEEDBACK_TEMPLATES
};
