# 📚 Follow.ai API参考文档

> **生成时间**: 2024-12-24  
> **版本**: 2.0

---

## 1. XP服务 (xp-service.ts)

### grantXp()

授予用户XP（事件溯源）

```typescript
/**
 * 授予用户XP（事件溯源）
 * 
 * ⚠️ 重要：前端参数名与数据库字段名的映射关系
 * - userId → user_id
 * - deltaXp → amount
 * - note → reason
 * - refId → source_id
 * - refType → 不存储（仅用于前端逻辑）
 * - metadata → 不存储（仅用于前端逻辑）
 * 
 * @param userId - 用户UUID
 * @param deltaXp - XP数量（必须为正数，映射到数据库的amount字段）
 * @param source - XP来源 ('task' | 'bonus')
 * @param refType - 引用类型（可选，不存储到数据库，仅用于前端逻辑）
 * @param refId - 引用ID（可选，如任务ID，映射到数据库的source_id字段）
 * @param note - 原因说明（可选，映射到数据库的reason字段）
 * @param metadata - 额外元数据（可选，不存储到数据库）
 * @returns Promise<void>
 * @throws Error 如果数据库插入失败或deltaXp <= 0
 * 
 * @see docs/DB_SCHEMA_CANONICAL.md 查看完整的字段映射关系
 */
export async function grantXp(params: {
  userId: string;
  deltaXp: number;
  source: Exclude<XpSource, 'admin'>;
  refType?: string;
  refId?: string;
  note?: string;
  metadata?: Record<string, any>;
}): Promise<void>
```

**示例**:
```typescript
import { grantXp } from '@/lib/xp-service';

// 前端调用（使用友好参数名）
await grantXp({
  userId: user.id,
  deltaXp: 100,              // 映射到数据库的 amount 字段
  source: 'task',
  refType: 'task',            // 不存储，仅用于前端逻辑
  refId: taskId,              // 映射到数据库的 source_id 字段
  note: 'Completed task',     // 映射到数据库的 reason 字段
  metadata: { ... },          // 不存储，仅用于前端逻辑
});

// 实际数据库插入：
// {
//   user_id: user.id,
//   amount: 100,
//   reason: 'Completed task',
//   source: 'task',
//   source_id: taskId
// }
```

---

### adminGrantXp()

管理员授予/撤销XP（使用RPC）

```typescript
/**
 * 管理员授予或撤销XP
 * @param userId - 用户UUID
 * @param deltaXp - XP数量（可以为负数）
 * @param refType - 引用类型（可选）
 * @param refId - 引用ID（可选）
 * @param note - 原因说明（可选）
 * @param metadata - 额外元数据（可选）
 * @returns Promise<void>
 * @throws Error 如果RPC调用失败或deltaXp === 0
 */
export async function adminGrantXp(params: {
  userId: string;
  deltaXp: number;
  refType?: string;
  refId?: string;
  note?: string;
  metadata?: Record<string, any>;
}): Promise<void>
```

**示例**:
```typescript
import { adminGrantXp } from '@/lib/xp-service';

// 授予XP
await adminGrantXp({
  userId: 'user-uuid',
  deltaXp: 500,
  note: 'Bonus for early adopter',
});

// 撤销XP
await adminGrantXp({
  userId: 'user-uuid',
  deltaXp: -100,
  note: 'Penalty for violation',
});
```

---

### listXpEvents()

获取用户的XP事件历史

```typescript
/**
 * 获取用户的XP事件列表
 * @param userId - 用户UUID
 * @param limit - 返回数量限制（默认50）
 * @returns Promise<XpEvent[]>
 * @throws Error 如果查询失败
 */
export async function listXpEvents(
  userId: string,
  limit?: number
): Promise<XpEvent[]>
```

**示例**:
```typescript
import { listXpEvents } from '@/lib/xp-service';

const events = await listXpEvents(user.id, 20);
// 返回最近的20条XP事件
```

---

### fetchLeaderboard()

获取排行榜

```typescript
/**
 * 获取XP排行榜
 * @param limit - 返回数量限制（默认50）
 * @returns Promise<LeaderboardEntry[]>
 * @throws Error 如果查询失败
 */
export async function fetchLeaderboard(
  limit?: number
): Promise<LeaderboardEntry[]>
```

**示例**:
```typescript
import { fetchLeaderboard } from '@/lib/xp-service';

const topUsers = await fetchLeaderboard(10);
// 返回前10名用户
```

---

## 2. 游戏化配置 (gamification.ts)

### getGamificationConfig()

获取游戏化配置（等级、XP来源等）

```typescript
/**
 * 获取游戏化配置
 * @returns Promise<GamificationConfig>
 * @throws Error 如果查询失败
 */
export async function getGamificationConfig(): Promise<GamificationConfig>
```

**返回类型**:
```typescript
type GamificationConfig = {
  levels: LevelDef[];
  xp_sources: Record<string, { label: string; emoji?: string }>;
};
```

---

### getLevelFromXpWithConfig()

根据XP计算等级信息

```typescript
/**
 * 根据XP计算等级信息
 * @param xp - 当前XP值
 * @param levels - 等级配置数组
 * @returns LevelInfo
 */
export function getLevelFromXpWithConfig(
  xp: number,
  levels: LevelDef[]
): LevelInfo
```

**返回类型**:
```typescript
type LevelInfo = {
  current: LevelDef;
  next: LevelDef | null;
  progress: number; // 0-1
};
```

---

## 3. 认证上下文 (AuthContext)

### useAuth()

获取认证状态和用户信息

```typescript
/**
 * 认证Hook
 * @returns AuthContextValue
 */
export function useAuth(): AuthContextValue
```

**返回类型**:
```typescript
type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  notifyXpAction: (
    source: XpSource,
    gained: number,
    refType?: string,
    refId?: string,
    note?: string
  ) => void;
};
```

**示例**:
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, isLoading, refreshProfile } = useAuth();

if (isLoading) return <Loading />;
if (!user) return <LoginPrompt />;

// 使用用户数据
console.log(user.profile.xp);
```

---

### refreshProfile()

刷新用户资料（重新从数据库获取）

```typescript
/**
 * 刷新用户资料
 * @returns Promise<void>
 * @throws Error 如果查询失败
 */
refreshProfile(): Promise<void>
```

**示例**:
```typescript
// 在任务提交后刷新XP
await grantXp({ ... });
await refreshProfile(); // 更新UI中的XP显示
```

---

## 4. 数据库Schema

### xp_events 表

```sql
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount INTEGER NOT NULL,
  reason TEXT,
  source TEXT NOT NULL CHECK (source IN ('task', 'bonus', 'admin')),
  source_id UUID,
  is_penalty BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### profiles 表 (XP相关字段)

```sql
ALTER TABLE profiles ADD COLUMN:
  xp INTEGER DEFAULT 0,           -- 当前等级XP
  total_xp INTEGER DEFAULT 0,     -- 累计总XP
  level INTEGER DEFAULT 1;       -- 当前等级
```

---

## 5. RLS策略

### xp_events表

- **SELECT**: 用户只能查看自己的XP事件
- **INSERT**: 通过 `grantXp()` 函数插入（不直接允许用户插入）

### profiles表

- **SELECT**: 任何人都可以查看公开资料
- **UPDATE**: 用户只能更新自己的资料（但触发器会绕过RLS）

---

**下一步**: 查看 DEVELOPER_GUIDE.md 了解如何使用这些API

