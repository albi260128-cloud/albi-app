-- Add employer verification request tracking
-- 사용자가 구인자로 업그레이드 요청을 할 수 있도록 추가 필드 생성

-- employer_verification_requests 테이블 생성
CREATE TABLE IF NOT EXISTS employer_verification_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  business_registration_number TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_registration_file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  rejection_reason TEXT,
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  reviewed_by TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_employer_verification_user_id ON employer_verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_employer_verification_status ON employer_verification_requests(status);
