/**
 * PASS 앱 본인인증 API
 * 
 * POST /api/auth/pass-verify
 * 
 * Request Body:
 * {
 *   "name": "홍길동",
 *   "phone": "01012345678",
 *   "carrier": "SKT",
 *   "birthDate": "19900101",
 *   "gender": "M"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "verificationToken": "pass_token_xxx",
 *   "message": "PASS 인증이 완료되었습니다."
 * }
 * 
 * 실제 프로덕션에서는 NICE 또는 KCB PASS 인증 서비스 연동 필요
 */

interface Env {
  DB: D1Database;
  NICE_API_KEY?: string;
  NICE_API_SECRET?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const body = await request.json() as {
      name: string;
      phone: string;
      carrier: string;
      birthDate: string;
      gender: string;
    };

    const { name, phone, carrier, birthDate, gender } = body;

    // 입력값 검증
    if (!name || !phone || !carrier || !birthDate || !gender) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '모든 정보를 입력해주세요.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 전화번호 형식 검증
    const cleanPhone = phone.replace(/-/g, '');
    if (!/^01[0-9]{8,9}$/.test(cleanPhone)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '올바른 휴대폰 번호 형식이 아닙니다.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 생년월일 검증
    if (!/^[0-9]{8}$/.test(birthDate)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '생년월일은 8자리 숫자여야 합니다. (예: 19900101)'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 성별 검증
    if (!['M', 'F'].includes(gender)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '성별을 선택해주세요.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('🔐 PASS 인증 요청:', {
      name,
      phone: cleanPhone,
      carrier,
      birthDate,
      gender
    });

    // ============================================================
    // 실제 프로덕션: NICE PASS 또는 KCB PASS 인증
    // ============================================================
    let passSuccess = false;
    let passError = null;

    if (env.NICE_API_KEY && env.NICE_API_SECRET) {
      try {
        // NICE PASS API 호출 예시
        // 실제 구현 시 NICE API 문서 참고
        // https://www.nicepass.co.kr/
        
        /*
        const niceResponse = await fetch('https://nice-pass-api-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.NICE_API_KEY}`
          },
          body: JSON.stringify({
            name,
            phone: cleanPhone,
            birthDate,
            gender
          })
        });

        const niceData = await niceResponse.json();
        
        if (niceResponse.ok && niceData.success) {
          passSuccess = true;
          console.log('✅ NICE PASS 인증 성공');
        } else {
          passError = niceData;
          console.error('❌ NICE PASS 인증 실패:', niceData);
        }
        */
        
        console.log('⚠️ NICE PASS API 연동 코드 미구현 (개발 모드로 진행)');
      } catch (error) {
        passError = error;
        console.error('❌ NICE PASS API 호출 오류:', error);
      }
    } else {
      console.log('⚠️ NICE PASS API 키가 설정되지 않았습니다. 개발 모드로 작동합니다.');
    }

    // ============================================================
    // 개발 환경: Mock PASS 인증
    // ============================================================
    console.log('========================================');
    console.log('🔐 [개발 모드] PASS 인증 시뮬레이션');
    console.log('========================================');
    console.log(`이름: ${name}`);
    console.log(`휴대폰: ${cleanPhone}`);
    console.log(`통신사: ${carrier}`);
    console.log(`생년월일: ${birthDate}`);
    console.log(`성별: ${gender}`);
    console.log('========================================');

    // 인증 토큰 생성
    const verificationToken = `pass_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // D1 데이터베이스에 인증 정보 저장 (30분 유효)
    try {
      // pass_verifications 테이블에 저장
      // 테이블이 없으면 에러가 발생할 수 있지만, 회원가입 시 토큰만 필요하므로 무시
      await env.DB.prepare(`
        INSERT INTO pass_verifications 
        (phone, name, carrier, birth_date, gender, verification_token, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+30 minutes'), datetime('now'))
      `).bind(cleanPhone, name, carrier, birthDate, gender, verificationToken).run();

      console.log('✅ PASS 인증 정보가 DB에 저장되었습니다.');
    } catch (dbError) {
      console.error('⚠️ DB 저장 실패 (테이블이 없을 수 있음):', dbError);
      // DB 저장 실패해도 인증 토큰은 반환
    }

    // 성공 응답
    return new Response(
      JSON.stringify({
        success: true,
        verificationToken: verificationToken,
        name: name,
        phone: cleanPhone,
        carrier: carrier,
        birthDate: birthDate,
        gender: gender,
        message: passSuccess 
          ? 'PASS 인증이 완료되었습니다.'
          : 'PASS 인증이 완료되었습니다. (개발 모드)',
        passVerified: !passSuccess ? false : true // 실제 PASS 인증 여부
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('❌ PASS 인증 오류:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'PASS 인증 중 오류가 발생했습니다.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
