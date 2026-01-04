# Follow.ai 产品架构文档

## 1. 产品定位

**Follow.ai** 是全球首个要求提交真实工作输出的 AI 工具评测平台。与传统评测平台不同，用户必须提交实际使用 AI 工具产生的真实输出作为评测证据，平台会验证并评分，用户可以因此获得报酬。

### 核心价值主张
- **真实性**：每个评测都必须附带真实的 AI 输出证据
- **可验证**：平台 AI + 人工双重验证机制
- **有报酬**：高质量评测可获得 $20-200 的报酬
- **可信赖**：建立最可信的 AI 工具基准测试数据库

## 2. 用户角色

### 2.1 测试者 (Tester)
- 选择 AI 工具进行测试
- 提交真实的 prompt 和 output
- 获得 XP 积分和现金奖励
- 参与排行榜竞争

### 2.2 企业用户 (Enterprise)
- 发布测试任务 (Bounty Tasks)
- 雇佣专业测试者 (Hire)
- 获取 AI 工具的真实性能数据

### 2.3 管理员 (Admin)
- 审核提交的评测
- 管理 XP 分配
- 处理争议和投诉

## 3. 核心功能模块

### 3.1 首页 (Home)
```
路由: /
功能:
├── 开场动画 (IntroAnimation)
├── Live Activity 滚动条
├── Hero 区域 - 核心价值展示
├── How It Works - 流程说明
├── Rankings - 今日 Top AI 工具
├── Categories - 分类浏览
├── Why Different - 差异化对比
├── Recent Reviews - 最新验证评测
├── News Widget - AI 新闻
├── Coming Soon - 即将上线工具
└── Newsletter - 邮件订阅
```

### 3.2 工具浏览 (Browse Tools)
```
路由: /rankings
功能:
├── 分类筛选 (Coding, Image, Writing, Video, Audio, Data)
├── 排序选项 (Score, Reviews, Trending)
├── 工具卡片展示
└── 工具详情页 (/tool/:id)
```

### 3.3 赚钱任务 (Earn Money)
```
路由: /tasks
功能:
├── 任务列表
├── 任务筛选 (难度, 报酬, 类别)
├── 任务详情
├── 任务提交 (/task/:taskId/submit)
└── 任务创建 (/tasks/create) - 企业用户
```

### 3.4 排行榜 (Leaderboard)
```
路由: /leaderboard
功能:
├── 全球排名
├── 周/月/全时段筛选
├── 用户等级和徽章展示
└── 个人排名追踪
```

### 3.5 用户中心
```
路由:
├── /profile - 个人资料
├── /dashboard - 数据仪表板
├── /wallet - XP 钱包
├── /xp-history - XP 历史记录
├── /history - 提交历史
└── /settings - 设置
```

### 3.6 提交评测 (Submit Output)
```
路由: /submit
功能:
├── 选择 AI 工具
├── 输入 Prompt
├── 上传 Output (文本/图片/视频)
├── AI 自动评分
└── 提交审核
```

### 3.7 雇佣系统 (Hire)
```
路由:
├── /hire - 雇佣列表
├── /hire/new - 发布雇佣需求
└── /hire/:id - 雇佣详情
```

### 3.8 其他页面
```
路由:
├── /news - AI 新闻
├── /about - 关于我们
├── /help - 帮助中心
├── /terms - 服务条款
├── /privacy - 隐私政策
└── /cookie-policy - Cookie 政策
```

## 4. 数据模型

### 4.1 用户 (users)
- id, email, username, avatar
- level, xp_balance, total_earned
- created_at, last_active

### 4.2 工具 (tools)
- id, name, category, description
- logo, website, pricing
- avg_score, review_count

### 4.3 评测 (reviews)
- id, user_id, tool_id
- prompt, output, score
- status (pending/approved/rejected)
- reward_amount

### 4.4 任务 (tasks)
- id, creator_id, tool_id
- title, description, requirements
- reward, deadline, difficulty
- status, submissions_count

### 4.5 XP 交易 (xp_transactions)
- id, user_id, amount, type
- description, created_at

## 5. 用户流程

### 5.1 新用户流程
```
访问首页 → 观看开场动画 → 浏览工具/任务 → 注册账号 → 完成 Onboarding → 开始测试
```

### 5.2 测试者流程
```
选择工具/任务 → 使用 AI 工具 → 提交 Prompt + Output → 等待审核 → 获得 XP/现金
```

### 5.3 企业用户流程
```
注册企业账号 → 发布测试任务 → 设置奖励 → 审核提交 → 获取数据报告
```

## 6. 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS + 自定义玻璃态主题
- **路由**: React Router (HashRouter)
- **状态**: React Context + Hooks
- **后端**: Supabase (PostgreSQL + Auth + Storage)
- **部署**: Vercel
- **动画**: Framer Motion

## 7. 设计系统

### 7.1 颜色
```css
--bg-primary: #0A0E27 (深蓝黑)
--bg-secondary: #1A1F3A (深紫蓝)
--primary-cyan: #06B6D4 (青色)
--primary-blue: #3B82F6 (蓝色)
--accent-purple: #8B5CF6 (紫色)
--accent-green: #10B981 (绿色)
--accent-gold: #F59E0B (金色)
--text-primary: #F8FAFC (白色)
--text-secondary: #94A3B8 (灰色)
```

### 7.2 组件风格
- 玻璃态卡片 (glass-card)
- 渐变文字 (gradient-text)
- 动态光效背景
- 微交互动画

## 8. 待优化项

1. **性能**: 减少 Supabase 查询次数，添加缓存
2. **安全**: 输入验证、XSS 防护、API 限流
3. **国际化**: 完善多语言支持，货币本地化
4. **可访问性**: 颜色对比度优化，键盘导航
5. **移动端**: 响应式布局优化
