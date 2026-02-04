-- ========================================
-- 사용자 인증 테이블 (Users)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                    -- 고유 ID (uuid)
  
  -- 기본 정보
  name TEXT NOT NULL,                     -- 이름
  phone TEXT NOT NULL UNIQUE,             -- 휴대폰 번호
  email TEXT UNIQUE,                      -- 이메일 (선택)
  password_hash TEXT,                     -- 비밀번호 해시 (휴대폰 인증 사용자는 NULL)
  
  -- 사용자 타입
  user_type TEXT NOT NULL DEFAULT 'jobseeker', -- 사용자 타입 (jobseeker, employer)
  
  -- 구인자 정보 (user_type = 'employer'인 경우)
  business_registration_number TEXT,      -- 사업자등록번호
  business_registration_verified BOOLEAN DEFAULT 0, -- 사업자등록증 인증 여부
  business_registration_file_url TEXT,    -- 사업자등록증 파일 URL
  business_name TEXT,                     -- 상호명
  business_type TEXT,                     -- 업종
  business_address TEXT,                  -- 사업장 주소
  
  -- 인증 정보
  verification_code TEXT,                 -- 휴대폰 인증 코드 (임시)
  verification_expires_at DATETIME,       -- 인증 코드 만료 시간
  is_verified BOOLEAN DEFAULT 0,          -- 휴대폰 인증 여부
  
  -- 소셜 로그인
  social_provider TEXT,                   -- 소셜 제공자 (kakao, naver, google)
  social_id TEXT,                         -- 소셜 ID
  
  -- 약관 동의
  agreed_terms BOOLEAN DEFAULT 0,         -- 이용약관 동의
  agreed_privacy BOOLEAN DEFAULT 0,       -- 개인정보 처리방침 동의
  agreed_marketing BOOLEAN DEFAULT 0,     -- 마케팅 수신 동의 (선택)
  
  -- 메타 정보
  last_login_at DATETIME,                 -- 마지막 로그인 시간
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1             -- 활성화 여부
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_social ON users(social_provider, social_id);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);

-- ========================================
-- 세션 테이블 (Sessions)
-- ========================================
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,                    -- 세션 ID (uuid)
  user_id TEXT NOT NULL,                  -- 사용자 ID
  
  -- 세션 정보
  token TEXT NOT NULL UNIQUE,             -- 세션 토큰 (JWT)
  device_info TEXT,                       -- 디바이스 정보
  ip_address TEXT,                        -- IP 주소
  user_agent TEXT,                        -- User Agent
  
  -- 만료 정보
  expires_at DATETIME NOT NULL,           -- 만료 시간
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
