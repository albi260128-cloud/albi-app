/**
 * 알비(ALBI) API - Cloudflare Pages Functions
 * 모든 API 요청을 처리하는 메인 핸들러
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/cloudflare-pages';
import type { Env, ApiResponse, WageCalculation } from '../../src/types';

// Hono 앱 생성 (basePath 설정)
const app = new Hono<{ Bindings: Env }>().basePath('/api');

// ========================================
// 미들웨어 설정
// ========================================

// CORS 설정
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// ========================================
// AI 챗봇 API (프로페셔널 면접관 시스템)
// 4단계 논리: DETECT → ANALYZE → PROBE → RECOMMEND
// ========================================

// 세션 저장소 (임시 - 실제로는 D1이나 KV 사용)
const interviewSessions = new Map(); // 구버전 (키워드 매칭)
const interviewSessionsV2 = new Map(); // 신버전 (AlbiInterviewEngine)

// 프로페셔널 시나리오 불러오기
const PROFESSIONAL_SCENARIOS = {
  cafe: [
    { q: '안녕하세요! 카페 알바에 지원해주셔서 감사해요 😊\n먼저 편하게 자기소개와 카페에 지원하신 이유를 말해주세요!', type: 'intro' },
    { q: '카페 경험이 있으신가요? 있다면 어떤 머신을 사용해보셨고, 가장 자신 있는 음료가 뭔가요?', type: 'experience' },
    { q: '카페에서 가장 바쁜 시간이 언제라고 생각하세요? 그때 주문이 10잔 밀렸을 때 어떻게 대처하시겠어요?', type: 'stress' },
    { q: '음료를 만들었는데 손님이 "이거 맛이 이상한데요?"라고 하시면 어떻게 대응하시겠어요?', type: 'critical', critical: true },
    { q: '카페는 주말과 공휴일이 제일 바쁜데, 주말 근무 가능하신가요?', type: 'critical', critical: true },
    { q: '최소 얼마나 오래 일하실 계획이세요?', type: 'duration' },
    { q: '시급은 얼마 정도 생각하고 계세요?', type: 'wage' }
  ],
  convenience: [
    { q: '안녕하세요! 편의점 알바에 관심 가져주셔서 감사해요 😊\n편의점은 24시간 운영이라 야간 근무도 있는데, 어떤 시간대를 희망하시나요?', type: 'intro' },
    { q: '편의점 경험이 있으신가요? 있다면 어느 브랜드에서 주로 어떤 업무를 하셨나요?', type: 'experience' },
    { q: '고등학생으로 보이는 손님이 담배를 달라고 하는데 신분증이 없다고 하시면 어떻게 하시겠어요?', type: 'critical', critical: true },
    { q: '새벽 2시에 술 취한 손님이 계속 시비를 거시는데 혼자 근무 중이에요. 어떻게 하시겠어요?', type: 'critical', critical: true },
    { q: '물류 정리 중인데 계산대에 손님 3명이 줄 섰고, 동시에 튀김기 알람이 울리면 어떤 순서로 처리하시겠어요?', type: 'multitask' },
    { q: '최소 얼마나 오래 일하실 계획이세요?', type: 'duration' }
  ],
  restaurant: [
    { q: '안녕하세요! 저희 음식점에 관심 가져주셔서 감사해요 😊\n어떤 종류의 음식점인지 미리 알아보고 오셨나요?', type: 'intro' },
    { q: '서빙 경험이 있으시군요! 동시에 몇 테이블 정도 담당하셨고, 가장 힘들었던 순간이 언제였나요?', type: 'experience' },
    { q: '3개 테이블에서 동시에 호출 벨이 울렸어요. A테이블:물, B테이블:추가주문, C테이블:불만. 어떤 순서로 대응하시겠어요?', type: 'priority' },
    { q: '음식을 나르다가 실수로 손님 옷에 국물을 흘렸어요. 손님이 엄청 화가 나셨어요. 어떻게 하시겠어요?', type: 'critical', critical: true },
    { q: '피크 시간대(런치 11-2시, 디너 6-9시) 근무 가능하세요?', type: 'critical', critical: true },
    { q: '최소 얼마나 오래 일하실 계획이세요?', type: 'duration' }
  ]
};

app.post('/chat', async (c) => {
  try {
    const body = await c.req.json();
    const { message, userType = 'jobseeker', userId = 'anonymous', jobType = 'cafe', region = '서울', expectedWage = 10000 } = body;

    // ========================================
    // 🐝 AlbiInterviewEngine 완전 통합 (스마트 버전)
    // ========================================
    
    // 구직자 면접만 지원
    if (userType !== 'jobseeker') {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '현재는 구직자 면접만 지원합니다.' 
      }, 400);
    }
    
    // 입력 검증
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '메시지를 입력해주세요.' 
      }, 400);
    }

    // AlbiInterviewEngine 동적 import
    const { AlbiInterviewEngine } = await import('../../src/albi-interview-engine');
    
    // 세션 키 생성
    const sessionKey = `${userId}_${jobType}`;
    let aiMessage = '';
    let sessionData: any = {};
    let profile: any = null;
    
    try {
      // ========================================
      // 새 세션 시작 (첫 번째 메시지)
      // ========================================
      if (!interviewSessionsV2.has(sessionKey)) {
        const engine = new AlbiInterviewEngine(
          jobType as 'cafe' | 'cvs' | 'restaurant' | 'retail' | 'fastfood',
          region,
          expectedWage
        );
        
        const startResponse = engine.startInterview();
        
        // 세션 저장
        interviewSessionsV2.set(sessionKey, {
          engine,
          userId,
          jobType,
          region,
          expectedWage,
          startedAt: new Date(),
          lastActivity: new Date()
        });
        
        return c.json<ApiResponse>({
          success: true,
          data: {
            role: 'assistant',
            content: startResponse.message + '\n\n' + (startResponse.question || ''),
            sessionData: {
              status: startResponse.status,
              progress: startResponse.progress || '시작',
              questionCount: 1
            }
          }
        });
      }

      // ========================================
      // 기존 세션 진행
      // ========================================
      const session = interviewSessionsV2.get(sessionKey);
      if (!session || !session.engine) {
        return c.json<ApiResponse>({ 
          success: false, 
          error: '세션을 찾을 수 없습니다. 새로 시작해주세요.' 
        }, 400);
      }
      
      session.lastActivity = new Date();
      
      // 답변 처리
      const response = await session.engine.processAnswer(message);
      
      // 디버깅: response 구조 확인
      console.log('AlbiInterviewEngine Response:', JSON.stringify(response, null, 2));
      
      // 세션 업데이트
      interviewSessionsV2.set(sessionKey, session);
      
      // 응답 생성
      if (response.status === 'completed') {
        aiMessage = response.message;
        sessionData = {
          status: 'completed',
          progress: '완료',
          result: response.result
        };
        profile = response.result;
        
        // 완료된 세션 정리 (선택사항)
        // interviewSessionsV2.delete(sessionKey);
      } else if (response.status === 'rejected') {
        aiMessage = response.message;
        sessionData = {
          status: 'rejected',
          progress: '탈락',
          result: response.result
        };
        profile = response.result;
        
        // 탈락 세션 정리
        interviewSessionsV2.delete(sessionKey);
      } else {
        // ongoing
        aiMessage = response.message + (response.question ? '\n\n' + response.question : '');
        sessionData = {
          status: 'ongoing',
          progress: response.progress || '진행 중',
          questionCount: response.debug?.question_count || 0
        };
      }
      
    } catch (engineError) {
      console.error('AI Engine Error:', engineError);
      // 폴백
      aiMessage = '죄송해요, 일시적인 오류가 발생했어요. 😅\n잠시 후 다시 시도해주세요!';
      sessionData = {
        status: 'error',
        progress: '오류'
      };
    }

    return c.json<ApiResponse>({
      success: true,
      data: {
        role: 'assistant',
        content: aiMessage.trim(),
        profile: profile,
        sessionData: sessionData
      }
    });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error?.message || '죄송합니다. 일시적인 오류가 발생했습니다. 🐝'
    }, 500);
  }
});

// ========================================
// 급여 계산기 API
// ========================================

app.post('/calculator/wage', async (c) => {
  try {
    const body = await c.req.json();
    const { hourlyWage, weeklyHours } = body;

    const wage = Number(hourlyWage) || 0;
    const hours = Number(weeklyHours) || 0;

    // 입력값 검증
    if (wage < 0 || hours < 0 || hours > 168) {
      return c.json<ApiResponse>({
        success: false,
        error: '올바른 값을 입력해주세요. (시급: 0원 이상, 주간 근무시간: 0-168시간)'
      }, 400);
    }

    if (wage < 10030 && wage > 0) {
      return c.json<ApiResponse>({
        success: false,
        error: '2025년 최저시급(10,030원) 이상으로 입력해주세요.'
      }, 400);
    }

    // 급여 계산
    const weeklyBasePay = wage * hours;
    const hasHolidayPay = hours >= 15;

    let weeklyHolidayPay = 0;
    if (hasHolidayPay) {
      const holidayHours = Math.min(hours / 40, 1) * 8;
      weeklyHolidayPay = holidayHours * wage;
    }

    const weeklyTotal = weeklyBasePay + weeklyHolidayPay;
    const monthlyEstimate = weeklyTotal * 4.345;

    const result: WageCalculation = {
      weeklyHours: Math.round(hours * 10) / 10,
      weeklyBasePay: Math.round(weeklyBasePay),
      weeklyHolidayPay: Math.round(weeklyHolidayPay),
      weeklyTotal: Math.round(weeklyTotal),
      monthlyEstimate: Math.round(monthlyEstimate),
      hasHolidayPay,
      explanation: hasHolidayPay
        ? `주 ${hours}시간 근무로 주휴수당 적용\n주휴수당 = (${hours} ÷ 40) × 8 × ${wage.toLocaleString()}원 = ${Math.round(weeklyHolidayPay).toLocaleString()}원`
        : `주 ${hours}시간 근무로 주휴수당 미적용 (15시간 이상 시 적용)`
    };

    return c.json<ApiResponse>({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Calculator Error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error?.message || '계산 중 오류가 발생했습니다.'
    }, 500);
  }
});

// ========================================
// 데이터베이스 API (D1 사용)
// ========================================

// 사용자 목록 조회
app.get('/users', async (c) => {
  try {
    const { results } = await c.env.DB
      .prepare('SELECT id, email, user_type, name, albi_points, trust_score FROM users LIMIT 20')
      .all();
    
    return c.json<ApiResponse>({
      success: true,
      data: { users: results, count: results.length }
    });
  } catch (error: any) {
    console.error('Database Error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error?.message || '데이터베이스 오류가 발생했습니다.'
    }, 500);
  }
});

// 구인 공고 목록 조회
app.get('/jobs', async (c) => {
  try {
    const { results } = await c.env.DB
      .prepare(`
        SELECT j.*, u.name as employer_name 
        FROM jobs j 
        LEFT JOIN users u ON j.employer_id = u.id 
        WHERE j.status = 'active' 
        ORDER BY j.created_at DESC 
        LIMIT 20
      `)
      .all();
    
    return c.json<ApiResponse>({
      success: true,
      data: { jobs: results, count: results.length }
    });
  } catch (error: any) {
    console.error('Database Error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error?.message || '데이터베이스 오류가 발생했습니다.'
    }, 500);
  }
});

// [DEPRECATED] 아래 라우트는 위치 기반 API로 대체됨 - 주석 처리
/*
// 특정 구인 공고 조회
app.get('/jobs/:id', async (c) => {
  try {
    const jobId = c.req.param('id');
    
    const job = await c.env.DB
      .prepare(`
        SELECT j.*, u.name as employer_name, u.trust_score as employer_trust_score
        FROM jobs j 
        LEFT JOIN users u ON j.employer_id = u.id 
        WHERE j.id = ?
      `)
      .bind(jobId)
      .first();
    
    if (!job) {
      return c.json<ApiResponse>({
        success: false,
        error: '구인 공고를 찾을 수 없습니다.'
      }, 404);
    }
    
    return c.json<ApiResponse>({
      success: true,
      data: { job }
    });
  } catch (error: any) {
    console.error('Database Error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error?.message || '데이터베이스 오류가 발생했습니다.'
    }, 500);
  }
});
*/


// 체험 예약 생성
app.post('/experiences', async (c) => {
  try {
    const body = await c.req.json();
    const { job_id, jobseeker_id, scheduled_date, scheduled_time } = body;

    // 필수 필드 검증
    if (!job_id || !jobseeker_id || !scheduled_date || !scheduled_time) {
      return c.json<ApiResponse>({
        success: false,
        error: '필수 정보가 누락되었습니다.'
      }, 400);
    }

    // 구인 공고 확인
    const job = await c.env.DB
      .prepare('SELECT * FROM jobs WHERE id = ? AND status = "active"')
      .bind(job_id)
      .first();

    if (!job) {
      return c.json<ApiResponse>({
        success: false,
        error: '유효하지 않은 구인 공고입니다.'
      }, 404);
    }

    // 체험 예약 생성
    const result = await c.env.DB
      .prepare(`
        INSERT INTO experiences (job_id, jobseeker_id, employer_id, scheduled_date, scheduled_time)
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(job_id, jobseeker_id, (job as any).employer_id, scheduled_date, scheduled_time)
      .run();

    return c.json<ApiResponse>({
      success: true,
      data: { 
        message: '체험 예약이 완료되었습니다! 🐜',
        experience_id: result.meta.last_row_id 
      }
    });

  } catch (error: any) {
    console.error('Database Error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error?.message || '체험 예약 중 오류가 발생했습니다.'
    }, 500);
  }
});

// ========================================
// 친구 추천 시스템 API
// ========================================

// 추천 코드 생성 함수
function generateReferralCode(userId: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'ALBI';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 1. 내 추천 코드 가져오기 또는 생성
app.get('/referral/my-code/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');

    if (!userId) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '사용자 ID가 필요합니다.' 
      }, 400);
    }

    // 사용자 정보 조회
    const user = await c.env.DB.prepare(`
      SELECT id, email, name, referral_code 
      FROM users 
      WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '사용자를 찾을 수 없습니다.' 
      }, 404);
    }

    let referralCode = user.referral_code as string | null;

    // 추천 코드가 없으면 생성
    if (!referralCode) {
      referralCode = generateReferralCode(userId);
      
      await c.env.DB.prepare(`
        UPDATE users 
        SET referral_code = ? 
        WHERE id = ?
      `).bind(referralCode, userId).run();
    }

    // 초대 링크 생성 (현재 호스트 기준)
    const baseUrl = new URL(c.req.url).origin;
    const inviteLink = `${baseUrl}/signup?ref=${referralCode}`;

    return c.json<ApiResponse>({
      success: true,
      data: {
        referralCode,
        inviteLink,
        userName: user.name
      }
    });
  } catch (error) {
    console.error('Get Referral Code Error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '추천 코드 조회 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// 2. 친구 추천 등록 (회원가입 시)
app.post('/referral/register', async (c) => {
  try {
    const body = await c.req.json();
    const { refereeId, referralCode } = body;

    if (!refereeId || !referralCode) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '필수 정보가 누락되었습니다.' 
      }, 400);
    }

    // 추천인 찾기
    const referrer = await c.env.DB.prepare(`
      SELECT id, name, albi_points 
      FROM users 
      WHERE referral_code = ?
    `).bind(referralCode).first();

    if (!referrer) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '유효하지 않은 추천 코드입니다.' 
      }, 400);
    }

    // 자기 자신 추천 방지
    if (referrer.id === refereeId) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '자기 자신을 추천할 수 없습니다.' 
      }, 400);
    }

    // 중복 추천 확인
    const existing = await c.env.DB.prepare(`
      SELECT id 
      FROM referrals 
      WHERE referrer_id = ? AND referee_id = ?
    `).bind(referrer.id, refereeId).first();

    if (existing) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '이미 추천 관계가 등록되어 있습니다.' 
      }, 400);
    }

    // 트랜잭션 시작 (D1은 배치 실행 지원)
    const referralId = crypto.randomUUID().replace(/-/g, '').substring(0, 16);
    
    // 1) referrals 테이블에 추천 관계 저장
    await c.env.DB.prepare(`
      INSERT INTO referrals (id, referrer_id, referee_id, referral_code, status, reward_given)
      VALUES (?, ?, ?, ?, 'registered', 0)
    `).bind(referralId, referrer.id, refereeId, referralCode).run();

    // 2) 피추천인에게 20P 지급
    const referee = await c.env.DB.prepare(`
      SELECT albi_points 
      FROM users 
      WHERE id = ?
    `).bind(refereeId).first();

    const newBalance = (referee?.albi_points as number || 0) + 20;

    await c.env.DB.prepare(`
      UPDATE users 
      SET albi_points = ? 
      WHERE id = ?
    `).bind(newBalance, refereeId).run();

    // 3) 포인트 거래 내역 기록
    await c.env.DB.prepare(`
      INSERT INTO point_transactions (user_id, amount, transaction_type, description, balance_after)
      VALUES (?, 20, 'referral_signup_bonus', '친구 추천 가입 보너스 🎁', ?)
    `).bind(refereeId, newBalance).run();

    return c.json<ApiResponse>({
      success: true,
      data: {
        message: '친구 추천이 등록되었습니다! 20P가 지급되었습니다.',
        referralId,
        bonusPoints: 20,
        newBalance
      }
    });
  } catch (error) {
    console.error('Register Referral Error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '추천 등록 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// 3. 채용 성공 시 추천인 보상 (채용 결제 완료 시 호출)
app.post('/referral/reward', async (c) => {
  try {
    const body = await c.req.json();
    const { refereeId, jobId } = body;

    if (!refereeId || !jobId) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '필수 정보가 누락되었습니다.' 
      }, 400);
    }

    // 추천 관계 찾기 (registered 상태이고 아직 보상받지 않은 경우만)
    const referral = await c.env.DB.prepare(`
      SELECT r.id, r.referrer_id, r.referee_id, r.referral_code, u.name as referrer_name, u.albi_points as referrer_points
      FROM referrals r
      JOIN users u ON r.referrer_id = u.id
      WHERE r.referee_id = ? AND r.status = 'registered' AND r.reward_given = 0
    `).bind(refereeId).first();

    if (!referral) {
      // 추천 관계가 없거나 이미 보상받음
      return c.json<ApiResponse>({
        success: true,
        data: {
          message: '추천 보상 대상이 아닙니다.',
          rewarded: false
        }
      });
    }

    // 트랜잭션: 추천인에게 10P 지급
    const newBalance = (referral.referrer_points as number || 0) + 10;

    await c.env.DB.prepare(`
      UPDATE users 
      SET albi_points = ? 
      WHERE id = ?
    `).bind(newBalance, referral.referrer_id).run();

    // referrals 테이블 업데이트
    await c.env.DB.prepare(`
      UPDATE referrals 
      SET status = 'hired', reward_given = 1, rewarded_at = unixepoch()
      WHERE id = ?
    `).bind(referral.id).run();

    // 포인트 거래 내역 기록
    await c.env.DB.prepare(`
      INSERT INTO point_transactions (user_id, amount, transaction_type, description, balance_after)
      VALUES (?, 10, 'referral_hire_reward', '친구 채용 성공 보너스 🎉', ?)
    `).bind(referral.referrer_id, newBalance).run();

    return c.json<ApiResponse>({
      success: true,
      data: {
        message: '추천인에게 보상이 지급되었습니다!',
        rewarded: true,
        referrerId: referral.referrer_id,
        referrerName: referral.referrer_name,
        bonusPoints: 10,
        newBalance
      }
    });
  } catch (error) {
    console.error('Reward Referral Error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '보상 처리 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// 4. 내 추천 통계 조회
app.get('/referral/stats/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');

    if (!userId) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '사용자 ID가 필요합니다.' 
      }, 400);
    }

    // 전체 추천 수
    const totalResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM referrals
      WHERE referrer_id = ?
    `).bind(userId).first();

    // 성공한 추천 수 (채용 완료)
    const successResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as success
      FROM referrals
      WHERE referrer_id = ? AND status = 'hired'
    `).bind(userId).first();

    // 총 획득 포인트
    const pointsResult = await c.env.DB.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total_earned
      FROM point_transactions
      WHERE user_id = ? AND transaction_type = 'referral_hire_reward'
    `).bind(userId).first();

    // 최근 추천 친구 목록
    const recentReferrals = await c.env.DB.prepare(`
      SELECT 
        r.id,
        r.status,
        r.created_at,
        r.rewarded_at,
        u.name as referee_name,
        u.email as referee_email
      FROM referrals r
      JOIN users u ON r.referee_id = u.id
      WHERE r.referrer_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `).bind(userId).all();

    return c.json<ApiResponse>({
      success: true,
      data: {
        totalReferrals: totalResult?.total || 0,
        successfulReferrals: successResult?.success || 0,
        totalEarned: pointsResult?.total_earned || 0,
        recentReferrals: recentReferrals.results || []
      }
    });
  } catch (error) {
    console.error('Get Referral Stats Error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '통계 조회 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// ========================================
// 위치 기반 구인공고 API
// ========================================

// Haversine 공식으로 두 지점 간 거리 계산 (km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// 1. 위치 기반 구인공고 검색 (3km 반경)
app.get('/jobs/nearby', async (c) => {
  try {
    const lat = parseFloat(c.req.query('lat') || '37.5665');
    const lng = parseFloat(c.req.query('lng') || '126.9780');
    const radius = parseFloat(c.req.query('radius') || '3');
    const category = c.req.query('category') || 'all';
    const sortBy = c.req.query('sort') || 'distance';

    // 1차 필터링: Bounding Box로 대략적 범위 좁히기 (성능 최적화)
    const latDelta = radius / 111; // 위도 1도 ≈ 111km
    const lngDelta = radius / (111 * Math.cos(lat * Math.PI / 180));

    let query = `
      SELECT * FROM jobs 
      WHERE status = 'active'
      AND latitude BETWEEN ? AND ?
      AND longitude BETWEEN ? AND ?
    `;
    const params: (number | string)[] = [lat - latDelta, lat + latDelta, lng - lngDelta, lng + lngDelta];

    // 카테고리 필터 추가
    if (category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT 200';

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // 2차 필터링: 정확한 거리 계산 (Haversine 공식)
    const nearbyJobs = (results as any[])
      .map((job: any) => {
        if (!job.latitude || !job.longitude) return null;
        
        const distance = calculateDistance(lat, lng, job.latitude, job.longitude);
        return distance <= radius ? { ...job, distance: Math.round(distance * 10) / 10 } : null;
      })
      .filter(job => job !== null);

    // 정렬
    if (sortBy === 'distance') {
      nearbyJobs.sort((a: any, b: any) => a.distance - b.distance);
    } else if (sortBy === 'wage') {
      nearbyJobs.sort((a: any, b: any) => b.hourly_wage - a.hourly_wage);
    } else if (sortBy === 'views') {
      nearbyJobs.sort((a: any, b: any) => (b.views || 0) - (a.views || 0));
    }

    return c.json<ApiResponse>({
      success: true,
      data: {
        jobs: nearbyJobs,
        total: nearbyJobs.length,
        center: { lat, lng },
        radius
      }
    });
  } catch (error) {
    console.error('Nearby jobs error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '공고 검색 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// 2. 구인공고 상세 조회
app.get('/jobs/:jobId', async (c) => {
  try {
    const jobId = c.req.param('jobId');

    // 조회수 증가와 함께 상세 정보 조회
    await c.env.DB.prepare('UPDATE jobs SET views = views + 1 WHERE id = ?')
      .bind(jobId).run();

    const job = await c.env.DB.prepare(`
      SELECT j.*, u.name as employer_name
      FROM jobs j
      LEFT JOIN users u ON j.employer_id = u.id
      WHERE j.id = ?
    `).bind(jobId).first();

    if (!job) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '공고를 찾을 수 없습니다.' 
      }, 404);
    }

    return c.json<ApiResponse>({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Job detail error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '공고 조회 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// 3. 구인공고 등록
app.post('/jobs', async (c) => {
  try {
    const {
      employerId, title, hourlyWage, location, description,
      latitude, longitude, address, category, tags, workDays, workHours
    } = await c.req.json();

    // 유효성 검증
    if (!employerId || !title || !location || !latitude || !longitude) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '필수 정보를 모두 입력해주세요.' 
      }, 400);
    }

    if (hourlyWage < 10030) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '최저시급(10,030원) 이상으로 입력해주세요.' 
      }, 400);
    }

    // 알비포인트 확인
    const user = await c.env.DB.prepare('SELECT albi_points FROM users WHERE id = ?')
      .bind(employerId).first();

    if (!user || (user.albi_points as number) < 30) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '알비포인트가 부족합니다. (필요: 30P)' 
      }, 400);
    }

    const jobId = 'job-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
    const timestamp = Math.floor(Date.now() / 1000);

    // 트랜잭션: 공고 등록 + 포인트 차감
    await c.env.DB.batch([
      // 공고 등록
      c.env.DB.prepare(`
        INSERT INTO jobs (
          id, employer_id, title, hourly_wage, location, description,
          latitude, longitude, address, category, tags, work_days, work_hours,
          status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
      `).bind(
        jobId, employerId, title, hourlyWage, location, description,
        latitude, longitude, address, category || 'etc',
        JSON.stringify(tags || []), JSON.stringify(workDays || []),
        workHours, timestamp
      ),
      
      // 포인트 차감
      c.env.DB.prepare('UPDATE users SET albi_points = albi_points - 30 WHERE id = ?')
        .bind(employerId),
      
      // 포인트 거래 내역
      c.env.DB.prepare(`
        INSERT INTO point_transactions (user_id, amount, transaction_type, description, balance_after)
        VALUES (?, -30, 'job_posting', '구인공고 등록', 
                (SELECT albi_points FROM users WHERE id = ?) - 30)
      `).bind(employerId, employerId)
    ]);

    return c.json<ApiResponse>({
      success: true,
      data: { jobId, message: '공고가 성공적으로 등록되었습니다!' }
    });
  } catch (error) {
    console.error('Job posting error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '공고 등록 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// ========================================
// 커뮤니티 게시판 API
// ========================================

// 유틸리티: 시간 경과 표시
function formatTimeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  
  return new Date(timestamp * 1000).toLocaleDateString('ko-KR');
}

// 1. 게시글 목록 조회
app.get('/community/posts', async (c) => {
  try {
    const category = c.req.query('category') || 'all';
    const sort = c.req.query('sort') || 'latest';
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM posts';
    const params: any[] = [];

    if (category !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    // 정렬
    switch (sort) {
      case 'popular':
        query += ' ORDER BY likes_count DESC, created_at DESC';
        break;
      case 'views':
        query += ' ORDER BY views DESC, created_at DESC';
        break;
      default:
        query += ' ORDER BY created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    const posts = results.map((post: any) => ({
      ...post,
      timeAgo: formatTimeAgo(post.created_at),
      preview: post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content
    }));

    return c.json<ApiResponse>({
      success: true,
      data: {
        posts,
        hasMore: posts.length === limit,
        page,
        total: posts.length
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '게시글 목록 조회 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// 2. 게시글 상세 조회
app.get('/community/posts/:postId', async (c) => {
  try {
    const postId = c.req.param('postId');

    // 조회수 증가
    await c.env.DB.prepare('UPDATE posts SET views = views + 1 WHERE id = ?')
      .bind(postId).run();

    const post = await c.env.DB.prepare('SELECT * FROM posts WHERE id = ?')
      .bind(postId).first();

    if (!post) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '게시글을 찾을 수 없습니다.' 
      }, 404);
    }

    return c.json<ApiResponse>({
      success: true,
      data: {
        ...post,
        timeAgo: formatTimeAgo(post.created_at as number),
        formattedDate: new Date((post.created_at as number) * 1000).toLocaleString('ko-KR')
      }
    });
  } catch (error) {
    console.error('Get post detail error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '게시글 조회 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// 3. 게시글 작성
app.post('/community/posts', async (c) => {
  try {
    const { userId, authorName, title, content, category, isAnonymous } = await c.req.json();

    if (!title || !content) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '제목과 내용을 모두 입력해주세요.' 
      }, 400);
    }

    const postId = 'post-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
    const displayName = isAnonymous ? '익명' : (authorName || '알비사용자');
    const timestamp = Math.floor(Date.now() / 1000);

    const queries = [
      c.env.DB.prepare(`
        INSERT INTO posts (id, user_id, author_name, title, content, category, is_anonymous, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(postId, userId || null, displayName, title, content, category || 'free', 
              isAnonymous ? 1 : 0, timestamp)
    ];

    // 로그인 사용자에게만 포인트 지급
    if (userId) {
      queries.push(
        c.env.DB.prepare('UPDATE users SET albi_points = albi_points + 5 WHERE id = ?')
          .bind(userId),
        c.env.DB.prepare(`
          INSERT INTO point_transactions (user_id, amount, transaction_type, description, balance_after, created_at)
          SELECT ?, 5, 'community_post', '게시글 작성 보상', albi_points + 5, ?
          FROM users WHERE id = ?
        `).bind(userId, timestamp, userId)
      );
    }

    await c.env.DB.batch(queries);

    return c.json<ApiResponse>({
      success: true,
      data: { postId, reward: userId ? 5 : 0 }
    });
  } catch (error) {
    console.error('Create post error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '게시글 작성 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// 4. 댓글 목록 조회
app.get('/community/posts/:postId/comments', async (c) => {
  try {
    const postId = c.req.param('postId');

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM comments 
      WHERE post_id = ? 
      ORDER BY created_at ASC
    `).bind(postId).all();

    const comments = results.map((comment: any) => ({
      ...comment,
      timeAgo: formatTimeAgo(comment.created_at)
    }));

    return c.json<ApiResponse>({ 
      success: true, 
      data: comments 
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '댓글 조회 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// 5. 댓글 작성
app.post('/community/posts/:postId/comments', async (c) => {
  try {
    const postId = c.req.param('postId');
    const { userId, authorName, content, isAnonymous } = await c.req.json();

    if (!content) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '댓글 내용을 입력해주세요.' 
      }, 400);
    }

    const commentId = 'comment-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
    const displayName = isAnonymous ? '익명' : (authorName || '알비사용자');
    const timestamp = Math.floor(Date.now() / 1000);

    await c.env.DB.batch([
      c.env.DB.prepare(`
        INSERT INTO comments (id, post_id, user_id, author_name, content, is_anonymous, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(commentId, postId, userId || null, displayName, content, 
              isAnonymous ? 1 : 0, timestamp),
      c.env.DB.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?')
        .bind(postId)
    ]);

    return c.json<ApiResponse>({ 
      success: true, 
      data: { commentId } 
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '댓글 작성 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// 6. 좋아요 토글
app.post('/community/posts/:postId/like', async (c) => {
  try {
    const postId = c.req.param('postId');
    const { userId } = await c.req.json();

    if (!userId) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '로그인이 필요합니다.' 
      }, 401);
    }

    const existingLike = await c.env.DB.prepare(`
      SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?
    `).bind(postId, userId).first();

    if (existingLike) {
      // 좋아요 취소
      await c.env.DB.batch([
        c.env.DB.prepare('DELETE FROM post_likes WHERE id = ?').bind(existingLike.id),
        c.env.DB.prepare('UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?')
          .bind(postId)
      ]);
      return c.json<ApiResponse>({ 
        success: true, 
        action: 'unliked' 
      });
    } else {
      // 좋아요 추가
      const likeId = 'like-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
      const timestamp = Math.floor(Date.now() / 1000);
      
      await c.env.DB.batch([
        c.env.DB.prepare(`
          INSERT INTO post_likes (id, post_id, user_id, created_at)
          VALUES (?, ?, ?, ?)
        `).bind(likeId, postId, userId, timestamp),
        c.env.DB.prepare('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?')
          .bind(postId)
      ]);
      return c.json<ApiResponse>({ 
        success: true, 
        action: 'liked' 
      });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '좋아요 처리 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// 7. 신고하기
app.post('/community/report', async (c) => {
  try {
    const { reporterId, targetType, targetId, reason, description } = await c.req.json();

    if (!reporterId || !targetType || !targetId || !reason) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '필수 정보가 누락되었습니다.' 
      }, 400);
    }

    const reportId = 'report-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
    const timestamp = Math.floor(Date.now() / 1000);

    await c.env.DB.prepare(`
      INSERT INTO reports (id, reporter_id, target_type, target_id, reason, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(reportId, reporterId, targetType, targetId, reason, description || '', timestamp).run();

    return c.json<ApiResponse>({
      success: true,
      message: '신고가 접수되었습니다. 빠른 시일 내에 검토하겠습니다.'
    });
  } catch (error) {
    console.error('Report error:', error);
    return c.json<ApiResponse>({ 
      success: false, 
      error: '신고 처리 중 오류가 발생했습니다.' 
    }, 500);
  }
});

// ========================================
// 헬스체크 및 정보 API
// ========================================

app.get('/health', (c) => {
  return c.json<ApiResponse>({
    success: true,
    data: {
      message: 'Albi API is running! 🐜',
      timestamp: new Date().toISOString(),
      environment: c.env.ENVIRONMENT || 'development'
    }
  });
});

app.get('/info', (c) => {
  return c.json<ApiResponse>({
    success: true,
    data: {
      name: 'Albi API',
      version: '1.0.0',
      description: '알비 - 1시간 직장체험 플랫폼',
      endpoints: [
        'POST /api/chat - AI 챗봇',
        'POST /api/calculator/wage - 급여 계산',
        'GET /api/users - 사용자 목록',
        'GET /api/jobs - 구인 공고 목록',
        'GET /api/jobs/nearby - 위치 기반 공고 검색',
        'GET /api/jobs/:id - 구인 공고 상세',
        'POST /api/jobs - 구인 공고 등록',
        'POST /api/experiences - 체험 예약',
        'GET /api/referral/my-code/:userId - 내 추천 코드 조회',
        'POST /api/referral/register - 친구 추천 등록',
        'POST /api/referral/reward - 채용 성공 보상',
        'GET /api/referral/stats/:userId - 추천 통계',
        'GET /api/community/posts - 게시글 목록',
        'GET /api/community/posts/:postId - 게시글 상세',
        'POST /api/community/posts - 게시글 작성',
        'GET /api/community/posts/:postId/comments - 댓글 목록',
        'POST /api/community/posts/:postId/comments - 댓글 작성',
        'POST /api/community/posts/:postId/like - 좋아요 토글',
        'POST /api/community/report - 신고하기',
        'GET /api/health - 헬스체크',
        'GET /api/info - API 정보'
      ]
    }
  });
});

// ========================================
// 404 핸들러
// ========================================

app.notFound((c) => {
  return c.json<ApiResponse>({
    success: false,
    error: '요청하신 API 엔드포인트를 찾을 수 없습니다.'
  }, 404);
});

// ========================================
// 에러 핸들러
// ========================================

app.onError((err, c) => {
  console.error('Unhandled Error:', err);
  return c.json<ApiResponse>({
    success: false,
    error: '서버 오류가 발생했습니다.'
  }, 500);
});

// Cloudflare Pages Functions 형식으로 export
export const onRequest = handle(app);
