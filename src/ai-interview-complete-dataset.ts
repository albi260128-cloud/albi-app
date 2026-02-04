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

export default {
  EVALUATION_SYSTEM,
  CAFE_INTERVIEW_SET,
  CRITICAL_FAIL_MATRIX
};
