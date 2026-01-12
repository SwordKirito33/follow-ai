# Row Level Security (RLS) 策略文档

## 概述

Row Level Security (RLS) 是 PostgreSQL 的一项安全功能，允许在行级别控制数据访问。本文档描述了 Follow.ai 项目中的 RLS 策略。

## RLS 策略检查清单

### 用户表 (users)
- [x] RLS 已启用
- [x] 用户只能查看自己的数据
- [x] 用户只能更新自己的数据
- [x] 管理员可以查看所有数据

**策略**:
```sql
-- 用户查看自己的数据
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- 用户更新自己的数据
CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 管理员可以查看所有数据
CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 任务表 (tasks)
- [x] RLS 已启用
- [x] 用户只能查看自己创建的任务
- [x] 用户只能查看分配给自己的任务
- [x] 任务创建者可以编辑任务

**策略**:
```sql
-- 用户可以查看自己创建的任务
CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  USING (created_by = auth.uid());

-- 用户可以查看分配给自己的任务
CREATE POLICY "Users can view assigned tasks"
  ON tasks
  FOR SELECT
  USING (assigned_to = auth.uid());

-- 任务创建者可以更新任务
CREATE POLICY "Task creators can update tasks"
  ON tasks
  FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());
```

### 评测表 (reviews)
- [x] RLS 已启用
- [x] 用户只能查看自己的评测
- [x] 用户只能创建自己的评测
- [x] 评测创建者可以编辑评测

**策略**:
```sql
-- 用户可以查看自己的评测
CREATE POLICY "Users can view their own reviews"
  ON reviews
  FOR SELECT
  USING (user_id = auth.uid());

-- 用户可以创建评测
CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 用户可以更新自己的评测
CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### 钱包表 (wallets)
- [x] RLS 已启用
- [x] 用户只能查看自己的钱包
- [x] 用户只能更新自己的钱包
- [x] 系统可以更新钱包 (通过服务角色)

**策略**:
```sql
-- 用户可以查看自己的钱包
CREATE POLICY "Users can view their own wallet"
  ON wallets
  FOR SELECT
  USING (user_id = auth.uid());

-- 用户可以更新自己的钱包
CREATE POLICY "Users can update their own wallet"
  ON wallets
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### 交易表 (transactions)
- [x] RLS 已启用
- [x] 用户只能查看自己的交易
- [x] 用户不能直接创建交易 (由系统创建)
- [x] 用户不能修改交易 (不可变)

**策略**:
```sql
-- 用户可以查看自己的交易
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  USING (user_id = auth.uid());

-- 禁止用户直接修改交易
CREATE POLICY "Transactions are immutable"
  ON transactions
  FOR UPDATE
  USING (false);

CREATE POLICY "Transactions cannot be deleted"
  ON transactions
  FOR DELETE
  USING (false);
```

### XP 历史表 (xp_history)
- [x] RLS 已启用
- [x] 用户只能查看自己的 XP 历史
- [x] 用户不能直接修改 XP 历史

**策略**:
```sql
-- 用户可以查看自己的 XP 历史
CREATE POLICY "Users can view their own XP history"
  ON xp_history
  FOR SELECT
  USING (user_id = auth.uid());

-- 禁止用户直接修改 XP 历史
CREATE POLICY "XP history is immutable"
  ON xp_history
  FOR UPDATE
  USING (false);

CREATE POLICY "XP history cannot be deleted"
  ON xp_history
  FOR DELETE
  USING (false);
```

## 启用 RLS

```sql
-- 启用表的 RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY policy_name
  ON table_name
  FOR SELECT
  USING (condition);
```

## 禁用 RLS (仅用于测试)

```sql
-- 禁用表的 RLS
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

## 测试 RLS

```sql
-- 以特定用户身份测试
SET ROLE authenticated;
SET request.jwt.claims = '{"sub": "user-id"}';

-- 查询应该只返回该用户的数据
SELECT * FROM users;
```

## 最佳实践

1. **始终启用 RLS**: 对所有包含用户数据的表启用 RLS
2. **使用 auth.uid()**: 使用 Supabase 的 auth.uid() 函数获取当前用户 ID
3. **创建多个策略**: 为不同的操作 (SELECT, INSERT, UPDATE, DELETE) 创建不同的策略
4. **测试策略**: 在生产环境前充分测试 RLS 策略
5. **文档化策略**: 记录每个表的 RLS 策略和原因
6. **监控性能**: 监控 RLS 对查询性能的影响

## 常见问题

### Q: RLS 会影响性能吗?
A: 是的，RLS 会增加一些查询开销。但是安全性的收益通常大于性能成本。

### Q: 如何调试 RLS 问题?
A: 使用 `EXPLAIN ANALYZE` 查看 RLS 策略如何影响查询计划。

### Q: 如何为管理员绕过 RLS?
A: 使用 `SECURITY DEFINER` 函数或 Supabase 的服务角色。

## 参考资源

- [Supabase RLS 文档](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS 文档](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
