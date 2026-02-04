/**
 * 🐝 알비 AI 면접 API (Phase 1 실전)
 * AlbiInterviewEngine 통합 버전
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/cloudflare-pages';

// AlbiInterviewEngine 동적 import를 위한 타입
interface InterviewEngine {
  startInterview(): any;
  processAnswer(answer: string): Promise<any>;
  getContext(): any;
}

interface Env {
  DB: D1Database;
  KV?: KVNamespace;
}

// Hono 앱 생성 (basePath 제거 - Cloudflare Pages Functions가 자동으로 /api/interview에 매핑함)
const app = new Hono<{ Bindings: Env }>();

// CORS 설정
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// 면접 세션 저장소 (실전에서는 KV 또는 D1 사용)
const interviewSessions = new Map<string, {
  engine: any;
  userId: string;
  jobType: string;
  region: string;
  expectedWage: number;
  createdAt: string;
  lastActivity: string;
}>();

/**
 * POST /api/interview/start
 * 면접 시작
 */
app.post('/start', async (c) => {
  try {
    const body = await c.req.json();
    const { 
      userId = 'anonymous-' + Date.now(), 
      jobType = 'cafe',
      region = '서울',
      expectedWage = 10000
    } = body;

    // 유효성 검증
    const validJobTypes = ['cafe', 'cvs', 'restaurant', 'retail', 'fastfood'];
    if (!validJobTypes.includes(jobType)) {
      return c.json({
        success: false,
        error: '유효하지 않은 업종입니다. (cafe, cvs, restaurant, retail, fastfood)'
      }, 400);
    }

    // AlbiInterviewEngine 인스턴스 생성
    const { default: AlbiInterviewEngine } = await import('../../src/albi-interview-engine');
    const engine = new AlbiInterviewEngine(jobType, region, expectedWage);

    // 면접 시작
    const response = engine.startInterview();

    // 세션 저장
    const sessionKey = userId;
    interviewSessions.set(sessionKey, {
      engine,
      userId,
      jobType,
      region,
      expectedWage,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    });

    return c.json({
      success: true,
      data: {
        sessionId: sessionKey,
        ...response
      }
    });

  } catch (error: any) {
    console.error('Interview Start Error:', error);
    return c.json({
      success: false,
      error: error?.message || '면접 시작 중 오류가 발생했습니다.'
    }, 500);
  }
});

/**
 * POST /api/interview/answer
 * 답변 제출 및 다음 질문 생성
 */
app.post('/answer', async (c) => {
  try {
    const body = await c.req.json();
    const { 
      userId = 'anonymous', 
      answer 
    } = body;

    if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
      return c.json({
        success: false,
        error: '답변을 입력해주세요.'
      }, 400);
    }

    // 세션 확인
    const sessionKey = userId;
    const session = interviewSessions.get(sessionKey);

    if (!session) {
      return c.json({
        success: false,
        error: '면접 세션이 만료되었습니다. 다시 시작해주세요.'
      }, 404);
    }

    // 세션 활성 시간 업데이트
    session.lastActivity = new Date().toISOString();

    // 답변 처리
    const response = await session.engine.processAnswer(answer.trim());

    // 면접 완료 시 세션 삭제 (옵션)
    if (response.status === 'completed' || response.status === 'rejected') {
      // D1에 결과 저장 (옵션)
      if (c.env.DB && response.result) {
        try {
          await c.env.DB.prepare(`
            INSERT INTO interview_results (
              interview_id, user_id, job_type, final_grade, total_score,
              reliability_score, job_fit_score, service_mind_score, logistics_score,
              recommendation, one_liner, strengths, concerns,
              critical_fail, critical_reason, interview_duration, question_count,
              created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch())
          `).bind(
            response.result.interview_id,
            userId,
            response.result.job_type,
            response.result.final_grade,
            response.result.total_score,
            response.result.scores.reliability,
            response.result.scores.job_fit,
            response.result.scores.service_mind,
            response.result.scores.logistics,
            response.result.recommendation,
            response.result.one_liner,
            JSON.stringify(response.result.strengths),
            JSON.stringify(response.result.concerns),
            response.result.critical_fail ? 1 : 0,
            response.result.critical_reason || '',
            response.result.interview_duration,
            response.result.question_count
          ).run();
        } catch (dbError) {
          console.error('Failed to save interview result to DB:', dbError);
          // DB 저장 실패해도 응답은 정상 반환
        }
      }

      // 세션 삭제 (30분 후 자동 삭제 대신)
      // interviewSessions.delete(sessionKey);
    }

    return c.json({
      success: true,
      data: response
    });

  } catch (error: any) {
    console.error('Interview Answer Error:', error);
    return c.json({
      success: false,
      error: error?.message || '답변 처리 중 오류가 발생했습니다.'
    }, 500);
  }
});

/**
 * GET /api/interview/status/:userId
 * 면접 진행 상태 조회
 */
app.get('/status/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const session = interviewSessions.get(userId);

    if (!session) {
      return c.json({
        success: false,
        error: '면접 세션을 찾을 수 없습니다.'
      }, 404);
    }

    const context = session.engine.getContext();

    return c.json({
      success: true,
      data: {
        userId: session.userId,
        jobType: session.jobType,
        region: session.region,
        expectedWage: session.expectedWage,
        questionCount: context.question_count,
        currentScores: context.current_scores,
        criticalFlags: context.critical_flags,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity
      }
    });

  } catch (error: any) {
    console.error('Interview Status Error:', error);
    return c.json({
      success: false,
      error: error?.message || '상태 조회 중 오류가 발생했습니다.'
    }, 500);
  }
});

/**
 * GET /api/interview/results/:interviewId
 * 면접 결과 조회 (D1에서)
 */
app.get('/results/:interviewId', async (c) => {
  try {
    const interviewId = c.req.param('interviewId');

    if (!c.env.DB) {
      return c.json({
        success: false,
        error: 'Database not configured'
      }, 503);
    }

    const result = await c.env.DB.prepare(`
      SELECT * FROM interview_results WHERE interview_id = ?
    `).bind(interviewId).first();

    if (!result) {
      return c.json({
        success: false,
        error: '면접 결과를 찾을 수 없습니다.'
      }, 404);
    }

    // JSON 필드 파싱
    const parsedResult = {
      ...result,
      strengths: JSON.parse(result.strengths as string || '[]'),
      concerns: JSON.parse(result.concerns as string || '[]')
    };

    return c.json({
      success: true,
      data: parsedResult
    });

  } catch (error: any) {
    console.error('Interview Results Error:', error);
    return c.json({
      success: false,
      error: error?.message || '결과 조회 중 오류가 발생했습니다.'
    }, 500);
  }
});

/**
 * DELETE /api/interview/session/:userId
 * 면접 세션 종료
 */
app.delete('/session/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const deleted = interviewSessions.delete(userId);

    return c.json({
      success: true,
      data: {
        message: deleted ? '세션이 종료되었습니다.' : '세션을 찾을 수 없습니다.',
        deleted
      }
    });

  } catch (error: any) {
    console.error('Delete Session Error:', error);
    return c.json({
      success: false,
      error: error?.message || '세션 종료 중 오류가 발생했습니다.'
    }, 500);
  }
});

/**
 * GET /api/interview/health
 * 헬스체크
 */
app.get('/health', (c) => {
  return c.json({
    success: true,
    data: {
      message: 'Albi Interview API is running! 🐝',
      activeSessions: interviewSessions.size,
      timestamp: new Date().toISOString()
    }
  });
});

// 404 핸들러
app.notFound((c) => {
  return c.json({
    success: false,
    error: '요청하신 API 엔드포인트를 찾을 수 없습니다.'
  }, 404);
});

// 에러 핸들러
app.onError((err, c) => {
  console.error('Unhandled Error:', err);
  return c.json({
    success: false,
    error: '서버 오류가 발생했습니다.'
  }, 500);
});

// Cloudflare Pages Functions 형식으로 export
export const onRequest = handle(app);
