/*
  # Fix infinite recursion in admin_users RLS policies

  1. Drop existing problematic policies
  2. Create simplified policies that don't cause recursion
  3. Ensure proper access control without self-referencing loops
*/

-- Drop existing policies that might cause recursion
DROP POLICY IF EXISTS "Super admins can manage all users" ON admin_users;
DROP POLICY IF EXISTS "Users can read their own data" ON admin_users;

-- Create simplified policies without recursion
CREATE POLICY "Users can read their own admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Super admins can read all admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.auth_user_id = auth.uid() 
      AND au.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.auth_user_id = auth.uid() 
      AND au.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.auth_user_id = auth.uid() 
      AND au.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can delete admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.auth_user_id = auth.uid() 
      AND au.role = 'super_admin'
    )
  );

-- Create a function to check if user is super admin (to avoid recursion)
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE auth_user_id = user_id 
    AND role = 'super_admin'
  );
$$;

-- Update policies to use the function (this prevents recursion)
DROP POLICY IF EXISTS "Super admins can read all admin users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can delete admin users" ON admin_users;

CREATE POLICY "Super admins can manage all admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));