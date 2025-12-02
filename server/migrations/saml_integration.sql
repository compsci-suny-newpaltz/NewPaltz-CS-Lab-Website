-- SAML Integration Migration
-- Run this script to add SAML authentication support

-- Add new columns to StudentHighlightBlog table
ALTER TABLE StudentHighlightBlog
ADD COLUMN IF NOT EXISTS student_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS banner_image VARCHAR(500),
ADD COLUMN IF NOT EXISTS submitted_by_saml BOOLEAN DEFAULT FALSE;

-- Create admin whitelist table for permanent admin access
CREATE TABLE IF NOT EXISTS AdminWhitelist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    added_by VARCHAR(255),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(500)
);

-- Insert initial whitelist entries (student admins who need admin access without being faculty)
INSERT IGNORE INTO AdminWhitelist (email, notes) VALUES
('gopeen1@newpaltz.edu', 'Student admin - initial setup'),
('mathewj10@newpaltz.edu', 'Student admin - initial setup'),
('alejilal1@newpaltz.edu', 'Student admin - initial setup'),
('slaterm2@newpaltz.edu', 'Student admin - initial setup'),
('manzim1@newpaltz.edu', 'Student admin - initial setup');

-- Add index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_whitelist_email ON AdminWhitelist(email);
CREATE INDEX IF NOT EXISTS idx_highlights_email ON StudentHighlightBlog(student_email);
