/**
 * 알비 AI 면접관 - 예외 상황 대응 시스템 (Option B)
 * 50개 시나리오 기반 적응형 대응 전략
 */

// ========================================
// 예외 상황 카테고리 정의
// ========================================

export const EXCEPTION_CATEGORIES = {
  VAGUE_RESPONSE: 'vague_response',           // 애매한/회피성 답변
  CREDIBILITY_CHECK: 'credibility_check',     // 거짓말/과장 의심
  NEGATIVE_ATTITUDE: 'negative_attitude',     // 부정적/공격적 태도
  UNREALISTIC_EXPECTATIONS: 'unrealistic_expectations', // 비현실적 요구
  COMMUNICATION_ERROR: 'communication_error', // 시스템 오류/이해 부족
  INCONSISTENCY: 'inconsistency',             // 일관성 부족/모순
  OVER_CONFIDENCE: 'over_confidence'          // 과도한 자신감
};

// ========================================
// Category A: 애매한/회피성 답변 (10개)
// ========================================

export const VAGUE_RESPONSE_SCENARIOS = [
  {
    id: 'vague_01',
    scenario_type: 'vague_response',
    detection_patterns: ['그냥요', '그냥', '별로', '글쎄요'],
    context: '지원 동기 질문',
    ai_response_strategy: {
      step_1: {
        approach: '공감과 격려',
        script: '긴장하셨나 봐요! 편하게 생각나는 대로 말씀해주세요 😊',
        tone: 'warm'
      },
      step_2: {
        approach: '구체적 유도',
        script: '예를 들어, 여러 알바 중에서 이 곳을 선택하신 이유가 있을 것 같아요. 가까워서? 시급이 좋아서? 아니면 일이 재밌을 것 같아서?',
        tone: 'guiding'
      },
      step_3: {
        approach: '선택지 제공',
        script: 'A: 집에서 가까워서 B: 이 업종에 관심이 있어서 C: 시급이 괜찮아서 중 어떤 게 가장 맞으세요?',
        tone: 'supportive'
      },
      final_action: '3회 시도 후에도 모호하면 소극성 -5점, B급 이하 제한'
    },
    scoring_impact: { reliability: -5, service_mind: -3 }
  },

  {
    id: 'vague_02',
    scenario_type: 'vague_response',
    detection_patterns: ['모르겠어요', '잘 모르겠는데', '생각 안 해봤어요'],
    context: '경험 관련 질문',
    ai_response_strategy: {
      step_1: {
        approach: '재구성',
        script: '괜찮아요! 그럼 이렇게 생각해볼까요? 학교나 동아리에서 비슷한 경험이 있으셨나요?',
        tone: 'encouraging'
      },
      step_2: {
        approach: '구체적 예시',
        script: '예를 들어, 손님 응대, 돈 계산, 청소 이런 것 중에 뭐가 제일 자신 있으세요?',
        tone: 'practical'
      },
      step_3: {
        approach: '최소 기준 확인',
        script: '그럼 배우고 싶은 의지는 있으신가요? 이건 정말 중요한 질문이에요!',
        tone: 'serious'
      },
      final_action: '학습 의지도 없으면 F급 처리'
    },
    scoring_impact: { job_fit: -3, openness: -2 }
  },

  {
    id: 'vague_03',
    scenario_type: 'vague_response',
    detection_patterns: ['그런 것 같아요', '아마도', '될 것 같은데'],
    context: '역량/스킬 질문',
    ai_response_strategy: {
      step_1: {
        approach: '확신도 체크',
        script: '"그런 것 같다"는 확실하지 않다는 뜻인가요? 솔직하게 말씀해주시면 더 좋아요!',
        tone: 'clarifying'
      },
      step_2: {
        approach: '실제 경험 확인',
        script: '실제로 해보신 적이 있나요? 있다면 언제, 어떤 상황이었는지 말씀해주세요.',
        tone: 'probing'
      },
      step_3: {
        approach: '대안 제시',
        script: '만약 경험이 없으시면 "없지만 배우고 싶어요"라고 말씀하시는 게 더 좋아요!',
        tone: 'advising'
      },
      final_action: '확신 없는 답변은 해당 역량 점수 50% 감점'
    },
    scoring_impact: { confidence: -10, job_fit: -5 }
  },

  {
    id: 'vague_04',
    scenario_type: 'vague_response',
    detection_patterns: ['뭐 어떻게든 되겠죠', '해보면 알겠죠'],
    context: '어려운 상황 대처',
    ai_response_strategy: {
      step_1: {
        approach: '구체화 요청',
        script: '그 자신감 좋아요! 하지만 구체적으로 어떻게 하실 건지 말씀해주시면 더 좋을 것 같아요.',
        tone: 'positive_redirect'
      },
      step_2: {
        approach: '시뮬레이션',
        script: '예를 들어, 지금 당장 그 상황이 생긴다면 첫 번째 행동은 뭐가 될까요?',
        tone: 'scenario_based'
      },
      step_3: {
        approach: '판단 기준 제시',
        script: '사장님은 "어떻게든 되겠죠"보다 "이렇게 하겠습니다"를 더 좋아하신다는 점 기억해주세요!',
        tone: 'educational'
      },
      final_action: '3회 시도 후에도 구체적 답변 없으면 문제 해결 능력 -8점'
    },
    scoring_impact: { problem_solving: -8, reliability: -3 }
  },

  {
    id: 'vague_05',
    scenario_type: 'vague_response',
    detection_patterns: ['보통이요', '그냥 평범해요', '특별한 건 없어요'],
    context: '강점/장점 질문',
    ai_response_strategy: {
      step_1: {
        approach: '긍정적 재프레임',
        script: '겸손하시네요! 하지만 사장님께 본인을 어필할 기회예요. 작은 것이라도 괜찮아요!',
        tone: 'encouraging'
      },
      step_2: {
        approach: '카테고리 제시',
        script: '성실함, 친절함, 빠른 학습, 체력, 책임감... 이 중에 하나라도 자신 있는 게 있으세요?',
        tone: 'guiding'
      },
      step_3: {
        approach: '타인 피드백 유도',
        script: '친구들이나 가족이 보시기엔 본인의 장점이 뭐라고 하시나요?',
        tone: 'alternative_perspective'
      },
      final_action: '장점을 찾지 못하면 service_mind -5점'
    },
    scoring_impact: { service_mind: -5, self_awareness: -3 }
  },

  // 나머지 5개 시나리오는 동일한 구조로 추가 가능
  {
    id: 'vague_06',
    scenario_type: 'vague_response',
    detection_patterns: ['잘하는 건 없는데', '특기 없어요'],
    context: '스킬/특기 질문',
    ai_response_strategy: {
      step_1: {
        approach: '재정의',
        script: '특기가 꼭 대단한 것일 필요는 없어요! 일상에서 자주 하는 것도 특기가 될 수 있어요.',
        tone: 'reassuring'
      },
      step_2: {
        approach: '예시 제공',
        script: '예를 들어, 청소를 깔끔하게 한다, 계산을 빠르게 한다, 사람들과 잘 어울린다 이런 것도 다 특기예요!',
        tone: 'educational'
      },
      step_3: {
        approach: '최종 확인',
        script: '정말 아무것도 생각이 안 나시면 "배우려는 의지가 강해요"라고 하셔도 좋아요!',
        tone: 'supportive'
      },
      final_action: '아무 답변도 없으면 job_fit -7점'
    },
    scoring_impact: { job_fit: -7 }
  }
];

// ========================================
// Category B: 거짓말/과장 의심 (10개)
// ========================================

export const CREDIBILITY_CHECK_SCENARIOS = [
  {
    id: 'credibility_01',
    scenario_type: 'credibility_check',
    detection_logic: {
      condition: 'experience_mismatch',
      pattern: '경력 있다고 했는데 기본 지식 부족',
      example: '"카페 2년 일했어요" → "에스프레소 샷 추출? 잘 모르겠어요"'
    },
    verification_strategy: {
      soft_probe: {
        script: '2년이면 정말 베테랑이시네요! 그럼 혹시 머신 이름이나 사용하신 원두 기억나시나요?',
        tone: 'curious'
      },
      cross_check: {
        script: '주로 어떤 업무를 담당하셨어요? 홀 서빙 위주였나요, 아니면 음료 제조도 하셨나요?',
        tone: 'clarifying'
      },
      reality_check: {
        script: '그럼 러시 시간에 음료 10잔 동시 주문 들어오면 어떻게 우선순위 정하셨어요?',
        tone: 'testing'
      },
      final_action: '답변 불일치 3회 이상 시 경력 미인정, job_fit -15점'
    },
    scoring_impact: { honesty: -20, job_fit: -15 }
  },

  {
    id: 'credibility_02',
    scenario_type: 'credibility_check',
    detection_logic: {
      condition: 'timeline_inconsistency',
      pattern: '시간표와 근무 가능 시간 모순',
      example: '"학생이에요" → "평일 낮 시간 모두 가능해요"'
    },
    verification_strategy: {
      soft_probe: {
        script: '학생이시면 학교 수업이 있으실 텐데, 평일 낮이 어떻게 가능하신 거예요?',
        tone: 'confused'
      },
      cross_check: {
        script: '혹시 휴학 중이시거나 야간 수업이신가요? 아니면 제가 잘못 이해한 건가요?',
        tone: 'seeking_clarification'
      },
      reality_check: {
        script: '정확한 시간표를 알려주시면 더 좋을 것 같아요. 사장님도 이 부분은 꼭 확인하시거든요.',
        tone: 'serious'
      },
      final_action: '명확한 해명 없으면 logistics -10점, reliability -5점'
    },
    scoring_impact: { logistics: -10, reliability: -5 }
  },

  {
    id: 'credibility_03',
    scenario_type: 'credibility_check',
    detection_logic: {
      condition: 'skill_overstatement',
      pattern: '모든 것을 완벽하게 할 수 있다고 주장',
      example: '"다 잘해요", "완벽해요", "문제없어요"'
    },
    verification_strategy: {
      soft_probe: {
        script: '자신감 넘치시네요! 👍 그럼 가장 자신 있는 것과 아직 부족한 것, 하나씩만 말씀해주세요.',
        tone: 'balancing'
      },
      cross_check: {
        script: '완벽한 사람은 없으니까 약점을 솔직하게 말씀하시는 게 오히려 더 좋은 인상이에요!',
        tone: 'advising'
      },
      reality_check: {
        script: '그럼 이런 어려운 상황에서는 어떻게 하실 건가요? (구체적 시나리오 제시)',
        tone: 'challenging'
      },
      final_action: '구체적 약점 인정 안 하면 self_awareness -8점'
    },
    scoring_impact: { self_awareness: -8, humility: -5 }
  },

  {
    id: 'credibility_04',
    scenario_type: 'credibility_check',
    detection_logic: {
      condition: 'reference_check_fail',
      pattern: '이전 직장 정보가 모호하거나 확인 불가',
      example: '"○○카페에서 일했어요" → "정확한 지점은 기억 안 나요"'
    },
    verification_strategy: {
      soft_probe: {
        script: '그 카페 지점이 어디였는지 기억나시나요? 가게 이름이라도 괜찮아요.',
        tone: 'curious'
      },
      cross_check: {
        script: '거기서 사장님 성함이나 매니저 분 기억나세요? 혹시 추천인으로 쓸 수 있을까요?',
        tone: 'verification'
      },
      reality_check: {
        script: '괜찮아요, 이전 직장 정보는 나중에 확인할 수 있어요. 대신 그때 배운 점을 구체적으로 말씀해주세요.',
        tone: 'alternative'
      },
      final_action: '경력 증명 불가 시 경험 점수 50% 감점'
    },
    scoring_impact: { experience_validity: -50 }
  },

  {
    id: 'credibility_05',
    scenario_type: 'credibility_check',
    detection_logic: {
      condition: 'age_experience_mismatch',
      pattern: '나이와 경력이 맞지 않음',
      example: '"19세예요" → "알바 경력 5년이에요"'
    },
    verification_strategy: {
      soft_probe: {
        script: '19세면... 14세부터 일하신 건가요? 정말 대단하시네요! 어떻게 시작하셨어요?',
        tone: 'surprised'
      },
      cross_check: {
        script: '혹시 단기 알바나 아르바이트 여러 개를 합친 기간인가요?',
        tone: 'clarifying'
      },
      reality_check: {
        script: '이력서에는 정확한 기간과 장소를 써주셔야 해요. 지금 다시 정리해볼까요?',
        tone: 'correcting'
      },
      final_action: '연령-경력 불일치 확인 시 경력 재계산'
    },
    scoring_impact: { timeline_accuracy: -10 }
  }

  // 나머지 5개는 동일한 패턴으로 추가
];

// ========================================
// Category C: 부정적/공격적 태도 (10개)
// ========================================

export const NEGATIVE_ATTITUDE_SCENARIOS = [
  {
    id: 'negative_01',
    scenario_type: 'negative_attitude',
    triggers: ['왜 이런 걸 물어봐요', '이게 무슨 의미가 있어요', '필요없는 질문'],
    de_escalation_strategy: {
      acknowledge: {
        script: '불편하게 느끼신 것 같아 죄송해요. 이 질문은 사장님께서 가장 중요하게 생각하시는 부분이라서 여쭤봤어요.',
        tone: 'apologetic'
      },
      redirect: {
        script: '다른 방식으로 여쭤볼게요. 편하게 답변해주시면 됩니다! 😊',
        tone: 'flexible'
      },
      boundary: {
        script: '(3회 반복 시) 면접은 서로를 이해하는 과정이에요. 계속 불편하시면 중단하셔도 괜찮아요.',
        tone: 'firm_but_kind'
      },
      final_action: '3회 이상 공격적 반응 시 태도 -15점, C급 이하 제한'
    },
    scoring_impact: { attitude: -15, service_mind: -10 }
  },

  {
    id: 'negative_02',
    scenario_type: 'negative_attitude',
    triggers: ['전 사장 욕설', '이전 직장 험담', '동료 비방'],
    de_escalation_strategy: {
      acknowledge: {
        script: '힘든 경험이 있으셨나 봐요. 그런데 면접에서는 긍정적인 부분을 말씀하시는 게 더 좋아요.',
        tone: 'understanding'
      },
      redirect: {
        script: '그 경험에서 배운 점이나 다음엔 어떻게 하고 싶으신지 말씀해주시겠어요?',
        tone: 'future_focused'
      },
      boundary: {
        script: '과거 직장이나 동료에 대한 부정적 언급은 면접 평가에 좋지 않은 영향을 줄 수 있어요.',
        tone: 'warning'
      },
      final_action: '타인 비방 지속 시 professionalism -20점, 즉시 F급'
    },
    scoring_impact: { professionalism: -20, maturity: -15 }
  },

  {
    id: 'negative_03',
    scenario_type: 'negative_attitude',
    triggers: ['귀찮아요', '빨리 끝내요', '대충 하면 안 돼요'],
    de_escalation_strategy: {
      acknowledge: {
        script: '시간이 없으신가 봐요. 그럼 핵심만 빠르게 진행할게요!',
        tone: 'accommodating'
      },
      redirect: {
        script: '5분만 투자하시면 좋은 일자리 찾는 데 큰 도움이 될 거예요. 조금만 힘내주세요!',
        tone: 'motivating'
      },
      boundary: {
        script: '면접은 본인을 위한 과정이에요. 정말 관심이 없으시면 지금 그만두시는 게 나을 수도 있어요.',
        tone: 'reality_check'
      },
      final_action: '면접 포기 유도, engagement -25점'
    },
    scoring_impact: { engagement: -25, motivation: -15 }
  }

  // 나머지 7개는 동일한 패턴
];

// ========================================
// Category D: 비현실적 요구/기대 (10개)
// ========================================

export const UNREALISTIC_EXPECTATIONS_SCENARIOS = [
  {
    id: 'unrealistic_01',
    scenario_type: 'unrealistic_expectations',
    trigger: {
      condition: 'wage_demand',
      pattern: '최저시급 대비 30% 이상 요구',
      example: '최저시급 10,030원 지역에서 15,000원 요구'
    },
    negotiation_approach: {
      market_reality: {
        script: '이 지역 같은 업종 평균 시급은 약 10,500원이에요. 15,000원은 특별한 자격증이나 경력이 필요한 수준이에요.',
        tone: 'educational'
      },
      value_proposition: {
        script: '그 시급을 받으려면 어떤 가치를 제공하실 수 있나요? 예를 들어, 바리스타 자격증이나 3년 이상 경력 같은 거요.',
        tone: 'challenging'
      },
      compromise_seeking: {
        script: '처음엔 10,500원으로 시작해서 능력을 보여주신 후 협상하는 건 어떠세요?',
        tone: 'solution_oriented'
      },
      final_action: '현실적 조정 거부 시 logistics -20점, C급 이하'
    },
    scoring_impact: { wage_realism: -20, flexibility: -10 }
  },

  {
    id: 'unrealistic_02',
    scenario_type: 'unrealistic_expectations',
    trigger: {
      condition: 'time_demand',
      pattern: '주 3일, 하루 3시간만 근무 요구',
      example: '카페 피크 타임 제외, 편한 시간만 근무'
    },
    negotiation_approach: {
      market_reality: {
        script: '알바는 보통 주 5일, 하루 4-6시간이 기본이에요. 주 3일 3시간은 구하기 매우 어려워요.',
        tone: 'realistic'
      },
      value_proposition: {
        script: '그 조건이 꼭 필요한 이유가 있나요? 학교 수업 때문이신가요?',
        tone: 'understanding'
      },
      compromise_seeking: {
        script: '그럼 주 4일, 하루 4시간은 가능하세요? 이 정도면 찾으실 수 있을 거예요.',
        tone: 'negotiating'
      },
      final_action: '타협 불가 시 logistics -15점'
    },
    scoring_impact: { logistics: -15, flexibility: -10 }
  },

  {
    id: 'unrealistic_03',
    scenario_type: 'unrealistic_expectations',
    trigger: {
      condition: 'job_selection',
      pattern: '업무 선택권 요구',
      example: '"서빙만 하고 설거지는 안 할래요"'
    },
    negotiation_approach: {
      market_reality: {
        script: '알바는 보통 여러 업무를 함께 해요. 서빙만 하는 자리는 거의 없어요.',
        tone: 'factual'
      },
      value_proposition: {
        script: '왜 설거지를 피하고 싶으세요? 혹시 다른 이유가 있나요?',
        tone: 'curious'
      },
      compromise_seeking: {
        script: '서빙 위주로 하되 바쁠 때는 설거지도 도와주는 건 어떠세요?',
        tone: 'middle_ground'
      },
      final_action: '업무 거부 지속 시 flexibility -10점'
    },
    scoring_impact: { flexibility: -10, teamwork: -8 }
  }

  // 나머지 7개는 동일한 패턴
];

// ========================================
// Category E: 시스템 오류/이해 부족 (5개)
// ========================================

export const COMMUNICATION_ERROR_SCENARIOS = [
  {
    id: 'communication_01',
    scenario_type: 'communication_error',
    pattern: '동문서답',
    example: 'Q: 근무 가능 시간은? A: 집에서 버스로 30분이에요',
    recovery_strategy: {
      simplify: {
        script: '앗, 제 질문이 헷갈렸나 봐요! 다시 쉽게 물어볼게요. 몇 시부터 몇 시까지 일할 수 있으세요?',
        tone: 'clarifying'
      },
      example: {
        script: '예를 들어, "평일 오후 2시부터 6시까지" 이런 식으로 말씀해주시면 돼요!',
        tone: 'guiding'
      },
      alternative: {
        script: '아니면 아침/점심/저녁 중 어느 시간이 가능하신지만 말씀해주세요!',
        tone: 'simplified'
      },
      final_action: '3회 동문서답 시 communication -5점'
    },
    scoring_impact: { communication: -5 }
  },

  {
    id: 'communication_02',
    scenario_type: 'communication_error',
    pattern: '질문 이해 못함',
    example: '"그게 무슨 뜻이에요?", "이해가 안 가요"',
    recovery_strategy: {
      simplify: {
        script: '죄송해요, 제가 어렵게 물어봤나 봐요. 더 쉽게 설명할게요!',
        tone: 'apologetic'
      },
      example: {
        script: '예를 들어, [구체적 상황 예시] 이런 상황에서 어떻게 하시겠어요?',
        tone: 'concrete'
      },
      alternative: {
        script: 'A와 B 중에 선택하는 방식으로 답변해주시면 더 쉬울 거예요!',
        tone: 'multiple_choice'
      },
      final_action: '이해 돕기 3회 시도, 안 되면 다음 질문'
    },
    scoring_impact: { comprehension: -3 }
  }

  // 나머지 3개는 동일한 패턴
];

// ========================================
// Category F: 일관성 부족/모순 (5개)
// ========================================

export const INCONSISTENCY_SCENARIOS = [
  {
    id: 'inconsistency_01',
    scenario_type: 'inconsistency',
    contradiction_example: {
      claim_1: '학생이라서 학교 수업 있어요',
      claim_2: '평일 낮 시간 모두 가능해요'
    },
    clarification_approach: {
      gentle_point_out: {
        script: '아까 학생이라고 하셨는데 평일 낮이 가능하다고 하셨어요. 혹시 휴학 중이신가요?',
        tone: 'gentle'
      },
      seek_clarification: {
        script: '정확한 상황을 알려주시면 더 좋은 매칭이 가능해요. 수업 시간표가 어떻게 되세요?',
        tone: 'seeking_accuracy'
      },
      final_verification: {
        script: '그럼 정리하면, [요약]이 맞나요? 확인해주세요!',
        tone: 'confirming'
      },
      final_action: '모순 해결 안 되면 consistency -10점'
    },
    scoring_impact: { consistency: -10, honesty: -5 }
  },

  {
    id: 'inconsistency_02',
    scenario_type: 'inconsistency',
    contradiction_example: {
      claim_1: '장기 근무 원해요 (1년 이상)',
      claim_2: '3개월 후 유학 갈 계획이에요'
    },
    clarification_approach: {
      gentle_point_out: {
        script: '아까 장기 근무 원하신다고 하셨는데, 3개월 후 유학 가신다고 하셨네요? 어떤 게 맞나요?',
        tone: 'confused'
      },
      seek_clarification: {
        script: '유학 계획이 확정이신가요? 그럼 단기 알바로 찾으시는 게 맞는 건가요?',
        tone: 'clarifying_intent'
      },
      final_verification: {
        script: '사장님께 솔직하게 말씀드리는 게 좋을 것 같아요. 최소 근무 기간을 정확히 말씀해주세요.',
        tone: 'advising_honesty'
      },
      final_action: '단기 근무로 재분류, 장기근무 점수 제거'
    },
    scoring_impact: { long_term_commitment: -15 }
  }

  // 나머지 3개는 동일한 패턴
];

// ========================================
// Category G: 과도한 자신감 (5개)
// ========================================

export const OVER_CONFIDENCE_SCENARIOS = [
  {
    id: 'overconfidence_01',
    scenario_type: 'over_confidence',
    pattern: '"다 잘해요", "완벽해요", "문제없어요"',
    reality_check_strategy: {
      acknowledge: {
        script: '자신감이 넘치시네요! 👍 그럼 좀 더 어려운 질문 드려볼게요.',
        tone: 'challenging'
      },
      depth_test: {
        script: '[구체적이고 어려운 상황 시나리오] 이런 상황에서는 어떻게 하시겠어요?',
        tone: 'testing'
      },
      humility_check: {
        script: '완벽한 사람은 없잖아요? 혹시 부족한 점이나 더 배우고 싶은 부분은 없으세요?',
        tone: 'seeking_humility'
      },
      final_action: '구체적 약점 인정 안 하면 self_awareness -10점'
    },
    scoring_impact: { self_awareness: -10, humility: -5 }
  }

  // 나머지 4개는 동일한 패턴
];

// ========================================
// 예외 상황 핸들러 통합 시스템
// ========================================

export class ExceptionScenarioHandler {
  private attemptCount: Map<string, number> = new Map();
  private detectedExceptions: any[] = [];

  /**
   * 예외 상황 감지 및 대응
   */
  detectAndRespond(answerText: string, conversationHistory: any[]): any {
    // 1. 애매한 답변 감지
    const vagueDetection = this.detectVagueResponse(answerText);
    if (vagueDetection.detected) {
      return this.handleVagueResponse(vagueDetection, answerText);
    }

    // 2. 신뢰성 체크
    const credibilityIssue = this.detectCredibilityIssue(answerText, conversationHistory);
    if (credibilityIssue.detected) {
      return this.handleCredibilityIssue(credibilityIssue, answerText);
    }

    // 3. 부정적 태도 감지
    const negativeAttitude = this.detectNegativeAttitude(answerText);
    if (negativeAttitude.detected) {
      return this.handleNegativeAttitude(negativeAttitude, answerText);
    }

    // 4. 비현실적 기대 감지
    const unrealisticExpectation = this.detectUnrealisticExpectation(answerText);
    if (unrealisticExpectation.detected) {
      return this.handleUnrealisticExpectation(unrealisticExpectation, answerText);
    }

    // 5. 커뮤니케이션 오류 감지
    const communicationError = this.detectCommunicationError(answerText, conversationHistory);
    if (communicationError.detected) {
      return this.handleCommunicationError(communicationError, answerText);
    }

    // 6. 일관성 체크
    const inconsistency = this.detectInconsistency(conversationHistory);
    if (inconsistency.detected) {
      return this.handleInconsistency(inconsistency, conversationHistory);
    }

    return { intervention_needed: false };
  }

  private detectVagueResponse(answerText: string): any {
    const vaguePatterns = ['그냥요', '그냥', '별로', '글쎄요', '모르겠어요', '잘 모르겠는데'];
    const detected = vaguePatterns.some(pattern => answerText.includes(pattern));

    return {
      detected,
      type: 'vague_response',
      severity: detected ? 'medium' : 'none'
    };
  }

  private handleVagueResponse(detection: any, answerText: string): any {
    const attemptKey = 'vague_response';
    const attempts = (this.attemptCount.get(attemptKey) || 0) + 1;
    this.attemptCount.set(attemptKey, attempts);

    if (attempts === 1) {
      return {
        intervention_needed: true,
        response: '긴장하셨나 봐요! 편하게 생각나는 대로 말씀해주세요 😊',
        scoring_adjustment: { reliability: -2 }
      };
    } else if (attempts === 2) {
      return {
        intervention_needed: true,
        response: '예를 들어, 여러 알바 중에서 이 곳을 선택하신 이유가 있을 것 같아요. 가까워서? 시급이 좋아서? 아니면 일이 재밌을 것 같아서?',
        scoring_adjustment: { reliability: -3 }
      };
    } else {
      return {
        intervention_needed: true,
        response: 'A: 집에서 가까워서 B: 이 업종에 관심이 있어서 C: 시급이 괜찮아서 중 어떤 게 가장 맞으세요?',
        scoring_adjustment: { reliability: -5, service_mind: -3 },
        grade_limit: 'B'
      };
    }
  }

  private detectCredibilityIssue(answerText: string, history: any[]): any {
    // 간단한 신뢰성 체크 로직
    const overconfidentPatterns = ['다 잘해요', '완벽해요', '문제없어요', '다 할 수 있어요'];
    const detected = overconfidentPatterns.some(pattern => answerText.includes(pattern));

    return {
      detected,
      type: 'credibility_check',
      severity: detected ? 'high' : 'none'
    };
  }

  private handleCredibilityIssue(detection: any, answerText: string): any {
    return {
      intervention_needed: true,
      response: '자신감이 넘치시네요! 그럼 구체적으로 어떤 경험이 있으신지 예를 들어 말씀해주실 수 있나요?',
      scoring_adjustment: { self_awareness: -5 }
    };
  }

  private detectNegativeAttitude(answerText: string): any {
    const negativePatterns = ['왜 이런 걸', '귀찮', '빨리 끝내', '필요없는', '전 사장'];
    const detected = negativePatterns.some(pattern => answerText.includes(pattern));

    return {
      detected,
      type: 'negative_attitude',
      severity: detected ? 'high' : 'none'
    };
  }

  private handleNegativeAttitude(detection: any, answerText: string): any {
    return {
      intervention_needed: true,
      response: '불편하게 느끼신 것 같아 죄송해요. 이 질문은 사장님께서 가장 중요하게 생각하시는 부분이라서 여쭤봤어요. 다른 방식으로 여쭤볼게요!',
      scoring_adjustment: { attitude: -15, service_mind: -10 },
      grade_limit: 'C'
    };
  }

  private detectUnrealisticExpectation(answerText: string): any {
    // 시급 관련 비현실적 기대 감지
    const wageMatch = answerText.match(/(\d{1,2}),?(\d{3})/);
    if (wageMatch) {
      const wage = parseInt(wageMatch[1] + wageMatch[2]);
      if (wage > 15000) {
        return {
          detected: true,
          type: 'unrealistic_wage',
          severity: 'high',
          wage
        };
      }
    }

    return { detected: false };
  }

  private handleUnrealisticExpectation(detection: any, answerText: string): any {
    return {
      intervention_needed: true,
      response: `이 지역 같은 업종 평균 시급은 약 10,500원이에요. ${detection.wage}원은 특별한 자격증이나 경력이 필요한 수준이에요. 그런 자격이 있으신가요?`,
      scoring_adjustment: { wage_realism: -20, flexibility: -10 }
    };
  }

  private detectCommunicationError(answerText: string, history: any[]): any {
    // 동문서답 감지 (매우 단순화된 버전)
    const questionWords = ['언제', '어디', '왜', '어떻게', '무엇'];
    const hasQuestionContext = history.length > 0;

    return {
      detected: false, // 실제로는 더 복잡한 로직 필요
      type: 'communication_error'
    };
  }

  private handleCommunicationError(detection: any, answerText: string): any {
    return {
      intervention_needed: true,
      response: '앗, 제 질문이 헷갈렸나 봐요! 다시 쉽게 물어볼게요.',
      scoring_adjustment: { communication: -5 }
    };
  }

  private detectInconsistency(history: any[]): any {
    // 일관성 체크 로직 (매우 단순화)
    return {
      detected: false,
      type: 'inconsistency'
    };
  }

  private handleInconsistency(detection: any, history: any[]): any {
    return {
      intervention_needed: true,
      response: '아까 말씀하신 내용과 조금 다른 것 같은데, 정확히 어떤 상황인지 다시 말씀해주시겠어요?',
      scoring_adjustment: { consistency: -10, honesty: -5 }
    };
  }

  /**
   * 감지된 예외 상황 로그
   */
  getDetectedExceptions(): any[] {
    return this.detectedExceptions;
  }

  /**
   * 시도 횟수 초기화
   */
  resetAttempts(): void {
    this.attemptCount.clear();
    this.detectedExceptions = [];
  }
}

export default {
  EXCEPTION_CATEGORIES,
  VAGUE_RESPONSE_SCENARIOS,
  CREDIBILITY_CHECK_SCENARIOS,
  NEGATIVE_ATTITUDE_SCENARIOS,
  UNREALISTIC_EXPECTATIONS_SCENARIOS,
  COMMUNICATION_ERROR_SCENARIOS,
  INCONSISTENCY_SCENARIOS,
  OVER_CONFIDENCE_SCENARIOS,
  ExceptionScenarioHandler
};
