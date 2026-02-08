-- ========================================
-- 채용공고 테이블 (Jobs)
-- ========================================
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,                        -- 고유 ID (uuid)
  user_id TEXT NOT NULL,                      -- 작성자 ID
  
  -- 기본 정보
  title TEXT NOT NULL,                        -- 공고 제목
  company_name TEXT NOT NULL,                 -- 회사/매장명
  job_type TEXT NOT NULL,                     -- 업종 (cafe, cvs, restaurant, retail, fastfood, other)
  
  -- 근무 조건
  hourly_wage INTEGER NOT NULL,               -- 시급
  work_hours TEXT,                            -- 근무 시간 (JSON: ["09:00-18:00"])
  work_days TEXT,                             -- 근무 요일 (JSON: ["월", "화", "수"])
  is_urgent BOOLEAN DEFAULT 0,                -- 급구 여부
  
  -- 위치 정보
  address TEXT NOT NULL,                      -- 주소
  latitude REAL,                              -- 위도
  longitude REAL,                             -- 경도
  region TEXT,                                -- 지역 (서울, 경기 등)
  
  -- 상세 정보
  description TEXT,                           -- 상세 설명
  requirements TEXT,                          -- 자격 요건
  benefits TEXT,                              -- 복지 혜택
  
  -- 연락처
  contact_name TEXT,                          -- 담당자 이름
  contact_phone TEXT,                         -- 연락처
  contact_email TEXT,                         -- 이메일
  
  -- 상태
  status TEXT DEFAULT 'active',               -- 상태 (active, closed, filled)
  views INTEGER DEFAULT 0,                    -- 조회수
  applications INTEGER DEFAULT 0,             -- 지원자 수
  
  -- 메타 정보
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,                        -- 마감일
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_region ON jobs(region);
CREATE INDEX IF NOT EXISTS idx_jobs_wage ON jobs(hourly_wage DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_urgent ON jobs(is_urgent);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(latitude, longitude);
