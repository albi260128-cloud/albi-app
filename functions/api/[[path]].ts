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
        'GET /api/jobs/:id - 구인 공고 상세',
        'POST /api/experiences - 체험 예약',
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
