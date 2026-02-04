-- ========================================
-- Notifications Table
-- ========================================
-- 알림 시스템을 위한 테이블
-- 로그인 시 새로운 제안, 제안 수락/거절 등의 알림을 저장

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'proposal_received', 'proposal_accepted', 'proposal_rejected'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,           -- 클릭 시 이동할 URL
  related_id TEXT,     -- 관련된 제안 ID 등
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
