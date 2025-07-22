/*
  # Enhanced Admin System with User Management and Blog Features

  1. New Tables
    - `admin_users` - User management with roles
    - `blog_tags` - Tag system for blogs
    - `blog_tag_relations` - Many-to-many relationship between blogs and tags
    
  2. Enhanced Tables
    - Update `articles` table with new fields (tags, featured image, etc.)
    
  3. Security
    - RLS policies for role-based access
    - Super admin and regular admin permissions
    
  4. Storage
    - Blog images bucket with size restrictions
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id)
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id)
);

-- Create blog_tag_relations table (many-to-many)
CREATE TABLE IF NOT EXISTS blog_tag_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, tag_id)
);

-- Add new columns to articles table
DO $$
BEGIN
  -- Add featured_image column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'featured_image'
  ) THEN
    ALTER TABLE articles ADD COLUMN featured_image text;
  END IF;

  -- Add excerpt column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'excerpt'
  ) THEN
    ALTER TABLE articles ADD COLUMN excerpt text;
  END IF;

  -- Add is_featured column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE articles ADD COLUMN is_featured boolean DEFAULT false;
  END IF;

  -- Add status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'status'
  ) THEN
    ALTER TABLE articles ADD COLUMN status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
  END IF;

  -- Add author_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'author_id'
  ) THEN
    ALTER TABLE articles ADD COLUMN author_id uuid REFERENCES admin_users(id);
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tag_relations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Super admins can manage all users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.auth_user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

CREATE POLICY "Users can read their own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- RLS Policies for blog_tags
CREATE POLICY "Anyone can read tags"
  ON blog_tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage tags"
  ON blog_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.auth_user_id = auth.uid()
    )
  );

-- RLS Policies for blog_tag_relations
CREATE POLICY "Anyone can read tag relations"
  ON blog_tag_relations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage tag relations"
  ON blog_tag_relations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.auth_user_id = auth.uid()
    )
  );

-- Update articles RLS policies
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON articles;

CREATE POLICY "Super admins can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.auth_user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('blog-images', 'blog-images', true, 102400) -- 100KB limit
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog images
CREATE POLICY "Anyone can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'blog-images' AND
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'blog-images' AND
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can delete blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'blog-images' AND
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.auth_user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default super admin (you'll need to update this with your actual auth user ID)
-- First, you need to create a user in Supabase Auth, then update this with the actual UUID
-- INSERT INTO admin_users (email, name, role, auth_user_id)
-- VALUES ('your-email@example.com', 'Your Name', 'super_admin', 'your-auth-user-id-here');

-- Create some default tags
INSERT INTO blog_tags (name, slug, description, color) VALUES
('Corporate Law', 'corporate-law', 'Articles about corporate legal matters', '#1E40AF'),
('Intellectual Property', 'intellectual-property', 'IP law and patent articles', '#7C3AED'),
('Technology Law', 'technology-law', 'Legal aspects of technology', '#059669'),
('Privacy Law', 'privacy-law', 'Data privacy and protection', '#DC2626'),
('Litigation', 'litigation', 'Court cases and dispute resolution', '#EA580C'),
('Regulatory', 'regulatory', 'Regulatory compliance and updates', '#0891B2')
ON CONFLICT (slug) DO NOTHING;