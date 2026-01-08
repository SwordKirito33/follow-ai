# Follow.ai 数据库结构分析

## 项目信息
- **Project ID**: nbvnnhojvkxfnididast
- **Region**: ap-south-1
- **Status**: ACTIVE_HEALTHY
- **Database Version**: PostgreSQL 17.6.1.054

## 现有表结构 (43 张表)

### 核心业务表

#### 1. profiles (用户资料)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键，关联 auth.users |
| username | text | 用户名，唯一 |
| full_name | text | 全名 |
| avatar_url | text | 头像 URL |
| bio | text | 个人简介 |
| total_xp | integer | 总 XP (默认 0) |
| xp | integer | 当前等级 XP |
| level | integer | 等级 (默认 1) |
| total_earnings | numeric | 总收入 |
| wallet_balance | numeric | 钱包余额 |
| reputation_score | integer | 声誉分 (0-1000) |
| profile_completion | integer | 资料完成度 (0-100) |
| skills | jsonb | 技能数组 |
| ai_tools | jsonb | AI 工具数组 |
| stripe_customer_id | text | Stripe 客户 ID |
| stripe_connect_id | text | Stripe Connect ID |

#### 2. tasks (任务)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| title | text | 标题 |
| description | text | 描述 |
| difficulty | text | 难度 (beginner/intermediate/advanced) |
| xp_reward | integer | XP 奖励 |
| task_type | text | 类型 (xp/paid) |
| paid_amount | numeric | 付费金额 |
| status | text | 状态 (默认 todo) |
| creator_id | uuid | 创建者 ID |
| tool_id | uuid | 关联工具 ID |

#### 3. task_submissions (任务提交)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| task_id | uuid | 任务 ID |
| user_id | uuid | 用户 ID |
| output_url | text | 输出 URL |
| output_text | text | 输出文本 |
| experience_text | text | 体验描述 |
| ai_tools_used | text[] | 使用的 AI 工具 |
| status | text | 状态 (pending/approved/rejected) |
| reward_xp_awarded | integer | 已奖励 XP |
| reviewed_by | uuid | 审核者 ID |
| reviewed_at | timestamptz | 审核时间 |
| review_notes | text | 审核备注 |

#### 4. xp_events (XP 事件日志)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户 ID |
| amount | integer | XP 数量 (>0) |
| delta_xp | integer | XP 变化量 |
| reason | text | 原因 |
| source | text | 来源 |
| source_id | uuid | 来源 ID |
| ref_id | uuid | 引用 ID |
| is_penalty | boolean | 是否扣除 |
| metadata | jsonb | 元数据 |

#### 5. notifications (通知) ⚠️ 需要添加 RLS
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户 ID |
| type | varchar | 通知类型 |
| title | varchar | 标题 |
| message | text | 消息内容 |
| data | jsonb | 附加数据 |
| read | boolean | 是否已读 (默认 false) |
| created_at | timestamptz | 创建时间 |

**问题**: RLS 未启用！

### 游戏化系统表

#### 6. gamification_config (游戏化配置)
| 字段 | 类型 | 说明 |
|------|------|------|
| key | text | 配置键 |
| variant | text | 变体 (默认 'default') |
| value | jsonb | 配置值 |
| updated_at | timestamptz | 更新时间 |

#### 7. achievements (成就定义)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| name | varchar | 成就名称 |
| description | text | 描述 |
| icon | varchar | 图标 |
| category | varchar | 分类 |
| rarity | varchar | 稀有度 |
| xp_reward | integer | XP 奖励 |
| requirement_type | varchar | 要求类型 |
| requirement_value | integer | 要求值 |

#### 8. user_achievements (用户成就)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户 ID |
| achievement_id | uuid | 成就 ID |
| unlocked_at | timestamptz | 解锁时间 |

### 管理员系统表

#### 9. app_admins (管理员)
| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | uuid | 用户 ID (主键) |
| created_at | timestamptz | 创建时间 |

#### 10. audit_logs (审计日志)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户 ID |
| action | text | 操作 |
| table_name | text | 表名 |
| record_id | uuid | 记录 ID |
| old_data | jsonb | 旧数据 |
| new_data | jsonb | 新数据 |
| ip_address | inet | IP 地址 |
| user_agent | text | 用户代理 |

### 其他表
- tools (AI 工具)
- reviews (评测)
- payments (支付)
- wallets (钱包)
- transactions (交易)
- invitations (邀请)
- prompts (提示词)
- prompt_categories (提示词分类)
- prompt_likes (提示词点赞)
- prompt_purchases (提示词购买)
- seller_accounts (卖家账户)
- subscription_plans (订阅计划)
- user_subscriptions (用户订阅)
- daily_checkins (每日签到)
- user_follows (用户关注)
- user_preferences (用户偏好)

## RLS 策略分析

### 已启用 RLS 的表
- profiles ✅
- tasks ✅
- task_submissions ✅
- xp_events ✅
- reviews ✅
- payments ✅
- wallets ✅
- app_admins ✅

### 需要添加 RLS 的表 ⚠️
- **notifications** - RLS 未启用，无策略
- achievements - 需要检查
- user_achievements - 需要检查

## 关键发现

### 1. 登出流程
现有实现已包含：
- 清空用户状态
- 清理 localStorage
- Supabase signOut
- 强制跳转首页

**问题**: 没有清理 React Query 缓存和 Realtime 订阅

### 2. 通知系统
- notifications 表已存在
- 但 RLS 未启用 ⚠️
- 前端使用 Mock 数据，未连接真实数据库

### 3. 游戏化系统
- gamification_config 表已存在
- achievements 和 user_achievements 表已存在
- 但没有 Success Score 计算逻辑

### 4. 管理员系统
- app_admins 表已存在
- 但没有 Admin Dashboard 页面
- 没有 AI Review 功能

## 需要的数据库修改

### 1. 启用 notifications RLS
```sql
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);
```

### 2. 添加 admin_role 字段到 app_admins
```sql
ALTER TABLE app_admins ADD COLUMN IF NOT EXISTS role text DEFAULT 'admin';
ALTER TABLE app_admins ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '[]';
```

### 3. 添加 Success Score 视图
```sql
CREATE OR REPLACE VIEW user_success_scores AS
SELECT 
  p.id as user_id,
  p.total_xp,
  p.level,
  COUNT(DISTINCT ts.id) FILTER (WHERE ts.status = 'approved') as approved_submissions,
  COUNT(DISTINCT ua.id) as achievements_count,
  COALESCE(p.reputation_score, 0) as reputation_score
FROM profiles p
LEFT JOIN task_submissions ts ON ts.user_id = p.id
LEFT JOIN user_achievements ua ON ua.user_id = p.id
GROUP BY p.id;
```
