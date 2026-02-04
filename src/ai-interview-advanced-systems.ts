/**
 * 알비 AI 면접관 - 고급 시스템 통합 (Option B)
 * 지역별 평가 + 실시간 모니터링 + 리포트 생성
 */

// ========================================
// 1. 지역별/시급별 맞춤 평가 시스템
// ========================================

export const REGIONAL_FACTORS = {
  '대도시_핫플레이스': {
    competition_level: '매우높음',
    customer_expectation: '높음',
    required_skills: ['외국어 기초', '트렌드 감각', '빠른 서비스'],
    scoring_weights: {
      service_mind: 1.3,  // 30% 가중
      job_fit: 1.2,       // 20% 가중
      speed: 1.4          // 40% 가중
    },
    pass_threshold: 80,
    regional_message: {
      cafe: '이 지역은 고객 수준이 높아서 라떼아트나 스페셜티 지식이 있으면 큰 장점이에요!',
      restaurant: '외국인 손님도 많아서 영어 기초 회화 가능하시면 우대받을 거예요!',
      cvs: '24시간 운영 매장이 많아서 야간 근무 가능하시면 매우 유리해요!'
    }
  },

  '대도시_일반지역': {
    competition_level: '높음',
    customer_expectation: '보통',
    required_skills: ['기본 서비스', '정확성'],
    scoring_weights: {
      service_mind: 1.1,
      reliability: 1.2
    },
    pass_threshold: 70,
    regional_message: {
      cafe: '기본기만 탄탄하면 충분히 일하실 수 있는 곳이에요!',
      restaurant: '친절하고 성실하게 일하시면 환영받으실 거예요!',
      cvs: '주거 지역이라 단골 손님이 많아요. 친근한 서비스가 중요해요!'
    }
  },

  '중소도시': {
    competition_level: '보통',
    customer_expectation: '보통',
    required_skills: ['성실성', '장기근무'],
    scoring_weights: {
      reliability: 1.3,
      logistics: 1.2
    },
    pass_threshold: 65,
    regional_message: {
      cafe: '단골 손님이 많아서 꾸준하고 친근한 서비스가 가장 중요해요!',
      restaurant: '가족 단위 손님이 많아서 따뜻하고 친절한 응대가 핵심이에요!',
      cvs: '장기 근무자를 선호하시니 안정적으로 일하실 수 있으면 좋아요!'
    }
  },

  '소도시_농촌': {
    competition_level: '낮음',
    customer_expectation: '낮음',
    required_skills: ['출근 가능성', '기본 매너'],
    scoring_weights: {
      reliability: 1.5,  // 50% 가중
      logistics: 1.4     // 40% 가중
    },
    pass_threshold: 55,
    regional_message: {
      cafe: '알바 구하기 어려운 지역이라 성실하게만 나와주시면 환영이에요!',
      restaurant: '단골 손님들이 많아서 오래 일하시면서 익숙해지는 게 중요해요!',
      cvs: '야간 근무자 구하기 어려워서 야간 가능하시면 매우 환영받을 거예요!'
    }
  }
};

export const WAGE_TIERS = {
  '최저시급': {
    range: [10030, 10500],
    focus: ['기본 출근', '최소 매너'],
    required_score: 50,
    message: '성실하게만 나와주시면 됩니다!',
    expectations: '기본적인 출퇴근과 최소한의 서비스 매너면 충분해요.'
  },

  '최저+500': {
    range: [10501, 11000],
    focus: ['경험 또는 특기', '안정적 근무'],
    required_score: 65,
    message: '경험이나 장기 근무 의향이 있으시면 충분해요!',
    expectations: '약간의 경험이나 특별한 의지가 있으면 좋아요.'
  },

  '최저+1000': {
    range: [11001, 12000],
    focus: ['숙련 기술', '리더십 가능성'],
    required_score: 75,
    message: '어느 정도 경험과 책임감이 필요한 수준이에요!',
    expectations: '숙련된 기술이나 책임자 역할을 할 수 있어야 해요.'
  },

  '고급형': {
    range: [12001, 20000],
    focus: ['전문성', '즉시 전력', '교육 능력'],
    required_score: 85,
    message: '바로 투입 가능한 전문가 수준을 원하세요!',
    expectations: '전문 자격증이나 3년+ 경력, 신입 교육 가능해야 해요.'
  }
};

export class RegionalEvaluationMatrix {
  /**
   * 지역별 점수 조정
   */
  adjustScores(baseScores: any, region: string): any {
    const regionalFactor = REGIONAL_FACTORS[region] || REGIONAL_FACTORS['대도시_일반지역'];
    const adjustedScores = { ...baseScores };

    // 가중치 적용
    for (const [key, weight] of Object.entries(regionalFactor.scoring_weights)) {
      if (adjustedScores[key] !== undefined) {
        adjustedScores[key] = adjustedScores[key] * (weight as number);
      }
    }

    return adjustedScores;
  }

  /**
   * 지역별 맞춤 메시지
   */
  getRegionalMessage(region: string, jobType: string): string {
    const regionalFactor = REGIONAL_FACTORS[region] || REGIONAL_FACTORS['대도시_일반지역'];
    return regionalFactor.regional_message[jobType] || '';
  }

  /**
   * 지역별 합격 기준
   */
  getPassThreshold(region: string): number {
    const regionalFactor = REGIONAL_FACTORS[region] || REGIONAL_FACTORS['대도시_일반지역'];
    return regionalFactor.pass_threshold;
  }

  /**
   * 시급 현실성 평가
   */
  evaluateWageReality(expectedWage: number, region: string, experienceLevel: string): any {
    // 지역별 평균 시급
    const regionalAverage: { [key: string]: number } = {
      '대도시_핫플레이스': 11500,
      '대도시_일반지역': 10800,
      '중소도시': 10200,
      '소도시_농촌': 9800
    };

    const avgWage = regionalAverage[region] || 10500;

    if (expectedWage <= avgWage) {
      return {
        status: '현실적',
        message: '적정 수준입니다.',
        scoring_impact: 0
      };
    } else if (expectedWage <= avgWage * 1.2) {
      return {
        status: '약간 높음',
        message: '경력이나 특기가 있으시면 가능할 것 같아요.',
        scoring_impact: -5
      };
    } else {
      return {
        status: '과도함',
        message: `이 지역 평균(${avgWage}원)보다 ${Math.round((expectedWage - avgWage) / avgWage * 100)}% 높아서 특별한 근거가 필요해요.`,
        scoring_impact: -20
      };
    }
  }

  /**
   * 시급대별 요구 수준
   */
  getWageTierRequirements(expectedWage: number): any {
    for (const [tier, data] of Object.entries(WAGE_TIERS)) {
      if (expectedWage >= data.range[0] && expectedWage <= data.range[1]) {
        return {
          tier,
          ...data
        };
      }
    }

    // 범위 초과
    if (expectedWage > 20000) {
      return {
        tier: '초고급형',
        message: '이 시급은 매우 특별한 전문성이 필요해요.',
        required_score: 95
      };
    }

    return WAGE_TIERS['최저시급'];
  }
}

// ========================================
// 2. 실시간 면접 품질 모니터링
// ========================================

export class InterviewQualityMonitor {
  private metrics: any = {
    engagement_score: 100,      // 참여도
    consistency_score: 0,        // 일관성
    depth_score: 0,              // 답변 깊이
    red_flags: [],               // 위험 신호
    dropout_risk: 'low',         // 이탈 위험도
    response_times: [],          // 응답 시간 기록
    question_count: 0            // 질문 수
  };

  /**
   * 실시간 분석
   */
  analyzeRealTime(answerText: string, responseTime: number, questionNumber: number): any {
    this.metrics.question_count = questionNumber;
    this.metrics.response_times.push(responseTime);

    // 1. 참여도 분석
    if (responseTime > 60) {  // 60초 이상 지연
      this.metrics.engagement_score -= 10;
      this.metrics.dropout_risk = 'high';
    }

    // 2. 답변 품질 분석
    const wordCount = answerText.split(' ').length;
    if (wordCount < 3) {
      this.metrics.engagement_score -= 5;
      this.metrics.depth_score -= 2;
    } else if (wordCount > 50) {
      this.metrics.depth_score += 3;
    }

    // 3. 위험 신호 감지
    const riskPatterns = {
      violence: ['때리', '싸우', '죽이'],
      dishonesty: ['거짓말', '속이', '감추'],
      discrimination: ['여자라서', '남자라서', '외국인'],
      illegal: ['불법', '탈세', '뇌물']
    };

    for (const [riskType, keywords] of Object.entries(riskPatterns)) {
      if (keywords.some(keyword => answerText.includes(keyword))) {
        this.metrics.red_flags.push({
          type: riskType,
          question: questionNumber,
          text: answerText.substring(0, 50) + '...',
          severity: 'high',
          timestamp: new Date().toISOString()
        });
      }
    }

    return this.getInterventionRecommendation();
  }

  /**
   * 개입 권장사항
   */
  getInterventionRecommendation(): any {
    if (this.metrics.dropout_risk === 'high') {
      return {
        action: 'engagement_boost',
        message: '혹시 바쁘신가요? 3분이면 끝나니까 조금만 더 힘내주세요! 💪',
        priority: 'immediate'
      };
    }

    if (this.metrics.red_flags.length > 0) {
      return {
        action: 'risk_assessment',
        message: '해당 답변에 대해 추가 확인이 필요합니다.',
        priority: 'high',
        red_flags: this.metrics.red_flags
      };
    }

    if (this.metrics.engagement_score < 50) {
      return {
        action: 'simplify_questions',
        message: '질문을 더 쉽게 바꿔주세요.',
        priority: 'medium'
      };
    }

    return { action: 'continue', priority: 'low' };
  }

  /**
   * 품질 지표 반환
   */
  getMetrics(): any {
    return {
      ...this.metrics,
      average_response_time: this.calculateAverageResponseTime(),
      completion_rate: this.calculateCompletionRate()
    };
  }

  private calculateAverageResponseTime(): number {
    if (this.metrics.response_times.length === 0) return 0;
    const sum = this.metrics.response_times.reduce((a: number, b: number) => a + b, 0);
    return sum / this.metrics.response_times.length;
  }

  private calculateCompletionRate(): number {
    // 15개 질문 기준
    return (this.metrics.question_count / 15) * 100;
  }

  /**
   * 초기화
   */
  reset(): void {
    this.metrics = {
      engagement_score: 100,
      consistency_score: 0,
      depth_score: 0,
      red_flags: [],
      dropout_risk: 'low',
      response_times: [],
      question_count: 0
    };
  }
}

// ========================================
// 3. 사장님용 상세 리포트 생성
// ========================================

export class ComprehensiveReportGenerator {
  /**
   * 경영진용 요약 리포트
   */
  generateExecutiveSummary(interviewData: any): string {
    const decision = this.getDecisionRecommendation(interviewData);
    const strengths = this.listKeyStrengths(interviewData);
    const concerns = this.listConcerns(interviewData);
    const trialChecklist = this.generateTrialChecklist(interviewData);

    return `
╔══════════════════════════════════════════════════════════════╗
║                🐝 알비 AI 면접 결과 리포트                    ║
╚══════════════════════════════════════════════════════════════╝

【즉시 결정 가이드】 ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **결론: ${decision}**

📊 **핵심 지표**
   • 총점: ${interviewData.total_score.toFixed(0)}/100점 (${interviewData.grade}급)
   • 1시간 체험: ${interviewData.trial_recommend ? '✅ 강력 추천' : '❌ 비추천'}
   • 예상 근무 기간: ${this.estimateWorkDuration(interviewData)}

💡 **한 줄 요약**
   ${this.generateOneLiner(interviewData)}

【상세 분석】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 **역량 분석**
   ┌─────────────────┬─────────┬──────────────────────┐
   │   영역          │  점수   │        평가          │
   ├─────────────────┼─────────┼──────────────────────┤
   │ 성실성 (35%)    │ ${interviewData.reliability.toFixed(1).padStart(6)}  │ ${this.getScoreLabel(interviewData.reliability, 35)} │
   │ 직무적합성(30%) │ ${interviewData.job_fit.toFixed(1).padStart(6)}  │ ${this.getScoreLabel(interviewData.job_fit, 30)} │
   │ 서비스정신(25%) │ ${interviewData.service_mind.toFixed(1).padStart(6)}  │ ${this.getScoreLabel(interviewData.service_mind, 25)} │
   │ 근무조건(10%)   │ ${interviewData.logistics.toFixed(1).padStart(6)}  │ ${this.getScoreLabel(interviewData.logistics, 10)} │
   └─────────────────┴─────────┴──────────────────────┘

✅ **주요 강점**
${strengths}

⚠️ **주의사항**
${concerns}

🎯 **1시간 체험 시 체크포인트**
${trialChecklist}

【알비의 최종 판단】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${this.getFinalRecommendation(interviewData)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 생성일시: ${interviewData.timestamp || new Date().toISOString()}
🔗 1시간 체험 신청: [링크]
    `;
  }

  /**
   * 모바일용 간단 카드
   */
  generateMobileQuickCard(data: any): string {
    return `
🐝 면접 결과 카드

👤 ${data.name || '지원자'} (${data.age || '미상'}세)
📋 ${data.job_type || '알바'} 지원

⭐ ${data.grade}급 (${data.total_score.toFixed(0)}점)

💪 강점: ${this.getTopStrength(data)}
⚠️ 주의: ${this.getMainConcern(data)}

💡 ${this.getOneLineDecision(data)}

[상세보기] [체험신청]
    `;
  }

  private getDecisionRecommendation(data: any): string {
    if (data.grade === 'S') {
      return '🟢 즉시 채용하세요! (성공 확률 95%)';
    } else if (data.grade === 'A') {
      return '🟡 1시간 체험 후 채용하세요 (성공 확률 85%)';
    } else if (data.grade === 'B') {
      return '🟡 교육 투자 각오하고 채용하세요 (성공 확률 65%)';
    } else {
      return '🔴 다른 지원자를 찾아보세요 (성공 확률 30%)';
    }
  }

  private estimateWorkDuration(data: any): string {
    if (data.reliability > 30 && data.logistics > 8) {
      return '6개월 이상 (장기 근무 가능성 높음)';
    } else if (data.reliability > 20) {
      return '3-6개월 (보통 수준)';
    } else {
      return '3개월 미만 (단기 가능성)';
    }
  }

  private generateOneLiner(data: any): string {
    if (data.grade === 'S') {
      return '경험도 있고 성실하며 서비스 마인드까지 갖춘 완벽한 후보입니다.';
    } else if (data.grade === 'A') {
      return '기본기가 탄탄하고 의지가 있어 1시간 체험으로 확인하면 좋겠습니다.';
    } else if (data.grade === 'B') {
      return '초보지만 배우려는 의지가 있어 교육이 필요합니다.';
    } else {
      return '기본 조건이 맞지 않아 다른 후보를 추천드립니다.';
    }
  }

  private listKeyStrengths(data: any): string {
    const strengths: string[] = [];

    if (data.reliability > 30) strengths.push('   • 성실하고 책임감 있는 태도');
    if (data.job_fit > 25) strengths.push('   • 업무 적합성이 높고 학습 능력 우수');
    if (data.service_mind > 20) strengths.push('   • 고객 응대와 서비스 마인드 우수');
    if (data.logistics > 8) strengths.push('   • 출퇴근 조건과 시간대 적합');

    return strengths.length > 0 ? strengths.join('\n') : '   • (특별한 강점 없음)';
  }

  private listConcerns(data: any): string {
    const concerns: string[] = [];

    if (data.reliability < 20) concerns.push('   • 성실성이 다소 부족해 보임');
    if (data.job_fit < 15) concerns.push('   • 업무 경험이 부족하여 교육 필요');
    if (data.service_mind < 15) concerns.push('   • 고객 응대 능력 향상 필요');
    if (data.logistics < 5) concerns.push('   • 출퇴근이나 근무 시간 조건 확인 필요');

    return concerns.length > 0 ? concerns.join('\n') : '   • (특별한 주의사항 없음)';
  }

  private generateTrialChecklist(data: any): string {
    const jobType = data.job_type || 'cafe';
    const checklists: { [key: string]: string[] } = {
      cafe: [
        '   1. 러시 시간 음료 3잔 동시 주문 → 순서와 속도 확인',
        '   2. 고객 응대 → 밝은 표정과 친절함',
        '   3. 청소와 정리 → 위생 의식과 꼼꼼함'
      ],
      cvs: [
        '   1. 계산 정확성 → POS 시스템 숙련도',
        '   2. 상품 진열 → 유통기한 체크 습관',
        '   3. 고객 응대 → 신분증 확인 등 법규 준수'
      ],
      restaurant: [
        '   1. 테이블 서빙 → 순서와 정확성',
        '   2. 주문 받기 → 메뉴 숙지도',
        '   3. 피크 타임 대응 → 멀티태스킹 능력'
      ]
    };

    const checklist = checklists[jobType] || checklists['cafe'];
    return checklist.join('\n');
  }

  private getScoreLabel(score: number, weight: number): string {
    const percentage = (score / weight) * 100;
    if (percentage >= 90) return '⭐⭐⭐ 우수';
    if (percentage >= 70) return '⭐⭐ 양호';
    if (percentage >= 50) return '⭐ 보통';
    return '△ 부족';
  }

  private getTopStrength(data: any): string {
    const scores = {
      '성실성': data.reliability,
      '직무적합성': data.job_fit,
      '서비스마인드': data.service_mind,
      '근무조건': data.logistics
    };

    let maxKey = '성실성';
    let maxValue = 0;

    for (const [key, value] of Object.entries(scores)) {
      if (value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    }

    return maxKey;
  }

  private getMainConcern(data: any): string {
    if (data.reliability < 20) return '성실성 확인 필요';
    if (data.job_fit < 15) return '업무 경험 부족';
    if (data.service_mind < 15) return '고객 응대 연습 필요';
    if (data.logistics < 5) return '근무 조건 재확인';
    return '없음';
  }

  private getOneLineDecision(data: any): string {
    if (data.grade === 'S') return '바로 채용하세요!';
    if (data.grade === 'A') return '체험 후 결정하세요!';
    if (data.grade === 'B') return '교육 후 가능해요.';
    return '다른 후보 추천드려요.';
  }

  private getFinalRecommendation(data: any): string {
    if (data.grade === 'S' || data.grade === 'A') {
      return '알비는 이 지원자를 채용하실 것을 추천드립니다.\n1시간 체험으로 실력을 확인해보시면 좋을 것 같아요!';
    } else if (data.grade === 'B') {
      return '교육과 시간 투자가 필요한 후보입니다.\n신입을 키울 여유가 있으시다면 괜찮지만,\n즉시 전력이 필요하시면 다른 후보를 추천드립니다.';
    } else {
      return '기본 조건이 맞지 않거나 태도에 문제가 있어\n채용을 권장하지 않습니다.';
    }
  }
}

// ========================================
// 4. 통합 마스터 시스템
// ========================================

export class AlbiMasterInterviewer {
  private regionalEvaluator: RegionalEvaluationMatrix;
  private qualityMonitor: InterviewQualityMonitor;
  private reportGenerator: ComprehensiveReportGenerator;
  private context: any;

  constructor(jobType: string, region: string, expectedWage: number) {
    this.regionalEvaluator = new RegionalEvaluationMatrix();
    this.qualityMonitor = new InterviewQualityMonitor();
    this.reportGenerator = new ComprehensiveReportGenerator();

    this.context = {
      job_type: jobType,
      region: region,
      expected_wage: expectedWage,
      start_time: new Date(),
      interview_log: []
    };
  }

  /**
   * 적응형 면접 진행
   */
  conductAdaptiveInterview(questionId: string, answerText: string, responseTime: number): any {
    // 1. 실시간 품질 체크
    const qualityStatus = this.qualityMonitor.analyzeRealTime(
      answerText,
      responseTime,
      this.context.interview_log.length + 1
    );

    // 2. 로그 기록
    this.context.interview_log.push({
      question_id: questionId,
      answer: answerText,
      response_time: responseTime,
      timestamp: new Date()
    });

    // 3. 개입 필요 여부 확인
    if (qualityStatus.priority === 'immediate' || qualityStatus.priority === 'high') {
      return {
        continue: true,
        intervention: qualityStatus,
        current_status: this.getProgressSummary()
      };
    }

    // 4. 정상 진행
    return {
      continue: true,
      current_status: this.getProgressSummary()
    };
  }

  /**
   * 최종 리포트 생성
   */
  finalizeAndReport(finalScores: any): any {
    // 지역별 점수 조정
    const adjustedScores = this.regionalEvaluator.adjustScores(
      finalScores,
      this.context.region
    );

    // 시급 현실성 평가
    const wageEvaluation = this.regionalEvaluator.evaluateWageReality(
      this.context.expected_wage,
      this.context.region,
      finalScores.experience_level || 'beginner'
    );

    // 최종 데이터 통합
    const finalData = {
      ...adjustedScores,
      ...finalScores,
      job_type: this.context.job_type,
      region: this.context.region,
      expected_wage: this.context.expected_wage,
      wage_evaluation: wageEvaluation,
      quality_metrics: this.qualityMonitor.getMetrics(),
      duration: this.getDuration(),
      timestamp: new Date().toISOString()
    };

    // 리포트 생성
    const detailedReport = this.reportGenerator.generateExecutiveSummary(finalData);
    const mobileSummary = this.reportGenerator.generateMobileQuickCard(finalData);

    return {
      status: 'completed',
      detailed_report: detailedReport,
      mobile_summary: mobileSummary,
      final_data: finalData
    };
  }

  private getProgressSummary(): any {
    return {
      question_count: this.context.interview_log.length,
      duration: this.getDuration(),
      quality_score: this.qualityMonitor.getMetrics().engagement_score
    };
  }

  private getDuration(): string {
    const now = new Date();
    const duration = (now.getTime() - this.context.start_time.getTime()) / 1000;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}분 ${seconds}초`;
  }

  /**
   * 초기화
   */
  reset(): void {
    this.qualityMonitor.reset();
    this.context.interview_log = [];
    this.context.start_time = new Date();
  }
}

export default {
  REGIONAL_FACTORS,
  WAGE_TIERS,
  RegionalEvaluationMatrix,
  InterviewQualityMonitor,
  ComprehensiveReportGenerator,
  AlbiMasterInterviewer
};
