import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { handle } from 'hono/cloudflare-pages'

type Bindings = {
  DB: D1Database
  KAKAO_CLIENT_ID: string
  KAKAO_REDIRECT_URI: string
  NAVER_CLIENT_ID: string
  NAVER_CLIENT_SECRET: string
  NAVER_REDIRECT_URI: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_REDIRECT_URI: string
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api/auth')

app.use('/*', cors())

// ========================================
// 🎯 카카오 로그인
// ========================================

// Step 1: 카카오 로그인 페이지로 리다이렉트
app.get('/kakao', (c) => {
  const clientId = c.env.KAKAO_CLIENT_ID
  const redirectUri = c.env.KAKAO_REDIRECT_URI || `${new URL(c.req.url).origin}/api/auth/kakao/callback`
  
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
  
  return c.redirect(kakaoAuthUrl)
})

// Step 2: 카카오 콜백 처리
app.get('/kakao/callback', async (c) => {
  const code = c.req.query('code')
  
  if (!code) {
    return c.json({ success: false, error: '인증 코드가 없습니다.' }, 400)
  }
  
  try {
    const clientId = c.env.KAKAO_CLIENT_ID
    const redirectUri = c.env.KAKAO_REDIRECT_URI || `${new URL(c.req.url).origin}/api/auth/kakao/callback`
    
    // 1. 액세스 토큰 요청
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code: code
      })
    })
    
    const tokenData = await tokenResponse.json() as any
    
    console.log('[Kakao OAuth] Token response:', tokenData)
    
    if (!tokenData.access_token) {
      console.error('[Kakao OAuth] Token error:', tokenData)
      return c.json({ 
        success: false, 
        error: '액세스 토큰 발급 실패',
        details: tokenData.error_description || tokenData.error || 'Unknown error',
        kakao_error: tokenData
      }, 400)
    }
    
    // 2. 사용자 정보 요청
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })
    
    const userData = await userResponse.json() as any
    
    // 3. 사용자 정보 추출
    const kakaoId = userData.id
    const email = userData.kakao_account?.email
    const name = userData.kakao_account?.profile?.nickname
    const phone = userData.kakao_account?.phone_number
    
    // 4. DB에서 사용자 확인
    const existingUser = await c.env.DB.prepare(`
      SELECT * FROM users WHERE email = ? OR kakao_id = ?
    `).bind(email, kakaoId.toString()).first()
    
    let userId
    
    if (existingUser) {
      // 기존 사용자 - 카카오 ID 업데이트
      userId = existingUser.id
      await c.env.DB.prepare(`
        UPDATE users SET kakao_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(kakaoId.toString(), userId).run()
    } else {
      // 신규 사용자 - 회원가입
      userId = `user-${Date.now()}-${Math.random().toString(36).substring(7)}`
      
      await c.env.DB.prepare(`
        INSERT INTO users (id, email, name, phone, kakao_id, user_type, is_verified, created_at)
        VALUES (?, ?, ?, ?, ?, 'jobseeker', 1, CURRENT_TIMESTAMP)
      `).bind(userId, email, name, phone, kakaoId.toString()).run()
    }
    
    // 5. 세션 생성
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7일
    
    await c.env.DB.prepare(`
      INSERT INTO sessions (id, user_id, expires_at, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(sessionId, userId, expiresAt).run()
    
    // 6. 로그인 완료 페이지로 리다이렉트
    const redirectUrl = `${new URL(c.req.url).origin}/auth-callback.html?session=${sessionId}&provider=kakao&name=${encodeURIComponent(name || '')}`
    
    return c.redirect(redirectUrl)
    
  } catch (error: any) {
    console.error('카카오 로그인 오류:', error)
    return c.json({ success: false, error: '카카오 로그인 중 오류가 발생했습니다.', details: error.message }, 500)
  }
})

// ========================================
// 🎯 네이버 로그인
// ========================================

// Step 1: 네이버 로그인 페이지로 리다이렉트
app.get('/naver', (c) => {
  const clientId = c.env.NAVER_CLIENT_ID
  const redirectUri = c.env.NAVER_REDIRECT_URI || `${new URL(c.req.url).origin}/api/auth/naver/callback`
  const state = Math.random().toString(36).substring(7)
  
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
  
  return c.redirect(naverAuthUrl)
})

// Step 2: 네이버 콜백 처리
app.get('/naver/callback', async (c) => {
  const code = c.req.query('code')
  const state = c.req.query('state')
  
  if (!code) {
    return c.json({ success: false, error: '인증 코드가 없습니다.' }, 400)
  }
  
  try {
    const clientId = c.env.NAVER_CLIENT_ID
    const clientSecret = c.env.NAVER_CLIENT_SECRET
    
    // 1. 액세스 토큰 요청
    const tokenResponse = await fetch(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}`)
    
    const tokenData = await tokenResponse.json() as any
    
    if (!tokenData.access_token) {
      return c.json({ success: false, error: '액세스 토큰 발급 실패' }, 400)
    }
    
    // 2. 사용자 정보 요청
    const userResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })
    
    const userData = await userResponse.json() as any
    
    if (userData.resultcode !== '00') {
      return c.json({ success: false, error: '사용자 정보 조회 실패' }, 400)
    }
    
    // 3. 사용자 정보 추출
    const naverId = userData.response.id
    const email = userData.response.email
    const name = userData.response.name
    const phone = userData.response.mobile
    
    // 4. DB에서 사용자 확인
    const existingUser = await c.env.DB.prepare(`
      SELECT * FROM users WHERE email = ? OR naver_id = ?
    `).bind(email, naverId).first()
    
    let userId
    
    if (existingUser) {
      userId = existingUser.id
      await c.env.DB.prepare(`
        UPDATE users SET naver_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(naverId, userId).run()
    } else {
      userId = `user-${Date.now()}-${Math.random().toString(36).substring(7)}`
      
      await c.env.DB.prepare(`
        INSERT INTO users (id, email, name, phone, naver_id, user_type, is_verified, created_at)
        VALUES (?, ?, ?, ?, ?, 'jobseeker', 1, CURRENT_TIMESTAMP)
      `).bind(userId, email, name, phone, naverId).run()
    }
    
    // 5. 세션 생성
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    
    await c.env.DB.prepare(`
      INSERT INTO sessions (id, user_id, expires_at, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(sessionId, userId, expiresAt).run()
    
    // 6. 로그인 완료 페이지로 리다이렉트
    const redirectUrl = `${new URL(c.req.url).origin}/auth-callback.html?session=${sessionId}&provider=naver&name=${encodeURIComponent(name || '')}`
    
    return c.redirect(redirectUrl)
    
  } catch (error: any) {
    console.error('네이버 로그인 오류:', error)
    return c.json({ success: false, error: '네이버 로그인 중 오류가 발생했습니다.', details: error.message }, 500)
  }
})

// ========================================
// 🎯 구글 로그인
// ========================================

// Step 1: 구글 로그인 페이지로 리다이렉트
app.get('/google', (c) => {
  const clientId = c.env.GOOGLE_CLIENT_ID
  const redirectUri = c.env.GOOGLE_REDIRECT_URI || `${new URL(c.req.url).origin}/api/auth/google/callback`
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`
  
  return c.redirect(googleAuthUrl)
})

// Step 2: 구글 콜백 처리
app.get('/google/callback', async (c) => {
  const code = c.req.query('code')
  
  if (!code) {
    return c.json({ success: false, error: '인증 코드가 없습니다.' }, 400)
  }
  
  try {
    const clientId = c.env.GOOGLE_CLIENT_ID
    const clientSecret = c.env.GOOGLE_CLIENT_SECRET
    const redirectUri = c.env.GOOGLE_REDIRECT_URI || `${new URL(c.req.url).origin}/api/auth/google/callback`
    
    // 1. 액세스 토큰 요청
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })
    
    const tokenData = await tokenResponse.json() as any
    
    if (!tokenData.access_token) {
      return c.json({ success: false, error: '액세스 토큰 발급 실패' }, 400)
    }
    
    // 2. 사용자 정보 요청
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })
    
    const userData = await userResponse.json() as any
    
    // 3. 사용자 정보 추출
    const googleId = userData.id
    const email = userData.email
    const name = userData.name
    
    // 4. DB에서 사용자 확인
    const existingUser = await c.env.DB.prepare(`
      SELECT * FROM users WHERE email = ? OR google_id = ?
    `).bind(email, googleId).first()
    
    let userId
    
    if (existingUser) {
      userId = existingUser.id
      await c.env.DB.prepare(`
        UPDATE users SET google_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(googleId, userId).run()
    } else {
      userId = `user-${Date.now()}-${Math.random().toString(36).substring(7)}`
      
      await c.env.DB.prepare(`
        INSERT INTO users (id, email, name, google_id, user_type, is_verified, created_at)
        VALUES (?, ?, ?, ?, 'jobseeker', 1, CURRENT_TIMESTAMP)
      `).bind(userId, email, name, googleId).run()
    }
    
    // 5. 세션 생성
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    
    await c.env.DB.prepare(`
      INSERT INTO sessions (id, user_id, expires_at, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(sessionId, userId, expiresAt).run()
    
    // 6. 로그인 완료 페이지로 리다이렉트
    const redirectUrl = `${new URL(c.req.url).origin}/auth-callback.html?session=${sessionId}&provider=google&name=${encodeURIComponent(name || '')}`
    
    return c.redirect(redirectUrl)
    
  } catch (error: any) {
    console.error('구글 로그인 오류:', error)
    return c.json({ success: false, error: '구글 로그인 중 오류가 발생했습니다.', details: error.message }, 500)
  }
})

export const onRequest = handle(app)
