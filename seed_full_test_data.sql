-- ========================================
-- 전체 테스트 데이터 생성
-- ========================================
-- 구직자 3명, 구인자 3명, 면접 결과, 매칭, 제안, 알림 데이터 포함

-- ========================================
-- 1. 구직자 계정 (이미 면접 완료)
-- ========================================

-- 구직자 1: 김민수 (카페, 강남구, S급)
INSERT OR IGNORE INTO users (
  id, name, phone, email, password_hash, user_type,
  is_verified, agreed_terms, agreed_privacy, created_at
) VALUES (
  'user-jobseeker-minsu', '김민수', '010-1001-2001', 'minsu@test.com',
  'test1234!', 'jobseeker',
  1, 1, 1, datetime('now', '-10 days')
);

INSERT OR IGNORE INTO jobseeker_profiles (
  id, user_id, interview_id, job_type, region, expected_wage,
  available_hours, available_days,
  final_grade, total_score, reliability_score, job_fit_score, 
  service_mind_score, logistics_score,
  recommendation, trial_focus, one_liner,
  strengths, concerns,
  interview_duration, question_count, is_active, created_at
) VALUES (
  'js-profile-minsu', 'user-jobseeker-minsu', 'interview-minsu-001',
  'cafe', '강남구', 15000,
  '["오전", "오후"]', '["평일", "주말"]',
  'S', 95, 35, 30, 25, 5,
  '카페 근무에 최적화된 인재입니다. 친절하고 책임감이 강하며, 커피에 대한 열정이 있습니다.',
  '시음 기간 동안 커피 메뉴 숙지와 POS 시스템 적응에 집중하세요.',
  '밝은 미소로 고객을 맞이하는 완벽한 바리스타형 인재',
  '["친절한 고객 응대", "커피 관련 지식", "빠른 학습 능력", "책임감"]',
  '["출근 시간 준수 확인 필요"]',
  450, 12, 1, datetime('now', '-10 days')
);

-- 구직자 2: 이지원 (편의점, 서초구, A급)
INSERT OR IGNORE INTO users (
  id, name, phone, email, password_hash, user_type,
  is_verified, agreed_terms, agreed_privacy, created_at
) VALUES (
  'user-jobseeker-jiwon', '이지원', '010-1002-2002', 'jiwon@test.com',
  'test1234!', 'jobseeker',
  1, 1, 1, datetime('now', '-8 days')
);

INSERT OR IGNORE INTO jobseeker_profiles (
  id, user_id, interview_id, job_type, region, expected_wage,
  available_hours, available_days,
  final_grade, total_score, reliability_score, job_fit_score, 
  service_mind_score, logistics_score,
  recommendation, trial_focus, one_liner,
  strengths, concerns,
  interview_duration, question_count, is_active, created_at
) VALUES (
  'js-profile-jiwon', 'user-jobseeker-jiwon', 'interview-jiwon-001',
  'cvs', '서초구', 12000,
  '["오후", "야간"]', '["평일", "주말"]',
  'A', 88, 32, 28, 23, 5,
  '편의점 업무에 적합한 성실한 인재입니다. 야간 근무 가능하며 책임감이 강합니다.',
  '시음 기간 동안 상품 진열과 재고 관리 방법을 익히세요.',
  '야간 근무도 문제없는 성실한 편의점 직원',
  '["야간 근무 가능", "성실함", "재고 관리 능력"]',
  '["고객 응대 톤 개선 필요"]',
  380, 10, 1, datetime('now', '-8 days')
);

-- 구직자 3: 박준호 (음식점, 강남구, B급)
INSERT OR IGNORE INTO users (
  id, name, phone, email, password_hash, user_type,
  is_verified, agreed_terms, agreed_privacy, created_at
) VALUES (
  'user-jobseeker-junho', '박준호', '010-1003-2003', 'junho@test.com',
  'test1234!', 'jobseeker',
  1, 1, 1, datetime('now', '-5 days')
);

INSERT OR IGNORE INTO jobseeker_profiles (
  id, user_id, interview_id, job_type, region, expected_wage,
  available_hours, available_days,
  final_grade, total_score, reliability_score, job_fit_score, 
  service_mind_score, logistics_score,
  recommendation, trial_focus, one_liner,
  strengths, concerns,
  interview_duration, question_count, is_active, created_at
) VALUES (
  'js-profile-junho', 'user-jobseeker-junho', 'interview-junho-001',
  'restaurant', '강남구', 13000,
  '["오후", "저녁"]', '["평일"]',
  'B', 75, 28, 24, 18, 5,
  '음식점 홀 서빙에 적합합니다. 체력이 좋고 빠르게 움직입니다.',
  '시음 기간 동안 주방과의 소통 방법과 메뉴 설명 능력을 키우세요.',
  '빠른 손놀림과 좋은 체력의 서빙 스태프',
  '["빠른 움직임", "체력", "멀티태스킹"]',
  '["메뉴 숙지 필요", "고객 응대 스킬 향상 필요"]',
  320, 9, 1, datetime('now', '-5 days')
);

-- ========================================
-- 2. 구인자 계정 (면접 완료, 구인 요구사항 등록)
-- ========================================

-- 구인자 1: 카페 사장님 (스타벅스 강남점)
INSERT OR IGNORE INTO users (
  id, name, phone, email, password_hash, user_type,
  business_registration_number, business_name, business_registration_verified,
  is_verified, agreed_terms, agreed_privacy, created_at
) VALUES (
  'user-employer-cafe01', '김사장', '010-2001-3001', 'cafe.boss@test.com',
  'test1234!', 'employer',
  '123-45-67890', '스타벅스 강남점', 1,
  1, 1, 1, datetime('now', '-7 days')
);

INSERT OR IGNORE INTO employer_requirements (
  id, user_id, interview_id, business_name, job_type, region, hourly_wage,
  required_hours, required_days, is_urgent,
  min_grade, min_reliability, min_job_fit, min_service_mind,
  preferred_personality, preferred_experience, workplace_culture,
  trial_period, contact_info, notes, is_active, created_at
) VALUES (
  'emp-req-cafe01', 'user-employer-cafe01', 'interview-cafe01-001',
  '스타벅스 강남점', 'cafe', '강남구', 15000,
  '["오전", "오후"]', '["평일", "주말"]', 1,
  'A', 30, 25, 20,
  '["친절함", "책임감", "적극성"]', '["카페 경험 우대"]', '활기찬 분위기, 팀워크 중시',
  3, '010-2001-3001', '커피에 관심 있는 분 환영', 1, datetime('now', '-7 days')
);

-- 구인자 2: 편의점 사장님 (GS25 서초점)
INSERT OR IGNORE INTO users (
  id, name, phone, email, password_hash, user_type,
  business_registration_number, business_name, business_registration_verified,
  is_verified, agreed_terms, agreed_privacy, created_at
) VALUES (
  'user-employer-cvs01', '이점주', '010-2002-3002', 'cvs.boss@test.com',
  'test1234!', 'employer',
  '234-56-78901', 'GS25 서초점', 1,
  1, 1, 1, datetime('now', '-6 days')
);

INSERT OR IGNORE INTO employer_requirements (
  id, user_id, interview_id, business_name, job_type, region, hourly_wage,
  required_hours, required_days, is_urgent,
  min_grade, min_reliability, min_job_fit, min_service_mind,
  preferred_personality, preferred_experience, workplace_culture,
  trial_period, contact_info, notes, is_active, created_at
) VALUES (
  'emp-req-cvs01', 'user-employer-cvs01', 'interview-cvs01-001',
  'GS25 서초점', 'cvs', '서초구', 12000,
  '["야간"]', '["평일", "주말"]', 1,
  'B', 28, 22, 18,
  '["성실함", "책임감"]', '["편의점 경험"]', '조용한 야간 근무',
  7, '010-2002-3002', '야간 근무 가능자 우대', 1, datetime('now', '-6 days')
);

-- 구인자 3: 음식점 사장님 (맛있는 김밥)
INSERT OR IGNORE INTO users (
  id, name, phone, email, password_hash, user_type,
  business_registration_number, business_name, business_registration_verified,
  is_verified, agreed_terms, agreed_privacy, created_at
) VALUES (
  'user-employer-restaurant01', '박주인', '010-2003-3003', 'restaurant.boss@test.com',
  'test1234!', 'employer',
  '345-67-89012', '맛있는 김밥', 1,
  1, 1, 1, datetime('now', '-4 days')
);

INSERT OR IGNORE INTO employer_requirements (
  id, user_id, interview_id, business_name, job_type, region, hourly_wage,
  required_hours, required_days, is_urgent,
  min_grade, min_reliability, min_job_fit, min_service_mind,
  preferred_personality, preferred_experience, workplace_culture,
  trial_period, contact_info, notes, is_active, created_at
) VALUES (
  'emp-req-restaurant01', 'user-employer-restaurant01', 'interview-restaurant01-001',
  '맛있는 김밥', 'restaurant', '강남구', 13000,
  '["오후", "저녁"]', '["평일"]', 0,
  'B', 25, 20, 15,
  '["빠른 움직임", "체력"]', '["서빙 경험"]', '바쁜 점심/저녁 시간대',
  5, '010-2003-3003', '체력 좋은 분 우선', 1, datetime('now', '-4 days')
);

-- ========================================
-- 3. 매칭 데이터
-- ========================================

-- 카페 사장님 → 김민수 (S급, 100점 매칭)
INSERT OR IGNORE INTO matching_history (
  id, employer_id, jobseeker_id, match_score, match_reasons,
  status, matched_at
) VALUES (
  'match-cafe-minsu', 'emp-req-cafe01', 'js-profile-minsu', 100,
  '["업종 일치 (카페)", "지역 일치 (강남구)", "등급 초과 (S급 >= A급)", "시급 일치 (15000원)"]',
  'pending', datetime('now', '-2 days')
);

-- 편의점 사장님 → 이지원 (A급, 95점 매칭)
INSERT OR IGNORE INTO matching_history (
  id, employer_id, jobseeker_id, match_score, match_reasons,
  status, matched_at
) VALUES (
  'match-cvs-jiwon', 'emp-req-cvs01', 'js-profile-jiwon', 95,
  '["업종 일치 (편의점)", "지역 일치 (서초구)", "등급 초과 (A급 >= B급)", "야간 근무 가능"]',
  'pending', datetime('now', '-1 days')
);

-- 음식점 사장님 → 박준호 (B급, 85점 매칭)
INSERT OR IGNORE INTO matching_history (
  id, employer_id, jobseeker_id, match_score, match_reasons,
  status, matched_at
) VALUES (
  'match-restaurant-junho', 'emp-req-restaurant01', 'js-profile-junho', 85,
  '["업종 일치 (음식점)", "지역 일치 (강남구)", "등급 일치 (B급)", "체력 우수"]',
  'pending', datetime('now', '-1 days')
);

-- ========================================
-- 4. 면접 제안 데이터
-- ========================================

-- 카페 사장님 → 김민수에게 제안
INSERT OR IGNORE INTO interview_proposals (
  id, employer_id, jobseeker_id, employer_requirement_id,
  message, proposed_wage, proposed_hours,
  match_score, jobseeker_grade, jobseeker_score,
  status, employer_contact, expires_at, created_at
) VALUES (
  'proposal-cafe-minsu', 'user-employer-cafe01', 'js-profile-minsu', 'emp-req-cafe01',
  '안녕하세요! 스타벅스 강남점에서 함께 일하실 바리스타를 찾고 있습니다. 프로필을 보니 카페 업무에 정말 적합하신 것 같아 면접 제안을 드립니다. 커피에 대한 열정이 느껴지네요! 연락 기다리겠습니다 :)',
  15000, '오전 9시~오후 6시 (주 5일)',
  100, 'S', 95,
  'pending', '010-2001-3001', datetime('now', '+7 days'), datetime('now', '-2 days')
);

-- 편의점 사장님 → 이지원에게 제안
INSERT OR IGNORE INTO interview_proposals (
  id, employer_id, jobseeker_id, employer_requirement_id,
  message, proposed_wage, proposed_hours,
  match_score, jobseeker_grade, jobseeker_score,
  status, employer_contact, expires_at, created_at
) VALUES (
  'proposal-cvs-jiwon', 'user-employer-cvs01', 'js-profile-jiwon', 'emp-req-cvs01',
  '안녕하세요. GS25 서초점입니다. 야간 근무 가능하시다고 하여 제안 드립니다. 성실하게 근무하실 분을 찾고 있습니다. 편의점 경험이 있으시면 더욱 좋습니다!',
  12000, '야간 10시~오전 6시 (주 5일)',
  95, 'A', 88,
  'pending', '010-2002-3002', datetime('now', '+7 days'), datetime('now', '-1 days')
);

-- ========================================
-- 5. 알림 데이터
-- ========================================

-- 김민수에게: 카페 제안 알림
INSERT OR IGNORE INTO notifications (
  id, user_id, type, title, message, link, related_id, is_read, created_at
) VALUES (
  'notif-minsu-01', 'user-jobseeker-minsu', 'proposal_received',
  '📩 새로운 면접 제안이 도착했습니다!',
  '김사장님으로부터 면접 제안을 받았습니다.',
  '/mypage.html', 'proposal-cafe-minsu', 0, datetime('now', '-2 days')
);

-- 이지원에게: 편의점 제안 알림
INSERT OR IGNORE INTO notifications (
  id, user_id, type, title, message, link, related_id, is_read, created_at
) VALUES (
  'notif-jiwon-01', 'user-jobseeker-jiwon', 'proposal_received',
  '📩 새로운 면접 제안이 도착했습니다!',
  '이점주님으로부터 면접 제안을 받았습니다.',
  '/mypage.html', 'proposal-cvs-jiwon', 0, datetime('now', '-1 days')
);
