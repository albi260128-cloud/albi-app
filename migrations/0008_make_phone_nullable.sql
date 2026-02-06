-- ========================================
-- 휴대폰 번호를 NULL 허용으로 변경
-- ========================================
-- SQLite는 ALTER COLUMN을 지원하지 않으므로 테이블을 재생성해야 합니다.

-- 1. 임시 테이블 생성 (phone을 NULL 허용)
CREATE TABLE IF NOT EXISTS users_new (
  id TEXT PRIMARY KEY,
  
  -- 기본 정보
  name TEXT NOT NULL,
  phone TEXT UNIQUE,                      -- NOT NULL 제거
  email TEXT UNIQUE,
  password_hash TEXT,
  
  -- 사용자 타입
  user_type TEXT NOT NULL DEFAULT 'jobseeker',
  
  -- 구인자 정보
  business_registration_number TEXT,
  business_registration_verified BOOLEAN DEFAULT 0,
  business_registration_file_url TEXT,
  business_name TEXT,
  business_type TEXT,
  business_address TEXT,
  
  -- 인증 정보
  verification_code TEXT,
  verification_expires_at DATETIME,
  is_verified BOOLEAN DEFAULT 0,
  
  -- 소셜 로그인 (0005 마이그레이션에서 추가된 컬럼들)
  kakao_id TEXT UNIQUE,
  naver_id TEXT UNIQUE,
  google_id TEXT UNIQUE,
  social_provider TEXT,
  social_id TEXT,
  
  -- 휴대폰 인증 (0006 마이그레이션에서 추가된 컬럼)
  phone_verified BOOLEAN DEFAULT 0,
  
  -- 약관 동의
  agreed_terms BOOLEAN DEFAULT 0,
  agreed_privacy BOOLEAN DEFAULT 0,
  agreed_marketing BOOLEAN DEFAULT 0,
  
  -- 메타 정보
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1
);

-- 2. 기존 데이터 복사
INSERT INTO users_new SELECT * FROM users;

-- 3. 기존 테이블 삭제
DROP TABLE users;

-- 4. 새 테이블 이름 변경
ALTER TABLE users_new RENAME TO users;

-- 5. 인덱스 재생성
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_kakao ON users(kakao_id);
CREATE INDEX IF NOT EXISTS idx_users_naver ON users(naver_id);
CREATE INDEX IF NOT EXISTS idx_users_google ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_social ON users(social_provider, social_id);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);
