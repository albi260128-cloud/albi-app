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
// AI 챗봇 API
// ========================================

app.post('/chat', async (c) => {
  try {
    const body = await c.req.json();
    const { message, userType = 'jobseeker' } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '메시지를 입력해주세요.' 
      }, 400);
    }

    const systemPrompts = {
      jobseeker: `당신은 알비(ALBI)의 친근한 AI 면접관입니다. 🐜
구직자와 대화하며 다음 정보를 자연스럽게 수집하세요:
1. 선호하는 알바 업종 (카페, 편의점, 음식점 등)
2. 과거 알바 경험
3. 희망 시급과 근무 시간대
4. 성격의 장단점

대화 규칙:
- 한 번에 1-2개 질문만 하세요
- 친근하게 존댓말을 사용하세요
- 🐜 이모지를 적절히 사용하세요
- 50자 이내로 간결하게 답변하세요`,

      employer: `당신은 알비(ALBI)의 전문 AI 컨설턴트입니다. 🐜
구인자와 대화하며 다음 정보를 수집하세요:
1. 사업장 정보 (업종, 위치, 규모)
2. 필요한 인재상
3. 근무 조건
4. 업무 내용

전문적이지만 친근하게 대화하고, 50자 이내로 답변하세요.`
    };

    const systemPrompt = systemPrompts[userType as keyof typeof systemPrompts] || systemPrompts.jobseeker;

    // 임시: AI 기능 비활성화 (프로덕션 배포용)
    // TODO: Cloudflare Dashboard에서 Workers AI 바인딩 설정 후 활성화
    let aiMessage = '';
    
    if (c.env.AI) {
      // Workers AI가 사용 가능한 경우 (로컬 개발 환경)
      try {
        const response = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 256,
          temperature: 0.7,
        });

        // 응답 파싱
        if (response && typeof response === 'object') {
          if ('response' in response && typeof response.response === 'string') {
            aiMessage = response.response;
          } else if ('content' in response && typeof response.content === 'string') {
            aiMessage = response.content;
          }
        } else if (typeof response === 'string') {
          aiMessage = response;
        }
      } catch (error) {
        console.error('AI Error:', error);
      }
    }
    
    // AI를 사용할 수 없는 경우 기본 응답
    if (!aiMessage) {
      if (userType === 'jobseeker') {
        aiMessage = '안녕하세요! 알비입니다 🐜\n\n어떤 종류의 알바를 찾고 계신가요? 카페, 편의점, 음식점 등 편하게 말씀해주세요!';
      } else {
        aiMessage = '안녕하세요! 알비입니다 🐜\n\n어떤 업종에서 인재를 찾고 계신가요? 필요하신 조건을 알려주세요!';
      }
    }

    return c.json<ApiResponse>({
      success: true,
      data: {
        role: 'assistant',
        content: aiMessage.trim()
      }
    });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error?.message || '죄송합니다. 일시적인 오류가 발생했습니다. 🐜'
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

    const jobId = 'job-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
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
