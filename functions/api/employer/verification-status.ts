/**
 * 구인자 인증 상태 조회 API
 * GET /api/employer/verification-status
 */

export async function onRequestGet(context: any) {
  try {
    const { request, env } = context;
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '인증이 필요합니다.' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sessionToken = authHeader.substring(7);

    // 세션 확인
    const sessionStmt = env.DB.prepare(
      'SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > datetime("now")'
    );
    const session = await sessionStmt.bind(sessionToken).first();

    if (!session) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '유효하지 않은 세션입니다.' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = session.user_id;

    // 사용자의 사업자 인증 상태 확인
    const userStmt = env.DB.prepare(
      'SELECT business_registration_verified FROM users WHERE id = ?'
    );
    const user = await userStmt.bind(userId).first();

    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '사용자를 찾을 수 없습니다.' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 이미 인증된 경우
    if (user.business_registration_verified === 1) {
      return new Response(JSON.stringify({ 
        success: true,
        status: 'approved',
        message: '이미 인증된 사용자입니다.'
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 인증 요청 상태 확인
    const requestStmt = env.DB.prepare(`
      SELECT status, rejection_reason, created_at
      FROM employer_verification_requests
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `);
    const verificationRequest = await requestStmt.bind(userId).first();

    if (verificationRequest) {
      return new Response(JSON.stringify({ 
        success: true,
        status: verificationRequest.status,
        rejection_reason: verificationRequest.rejection_reason,
        requested_at: verificationRequest.created_at
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 아직 신청하지 않음
    return new Response(JSON.stringify({ 
      success: true,
      status: 'none',
      message: '아직 인증 신청을 하지 않았습니다.'
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('구인자 인증 상태 조회 오류:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '서버 오류가 발생했습니다.' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
