/**
 * SMS 인증번호 발송 API
 * 
 * POST /api/sms/send
 * 
 * Request Body:
 * {
 *   "name": "홍길동",
 *   "phone": "01012345678"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "verificationCode": "123456",  // 개발 환경에서만 반환
 *   "message": "인증번호가 발송되었습니다."
 * }
 * 
 * 실제 프로덕션에서는 SMS 서비스(Coolsms, Aligo 등) 연동 필요
 */

interface Env {
  DB: D1Database;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const body = await request.json() as { name: string; phone: string };
    const { name, phone } = body;

    // 입력값 검증
    if (!name || !phone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '이름과 휴대폰번호를 입력해주세요.'
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

    // 인증번호 생성 (6자리)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    console.log('📱 SMS 인증번호 생성:', {
      name,
      phone: cleanPhone,
      code: verificationCode
    });

    // ============================================================
    // 실제 프로덕션에서는 여기에 SMS 발송 API 호출 추가
    // ============================================================
    // 
    // 예시 1: Coolsms (https://coolsms.co.kr)
    // const coolsms = require('coolsms-node-sdk').default;
    // const messageService = new coolsms(API_KEY, API_SECRET);
    // await messageService.sendOne({
    //   to: cleanPhone,
    //   from: '발신번호',
    //   text: `[알비] 인증번호는 [${verificationCode}] 입니다.`
    // });
    //
    // 예시 2: Aligo (https://smartsms.aligo.in)
    // await fetch('https://apis.aligo.in/send/', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     key: API_KEY,
    //     user_id: USER_ID,
    //     sender: '발신번호',
    //     receiver: cleanPhone,
    //     msg: `[알비] 인증번호는 [${verificationCode}] 입니다.`,
    //     testmode_yn: 'N'
    //   })
    // });
    //
    // 예시 3: NHN Cloud SMS
    // await fetch(`https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${APP_KEY}/sender/sms`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Secret-Key': SECRET_KEY
    //   },
    //   body: JSON.stringify({
    //     body: `[알비] 인증번호는 [${verificationCode}] 입니다.`,
    //     sendNo: '발신번호',
    //     recipientList: [{ recipientNo: cleanPhone }]
    //   })
    // });

    // 개발 환경: 콘솔 로그 출력
    console.log('========================================');
    console.log('📱 [개발 모드] SMS 발송 시뮬레이션');
    console.log('========================================');
    console.log(`수신자: ${name} (${cleanPhone})`);
    console.log(`인증번호: ${verificationCode}`);
    console.log('========================================');

    // D1 데이터베이스에 인증 정보 저장 (5분 유효)
    try {
      await env.DB.prepare(`
        INSERT INTO sms_verifications (phone, code, name, expires_at, created_at)
        VALUES (?, ?, ?, datetime('now', '+5 minutes'), datetime('now'))
      `).bind(cleanPhone, verificationCode, name).run();

      console.log('✅ 인증번호가 DB에 저장되었습니다.');
    } catch (dbError) {
      console.error('⚠️ DB 저장 실패 (테이블이 없을 수 있음):', dbError);
      // DB 저장 실패해도 인증번호는 반환
    }

    // 개발 환경에서는 인증번호를 응답에 포함 (실제 환경에서는 제거)
    const isDevelopment = true; // 실제 프로덕션에서는 false로 변경

    return new Response(
      JSON.stringify({
        success: true,
        verificationCode: isDevelopment ? verificationCode : undefined,
        message: '인증번호가 발송되었습니다. (개발 모드: 위 코드를 입력하세요)'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('❌ SMS 발송 오류:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'SMS 발송 중 오류가 발생했습니다.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
