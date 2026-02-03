/**
 * AI 면접 및 매칭 API
 * 
 * OpenAI GPT-4를 활용한 실전급 면접 시스템
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { SYSTEM_PROMPTS, INTERVIEW_QUESTIONS, RESPONSE_ANALYSIS, MATCHING_WEIGHTS } from './ai-interview-prompts';

const app = new Hono();

// CORS 설정
app.use('/api/*', cors());

// 타입 정의
interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UserProfile {
  interests: string[];
  personality: {
    extraversion?: number;
    openness?: number;
    conscientiousness?: number;
    agreeableness?: number;
    neuroticism?: number;
  };
  experience: {
    previous_jobs?: string[];
    strengths?: string[];
    weaknesses?: string[];
    preferences?: string[];
  };
  conditions: {
    location?: string;
    schedule?: string;
    wage?: number;
  };
}

// 임시 세션 스토리지 (실제로는 D1 또는 KV 사용)
const sessions = new Map<string, {
  userType: 'jobseeker' | 'employer';
  currentStep: number;
  profile: UserProfile;
  conversationHistory: ConversationMessage[];
  questionIndex: number;
}>();

/**
 * AI 면접 채팅 엔드포인트
 */
app.post('/api/ai-matching/chat', async (c) => {
  try {
    const { message, userType, currentStep, conversationHistory } = await c.req.json();
    
    // 세션 ID 생성 (실제로는 인증 토큰 사용)
    const sessionId = c.req.header('x-session-id') || 'demo-session';
    
    // 세션 초기화 또는 가져오기
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        userType: userType || 'jobseeker',
        currentStep: 0,
        profile: {
          interests: [],
          personality: {},
          experience: {},
          conditions: {}
        },
        conversationHistory: [],
        questionIndex: 0
      };
      sessions.set(sessionId, session);
    }
    
    // 사용자 메시지 추가
    session.conversationHistory.push({
      role: 'user',
      content: message
    });
    
    // 응답 분석 및 프로필 업데이트
    analyzeAndUpdateProfile(session, message);
    
    // AI 응답 생성
    const aiResponse = await generateAIResponse(session, message);
    
    // AI 응답 추가
    session.conversationHistory.push({
      role: 'assistant',
      content: aiResponse.content
    });
    
    // 단계 진행
    if (aiResponse.shouldAdvanceStep) {
      session.currentStep = Math.min(session.currentStep + 1, 3);
      session.questionIndex = 0;
    } else {
      session.questionIndex++;
    }
    
    // 매칭 완료 여부 확인
    const matchingComplete = session.currentStep >= 3 && isProfileComplete(session.profile);
    
    return c.json({
      success: true,
      data: {
        content: aiResponse.content,
        nextStep: session.currentStep,
        matchingComplete,
        profileId: matchingComplete ? sessionId : undefined,
        card: aiResponse.card
      }
    });
    
  } catch (error) {
    console.error('AI Chat Error:', error);
    return c.json({
      success: false,
      error: '응답 생성에 실패했습니다.'
    }, 500);
  }
});

/**
 * AI 응답 생성 (OpenAI GPT-4 또는 폴백)
 */
async function generateAIResponse(session: any, userMessage: string) {
  const { userType, currentStep, profile, conversationHistory, questionIndex } = session;
  
  // 현재 단계에 맞는 질문 가져오기
  const questions = getQuestionsForStage(userType, currentStep);
  
  // OpenAI API 호출 시도 (환경변수에 API 키가 있는 경우)
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (openaiKey) {
    try {
      const systemPrompt = buildSystemPrompt(userType, currentStep, profile, conversationHistory);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-6), // 최근 6개 메시지만
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const aiContent = data.choices[0].message.content;
        
        return {
          content: aiContent,
          shouldAdvanceStep: shouldAdvanceToNextStep(currentStep, conversationHistory.length),
          card: null
        };
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
    }
  }
  
  // 폴백: 규칙 기반 응답
  return generateRuleBasedResponse(session, userMessage, questions);
}

/**
 * 규칙 기반 응답 생성
 */
function generateRuleBasedResponse(session: any, userMessage: string, questions: any[]) {
  const { currentStep, questionIndex, profile, userType } = session;
  const lowerMessage = userMessage.toLowerCase();
  
  // 현재 질문 인덱스
  const currentQuestionIndex = Math.min(questionIndex, questions.length - 1);
  const nextQuestion = questions[currentQuestionIndex];
  
  // 응답에 따른 다음 질문 선택
  let response = '';
  let shouldAdvance = false;
  
  // 단계별 로직
  if (currentStep === 0) { // 기본 정보
    if (lowerMessage.includes('카페') || lowerMessage.includes('커피')) {
      profile.interests.push('cafe');
      response = '카페에 관심 있으시군요! ☕ 카페는 고객 응대가 많은 편이에요.<br><br>언제 일하실 수 있으신가요? (평일 오후, 주말, 야간 등)';
    } else if (lowerMessage.includes('편의점')) {
      profile.interests.push('convenience');
      response = '편의점에 관심 있으시군요! 🏪<br><br>언제 일하실 수 있으신가요?';
    } else if (lowerMessage.includes('음식점') || lowerMessage.includes('식당') || lowerMessage.includes('서빙')) {
      profile.interests.push('restaurant');
      response = '음식점에 관심 있으시군요! 🍽️<br><br>언제 일하실 수 있으신가요?';
    } else if (lowerMessage.match(/오전|오후|저녁|야간|주말/)) {
      profile.conditions.schedule = userMessage;
      response = '알겠습니다! 😊<br><br>어느 지역에서 일하고 싶으신가요?';
    } else if (questionIndex >= questions.length - 1) {
      shouldAdvance = true;
      response = '기본 정보 감사합니다!<br><br>이제 당신의 <strong>성향</strong>에 대해 알아볼게요. 사람들과 대화하고 소통하는 것을 즐기시나요?';
    } else {
      response = nextQuestion ? nextQuestion.question : '다음 질문으로 넘어갈게요.';
    }
  } else if (currentStep === 1) { // 성향 분석
    // 긍정/부정 감지
    const isPositive = lowerMessage.match(/좋아|즐거|편해|괜찮|네|그래|맞아/);
    const isNegative = lowerMessage.match(/싫어|힘들|부담|아니|별로|글쎄/);
    
    if (isPositive) {
      response = '좋아요! 👍 적극적인 성향이시네요.<br><br>새로운 것을 배우는 게 재미있으신가요?';
    } else if (isNegative) {
      response = '이해했어요. 혼자 집중하는 것을 선호하시는군요.<br><br>그렇다면 계획적이고 체계적으로 일하는 걸 좋아하시나요?';
    } else if (questionIndex >= questions.length - 1) {
      shouldAdvance = true;
      response = '성향 분석 완료!<br><br>이제 <strong>경험</strong>에 대해 이야기해볼까요? 이전에 알바 경험이 있으신가요?';
    } else {
      response = nextQuestion ? nextQuestion.question : '다음 질문입니다.';
    }
  } else if (currentStep === 2) { // 경험 분석
    if (lowerMessage.match(/없|처음|첫/)) {
      profile.experience.previous_jobs = ['신입'];
      response = '알겠습니다! 처음이시라면 교육이 잘 되어 있는 곳이 좋겠네요.<br><br>특별히 잘하시거나 자신 있는 것이 있나요?';
    } else if (lowerMessage.match(/있|했|일했/)) {
      response = '오, 경험이 있으시군요! 👏<br><br>그 경험에서 가장 좋았던 점은 무엇이었나요?';
    } else if (questionIndex >= questions.length - 1) {
      shouldAdvance = true;
      response = '모든 분석이 완료되었습니다! 🎉<br><br>잠시만 기다려주세요. 당신에게 <strong>최적의 일자리</strong>를 찾고 있어요...';
    } else {
      response = nextQuestion ? nextQuestion.question : '계속해서 질문드릴게요.';
    }
  } else { // 매칭 완료
    response = '분석이 완료되었습니다!<br><br>매칭 결과를 보여드릴게요. 🎯';
    shouldAdvance = false;
  }
  
  return {
    content: response,
    shouldAdvanceStep: shouldAdvance,
    card: null
  };
}

/**
 * 단계별 질문 가져오기
 */
function getQuestionsForStage(userType: string, stage: number) {
  const questions = INTERVIEW_QUESTIONS[userType as 'jobseeker' | 'employer'];
  if (!questions) return [];
  
  switch (stage) {
    case 0: return questions.basic || [];
    case 1: return questions.personality || questions.idealCandidate || [];
    case 2: return questions.experience || questions.jobDetails || [];
    default: return [];
  }
}

/**
 * 시스템 프롬프트 구성
 */
function buildSystemPrompt(userType: string, currentStep: number, profile: any, history: any[]) {
  const basePrompt = SYSTEM_PROMPTS[userType as 'jobseeker' | 'employer'];
  
  return basePrompt
    .replace('{currentStep}', currentStep.toString())
    .replace('{conversationHistory}', JSON.stringify(history.slice(-4)))
    .replace('{userProfile}', JSON.stringify(profile))
    .replace('{employerProfile}', JSON.stringify(profile));
}

/**
 * 응답 분석 및 프로필 업데이트
 */
function analyzeAndUpdateProfile(session: any, message: string) {
  const { profile, currentStep } = session;
  const lowerMessage = message.toLowerCase();
  
  // 키워드 기반 분석
  if (currentStep === 1) { // 성향 분석
    if (lowerMessage.match(/좋아|즐거|편해/)) {
      profile.personality.extraversion = (profile.personality.extraversion || 0) + 1;
    }
    if (lowerMessage.match(/배우|도전|새로운/)) {
      profile.personality.openness = (profile.personality.openness || 0) + 1;
    }
    if (lowerMessage.match(/계획|체계|꼼꼼/)) {
      profile.personality.conscientiousness = (profile.personality.conscientiousness || 0) + 1;
    }
  } else if (currentStep === 2) { // 경험 분석
    if (lowerMessage.match(/카페|커피/)) {
      profile.experience.previous_jobs = profile.experience.previous_jobs || [];
      profile.experience.previous_jobs.push('cafe');
    }
  }
}

/**
 * 다음 단계 진행 여부
 */
function shouldAdvanceToNextStep(currentStep: number, messageCount: number): boolean {
  // 각 단계별 최소 메시지 수
  const minMessages = [4, 6, 6]; // 기본정보, 성향, 경험
  return messageCount >= minMessages[currentStep] * 2;
}

/**
 * 프로필 완성도 확인
 */
function isProfileComplete(profile: UserProfile): boolean {
  return (
    profile.interests.length > 0 &&
    Object.keys(profile.personality).length >= 2 &&
    Object.keys(profile.experience).length >= 1
  );
}

/**
 * 매칭 결과 API
 */
app.get('/api/ai-matching/results/:profileId', async (c) => {
  try {
    const profileId = c.req.param('profileId');
    const session = sessions.get(profileId);
    
    if (!session) {
      return c.json({
        success: false,
        error: '프로필을 찾을 수 없습니다.'
      }, 404);
    }
    
    // 매칭 알고리즘 실행
    const matches = await findMatches(session.profile);
    
    return c.json({
      success: true,
      data: {
        profile: session.profile,
        matches
      }
    });
    
  } catch (error) {
    console.error('Matching Error:', error);
    return c.json({
      success: false,
      error: '매칭 중 오류가 발생했습니다.'
    }, 500);
  }
});

/**
 * 매칭 알고리즘
 */
async function findMatches(profile: UserProfile) {
  // 목업 데이터 (실제로는 D1에서 가져오기)
  const mockJobs = [
    {
      id: 1,
      title: '스타벅스 강남점 바리스타',
      category: 'cafe',
      location: '서울 강남구',
      distance: 0.8,
      hourly_wage: 12000,
      required_personality: {
        extraversion: 'high',
        openness: 'medium'
      },
      tags: ['장기', '주말', '오전'],
      workplace_culture: 'friendly'
    },
    {
      id: 2,
      title: '투썸플레이스 역삼점',
      category: 'cafe',
      location: '서울 강남구',
      distance: 1.2,
      hourly_wage: 11500,
      required_personality: {
        extraversion: 'medium',
        conscientiousness: 'high'
      },
      tags: ['평일', '오후'],
      workplace_culture: 'systematic'
    }
  ];
  
  // 매칭 점수 계산
  const scoredJobs = mockJobs.map(job => {
    const score = calculateMatchScore(profile, job);
    return { ...job, matchScore: score };
  });
  
  // 점수순 정렬
  return scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * 매칭 점수 계산
 */
function calculateMatchScore(profile: UserProfile, job: any): number {
  let score = 0;
  
  // 관심 분야 일치 (40%)
  if (profile.interests.includes(job.category)) {
    score += 40;
  }
  
  // 성향 일치도 (30%)
  const personalityScore = calculatePersonalityMatch(profile.personality, job.required_personality);
  score += personalityScore * 0.3;
  
  // 거리 (10%)
  if (job.distance < 1) score += 10;
  else if (job.distance < 2) score += 7;
  else if (job.distance < 3) score += 5;
  
  // 경험 (20%)
  if (profile.experience.previous_jobs?.includes(job.category)) {
    score += 20;
  } else if (profile.experience.previous_jobs?.includes('신입') && job.training_provided) {
    score += 15;
  }
  
  return Math.min(Math.round(score), 98); // 최대 98%
}

/**
 * 성향 일치도 계산
 */
function calculatePersonalityMatch(userPersonality: any, jobRequirement: any): number {
  // 간단한 매칭 로직
  let matches = 0;
  let total = 0;
  
  for (const trait in jobRequirement) {
    total++;
    const userLevel = userPersonality[trait] || 0;
    const requiredLevel = jobRequirement[trait];
    
    if (requiredLevel === 'high' && userLevel >= 2) matches++;
    else if (requiredLevel === 'medium' && userLevel >= 1) matches++;
    else if (requiredLevel === 'low' || userLevel === 0) matches++;
  }
  
  return total > 0 ? (matches / total) * 100 : 50;
}

export default app;
