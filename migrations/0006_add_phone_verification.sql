-- Add phone verification field to users table
ALTER TABLE users ADD COLUMN phone_verified INTEGER DEFAULT 0;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_phone_verified ON users(phone_verified);

-- Create index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
