# 🚀 Follow.ai 下一步路线图

> **当前状态：阶段 3 → 4 过渡期**  
> **目标：从"能跑"到"可用"再到"可上线"**

---

## 📊 当前状态评估

### ✅ 已完成（阶段 1-3）

| 项目 | 状态 | 说明 |
|------|------|------|
| **架构重构** | ✅ 完成 | 46个文件导入路径统一，项目结构规范 |
| **编译系统** | ✅ 完成 | 0个import error，Vite正常启动 |
| **AuthContext** | ✅ 完成 | 超时保护+fallback，不再卡死 |
| **页面渲染** | ✅ 完成 | Home/Tasks/Profile等核心页面正常显示 |

### ⚠️ 待验证（阶段 4）

| 项目 | 状态 | 风险 |
|------|------|------|
| **XP系统真实性** | ⏳ 待验证 | 不确定是否真的从Supabase读取 |
| **TaskSubmit流程** | ⏳ 待验证 | 代码已用grantXp，但需实际测试 |
| **数据一致性** | ⏳ 待验证 | xp_events表是否有记录 |

### 🟡 待优化（阶段 4-5）

| 项目 | 优先级 | 影响 |
|------|--------|------|
| **i18n duplicate key** | P2 | 只是warning，不影响功能 |
| **XP Toast通知** | P1 | 用户体验不完整 |
| **Level Up Modal** | P1 | Gamification效果打折扣 |

---

## 🎯 三步走计划

### Phase 1: 快速验证（1小时）🔥 **推荐先做**

**目标**：确认系统真的能用，不是"看起来能用"

#### Step 1.1: 验证XP系统（30分钟）

**检查清单**：

```bash
# 1. 登录测试账号
# 2. 查看Profile页面，记录当前XP和Level
# 3. 提交一个任务
# 4. 检查Supabase数据库：
```

**SQL查询**：

```sql
-- 检查xp_events表是否有新记录
SELECT * FROM xp_events 
WHERE user_id = 'YOUR_USER_ID' 
ORDER BY created_at DESC 
LIMIT 5;

-- 检查profiles表XP是否更新
SELECT id, username, xp, total_xp, level 
FROM profiles 
WHERE id = 'YOUR_USER_ID';

-- 检查task_submissions表
SELECT id, task_id, user_id, status, reward_xp_awarded, created_at
FROM task_submissions
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC
LIMIT 5;
```

**预期结果**：
- ✅ `xp_events` 表有新记录
- ✅ `profiles.xp` 和 `profiles.total_xp` 已更新
- ✅ 前端Profile页面显示新XP

**如果失败**：
- 检查 `grantXp` 函数是否被调用
- 检查数据库触发器是否正常
- 检查RLS策略是否允许写入

---

#### Step 1.2: 清理i18n警告（20分钟）

**问题**：
- `en.ts` 和 `zh.ts` 都有重复的 `profile` 和 `tasks` key
- 后者覆盖前者，导致部分翻译丢失

**修复方案**：

1. **合并重复的key**：
   - 找到所有 `profile:` 定义，合并为一个
   - 找到所有 `tasks:` 定义，合并为一个

2. **验证修复**：
   ```bash
   npm run dev
   # 应该看到 0 个 duplicate key warning
   ```

**预期结果**：
- ✅ 终端0 warning
- ✅ 所有翻译正常显示

---

#### Step 1.3: 添加失败兜底日志（10分钟）

**目标**：知道什么时候fallback被触发

**修改位置**：`src/contexts/AuthContext.tsx`

```typescript
catch (error) {
  console.warn('[Auth] Failed to load gamification config, using defaults:', {
    error: error.message,
    timestamp: new Date().toISOString(),
    userId: session?.user?.id,
  });
  // ... fallback config
}
```

**预期结果**：
- ✅ 如果Supabase查询失败，控制台会有明确警告
- ✅ 可以追踪失败频率

---

### Phase 2: 用户体验完善（2小时）🎨

**目标**：让用户感受到"真的在玩游戏"

#### Step 2.1: XP获得Toast通知（30分钟）

**实现位置**：`src/components/XpEventRenderer.tsx` 已存在，但需要确保正常工作

**检查点**：
1. `xp:earned` 事件是否被正确触发
2. `XpEarnedToastCard` 是否显示
3. Toast位置和样式是否合适

**如果未实现**：
- 使用现有的 `useToast` hook
- 在 `TaskSubmit` 成功后显示简单Toast

---

#### Step 2.2: Level Up Modal集成（1小时）

**检查点**：
1. `LevelUpModal` 组件是否存在
2. `XpEventRenderer` 是否检测到level up
3. Modal动画是否流畅

**如果未实现**：
- 参考 `src/components/LevelUpModal.tsx`
- 确保 `XpEventRenderer` 正确调用

---

#### Step 2.3: XP进度条动画（30分钟）

**检查点**：
- Profile页面XP进度条是否有平滑过渡
- Dashboard页面XP显示是否正确

**已实现**：代码中已有 `transition-all duration-700 ease-out`

---

### Phase 3: 完整流程验证（1-2小时）🔍

**目标**：确保核心用户流程端到端可用

#### 核心流程测试清单

```
1. 用户注册/登录 ✅
   ↓
2. 浏览工具列表 ✅
   ↓
3. 查看任务列表 ✅
   ↓
4. 提交任务 ⏳ 需验证
   ↓
5. 获得XP ⏳ 需验证
   ↓
6. 看到Level变化 ⏳ 需验证
   ↓
7. 查看XP历史 ⏳ 需验证
   ↓
8. 查看排行榜 ⏳ 需验证
```

**测试步骤**：

1. **完整提交流程**：
   - 登录 → Tasks页面 → 选择一个任务 → 填写表单 → 提交
   - 检查：是否成功？是否有错误提示？

2. **XP系统验证**：
   - 提交后立即检查Profile页面
   - 检查XP是否增加
   - 检查Level是否变化
   - 检查XP History页面是否有记录

3. **Leaderboard验证**：
   - 检查Leaderboard页面是否显示数据
   - 检查排序是否正确

---

## 🎯 推荐执行顺序

### 今天（2小时）

1. ✅ **Phase 1.1: 验证XP系统**（30分钟）
   - 这是最关键的，确认系统真的work
   
2. ✅ **Phase 1.2: 清理i18n**（20分钟）
   - 快速提升代码质量

3. ✅ **Phase 2.1: XP Toast**（30分钟）
   - 给用户即时反馈

4. ✅ **Phase 1.3: 添加日志**（10分钟）
   - 为未来debug做准备

### 本周（按需）

5. ⏳ **Phase 2.2: Level Up Modal**（1小时）
   - 如果XP系统验证通过，这个很重要

6. ⏳ **Phase 3: 完整流程验证**（1-2小时）
   - 确保所有功能端到端可用

---

## 🚨 风险预警

### 如果XP系统验证失败

**可能原因**：
1. 数据库触发器未创建
2. RLS策略阻止写入
3. `grantXp` 函数有bug
4. Supabase连接问题

**应对方案**：
- 检查 `src/lib/xp-service.ts` 实现
- 检查Supabase Dashboard中的触发器
- 检查RLS策略

---

## 📝 技术债务清单

### P0（必须修）：无 ✅

### P1（应该修）：
- [ ] XP系统验证
- [ ] TaskSubmit完整测试
- [ ] XP Toast通知

### P2（可以修）：
- [ ] i18n duplicate key
- [ ] Level Up Modal
- [ ] 失败兜底日志

---

## 🎓 总结

**你现在的位置**：
- ✅ 工程层：稳定（编译、结构、基础功能）
- ⏳ 数据层：待验证（XP系统是否真实）
- ⏳ 体验层：待完善（Toast、Modal、动画）

**下一步重点**：
> **先验证，再优化**

不要急着做新功能，先确认现有功能真的work。

---

## 🚀 立即行动

**选择你的下一步**：

1. **我想验证XP系统** → 我给你SQL查询 + 检查清单
2. **我想清理i18n** → 我直接帮你修复
3. **我想实现Toast** → 我给你最简单的实现
4. **我想完整测试流程** → 我给你测试清单

**告诉我你想做什么，我们立即开始！** 🎯

