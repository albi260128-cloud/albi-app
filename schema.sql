-- ========================================
-- 알비(ALBI) 데이터베이스 스키마
-- ========================================

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  user_type TEXT CHECK(user_type IN ('jobseeker', 'employer')) NOT NULL,
  name TEXT,
  albi_points INTEGER DEFAULT 20,
  trust_score REAL DEFAULT 5.0,
  level INTEGER DEFAULT 1,
  referral_code TEXT UNIQUE,
  created_at INTEGER DEFAULT (unixepoch())
);

-- 구인 공고 테이블
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  employer_id TEXT NOT NULL,
  title TEXT NOT NULL,
  hourly_wage INTEGER NOT NULL CHECK(hourly_wage >= 10030),
  location TEXT NOT NULL,
  description TEXT,
  work_schedule TEXT,
  requirements TEXT,
  benefits TEXT,
  status TEXT DEFAULT 'active',
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (employer_id) REFERENCES users(id)
);

-- 1시간 체험 예약 테이블
CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  job_id TEXT NOT NULL,
  jobseeker_id TEXT NOT NULL,
  employer_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  observation_missions TEXT,
  wants_to_work INTEGER,
  wants_to_hire INTEGER,
  jobseeker_review TEXT,
  employer_review TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (jobseeker_id) REFERENCES users(id),
  FOREIGN KEY (employer_id) REFERENCES users(id)
);

-- 알비포인트 거래 내역 테이블
CREATE TABLE IF NOT EXISTS point_transactions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT,
  balance_after INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- AI 면접 기록 테이블
CREATE TABLE IF NOT EXISTS ai_interviews (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  conversation_data TEXT NOT NULL,
  analysis_result TEXT,
  completed_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 친구 추천 테이블
CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  referrer_id TEXT NOT NULL,
  referee_id TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  status TEXT DEFAULT 'registered' CHECK(status IN ('registered', 'hired', 'cancelled')),
  reward_given INTEGER DEFAULT 0 CHECK(reward_given IN (0, 1)),
  created_at INTEGER DEFAULT (unixepoch()),
  rewarded_at INTEGER,
  FOREIGN KEY (referrer_id) REFERENCES users(id),
  FOREIGN KEY (referee_id) REFERENCES users(id),
  UNIQUE(referrer_id, referee_id)
);

-- ========================================
-- 인덱스 생성
-- ========================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);

CREATE INDEX IF NOT EXISTS idx_jobs_employer ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);

CREATE INDEX IF NOT EXISTS idx_experiences_job ON experiences(job_id);
CREATE INDEX IF NOT EXISTS idx_experiences_jobseeker ON experiences(jobseeker_id);
CREATE INDEX IF NOT EXISTS idx_experiences_employer ON experiences(employer_id);
CREATE INDEX IF NOT EXISTS idx_experiences_status ON experiences(status);

CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_interviews_user ON ai_interviews(user_id);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee ON referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- ========================================
-- 샘플 데이터 (개발/테스트용)
-- ========================================

INSERT OR IGNORE INTO users (id, email, user_type, name, albi_points, trust_score, referral_code) VALUES
('user001', 'jobseeker1@albi.co.kr', 'jobseeker', '김구직', 50, 5.0, 'ALBIA1B2C3'),
('user002', 'employer1@albi.co.kr', 'employer', '이사장', 100, 4.8, 'ALBID4E5F6'),
('user003', 'jobseeker2@albi.co.kr', 'jobseeker', '박알바', 30, 4.5, 'ALBIG7H8I9'),
('user004', 'employer2@albi.co.kr', 'employer', '최대표', 80, 4.9, 'ALBIJ1K2L3');

INSERT OR IGNORE INTO jobs (id, employer_id, title, hourly_wage, location, description, work_schedule) VALUES
('job001', 'user002', '홍대 카페 알바', 12000, '서울 마포구 홍대입구역 2번 출구', '친절한 카페 직원을 구합니다. 커피 제조 경험 우대', '{"weekdays": ["월", "수", "금"], "hours": "10:00-18:00"}'),
('job002', 'user002', '강남 편의점 야간 알바', 13500, '서울 강남구 강남역 인근', '야간 근무 가능자 우대. 책임감 있는 분 환영', '{"weekdays": ["화", "목", "토"], "hours": "22:00-06:00"}'),
('job003', 'user004', '신촌 음식점 홀 서빙', 11000, '서울 서대문구 신촌역 근처', '밝고 친절한 성격의 홀 직원 모집', '{"weekdays": ["월", "화", "수", "목"], "hours": "11:00-15:00"}');

INSERT OR IGNORE INTO experiences (id, job_id, jobseeker_id, employer_id, status, scheduled_date, scheduled_time) VALUES
('exp001', 'job001', 'user001', 'user002', 'completed', '2025-01-20', '14:00'),
('exp002', 'job002', 'user003', 'user002', 'pending', '2025-01-25', '10:00');

INSERT OR IGNORE INTO point_transactions (id, user_id, amount, transaction_type, description, balance_after) VALUES
('pt001', 'user001', 20, 'signup_bonus', '회원가입 축하 포인트', 20),
('pt002', 'user001', 15, 'experience_completed', '1시간 체험 완료', 35),
('pt003', 'user001', 30, 'first_week_bonus', '첫 주 근무 완료 보너스', 65);

INSERT OR IGNORE INTO referrals (id, referrer_id, referee_id, referral_code, status, reward_given) VALUES
('ref001', 'user001', 'user003', 'ALBIA1B2C3', 'registered', 0);

-- ========================================
-- 완료 메시지
-- ========================================

SELECT '✅ 알비 데이터베이스 스키마 초기화 완료!' AS message;
