# 📋 Follow.ai 项目状态检查清单

> **生成时间**: 2024-12-XX  
> **当前阶段**: 3 → 4 过渡期（能跑 → 可用）

---

## ✅ 已完成（回顾）

### A. 结构与别名统一 ✅ **最关键，已完成**

| 项目 | 状态 | 详情 |
|------|------|------|
| **@ 别名配置** | ✅ | `tsconfig.json` 和 `vite.config.ts` 已配置 `@/` → `src/` |
| **目录迁移** | ✅ | `components/`, `contexts/`, `hooks/`, `lib/`, `services/`, `types/`, `i18n/`, `constants/`, `data.ts` 已迁移到 `src/` |
| **导入路径统一** | ✅ | 46个文件从 `../xxx` 改为 `@/xxx` |
| **pages/ 目录修复** | ✅ | 22个页面文件导入路径已修复 |
| **编译状态** | ✅ | Vite正常启动，0个import error |

**验证命令**：
```bash
# 检查遗留相对路径
grep -r "from ['\"]\.\./contexts\|from ['\"]\.\./components" src/ pages/ --include="*.tsx" --include="*.ts" | wc -l
# 应该返回: 0
```

---

### B. 入口文件标准化 ✅ **已完成**

| 文件 | 状态 | 说明 |
|------|------|------|
| `src/main.tsx` | ✅ 存在 | 新的入口文件 |
| `src/App.tsx` | ✅ 存在 | 新的App组件 |
| `index.html` | ✅ 已更新 | 指向 `/src/main.tsx` |
| 根目录 `index.tsx` | ⚠️ 仍存在 | **建议删除**（已不再使用） |
| 根目录 `App.tsx` | ⚠️ 仍存在 | **建议删除**（已不再使用） |

**待清理**：
```bash
# 可以安全删除（如果确认不再使用）
rm index.tsx App.tsx
```

---

### C. Auth 初始化卡死处理 ✅ **已完成**

| 功能 | 状态 | 实现方式 |
|------|------|----------|
| **超时保护** | ✅ | `Promise.race` + 5秒超时 |
| **Fallback配置** | ✅ | 默认gamification配置 |
| **错误处理** | ✅ | try-catch + fallback |
| **页面渲染** | ✅ | 不再卡在Loading |

**代码位置**: `src/contexts/AuthContext.tsx:41-78`

**验证**：
- ✅ 页面能正常打开（不再卡Loading）
- ⚠️ **缺少失败日志**（不知道什么时候fallback被触发）

---

### D. 终端警告 ⚠️ **部分完成**

| 警告类型 | 状态 | 影响 |
|----------|------|------|
| **i18n duplicate key** | ⚠️ 待修复 | `profile` 和 `tasks` key重复，后者覆盖前者 |
| **Import errors** | ✅ 已修复 | 0个import error |

**待修复文件**：
- `src/i18n/locales/en.ts` - 重复的 `profile:` 和 `tasks:`
- `src/i18n/locales/zh.ts` - 重复的 `profile:` 和 `tasks:`

---

## ❌ 未完成 / 待验证（关键）

### ① XP/任务提交是否"真写库" ❌ **P0 - 必须验证**

**当前状态**：
- ✅ 代码层面：`TaskSubmit.tsx` 已使用 `grantXp()` 函数
- ❌ **未验证**：实际提交后数据库是否有记录

**需要验证的三件事**：

#### 1.1 检查 `xp_events` 表是否有记录

**SQL查询**：
```sql
-- 查看最近的XP事件
SELECT 
  id,
  user_id,
  delta_xp,
  source,
  ref_type,
  ref_id,
  note,
  created_at
FROM xp_events
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC
LIMIT 10;
```

**预期结果**：
- ✅ 提交任务后应该有新记录
- ✅ `source` 应该是 `'task'`
- ✅ `ref_type` 应该是 `'task'`
- ✅ `ref_id` 应该是任务ID

---

#### 1.2 检查 `profiles` 表XP是否更新

**SQL查询**：
```sql
-- 查看用户XP和等级
SELECT 
  id,
  username,
  xp,
  total_xp,
  level,
  updated_at
FROM profiles
WHERE id = 'YOUR_USER_ID';
```

**预期结果**：
- ✅ `xp` 应该增加（当前等级的XP）
- ✅ `total_xp` 应该增加（累计XP）
- ✅ `level` 可能增加（如果达到下一级）
- ✅ `updated_at` 应该是最新的

---

#### 1.3 检查前端是否能读取到变化

**检查点**：
1. 提交任务后，刷新Profile页面
2. 检查XP显示是否更新
3. 检查Level是否变化
4. 检查XP History页面是否有新记录

**如果失败**：
- 检查 `AuthContext.refreshProfile()` 是否被调用
- 检查前端读取的是 `profiles.xp` 还是 `profiles.total_xp`
- 检查是否有缓存问题

---

### ② Supabase 权限/触发器/RLS ❌ **P0 - 必须确认**

**当前状态**：
- ❌ **未找到**：数据库触发器SQL文件
- ❌ **未找到**：RLS策略定义
- ❌ **未验证**：触发器是否已创建

**需要确认的关键点**：

#### 2.1 XP事件触发器

**应该存在的触发器**：
```sql
-- 当插入 xp_events 时，自动更新 profiles.xp 和 profiles.total_xp
CREATE TRIGGER update_profiles_xp_on_event
AFTER INSERT ON xp_events
FOR EACH ROW
EXECUTE FUNCTION update_profiles_xp_from_event();
```

**检查方法**：
```sql
-- 查看所有触发器
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'xp_events';
```

**如果没有触发器**：
- XP事件会写入 `xp_events` 表
- 但 `profiles.xp` 和 `profiles.total_xp` **不会自动更新**
- 需要手动创建触发器

---

#### 2.2 RLS策略

**应该存在的策略**：

**xp_events 表**：
```sql
-- 用户只能查看自己的XP事件
CREATE POLICY "Users can view own xp_events"
ON xp_events FOR SELECT
USING (auth.uid() = user_id);

-- 用户不能直接插入（应该通过grantXp函数）
-- 或者允许插入但需要验证
```

**profiles 表**：
```sql
-- 任何人都可以查看公开资料
CREATE POLICY "Public profiles are viewable"
ON profiles FOR SELECT
USING (true);

-- 用户只能更新自己的资料
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

**检查方法**：
```sql
-- 查看所有RLS策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('xp_events', 'profiles', 'task_submissions');
```

**如果RLS阻止写入**：
- 会看到权限错误
- 需要调整RLS策略或使用service role key

---

#### 2.3 Service Role vs Anon Key

**当前使用**：
- 检查 `.env.local` 中的 `VITE_SUPABASE_ANON_KEY`
- 检查是否有 `SUPABASE_SERVICE_ROLE_KEY`（不应该在前端使用）

**正确配置**：
- 前端：使用 `anon key` + RLS策略
- 后端（如果有）：使用 `service role key`（绕过RLS）

---

### ③ 清理"重复key + 结构残留" ⚠️ **P1 - 应该做**

#### 3.1 i18n duplicate key ⚠️

**问题**：
- `en.ts` 和 `zh.ts` 都有重复的 `profile:` 和 `tasks:` key
- 后者覆盖前者，导致部分翻译丢失

**修复方案**：
1. 找到所有 `profile:` 定义，合并为一个
2. 找到所有 `tasks:` 定义，合并为一个
3. 验证修复后无warning

**预计时间**：20分钟

---

#### 3.2 根目录残留文件 ⚠️

**待删除**（如果确认不再使用）：
- `index.tsx` - 旧入口文件
- `App.tsx` - 旧App组件

**检查命令**：
```bash
# 检查这些文件是否还被引用
grep -r "from.*index\.tsx\|from.*App\.tsx" . --include="*.tsx" --include="*.ts" --exclude-dir=node_modules
```

**如果未被引用**：可以安全删除

---

#### 3.3 Git提交 ⚠️

**建议**：
- 创建一个干净的commit，包含所有迁移改动
- 方便未来回滚

**Commit信息建议**：
```
refactor: 统一项目结构，迁移所有代码到src/

- 迁移 components/, contexts/, hooks/, lib/, services/, types/, i18n/, constants/, data.ts 到 src/
- 统一所有导入路径为 @/ 别名
- 修复 pages/ 目录导入路径
- 添加 AuthContext 超时保护
- 清理根目录残留文件
```

---

### ④ 增加可观测性 ⚠️ **P1 - 应该做**

#### 4.1 Auth初始化日志 ⚠️

**当前状态**：
- ✅ 有超时保护
- ❌ **缺少**：失败时的结构化日志

**需要添加**：
```typescript
// src/contexts/AuthContext.tsx
catch (error) {
  console.warn('[Auth] Failed to load gamification config, using defaults:', {
    error: error.message,
    timestamp: new Date().toISOString(),
    userId: session?.user?.id,
    stack: error.stack,
  });
  // ... fallback
}
```

---

#### 4.2 XP发放失败日志 ⚠️

**当前状态**：
- ✅ `grantXp()` 有错误处理
- ⚠️ **部分**：有console.error，但不够结构化

**需要改进**：
```typescript
// src/lib/xp-service.ts
catch (error) {
  console.error('[XP] Failed to grant XP:', {
    userId,
    deltaXp,
    source,
    refType,
    refId,
    error: error.message,
    timestamp: new Date().toISOString(),
  });
  throw error;
}
```

---

#### 4.3 任务提交流程日志 ⚠️

**当前状态**：
- ✅ `TaskSubmit.tsx` 有 `console.log('Step 1/2/3...')`
- ⚠️ **缺少**：结构化日志和错误追踪

**建议添加**：
- 成功时：记录提交ID、XP奖励、时间
- 失败时：记录错误类型、用户ID、任务ID

---

## 📊 总结表格

| 类别 | 项目 | 状态 | 优先级 | 预计时间 |
|------|------|------|--------|----------|
| **已完成** | 结构与别名统一 | ✅ | - | - |
| **已完成** | 入口文件标准化 | ✅ | - | - |
| **已完成** | Auth初始化卡死处理 | ✅ | - | - |
| **待修复** | i18n duplicate key | ⚠️ | P1 | 20分钟 |
| **待验证** | XP系统真实性 | ❌ | **P0** | 30分钟 |
| **待验证** | Supabase触发器/RLS | ❌ | **P0** | 1小时 |
| **待清理** | 根目录残留文件 | ⚠️ | P1 | 5分钟 |
| **待改进** | 可观测性日志 | ⚠️ | P1 | 30分钟 |

---

## 🚀 推荐执行顺序

### 今天（2小时）

1. **验证XP系统**（30分钟）- **P0，最优先**
   - 提交任务 → 检查数据库 → 验证前端显示

2. **检查Supabase触发器/RLS**（1小时）- **P0，关键**
   - 检查触发器是否存在
   - 检查RLS策略
   - 修复问题（如果有）

3. **清理i18n警告**（20分钟）- P1
   - 合并重复key
   - 验证修复

4. **添加失败日志**（10分钟）- P1
   - Auth初始化日志
   - XP发放日志

### 本周（按需）

5. **清理残留文件**（5分钟）- P1
6. **Git提交**（5分钟）- P1
7. **完整流程测试**（1小时）- 验证所有功能

---

## 🎯 下一步行动

**告诉我你想先做什么**：

1. **验证XP系统** → 我给你SQL查询脚本 + 检查清单
2. **检查Supabase配置** → 我给你SQL检查脚本 + 修复方案
3. **清理i18n警告** → 我直接帮你修复
4. **添加日志** → 我给你代码片段

**建议：先做1和2（P0级别），确认系统真的可用！** 🚀

