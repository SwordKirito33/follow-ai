# Follow.ai URL命名规范

最后更新：2026-01-12

---

## 核心原则

1. **使用名词，不使用动词**
   - ✅ `/tools` (名词)
   - ❌ `/browse-tools` (动词+名词)

2. **使用复数形式表示列表**
   - ✅ `/tools` (工具列表)
   - ✅ `/tools/:id` (单个工具详情)
   - ❌ `/tool` (单数形式用于列表)

3. **语义清晰，避免缩写**
   - ✅ `/dashboard` (清晰)
   - ❌ `/dash` (缩写)

4. **保持一致性**
   - 相似功能使用相似命名模式
   - 统一使用小写 + 连字符

---

## 标准URL模式

### 资源列表
```
GET /tools          - 获取所有工具
GET /tasks          - 获取所有任务
GET /users          - 获取所有用户
```

### 资源详情
```
GET /tools/:id      - 获取特定工具
GET /tasks/:id      - 获取特定任务
GET /users/:id      - 获取特定用户
```

### 嵌套资源
```
GET /tools/:id/reviews        - 获取工具的评论
GET /users/:id/submissions    - 获取用户的提交
```

### 操作页面
```
GET /tools/:id/edit           - 编辑工具
GET /tasks/:id/submit         - 提交任务
GET /profile/settings         - 设置页面
```

### 认证页面
```
GET /login                    - 登录
GET /signup                   - 注册
GET /forgot-password          - 忘记密码
GET /reset-password           - 重置密码
```

### 静态页面
```
GET /about                    - 关于
GET /help                     - 帮助
GET /terms                    - 服务条款
GET /privacy                  - 隐私政策
```

---

## ✅ 正确示例

| URL | 用途 | 说明 |
|-----|------|------|
| `/tools` | 工具列表 | 清晰直观 |
| `/tools/:id` | 工具详情 | RESTful风格 |
| `/login` | 登录页面 | 简洁明了 |
| `/dashboard` | 用户仪表板 | 通用命名 |
| `/profile/settings` | 设置页面 | 嵌套清晰 |

---

## ❌ 错误示例

| 错误URL | 问题 | 正确写法 |
|---------|------|----------|
| `/rankings` | 语义不清 | `/tools` |
| `/browse-tools` | 使用动词 | `/tools` |
| `/tool-list` | 多余后缀 | `/tools` |
| `/toolDetail` | 驼峰命名 | `/tools/:id` |
| `/Tools` | 大写字母 | `/tools` |

---

## 特殊说明

### API路由
```
/api/v1/tools          - RESTful API
/api/v1/users/:id      - 资源API
```

### 管理后台
```
/admin/dashboard       - 管理仪表板
/admin/users           - 用户管理
```

### 测试路由
```
/test-supabase         - 测试页面（开发环境）
```

---

## 添加新路由检查清单

在添加新路由前，请检查：

- [ ] 是否遵循命名规范
- [ ] 是否与现有路由冲突
- [ ] 是否需要保护（认证）
- [ ] 是否需要权限检查
- [ ] 是否需要添加到sitemap
- [ ] 是否需要SEO优化

---

## 当前项目路由清单

### 公开路由
- `/` - 首页
- `/tools` - 工具列表（原 /rankings）
- `/tools/:id` - 工具详情
- `/tasks` - 任务列表
- `/tasks/:id/submit` - 提交任务
- `/leaderboard` - 排行榜
- `/login` - 登录
- `/signup` - 注册（模态框）
- `/about` - 关于我们
- `/help` - 帮助中心
- `/terms` - 服务条款
- `/privacy` - 隐私政策
- `/cookie-policy` - Cookie 政策
- `/news` - 新闻
- `/submit` - 提交输出
- `/hire` - 雇佣市场
- `/hire/new` - 发布任务
- `/hire/:id` - 任务详情

### 受保护路由（需要登录）
- `/dashboard` - 用户仪表板
- `/profile` - 个人资料
- `/wallet` - 钱包
- `/history` - 提交历史
- `/xp-history` - XP 历史

### 管理员路由
- `/admin` - 管理后台
- `/admin/reviews` - 审核评论
- `/admin/xp` - XP 管理

### 重定向路由
- `/rankings` → `/tools` (向后兼容)

### 404 路由
- `*` - 404 页面

---

**创建日期：** 2026-01-12  
**维护者：** Jackson / Manus
