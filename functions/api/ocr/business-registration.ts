/**
 * 사업자등록증 OCR API
 * 
 * POST /api/ocr/business-registration
 * 
 * Request Body: FormData
 * - file: 사업자등록증 이미지 또는 PDF
 * 
 * Response:
 * {
 *   "success": true,
 *   "businessNumber": "123-45-67890",
 *   "businessName": "주식회사 알비",
 *   "confidence": 0.95
 * }
 * 
 * 실제 프로덕션에서는 Google Vision API 또는 Naver Clova OCR 연동
 */

interface Env {
  GOOGLE_VISION_API_KEY?: string;
  NAVER_CLOVA_OCR_URL?: string;
  NAVER_CLOVA_SECRET?: string;
}

interface OCRResult {
  businessNumber: string;
  businessName: string;
  confidence: number;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    // FormData 파싱
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

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

    // 파일 크기 검증 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '파일 크기는 10MB 이하여야 합니다.'
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
          error: '이미지 또는 PDF 파일만 가능합니다.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('🔍 OCR 요청:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    let ocrResult: OCRResult | null = null;

    // ============================================================
    // 프로덕션: Google Vision API 또는 Naver Clova OCR
    // ============================================================
    
    // Option 1: Google Vision API
    if (env.GOOGLE_VISION_API_KEY && false) { // TODO: 활성화 시 false 제거
      try {
        const fileBuffer = await file.arrayBuffer();
        const base64Image = btoa(
          String.fromCharCode(...new Uint8Array(fileBuffer))
        );

        const visionResponse = await fetch(
          `https://vision.googleapis.com/v1/images:annotate?key=${env.GOOGLE_VISION_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              requests: [
                {
                  image: {
                    content: base64Image
                  },
                  features: [
                    {
                      type: 'TEXT_DETECTION',
                      maxResults: 10
                    }
                  ]
                }
              ]
            })
          }
        );

        const visionData = await visionResponse.json();
        console.log('📥 Google Vision 응답:', visionData);

        if (visionData.responses && visionData.responses[0].textAnnotations) {
          const text = visionData.responses[0].textAnnotations[0].description;
          ocrResult = extractBusinessInfo(text);
          console.log('✅ Google Vision OCR 성공:', ocrResult);
        }
      } catch (error) {
        console.error('❌ Google Vision OCR 오류:', error);
      }
    }

    // Option 2: Naver Clova OCR
    if (!ocrResult && env.NAVER_CLOVA_OCR_URL && env.NAVER_CLOVA_SECRET && false) { // TODO: 활성화 시 false 제거
      try {
        const fileBuffer = await file.arrayBuffer();
        
        const clovaFormData = new FormData();
        clovaFormData.append('file', new Blob([fileBuffer], { type: file.type }), file.name);
        clovaFormData.append('message', JSON.stringify({
          version: 'V2',
          requestId: `ocr_${Date.now()}`,
          timestamp: Date.now(),
          images: [
            {
              format: file.type.split('/')[1],
              name: file.name
            }
          ]
        }));

        const clovaResponse = await fetch(env.NAVER_CLOVA_OCR_URL, {
          method: 'POST',
          headers: {
            'X-OCR-SECRET': env.NAVER_CLOVA_SECRET
          },
          body: clovaFormData
        });

        const clovaData = await clovaResponse.json();
        console.log('📥 Naver Clova 응답:', clovaData);

        if (clovaData.images && clovaData.images[0].fields) {
          const fields = clovaData.images[0].fields;
          const text = fields.map((f: any) => f.inferText).join(' ');
          ocrResult = extractBusinessInfo(text);
          console.log('✅ Naver Clova OCR 성공:', ocrResult);
        }
      } catch (error) {
        console.error('❌ Naver Clova OCR 오류:', error);
      }
    }

    // ============================================================
    // 개발 환경: Mock OCR 결과
    // ============================================================
    if (!ocrResult) {
      console.log('========================================');
      console.log('🔍 [개발 모드] OCR 시뮬레이션');
      console.log('========================================');
      console.log(`파일명: ${file.name}`);
      console.log(`크기: ${(file.size / 1024).toFixed(2)} KB`);
      console.log('========================================');

      // Mock 데이터 생성
      ocrResult = {
        businessNumber: '123-45-67890',
        businessName: '주식회사 알비',
        confidence: 0.95
      };

      console.log('✅ Mock OCR 결과:', ocrResult);
    }

    return new Response(
      JSON.stringify({
        success: true,
        businessNumber: ocrResult.businessNumber,
        businessName: ocrResult.businessName,
        confidence: ocrResult.confidence,
        message: '사업자등록증 정보를 인식했습니다.'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('❌ OCR 처리 오류:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'OCR 처리 중 오류가 발생했습니다.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * 텍스트에서 사업자등록번호와 상호명 추출
 */
function extractBusinessInfo(text: string): OCRResult {
  // 사업자등록번호 패턴: XXX-XX-XXXXX
  const businessNumberPattern = /(\d{3}[-\s]?\d{2}[-\s]?\d{5})/;
  const businessNumberMatch = text.match(businessNumberPattern);
  
  let businessNumber = '000-00-00000';
  if (businessNumberMatch) {
    businessNumber = businessNumberMatch[1].replace(/\s/g, '-');
  }

  // 상호명 추출 (간단한 패턴 매칭)
  // "상호", "법인명", "회사명" 등의 키워드 근처에서 찾기
  const businessNamePattern = /(상호|법인명|회사명|상\s*호)\s*[:：]?\s*([^\n]{2,30})/;
  const businessNameMatch = text.match(businessNamePattern);
  
  let businessName = '알비';
  if (businessNameMatch) {
    businessName = businessNameMatch[2].trim();
  }

  return {
    businessNumber,
    businessName,
    confidence: 0.85
  };
}
