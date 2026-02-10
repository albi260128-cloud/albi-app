/**
 * 사업자등록증 업로드 API
 * 
 * POST /api/upload/business-registration
 * 
 * Request Body: FormData
 * - file: 사업자등록증 파일 (이미지 또는 PDF)
 * - businessNumber: 사업자등록번호
 * - businessName: 사업자명
 * 
 * Response:
 * {
 *   "success": true,
 *   "fileUrl": "https://.../ .jpg",
 *   "fileName": "business_reg_xxx.jpg",
 *   "message": "사업자등록증이 업로드되었습니다."
 * }
 * 
 * 실제 프로덕션에서는 Cloudflare R2 Storage에 저장
 */

interface Env {
  R2?: R2Bucket;
  DB: D1Database;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    // FormData 파싱
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const businessNumber = formData.get('businessNumber') as string;
    const businessName = formData.get('businessName') as string;

    // 입력값 검증
    if (!file) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '파일을 선택해주세요.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!businessNumber || !businessName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '사업자등록번호와 사업자명을 입력해주세요.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '파일 크기는 5MB 이하여야 합니다.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 파일 타입 검증
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf'
    ];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '지원하는 파일 형식: JPG, PNG, PDF'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('📄 사업자등록증 업로드 요청:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      businessNumber,
      businessName
    });

    // 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = `business_reg_${timestamp}_${randomStr}.${fileExt}`;

    // ============================================================
    // 실제 프로덕션: Cloudflare R2에 업로드
    // ============================================================
    if (env.R2) {
      try {
        // 파일을 ArrayBuffer로 변환
        const fileBuffer = await file.arrayBuffer();

        // R2에 업로드
        await env.R2.put(`business-registrations/${fileName}`, fileBuffer, {
          httpMetadata: {
            contentType: file.type
          },
          customMetadata: {
            businessNumber: businessNumber,
            businessName: businessName,
            uploadedAt: new Date().toISOString()
          }
        });

        // R2 Public URL 생성
        const fileUrl = `https://your-r2-bucket.com/business-registrations/${fileName}`;

        console.log('✅ R2 업로드 성공:', fileUrl);

        // D1 데이터베이스에 업로드 정보 저장
        try {
          await env.DB.prepare(`
            INSERT INTO business_registrations 
            (business_number, business_name, file_url, file_name, uploaded_at)
            VALUES (?, ?, ?, ?, datetime('now'))
          `).bind(businessNumber, businessName, fileUrl, fileName).run();

          console.log('✅ DB 저장 완료');
        } catch (dbError) {
          console.error('⚠️ DB 저장 실패:', dbError);
        }

        return new Response(
          JSON.stringify({
            success: true,
            fileUrl: fileUrl,
            fileName: fileName,
            message: '사업자등록증이 업로드되었습니다.'
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      } catch (r2Error) {
        console.error('❌ R2 업로드 오류:', r2Error);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'R2 업로드 중 오류가 발생했습니다.'
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // ============================================================
    // 개발 환경: Mock 응답 (R2 미설정 시)
    // ============================================================
    console.log('========================================');
    console.log('📄 [개발 모드] 파일 업로드 시뮬레이션');
    console.log('========================================');
    console.log(`파일명: ${file.name}`);
    console.log(`크기: ${(file.size / 1024).toFixed(2)} KB`);
    console.log(`타입: ${file.type}`);
    console.log(`사업자번호: ${businessNumber}`);
    console.log(`사업자명: ${businessName}`);
    console.log('========================================');

    // Mock URL 생성
    const mockFileUrl = `/uploads/business-registrations/${fileName}`;

    // D1에 정보만 저장 (실제 파일은 저장되지 않음)
    try {
      await env.DB.prepare(`
        INSERT INTO business_registrations 
        (business_number, business_name, file_url, file_name, uploaded_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(businessNumber, businessName, mockFileUrl, fileName).run();

      console.log('✅ DB 저장 완료 (Mock URL)');
    } catch (dbError) {
      console.error('⚠️ DB 저장 실패 (테이블이 없을 수 있음):', dbError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        fileUrl: mockFileUrl,
        fileName: fileName,
        message: '사업자등록증이 업로드되었습니다. (개발 모드: 실제 파일은 저장되지 않음)'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('❌ 파일 업로드 오류:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: '파일 업로드 중 오류가 발생했습니다.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
