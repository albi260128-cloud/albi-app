/**
 * 알비 AI 면접관 - 프로페셔널 시스템
 * 4단계 논리 구조: DETECT → ANALYZE → PROBE → RECOMMEND
 */

// ========================================
// 평가 매트릭스 (Universal Scoring)
// ========================================

export const EVALUATION_MATRIX = {
  // 가중치
  weights: {
    reliability: 0.35,        // 성실성 (출근, 장기근무, 책임감)
    job_fit: 0.30,           // 직무적합성 (경험, 스킬, 학습능력)
    service_mind: 0.25,      // 서비스마인드 (소통, 고객응대, 팀워크)
    logistics: 0.10          // 근무조건매칭 (거리, 시간, 급여현실성)
  },

  // 최종 등급
  grades: {
    S: { min: 85, label: 'S급 (즉시전력)', color: 'gold' },
    A: { min: 70, label: 'A급 (추천)', color: 'green' },
    B: { min: 55, label: 'B급 (교육후가능)', color: 'blue' },
    C: { min: 0, label: 'C급 (부적합)', color: 'red' }
  }
};

// ========================================
// Critical 질문 매트릭스 (즉시 탈락 판별)
// ========================================

export const CRITICAL_QUESTIONS = {
  cafe: {
    weekend_work: {
      question: '카페는 주말과 공휴일이 제일 바쁜데, 주말 근무 가능하신가요?',
      fail_keywords: ['안 돼', '불가능', '싫어'],
      pass_keywords: ['가능', '괜찮', '할 수'],
      weight: 'high'
    },
    customer_complaint: {
      question: '음료를 만들었는데 손님이 "이거 맛이 이상한데요?"라고 하시면 어떻게 대응하시겠어요?',
      fail_keywords: ['제 잘못 아닌', '그냥 드세요', '몰라요'],
      pass_keywords: ['사과', '재제조', '확인', '교체'],
      weight: 'critical'
    }
  },

  convenience: {
    underage_sales: {
      question: '고등학생으로 보이는 손님이 담배를 달라고 하는데 신분증이 없다고 하시면 어떻게 하시겠어요?',
      fail_keywords: ['괜찮', '팔아', '되죠'],
      pass_keywords: ['신분증 필수', '판매 불가', '법적'],
      weight: 'critical'
    },
    night_safety: {
      question: '새벽 2시에 술 취한 손님이 계속 시비를 거시는데 혼자 근무 중이에요. 어떻게 하시겠어요?',
      fail_keywords: ['맞서', '말해', '상대'],
      pass_keywords: ['거리', '신고', '112', '안전'],
      weight: 'critical'
    }
  },

  restaurant: {
    weekend_work: {
      question: '음식점은 주말이 평일보다 3배 바쁜데, 주말 근무 가능하신가요?',
      fail_keywords: ['불가능', '안 돼', '주말은'],
      pass_keywords: ['가능', '괜찮', '할 수'],
      weight: 'high'
    },
    spill_accident: {
      question: '음식을 나르다가 실수로 손님 옷에 국물을 흘렸어요. 손님이 엄청 화가 나셨어요. 어떻게 하시겠어요?',
      fail_keywords: ['제 잘못 아니', '원래 그런', '몰라'],
      pass_keywords: ['즉시 사과', '물티슈', '세탁비', '매니저'],
      weight: 'critical'
    }
  },

  retail: {
    weekend_work: {
      question: '매장은 주말이 평일보다 2-3배 바빠요. 주말 근무 가능하세요?',
      fail_keywords: ['불가능', '안 돼'],
      pass_keywords: ['가능', '괜찮', '할 수'],
      weight: 'high'
    },
    refund_policy: {
      question: '손님이 영수증 없이 환불 요구하시면 어떻게 하시겠어요?',
      fail_keywords: ['안 된다고 거절', '절대 안 돼'],
      pass_keywords: ['규정', '설명', '매니저', '상의'],
      weight: 'high'
    }
  },

  fastfood: {
    hygiene_awareness: {
      question: '햄버거에 피클 빼달라는 주문을 깜빡했어요. 어떻게 하시겠어요?',
      fail_keywords: ['빼서 드림', '그냥'],
      pass_keywords: ['새로', '다시', '제조', '사과'],
      weight: 'critical'
    }
  }
};

// ========================================
// 업종별 완벽 면접 시나리오
// ========================================

export const PROFESSIONAL_SCENARIOS = {
  // ☕ 카페 알바
  cafe: {
    phases: [
      {
        phase: 1,
        name: '라포 형성 & 기본 역량 검증',
        questions: [
          {
            id: 'cafe_intro',
            question: '안녕하세요! 카페 알바에 지원해주셔서 감사해요 😊\n먼저 편하게 자기소개와 카페에 지원하신 이유를 말해주세요!',
            detect_points: ['동기의 진정성', '표현력'],
            follow_ups: {
              weak_motivation: '카페에서 일하면서 가장 기대하는 점이 뭐예요?',
              good: '좋아요! 그럼 카페 경험이 있으신가요?'
            }
          },
          {
            id: 'cafe_experience_expert',
            question: '카페 경력이 있으시군요! 어떤 머신을 사용해보셨고, 가장 자신 있는 음료가 뭔가요?',
            scoring: {
              S: ['라마르조꼬', '라떼아트', '분쇄도'],
              A: ['에스프레소 머신', '기본 음료'],
              B: ['버튼만', '기계 이름 몰라'],
              C: ['경력 있다고 했는데 기본 지식 전무']
            },
            probe: '스팀 밀크 만들 때 가장 중요하게 생각하는 포인트가 뭐예요?',
            probe_answer: ['온도 60-65도', '텍스처', '거품 조절']
          },
          {
            id: 'cafe_experience_beginner',
            question: '카페는 처음이시군요! 평소에 카페 자주 이용하시나요? 좋아하는 메뉴나 관심 있는 음료가 있나요?',
            detect_points: ['카페 문화 이해도', '관심도'],
            positive: ['구체적 메뉴 언급', '카페 분위기 이해'],
            negative: ['별로 안 가요', '관심 없어요']
          }
        ]
      },
      {
        phase: 2,
        name: '실무 능력 & 압박 상황 대처',
        questions: [
          {
            id: 'cafe_rush_hour',
            question: '카페에서 가장 바쁜 시간이 언제라고 생각하세요? 그때 주문이 10잔 밀렸을 때 어떻게 대처하시겠어요?',
            scoring: {
              S: ['음료별 묶어서', '스팀 동시', '대기시간 안내'],
              A: ['순서대로 정확하게', '양해 구함'],
              B: ['빨리빨리'],
              C: ['모르겠어요', '당황']
            },
            probe: '그 상황에서 손님이 "내 거 언제 나와요?"라고 화내시면 어떻게 하시겠어요?'
          },
          {
            id: 'cafe_complaint',
            question: '음료를 만들었는데 손님이 "이거 맛이 이상한데요?"라고 하시면 어떻게 대응하시겠어요?',
            critical: true,
            pass: ['즉시 사과', '상황 확인', '재제조', '매니저 보고'],
            fail: ['제 잘못 아닌', '그냥 드세요']
          },
          {
            id: 'cafe_closing',
            question: '카페 마감 청소 해보신 적 있으세요? 어떤 순서로 하는 게 효율적일까요?',
            scoring: {
              expert: ['머신 청소', '홀 정리', '바닥', '쓰레기'],
              beginner: ['대충 다 치움']
            }
          }
        ]
      },
      {
        phase: 3,
        name: '성실성 & 지속가능성 검증',
        questions: [
          {
            id: 'cafe_quit_reason',
            question: '이전 카페는 어떤 이유로 그만두셨어요?',
            red_flags: ['사장님 싫어서', '힘들어서', '재미없어서'],
            yellow_flags: ['동료와 안 맞아서'],
            green_flags: ['학교 시간표', '이사', '계약기간 만료']
          },
          {
            id: 'cafe_weekend',
            question: '카페는 주말과 공휴일이 제일 바쁜데, 주말 근무 가능하신가요?',
            critical: true,
            required: '주말 가능 (특히 토요일)',
            conditional: '한 쪽만 가능',
            fail: '주말은 안 돼요'
          },
          {
            id: 'cafe_commute',
            question: '집에서 매장까지 거리가 어떻게 되시고, 눈 오는 날이나 교통 파업 같은 상황에도 출근 가능하신가요?'
          },
          {
            id: 'cafe_duration',
            question: '최소 얼마나 오래 일하실 계획이세요?',
            scoring: {
              S: ['1년 이상', '구체적 계획'],
              A: ['6개월 이상'],
              B: ['3개월'],
              C: ['일단 해보고', '모르겠어요']
            }
          }
        ]
      },
      {
        phase: 4,
        name: '최종 종합 판단',
        questions: [
          {
            id: 'cafe_wage',
            question: '시급은 얼마 정도 생각하고 계세요?',
            realistic: '최저시급 ~ +500원 (경력 고려)',
            caution: '최저시급 +1000원 이상',
            unrealistic: '과도한 요구'
          },
          {
            id: 'cafe_questions',
            question: '마지막으로 저희 카페에 대해 궁금한 점 있으세요?',
            active: ['교육은 어떻게?', '메뉴는 몇 개?', '유니폼은?'],
            passive: ['급여일이 언제요?'],
            none: ['특별히 없어요']
          }
        ]
      }
    ],
    final_template: `면접 수고하셨습니다! 🎉

종합 평가 결과:
{analysis_summary}

**{grade} - {recommendation}**

사장님께 1시간 체험을 제안드리겠습니다.
특히 {focus_points}을(를) 확인해보시면 좋을 것 같아요! ✨`
  },

  // 🏪 편의점 알바
  convenience: {
    phases: [
      {
        phase: 1,
        name: '기본 적성 & 시간대 적합성',
        questions: [
          {
            id: 'conv_intro',
            question: '안녕하세요! 편의점 알바에 관심 가져주셔서 감사해요 😊\n편의점은 24시간 운영이라 야간 근무도 있는데, 어떤 시간대를 희망하시나요?',
            priority: {
              highest: '야간 가능',
              preferred: '주말 + 평일 저녁',
              limited: '평일 낮만',
              unsuitable: '시간 제약 많음'
            },
            probe: '야간 근무 시 혼자 있는 게 무섭거나 불안하지 않으세요?'
          },
          {
            id: 'conv_experience',
            question: '편의점 경력이 있으시다고 하셨는데, 어느 브랜드에서 주로 어떤 업무를 하셨나요?',
            verification: [
              '발주 해보신 적 있으세요? 어떤 기준으로 수량 정하셨어요?',
              '포스기 환불 처리나 상품권 판매도 해보셨나요?',
              '새벽에 물류 들어올 때 검수는 어떻게 하셨어요?'
            ],
            scoring: {
              expert: '구체적 업무 프로세스 설명',
              beginner: '계산만 했어요, 별로 어렵지 않았어요'
            }
          }
        ]
      },
      {
        phase: 2,
        name: '법적 준수 의식 & 위기 대응',
        questions: [
          {
            id: 'conv_underage_sales',
            question: '고등학생으로 보이는 손님이 담배를 달라고 하는데 신분증이 없다고 하시면 어떻게 하시겠어요?',
            critical: true,
            pass: ['신분증 없으면 판매 불가능'],
            fail: ['괜찮을 것 같은데', '그냥 팔아도 되죠'],
            probe: '손님이 "나 여기 단골인데!"라며 화내시면요?'
          },
          {
            id: 'conv_drunk_customer',
            question: '새벽 2시에 술 취한 손님이 계속 시비를 거시는데 혼자 근무 중이에요. 어떻게 하시겠어요?',
            critical: true,
            safe: ['거리 유지', '필요시 112 신고'],
            risky: ['대화로 해결'],
            dangerous: ['맞서서 말한다']
          },
          {
            id: 'conv_shortage',
            question: '계산이 안 맞았을 때는 어떻게 하시겠어요?',
            honest: ['사장님께 즉시 보고'],
            risky: ['제 돈으로 채운다']
          }
        ]
      },
      {
        phase: 3,
        name: '실무 능력 & 멀티태스킹',
        questions: [
          {
            id: 'conv_multitask',
            question: '편의점은 동시에 여러 일이 터져요. 물류 정리 중인데 계산대에 손님 3명이 줄 섰고, 동시에 튀김기 알람이 울리면 어떤 순서로 처리하시겠어요?',
            correct: '손님 계산(최우선) → 튀김기(안전/품질) → 물류(후순위)',
            incorrect: '순서 혼란'
          },
          {
            id: 'conv_friend_discount',
            question: '친한 친구가 와서 "조금만 깎아달라"고 하면 어떻게 하시겠어요?',
            pass: ['불가능하다고 설명'],
            fail: ['조금은 괜찮지 않나']
          },
          {
            id: 'conv_expiration',
            question: '편의점 도시락이나 삼각김밥 유통기한 관리는 어떻게 하는지 아세요?',
            knows: ['선입선출', '매일 체크', '폐기 처리'],
            honest: ['배우겠습니다']
          }
        ]
      }
    ]
  },

  // 🍽️ 음식점 (서빙) 알바
  restaurant: {
    phases: [
      {
        phase: 1,
        name: '체력 & 기본 적성 확인',
        questions: [
          {
            id: 'rest_intro',
            question: '안녕하세요! 저희 음식점에 관심 가져주셔서 감사해요 😊\n어떤 종류의 음식점인지 미리 알아보고 오셨나요?',
            active: ['메뉴', '매장 분위기'],
            passive: ['그냥 음식점']
          },
          {
            id: 'rest_stamina',
            question: '서빙은 생각보다 체력이 많이 들어요. 하루 몇 시간까지 서서 일할 수 있으세요?',
            sufficient: '6시간 이상',
            limited: '4시간 미만'
          },
          {
            id: 'rest_experience',
            question: '서빙 경력이 있으시군요! 동시에 몇 테이블 정도 담당하셨고, 가장 힘들었던 순간이 언제였나요?',
            expert: ['5-6테이블', '러시타임 멀티 오더'],
            beginner: ['2-3테이블', '별로 힘들지 않았어요']
          }
        ]
      },
      {
        phase: 2,
        name: '상황 대처 & 우선순위 판단',
        questions: [
          {
            id: 'rest_priority',
            question: '3개 테이블에서 동시에 호출 벨이 울렸어요.\nA테이블: 물 추가 요청\nB테이블: 추가 주문\nC테이블: "음식이 왜 안 나와요?" 불만\n어떤 순서로 대응하시겠어요?',
            correct: 'C테이블(불만) → B테이블(주문) → A테이블(물)',
            incorrect: '부른 순서대로',
            probe: 'C테이블에서 뭐라고 말씀드리시겠어요?'
          },
          {
            id: 'rest_spill',
            question: '음식을 나르다가 실수로 손님 옷에 국물을 흘렸어요. 손님이 엄청 화가 나셨어요. 어떻게 하시겠어요?',
            critical: true,
            perfect: ['즉시 사과', '물티슈', '세탁비', '매니저'],
            insufficient: ['죄송하다고만'],
            fail: ['제 잘못 아니에요', '원래 그런 옷']
          },
          {
            id: 'rest_table_ready',
            question: '바쁜 런치 시간에 예약 손님이 오셨는데 테이블이 아직 안 치워졌어요. 어떻게 하시겠어요?',
            expert: ['양해 구하고 빠르게 세팅'],
            beginner: ['기다려달라고만']
          }
        ]
      },
      {
        phase: 3,
        name: '팀워크 & 소통 능력',
        questions: [
          {
            id: 'rest_kitchen_stress',
            question: '주방에서 "빨리 가져가!"라고 소리치시면 기분 나쁘지 않으세요? 어떻게 하시겠어요?',
            mature: ['바쁘니까 그러시는 거라고 이해'],
            immature: ['기분 나쁠 것 같아요']
          },
          {
            id: 'rest_colleague_mistake',
            question: '동료가 실수했는데 손님이 본인한테 화내시면 어떻게 하시겠어요?',
            team_player: ['함께 사과하고 해결'],
            individualist: ['제 잘못 아니라고']
          }
        ]
      },
      {
        phase: 4,
        name: '위생 의식 & 근무 조건',
        questions: [
          {
            id: 'rest_hygiene',
            question: '음식점에서 가장 중요한 게 뭐라고 생각하세요?',
            correct: ['위생', '청결', '식품 안전'],
            incorrect: ['친절', '빠른 서비스']
          },
          {
            id: 'rest_floor_safety',
            question: '바닥에 음식이나 물이 흘렸을 때 어떻게 하시겠어요?',
            safe: ['바로 닦고 미끄럼 주의'],
            unsafe: ['나중에']
          },
          {
            id: 'rest_peak_time',
            question: '피크 시간대(런치 11-2시, 디너 6-9시) 근무 가능하세요?',
            critical: true,
            best: '둘 다 가능',
            conditional: '하나만 가능',
            fail: '둘 다 불가능'
          }
        ]
      }
    ]
  }
};

// ========================================
// AI 답변 분석 엔진
// ========================================

export class AnswerAnalyzer {
  /**
   * DETECT: 답변에서 핵심 키워드와 신호 포착
   */
  static detectSignals(answer: string, question_config: any): {
    keywords: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: 'high' | 'medium' | 'low';
    red_flags: string[];
  } {
    const lower = answer.toLowerCase();
    const detected = {
      keywords: [] as string[],
      sentiment: 'neutral' as 'positive' | 'neutral' | 'negative',
      confidence: 'medium' as 'high' | 'medium' | 'low',
      red_flags: [] as string[]
    };

    // 키워드 추출
    if (question_config.pass_keywords) {
      detected.keywords = question_config.pass_keywords.filter((k: string) => 
        lower.includes(k.toLowerCase())
      );
    }

    // Red Flag 감지
    if (question_config.fail_keywords) {
      detected.red_flags = question_config.fail_keywords.filter((k: string) =>
        lower.includes(k.toLowerCase())
      );
    }

    // 감정 분석
    const positive_words = ['좋아', '재밌', '흥미', '자신', '잘', '편해', '괜찮', '가능', '할 수'];
    const negative_words = ['싫어', '힘들', '불안', '걱정', '어렵', '부담', '불가능', '안 돼'];
    
    const pos_count = positive_words.filter(w => lower.includes(w)).length;
    const neg_count = negative_words.filter(w => lower.includes(w)).length;

    if (pos_count > neg_count) detected.sentiment = 'positive';
    else if (neg_count > pos_count) detected.sentiment = 'negative';

    // 확신도 분석
    if (lower.match(/확실|당연|물론|자신/)) detected.confidence = 'high';
    else if (lower.match(/아마|모르겠|생각해|글쎄/)) detected.confidence = 'low';

    return detected;
  }

  /**
   * ANALYZE: 업종별 중요도와 위험도 교차 분석
   */
  static analyzeImportance(
    signals: ReturnType<typeof AnswerAnalyzer.detectSignals>,
    question_config: any,
    job_type: string
  ): {
    score: number;
    importance: 'critical' | 'high' | 'medium' | 'low';
    pass: boolean;
    reason: string;
  } {
    const result = {
      score: 50,
      importance: 'medium' as 'critical' | 'high' | 'medium' | 'low',
      pass: true,
      reason: ''
    };

    // Critical 질문 체크
    if (question_config.critical) {
      result.importance = 'critical';
      
      if (signals.red_flags.length > 0) {
        result.pass = false;
        result.score = 0;
        result.reason = `즉시 탈락 사유: ${signals.red_flags.join(', ')}`;
        return result;
      }

      if (signals.keywords.length > 0) {
        result.score = 100;
        result.reason = '필수 기준 통과';
      } else {
        result.pass = false;
        result.score = 20;
        result.reason = '필수 키워드 미포함';
      }
      
      return result;
    }

    // 일반 질문 점수 계산
    if (question_config.scoring) {
      const scoring = question_config.scoring;
      
      // S급 답변 체크
      if (scoring.S && scoring.S.some((k: string) => signals.keywords.includes(k))) {
        result.score = 95;
        result.reason = 'S급 답변 (전문가 수준)';
      }
      // A급 답변
      else if (scoring.A && scoring.A.some((k: string) => signals.keywords.includes(k))) {
        result.score = 80;
        result.reason = 'A급 답변 (우수)';
      }
      // B급 답변
      else if (scoring.B && scoring.B.some((k: string) => signals.keywords.includes(k))) {
        result.score = 60;
        result.reason = 'B급 답변 (보통)';
      }
      // C급 답변
      else if (scoring.C && scoring.C.some((k: string) => signals.keywords.includes(k))) {
        result.score = 30;
        result.pass = false;
        result.reason = 'C급 답변 (부적합)';
      }
    }

    // 감정과 확신도 반영
    if (signals.sentiment === 'positive') result.score += 10;
    if (signals.sentiment === 'negative') result.score -= 10;
    if (signals.confidence === 'high') result.score += 5;
    if (signals.confidence === 'low') result.score -= 5;

    result.score = Math.max(0, Math.min(100, result.score));

    return result;
  }

  /**
   * PROBE: 상황별 맞춤 꼬리질문 생성
   */
  static generateProbe(
    analysis: ReturnType<typeof AnswerAnalyzer.analyzeImportance>,
    question_config: any
  ): string | null {
    // 애매한 답변
    if (analysis.score >= 40 && analysis.score <= 60) {
      return question_config.probe || '조금 더 구체적으로 예시를 들어주실 수 있나요?';
    }

    // 과도한 자신감
    if (analysis.score > 90 && !question_config.critical) {
      return '그럼 이런 더 어려운 상황이라면 어떻게 하시겠어요?';
    }

    // 부정적 답변
    if (analysis.score < 40) {
      return '다른 관점에서 생각해보면 어떨까요?';
    }

    return null;
  }
}

// ========================================
// 최종 추천 생성기
// ========================================

export class RecommendationEngine {
  /**
   * RECOMMEND: 구체적 근거와 함께 체험 방향 제시
   */
  static generate(
    job_type: string,
    scores: {
      reliability: number;
      job_fit: number;
      service_mind: number;
      logistics: number;
    },
    critical_fails: string[],
    highlights: string[]
  ): {
    grade: 'S' | 'A' | 'B' | 'C';
    recommendation: string;
    focus_points: string;
    full_message: string;
  } {
    // Critical 실패 시 즉시 C급
    if (critical_fails.length > 0) {
      return {
        grade: 'C',
        recommendation: '부적합',
        focus_points: '',
        full_message: `면접 수고하셨습니다.

아쉽지만 다음 사유로 채용이 어려울 것 같습니다:
${critical_fails.map(f => `- ${f}`).join('\n')}

다른 기회에 다시 도전해주세요.`
      };
    }

    // 종합 점수 계산
    const total = 
      scores.reliability * 0.35 +
      scores.job_fit * 0.30 +
      scores.service_mind * 0.25 +
      scores.logistics * 0.10;

    let grade: 'S' | 'A' | 'B' | 'C';
    let recommendation: string;
    let focus_points: string;

    if (total >= 85) {
      grade = 'S';
      recommendation = '즉시전력 - 강력 추천';
      focus_points = this.getFocusPoints(job_type, 'expert');
    } else if (total >= 70) {
      grade = 'A';
      recommendation = '추천';
      focus_points = this.getFocusPoints(job_type, 'good');
    } else if (total >= 55) {
      grade = 'B';
      recommendation = '교육 후 가능';
      focus_points = this.getFocusPoints(job_type, 'training');
    } else {
      grade = 'C';
      recommendation = '부적합';
      focus_points = '';
    }

    const full_message = `면접 수고하셨습니다! 🎉

📊 종합 평가 결과:
${highlights.map(h => `✅ ${h}`).join('\n')}

**${grade}급 - ${recommendation}**

${grade !== 'C' ? `사장님께 1시간 체험을 제안드리겠습니다.
특히 ${focus_points}을(를) 확인해보시면 좋을 것 같아요! ✨` : ''}`;

    return { grade, recommendation, focus_points, full_message };
  }

  private static getFocusPoints(job_type: string, level: 'expert' | 'good' | 'training'): string {
    const focus_map: Record<string, Record<string, string>> = {
      cafe: {
        expert: '러시 시간대 음료 제조 속도와 라떼아트 실력',
        good: '피크타임 멀티태스킹과 고객 응대',
        training: '기본 음료 제조와 POS 시스템 숙련도'
      },
      convenience: {
        expert: '야간 혼자 근무 시 위기 대응과 발주 정확성',
        good: '멀티태스킹과 정산 정확도',
        training: '기본 계산 업무와 상품 진열'
      },
      restaurant: {
        expert: '바쁜 런치 시간대 5-6테이블 동시 관리',
        good: '피크타임 멀티태스킹과 팀워크',
        training: '기본 서빙과 고객 응대'
      }
    };

    return focus_map[job_type]?.[level] || '기본 업무 수행 능력';
  }
}

export default {
  EVALUATION_MATRIX,
  CRITICAL_QUESTIONS,
  PROFESSIONAL_SCENARIOS,
  AnswerAnalyzer,
  RecommendationEngine
};
