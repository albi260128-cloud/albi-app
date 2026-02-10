-- SMS 인증 테이블 생성
CREATE TABLE IF NOT EXISTS sms_verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT,
  verified INTEGER DEFAULT 0,
  verified_at DATETIME,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인증번호 조회 인덱스
CREATE INDEX IF NOT EXISTS idx_sms_verifications_phone_code ON sms_verifications(phone, code);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_expires ON sms_verifications(expires_at);

-- 사업자등록증 테이블 생성
CREATE TABLE IF NOT EXISTS business_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  business_number TEXT NOT NULL,
  business_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  verified INTEGER DEFAULT 0,
  verified_at DATETIME,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 사업자등록증 조회 인덱스
CREATE INDEX IF NOT EXISTS idx_business_registrations_user_id ON business_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_business_registrations_business_number ON business_registrations(business_number);

-- 포인트 거래 내역 테이블 (이미 있을 경우 무시)
CREATE TABLE IF NOT EXISTS point_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 포인트 거래 인덱스
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at ON point_transactions(created_at DESC);
