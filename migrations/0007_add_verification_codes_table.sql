-- Create phone verification codes table
CREATE TABLE IF NOT EXISTS phone_verification_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone_number TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_phone_verification_phone ON phone_verification_codes(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_verification_expires ON phone_verification_codes(expires_at);

-- Clean up expired codes (optional, for manual cleanup)
-- DELETE FROM phone_verification_codes WHERE expires_at < unixepoch('now') * 1000;
