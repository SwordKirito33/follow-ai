# 🗄️ Follow.ai 数据库Schema规范（单一真实源）

> **建立时间**: 2024-12-24  
> **权威性**: 这是所有代码、文档、AI的唯一依据  
> **更新规则**: 只有数据库schema变化时才能更新此文件

---

## ⚠️ 重要说明

**此文件是"单一真实源（Single Source of Truth）"**

- ✅ 所有代码必须与此文件一致
- ✅ 所有文档必须与此文件一致
- ✅ 所有AI生成的内容必须以此为准
- ❌ 不允许与此文件矛盾的任何内容

---

## 1. xp_events 表

### 表结构

```sql
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount INTEGER NOT NULL,              -- XP数量（正数）
  reason TEXT,                          -- 原因说明
  source TEXT NOT NULL CHECK (source IN ('task', 'bonus', 'admin')),
  source_id UUID,                       -- 关联ID（任务ID等）
  is_penalty BOOLEAN DEFAULT FALSE,     -- 是否为惩罚（负数）
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 字段说明

| 字段 | 类型 | 说明 | 前端参数映射 |
|------|------|------|-------------|
| `id` | UUID | 主键 | - |
| `user_id` | UUID | 用户ID | `userId` |
| `amount` | INTEGER | XP数量 | `deltaXp` |
| `reason` | TEXT | 原因说明 | `note` |
| `source` | TEXT | 来源 | `source` |
| `source_id` | UUID | 关联ID | `refId` |
| `is_penalty` | BOOLEAN | 是否为惩罚 | - |
| `created_at` | TIMESTAMPTZ | 创建时间 | - |

### 索引

```sql
CREATE INDEX idx_xp_events_user_id ON xp_events(user_id);
CREATE INDEX idx_xp_events_created_at ON xp_events(created_at DESC);
```

### 重要说明

- ❌ **没有 `delta_xp` 字段** - 使用 `amount`
- ❌ **没有 `note` 字段** - 使用 `reason`
- ❌ **没有 `ref_id` 字段** - 使用 `source_id`
- ❌ **没有 `ref_type` 字段** - 通过 `source` 字段区分
- ❌ **没有 `metadata` 字段** - 如需存储，使用JSONB扩展

---

## 2. profiles 表（XP相关字段）

### XP相关字段

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS:
  xp INTEGER DEFAULT 0,                -- 当前等级的XP
  total_xp INTEGER DEFAULT 0,          -- 累计总XP
  level INTEGER DEFAULT 1;             -- 当前等级
```

### 字段说明

| 字段 | 类型 | 说明 | 更新方式 |
|------|------|------|---------|
| `xp` | INTEGER | 当前等级XP | 触发器自动更新 |
| `total_xp` | INTEGER | 累计总XP | 触发器自动更新 |
| `level` | INTEGER | 当前等级 | **需要前端计算或数据库函数** |

---

## 3. 触发器

### 触发器函数

```sql
-- ⚠️ 注意：此函数需要根据实际数据库实现
-- 如果数据库中没有此函数，需要创建或使用前端计算

CREATE OR REPLACE FUNCTION update_profiles_xp_from_event()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    xp = xp + NEW.amount,
    total_xp = total_xp + NEW.amount,
    -- ⚠️ level计算：如果数据库有calculate_level函数则使用，否则前端计算
    -- level = calculate_level(total_xp + NEW.amount),  -- 如果函数存在
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 触发器

```sql
CREATE TRIGGER xp_events_after_insert
AFTER INSERT ON xp_events
FOR EACH ROW
EXECUTE FUNCTION update_profiles_xp_from_event();
```

### ⚠️ 重要说明

**Level计算策略**：

- **方案A（推荐）**: 前端计算level，然后UPDATE profiles
- **方案B**: 数据库函数 `calculate_level()` - 需要确认是否存在

**当前实现**：触发器只更新 `xp` 和 `total_xp`，`level` 由前端计算后更新。

---

## 4. RLS策略

### xp_events表

```sql
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的XP事件
CREATE POLICY "Users can view own xp_events"
ON xp_events FOR SELECT
USING (auth.uid() = user_id);

-- ⚠️ INSERT策略：根据实际RLS策略调整
-- 如果只允许task来源：
-- CREATE POLICY "Users can insert task xp"
-- ON xp_events FOR INSERT
-- WITH CHECK (auth.uid() = user_id AND source = 'task');

-- 如果允许task和bonus：
-- CREATE POLICY "Users can insert own xp"
-- ON xp_events FOR INSERT
-- WITH CHECK (auth.uid() = user_id AND source IN ('task', 'bonus'));
```

### ⚠️ 重要说明

**RLS策略限制**：

- 如果RLS只允许 `source='task'`，则 `bonus` 来源会被拒绝
- 需要根据实际RLS策略调整 `grantXp()` 的调用
- 管理员发放使用RPC函数 `admin_grant_xp`，绕过RLS

---

## 5. 前端参数映射

### grantXp() 函数参数

```typescript
// 前端调用（友好参数名）
await grantXp({
  userId: string,        // → user_id
  deltaXp: number,      // → amount
  source: 'task' | 'bonus',  // → source
  refId?: string,       // → source_id
  note?: string,        // → reason
  refType?: string,     // ⚠️ 不存储，仅用于逻辑
  metadata?: object,    // ⚠️ 不存储，仅用于逻辑
});
```

### 映射规则

| 前端参数 | 数据库字段 | 说明 |
|---------|-----------|------|
| `userId` | `user_id` | 直接映射 |
| `deltaXp` | `amount` | 直接映射 |
| `source` | `source` | 直接映射 |
| `refId` | `source_id` | 直接映射 |
| `note` | `reason` | 直接映射 |
| `refType` | - | **不存储**，仅用于前端逻辑 |
| `metadata` | - | **不存储**，仅用于前端逻辑 |

---

## 6. 验证查询

### 检查表结构

```sql
-- 查看xp_events表的所有字段
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'xp_events'
ORDER BY ordinal_position;
```

### 检查触发器

```sql
-- 查看触发器
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'xp_events';
```

### 检查RLS策略

```sql
-- 查看RLS策略
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'xp_events';
```

---

## 7. 更新日志

- **2024-12-24**: 建立单一真实源文档
- **待确认**: 触发器函数 `calculate_level()` 是否存在
- **待确认**: RLS策略是否允许 `bonus` 来源

---

**下一步**: 所有代码和文档必须与此文件对齐

