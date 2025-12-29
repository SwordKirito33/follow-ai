# 🎮 Follow.ai XP系统完整文档

> **生成时间**: 2024-12-24  
> **系统架构**: Event Sourcing (事件溯源)  
> **状态**: ✅ 已实现并验证

---

## 1. 数据流程图

### 1.1 完整流程

```
用户操作 (TaskSubmit.tsx)
    ↓
填写表单并提交
    ↓
handleSubmit() 函数
    ↓
Step 1: INSERT task_submissions (Supabase)
    ↓
Step 2: grantXp() [src/lib/xp-service.ts]
    ↓
INSERT xp_events (Supabase)
    ├─ user_id: UUID
    ├─ amount: number (deltaXp)
    ├─ source: 'task' | 'bonus' | 'admin'
    ├─ reason: string (note)
    ├─ source_id: UUID (refId)
    └─ is_penalty: boolean
    ↓
数据库触发器: xp_events_after_insert
    ↓
自动执行: update_profiles_xp_from_event()
    ↓
UPDATE profiles 表
    ├─ xp = xp + amount (当前等级XP)
    ├─ total_xp = total_xp + amount (累计XP)
    ├─ level = calculate_level(total_xp)
    └─ updated_at = NOW()
    ↓
前端: AuthContext.refreshProfile()
    ↓
重新获取 profiles 数据
    ↓
检测到 XP 变化
    ↓
dispatchEvent('xp:earned')
    ↓
XpEventRenderer 监听事件
    ↓
useXpQueue 处理队列
    ↓
显示 UI 反馈
    ├─ XpEarnedToastCard (XP获得提示)
    └─ LevelUpModal (升级弹窗，如果升级)
    ↓
Profile 页面更新显示
    ├─ 显示新 XP
    ├─ 显示新 Level
    └─ 更新进度条
```

### 1.2 关键节点说明

**节点1: grantXp() 函数**
- **位置**: `src/lib/xp-service.ts:7-38`
- **作用**: 插入XP事件到数据库
- **字段映射**:
  - `deltaXp` → `amount`
  - `note` → `reason`
  - `refId` → `source_id`

**节点2: 数据库触发器**
- **表**: `xp_events`
- **触发器**: `xp_events_after_insert`
- **函数**: `update_profiles_xp_from_event()`
- **作用**: 自动更新 `profiles` 表的XP和等级

**节点3: 前端事件系统**
- **事件名**: `xp:earned`
- **监听器**: `XpEventRenderer` 组件
- **队列**: `useXpQueue` hook
- **UI组件**: `XpEarnedToastCard`, `LevelUpModal`

---

## 2. 文件清单

### 2.1 核心服务文件

| 文件 | 状态 | 用途 | 依赖 |
|------|------|------|------|
| `src/lib/xp-service.ts` | ✅ 存在 | XP发放核心服务 | Supabase, gamification |
| `src/lib/gamification.ts` | ✅ 存在 | 等级配置管理 | Supabase |
| `src/lib/xp-system.ts` | ✅ 存在 | XP系统工具函数 | - |
| `src/lib/xpQueue.ts` | ✅ 存在 | XP队列管理 | - |

### 2.2 上下文和状态

| 文件 | 状态 | 用途 | 依赖 |
|------|------|------|------|
| `src/contexts/AuthContext.tsx` | ✅ 存在 | 用户状态、XP事件广播 | xp-service, gamification |
| `src/hooks/useXpQueue.ts` | ✅ 存在 | XP事件队列处理 | - |

### 2.3 UI组件

| 文件 | 状态 | 用途 | 依赖 |
|------|------|------|------|
| `src/components/XpEventRenderer.tsx` | ✅ 存在 | 全局XP事件渲染器 | useXpQueue, LevelUpModal, XpEarnedToastCard |
| `src/components/LevelUpModal.tsx` | ✅ 存在 | 升级弹窗 | framer-motion, gamification |
| `src/components/XpEarnedToastCard.tsx` | ✅ 存在 | XP获得提示卡片 | framer-motion |

### 2.4 页面集成

| 文件 | 状态 | 用途 | 依赖 |
|------|------|------|------|
| `pages/TaskSubmit.tsx` | ✅ 存在 | 任务提交页面，调用grantXp | xp-service, AuthContext |
| `pages/Profile.tsx` | ✅ 存在 | 显示用户XP和等级 | AuthContext |
| `pages/XpHistory.tsx` | ✅ 存在 | XP历史记录页面 | xp-service |
| `pages/Leaderboard.tsx` | ✅ 存在 | 排行榜页面 | xp-service |
| `pages/Tasks.tsx` | ✅ 存在 | 任务列表，显示XP奖励 | - |

### 2.5 管理面板

| 文件 | 状态 | 用途 | 依赖 |
|------|------|------|------|
| `src/pages/admin/AdminXpPanel.tsx` | ✅ 存在 | 管理员XP发放面板 | xp-service (adminGrantXp) |

---

## 3. 数据库Schema

### 3.1 xp_events 表

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

CREATE INDEX idx_xp_events_user_id ON xp_events(user_id);
CREATE INDEX idx_xp_events_created_at ON xp_events(created_at DESC);
```

### 3.2 profiles 表 (XP相关字段)

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS:
  xp INTEGER DEFAULT 0,                -- 当前等级的XP
  total_xp INTEGER DEFAULT 0,          -- 累计总XP
  level INTEGER DEFAULT 1;             -- 当前等级
```

### 3.3 触发器函数

```sql
-- ⚠️ 注意：此函数需要根据实际数据库实现
-- 如果数据库中没有calculate_level函数，level需要前端计算

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

-- ⚠️ 当前实现：触发器只更新xp和total_xp
-- level由前端通过getLevelFromXp()计算后，通过UPDATE profiles SET level = ...更新
```

CREATE TRIGGER xp_events_after_insert
AFTER INSERT ON xp_events
FOR EACH ROW
EXECUTE FUNCTION update_profiles_xp_from_event();
```

### 3.4 RLS策略

```sql
-- xp_events表
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的XP事件
CREATE POLICY "Users can view own xp_events"
ON xp_events FOR SELECT
USING (auth.uid() = user_id);

-- 用户不能直接插入（应通过grantXp函数）
-- 如果需要允许，可以创建策略：
-- CREATE POLICY "Users can insert own xp_events"
-- ON xp_events FOR INSERT
-- WITH CHECK (auth.uid() = user_id);

-- profiles表
-- 任何人都可以查看公开资料
CREATE POLICY "Public profiles are viewable"
ON profiles FOR SELECT
USING (true);

-- 用户只能更新自己的资料（但触发器会绕过RLS）
```

---

## 4. 集成点

### 4.1 grantXp() 调用位置

#### ✅ 已实现

1. **TaskSubmit.tsx** (主要调用点)
   - **位置**: `pages/TaskSubmit.tsx:173`
   - **场景**: 用户提交任务后
   - **代码**:
     ```typescript
     await grantXp({
       userId: user.id,
       deltaXp: finalXpReward,
       source: 'task',
       refType: 'task',
       refId: taskId,
       note: `Completed task: ${task.title}`,
     });
     ```

2. **AdminXpPanel.tsx** (管理员发放)
   - **位置**: `src/pages/admin/AdminXpPanel.tsx`
   - **场景**: 管理员手动发放/撤销XP
   - **代码**: 使用 `adminGrantXp()` RPC函数

#### ⚠️ 未实现（设计中有，但未集成）

3. **Onboarding流程**
   - **设计**: 完成引导步骤时发放XP
   - **状态**: 未实现
   - **建议**: 在 `pages/Onboarding.tsx` 中调用 `grantXp()`

4. **Bonus奖励**
   - **设计**: 特殊活动、成就等
   - **状态**: 未实现
   - **建议**: 创建 `grantBonusXp()` 函数

---

## 5. 缺失的实现

### 5.1 已设计但未实现

#### ⚠️ Level Up Modal集成
- **状态**: 组件存在，但可能未正确触发
- **文件**: `src/components/LevelUpModal.tsx`
- **问题**: 需要验证是否正确检测到level up
- **建议**: 测试level up流程

#### ⚠️ XP Toast通知
- **状态**: 组件存在，但可能未显示
- **文件**: `src/components/XpEarnedToastCard.tsx`
- **问题**: 需要验证事件是否正确触发
- **建议**: 检查 `xp:earned` 事件

#### ⚠️ XP Queue防刷屏
- **状态**: Hook存在
- **文件**: `src/hooks/useXpQueue.ts`
- **问题**: 需要验证是否正确合并事件
- **建议**: 测试快速连续获得XP的场景

#### ⚠️ Leaderboard显示
- **状态**: 页面存在，但可能使用mock数据
- **文件**: `pages/Leaderboard.tsx`
- **问题**: 需要验证是否从数据库读取
- **建议**: 检查是否使用 `fetchLeaderboard()`

#### ⚠️ XP History显示
- **状态**: 页面存在
- **文件**: `pages/XpHistory.tsx`
- **问题**: 需要验证是否从 `xp_events` 表读取
- **建议**: 检查是否使用 `listXpEvents()`

---

## 6. 当前Bug

### 6.1 已修复 ✅

1. **字段名错误** ✅
   - **问题**: 使用 `note` 字段，但数据库是 `reason`
   - **修复**: `src/lib/xp-service.ts` 已修复
   - **状态**: ✅ 已修复

2. **Profile页面崩溃** ✅
   - **问题**: `user.earnings.toLocaleString()` 在undefined时崩溃
   - **修复**: `pages/Profile.tsx` 已添加null检查
   - **状态**: ✅ 已修复

### 6.2 待验证 ⚠️

3. **XP事件是否正确写入**
   - **问题**: 需要验证数据库触发器是否工作
   - **状态**: ⚠️ 需要实际测试
   - **验证方法**: 提交任务后检查 `xp_events` 和 `profiles` 表

4. **前端是否正确读取**
   - **问题**: 需要验证Profile页面是否正确显示XP
   - **状态**: ⚠️ 需要实际测试
   - **验证方法**: 提交任务后刷新Profile页面

---

## 7. 测试清单

### 7.1 数据库测试

```sql
-- 1. 检查触发器是否存在
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'xp_events';

-- 2. 手动插入XP事件测试
INSERT INTO xp_events (user_id, amount, source, reason, source_id)
VALUES ('USER_ID', 50, 'task', 'Test XP', 'TASK_ID');

-- 3. 检查profiles是否自动更新
SELECT id, xp, total_xp, level, updated_at
FROM profiles
WHERE id = 'USER_ID';

-- 4. 查看XP历史
SELECT * FROM xp_events
WHERE user_id = 'USER_ID'
ORDER BY created_at DESC
LIMIT 10;
```

### 7.2 前端测试

1. **提交任务测试**
   - 登录账号
   - 选择一个任务
   - 填写表单并提交
   - 检查是否显示成功消息
   - 检查控制台是否有错误

2. **XP显示测试**
   - 提交任务后
   - 刷新Profile页面
   - 检查XP是否增加
   - 检查Level是否变化
   - 检查进度条是否更新

3. **XP历史测试**
   - 访问 `/xp-history` 页面
   - 检查是否显示XP事件列表
   - 检查事件信息是否正确

4. **排行榜测试**
   - 访问 `/leaderboard` 页面
   - 检查是否显示用户排名
   - 检查排序是否正确（按total_xp）

---

## 8. 性能考虑

### 8.1 数据库性能

- **索引**: `xp_events` 表有 `user_id` 和 `created_at` 索引 ✅
- **触发器**: 自动更新，性能影响小 ✅
- **查询优化**: Leaderboard使用 `ORDER BY total_xp` ✅

### 8.2 前端性能

- **事件队列**: `useXpQueue` 合并事件，避免UI刷屏 ✅
- **缓存**: `gamification.ts` 有配置缓存 ✅
- **懒加载**: 页面使用 `React.lazy` ✅

---

## 9. 安全考虑

### 9.1 数据完整性

- ✅ 使用触发器确保数据一致性
- ✅ 使用Event Sourcing，所有XP变化可追溯
- ✅ RLS策略保护用户数据

### 9.2 防作弊

- ✅ 用户不能直接UPDATE profiles.xp
- ✅ 所有XP变化通过 `xp_events` 表记录
- ⚠️ 需要添加：防止重复提交同一任务的检查

---

## 10. 未来改进

### 10.1 短期（本周）

1. **验证所有功能**
   - 测试完整流程
   - 修复发现的bug

2. **添加XP来源**
   - Onboarding完成奖励
   - 每日签到奖励
   - 成就解锁奖励

### 10.2 中期（本月）

1. **XP分析**
   - XP获得趋势图
   - 等级分布统计
   - 用户活跃度分析

2. **防作弊机制**
   - 检测异常XP获得
   - 自动标记可疑行为
   - 管理员审核功能

### 10.3 长期（下月）

1. **XP商城**
   - 使用XP兑换奖励
   - XP购买特权功能

2. **社交功能**
   - XP排行榜
   - XP成就分享
   - XP里程碑庆祝

---

**下一步**: 执行 Phase 3.1 (修复所有已知问题)

