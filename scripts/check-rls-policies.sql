-- Check RLS status for all tables
-- This script checks which tables have RLS enabled and which policies exist

-- 1. Check which tables have RLS enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. Check existing RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual as policy_expression,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Identify tables without RLS
SELECT 
  t.tablename,
  'ALTER TABLE ' || t.tablename || ' ENABLE ROW LEVEL SECURITY;' as enable_rls_command
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public'
  AND t.tablename NOT IN (
    SELECT tablename FROM pg_tables WHERE rowsecurity = true AND schemaname = 'public'
  )
GROUP BY t.tablename
ORDER BY t.tablename;

-- 4. Check table ownership and auth setup
SELECT 
  t.tablename,
  t.tableowner,
  (SELECT count(*) FROM pg_policies WHERE pg_policies.tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE t.schemaname = 'public'
ORDER BY t.tablename;
