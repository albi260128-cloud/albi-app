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
  latitude REAL,
  longitude REAL,
  address TEXT,
  category TEXT DEFAULT 'etc',
  tags TEXT,
  work_days TEXT,
  work_hours TEXT,
  views INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
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
-- 커뮤니티 게시판 테이블
-- ========================================

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'free' CHECK(category IN ('free', 'review', 'question', 'tip')),
  views INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  is_anonymous INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  post_id TEXT NOT NULL,
  user_id TEXT,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id TEXT,
  is_anonymous INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 좋아요 테이블
CREATE TABLE IF NOT EXISTS post_likes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(post_id, user_id)
);

-- 신고 테이블
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  reporter_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK(target_type IN ('post', 'comment')),
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL CHECK(reason IN ('spam', 'abuse', 'inappropriate')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'resolved')),
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (reporter_id) REFERENCES users(id)
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

CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured) WHERE featured = 1;

-- 커뮤니티 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(is_featured) WHERE is_featured = 1;
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- ========================================
-- 샘플 데이터 (개발/테스트용)
-- ========================================

INSERT OR IGNORE INTO users (id, email, user_type, name, albi_points, trust_score, referral_code) VALUES
('user001', 'jobseeker1@albi.co.kr', 'jobseeker', '김구직', 50, 5.0, 'ALBIA1B2C3'),
('user002', 'employer1@albi.co.kr', 'employer', '이사장', 100, 4.8, 'ALBID4E5F6'),
('user003', 'jobseeker2@albi.co.kr', 'jobseeker', '박알바', 30, 4.5, 'ALBIG7H8I9'),
('user004', 'employer2@albi.co.kr', 'employer', '최대표', 80, 4.9, 'ALBIJ1K2L3');

INSERT OR IGNORE INTO jobs (
  id, employer_id, title, hourly_wage, location, description, 
  latitude, longitude, address, category, tags, work_days, work_hours, status
) VALUES
  ('job001', 'user002', '홍대 감성 카페 직원 모집', 12000, '서울 마포구', 
   '친절하고 밝은 분을 찾습니다. 커피 경험 없어도 괜찮아요!',
   37.5563, 126.9236, '서울 마포구 양화로 160', 'cafe', 
   '["초보환영", "주말근무", "장기알바"]', '["월", "화", "수", "목", "금"]', '09:00-18:00', 'active'),
   
  ('job002', 'user002', 'GS25 편의점 야간 알바', 13000, '서울 마포구',
   '야간 근무 가능하신 분 우대합니다. 2인 근무로 안전해요!',
   37.5547, 126.9207, '서울 마포구 와우산로 94', 'convenience',
   '["야간근무", "초보환영"]', '["월", "수", "금"]', '22:00-06:00', 'active'),
   
  ('job003', 'user004', '신촌 떡볶이집 홀서빙', 11000, '서울 서대문구',
   '밝고 친절한 분! 음식 할인 혜택 있어요 🍜',
   37.5596, 126.9370, '서울 서대문구 신촌역로 30', 'restaurant',
   '["초보환영", "식사제공"]', '["화", "수", "목", "금", "토"]', '11:00-20:00', 'active');

INSERT OR IGNORE INTO experiences (id, job_id, jobseeker_id, employer_id, status, scheduled_date, scheduled_time) VALUES
('exp001', 'job001', 'user001', 'user002', 'completed', '2025-01-20', '14:00'),
('exp002', 'job002', 'user003', 'user002', 'pending', '2025-01-25', '10:00');

INSERT OR IGNORE INTO point_transactions (id, user_id, amount, transaction_type, description, balance_after) VALUES
('pt001', 'user001', 20, 'signup_bonus', '회원가입 축하 포인트', 20),
('pt002', 'user001', 15, 'experience_completed', '1시간 체험 완료', 35),
('pt003', 'user001', 30, 'first_week_bonus', '첫 주 근무 완료 보너스', 65);

INSERT OR IGNORE INTO referrals (id, referrer_id, referee_id, referral_code, status, reward_given) VALUES
('ref001', 'user001', 'user003', 'ALBIA1B2C3', 'registered', 0);

-- 커뮤니티 샘플 데이터
INSERT OR IGNORE INTO posts (id, user_id, author_name, title, content, category, views, likes_count, comments_count) VALUES
  ('post001', 'user001', '알바초보', '첫 카페 알바 체험 후기!', 
   '오늘 홍대 카페에서 1시간 체험했는데 정말 좋았어요! 사장님도 친절하시고 동료분들도 다 좋으셨어요. 내일부터 출근하기로 했습니다 ㅎㅎ', 
   'review', 45, 12, 5),
  ('post002', 'user002', '걱정많은학생', '면접 때 뭐 물어보나요?',
   '처음 알바 면접 보는데 너무 긴장돼요 ㅠㅠ 보통 어떤 질문 하시나요? 경험자분들 조언 부탁드려요!',
   'question', 32, 8, 7),
  ('post003', NULL, '익명', '편의점 야간알바 꿀팁 공유',
   '편의점 야간 1년차입니다. 초보분들을 위해 꿀팁 몇 개 공유해요!

1. 택배 정리는 새벽에 하는 게 제일 수월해요
2. 발주는 체크리스트 만들어서 관리하세요
3. 술취한 손님 응대법: 일단 공손하게, 위험하면 바로 112

다들 화이팅이에요! 🎉',
   'tip', 78, 25, 3);

-- ========================================
-- 완료 메시지
-- ========================================

SELECT '✅ 알비 데이터베이스 스키마 초기화 완료!' AS message;
