/**
 * 구인자 면접 엔진 (EmployerInterviewEngine)
 * 
 * 목표:
 * 1. 구인자가 원하는 바를 명확히 파악
 *    - 업종, 지역, 시급, 근무시간
 *    - 필수 역량 (성실성, 서비스마인드 등)
 *    - 우대 조건 (경험, 성향 등)
 * 
 * 2. 구직자 DB 활용하여 추천
 *    - 매칭 알고리즘으로 Top 5 추천
 *    - 등급, 점수 기반 정렬
 */

export interface EmployerRequirement {
  // 기본 정보
  business_name: string;
  job_type: 'cafe' | 'cvs' | 'restaurant' | 'retail' | 'fastfood';
  region: string;
  hourly_wage: number;
  
  // 근무 조건
  required_hours?: string[];  // ["오전", "오후", "저녁", "새벽"]
  required_days?: string[];   // ["평일", "주말", "공휴일"]
  is_urgent: boolean;
  
  // 요구 사항
  min_grade: 'S' | 'A' | 'B' | 'C' | 'F';
  min_reliability?: number;   // 최소 신뢰도 점수
  min_job_fit?: number;       // 최소 직무 적합도
  min_service_mind?: number;  // 최소 서비스 마인드
  
  // 선호 사항
  preferred_personality?: string[];  // ["적극적", "꼼꼼함", "친절함"]
  preferred_experience?: string[];   // ["유사 업종 경험", "서빙 경험"]
  workplace_culture?: string;        // "활발함", "차분함", "전문적"
  
  // 추가 정보
  trial_period?: number;  // 체험 기간 (시간, 기본 3시간)
  notes?: string;         // 추가 메모
}

export interface InterviewContext {
  // 진행 상태
  current_step: number;
  question_count: number;
  
  // 수집된 정보
  requirement: Partial<EmployerRequirement>;
  
  // 대화 히스토리
  conversation: Array<{
    question: string;
    answer: string;
    timestamp: Date;
  }>;
}

export interface EmployerInterviewResponse {
  status: 'ongoing' | 'completed' | 'error';
  message: string;
  question?: string;
  progress?: string;
  result?: {
    requirement: EmployerRequirement;
    interview_id: string;
    completed_at: Date;
  };
}

export class EmployerInterviewEngine {
  private context: InterviewContext;
  private userId: string;
  
  constructor(userId: string = 'anonymous') {
    this.userId = userId;
    this.context = {
      current_step: 0,
      question_count: 0,
      requirement: {},
      conversation: []
    };
  }
  
  /**
   * 면접 시작
   */
  public startInterview(): EmployerInterviewResponse {
    const greeting = `안녕하세요! 저는 알비의 **구인 전문 매니저** 알비예요! 🐝

구직자 여러분께 딱 맞는 인재를 찾아드릴게요!

몇 가지 질문을 드릴게요. (약 5~7분 소요) 😊`;

    const firstQuestion = this.getQuestion(0);
    
    return {
      status: 'ongoing',
      message: greeting,
      question: firstQuestion,
      progress: '1/7'
    };
  }
  
  /**
   * 답변 처리
   */
  public async processAnswer(answer: string): Promise<EmployerInterviewResponse> {
    // 답변 저장
    const currentQuestion = this.getQuestion(this.context.current_step);
    this.context.conversation.push({
      question: currentQuestion,
      answer: answer.trim(),
      timestamp: new Date()
    });
    
    // 답변 파싱 및 저장
    this.parseAnswer(this.context.current_step, answer);
    
    // 다음 단계로
    this.context.current_step++;
    this.context.question_count++;
    
    // 면접 완료 체크
    if (this.context.current_step >= 7) {
      return this.finalizeInterview();
    }
    
    // 다음 질문
    const nextQuestion = this.getQuestion(this.context.current_step);
    const progress = `${this.context.question_count + 1}/7`;
    
    return {
      status: 'ongoing',
      message: '좋아요! 👍',
      question: nextQuestion,
      progress
    };
  }
  
  /**
   * 단계별 질문 반환
   */
  private getQuestion(step: number): string {
    const questions = [
      // Step 0: 업종
      `어떤 업종의 사업장을 운영하고 계신가요? 😊

📍 아래에서 선택해주세요:
• 카페
• 편의점
• 음식점
• 매장/판매
• 패스트푸드`,
      
      // Step 1: 사업장 이름
      `사업장 이름을 알려주세요!
(예: 스타벅스 강남점, CU 홍대점)`,
      
      // Step 2: 지역
      `어느 지역에 위치해 있나요?
(예: 강남구, 홍대, 신촌)`,
      
      // Step 3: 시급
      `제시하실 시급은 얼마인가요?
(2025년 최저시급: 10,030원)`,
      
      // Step 4: 근무 시간대
      `필요한 근무 시간대를 알려주세요! 😊

예시:
• 오전 (09:00~12:00)
• 오후 (12:00~18:00)
• 저녁 (18:00~22:00)
• 새벽/야간 (22:00~06:00)

여러 시간대 가능하시면 모두 말씀해주세요!`,
      
      // Step 5: 최소 요구 등급
      `최소한 어느 정도 등급의 인재를 원하시나요? 🌟

• S급: 최고 수준 (90점 이상)
• A급: 우수함 (75~89점)
• B급: 양호함 (60~74점)
• C급: 보통 (40~59점)
• F급: 교육 필요 (39점 이하)

💡 등급이 높을수록 경쟁이 심할 수 있어요!`,
      
      // Step 6: 우대 사항
      `마지막으로, 특별히 우대하시는 사항이 있으신가요? 😊

예시:
• 유사 업종 경험자
• 적극적인 성격
• 꼼꼼한 성격
• 장기 근무 가능자

없으시면 "없음" 또는 "괜찮아요"라고 답해주세요!`
    ];
    
    return questions[step] || '';
  }
  
  /**
   * 답변 파싱 및 저장
   */
  private parseAnswer(step: number, answer: string): void {
    const lowerAnswer = answer.toLowerCase().trim();
    
    switch (step) {
      case 0: // 업종
        if (lowerAnswer.includes('카페')) {
          this.context.requirement.job_type = 'cafe';
        } else if (lowerAnswer.includes('편의점')) {
          this.context.requirement.job_type = 'cvs';
        } else if (lowerAnswer.includes('음식점') || lowerAnswer.includes('레스토랑')) {
          this.context.requirement.job_type = 'restaurant';
        } else if (lowerAnswer.includes('매장') || lowerAnswer.includes('판매') || lowerAnswer.includes('마트')) {
          this.context.requirement.job_type = 'retail';
        } else if (lowerAnswer.includes('패스트푸드') || lowerAnswer.includes('햄버거') || lowerAnswer.includes('치킨')) {
          this.context.requirement.job_type = 'fastfood';
        } else {
          this.context.requirement.job_type = 'cafe'; // 기본값
        }
        break;
        
      case 1: // 사업장 이름
        this.context.requirement.business_name = answer.trim();
        break;
        
      case 2: // 지역
        this.context.requirement.region = answer.trim();
        break;
        
      case 3: // 시급
        const wageMatch = answer.match(/\d+,?\d*/g);
        if (wageMatch) {
          const wage = parseInt(wageMatch.join('').replace(/,/g, ''));
          this.context.requirement.hourly_wage = wage >= 10030 ? wage : 10030;
        } else {
          this.context.requirement.hourly_wage = 10030; // 최저시급
        }
        break;
        
      case 4: // 근무 시간대
        const hours: string[] = [];
        if (lowerAnswer.includes('오전') || lowerAnswer.includes('아침') || lowerAnswer.includes('09')) {
          hours.push('오전');
        }
        if (lowerAnswer.includes('오후') || lowerAnswer.includes('점심') || lowerAnswer.includes('12')) {
          hours.push('오후');
        }
        if (lowerAnswer.includes('저녁') || lowerAnswer.includes('밤') || lowerAnswer.includes('18')) {
          hours.push('저녁');
        }
        if (lowerAnswer.includes('새벽') || lowerAnswer.includes('야간') || lowerAnswer.includes('22') || lowerAnswer.includes('밤샘')) {
          hours.push('새벽/야간');
        }
        this.context.requirement.required_hours = hours.length > 0 ? hours : ['오전', '오후'];
        break;
        
      case 5: // 최소 등급
        if (lowerAnswer.includes('s') || lowerAnswer.includes('최고')) {
          this.context.requirement.min_grade = 'S';
        } else if (lowerAnswer.includes('a') || lowerAnswer.includes('우수')) {
          this.context.requirement.min_grade = 'A';
        } else if (lowerAnswer.includes('b') || lowerAnswer.includes('양호')) {
          this.context.requirement.min_grade = 'B';
        } else if (lowerAnswer.includes('c') || lowerAnswer.includes('보통')) {
          this.context.requirement.min_grade = 'C';
        } else {
          this.context.requirement.min_grade = 'C'; // 기본값
        }
        break;
        
      case 6: // 우대 사항
        if (lowerAnswer === '없음' || lowerAnswer === '괜찮아요' || lowerAnswer === '없어요') {
          this.context.requirement.notes = '';
        } else {
          this.context.requirement.notes = answer.trim();
        }
        break;
    }
  }
  
  /**
   * 면접 완료 처리
   */
  private finalizeInterview(): EmployerInterviewResponse {
    const interviewId = crypto.randomUUID();
    
    // 요구사항 완성
    const requirement: EmployerRequirement = {
      business_name: this.context.requirement.business_name || '알비 사업장',
      job_type: this.context.requirement.job_type || 'cafe',
      region: this.context.requirement.region || '서울',
      hourly_wage: this.context.requirement.hourly_wage || 10030,
      required_hours: this.context.requirement.required_hours || ['오전', '오후'],
      required_days: ['평일', '주말'],
      is_urgent: false,
      min_grade: this.context.requirement.min_grade || 'C',
      min_reliability: this.getMinScoreByGrade(this.context.requirement.min_grade || 'C', 'reliability'),
      min_job_fit: this.getMinScoreByGrade(this.context.requirement.min_grade || 'C', 'job_fit'),
      min_service_mind: this.getMinScoreByGrade(this.context.requirement.min_grade || 'C', 'service_mind'),
      preferred_personality: [],
      preferred_experience: [],
      workplace_culture: '전문적',
      trial_period: 3,
      notes: this.context.requirement.notes || ''
    };
    
    const message = `🎉 면접이 완료되었습니다!

📋 **요구사항 요약**

🏢 **사업장**: ${requirement.business_name}
📍 **업종**: ${this.getJobTypeName(requirement.job_type)}
🌏 **지역**: ${requirement.region}
💰 **시급**: ${requirement.hourly_wage.toLocaleString()}원
⏰ **근무 시간**: ${requirement.required_hours?.join(', ')}
⭐ **최소 등급**: ${requirement.min_grade}급

---

🔍 **이제 구직자 매칭을 시작합니다!**

잠시만 기다려주세요... 🐝`;
    
    return {
      status: 'completed',
      message,
      result: {
        requirement,
        interview_id: interviewId,
        completed_at: new Date()
      }
    };
  }
  
  /**
   * 등급별 최소 점수 계산
   */
  private getMinScoreByGrade(grade: string, type: 'reliability' | 'job_fit' | 'service_mind'): number {
    const gradeScores: Record<string, Record<string, number>> = {
      'S': { reliability: 30, job_fit: 25, service_mind: 20 },
      'A': { reliability: 25, job_fit: 20, service_mind: 15 },
      'B': { reliability: 20, job_fit: 15, service_mind: 12 },
      'C': { reliability: 15, job_fit: 10, service_mind: 8 },
      'F': { reliability: 0, job_fit: 0, service_mind: 0 }
    };
    
    return gradeScores[grade]?.[type] || 0;
  }
  
  /**
   * 업종 이름 한글화
   */
  private getJobTypeName(jobType: string): string {
    const names: Record<string, string> = {
      'cafe': '카페',
      'cvs': '편의점',
      'restaurant': '음식점',
      'retail': '매장/판매',
      'fastfood': '패스트푸드'
    };
    return names[jobType] || jobType;
  }
}
