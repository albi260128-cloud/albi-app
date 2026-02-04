/**
 * AlbiInterviewEngine을 사용하는 /api/chat 핸들러
 * 기존 [[path]].ts의 app.post('/chat') 부분을 이 코드로 교체
 */

export const chatHandlerWithEngine = `
app.post('/chat', async (c) => {
  try {
    const body = await c.req.json();
    const { message, userType = 'jobseeker', userId = 'anonymous', jobType = 'cafe', region = '서울', expectedWage = 10000 } = body;

    // 구직자 면접만 처리
    if (userType !== 'jobseeker') {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '현재는 구직자 면접만 지원합니다.' 
      }, 400);
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return c.json<ApiResponse>({ 
        success: false, 
        error: '메시지를 입력해주세요.' 
      }, 400);
    }

    // AlbiInterviewEngine 통합
    const sessionKey = \`\${userId}_\${jobType}\`;
    
    try {
      // 새 세션 시작
      if (!interviewSessions.has(sessionKey)) {
        // 업종 유효성 검증
        const validJobTypes = ['cafe', 'cvs', 'restaurant', 'retail', 'fastfood'];
        if (!validJobTypes.includes(jobType)) {
          return c.json<ApiResponse>({
            success: false,
            error: '유효하지 않은 업종입니다. (cafe, cvs, restaurant, retail, fastfood)'
          }, 400);
        }

        // AlbiInterviewEngine 동적 import
        const AlbiInterviewEngine = (await import('../../src/albi-interview-engine')).default;
        const engine = new AlbiInterviewEngine(jobType, region, expectedWage);

        // 면접 시작
        const response = engine.startInterview();

        // 세션 저장
        interviewSessions.set(sessionKey, {
          engine,
          userId,
          userType,
          jobType,
          region,
          expectedWage,
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        });

        return c.json<ApiResponse>({
          success: true,
          data: {
            role: 'assistant',
            content: response.message + '\\n\\n' + response.question,
            sessionData: {
              status: response.status,
              progress: response.progress,
              jobType: jobType
            }
          }
        });
      }

      // 기존 세션에서 답변 처리
      const session = interviewSessions.get(sessionKey);
      if (!session || !session.engine) {
        return c.json<ApiResponse>({
          success: false,
          error: '면접 세션이 만료되었습니다. 새로고침 후 다시 시작해주세요.'
        }, 404);
      }

      session.lastActivity = new Date().toISOString();

      // 답변 처리
      const response = await session.engine.processAnswer(message.trim());

      // 면접 완료 또는 탈락 시
      if (response.status === 'completed' || response.status === 'rejected') {
        console.log('Interview finished:', response.result);
        
        return c.json<ApiResponse>({
          success: true,
          data: {
            role: 'assistant',
            content: response.message,
            sessionData: {
              status: response.status,
              result: response.result
            },
            profile: response.result
          }
        });
      }

      // 면접 진행 중
      return c.json<ApiResponse>({
        success: true,
        data: {
          role: 'assistant',
          content: response.message + '\\n\\n' + response.question,
          sessionData: {
            status: response.status,
            progress: response.progress,
            debug: response.debug
          }
        }
      });

    } catch (engineError: any) {
      console.error('AlbiInterviewEngine Error:', engineError);
      return c.json<ApiResponse>({
        success: false,
        error: engineError?.message || '면접 처리 중 오류가 발생했습니다.'
      }, 500);
    }

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error?.message || '죄송합니다. 일시적인 오류가 발생했습니다. 🐝'
    }, 500);
  }
});
`;
