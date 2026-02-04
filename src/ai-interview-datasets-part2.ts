/**
 * 알비 AI 면접관 - 완성 데이터셋 (Part 2)
 * 음식점 + 매장/마트 + 패스트푸드 (300개 Q&A)
 */

// ========================================
// 🍽️ 음식점 알바 완성 데이터셋 (20개 질문)
// ========================================

export const RESTAURANT_INTERVIEW_SET = {
  // 1. 기본 정보 수집 (4개)
  rest_q01: {
    question: '음식점 알바에 지원하신 이유와 자기소개를 해주세요.',
    category: 'basic_info',
    intent: ['지원동기 진정성', '음식점 업무 이해도'],
    evaluation_matrix: {
      S_95: {
        answer: '이전에 한식당에서 1년간 홀 서빙과 주방 보조를 모두 경험했습니다. 특히 피크 타임 멀티태스킹과 고객 응대에 자신 있고, 위생 관리도 철저히 배웠습니다.',
        keywords: ['한식당', '1년', '서빙', '주방', '멀티태스킹', '위생'],
        scoring: { reliability: 3, job_fit: 8, service_mind: 2, logistics: 2 }
      },
      A_82: {
        answer: '사람들과 소통하는 걸 좋아하고, 음식 서빙하면서 고객을 만나는 일이 즐거울 것 같아 지원했습니다. 장기근무 희망합니다.',
        keywords: ['소통', '서빙', '고객', '장기근무'],
        scoring: { reliability: 3, job_fit: 5, service_mind: 3, logistics: 2 }
      },
      B_68: {
        answer: '음식점은 처음이지만 빠르게 배워서 열심히 할 자신 있습니다.',
        keywords: ['처음', '빠르게', '열심히'],
        scoring: { reliability: 2, job_fit: 2, service_mind: 1, logistics: 1 }
      },
      C_52: {
        answer: '집에서 가까워서 지원했어요. 시급도 괜찮고요.',
        keywords: ['가까워서', '시급'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 2 }
      },
      F_20: {
        answer: '그냥 알바 필요해서요. 음식점이 쉬울 것 같아서요.',
        keywords: ['그냥', '쉬울 것'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_vague: '음식점에서 일하면서 가장 기대하는 점이 뭐예요?',
      if_good: '음식점 업무 중 가장 어려울 것 같은 부분은?'
    },
    critical_fail: false
  },

  rest_q02: {
    question: '근무 가능한 시간대를 구체적으로 말씀해주세요.',
    category: 'logistics',
    intent: ['시간 가용성', '주말/저녁 근무 가능성'],
    evaluation_matrix: {
      S_95: {
        answer: '주말 점심·저녁 피크 타임 모두 가능하고, 평일 저녁 6시부터 11시까지도 가능합니다. 특히 바쁜 시간대에 일하고 싶어요.',
        keywords: ['주말', '점심', '저녁', '피크 타임', '모두 가능'],
        scoring: { reliability: 5, job_fit: 0, service_mind: 0, logistics: 10 }
      },
      A_80: {
        answer: '평일 저녁과 주말 모두 가능합니다.',
        keywords: ['평일', '저녁', '주말', '가능'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 7 }
      },
      B_65: {
        answer: '평일 저녁이랑 주말 토요일은 가능해요.',
        keywords: ['평일', '저녁', '토요일'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 5 }
      },
      C_45: {
        answer: '평일 낮만 가능하고 저녁이랑 주말은 어려워요.',
        keywords: ['평일 낮만', '저녁 어려워', '주말 어려워'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 2 }
      },
      F_15: {
        answer: '그때그때 연락 주시면 올 수 있을 때만 갈게요.',
        keywords: ['그때그때', '올 수 있을 때만'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_limited: '음식점은 주말·저녁이 바쁜데 근무가 어려우면 힘들 수 있어요',
      if_good: '피크 타임에 바쁜 환경 경험해보셨나요?'
    },
    critical_fail: false
  },

  rest_q03: {
    question: '음식점까지 출퇴근 시간과 교통수단을 알려주세요.',
    category: 'logistics',
    intent: ['출퇴근 가능성', '거리 적합성'],
    evaluation_matrix: {
      S_92: {
        answer: '걸어서 10분 거리입니다. 늦은 저녁 근무도 안전하게 갈 수 있어요.',
        keywords: ['걸어서', '10분', '안전'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 10 }
      },
      A_78: {
        answer: '버스로 20분 걸리고 막차 시간 확인했습니다.',
        keywords: ['버스', '20분', '막차'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 7 }
      },
      B_65: {
        answer: '지하철로 30분 정도요.',
        keywords: ['지하철', '30분'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 5 }
      },
      C_48: {
        answer: '버스 갈아타서 1시간 정도 걸려요.',
        keywords: ['갈아타', '1시간'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 2 }
      },
      F_18: {
        answer: '좀 멀긴 한데 시급 좋으면 다녀볼게요.',
        keywords: ['좀 멀', '시급 좋으면'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_far: '출퇴근 1시간 이상이면 늦은 저녁 근무가 힘들 텐데 괜찮으세요?',
      if_good: '저녁 근무 후 귀가 시 안전 문제는 없나요?'
    },
    critical_fail: false
  },

  rest_q04: {
    question: '희망 시급과 최소 근무 기간을 말씀해주세요.',
    category: 'logistics',
    intent: ['급여 현실성', '장기근무 의향'],
    evaluation_matrix: {
      S_90: {
        answer: '최저시급도 괜찮고 1년 이상 장기근무 희망합니다. 경력 쌓아서 주방까지 배우고 싶어요.',
        keywords: ['최저시급', '1년 이상', '장기근무', '주방'],
        scoring: { reliability: 7, job_fit: 0, service_mind: 0, logistics: 8 }
      },
      A_78: {
        answer: '시급은 최저시급에서 협의 가능하고 6개월 이상 일하겠습니다.',
        keywords: ['최저시급', '협의', '6개월'],
        scoring: { reliability: 5, job_fit: 0, service_mind: 0, logistics: 6 }
      },
      B_62: {
        answer: '최저시급 받으면서 3개월 정도 생각 중이에요.',
        keywords: ['최저시급', '3개월'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 4 }
      },
      C_45: {
        answer: '시급 좀 더 주시면 좋겠고 일단 해보고 결정할게요.',
        keywords: ['시급 더', '해보고'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 2 }
      },
      F_18: {
        answer: '최소 만 오천원은 받아야 할 것 같은데 한 달만 해볼게요.',
        keywords: ['만 오천원', '한 달'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_unrealistic: '음식점은 최저시급이 일반적인데 왜 그 금액을 원하시나요?',
      if_good: '장기근무하면서 특별히 배우고 싶은 것이 있나요?'
    },
    critical_fail: false
  },

  // 2. 상황 대처 능력 (4개)
  rest_q05: {
    question: '피크 타임에 여러 테이블이 동시에 주문을 요청합니다. 어떻게 하시겠어요?',
    category: 'situation_handling',
    intent: ['멀티태스킹', '우선순위', '스트레스 관리'],
    evaluation_matrix: {
      S_98: {
        answer: '먼저 온 순서대로 빠르게 주문을 받되, 각 테이블에 "곧 가겠습니다"라고 안내합니다. 주문을 받으면서 주방에 빠르게 전달하고, 다음 테이블로 이동합니다. 음료 같은 빠른 주문은 우선 처리하고, 동시에 다른 테이블 상황도 체크합니다.',
        keywords: ['순서', '빠르게', '안내', '주방 전달', '우선순위'],
        scoring: { reliability: 3, job_fit: 8, service_mind: 3, logistics: 0 }
      },
      A_80: {
        answer: '손님께 양해를 구하고 순서대로 빠르게 주문 받겠습니다.',
        keywords: ['양해', '순서', '빠르게'],
        scoring: { reliability: 2, job_fit: 6, service_mind: 2, logistics: 0 }
      },
      B_60: {
        answer: '최대한 빨리 주문 받으려고 노력할게요.',
        keywords: ['빨리', '노력'],
        scoring: { reliability: 1, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      C_40: {
        answer: '바쁠 때는 느려질 수밖에 없으니 기다려야죠.',
        keywords: ['느려질 수밖에', '기다려야'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_10: {
        answer: '그럴 땐 다른 직원이 도와줘야 하는 거 아닌가요?',
        keywords: ['다른 직원', '도와줘야'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '피크 타임에 혼자 여러 테이블을 관리하는 게 일반적인데 괜찮으세요?',
      if_good: '이전에 바쁜 환경에서 일해본 경험이 있나요?'
    },
    critical_question: true,
    auto_reject_reason: '피크 타임 멀티태스킹 능력 부족'
  },

  rest_q06: {
    question: '손님이 주문한 음식이 늦게 나온다며 화를 내십니다. 어떻게 대응하시겠어요?',
    category: 'situation_handling',
    intent: ['고객 응대', '감정 조절', '문제 해결'],
    evaluation_matrix: {
      S_95: {
        answer: '진심으로 사과드리고 주방에 주문 상황을 확인합니다. 예상 시간을 정확히 알려드리고, 그동안 물이나 밑반찬을 챙겨드립니다. 음식이 나오면 직접 서빙하면서 다시 한번 사과드리고, 필요하면 점장님께 보고합니다.',
        keywords: ['사과', '확인', '예상 시간', '챙겨', '직접 서빙', '보고'],
        scoring: { reliability: 3, job_fit: 2, service_mind: 8, logistics: 0 }
      },
      A_82: {
        answer: '사과드리고 주방에 확인해서 곧 나온다고 안내드립니다.',
        keywords: ['사과', '확인', '안내'],
        scoring: { reliability: 2, job_fit: 1, service_mind: 6, logistics: 0 }
      },
      B_65: {
        answer: '죄송하다고 하고 주방에 빨리 달라고 할게요.',
        keywords: ['죄송', '빨리'],
        scoring: { reliability: 1, job_fit: 1, service_mind: 3, logistics: 0 }
      },
      C_45: {
        answer: '주방이 바빠서 늦는 거니까 좀 기다리라고 할게요.',
        keywords: ['주방 바빠', '기다리라고'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      F_15: {
        answer: '제 잘못이 아니니까 주방에 말하라고 할게요.',
        keywords: ['내 잘못 아님', '주방에 말하라고'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '화난 손님을 진정시키는 경험이 있나요?',
      if_good: '이전에 비슷한 상황을 어떻게 해결하셨나요?'
    },
    critical_fail: false
  },

  rest_q07: {
    question: '주방에서 만든 음식이 주문과 다릅니다. 어떻게 하시겠어요?',
    category: 'situation_handling',
    intent: ['책임감', '문제 해결', '커뮤니케이션'],
    evaluation_matrix: {
      S_93: {
        answer: '즉시 주방에 확인하고 다시 만들어달라고 요청합니다. 손님께 사과드리고 상황을 설명하며 새로운 음식이 나올 때까지 기다려달라고 정중히 안내합니다. 주문서와 실제 나온 음식을 대조해서 제 실수인지 주방 실수인지 확인합니다.',
        keywords: ['즉시 확인', '다시 제작', '사과', '설명', '주문서 대조'],
        scoring: { reliability: 9, job_fit: 1, service_mind: 3, logistics: 0 }
      },
      A_80: {
        answer: '주방에 알리고 다시 만들어달라고 하고, 손님께 사과드립니다.',
        keywords: ['주방 알림', '다시 제작', '사과'],
        scoring: { reliability: 7, job_fit: 1, service_mind: 2, logistics: 0 }
      },
      B_63: {
        answer: '점장님께 말씀드려서 어떻게 하라고 하는지 물어볼게요.',
        keywords: ['점장', '물어볼'],
        scoring: { reliability: 4, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '주방 실수니까 주방에서 알아서 해야 하는 거 아닌가요?',
        keywords: ['주방 실수', '알아서'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_18: {
        answer: '그냥 그대로 내놓고 나중에 이야기할게요.',
        keywords: ['그대로', '나중에'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '홀과 주방 간 커뮤니케이션이 중요한데 자신 있나요?',
      if_good: '주문 실수를 방지하는 본인만의 방법이 있나요?'
    },
    critical_fail: false
  },

  rest_q08: {
    question: '손님이 떠난 후 테이블에 지갑을 두고 가신 걸 발견했습니다. 어떻게 하시겠어요?',
    category: 'situation_handling',
    intent: ['정직성', '책임감', '문제 해결'],
    evaluation_matrix: {
      S_95: {
        answer: '즉시 점장님께 알리고 CCTV를 확인해서 손님을 특정합니다. 지갑은 안전한 곳에 보관하고, 손님이 다시 오실 때를 대비해 대기합니다. 가능하면 연락처를 찾아 연락드립니다.',
        keywords: ['점장 알림', 'CCTV', '안전 보관', '연락'],
        scoring: { reliability: 10, job_fit: 1, service_mind: 2, logistics: 0 }
      },
      A_82: {
        answer: '점장님께 바로 알리고 안전하게 보관합니다.',
        keywords: ['점장 알림', '안전 보관'],
        scoring: { reliability: 8, job_fit: 1, service_mind: 1, logistics: 0 }
      },
      B_65: {
        answer: '점장님께 말씀드려요.',
        keywords: ['점장 말씀'],
        scoring: { reliability: 5, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '손님이 다시 오실 거니까 그냥 보관해놔요.',
        keywords: ['다시 올', '보관'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_15: {
        answer: '그냥 카운터에 놔두면 되는 거 아닌가요?',
        keywords: ['카운터', '놔두면'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '손님의 분실물을 관리하는 게 왜 중요하다고 생각하세요?',
      if_good: '이전에 비슷한 상황을 겪어본 적 있나요?'
    },
    critical_question: true,
    auto_reject_reason: '정직성 및 책임감 부족'
  },

  // 3. 성실성 및 책임감 (4개)
  rest_q09: {
    question: '근무 중 설거지를 하다가 접시를 깨뜨렸습니다. 어떻게 하시겠어요?',
    category: 'reliability',
    intent: ['정직성', '책임감', '안전 의식'],
    evaluation_matrix: {
      S_95: {
        answer: '즉시 점장님께 보고하고 깨진 조각을 안전하게 치웁니다. 다칠 위험이 있으니 주변에 알리고, 변상 의사를 밝힙니다. 앞으로 더 조심하겠다고 말씀드립니다.',
        keywords: ['즉시 보고', '안전하게', '주변 알림', '변상', '조심'],
        scoring: { reliability: 10, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      A_80: {
        answer: '점장님께 보고하고 안전하게 치우고 죄송하다고 말씀드립니다.',
        keywords: ['보고', '안전', '죄송'],
        scoring: { reliability: 7, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      B_63: {
        answer: '치우고 점장님께 말씀드려요.',
        keywords: ['치우고', '말씀'],
        scoring: { reliability: 4, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '실수는 누구나 하니까 치우고 점장님께 말씀드려요.',
        keywords: ['누구나', '치우고'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_15: {
        answer: '몰래 치우고 모르는 척 할게요.',
        keywords: ['몰래', '모르는 척'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '실수에 대한 책임을 지는 게 부담스럽지 않나요?',
      if_good: '설거지할 때 안전하게 하는 본인만의 방법이 있나요?'
    },
    critical_question: true,
    auto_reject_reason: '정직성 부족'
  },

  rest_q10: {
    question: '주방에서 바닥에 떨어진 음식을 다시 조리하려는 걸 봤습니다. 어떻게 하시겠어요?',
    category: 'reliability',
    intent: ['위생 의식', '책임감', '용기'],
    evaluation_matrix: {
      S_98: {
        answer: '즉시 주방장님께 말씀드리고 그 음식은 폐기해야 한다고 정중히 말씀드립니다. 만약 계속 진행하시면 점장님께 보고하고, 위생 문제는 손님 건강과 매장 신뢰에 직결되니 절대 안 된다고 설명드립니다.',
        keywords: ['즉시 말씀', '폐기', '보고', '위생', '손님 건강', '신뢰'],
        scoring: { reliability: 10, job_fit: 2, service_mind: 1, logistics: 0 }
      },
      A_82: {
        answer: '주방장님께 말씀드리고 그건 안 된다고 정중히 이야기합니다.',
        keywords: ['말씀', '안 됨', '정중히'],
        scoring: { reliability: 8, job_fit: 1, service_mind: 1, logistics: 0 }
      },
      B_65: {
        answer: '점장님께 말씀드려요.',
        keywords: ['점장 말씀'],
        scoring: { reliability: 5, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_40: {
        answer: '주방 일이니까 주방에서 알아서 하는 거 아닌가요?',
        keywords: ['주방 일', '알아서'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_10: {
        answer: '제가 본 게 아니니까 모르는 척 할게요.',
        keywords: ['본 게 아님', '모르는 척'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '위생 문제를 지적하는 게 어렵지 않나요?',
      if_good: '위생 관리가 왜 중요하다고 생각하세요?'
    },
    critical_question: true,
    auto_reject_reason: '위생 의식 결여'
  },

  rest_q11: {
    question: '근무 중 감기 기운이 심하게 느껴집니다. 어떻게 하시겠어요?',
    category: 'reliability',
    intent: ['책임감', '위생 의식', '업무 지속성'],
    evaluation_matrix: {
      S_90: {
        answer: '즉시 점장님께 말씀드리고, 마스크를 착용하고 손 소독을 철저히 합니다. 음식을 다루는 일이라 위생이 중요하니 증상이 심하면 조퇴를 요청하지만, 대체 인력이 올 때까지는 자리를 지키겠습니다.',
        keywords: ['점장 말씀', '마스크', '손 소독', '위생', '조퇴', '자리 지킴'],
        scoring: { reliability: 9, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      A_78: {
        answer: '점장님께 말씀드리고 마스크 쓰고 위생 관리 철저히 하겠습니다.',
        keywords: ['점장 말씀', '마스크', '위생'],
        scoring: { reliability: 6, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      B_62: {
        answer: '약 먹고 마스크 쓰고 버틸게요.',
        keywords: ['약', '마스크', '버틸'],
        scoring: { reliability: 4, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '아프면 조퇴 요청할게요.',
        keywords: ['조퇴'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '아프면 나갈 수 없죠. 쉴게요.',
        keywords: ['나갈 수 없', '쉴'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '음식을 다루는 일이라 건강 관리가 중요한데 괜찮으세요?',
      if_good: '평소 건강 관리를 위해 어떤 노력을 하시나요?'
    },
    critical_fail: false
  },

  rest_q12: {
    question: '이전 직장에서 퇴사한 이유는 무엇인가요?',
    category: 'reliability',
    intent: ['장기근무 가능성', '태도', '진정성'],
    evaluation_matrix: {
      S_88: {
        answer: '학업과 병행하다가 시간 관리가 어려워서 정리했고, 이번엔 장기적으로 일할 수 있는 곳을 찾고 있습니다. 이전 직장과는 원만하게 퇴사했습니다.',
        keywords: ['시간 관리', '장기적', '원만'],
        scoring: { reliability: 7, job_fit: 1, service_mind: 0, logistics: 1 }
      },
      A_75: {
        answer: '학업 때문에 그만뒀고 이번에는 안정적으로 일하고 싶어요.',
        keywords: ['학업', '안정적'],
        scoring: { reliability: 5, job_fit: 1, service_mind: 0, logistics: 1 }
      },
      B_60: {
        answer: '집에서 너무 멀어서 그만뒀어요.',
        keywords: ['멀어서'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 1 }
      },
      C_42: {
        answer: '일이 너무 힘들고 시급도 낮아서요.',
        keywords: ['힘들', '시급 낮아'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_18: {
        answer: '사장님이랑 안 맞아서요.',
        keywords: ['사장님', '안 맞아'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_negative: '이번에도 같은 이유로 퇴사할 가능성은 없나요?',
      if_good: '이전 직장에서 배운 점이 있다면?'
    },
    critical_fail: false
  },

  // 4. 전문 지식 및 기술 (4개)
  rest_q13: {
    question: '서빙과 주방 보조 중 어떤 업무를 선호하시나요? 경험이 있나요?',
    category: 'professional_knowledge',
    intent: ['업무 선호도', '경험', '학습 능력'],
    evaluation_matrix: {
      S_95: {
        answer: '둘 다 경험이 있고 둘 다 좋아합니다. 서빙은 손님과 소통하는 게 즐겁고, 주방은 음식 만드는 과정을 배우는 게 재밌어요. 필요에 따라 어디든 유연하게 일할 수 있습니다.',
        keywords: ['둘 다 경험', '둘 다 좋아', '소통', '배우는', '유연'],
        scoring: { reliability: 1, job_fit: 10, service_mind: 2, logistics: 0 }
      },
      A_82: {
        answer: '서빙 경험이 있고 손님 응대가 재밌어서 서빙을 선호합니다.',
        keywords: ['서빙 경험', '손님 응대', '선호'],
        scoring: { reliability: 1, job_fit: 7, service_mind: 2, logistics: 0 }
      },
      B_65: {
        answer: '둘 다 처음이지만 배우고 싶어요.',
        keywords: ['처음', '배우고'],
        scoring: { reliability: 1, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      C_48: {
        answer: '주방은 힘들 것 같아서 서빙만 하고 싶어요.',
        keywords: ['주방 힘들', '서빙만'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '편한 거 하고 싶은데 뭐가 더 쉬워요?',
        keywords: ['편한', '쉬워'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_none: '음식점은 서빙과 주방을 모두 도와야 하는 경우가 많은데 괜찮으세요?',
      if_good: '서빙할 때 가장 중요하게 생각하는 점은?'
    },
    critical_fail: false
  },

  rest_q14: {
    question: '음식 알레르기가 있는 손님이 재료를 문의하십니다. 어떻게 대응하시겠어요?',
    category: 'professional_knowledge',
    intent: ['고객 안전', '책임감', '지식'],
    evaluation_matrix: {
      S_92: {
        answer: '주방장님께 정확히 확인해서 재료를 상세히 설명드립니다. 조금이라도 불확실하면 "확실하지 않으니 안전하게 다른 메뉴를 추천드립니다"라고 말씀드립니다. 알레르기는 생명과 직결된 문제니까 절대 대충 답하면 안 됩니다.',
        keywords: ['정확 확인', '상세 설명', '불확실', '안전', '생명', '절대'],
        scoring: { reliability: 3, job_fit: 8, service_mind: 2, logistics: 0 }
      },
      A_80: {
        answer: '주방에 정확히 확인하고 알려드립니다.',
        keywords: ['정확 확인', '알려'],
        scoring: { reliability: 2, job_fit: 6, service_mind: 1, logistics: 0 }
      },
      B_65: {
        answer: '메뉴판 보고 설명드릴게요.',
        keywords: ['메뉴판', '설명'],
        scoring: { reliability: 1, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '잘 모르니까 주방장님께 직접 물어보시라고 할게요.',
        keywords: ['잘 모름', '직접 물어보시라고'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_18: {
        answer: '메뉴판에 다 나와 있는데 왜 물어보는 거예요?',
        keywords: ['메뉴판', '왜 물어'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '알레르기 대응이 왜 중요하다고 생각하세요?',
      if_good: '이전에 비슷한 상황을 겪어본 적 있나요?'
    },
    critical_question: true,
    auto_reject_reason: '고객 안전 의식 부족'
  },

  rest_q15: {
    question: '테이블 세팅과 정리 경험이 있나요?',
    category: 'professional_knowledge',
    intent: ['업무 경험', '세심함', '효율성'],
    evaluation_matrix: {
      S_90: {
        answer: '네, 테이블 정리·세팅 모두 경험 있습니다. 손님이 떠나시면 빠르게 정리하고, 다음 손님을 위해 물·수저·휴지 등을 깔끔하게 세팅합니다. 테이블 순서를 정해서 효율적으로 관리하는 습관이 있어요.',
        keywords: ['경험', '빠르게', '깔끔', '순서', '효율적'],
        scoring: { reliability: 2, job_fit: 8, service_mind: 1, logistics: 0 }
      },
      A_78: {
        answer: '테이블 정리하고 세팅하는 일 해봤어요.',
        keywords: ['정리', '세팅', '해봤'],
        scoring: { reliability: 1, job_fit: 6, service_mind: 1, logistics: 0 }
      },
      B_63: {
        answer: '처음이지만 배우면 될 것 같아요.',
        keywords: ['처음', '배우면'],
        scoring: { reliability: 1, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '그냥 치우면 되는 거 아닌가요?',
        keywords: ['그냥 치우면'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_18: {
        answer: '테이블 정리는 손님이 떠난 후에 하면 되는 거 아닌가요?',
        keywords: ['손님 떠난 후', '하면 되는'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_none: '테이블 회전율이 매출과 직결되는데 이해하고 계신가요?',
      if_good: '바쁠 때 테이블을 빠르게 정리하는 본인만의 노하우가 있나요?'
    },
    critical_fail: false
  },

  rest_q16: {
    question: '음식점 업무 중 가장 중요하다고 생각하는 것은 무엇인가요?',
    category: 'professional_knowledge',
    intent: ['업무 우선순위', '이해도', '가치관'],
    evaluation_matrix: {
      S_93: {
        answer: '위생 관리, 친절한 서비스, 정확한 주문 처리 모두 중요하지만 특히 위생이 최우선이라고 생각합니다. 음식은 건강과 직결되니까 손 씻기, 식재료 관리, 조리 도구 청결이 가장 기본입니다.',
        keywords: ['위생', '친절', '정확', '건강', '손 씻기', '청결'],
        scoring: { reliability: 4, job_fit: 7, service_mind: 2, logistics: 0 }
      },
      A_80: {
        answer: '친절한 고객 응대와 위생 관리가 가장 중요합니다.',
        keywords: ['친절', '고객 응대', '위생'],
        scoring: { reliability: 2, job_fit: 5, service_mind: 3, logistics: 0 }
      },
      B_65: {
        answer: '빠른 서빙과 정리가 중요할 것 같아요.',
        keywords: ['빠른 서빙', '정리'],
        scoring: { reliability: 1, job_fit: 3, service_mind: 1, logistics: 0 }
      },
      C_48: {
        answer: '시간 맞춰 출근하고 열심히 하면 될 것 같아요.',
        keywords: ['출근', '열심히'],
        scoring: { reliability: 1, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '손님 오면 서빙하고 치우면 되는 거 아닌가요?',
        keywords: ['서빙', '치우면'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_vague: '구체적으로 어떤 부분이 가장 중요할까요?',
      if_good: '그 가치를 실천하기 위해 어떤 노력을 하시겠어요?'
    },
    critical_fail: false
  },

  // 5. 스트레스 및 갈등 관리 (4개)
  rest_q17: {
    question: '손님이 음식 맛이 없다며 환불을 요구하십니다. 어떻게 대응하시겠어요?',
    category: 'stress_conflict',
    intent: ['감정 조절', '문제 해결', '고객 응대'],
    evaluation_matrix: {
      S_95: {
        answer: '진심으로 사과드리고 어떤 부분이 마음에 안 드셨는지 여쭤봅니다. 점장님께 상황을 보고하고, 다른 메뉴로 교체해드리거나 환불 처리해드립니다. 손님의 불만을 경청하고 최대한 만족시켜드리려고 노력합니다.',
        keywords: ['사과', '여쭤', '보고', '교체', '환불', '경청', '만족'],
        scoring: { reliability: 3, job_fit: 2, service_mind: 8, logistics: 0 }
      },
      A_82: {
        answer: '사과드리고 점장님께 말씀드려서 환불이나 교체해드립니다.',
        keywords: ['사과', '점장', '환불', '교체'],
        scoring: { reliability: 2, job_fit: 1, service_mind: 6, logistics: 0 }
      },
      B_65: {
        answer: '죄송하다고 하고 점장님께 도움 요청할게요.',
        keywords: ['죄송', '점장 도움'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 3, logistics: 0 }
      },
      C_45: {
        answer: '주방에서 만든 거니까 주방장님께 말씀하시라고 할게요.',
        keywords: ['주방', '주방장', '말씀하시라고'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      F_18: {
        answer: '다른 손님들은 맛있다는데 손님 입맛이 특이한 거 아닌가요?',
        keywords: ['다른 손님', '입맛 특이'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '이런 상황에서 감정 조절이 어렵지 않나요?',
      if_good: '이전에 불만 손님을 어떻게 대응하셨나요?'
    },
    critical_fail: false
  },

  rest_q18: {
    question: '피크 타임에 스트레스를 어떻게 관리하시나요?',
    category: 'stress_conflict',
    intent: ['스트레스 관리', '자기 조절', '업무 지속성'],
    evaluation_matrix: {
      S_88: {
        answer: '바쁠 때일수록 침착하게 우선순위를 정해서 처리합니다. 심호흡하면서 한 가지씩 처리하고, 동료와 소통하면서 협력합니다. 바쁜 시간이 지나면 뿌듯함을 느끼니까 긍정적으로 생각하려고 해요.',
        keywords: ['침착', '우선순위', '심호흡', '소통', '협력', '긍정적'],
        scoring: { reliability: 5, job_fit: 2, service_mind: 2, logistics: 1 }
      },
      A_75: {
        answer: '최대한 빠르게 처리하면서 침착하려고 노력해요.',
        keywords: ['빠르게', '침착', '노력'],
        scoring: { reliability: 3, job_fit: 1, service_mind: 1, logistics: 1 }
      },
      B_60: {
        answer: '그냥 버티는 수밖에 없죠.',
        keywords: ['버티는'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_42: {
        answer: '솔직히 바쁜 시간은 힘들 것 같은데 괜찮을까요?',
        keywords: ['힘들', '괜찮을까'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_18: {
        answer: '스트레스 받으면 그만두면 되죠.',
        keywords: ['스트레스', '그만두면'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '피크 타임이 매일 있는데 스트레스 관리가 중요해요',
      if_good: '이전에 바쁜 환경에서 일해본 경험이 있나요?'
    },
    critical_fail: false
  },

  rest_q19: {
    question: '주방 직원과 의견이 충돌하면 어떻게 해결하시겠어요?',
    category: 'stress_conflict',
    intent: ['갈등 해결', '협력', '커뮤니케이션'],
    evaluation_matrix: {
      S_90: {
        answer: '우선 상대방 의견을 끝까지 듣고 이해하려고 노력합니다. 제 의견을 차분히 설명하고 서로 타협점을 찾습니다. 홀과 주방은 협력이 필수니까 원만한 관계 유지가 중요하다고 생각합니다.',
        keywords: ['의견 듣고', '이해', '차분', '타협', '협력', '원만'],
        scoring: { reliability: 3, job_fit: 1, service_mind: 7, logistics: 0 }
      },
      A_78: {
        answer: '대화로 풀려고 노력하고 안 되면 점장님께 도움 요청합니다.',
        keywords: ['대화', '점장 도움'],
        scoring: { reliability: 2, job_fit: 1, service_mind: 5, logistics: 0 }
      },
      B_62: {
        answer: '제가 양보하고 넘어갈게요.',
        keywords: ['양보', '넘어갈'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 2, logistics: 0 }
      },
      C_45: {
        answer: '홀은 제가 담당이니까 제 방식대로 할게요.',
        keywords: ['제 담당', '제 방식'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      F_20: {
        answer: '맞지 않으면 각자 일하면 되죠.',
        keywords: ['맞지 않으면', '각자'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '홀과 주방 간 협력이 중요한데 갈등 해결에 자신 있나요?',
      if_good: '이전에 갈등을 해결한 경험이 있나요?'
    },
    critical_fail: false
  },

  rest_q20: {
    question: '음식점 알바를 통해 가장 얻고 싶은 것은 무엇인가요?',
    category: 'stress_conflict',
    intent: ['동기', '목표', '장기 비전'],
    evaluation_matrix: {
      S_92: {
        answer: '음식점 운영 전반을 배우고 싶어요. 나중에 제 가게를 차리고 싶어서 서빙부터 주방까지 모두 경험하고 싶습니다. 고객 응대 능력과 위생 관리 노하우도 배우고 싶어요.',
        keywords: ['운영', '배우고', '제 가게', '서빙', '주방', '고객 응대', '위생'],
        scoring: { reliability: 5, job_fit: 5, service_mind: 2, logistics: 1 }
      },
      A_80: {
        answer: '서비스 경험과 소통 능력을 키우고 생활비도 벌고 싶어요.',
        keywords: ['서비스', '소통', '생활비'],
        scoring: { reliability: 3, job_fit: 3, service_mind: 2, logistics: 1 }
      },
      B_65: {
        answer: '알바 경험 쌓고 돈 벌고 싶어요.',
        keywords: ['경험', '돈'],
        scoring: { reliability: 2, job_fit: 1, service_mind: 0, logistics: 1 }
      },
      C_48: {
        answer: '그냥 생활비요.',
        keywords: ['생활비'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 1 }
      },
      F_20: {
        answer: '특별히 없는데 돈 필요해서요.',
        keywords: ['특별히 없', '돈'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_vague: '구체적으로 어떤 능력을 키우고 싶으세요?',
      if_good: '그 목표를 이루기 위해 어떤 노력을 하실 건가요?'
    },
    critical_fail: false
  }
};

// Note: 매장/마트와 패스트푸드 데이터셋은 별도 파일로 분리 예정
// RETAIL_INTERVIEW_SET와 FASTFOOD_INTERVIEW_SET도 동일한 구조로 작성됩니다.

export default {
  RESTAURANT_INTERVIEW_SET
};
