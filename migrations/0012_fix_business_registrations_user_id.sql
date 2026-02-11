-- user_id를 NULL 허용으로 변경 (회원가입 전 업로드 지원)
-- SQLite에서는 ALTER COLUMN을 직접 지원하지 않으므로 테이블 재생성 필요

-- 1. 임시 테이블 생성
CREATE TABLE IF NOT EXISTS business_registrations_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,  -- NOT NULL 제거
  business_number TEXT NOT NULL,
  business_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  verified INTEGER DEFAULT 0,
  verified_at DATETIME,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 기존 데이터 복사
INSERT INTO business_registrations_new 
SELECT * FROM business_registrations;

-- 3. 기존 테이블 삭제
DROP TABLE business_registrations;

-- 4. 새 테이블 이름 변경
ALTER TABLE business_registrations_new RENAME TO business_registrations;

-- 5. 인덱스 재생성
CREATE INDEX IF NOT EXISTS idx_business_registrations_user_id ON business_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_business_registrations_business_number ON business_registrations(business_number);
