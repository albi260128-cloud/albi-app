-- Add PASS verification table
CREATE TABLE IF NOT EXISTS pass_verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT NOT NULL,
  name TEXT NOT NULL,
  carrier TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  gender TEXT NOT NULL,
  verification_token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  used_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_pass_verifications_phone ON pass_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_pass_verifications_token ON pass_verifications(verification_token);
CREATE INDEX IF NOT EXISTS idx_pass_verifications_expires ON pass_verifications(expires_at);
