/**
 * 알비 AI 면접관 - 완성 데이터셋 시스템
 * 5개 업종 × 20개 질문 × 5개 답변 패턴 = 500개 Q&A 세트
 */

// ========================================
// 평가 시스템 설계
// ========================================

export const EVALUATION_SYSTEM = {
  // 평가 가중치
  weights: {
    reliability: 0.35,      // 성실성 (35%)
    job_fit: 0.30,         // 직무적합성 (30%)
    service_mind: 0.25,    // 서비스마인드 (25%)
    logistics: 0.10        // 근무조건 (10%)
  },

  // 등급 분류 기준
  grading_system: {
    S: { min: 90, max: 100, label: '즉시전력', action: '바로 채용 추천' },
    A: { min: 75, max: 89, label: '우수', action: '1시간 체험 후 채용 추천' },
    B: { min: 60, max: 74, label: '보통', action: '교육 후 활용 가능' },
    C: { min: 40, max: 59, label: '미흡', action: '다른 지원자와 비교 검토' },
    F: { min: 0, max: 39, label: '부적합', action: '채용 비추천' }
  },

  // 최소/최대 질문 수
  min_questions: 8,
  max_questions: 15
};

// ========================================
// ☕ 카페 알바 완성 데이터셋 (20개 질문)
// ========================================

export const CAFE_INTERVIEW_SET = {
  // 1. 기본 정보 수집 (4개)
  cafe_q01: {
    question: '카페 알바에 지원하신 이유와 자기소개를 해주세요.',
    category: 'basic_info',
    intent: ['지원동기 진정성', '서비스업 적합성'],
    evaluation_matrix: {
      S_95: {
        answer: '커피에 관심이 많아서 바리스타 자격증도 준비 중이고, 이전에 스타벅스에서 6개월 일한 경험이 있습니다. 이 카페는 스페셜티 커피를 다룬다고 해서 더 전문적인 기술을 배우고 싶어 지원했습니다.',
        keywords: ['바리스타', '자격증', '스타벅스', '경험', '전문적', '기술'],
        scoring: { reliability: 2, job_fit: 8, service_mind: 3, logistics: 2 }
      },
      A_82: {
        answer: '커피를 좋아하고 카페 분위기를 좋아해서 지원했습니다. 집에서도 가깝고 장기적으로 일하고 싶어요.',
        keywords: ['커피', '좋아', '가깝', '장기적'],
        scoring: { reliability: 3, job_fit: 5, service_mind: 2, logistics: 3 }
      },
      B_68: {
        answer: '알바 경험을 쌓고 싶어서요. 카페가 깨끗해 보여서 지원했습니다.',
        keywords: ['경험', '깨끗'],
        scoring: { reliability: 1, job_fit: 2, service_mind: 1, logistics: 1 }
      },
      C_52: {
        answer: '그냥 알바 필요해서요. 집 가까워서 편할 것 같아서요.',
        keywords: ['그냥', '가까워서'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 2 }
      },
      F_20: {
        answer: '별로 생각 없는데 친구가 추천해서요.',
        keywords: ['별로', '생각 없는'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_vague: '카페에서 일하면서 가장 기대하는 점이 뭐예요?',
      if_good: '그럼 카페 업무 중 어떤 부분이 가장 어려울 것 같아요?'
    },
    critical_fail: false
  },

  cafe_q02: {
    question: '근무 가능한 시간대를 구체적으로 말씀해주세요.',
    category: 'logistics',
    intent: ['시간 가용성', '주말 근무 가능성'],
    evaluation_matrix: {
      S_95: {
        answer: '평일 오전 9시부터 오후 6시까지 가능하고, 주말은 오픈부터 마감까지 모두 가능합니다. 특히 바쁜 주말에 올인할 수 있어요.',
        keywords: ['주말', '오픈', '마감', '모두 가능'],
        scoring: { reliability: 5, job_fit: 0, service_mind: 0, logistics: 10 }
      },
      A_80: {
        answer: '평일 오후와 주말 중 토요일은 가능합니다.',
        keywords: ['평일', '토요일', '가능'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 7 }
      },
      B_65: {
        answer: '평일 낮 시간대 가능해요. 주말은 토요일만 가능합니다.',
        keywords: ['평일', '낮', '토요일만'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 5 }
      },
      C_45: {
        answer: '평일만 가능하고 주말은 어렵습니다.',
        keywords: ['평일만', '주말 어렵'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 2 }
      },
      F_15: {
        answer: '주말은 절대 안 되고, 평일도 시험 기간엔 못 나와요.',
        keywords: ['주말 절대 안', '시험기간 못'],
        scoring: { reliability: -5, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['주말 절대 안', '시험기간 못', '불규칙해서'],
    follow_up_triggers: {
      if_weekend_ok: '주말 러시 시간대가 가장 바쁜데 괜찮으시겠어요?'
    }
  },

  cafe_q03: {
    question: '에스프레소 머신이나 커피 제조 경험에 대해 구체적으로 말씀해주세요.',
    category: 'job_fit',
    intent: ['바리스타 실력', '기술 숙련도'],
    evaluation_matrix: {
      S_95: {
        answer: '마스트레나 머신과 라마르조꼬 사용 경험 있습니다. 포타필터 템핑, 추출 시간 25-30초, 크레마 확인까지 기본 원리를 이해하고 있어요. 스팀 밀크는 60-65도로 벨벳 텍스처 만들 수 있습니다.',
        keywords: ['마스트레나', '라마르조꼬', '템핑', '추출 시간', '크레마', '스팀 밀크', '60-65도', '벨벳'],
        scoring: { reliability: 0, job_fit: 12, service_mind: 0, logistics: 0 }
      },
      A_80: {
        answer: '버튼식 머신 사용해봤고, 기본 음료는 만들 수 있어요. 에스프레소 샷 추출하고 우유 스티밍 정도는 가능합니다.',
        keywords: ['버튼식', '기본 음료', '샷 추출', '스티밍'],
        scoring: { reliability: 0, job_fit: 8, service_mind: 0, logistics: 0 }
      },
      B_65: {
        answer: '카페에서 일해봤는데 주로 계산하고 서빙만 했어요. 음료는 선배가 만들었습니다.',
        keywords: ['계산', '서빙', '선배가'],
        scoring: { reliability: 0, job_fit: 4, service_mind: 0, logistics: 0 }
      },
      C_48: {
        answer: '커피 머신은 못 써봤지만 배우면 할 수 있을 것 같아요.',
        keywords: ['못 써봤', '배우면'],
        scoring: { reliability: 0, job_fit: 2, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '그런 거 안 해봤고 관심도 없어요. 계산만 할래요.',
        keywords: ['안 해봤', '관심 없', '계산만'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_experienced: '스팀 밀크 만들 때 가장 중요한 포인트가 뭐라고 생각하세요?',
      if_beginner: '커피에 대한 관심이나 기본 지식은 어느 정도인가요?'
    },
    critical_fail: true,
    fail_triggers: ['관심 없어요', '계산만', '안 배우고 싶']
  },

  cafe_q04: {
    question: '이전에 일했던 카페를 그만둔 이유가 무엇인가요?',
    category: 'reliability',
    intent: ['이직 사유', '문제 발생 패턴'],
    evaluation_matrix: {
      S_92: {
        answer: '학교 시간표가 바뀌어서 근무 시간이 맞지 않게 되었습니다. 사장님께 미리 말씀드리고 정리했어요.',
        keywords: ['시간표', '근무 시간', '미리', '정리'],
        scoring: { reliability: 8, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      A_78: {
        answer: '졸업하면서 자연스럽게 그만두게 되었습니다.',
        keywords: ['졸업', '자연스럽게'],
        scoring: { reliability: 5, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      B_62: {
        answer: '거리가 너무 멀어서 통근이 힘들었어요.',
        keywords: ['거리', '통근'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '일이 너무 힘들고 피곤했어요.',
        keywords: ['힘들', '피곤'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_15: {
        answer: '사장님이 싫어서요. 직원들이랑도 안 맞았고.',
        keywords: ['사장님 싫', '안 맞았'],
        scoring: { reliability: -10, job_fit: 0, service_mind: -5, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['사장님 싫', '직원 싫', '재미없어서'],
    follow_up_triggers: {
      if_negative: '그럼 이번에는 어떤 환경에서 일하고 싶으세요?'
    }
  },

  // 2. 상황 대처 능력 (6개)
  cafe_q05: {
    question: '러시 시간에 주문이 10잔 이상 밀렸을 때 어떻게 대처하시겠어요?',
    category: 'situation_handling',
    intent: ['멀티태스킹', '압박 상황 대처'],
    evaluation_matrix: {
      S_97: {
        answer: '먼저 음료를 종류별로 묶어서 순서를 정리하고, 스팀 밀크는 한 번에 여러 잔 만들어 효율을 높입니다. 동시에 손님께 "○분 정도 소요됩니다"라고 안내드려서 대기 스트레스를 줄여드려요.',
        keywords: ['종류별', '묶어서', '스팀 밀크', '한 번에', '○분 소요', '안내'],
        scoring: { reliability: 2, job_fit: 8, service_mind: 5, logistics: 0 }
      },
      A_83: {
        answer: '순서대로 차근차근 만들고, 손님들께 조금 기다려달라고 양해를 구합니다.',
        keywords: ['순서대로', '차근차근', '양해'],
        scoring: { reliability: 2, job_fit: 5, service_mind: 3, logistics: 0 }
      },
      B_66: {
        answer: '빨리빨리 만들어서 처리합니다.',
        keywords: ['빨리빨리'],
        scoring: { reliability: 1, job_fit: 2, service_mind: 0, logistics: 0 }
      },
      C_48: {
        answer: '당황할 것 같지만 최대한 빨리 하겠습니다.',
        keywords: ['당황', '최대한'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '그런 상황은 싫어요. 그때는 못 나올래요.',
        keywords: ['싫어요', '못 나올래요'],
        scoring: { reliability: -10, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['못 나올래요', '싫어요', '도망'],
    follow_up_triggers: {
      if_good: '그럼 손님이 "내 거 언제 나와요?"라고 재촉하시면요?'
    }
  },

  cafe_q06: {
    question: '손님이 "이 음료 맛이 이상한데요?"라고 하시면 어떻게 대응하시겠어요?',
    category: 'customer_service',
    intent: ['고객 응대', '클레임 처리'],
    evaluation_matrix: {
      S_95: {
        answer: '죄송합니다. 어떤 부분이 이상하신지 여쭤보고, 즉시 새로 제조해드리겠습니다. 혹시 평소 드시던 맛과 다르시다면 레시피를 확인해서 정확히 맞춰드릴게요.',
        keywords: ['죄송', '여쭤보고', '새로 제조', '레시피 확인'],
        scoring: { reliability: 2, job_fit: 2, service_mind: 10, logistics: 0 }
      },
      A_80: {
        answer: '죄송하다고 말씀드리고 다시 만들어드리겠습니다.',
        keywords: ['죄송', '다시 만들어'],
        scoring: { reliability: 1, job_fit: 1, service_mind: 7, logistics: 0 }
      },
      B_62: {
        answer: '뭐가 이상한지 물어보고 확인해보겠습니다.',
        keywords: ['물어보고', '확인'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 4, logistics: 0 }
      },
      C_45: {
        answer: '정확히 만들었는데 왜 그러시는지 모르겠지만 다시 만들어드릴게요.',
        keywords: ['정확히', '왜 그러시는지'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      F_15: {
        answer: '원래 이런 맛인데요. 다른 데서 드셔보세요.',
        keywords: ['원래 이런 맛', '다른 데서'],
        scoring: { reliability: 0, job_fit: 0, service_mind: -10, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['원래 이런 맛', '다른 데서', '제 잘못 아닌'],
    follow_up_triggers: {
      if_good: '그럼 새로 만든 것도 맛이 이상하다고 하시면요?'
    }
  },

  cafe_q07: {
    question: '카페 마감 청소는 어떤 순서로 하는 게 효율적일까요?',
    category: 'job_understanding',
    intent: ['업무 이해도', '프로세스 파악'],
    evaluation_matrix: {
      S_93: {
        answer: '머신 청소를 먼저 하고 (백플러시, 스팀 완드 청소), 홀 테이블 정리, 바닥 청소, 쓰레기 처리 순서로 합니다. 머신이 가장 시간이 걸리니까 먼저 하는 게 효율적이에요.',
        keywords: ['머신 청소', '백플러시', '홀 정리', '바닥', '쓰레기', '순서'],
        scoring: { reliability: 2, job_fit: 8, service_mind: 0, logistics: 0 }
      },
      A_78: {
        answer: '머신 청소, 홀 정리, 바닥 청소 순서로 합니다.',
        keywords: ['머신', '홀', '바닥', '순서'],
        scoring: { reliability: 1, job_fit: 5, service_mind: 0, logistics: 0 }
      },
      B_64: {
        answer: '테이블 닦고, 바닥 쓸고, 쓰레기 버립니다.',
        keywords: ['테이블', '바닥', '쓰레기'],
        scoring: { reliability: 0, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      C_48: {
        answer: '대충 다 치우면 되는 거 아닌가요?',
        keywords: ['대충', '치우면'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_25: {
        answer: '청소는 싫어요. 안 할래요.',
        keywords: ['싫어요', '안 할래요'],
        scoring: { reliability: -10, job_fit: -5, service_mind: 0, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['싫어요', '안 할래요', '청소 안'],
    follow_up_triggers: {
      if_experienced: '머신 청소에서 가장 중요한 부분은 뭐라고 생각하세요?'
    }
  },

  cafe_q08: {
    question: '동료가 실수로 음료를 잘못 만들었는데 손님이 화를 내시면 어떻게 하시겠어요?',
    category: 'teamwork',
    intent: ['팀워크', '책임감', '고객 응대'],
    evaluation_matrix: {
      S_94: {
        answer: '함께 죄송하다고 말씀드리고, 즉시 정확한 음료를 다시 만들어드리겠습니다. 동료를 탓하지 않고 팀으로 해결해야죠.',
        keywords: ['함께', '죄송', '즉시', '다시', '팀으로'],
        scoring: { reliability: 3, job_fit: 2, service_mind: 8, logistics: 0 }
      },
      A_79: {
        answer: '죄송하다고 하고 다시 만들어드립니다.',
        keywords: ['죄송', '다시'],
        scoring: { reliability: 2, job_fit: 1, service_mind: 5, logistics: 0 }
      },
      B_63: {
        answer: '동료에게 다시 만들라고 말합니다.',
        keywords: ['동료에게', '다시 만들'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 2, logistics: 0 }
      },
      C_46: {
        answer: '제가 만든 게 아니라고 설명합니다.',
        keywords: ['제가 아니'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_18: {
        answer: '○○가 잘못 만든 거예요. 저한테 화내지 마세요.',
        keywords: ['○○가 잘못', '저한테 화내지'],
        scoring: { reliability: -10, job_fit: 0, service_mind: -10, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['○○가 잘못', '제 잘못 아니', '저한테 화내지'],
    follow_up_triggers: {
      if_good: '팀워크가 중요하다고 하셨는데, 구체적으로 어떤 상황에서 느끼셨나요?'
    }
  },

  // 3. 성실성 검증 (3개)
  cafe_q09: {
    question: '최소 얼마나 오래 일하실 계획이신가요?',
    category: 'reliability',
    intent: ['장기 근무 의향', '계획성'],
    evaluation_matrix: {
      S_98: {
        answer: '최소 1년 이상 생각하고 있습니다. 시간표도 이미 확인했고 학교 일정과 겹치지 않아요. 가능하면 졸업까지 계속 일하고 싶어요.',
        keywords: ['1년 이상', '시간표 확인', '겹치지 않', '졸업까지'],
        scoring: { reliability: 15, job_fit: 0, service_mind: 0, logistics: 3 }
      },
      A_82: {
        answer: '최소 6개월 이상은 할 수 있을 것 같아요.',
        keywords: ['6개월 이상'],
        scoring: { reliability: 10, job_fit: 0, service_mind: 0, logistics: 2 }
      },
      B_64: {
        answer: '3개월 정도 생각하고 있습니다.',
        keywords: ['3개월'],
        scoring: { reliability: 5, job_fit: 0, service_mind: 0, logistics: 1 }
      },
      C_45: {
        answer: '해보고 괜찮으면 계속하고 싫으면 그만둘게요.',
        keywords: ['해보고', '싫으면'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '모르겠어요. 해보고 싫으면 그만둘 거예요.',
        keywords: ['모르겠', '싫으면 그만'],
        scoring: { reliability: -10, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['싫으면 그만', '모르겠', '일단 해보고'],
    follow_up_triggers: {
      if_good: '그럼 시간표가 바뀌거나 예상치 못한 일정이 생기면 어떻게 하시겠어요?'
    }
  },

  cafe_q10: {
    question: '출퇴근 거리와 소요 시간은 얼마나 되나요? 눈 오는 날이나 교통 파업 같은 상황에서도 출근 가능한가요?',
    category: 'logistics',
    intent: ['통근 편의성', '출근 성실성'],
    evaluation_matrix: {
      S_92: {
        answer: '집에서 도보 10분 거리라 날씨와 무관하게 출근 가능합니다. 만약 대중교통으로 가더라도 지하철 2정거장이라 문제없어요.',
        keywords: ['도보 10분', '날씨 무관', '지하철', '문제없'],
        scoring: { reliability: 5, job_fit: 0, service_mind: 0, logistics: 8 }
      },
      A_78: {
        answer: '버스로 20분 거리인데, 날씨 나쁠 때는 조금 더 일찍 나오면 될 것 같아요.',
        keywords: ['20분', '조금 더 일찍'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 5 }
      },
      B_62: {
        answer: '버스 2번 타고 40분 정도 걸려요. 눈 오면 조금 힘들 것 같긴 해요.',
        keywords: ['40분', '힘들 것 같'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 3 }
      },
      C_46: {
        answer: '1시간 넘게 걸리는데 출근하기 힘들면 쉬고 싶어요.',
        keywords: ['1시간 넘게', '힘들면 쉬고'],
        scoring: { reliability: -3, job_fit: 0, service_mind: 0, logistics: 1 }
      },
      F_22: {
        answer: '멀어서 날씨 나쁘면 못 나올 것 같아요.',
        keywords: ['멀어서', '못 나올'],
        scoring: { reliability: -10, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['못 나올', '날씨 나쁘면', '힘들면 쉬고'],
    follow_up_triggers: {
      if_far: '거리가 좀 있는데 장기적으로 계속 다니실 수 있으실까요?'
    }
  },

  cafe_q11: {
    question: '무단결근이나 지각을 한 적이 있나요? 있다면 이유가 무엇이었나요?',
    category: 'reliability',
    intent: ['성실성', '책임감'],
    evaluation_matrix: {
      S_95: {
        answer: '한 번도 없습니다. 항상 최소 10분 전에 도착하려고 노력하고, 만약 불가피한 상황이 생기면 최소 1시간 전에 연락드릴 것 같아요.',
        keywords: ['한 번도 없', '10분 전', '1시간 전', '연락'],
        scoring: { reliability: 12, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      A_80: {
        answer: '거의 없고, 한 번 가족 경조사로 급하게 못 나간 적 있는데 미리 연락드렸어요.',
        keywords: ['거의 없', '경조사', '미리 연락'],
        scoring: { reliability: 8, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      B_64: {
        answer: '한두 번 지각한 적 있는데 알람을 못 들었어요.',
        keywords: ['한두 번', '알람'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '가끔 늦잠 자서 지각했어요. 연락은 나중에 했던 것 같아요.',
        keywords: ['가끔', '늦잠', '나중에'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_18: {
        answer: '자주 지각하고 몸 안 좋으면 그냥 안 갔어요.',
        keywords: ['자주', '그냥 안 갔'],
        scoring: { reliability: -15, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['자주 지각', '그냥 안 갔', '몸 안 좋으면'],
    follow_up_triggers: {
      if_poor_record: '그럼 이번에는 성실하게 나올 자신 있으신가요?'
    }
  },

  // 4. 직무 전문성 (4개)
  cafe_q12: {
    question: '카페에서 가장 중요한 게 뭐라고 생각하세요?',
    category: 'job_understanding',
    intent: ['업무 이해도', '서비스 철학'],
    evaluation_matrix: {
      S_96: {
        answer: '고객 만족이 가장 중요하다고 생각합니다. 맛있는 음료는 기본이고, 친절한 응대와 깨끗한 환경, 그리고 빠른 서비스가 모두 조화를 이뤄야 해요.',
        keywords: ['고객 만족', '맛있는 음료', '친절', '깨끗', '빠른', '조화'],
        scoring: { reliability: 2, job_fit: 8, service_mind: 8, logistics: 0 }
      },
      A_82: {
        answer: '음료를 정확하게 만들고 친절하게 서비스하는 것이요.',
        keywords: ['정확', '친절', '서비스'],
        scoring: { reliability: 1, job_fit: 5, service_mind: 5, logistics: 0 }
      },
      B_66: {
        answer: '청결과 위생이요.',
        keywords: ['청결', '위생'],
        scoring: { reliability: 0, job_fit: 3, service_mind: 2, logistics: 0 }
      },
      C_48: {
        answer: '음료를 빨리 만드는 거요.',
        keywords: ['빨리'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_25: {
        answer: '시급 많이 주는 거요.',
        keywords: ['시급 많이'],
        scoring: { reliability: 0, job_fit: 0, service_mind: -5, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['시급 많이', '돈 많이', '급여'],
    follow_up_triggers: {
      if_good: '그 가치들을 실제 업무에서 어떻게 실현하시겠어요?'
    }
  },

  cafe_q13: {
    question: '손님이 많지 않은 한가한 시간에는 무엇을 하시겠어요?',
    category: 'job_attitude',
    intent: ['업무 태도', '자기주도성'],
    evaluation_matrix: {
      S_93: {
        answer: '먼저 매장을 깨끗하게 정리하고, 재고를 확인해서 부족한 것 파악하고, 음료 레시피를 복습하거나 새로운 걸 연습할 것 같아요.',
        keywords: ['정리', '재고 확인', '레시피 복습', '연습'],
        scoring: { reliability: 5, job_fit: 7, service_mind: 0, logistics: 0 }
      },
      A_78: {
        answer: '청소하고 테이블 정리하고, 다음 러시 준비합니다.',
        keywords: ['청소', '테이블', '러시 준비'],
        scoring: { reliability: 3, job_fit: 4, service_mind: 0, logistics: 0 }
      },
      B_63: {
        answer: '청소하고 정리합니다.',
        keywords: ['청소', '정리'],
        scoring: { reliability: 2, job_fit: 2, service_mind: 0, logistics: 0 }
      },
      C_46: {
        answer: '할 일 다 했으면 쉽니다.',
        keywords: ['쉽니다'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_22: {
        answer: '핸드폰 보고 쉽니다.',
        keywords: ['핸드폰'],
        scoring: { reliability: -8, job_fit: -5, service_mind: 0, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['핸드폰 보고', '딴짓', '놀고'],
    follow_up_triggers: {
      if_proactive: '구체적으로 어떤 부분을 더 개선하고 싶으세요?'
    }
  },

  cafe_q14: {
    question: '희망 시급은 얼마인가요? 그 금액이 적절하다고 생각하시는 이유는?',
    category: 'logistics',
    intent: ['급여 기대', '현실성'],
    evaluation_matrix: {
      S_90: {
        answer: '최저시급에서 경력을 고려해주시면 감사하겠습니다. 저는 경험이 있으니 바로 일할 수 있고, 시급보다는 좋은 환경에서 오래 일하는 게 더 중요해요.',
        keywords: ['최저시급', '경력 고려', '바로', '오래'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 7 }
      },
      A_78: {
        answer: '최저시급+300원 정도면 적당할 것 같아요. 다른 카페들도 비슷하게 주더라고요.',
        keywords: ['최저시급+300', '비슷'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 5 }
      },
      B_64: {
        answer: '최저시급보다 조금 더 받고 싶어요.',
        keywords: ['최저시급', '조금 더'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 3 }
      },
      C_46: {
        answer: '최저시급+1000원 이상이요. 제가 잘하니까요.',
        keywords: ['+1000원 이상', '잘하니까'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 1 }
      },
      F_22: {
        answer: '시급 15000원은 받아야죠. 안 주면 안 할래요.',
        keywords: ['15000원', '안 주면 안'],
        scoring: { reliability: -5, job_fit: 0, service_mind: 0, logistics: -5 }
      }
    },
    critical_fail: true,
    fail_triggers: ['시급 15000', '시급 2만', '안 주면 안'],
    follow_up_triggers: {
      if_unrealistic: '그 시급을 주는 카페를 찾아보셨나요?'
    }
  },

  cafe_q15: {
    question: '카페에서 배우고 싶은 것이나 목표가 있으신가요?',
    category: 'motivation',
    intent: ['학습 의지', '목표 의식'],
    evaluation_matrix: {
      S_94: {
        answer: '라떼아트를 제대로 배우고 싶고, 다양한 원두의 특성도 이해하고 싶어요. 나중에는 바리스타 2급 자격증도 도전해보고 싶습니다.',
        keywords: ['라떼아트', '원두 특성', '자격증', '도전'],
        scoring: { reliability: 2, job_fit: 8, service_mind: 0, logistics: 0 }
      },
      A_80: {
        answer: '커피 만드는 기술을 배우고 고객 응대도 잘하고 싶어요.',
        keywords: ['기술', '고객 응대'],
        scoring: { reliability: 1, job_fit: 5, service_mind: 2, logistics: 0 }
      },
      B_65: {
        answer: '알바 경험을 쌓고 싶어요.',
        keywords: ['경험'],
        scoring: { reliability: 0, job_fit: 2, service_mind: 0, logistics: 0 }
      },
      C_48: {
        answer: '딱히 없어요. 그냥 일하려고요.',
        keywords: ['딱히 없'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_25: {
        answer: '배울 생각 없고 그냥 돈만 벌려고요.',
        keywords: ['배울 생각 없', '돈만'],
        scoring: { reliability: -5, job_fit: -5, service_mind: 0, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['배울 생각 없', '돈만 벌려고', '별로 없'],
    follow_up_triggers: {
      if_good: '그 목표를 위해 개인적으로 어떤 노력을 하고 계신가요?'
    }
  },

  // 5. 스트레스 관리 (3개)
  cafe_q16: {
    question: '일하면서 스트레스를 받으면 어떻게 해소하시나요?',
    category: 'stress_management',
    intent: ['스트레스 대처', '회복탄력성'],
    evaluation_matrix: {
      S_90: {
        answer: '운동이나 취미 생활로 해소하고, 일에서 받은 스트레스는 일로 풀어요. 잘 극복하면 성장하는 계기가 되더라고요.',
        keywords: ['운동', '취미', '일로 풀', '성장'],
        scoring: { reliability: 5, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      A_76: {
        answer: '친구들이랑 얘기하거나 잠 자면 괜찮아져요.',
        keywords: ['친구', '얘기', '잠'],
        scoring: { reliability: 3, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      B_62: {
        answer: '좀 쉬면 괜찮아집니다.',
        keywords: ['쉬면'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_46: {
        answer: '스트레스 받으면 일하기 싫어져요.',
        keywords: ['일하기 싫'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '스트레스 받으면 그냥 그만둬요.',
        keywords: ['그냥 그만둬'],
        scoring: { reliability: -10, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['그냥 그만둬', '참을 수 없', '견딜 수 없'],
    follow_up_triggers: {
      if_poor: '그럼 서비스직 자체가 안 맞는 건 아닐까요?'
    }
  },

  cafe_q17: {
    question: '손님이 불합리한 요구를 하시면 어떻게 대처하시겠어요?',
    category: 'conflict_resolution',
    intent: ['갈등 해결', '스트레스 내성'],
    evaluation_matrix: {
      S_92: {
        answer: '일단 경청하고 공감을 표하면서, 가능한 부분과 어려운 부분을 차분히 설명드릴 것 같아요. 해결이 안 되면 매니저님께 도움을 요청하고요.',
        keywords: ['경청', '공감', '차분히 설명', '매니저', '도움'],
        scoring: { reliability: 3, job_fit: 2, service_mind: 8, logistics: 0 }
      },
      A_78: {
        answer: '정중하게 안 된다고 설명드립니다.',
        keywords: ['정중하게', '설명'],
        scoring: { reliability: 2, job_fit: 1, service_mind: 5, logistics: 0 }
      },
      B_63: {
        answer: '안 된다고 말씀드립니다.',
        keywords: ['안 된다고'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 2, logistics: 0 }
      },
      C_46: {
        answer: '무리한 요구는 들어줄 수 없다고 단호하게 말합니다.',
        keywords: ['단호하게'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '왜 그런 요구를 하시는지 모르겠어요. 짜증나요.',
        keywords: ['모르겠', '짜증'],
        scoring: { reliability: -5, job_fit: 0, service_mind: -8, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['짜증', '황당', '어이없'],
    follow_up_triggers: {
      if_good: '구체적으로 어떤 불합리한 요구를 경험해보셨나요?'
    }
  },

  cafe_q18: {
    question: '비판적인 피드백을 받았을 때 어떻게 반응하시나요?',
    category: 'feedback_receptivity',
    intent: ['피드백 수용', '개선 의지'],
    evaluation_matrix: {
      S_91: {
        answer: '감사하게 받아들이고, 구체적으로 뭘 개선하면 좋을지 여쭤봅니다. 피드백은 제가 성장할 수 있는 기회라고 생각해요.',
        keywords: ['감사', '개선', '여쭤', '성장', '기회'],
        scoring: { reliability: 5, job_fit: 5, service_mind: 0, logistics: 0 }
      },
      A_77: {
        answer: '일단 받아들이고 고치려고 노력합니다.',
        keywords: ['받아들', '고치려고'],
        scoring: { reliability: 3, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      B_62: {
        answer: '기분은 안 좋지만 이해하려고 합니다.',
        keywords: ['기분 안 좋', '이해'],
        scoring: { reliability: 2, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '왜 저한테만 그러시는지 모르겠어요.',
        keywords: ['왜 저한테만'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_22: {
        answer: '기분 나빠서 듣기 싫어요.',
        keywords: ['기분 나빠', '듣기 싫'],
        scoring: { reliability: -8, job_fit: -5, service_mind: 0, logistics: 0 }
      }
    },
    critical_fail: true,
    fail_triggers: ['듣기 싫', '못 받아들', '기분 나빠'],
    follow_up_triggers: {
      if_good: '실제로 피드백을 받고 개선한 사례가 있나요?'
    }
  },

  // 6. 마지막 종합 (2개)
  cafe_q19: {
    question: '저희 카페에 대해 궁금한 점이나 질문 있으신가요?',
    category: 'interest_level',
    intent: ['관심도', '적극성'],
    evaluation_matrix: {
      S_88: {
        answer: '교육은 어떻게 진행되나요? 메뉴 수는 몇 개이고, 특히 배워야 할 시그니처 메뉴가 있나요? 유니폼은 제공되나요?',
        keywords: ['교육', '메뉴 수', '시그니처', '유니폼'],
        scoring: { reliability: 2, job_fit: 5, service_mind: 0, logistics: 0 }
      },
      A_74: {
        answer: '교육 기간이 얼마나 되나요? 급여일은 언제인가요?',
        keywords: ['교육 기간', '급여일'],
        scoring: { reliability: 1, job_fit: 2, service_mind: 0, logistics: 2 }
      },
      B_60: {
        answer: '급여일이 언제인가요?',
        keywords: ['급여일'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 2 }
      },
      C_44: {
        answer: '딱히 없어요.',
        keywords: ['딱히 없'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_25: {
        answer: '시급 더 못 올려주나요?',
        keywords: ['시급 더'],
        scoring: { reliability: -3, job_fit: 0, service_mind: 0, logistics: -2 }
      }
    },
    critical_fail: false,
    follow_up_triggers: {
      if_none: '카페에 대해 미리 알아보고 오셨나요?'
    }
  },

  cafe_q20: {
    question: '마지막으로 본인을 뽑아야 하는 이유를 한 문장으로 말씀해주세요.',
    category: 'closing',
    intent: ['자기 PR', '종합 평가'],
    evaluation_matrix: {
      S_93: {
        answer: '저는 커피에 진심이고, 고객 만족을 최우선으로 생각하며, 책임감 있게 오래 일할 자신이 있습니다.',
        keywords: ['커피 진심', '고객 만족', '책임감', '오래'],
        scoring: { reliability: 5, job_fit: 5, service_mind: 3, logistics: 0 }
      },
      A_79: {
        answer: '성실하고 배우려는 의지가 강합니다.',
        keywords: ['성실', '배우려는 의지'],
        scoring: { reliability: 4, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      B_64: {
        answer: '열심히 일하겠습니다.',
        keywords: ['열심히'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_46: {
        answer: '일 잘하고 오래 다닐게요.',
        keywords: ['일 잘하고'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_24: {
        answer: '모르겠는데요. 뽑으시면 다닐게요.',
        keywords: ['모르겠는데'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    critical_fail: false
  }
};

// ========================================
// Critical 질문 즉시 탈락 매트릭스
// ========================================

export const CRITICAL_FAIL_MATRIX = {
  cafe: {
    customer_complaint: {
      question_id: 'cafe_q06',
      fail_triggers: ['원래 이런 맛', '다른 데서', '제 잘못 아닌'],
      reason: '고객 응대 부적절 - 서비스 마인드 결여'
    },
    weekend_work: {
      question_id: 'cafe_q02',
      fail_triggers: ['주말 절대 안', '시험기간 못', '불규칙해서'],
      reason: '주말 근무 불가 - 카페 필수 조건 미충족'
    },
    learning_attitude: {
      question_id: 'cafe_q03',
      fail_triggers: ['관심 없어요', '계산만', '안 배우고 싶'],
      reason: '학습 의지 없음 - 직무 부적합'
    },
    reliability: {
      question_id: 'cafe_q09',
      fail_triggers: ['싫으면 그만', '모르겠', '일단 해보고'],
      reason: '장기 근무 의사 없음 - 성실성 의심'
    }
  },

  convenience: {
    underage_sales: {
      question_id: 'cvs_q01',
      fail_triggers: ['그냥 팔아도', '괜찮을 것 같', '한두 번은'],
      reason: '법적 준수 의식 부족 - 치명적 위험'
    },
    safety_crisis: {
      question_id: 'cvs_q02',
      fail_triggers: ['저도 한마디', '싸움 날', '맞서서'],
      reason: '안전 의식 결여 - 위기 대응 부적절'
    }
  },

  restaurant: {
    spill_accident: {
      fail_triggers: ['제 잘못 아니', '원래 그런', '몰라'],
      reason: '책임감 결여 - 고객 응대 부적절'
    },
    weekend_work: {
      fail_triggers: ['불가능', '안 돼', '주말은'],
      reason: '주말 근무 불가 - 음식점 필수 조건 미충족'
    },
    teamwork: {
      fail_triggers: ['○○가 잘못', '제 잘못 아니', '저한테 화내지'],
      reason: '팀워크 결여 - 동료 비난'
    }
  },

  retail: {
    weekend_work: {
      fail_triggers: ['주말 안', '절대 불가', '개인 시간'],
      reason: '주말 근무 불가 - 매장 필수 조건 미충족'
    }
  },

  fastfood: {
    hygiene_safety: {
      fail_triggers: ['다시 튀김기에', '아까우니까', '나중에 치움'],
      reason: '위생 의식 결여 - 식품 안전 위반'
    }
  }
};

// ========================================
// 🏪 편의점 알바 완성 데이터셋 (20개 질문)
// ========================================

export const CVS_INTERVIEW_SET = {
  // 1. 기본 정보 수집 (4개)
  cvs_q01: {
    question: '편의점 알바에 지원하신 이유와 자기소개를 해주세요.',
    category: 'basic_info',
    intent: ['지원동기 진정성', '편의점 업무 이해도'],
    evaluation_matrix: {
      S_95: {
        answer: '이전에 GS25에서 1년간 근무했고 재고관리와 POS 시스템 능숙하게 다룰 수 있습니다. 특히 야간 근무 경험이 많아서 혼자서도 매장 관리 자신 있습니다.',
        keywords: ['GS25', '1년', '재고관리', 'POS', '야간', '경험'],
        scoring: { reliability: 3, job_fit: 8, service_mind: 2, logistics: 2 }
      },
      A_82: {
        answer: '편의점 업무가 다양해서 많이 배울 수 있을 것 같아 지원했습니다. 집에서 가깝고 장기근무 희망합니다.',
        keywords: ['다양', '배울', '가깝', '장기근무'],
        scoring: { reliability: 3, job_fit: 5, service_mind: 2, logistics: 3 }
      },
      B_68: {
        answer: '편의점은 처음이지만 알바 경험을 쌓고 싶어서 지원했습니다.',
        keywords: ['처음', '경험', '쌓고'],
        scoring: { reliability: 2, job_fit: 2, service_mind: 1, logistics: 1 }
      },
      C_52: {
        answer: '그냥 시급이 괜찮아서요. 집이 가까워서 편할 것 같아요.',
        keywords: ['그냥', '시급', '가까워서'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 2 }
      },
      F_20: {
        answer: '별로 생각 없는데 친구가 같이 하자고 해서요.',
        keywords: ['별로', '생각 없는', '친구'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_vague: '편의점에서 일하면서 가장 기대하는 점이 뭐예요?',
      if_good: '그럼 편의점 업무 중 어떤 부분이 가장 어려울 것 같아요?'
    },
    critical_fail: false
  },

  cvs_q02: {
    question: '근무 가능한 시간대를 구체적으로 말씀해주세요.',
    category: 'logistics',
    intent: ['시간 가용성', '야간 근무 가능성'],
    evaluation_matrix: {
      S_95: {
        answer: '야간 근무(오후 11시~오전 7시) 가능하고 주말도 모두 가능합니다. 특히 야간에 집중해서 일하고 싶어요.',
        keywords: ['야간', '오후 11시', '오전 7시', '주말', '모두 가능'],
        scoring: { reliability: 5, job_fit: 0, service_mind: 0, logistics: 10 }
      },
      A_80: {
        answer: '평일 저녁 6시부터 11시까지, 주말은 토요일 가능합니다.',
        keywords: ['평일', '저녁', '토요일', '가능'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 7 }
      },
      B_65: {
        answer: '평일 오후 시간대 가능해요. 주말은 토요일만 가능합니다.',
        keywords: ['평일', '오후', '토요일만'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 5 }
      },
      C_45: {
        answer: '평일 낮만 가능하고 야간이나 주말은 어렵습니다.',
        keywords: ['평일 낮만', '야간 어렵', '주말 어렵'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 2 }
      },
      F_15: {
        answer: '그때그때 연락 주시면 가능할 때만 나갈게요.',
        keywords: ['그때그때', '가능할 때만'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_limited: '주말이나 야간 근무가 어려운 이유가 있나요?',
      if_good: '야간 근무 시 혼자 매장 관리 경험이 있나요?'
    },
    critical_fail: false
  },

  cvs_q03: {
    question: '편의점까지 출퇴근 시간과 교통수단을 알려주세요.',
    category: 'logistics',
    intent: ['출퇴근 가능성', '거리 적합성'],
    evaluation_matrix: {
      S_92: {
        answer: '걸어서 5분 거리입니다. 야간 근무도 걸어서 가능해요.',
        keywords: ['걸어서', '5분', '야간 가능'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 10 }
      },
      A_78: {
        answer: '버스로 15분 정도 걸려요. 첫차, 막차 시간 확인했고 문제없습니다.',
        keywords: ['버스', '15분', '첫차', '막차', '문제없'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 7 }
      },
      B_65: {
        answer: '지하철로 30분 정도 걸려요.',
        keywords: ['지하철', '30분'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 5 }
      },
      C_48: {
        answer: '버스 2번 갈아타야 해서 1시간 정도 걸려요.',
        keywords: ['갈아타', '1시간'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 2 }
      },
      F_18: {
        answer: '좀 멀긴 한데, 시급 좋으면 다녀볼게요.',
        keywords: ['좀 멀', '시급 좋으면'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_far: '출퇴근에 1시간 이상 걸리면 장기근무가 힘들 수 있는데 괜찮으세요?',
      if_good: '야간 근무 시 대중교통 이용이 어려울 텐데 대안이 있나요?'
    },
    critical_fail: false
  },

  cvs_q04: {
    question: '희망 시급과 최소 근무 기간을 말씀해주세요.',
    category: 'logistics',
    intent: ['급여 현실성', '장기근무 의향'],
    evaluation_matrix: {
      S_90: {
        answer: '최저시급도 괜찮고, 최소 1년 이상 장기근무 희망합니다. 야간은 시급이 더 높다고 들어서 야간 우선 지원했어요.',
        keywords: ['최저시급', '1년 이상', '장기근무', '야간'],
        scoring: { reliability: 7, job_fit: 0, service_mind: 0, logistics: 8 }
      },
      A_78: {
        answer: '시급은 최저시급에서 협의 가능하고, 6개월 이상 일할 생각입니다.',
        keywords: ['최저시급', '협의', '6개월'],
        scoring: { reliability: 5, job_fit: 0, service_mind: 0, logistics: 6 }
      },
      B_62: {
        answer: '최저시급 받으면서 3개월 정도 일할 생각이에요.',
        keywords: ['최저시급', '3개월'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 4 }
      },
      C_45: {
        answer: '시급은 좀 높으면 좋겠고, 일단 해보고 맞으면 계속할게요.',
        keywords: ['시급 높으면', '일단 해보고'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 2 }
      },
      F_18: {
        answer: '최소 만 오천원은 받아야 할 것 같은데요? 한 달 정도 해보고 결정할게요.',
        keywords: ['만 오천원', '한 달', '결정'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_unrealistic: '편의점 알바 시급이 보통 최저시급인데, 왜 그 금액을 원하시나요?',
      if_good: '장기근무 의향이 있다니 좋네요. 특별히 배우고 싶은 업무가 있나요?'
    },
    critical_fail: false
  },

  // 2. 상황 대처 능력 (4개)
  cvs_q05: {
    question: '손님이 담배를 사려는데 신분증이 없다고 합니다. 어떻게 하시겠어요?',
    category: 'situation_handling',
    intent: ['법규 준수', '고객 응대', '판단력'],
    evaluation_matrix: {
      S_98: {
        answer: '죄송하지만 신분증 확인 없이는 담배 판매가 불가능하다고 정중히 설명드리고, 다음에 신분증 지참 후 방문해달라고 안내합니다. 이건 법으로 정해진 사항이라 양해 부탁드린다고 말씀드려요.',
        keywords: ['신분증 확인', '불가능', '정중히', '법', '양해'],
        scoring: { reliability: 10, job_fit: 3, service_mind: 2, logistics: 0 }
      },
      A_80: {
        answer: '신분증 없으면 담배 판매가 안 된다고 설명하고 양해를 구합니다.',
        keywords: ['신분증 없으면', '판매 안 됨', '양해'],
        scoring: { reliability: 7, job_fit: 2, service_mind: 1, logistics: 0 }
      },
      B_60: {
        answer: '신분증 가져오라고 말하고 안 되면 팔지 않아요.',
        keywords: ['신분증 가져오라', '안 팔아'],
        scoring: { reliability: 4, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      C_40: {
        answer: '성인처럼 보이면 그냥 팔아도 될 것 같은데... 일단 점장님께 물어봐요.',
        keywords: ['성인처럼 보이면', '그냥', '물어봐'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_10: {
        answer: '성인이면 괜찮지 않나요? 문제 생기면 손님이 책임지는 거 아닌가요?',
        keywords: ['괜찮지 않나', '손님이 책임'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '만약 손님이 화를 내면서 강하게 요구하면 어떻게 하시겠어요?',
      if_good: '신분증 위조 가능성도 있는데, 어떻게 확인하시겠어요?'
    },
    critical_question: true,
    auto_reject_reason: '미성년자 담배 판매 방지 의무 불이행'
  },

  cvs_q06: {
    question: '야간 근무 중 술 취한 손님이 시비를 걸어옵니다. 어떻게 대응하시겠어요?',
    category: 'situation_handling',
    intent: ['위기 대응', '안전 의식', '판단력'],
    evaluation_matrix: {
      S_95: {
        answer: '우선 침착하게 손님을 진정시키려고 노력하고, 계속 시비가 지속되면 경찰에 신고합니다. 동시에 점장님께 연락드려서 상황을 보고하고, CCTV 녹화 중임을 알립니다. 제 안전이 최우선이니까 위험하면 매장 밖으로 나가겠습니다.',
        keywords: ['침착', '진정', '경찰 신고', '점장 연락', 'CCTV', '안전'],
        scoring: { reliability: 8, job_fit: 2, service_mind: 3, logistics: 0 }
      },
      A_82: {
        answer: '최대한 진정시키려 노력하고, 안 되면 경찰에 신고하고 점장님께 연락드립니다.',
        keywords: ['진정', '경찰 신고', '점장 연락'],
        scoring: { reliability: 6, job_fit: 1, service_mind: 2, logistics: 0 }
      },
      B_65: {
        answer: '일단 무시하고, 계속 시비 걸면 경찰 불러요.',
        keywords: ['무시', '경찰 불러'],
        scoring: { reliability: 3, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '솔직히 무서울 것 같은데... 점장님께 전화해서 어떻게 하라고 하는지 물어볼게요.',
        keywords: ['무서울', '점장님', '물어볼'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_15: {
        answer: '저도 맞서서 소리 지를 것 같아요. 손님이라고 막 대하면 안 되죠.',
        keywords: ['맞서서', '소리 지를', '막 대하면'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '야간 근무 중 이런 상황이 자주 발생할 수 있는데 괜찮으세요?',
      if_good: '이전에 비슷한 상황을 겪어본 적 있나요?'
    },
    critical_question: true,
    auto_reject_reason: '위기 상황 대응 능력 부족'
  },

  cvs_q07: {
    question: '갑자기 동료가 근무 30분 전에 못 나온다고 연락이 왔습니다. 어떻게 하시겠어요?',
    category: 'situation_handling',
    intent: ['책임감', '문제 해결', '협력'],
    evaluation_matrix: {
      S_93: {
        answer: '일단 점장님께 바로 연락드려서 상황을 보고하고, 제가 추가 근무 가능한지 확인합니다. 가능하면 대신 근무하겠다고 제안하고, 불가능하면 다른 직원 연락처를 알려드립니다.',
        keywords: ['점장 연락', '상황 보고', '추가 근무', '대신', '제안'],
        scoring: { reliability: 9, job_fit: 1, service_mind: 2, logistics: 0 }
      },
      A_80: {
        answer: '점장님께 연락드려서 상황을 알리고, 제가 추가 근무 가능하다고 말씀드립니다.',
        keywords: ['점장 연락', '추가 근무 가능'],
        scoring: { reliability: 7, job_fit: 1, service_mind: 1, logistics: 0 }
      },
      B_63: {
        answer: '점장님께 연락드려서 어떻게 하라고 하는지 물어봐요.',
        keywords: ['점장 연락', '물어봐'],
        scoring: { reliability: 4, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '제 근무 시간이 아니니까 점장님이 알아서 하실 거예요.',
        keywords: ['내 근무 아님', '알아서'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_18: {
        answer: '저도 급하게 나가야 할 때가 있을 수 있으니, 서로 이해해야죠.',
        keywords: ['저도', '서로 이해'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '팀워크가 중요한데, 동료를 도울 의향이 있나요?',
      if_good: '추가 근무를 자주 할 수 있나요?'
    },
    critical_fail: false
  },

  cvs_q08: {
    question: '피크 타임(점심시간)에 손님이 몰려서 줄이 길어졌습니다. 어떻게 하시겠어요?',
    category: 'situation_handling',
    intent: ['멀티태스킹', '스트레스 관리', '우선순위'],
    evaluation_matrix: {
      S_92: {
        answer: '우선 계산을 최대한 빠르고 정확하게 처리하고, 손님께 기다려주셔서 감사하다고 말씀드립니다. 동시에 다른 업무(상품 진열 등)는 피크 타임이 끝난 후로 미루고, 계산에만 집중합니다. 여유가 생기면 다음 손님 미리 준비합니다.',
        keywords: ['빠르게', '정확', '감사', '집중', '우선순위'],
        scoring: { reliability: 3, job_fit: 7, service_mind: 3, logistics: 0 }
      },
      A_78: {
        answer: '빨리 계산하고, 손님께 죄송하다고 말씀드립니다.',
        keywords: ['빨리', '죄송'],
        scoring: { reliability: 2, job_fit: 5, service_mind: 2, logistics: 0 }
      },
      B_62: {
        answer: '최대한 빨리 처리하려고 노력해요.',
        keywords: ['빨리', '처리'],
        scoring: { reliability: 1, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      C_48: {
        answer: '손님이 많으면 느려질 수밖에 없으니 기다려야죠.',
        keywords: ['느려질 수밖에', '기다려야'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '그럴 땐 점장님이 도와주셔야 하는 거 아닌가요?',
        keywords: ['점장님이 도와', '아닌가요'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '피크 타임에 혼자 근무하는 경우가 많은데 괜찮으세요?',
      if_good: '계산 속도와 정확성 중 어느 것이 더 중요하다고 생각하세요?'
    },
    critical_fail: false
  },

  // 3. 성실성 및 책임감 (4개)
  cvs_q09: {
    question: '근무 중 실수로 상품을 떨어뜨려 파손시켰습니다. 어떻게 하시겠어요?',
    category: 'reliability',
    intent: ['정직성', '책임감', '문제 해결'],
    evaluation_matrix: {
      S_95: {
        answer: '즉시 점장님께 보고하고 상황을 설명드립니다. 제 실수니까 변상 의사를 밝히고, 재발 방지를 위해 더 조심하겠다고 말씀드립니다.',
        keywords: ['즉시 보고', '설명', '변상', '재발 방지', '조심'],
        scoring: { reliability: 10, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      A_80: {
        answer: '점장님께 보고하고 죄송하다고 말씀드립니다.',
        keywords: ['보고', '죄송'],
        scoring: { reliability: 7, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      B_63: {
        answer: '점장님께 말씀드려요.',
        keywords: ['말씀드려'],
        scoring: { reliability: 4, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '실수는 누구나 할 수 있으니까 점장님께 말씀드리고 이해 부탁드려요.',
        keywords: ['누구나', '이해 부탁'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_15: {
        answer: '몰래 버리거나 다른 곳에 숨겨놓고 모르는 척 할 것 같아요.',
        keywords: ['몰래', '숨겨', '모르는 척'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '실수에 대한 책임을 지는 게 부담스럽지 않나요?',
      if_good: '이전에 비슷한 상황을 겪어본 적 있나요?'
    },
    critical_question: true,
    auto_reject_reason: '정직성 부족'
  },

  cvs_q10: {
    question: '유통기한이 하루 지난 도시락을 발견했습니다. 어떻게 하시겠어요?',
    category: 'reliability',
    intent: ['법규 준수', '식품 안전', '책임감'],
    evaluation_matrix: {
      S_98: {
        answer: '즉시 폐기 처리하고 점장님께 보고합니다. 유통기한 지난 제품은 절대 판매하면 안 되고, 폐기 절차에 따라 처리합니다. 다른 제품들도 점검해서 유통기한 임박 상품은 따로 정리합니다.',
        keywords: ['즉시 폐기', '보고', '절대 판매 안 됨', '점검'],
        scoring: { reliability: 10, job_fit: 2, service_mind: 0, logistics: 0 }
      },
      A_82: {
        answer: '폐기 처리하고 점장님께 보고합니다.',
        keywords: ['폐기', '보고'],
        scoring: { reliability: 8, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      B_65: {
        answer: '점장님께 물어보고 지시에 따라 처리해요.',
        keywords: ['물어보고', '지시'],
        scoring: { reliability: 4, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_40: {
        answer: '하루 정도면 괜찮지 않나요? 점장님께 물어봐야겠어요.',
        keywords: ['하루면 괜찮', '물어봐'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_10: {
        answer: '냉장 제품이면 며칠 더 괜찮을 것 같은데... 제가 먹어도 되나요?',
        keywords: ['며칠 더 괜찮', '제가 먹어도'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '유통기한 관리가 편의점에서 가장 중요한데, 이해하고 계신가요?',
      if_good: '유통기한 임박 상품 관리 경험이 있나요?'
    },
    critical_question: true,
    auto_reject_reason: '식품 안전 의식 부족'
  },

  cvs_q11: {
    question: '근무 중 감기 기운이 심하게 느껴집니다. 어떻게 하시겠어요?',
    category: 'reliability',
    intent: ['책임감', '건강 관리', '업무 지속성'],
    evaluation_matrix: {
      S_90: {
        answer: '우선 점장님께 상황을 말씀드리고, 마스크를 착용하고 최대한 근무를 완수하려고 노력합니다. 만약 증상이 심각해지면 조퇴를 요청하고, 다음 근무자가 올 때까지는 자리를 지킵니다.',
        keywords: ['점장 보고', '마스크', '근무 완수', '조퇴 요청', '자리 지킴'],
        scoring: { reliability: 9, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      A_78: {
        answer: '점장님께 말씀드리고 마스크 착용하고 근무합니다.',
        keywords: ['점장 말씀', '마스크', '근무'],
        scoring: { reliability: 6, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      B_62: {
        answer: '약 먹고 마스크 쓰고 버텨요.',
        keywords: ['약', '마스크', '버텨'],
        scoring: { reliability: 4, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '점장님께 연락해서 조퇴 요청할게요.',
        keywords: ['조퇴 요청'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '아프면 나갈 수 없죠. 연락하고 쉴게요.',
        keywords: ['나갈 수 없', '쉴게'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '갑작스런 건강 문제로 근무가 어려울 때가 많나요?',
      if_good: '건강 관리를 위해 어떤 노력을 하시나요?'
    },
    critical_fail: false
  },

  cvs_q12: {
    question: '이전 직장에서 퇴사한 이유는 무엇인가요?',
    category: 'reliability',
    intent: ['장기근무 가능성', '태도', '진정성'],
    evaluation_matrix: {
      S_88: {
        answer: '학교와 알바를 병행하다 보니 시간 관리가 어려워서 정리하고, 이번에는 장기적으로 일할 수 있는 곳을 찾고 있습니다. 이전 직장과는 원만하게 퇴사했습니다.',
        keywords: ['시간 관리', '장기적', '원만'],
        scoring: { reliability: 7, job_fit: 1, service_mind: 0, logistics: 1 }
      },
      A_75: {
        answer: '학업과 병행하기 어려워서 그만뒀고, 이번에는 더 안정적으로 일하고 싶어요.',
        keywords: ['학업', '병행', '안정적'],
        scoring: { reliability: 5, job_fit: 1, service_mind: 0, logistics: 1 }
      },
      B_60: {
        answer: '집에서 너무 멀어서 그만뒀어요.',
        keywords: ['너무 멀어서'],
        scoring: { reliability: 3, job_fit: 0, service_mind: 0, logistics: 1 }
      },
      C_42: {
        answer: '일이 너무 힘들고 시급도 낮아서 그만뒀어요.',
        keywords: ['너무 힘들', '시급 낮아'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_18: {
        answer: '사장님이랑 안 맞아서 그만뒀어요.',
        keywords: ['사장님', '안 맞아서'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_negative: '이번 직장에서도 같은 이유로 퇴사할 가능성은 없나요?',
      if_good: '이전 직장에서 배운 점이 있다면 무엇인가요?'
    },
    critical_fail: false
  },

  // 4. 전문 지식 및 기술 (4개)
  cvs_q13: {
    question: 'POS 시스템과 현금 계산 경험이 있나요?',
    category: 'professional_knowledge',
    intent: ['기술 숙련도', '업무 경험', '학습 능력'],
    evaluation_matrix: {
      S_95: {
        answer: '네, 이전 편의점에서 1년간 POS 시스템 사용했고, 현금 정산도 매일 했습니다. 카드 결제, 포인트 적립, 택배 접수, 택스리펀 등 모두 능숙합니다.',
        keywords: ['1년', 'POS', '현금 정산', '카드', '포인트', '택배', '택스리펀'],
        scoring: { reliability: 1, job_fit: 10, service_mind: 1, logistics: 0 }
      },
      A_82: {
        answer: '다른 매장에서 POS 시스템 사용해봤고, 현금 계산도 경험 있습니다.',
        keywords: ['POS', '경험'],
        scoring: { reliability: 1, job_fit: 7, service_mind: 1, logistics: 0 }
      },
      B_65: {
        answer: '처음이지만 빨리 배울 자신 있습니다.',
        keywords: ['처음', '빨리 배울'],
        scoring: { reliability: 1, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      C_48: {
        answer: '없는데 어렵나요? 가르쳐주시면 따라할게요.',
        keywords: ['없는데', '가르쳐주면'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '그런 건 처음이라 잘 모르겠는데, 하다 보면 되겠죠?',
        keywords: ['처음', '잘 모르겠', '하다 보면'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_none: '기술 습득에 자신이 있나요? 얼마나 빨리 배울 수 있을까요?',
      if_good: '가장 복잡했던 POS 업무는 무엇이었나요?'
    },
    critical_fail: false
  },

  cvs_q14: {
    question: '편의점 상품 진열과 재고 관리 경험이 있나요?',
    category: 'professional_knowledge',
    intent: ['업무 이해도', '경험', '세심함'],
    evaluation_matrix: {
      S_92: {
        answer: '네, 선입선출 원칙에 따라 유통기한 임박 상품을 앞으로 배치하고, 재고 확인하면서 발주도 해봤습니다. 진열 시 POP 광고와 프로모션 상품 위치도 신경 썼습니다.',
        keywords: ['선입선출', '유통기한', '발주', 'POP', '프로모션'],
        scoring: { reliability: 2, job_fit: 9, service_mind: 0, logistics: 0 }
      },
      A_80: {
        answer: '재고 정리하고 상품 진열해봤어요. 유통기한도 체크했습니다.',
        keywords: ['재고', '진열', '유통기한'],
        scoring: { reliability: 1, job_fit: 6, service_mind: 0, logistics: 0 }
      },
      B_65: {
        answer: '처음이지만 배우고 싶어요.',
        keywords: ['처음', '배우고'],
        scoring: { reliability: 1, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '그냥 정리하면 되는 거 아닌가요?',
        keywords: ['그냥 정리'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_18: {
        answer: '그런 일은 점장님이 하는 거 아닌가요?',
        keywords: ['점장님이 하는'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_none: '재고 관리가 왜 중요하다고 생각하시나요?',
      if_good: '재고 관리 시 가장 중요하게 생각하는 점은 무엇인가요?'
    },
    critical_fail: false
  },

  cvs_q15: {
    question: '편의점 서비스(택배, 공과금 납부, 편의 서비스) 중 경험 있는 것이 있나요?',
    category: 'professional_knowledge',
    intent: ['다양한 업무 경험', '학습 능력', '서비스 이해'],
    evaluation_matrix: {
      S_90: {
        answer: '택배 접수와 발송, 공과금 납부, 교통카드 충전, ATM 관리 등 대부분의 편의 서비스 경험이 있습니다. 복권 판매와 상품권 관리도 해봤어요.',
        keywords: ['택배', '공과금', '교통카드', 'ATM', '복권', '상품권'],
        scoring: { reliability: 1, job_fit: 8, service_mind: 2, logistics: 0 }
      },
      A_78: {
        answer: '택배 접수하고 공과금 납부 도와드린 경험 있습니다.',
        keywords: ['택배', '공과금'],
        scoring: { reliability: 1, job_fit: 6, service_mind: 1, logistics: 0 }
      },
      B_63: {
        answer: '없지만 배울 의향 있습니다.',
        keywords: ['없지만', '배울 의향'],
        scoring: { reliability: 1, job_fit: 3, service_mind: 0, logistics: 0 }
      },
      C_45: {
        answer: '그런 거 많이 복잡한가요?',
        keywords: ['복잡한가'],
        scoring: { reliability: 0, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '그런 건 손님이 알아서 하는 거 아닌가요?',
        keywords: ['손님이 알아서'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_none: '편의점이 다양한 서비스를 제공한다는 걸 알고 계셨나요?',
      if_good: '복잡한 편의 서비스 요청을 받았을 때 어떻게 대응하셨나요?'
    },
    critical_fail: false
  },

  cvs_q16: {
    question: '편의점 업무 중 가장 중요하다고 생각하는 것은 무엇인가요?',
    category: 'professional_knowledge',
    intent: ['업무 우선순위', '이해도', '가치관'],
    evaluation_matrix: {
      S_93: {
        answer: '고객 응대, 위생 관리, 유통기한 체크, 정확한 계산 모두 중요하지만 특히 법규 준수(미성년자 판매 금지, 유통기한 관리)가 가장 중요하다고 생각합니다. 이건 편의점의 신뢰와 직결되니까요.',
        keywords: ['고객 응대', '위생', '유통기한', '법규 준수', '신뢰'],
        scoring: { reliability: 4, job_fit: 7, service_mind: 2, logistics: 0 }
      },
      A_80: {
        answer: '친절한 고객 응대와 정확한 계산이 가장 중요하다고 생각합니다.',
        keywords: ['친절', '정확한 계산'],
        scoring: { reliability: 2, job_fit: 5, service_mind: 3, logistics: 0 }
      },
      B_65: {
        answer: '빠른 계산과 정리정돈이 중요할 것 같아요.',
        keywords: ['빠른 계산', '정리정돈'],
        scoring: { reliability: 1, job_fit: 3, service_mind: 1, logistics: 0 }
      },
      C_48: {
        answer: '시간 맞춰 출근하고 일 열심히 하면 될 것 같은데요.',
        keywords: ['출근', '열심히'],
        scoring: { reliability: 1, job_fit: 1, service_mind: 0, logistics: 0 }
      },
      F_20: {
        answer: '그냥 손님 오면 계산하고 정리하면 되는 거 아닌가요?',
        keywords: ['그냥', '계산', '정리'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_vague: '구체적으로 어떤 점이 가장 신경 써야 할 부분일까요?',
      if_good: '그렇다면 그 가치를 실천하기 위해 어떤 노력을 하시겠어요?'
    },
    critical_fail: false
  },

  // 5. 스트레스 및 갈등 관리 (4개)
  cvs_q17: {
    question: '손님이 계산 실수를 이유로 화를 내고 있습니다. 어떻게 대응하시겠어요?',
    category: 'stress_conflict',
    intent: ['감정 조절', '문제 해결', '고객 응대'],
    evaluation_matrix: {
      S_95: {
        answer: '우선 진심으로 사과드리고, 영수증을 확인하면서 어디서 실수가 났는지 차근차근 설명드립니다. 제 실수가 맞다면 즉시 환불 처리하고, 손님의 입장을 충분히 이해한다는 말씀을 드립니다. CCTV나 POS 기록으로 확인이 필요하면 점장님께 도움을 요청합니다.',
        keywords: ['사과', '영수증 확인', '설명', '환불', '이해', '점장 도움'],
        scoring: { reliability: 3, job_fit: 2, service_mind: 8, logistics: 0 }
      },
      A_82: {
        answer: '사과드리고 영수증을 확인해서 실수를 바로잡겠습니다.',
        keywords: ['사과', '영수증 확인', '바로잡'],
        scoring: { reliability: 2, job_fit: 1, service_mind: 6, logistics: 0 }
      },
      B_65: {
        answer: '죄송하다고 하고 점장님께 도움 요청할게요.',
        keywords: ['죄송', '점장 도움'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 3, logistics: 0 }
      },
      C_45: {
        answer: 'POS에 찍힌 대로 계산한 거니까 실수 아니라고 설명할게요.',
        keywords: ['POS', '실수 아니라고'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      F_18: {
        answer: '손님이 잘못 본 거 아닐까요? 확인해보라고 할게요.',
        keywords: ['손님이 잘못', '확인해보라고'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '고객의 화를 진정시키는 데 자신이 있나요?',
      if_good: '이전에 비슷한 상황을 어떻게 해결하셨나요?'
    },
    critical_fail: false
  },

  cvs_q18: {
    question: '야간 근무 중 외로움이나 지루함을 어떻게 극복하시겠어요?',
    category: 'stress_conflict',
    intent: ['야간 근무 적응', '자기 관리', '업무 지속성'],
    evaluation_matrix: {
      S_88: {
        answer: '야간에는 재고 정리, 진열, 청소 등 할 일이 많으니 바쁘게 움직이면서 시간을 보낼 것 같아요. 혼자 일하는 게 오히려 집중이 잘 돼서 좋을 것 같습니다. 음악 들으면서 일하거나 유튜브 강의 들으면서 공부도 할 수 있어요.',
        keywords: ['재고 정리', '진열', '청소', '집중', '음악', '공부'],
        scoring: { reliability: 5, job_fit: 2, service_mind: 0, logistics: 3 }
      },
      A_75: {
        answer: '일하면서 음악 듣거나 라디오 틀어도 되면 괜찮을 것 같아요.',
        keywords: ['음악', '라디오'],
        scoring: { reliability: 3, job_fit: 1, service_mind: 0, logistics: 2 }
      },
      B_60: {
        answer: '그냥 버텨야죠. 일하다 보면 시간 가요.',
        keywords: ['버텨', '시간 가'],
        scoring: { reliability: 2, job_fit: 0, service_mind: 0, logistics: 1 }
      },
      C_42: {
        answer: '솔직히 야간은 좀 무서울 것 같은데... 괜찮을까요?',
        keywords: ['무서울', '괜찮을까'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 0 }
      },
      F_18: {
        answer: '지루하면 핸드폰 보면서 시간 때우면 되죠.',
        keywords: ['핸드폰', '시간 때우'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '야간 근무가 생각보다 외롭고 힘들 수 있는데 괜찮으세요?',
      if_good: '야간 근무 경험이 있나요?'
    },
    critical_fail: false
  },

  cvs_q19: {
    question: '동료 직원과 의견이 충돌하면 어떻게 해결하시겠어요?',
    category: 'stress_conflict',
    intent: ['갈등 해결', '협력', '커뮤니케이션'],
    evaluation_matrix: {
      S_90: {
        answer: '우선 상대방의 의견을 끝까지 듣고, 왜 그렇게 생각하는지 이해하려고 노력합니다. 그다음에 제 의견을 차분히 설명하고, 서로 타협점을 찾으려고 합니다. 해결이 안 되면 점장님께 조언을 구합니다.',
        keywords: ['의견 듣고', '이해', '설명', '타협', '조언'],
        scoring: { reliability: 3, job_fit: 1, service_mind: 7, logistics: 0 }
      },
      A_78: {
        answer: '대화로 풀려고 노력하고, 안 되면 점장님께 도움 요청합니다.',
        keywords: ['대화', '점장 도움'],
        scoring: { reliability: 2, job_fit: 1, service_mind: 5, logistics: 0 }
      },
      B_62: {
        answer: '그냥 제가 양보하고 넘어갈 것 같아요.',
        keywords: ['양보', '넘어갈'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 2, logistics: 0 }
      },
      C_45: {
        answer: '일 관련이면 제 방식대로 할게요. 각자 알아서 하면 되죠.',
        keywords: ['제 방식', '각자 알아서'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 1, logistics: 0 }
      },
      F_20: {
        answer: '맞지 않으면 안 맞는 거죠. 같이 일 안 하면 되잖아요.',
        keywords: ['안 맞는', '같이 일 안 하면'],
        scoring: { reliability: 0, job_fit: 0, service_mind: 0, logistics: 0 }
      }
    },
    follow_up_triggers: {
      if_weak: '팀워크가 중요한데 갈등 해결에 자신이 있나요?',
      if_good: '이전에 갈등을 해결했던 경험이 있나요?'
    },
    critical_fail: false
  },

  cvs_q20: {
    question: '편의점 알바를 통해 가장 얻고 싶은 것은 무엇인가요?',
    category: 'stress_conflict',
    intent: ['동기', '목표', '장기 비전'],
    evaluation_matrix: {
      S_92: {
        answer: '편의점 운영 전반에 대한 이해와 경험을 쌓고 싶습니다. 나중에 프랜차이즈 창업도 생각 중이라 재고 관리, 고객 응대, 매출 관리 등을 배우고 싶어요. 그리고 책임감과 문제 해결 능력도 키우고 싶습니다.',
        keywords: ['운영', '경험', '창업', '재고', '매출', '책임감', '문제 해결'],
        scoring: { reliability: 5, job_fit: 5, service_mind: 2, logistics: 1 }
      },
      A_80: {
        answer: '서비스업 경험과 소통 능력을 키우고 싶고, 생활비도 벌고 싶어요.',
        keywords: ['서비스', '소통', '생활비'],
        scoring: { reliability: 3, job_fit: 3, service_mind: 2, logistics: 1 }
      },
      B_65: {
        answer: '알바 경험 쌓고 돈 벌고 싶어요.',
        keywords: ['경험', '돈'],
        scoring: { reliability: 2, job_fit: 1, service_mind: 0, logistics: 1 }
      },
      C_48: {
        answer: '그냥 생활비 벌려고요.',
        keywords: ['생활비'],
        scoring: { reliability: 1, job_fit: 0, service_mind: 0, logistics: 1 }
      },
      F_20: {
        answer: '특별히 없는데, 그냥 돈 필요해서요.',
        keywords: ['특별히 없', '그냥 돈'],
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

export default {
  EVALUATION_SYSTEM,
  CAFE_INTERVIEW_SET,
  CVS_INTERVIEW_SET,
  CRITICAL_FAIL_MATRIX
};
