/*
  # Add video URL field to articles

  1. Changes
    - Add `video_url` column to articles table for optional video embedding
    - Column is nullable to maintain backward compatibility

  2. Security
    - No changes to existing RLS policies needed
*/

-- Add video_url column to articles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE articles ADD COLUMN video_url text;
  END IF;
END $$;