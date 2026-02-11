/**
 * 구인자 인증 요청 API
 * 
 * POST /api/employer/request-verification
 * 
 * Request Body:
 * {
 *   "businessNumber": "123-45-67890",
 *   "businessName": "주식회사 알비",
 *   "businessRegistrationFile": File
 * }
 * 
 * 마이페이지에서 구직자가 구인자로 업그레이드 요청
 */

interface Env {
  DB: D1Database;
  R2?: R2Bucket;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    // 세션에서 사용자 정보 가져오기 (실제 구현 시 JWT 등으로 인증)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '로그인이 필요합니다.'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // FormData 파싱
    const formData = await request.formData();
    const businessNumber = formData.get('businessNumber') as string;
    const businessName = formData.get('businessName') as string;
    const file = formData.get('businessRegistrationFile') as File | null;

    // 입력값 검증
    if (!businessNumber || !businessName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '사업자등록번호와 상호명을 입력해주세요.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 파일 업로드 (선택사항)
    let fileUrl = null;
    if (file) {
      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return new Response(
          JSON.stringify({
            success: false,
            error: '파일 크기는 5MB 이하만 가능합니다.'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // 파일 타입 검증
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'JPG 또는 PNG 이미지 파일만 가능합니다.'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // 파일명 생성
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const extension = file.name.split('.').pop();
      const fileName = `business_reg_${timestamp}_${random}.${extension}`;

      // R2에 업로드 (프로덕션)
      if (env.R2) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          await env.R2.put(`business-registrations/${fileName}`, arrayBuffer, {
            httpMetadata: {
              contentType: file.type
            },
            customMetadata: {
              businessNumber,
              businessName,
              uploadedAt: new Date().toISOString()
            }
          });
          fileUrl = `https://your-r2-bucket.com/business-registrations/${fileName}`;
          console.log('✅ R2 업로드 성공:', fileUrl);
        } catch (error) {
          console.error('❌ R2 업로드 실패:', error);
        }
      }

      // R2가 없으면 Mock URL
      if (!fileUrl) {
        fileUrl = `/uploads/business-registrations/${fileName}`;
        console.log('⚠️ 개발 모드: Mock URL 사용');
      }
    }

    // 임시 user_id (실제로는 세션에서 가져와야 함)
    const userId = 'temp_user_id'; // TODO: 실제 인증 구현

    // 기존 요청이 있는지 확인
    const existingRequest = await env.DB.prepare(`
      SELECT id, status FROM employer_verification_requests
      WHERE user_id = ? AND status = 'pending'
      ORDER BY requested_at DESC
      LIMIT 1
    `).bind(userId).first();

    if (existingRequest) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '이미 심사 중인 요청이 있습니다.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 구인자 인증 요청 저장
    const result = await env.DB.prepare(`
      INSERT INTO employer_verification_requests
      (user_id, business_registration_number, business_name, business_registration_file_url, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).bind(userId, businessNumber, businessName, fileUrl).run();

    console.log('✅ 구인자 인증 요청 생성:', result.meta.last_row_id);

    return new Response(
      JSON.stringify({
        success: true,
        requestId: result.meta.last_row_id,
        message: '구인자 인증 요청이 접수되었습니다. 관리자 승인 후 구인 공고를 등록할 수 있습니다.'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('❌ 구인자 인증 요청 오류:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: '구인자 인증 요청 중 오류가 발생했습니다.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
