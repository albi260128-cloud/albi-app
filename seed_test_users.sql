-- ========================================
-- 테스트 계정 생성 스크립트
-- ========================================

-- 1. 구직자 테스트 계정
INSERT OR REPLACE INTO users (
  id, name, phone, email, password_hash, user_type,
  business_registration_number, business_name, business_registration_file_url,
  business_registration_verified, agreed_terms, agreed_privacy, agreed_marketing,
  is_verified, is_active, created_at
) VALUES (
  'user-jobseeker-test-001',
  '김알바',
  '010-1111-2222',
  'jobseeker@test.com',
  'test1234!',
  'jobseeker',
  NULL, NULL, NULL,
  0,
  1, 1, 1,
  1, -- 휴대폰 인증 완료
  1,
  datetime('now')
);

-- 2. 구인자 테스트 계정 (인증 완료)
INSERT OR REPLACE INTO users (
  id, name, phone, email, password_hash, user_type,
  business_registration_number, business_name, business_registration_file_url,
  business_registration_verified, agreed_terms, agreed_privacy, agreed_marketing,
  is_verified, is_active, created_at
) VALUES (
  'user-employer-test-001',
  '사장님',
  '010-3333-4444',
  'employer@test.com',
  'test1234!',
  'employer',
  '123-45-67890',
  '테스트 카페',
  'temp/test_business_registration.pdf',
  1, -- 사업자등록증 인증 완료
  1, 1, 1,
  1, -- 휴대폰 인증 완료
  1,
  datetime('now')
);

-- 3. 추가 구직자 계정들 (다양한 등급)
INSERT OR REPLACE INTO users (
  id, name, phone, email, password_hash, user_type,
  business_registration_number, business_name, business_registration_file_url,
  business_registration_verified, agreed_terms, agreed_privacy, agreed_marketing,
  is_verified, is_active, created_at
) VALUES 
(
  'user-jobseeker-test-002',
  '박학생',
  '010-2222-3333',
  'student@test.com',
  'test1234!',
  'jobseeker',
  NULL, NULL, NULL, 0,
  1, 1, 0,
  1, 1, datetime('now')
),
(
  'user-jobseeker-test-003',
  '이사원',
  '010-4444-5555',
  'employee@test.com',
  'test1234!',
  'jobseeker',
  NULL, NULL, NULL, 0,
  1, 1, 1,
  1, 1, datetime('now')
);

-- 4. 추가 구인자 계정들
INSERT OR REPLACE INTO users (
  id, name, phone, email, password_hash, user_type,
  business_registration_number, business_name, business_registration_file_url,
  business_registration_verified, agreed_terms, agreed_privacy, agreed_marketing,
  is_verified, is_active, created_at
) VALUES 
(
  'user-employer-test-002',
  '편의점사장',
  '010-5555-6666',
  'cvs@test.com',
  'test1234!',
  'employer',
  '234-56-78901',
  'GS25 강남점',
  'temp/test_business_registration_2.pdf',
  1,
  1, 1, 1,
  1, 1, datetime('now')
),
(
  'user-employer-test-003',
  '음식점사장',
  '010-7777-8888',
  'restaurant@test.com',
  'test1234!',
  'employer',
  '345-67-89012',
  '맛있는 김밥',
  'temp/test_business_registration_3.pdf',
  1,
  1, 1, 1,
  1, 1, datetime('now')
);
