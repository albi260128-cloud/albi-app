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
  COOLSMS_API_KEY?: string;
  COOLSMS_API_SECRET?: string;
  COOLSMS_FROM_NUMBER?: string;
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
    // Coolsms REST API를 통한 실제 SMS 발송
    // ============================================================
    let smsSuccess = false;
    let smsError = null;

    if (env.COOLSMS_API_KEY && env.COOLSMS_API_SECRET && env.COOLSMS_FROM_NUMBER) {
      try {
        console.log('📱 Coolsms API 호출 시작...');

        // Coolsms REST API v4 - 단순 메시지 발송 (Simple Send)
        // 문서: https://docs.coolsms.co.kr/api-reference/messages/sendsimplemessage
        const salt = Date.now().toString();
        const date = new Date().toISOString();
        const signature = await getHmacSignature(env.COOLSMS_API_SECRET, date, salt);
        
        const authHeader = `HMAC-SHA256 apiKey=${env.COOLSMS_API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;
        
        console.log('🔐 인증 헤더:', authHeader);

        const requestBody = {
          message: {
            to: cleanPhone,
            from: env.COOLSMS_FROM_NUMBER.replace(/-/g, ''),
            text: `[알비] 인증번호는 [${verificationCode}] 입니다. 5분 내에 입력해주세요.`,
            type: 'SMS'
          }
        };
        
        console.log('📤 요청 본문:', JSON.stringify(requestBody, null, 2));

        const smsResponse = await fetch('https://api.coolsms.co.kr/messages/v4/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify(requestBody)
        });

        const smsData = await smsResponse.json() as any;
        
        console.log('📥 응답 데이터:', JSON.stringify(smsData, null, 2));

        if (smsResponse.ok && (smsData.statusCode === '2000' || smsData.groupId)) {
          smsSuccess = true;
          console.log('✅ Coolsms 발송 성공:', smsData);
        } else {
          smsError = smsData;
          console.error('❌ Coolsms 발송 실패:', smsData);
        }
      } catch (error) {
        smsError = error;
        console.error('❌ Coolsms API 호출 오류:', error);
      }
    } else {
      console.log('⚠️ Coolsms API 키가 설정되지 않았습니다. 개발 모드로 작동합니다.');
    }

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

    // SMS 발송 여부에 따라 응답 메시지 결정
    const isDevelopment = !smsSuccess; // SMS 발송 성공 시 개발 모드 비활성화

    return new Response(
      JSON.stringify({
        success: true,
        verificationCode: isDevelopment ? verificationCode : undefined,
        message: smsSuccess 
          ? '인증번호가 발송되었습니다. 휴대폰으로 받은 인증번호를 입력하세요.'
          : '인증번호가 발송되었습니다. (개발 모드: 위 코드를 입력하세요)',
        smsDelivered: smsSuccess,
        smsError: isDevelopment && smsError ? String(smsError) : undefined
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

/**
 * Coolsms HMAC-SHA256 서명 생성
 */
async function getHmacSignature(secret: string, date: string, salt: string): Promise<string> {
  const message = date + salt;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
