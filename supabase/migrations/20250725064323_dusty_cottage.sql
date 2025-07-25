/*
  # Add video_url column to articles table

  1. Changes
    - Add `video_url` column to `articles` table
    - Column is optional (nullable) for storing video URLs

  2. Security
    - No changes to existing RLS policies needed
    - Column inherits existing table permissions
*/

-- Add video_url column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS video_url TEXT;