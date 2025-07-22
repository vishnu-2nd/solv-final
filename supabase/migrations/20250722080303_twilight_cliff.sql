-- Query to check all admin users and their roles
-- Run this in your Supabase SQL Editor to see who's the super admin

-- 1. Check all admin users
SELECT 
  au.id,
  au.email,
  au.name,
  au.role,
  au.auth_user_id,
  au.created_at,
  u.email as auth_email,
  u.created_at as auth_created_at
FROM admin_users au
LEFT JOIN auth.users u ON au.auth_user_id = u.id
ORDER BY au.created_at;

-- 2. Check specifically for super admins
SELECT 
  au.name,
  au.email,
  au.role,
  au.created_at
FROM admin_users au
WHERE au.role = 'super_admin'
ORDER BY au.created_at;

-- 3. If you need to make yourself a super admin, first find your auth user ID:
SELECT 
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- 4. Then create your admin record (replace with your actual details):
-- INSERT INTO admin_users (email, name, role, auth_user_id) 
-- VALUES ('your-email@example.com', 'Your Name', 'super_admin', 'your-auth-user-id-here');

-- 5. Or update an existing admin user to super admin:
-- UPDATE admin_users 
-- SET role = 'super_admin' 
-- WHERE email = 'your-email@example.com';