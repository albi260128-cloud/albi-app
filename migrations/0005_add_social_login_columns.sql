-- 소셜 로그인 컬럼 추가

ALTER TABLE users ADD COLUMN kakao_id TEXT;
ALTER TABLE users ADD COLUMN naver_id TEXT;
ALTER TABLE users ADD COLUMN google_id TEXT;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_kakao_id ON users(kakao_id);
CREATE INDEX IF NOT EXISTS idx_users_naver_id ON users(naver_id);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
