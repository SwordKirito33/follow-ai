# 导航链接检查清单

最后更新：2026-01-12

---

## 📋 每次修改导航链接后必须检查

### 1. Hero Section（首页）

**文件：** `src/components/Hero.tsx`

- [ ] "Start Earning" 按钮 → `/submit`
- [ ] "Browse Tools" 按钮 → `/tools`
- [ ] 其他CTA按钮链接正确

---

### 2. Navbar（导航栏）

**文件：** `src/components/Navbar.tsx`

**桌面端导航**:
- [ ] "Browse Tools" → `/tools`
- [ ] "Earn Money" → `/tasks`
- [ ] "Leaderboard" → `/leaderboard`
- [ ] "Login" 按钮 → `/login` 或打开模态框
- [ ] "Dashboard" → `/dashboard`（已登录用户）
- [ ] "Profile" → `/profile`（已登录用户）
- [ ] "Wallet" → `/wallet`（已登录用户）
- [ ] Logo → `/` (首页)
- [ ] Active状态检查正确（高亮当前页面）

**移动端导航**:
- [ ] "Browse Tools" → `/tools`
- [ ] "Earn Money" → `/tasks`
- [ ] "Rankings" → `/tools`
- [ ] "AI News" → `/news`
- [ ] "About" → `/about`

---

### 3. Footer（页脚）

**文件：** `src/components/Footer.tsx`

**Product 栏**:
- [ ] "Browse Tools" → `/tools`
- [ ] "Earn Money" → `/tasks`
- [ ] "Leaderboard" → `/tools`
- [ ] "Submit Output" → `/submit`

**Company 栏**:
- [ ] "About" → `/about`
- [ ] "Blog" → `/news`
- [ ] "Contact" → `mailto:hello@follow.ai`

**Legal 栏**:
- [ ] "Terms of Service" → `/terms`
- [ ] "Privacy Policy" → `/privacy`
- [ ] "Cookie Policy" → `/cookie-policy`

---

### 4. Home Page（首页）

**文件：** `src/pages/Home.tsx`

- [ ] "View Rankings" 链接 → `/tools`
- [ ] 分类卡片链接 → `/tools`
- [ ] "View Tasks" 按钮 → `/tasks`
- [ ] "Submit" 链接 → `/submit`

---

### 5. Dashboard快捷链接

**文件：** `src/pages/Dashboard.tsx`

- [ ] "Submit Review" → `/submit`
- [ ] "Browse Tools" → `/tools`
- [ ] "View Tasks" → `/tasks`
- [ ] "Wallet" → `/wallet`
- [ ] "Profile" → `/profile`

---

### 6. Command Palette（命令面板）

**文件：** `src/components/CommandPalette.tsx`

- [ ] "Go to Home" → `/`
- [ ] "Browse Tools" → `/tools`
- [ ] "Hire Marketplace" → `/hire`
- [ ] "Earn Money" → `/tasks`
- [ ] "Submit Output" → `/submit`
- [ ] "My Profile" → `/profile`

---

### 7. 路由定义检查

**文件：** `src/App.tsx`

**必须存在的路由**:
- [ ] `/` - 首页路由已定义
- [ ] `/tools` - 工具列表路由已定义
- [ ] `/tools/:id` - 工具详情路由已定义（实际是 `/tool/:id`）
- [ ] `/login` - 登录路由已定义
- [ ] `/dashboard` - 仪表板路由已定义
- [ ] `/profile` - 个人资料路由已定义
- [ ] `*` - 404路由已定义（必须在最后）

**重定向路由**:
- [ ] `/rankings` → `/tools` (向后兼容)

---

## 🧪 测试步骤

### 手动测试
1. [ ] 打开网站首页
2. [ ] 依次点击每个导航链接
3. [ ] 确认跳转到正确页面
4. [ ] 检查Active状态高亮
5. [ ] 测试移动端菜单
6. [ ] 测试所有按钮和CTA
7. [ ] 测试命令面板（Cmd/Ctrl + K）

### URL格式测试
1. [ ] 确认URL中**没有#号**
2. [ ] 访问 `/tools`，刷新页面，确认不会404
3. [ ] 访问 `/rankings`，确认重定向到 `/tools`
4. [ ] 浏览器前进/后退按钮正常工作

### 浏览器测试
- [ ] Chrome（主要）
- [ ] Safari
- [ ] Firefox（可选）

### 设备测试
- [ ] 桌面端（1920x1080）
- [ ] 移动端（iPhone 14）
- [ ] 平板（可选）

---

## 🔍 自动化检查脚本

**文件：** `scripts/check-navigation.sh`

```bash
#!/bin/bash

echo "=== 导航链接检查 ==="
echo ""

# 1. 检查 /rankings 引用
echo "1. 检查是否还有 /rankings 引用:"
grep -rn "to=\"/rankings\"" src/ --include="*.tsx" --include="*.ts" 2>/dev/null
if [ $? -ne 0 ]; then
  echo "   ✅ 没有发现 to=\"/rankings\" 引用"
else
  echo "   ❌ 发现 to=\"/rankings\" 引用，需要修复"
fi
echo ""

# 2. 检查 navigate('/rankings')
echo "2. 检查是否还有 navigate('/rankings'):"
grep -rn "navigate('/rankings')" src/ --include="*.tsx" --include="*.ts" 2>/dev/null
if [ $? -ne 0 ]; then
  echo "   ✅ 没有发现 navigate('/rankings') 引用"
else
  echo "   ❌ 发现 navigate('/rankings') 引用，需要修复"
fi
echo ""

# 3. 检查 404 路由
echo "3. 检查 404 路由是否存在:"
grep -n "path=\"\*\"" src/App.tsx
if [ $? -eq 0 ]; then
  echo "   ✅ 404 路由已定义"
else
  echo "   ❌ 404 路由未定义"
fi
echo ""

# 4. 检查 /tools 路由
echo "4. 检查 /tools 路由是否存在:"
grep -n "path=\"/tools\"" src/App.tsx
if [ $? -eq 0 ]; then
  echo "   ✅ /tools 路由已定义"
else
  echo "   ❌ /tools 路由未定义"
fi
echo ""

# 5. 检查 /login 路由
echo "5. 检查 /login 路由是否存在:"
grep -n "path=\"/login\"" src/App.tsx
if [ $? -eq 0 ]; then
  echo "   ✅ /login 路由已定义"
else
  echo "   ❌ /login 路由未定义"
fi
echo ""

echo "=== 检查完成 ==="
```

**运行方法：**
```bash
cd /home/ubuntu/follow-ai-project
bash scripts/check-navigation.sh
```

---

## ❗ 常见错误

### 错误1: 链接指向错误的页面
```typescript
// ❌ 错误
<Link to="/tasks">Browse Tools</Link>

// ✅ 正确
<Link to="/tools">Browse Tools</Link>
```

### 错误2: Active状态检查错误
```typescript
// ❌ 错误
location.pathname === '/rankings'

// ✅ 正确
location.pathname === '/tools'
```

### 错误3: 忘记更新所有引用
```typescript
// 修改路由时，必须更新：
// 1. App.tsx 中的路由定义
// 2. 所有组件中的链接
// 3. Active状态检查
// 4. 命令面板
// 5. 测试文件
```

### 错误4: 使用 HashRouter
```typescript
// ❌ 错误
import { HashRouter } from 'react-router-dom';

// ✅ 正确
import { BrowserRouter } from 'react-router-dom';
```

---

## 📝 修改记录

### 2026-01-12
- 创建导航检查清单
- 重命名 /rankings 为 /tools
- 修复所有导航链接
- 添加 /login 路由
- 添加 404 路由
- 从 HashRouter 改为 BrowserRouter

---

**创建日期：** 2026-01-12  
**维护者：** Jackson / Manus
