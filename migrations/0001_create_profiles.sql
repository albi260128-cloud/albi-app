-- ========================================
-- 구직자 프로필 테이블 (Jobseeker Profiles)
-- ========================================
CREATE TABLE IF NOT EXISTS jobseeker_profiles (
  id TEXT PRIMARY KEY,                    -- 고유 ID (uuid)
  user_id TEXT NOT NULL,                  -- 사용자 ID (세션 기반)
  interview_id TEXT NOT NULL UNIQUE,      -- 면접 ID
  job_type TEXT NOT NULL,                 -- 희망 업종 (cafe, cvs, restaurant, retail, fastfood)
  
  -- 기본 정보
  region TEXT,                            -- 희망 지역
  expected_wage INTEGER,                  -- 희망 시급
  available_hours TEXT,                   -- 가능한 근무 시간대 (JSON)
  available_days TEXT,                    -- 가능한 근무 요일 (JSON)
  
  -- 점수 및 등급
  final_grade TEXT NOT NULL,              -- 최종 등급 (S, A, B, C, F)
  total_score INTEGER NOT NULL,           -- 총점
  reliability_score INTEGER NOT NULL,     -- 신뢰도 점수 (0-35)
  job_fit_score INTEGER NOT NULL,         -- 직무 적합도 점수 (0-30)
  service_mind_score INTEGER NOT NULL,    -- 서비스 마인드 점수 (0-25)
  logistics_score INTEGER NOT NULL,       -- 근무 조건 점수 (0-10)
  
  -- 분석 결과
  recommendation TEXT,                    -- 추천 등급 (강력추천, 추천, 보류, 비추천)
  trial_focus TEXT,                       -- 체험 기간 집중 사항
  one_liner TEXT,                         -- 한 줄 평가
  strengths TEXT,                         -- 강점 (JSON array)
  concerns TEXT,                          -- 주의사항 (JSON array)
  
  -- 메타 정보
  interview_duration INTEGER,             -- 면접 소요 시간 (초)
  question_count INTEGER,                 -- 질문 수
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- 인덱스용
  is_active BOOLEAN DEFAULT 1             -- 활성화 여부 (구직 중)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_jobseeker_job_type ON jobseeker_profiles(job_type);
CREATE INDEX IF NOT EXISTS idx_jobseeker_region ON jobseeker_profiles(region);
CREATE INDEX IF NOT EXISTS idx_jobseeker_grade ON jobseeker_profiles(final_grade);
CREATE INDEX IF NOT EXISTS idx_jobseeker_active ON jobseeker_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_jobseeker_created ON jobseeker_profiles(created_at DESC);

-- ========================================
-- 구인자 요구사항 테이블 (Employer Requirements)
-- ========================================
CREATE TABLE IF NOT EXISTS employer_requirements (
  id TEXT PRIMARY KEY,                    -- 고유 ID (uuid)
  user_id TEXT NOT NULL,                  -- 사용자 ID (세션 기반)
  interview_id TEXT NOT NULL UNIQUE,      -- 면접 ID
  
  -- 기본 정보
  business_name TEXT NOT NULL,            -- 사업장 이름
  job_type TEXT NOT NULL,                 -- 업종 (cafe, cvs, restaurant, retail, fastfood)
  region TEXT NOT NULL,                   -- 지역
  hourly_wage INTEGER NOT NULL,           -- 제시 시급
  
  -- 근무 조건
  required_hours TEXT,                    -- 필요한 근무 시간대 (JSON)
  required_days TEXT,                     -- 필요한 근무 요일 (JSON)
  is_urgent BOOLEAN DEFAULT 0,            -- 급구 여부
  
  -- 요구 사항
  min_grade TEXT,                         -- 최소 요구 등급 (S, A, B, C, F)
  min_reliability INTEGER,                -- 최소 신뢰도 점수
  min_job_fit INTEGER,                    -- 최소 직무 적합도
  min_service_mind INTEGER,               -- 최소 서비스 마인드
  
  -- 선호 사항
  preferred_personality TEXT,             -- 선호 성향 (JSON)
  preferred_experience TEXT,              -- 선호 경험 (JSON)
  workplace_culture TEXT,                 -- 매장 분위기
  
  -- 추가 정보
  trial_period INTEGER DEFAULT 3,         -- 체험 기간 (시간)
  contact_info TEXT,                      -- 연락처 (암호화)
  notes TEXT,                             -- 추가 메모
  
  -- 메타 정보
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1             -- 구인 활성화 여부
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_employer_job_type ON employer_requirements(job_type);
CREATE INDEX IF NOT EXISTS idx_employer_region ON employer_requirements(region);
CREATE INDEX IF NOT EXISTS idx_employer_wage ON employer_requirements(hourly_wage DESC);
CREATE INDEX IF NOT EXISTS idx_employer_urgent ON employer_requirements(is_urgent);
CREATE INDEX IF NOT EXISTS idx_employer_active ON employer_requirements(is_active);
CREATE INDEX IF NOT EXISTS idx_employer_created ON employer_requirements(created_at DESC);

-- ========================================
-- 매칭 기록 테이블 (Matching History)
-- ========================================
CREATE TABLE IF NOT EXISTS matching_history (
  id TEXT PRIMARY KEY,                    -- 고유 ID (uuid)
  employer_id TEXT NOT NULL,              -- 구인자 ID
  jobseeker_id TEXT NOT NULL,             -- 구직자 ID
  
  -- 매칭 정보
  match_score INTEGER NOT NULL,           -- 매칭 점수 (0-100)
  match_reasons TEXT,                     -- 매칭 이유 (JSON array)
  
  -- 상태
  status TEXT DEFAULT 'pending',          -- 상태 (pending, contacted, hired, rejected)
  employer_feedback TEXT,                 -- 구인자 피드백
  jobseeker_feedback TEXT,                -- 구직자 피드백
  
  -- 메타 정보
  matched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employer_id) REFERENCES employer_requirements(id),
  FOREIGN KEY (jobseeker_id) REFERENCES jobseeker_profiles(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_matching_employer ON matching_history(employer_id);
CREATE INDEX IF NOT EXISTS idx_matching_jobseeker ON matching_history(jobseeker_id);
CREATE INDEX IF NOT EXISTS idx_matching_score ON matching_history(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_matching_status ON matching_history(status);
CREATE INDEX IF NOT EXISTS idx_matching_date ON matching_history(matched_at DESC);
