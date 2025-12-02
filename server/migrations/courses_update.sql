-- Courses Schema Update Migration
-- Adds missing columns for professors, syllabi, and prerequisites JSON storage
-- Run this after the initial courses_schema.sql has been applied

-- Add prerequisites column (text field for prerequisite course codes)
ALTER TABLE Courses
ADD COLUMN IF NOT EXISTS prerequisites TEXT;

-- Add professors JSON column (array of professor objects with name, isPrimary, section, email)
ALTER TABLE Courses
ADD COLUMN IF NOT EXISTS professors JSON;

-- Add syllabi JSON column (array of syllabus objects with semester, file, professor, notes)
ALTER TABLE Courses
ADD COLUMN IF NOT EXISTS syllabi JSON;

-- Migrate existing professor data to professors JSON array format
-- This converts the single professor string to a JSON array with one entry
UPDATE Courses
SET professors = JSON_ARRAY(JSON_OBJECT('name', professor, 'isPrimary', true, 'section', section, 'email', ''))
WHERE professors IS NULL AND professor IS NOT NULL;

-- Migrate existing syllabusFile data to syllabi JSON array format
UPDATE Courses
SET syllabi = JSON_ARRAY(JSON_OBJECT('semester', semester, 'file', syllabusFile, 'professor', professor, 'notes', ''))
WHERE syllabi IS NULL AND syllabusFile IS NOT NULL AND syllabusFile != '';
