-- ========================================
-- 면접 제안 테이블 (Interview Proposals)
-- ========================================
CREATE TABLE IF NOT EXISTS interview_proposals (
  id TEXT PRIMARY KEY,                    -- 고유 ID (uuid)
  
  -- 관계 정보
  employer_id TEXT NOT NULL,              -- 구인자 ID (users.id)
  jobseeker_id TEXT NOT NULL,             -- 구직자 ID (jobseeker_profiles.id)
  employer_requirement_id TEXT,           -- 구인 요구사항 ID
  
  -- 제안 정보
  message TEXT,                           -- 제안 메시지
  proposed_wage INTEGER,                  -- 제안 시급
  proposed_hours TEXT,                    -- 제안 근무 시간
  
  -- 매칭 정보
  match_score INTEGER,                    -- 매칭 점수 (0-100)
  jobseeker_grade TEXT,                   -- 구직자 등급
  jobseeker_score INTEGER,                -- 구직자 총점
  
  -- 상태 관리
  status TEXT DEFAULT 'pending',          -- 상태 (pending, accepted, rejected, expired)
  
  -- 연락처 정보 (수락 시 공개)
  employer_contact TEXT,                  -- 구인자 연락처
  jobseeker_contact TEXT,                 -- 구직자 연락처
  
  -- 피드백
  employer_feedback TEXT,                 -- 구인자 피드백
  jobseeker_feedback TEXT,                -- 구직자 피드백
  
  -- 메타 정보
  expires_at DATETIME,                    -- 제안 만료 시간 (7일)
  responded_at DATETIME,                  -- 응답 시간
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employer_id) REFERENCES users(id),
  FOREIGN KEY (jobseeker_id) REFERENCES jobseeker_profiles(id),
  FOREIGN KEY (employer_requirement_id) REFERENCES employer_requirements(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_proposals_employer ON interview_proposals(employer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_jobseeker ON interview_proposals(jobseeker_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON interview_proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created ON interview_proposals(created_at DESC);
