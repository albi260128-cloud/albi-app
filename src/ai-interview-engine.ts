/**
 * 알비(ALBI) 실시간 AI 면접 진행 엔진
 * 
 * 사용자 답변을 실시간으로 분석하고
 * 다음 질문을 지능적으로 선택하는 시스템
 */

import { 
  INTERVIEW_QUESTIONS_DB,
  CONVERSATION_SCENARIOS,
  RESPONSE_SCORING
} from './ai-interview-database';

import type { UserProfile } from './ai-matching-engine';

// ========================================
// 타입 정의
// ========================================

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface InterviewSession {
  userId: string;
  userType: 'jobseeker' | 'employer';
  currentStage: 'basic' | 'personality' | 'experience' | 'matching';
  stageProgress: number;        // 0-100
  conversationHistory: ConversationMessage[];
  collectedData: Partial<UserProfile>;
  interviewScore: number;       // 0-100
  nextQuestionId?: string;
  isComplete: boolean;
}

export interface ResponseAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: 'high' | 'medium' | 'low';
  extractedInfo: {
    personality?: Partial<UserProfile['personality']>;
    skills?: Partial<UserProfile['skills']>;
    preferences?: Partial<UserProfile['preferences']>;
    keywords: string[];
  };
  triggerScenario?: string;     // 시나리오 트리거
}

// ========================================
// AI 면접 진행 엔진
// ========================================

export class AIInterviewEngine {
  private session: InterviewSession;

  constructor(userId: string, userType: 'jobseeker' | 'employer' = 'jobseeker') {
    this.session = {
      userId,
      userType,
      currentStage: 'basic',
      stageProgress: 0,
      conversationHistory: [],
      collectedData: {
        personality: {
          extraversion: 5,
          conscientiousness: 5,
          openness: 5,
          agreeableness: 5,
          neuroticism: 5
        },
        skills: {
          communication: 5,
          multitasking: 5,
          learning_speed: 5,
          teamwork: 5,
          independence: 5,
          physical_ability: 5,
          stress_tolerance: 5,
          problem_solving: 5,
          attention_to_detail: 5,
          customer_service: 5
        },
        preferences: {
          industries: [],
          workHours: [],
          weekends: false,
          minWage: 10000,
          maxDistance: 5
        },
        experience: {
          hasExperience: false,
          industries: [],
          duration: 0,
          strengths: [],
          weaknesses: []
        },
        avoidance: {
          industries: [],
          conditions: []
        }
      },
      interviewScore: 50,
      isComplete: false
    };

    // 초기 인사 메시지 추가
    this.addMessage('assistant', this.getWelcomeMessage());
  }

  /**
   * 사용자 답변 처리 및 다음 질문 생성
   */
  async processUserResponse(userMessage: string): Promise<string> {
    // 1. 사용자 메시지 저장
    this.addMessage('user', userMessage);

    // 2. 답변 분석
    const analysis = this.analyzeResponse(userMessage);

    // 3. 수집된 정보 업데이트
    this.updateCollectedData(analysis);

    // 4. 시나리오 트리거 확인
    if (analysis.triggerScenario) {
      return this.followScenario(analysis.triggerScenario, userMessage);
    }

    // 5. 단계 진행도 업데이트
    this.updateStageProgress();

    // 6. 다음 단계로 이동 확인
    if (this.shouldMoveToNextStage()) {
      this.moveToNextStage();
    }

    // 7. 다음 질문 생성
    const nextQuestion = this.getNextQuestion(userMessage, analysis);

    // 8. AI 응답 저장 및 반환
    this.addMessage('assistant', nextQuestion);

    return nextQuestion;
  }

  /**
   * 사용자 답변 분석
   */
  private analyzeResponse(message: string): ResponseAnalysis {
    const lowerMessage = message.toLowerCase();
    const analysis: ResponseAnalysis = {
      sentiment: 'neutral',
      confidence: 'medium',
      extractedInfo: {
        keywords: []
      }
    };

    // 1. 감정 분석
    const positiveWords = ['좋아', '재밌', '흥미', '자신', '잘', '편해', '괜찮'];
    const negativeWords = ['싫어', '힘들', '불안', '걱정', '어렵', '부담'];
    
    const positiveCount = positiveWords.filter(w => lowerMessage.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerMessage.includes(w)).length;

    if (positiveCount > negativeCount) {
      analysis.sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      analysis.sentiment = 'negative';
    }

    // 2. 확신도 분석
    if (lowerMessage.includes('확실') || lowerMessage.includes('당연') || lowerMessage.includes('물론')) {
      analysis.confidence = 'high';
    } else if (lowerMessage.includes('아마') || lowerMessage.includes('모르겠') || lowerMessage.includes('생각해')) {
      analysis.confidence = 'low';
    }

    // 3. 성향 키워드 추출
    if (!analysis.extractedInfo.personality) {
      analysis.extractedInfo.personality = {};
    }

    // 외향성
    if (lowerMessage.match(/사람|대화|소통|활발|적극/)) {
      if (analysis.sentiment === 'positive') {
        analysis.extractedInfo.personality.extraversion = 7;
      }
    }
    if (lowerMessage.match(/혼자|조용|내성적|부담/)) {
      analysis.extractedInfo.personality.extraversion = 3;
    }

    // 성실성
    if (lowerMessage.match(/계획|체계|꼼꼼|정리|준비/)) {
      analysis.extractedInfo.personality.conscientiousness = 7;
    }

    // 개방성
    if (lowerMessage.match(/배우|도전|새로운|흥미|시도/)) {
      analysis.extractedInfo.personality.openness = 7;
    }

    // 친화성
    if (lowerMessage.match(/함께|협력|팀|도와|배려/)) {
      analysis.extractedInfo.personality.agreeableness = 7;
    }

    // 신경성 (안정성)
    if (lowerMessage.match(/침착|차분|괜찮|문제없|관리/)) {
      analysis.extractedInfo.personality.neuroticism = 7;
    }
    if (lowerMessage.match(/스트레스|불안|압박|긴장|힘들/)) {
      analysis.extractedInfo.personality.neuroticism = 3;
    }

    // 4. 역량 추출
    if (!analysis.extractedInfo.skills) {
      analysis.extractedInfo.skills = {};
    }

    if (lowerMessage.match(/소통|대화|친절|응대/)) {
      analysis.extractedInfo.skills.communication = 7;
    }
    if (lowerMessage.match(/빠르|학습|금방|쉽게/)) {
      analysis.extractedInfo.skills.learning_speed = 7;
    }
    if (lowerMessage.match(/팀|협력|함께|도와/)) {
      analysis.extractedInfo.skills.teamwork = 7;
    }

    // 5. 선호 조건 추출
    if (!analysis.extractedInfo.preferences) {
      analysis.extractedInfo.preferences = { industries: [], workHours: [], weekends: false, minWage: 10000, maxDistance: 5 };
    }

    // 업종 파악
    const industries = {
      'cafe': ['카페', '커피', '스타벅스', '투썸'],
      'convenience': ['편의점', 'cu', 'gs25', '세븐일레븐'],
      'restaurant': ['음식점', '식당', '서빙', '레스토랑', '한식', '중식', '일식'],
      'delivery': ['배달', '라이더', '오토바이', '퀵서비스'],
      'retail': ['판매', '매장', '옷', '의류', '가게']
    };

    for (const [industry, keywords] of Object.entries(industries)) {
      if (keywords.some(k => lowerMessage.includes(k))) {
        if (!analysis.extractedInfo.preferences.industries.includes(industry)) {
          analysis.extractedInfo.preferences.industries.push(industry);
        }
      }
    }

    // 시간대 파악
    if (lowerMessage.match(/오전|아침/)) analysis.extractedInfo.preferences.workHours.push('morning');
    if (lowerMessage.match(/오후|점심/)) analysis.extractedInfo.preferences.workHours.push('afternoon');
    if (lowerMessage.match(/저녁|밤|야간/)) analysis.extractedInfo.preferences.workHours.push('evening');
    if (lowerMessage.match(/새벽|밤샘/)) analysis.extractedInfo.preferences.workHours.push('night');

    // 주말 근무
    if (lowerMessage.match(/주말|토요일|일요일/)) {
      if (analysis.sentiment === 'positive' || lowerMessage.includes('가능')) {
        analysis.extractedInfo.preferences.weekends = true;
      }
    }

    // 6. 시나리오 트리거 확인
    for (const [scenarioName, scenario] of Object.entries(CONVERSATION_SCENARIOS)) {
      if (scenario.trigger.some(keyword => lowerMessage.includes(keyword))) {
        analysis.triggerScenario = scenarioName;
        break;
      }
    }

    return analysis;
  }

  /**
   * 수집된 데이터 업데이트
   */
  private updateCollectedData(analysis: ResponseAnalysis): void {
    const { extractedInfo } = analysis;

    // 성향 업데이트
    if (extractedInfo.personality) {
      this.session.collectedData.personality = {
        ...this.session.collectedData.personality!,
        ...extractedInfo.personality
      };
    }

    // 역량 업데이트
    if (extractedInfo.skills) {
      this.session.collectedData.skills = {
        ...this.session.collectedData.skills!,
        ...extractedInfo.skills
      };
    }

    // 선호 조건 업데이트
    if (extractedInfo.preferences) {
      const currentPrefs = this.session.collectedData.preferences!;
      const newPrefs = extractedInfo.preferences;

      this.session.collectedData.preferences = {
        industries: [...new Set([...currentPrefs.industries, ...newPrefs.industries])],
        workHours: [...new Set([...currentPrefs.workHours, ...newPrefs.workHours])],
        weekends: newPrefs.weekends || currentPrefs.weekends,
        minWage: newPrefs.minWage || currentPrefs.minWage,
        maxDistance: newPrefs.maxDistance || currentPrefs.maxDistance
      };
    }
  }

  /**
   * 시나리오 기반 응답
   */
  private followScenario(scenarioName: string, userMessage: string): string {
    const scenario = CONVERSATION_SCENARIOS[scenarioName as keyof typeof CONVERSATION_SCENARIOS];
    
    if (!scenario) {
      return this.getNextQuestion(userMessage, this.analyzeResponse(userMessage));
    }

    // 현재 시나리오 단계 확인 (간단하게 첫 단계 반환)
    const step = scenario.flow[0];
    
    return step.ai;
  }

  /**
   * 단계 진행도 업데이트
   */
  private updateStageProgress(): void {
    this.session.stageProgress += 10;
  }

  /**
   * 다음 단계로 이동 판단
   */
  private shouldMoveToNextStage(): boolean {
    return this.session.stageProgress >= 100;
  }

  /**
   * 다음 단계로 이동
   */
  private moveToNextStage(): void {
    const stageOrder: Array<InterviewSession['currentStage']> = [
      'basic',
      'personality',
      'experience',
      'matching'
    ];

    const currentIndex = stageOrder.indexOf(this.session.currentStage);
    
    if (currentIndex < stageOrder.length - 1) {
      this.session.currentStage = stageOrder[currentIndex + 1];
      this.session.stageProgress = 0;
    } else {
      this.session.isComplete = true;
    }
  }

  /**
   * 다음 질문 선택
   */
  private getNextQuestion(userMessage: string, analysis: ResponseAnalysis): string {
    if (this.session.isComplete) {
      return this.generateFinalSummary();
    }

    const { currentStage, userType } = this.session;
    
    // 구직자용 질문
    if (userType === 'jobseeker') {
      const questions = INTERVIEW_QUESTIONS_DB.jobseeker;
      
      switch (currentStage) {
        case 'basic':
          return this.selectFromQuestions(questions.basic);
        case 'personality':
          return this.selectFromQuestions(questions.personality);
        case 'experience':
          return this.selectFromQuestions(questions.experience);
        case 'matching':
          return '면접이 거의 끝났어요! 마지막으로 궁금한 점이 있으신가요?';
      }
    }

    return '좋아요! 다음 질문이에요...';
  }

  /**
   * 질문 배열에서 선택
   */
  private selectFromQuestions(questions: any[]): string {
    // 간단하게 순차 선택 (실제로는 더 지능적으로)
    const asked = this.session.conversationHistory
      .filter(m => m.role === 'assistant')
      .map(m => m.content);

    const unasked = questions.filter(q => !asked.includes(q.question));
    
    if (unasked.length > 0) {
      return unasked[0].question;
    }

    return '좋아요! 이제 충분한 정보를 얻었어요 😊';
  }

  /**
   * 최종 요약 생성
   */
  private generateFinalSummary(): string {
    const { collectedData } = this.session;
    
    return `
면접이 완료되었습니다! 🎉

분석 결과를 요약해드릴게요:

📊 성향 분석:
- 외향성: ${this.getPersonalityLabel(collectedData.personality!.extraversion)}
- 성실성: ${this.getPersonalityLabel(collectedData.personality!.conscientiousness)}
- 개방성: ${this.getPersonalityLabel(collectedData.personality!.openness)}

💼 추천 업종: ${collectedData.preferences!.industries.join(', ') || '다양한 업종'}

지금 바로 맞춤 공고를 확인해보세요!
    `.trim();
  }

  /**
   * 성향 레이블 변환
   */
  private getPersonalityLabel(score: number): string {
    if (score >= 7) return '높음 ⭐';
    if (score >= 4) return '보통 ✓';
    return '낮음 →';
  }

  /**
   * 환영 메시지
   */
  private getWelcomeMessage(): string {
    if (this.session.userType === 'jobseeker') {
      return `안녕하세요! 알비 AI 면접관입니다 🐝

저는 여러분의 성향과 역량을 분석해서
가장 잘 맞는 알바를 추천해드려요!

편하게 대화한다고 생각하고
솔직하게 답변해주세요 😊

먼저, 어떤 종류의 알바에 관심이 있으신가요?`;
    } else {
      return `안녕하세요! 알비 채용 컨설턴트입니다 🐝

최적의 인재를 찾을 수 있도록 도와드릴게요!

먼저 사업장 정보를 알려주세요.`;
    }
  }

  /**
   * 메시지 추가
   */
  private addMessage(role: 'user' | 'assistant', content: string): void {
    this.session.conversationHistory.push({
      role,
      content,
      timestamp: new Date()
    });
  }

  /**
   * 세션 정보 반환
   */
  getSession(): InterviewSession {
    return this.session;
  }

  /**
   * 수집된 프로필 반환
   */
  getUserProfile(): Partial<UserProfile> {
    return this.session.collectedData;
  }
}

export default AIInterviewEngine;
