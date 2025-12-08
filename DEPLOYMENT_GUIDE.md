# Vercel 自动部署指南

## ✅ 如果 Vercel 已连接到 GitHub

当你 push 代码到 GitHub 时，**网站会自动更新**！

### 如何确认是否已连接：

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 查看你的项目列表
3. 如果看到 `follow-ai` 或类似项目，说明已连接
4. 点击项目 → Settings → Git
5. 确认 "Production Branch" 是 `main`

### 自动部署流程：

```
你本地修改代码
    ↓
git add .
    ↓
git commit -m "更新内容"
    ↓
git push (到 GitHub)
    ↓
Vercel 自动检测到 push
    ↓
自动开始构建和部署
    ↓
2-5分钟后网站自动更新 ✅
```

### 查看部署状态：

- Vercel Dashboard → 你的项目 → Deployments
- 可以看到每次 push 的部署状态
- 绿色 ✅ = 部署成功
- 红色 ❌ = 部署失败（会显示错误信息）

---

## ❌ 如果 Vercel 未连接

需要先连接 GitHub 仓库：

### 步骤 1: 在 Vercel 中导入项目

1. 登录 [Vercel](https://vercel.com)
2. 点击 "Add New..." → "Project"
3. 选择 "Import Git Repository"
4. 找到你的 `follow-ai` 仓库
5. 点击 "Import"

### 步骤 2: 配置项目设置

1. **Project Name**: `follow-ai` (或你喜欢的名字)
2. **Framework Preset**: Vite (应该自动检测)
3. **Root Directory**: `./` (默认)
4. **Build Command**: `npm run build` (默认)
5. **Output Directory**: `dist` (默认)

### 步骤 3: 环境变量（如果需要）

如果使用了环境变量（如 Stripe keys），在 "Environment Variables" 中添加：
- `VITE_STRIPE_PAYMENT_LINK_URL`
- `VITE_STRIPE_CONNECT_ONBOARD_URL`
- `GEMINI_API_KEY` (可选)

### 步骤 4: 部署

点击 "Deploy"，Vercel 会：
1. 从 GitHub 拉取代码
2. 安装依赖 (`npm install`)
3. 构建项目 (`npm run build`)
4. 部署到 CDN

### 步骤 5: 连接自定义域名（如果已配置）

1. 在项目 Settings → Domains
2. 添加你的域名 `follow.ai`
3. 按照提示配置 DNS（如果还没配置）

---

## 🔄 自动部署设置确认

### 确保自动部署已启用：

1. Vercel Dashboard → 你的项目 → Settings → Git
2. 确认 "Production Branch" 是 `main`
3. 确认 "Auto-deploy" 是开启的 ✅

### 部署触发条件：

- ✅ Push 到 `main` 分支 → 自动部署到 Production
- ✅ Push 到其他分支 → 创建 Preview Deployment
- ✅ 创建 Pull Request → 创建 Preview Deployment

---

## 📝 当前状态检查

### 检查你的 Git 配置：

```bash
# 查看远程仓库
git remote -v

# 应该显示：
# origin  https://github.com/SwordKirito33/follow-ai.git
```

### 检查未提交的文件：

```bash
git status

# 如果有新文件，需要先添加：
git add .
git commit -m "添加商业分析文档"
git push
```

---

## 🚀 快速测试自动部署

### 测试步骤：

1. **做一个小的修改**（比如改一下 README）
2. **提交并推送**：
   ```bash
   git add .
   git commit -m "测试自动部署"
   git push
   ```
3. **等待 2-5 分钟**
4. **刷新你的网站**，看是否更新了
5. **在 Vercel Dashboard 查看部署日志**

---

## ⚠️ 常见问题

### Q: Push 了但网站没更新？

**检查清单：**
- [ ] Vercel 是否已连接到 GitHub 仓库？
- [ ] Push 的是 `main` 分支吗？
- [ ] Vercel Dashboard 中是否有新的部署记录？
- [ ] 部署是否成功？（检查是否有错误）

### Q: 如何查看部署日志？

1. Vercel Dashboard → 你的项目
2. 点击最新的 Deployment
3. 查看 "Build Logs" 和 "Runtime Logs"

### Q: 部署失败了怎么办？

1. 查看 Build Logs 中的错误信息
2. 常见问题：
   - 依赖安装失败 → 检查 `package.json`
   - 构建错误 → 检查代码是否有错误
   - 环境变量缺失 → 在 Vercel 中添加

### Q: 如何回滚到之前的版本？

1. Vercel Dashboard → Deployments
2. 找到之前的成功部署
3. 点击 "..." → "Promote to Production"

---

## 📊 部署最佳实践

1. **每次 push 前先本地测试**：
   ```bash
   npm run build  # 确保能成功构建
   ```

2. **使用有意义的 commit 信息**：
   ```bash
   git commit -m "添加工具详情页功能"
   ```

3. **定期检查部署状态**：
   - 确保每次 push 都成功部署
   - 及时修复部署错误

4. **使用 Preview Deployments**：
   - 在 feature 分支开发
   - 创建 PR 获得预览链接
   - 确认无误后再 merge 到 main

---

## 🎯 总结

**如果 Vercel 已连接 GitHub：**
- ✅ Push 到 `main` → 自动部署
- ✅ 2-5 分钟后网站更新
- ✅ 可以在 Dashboard 查看状态

**如果未连接：**
- 需要先在 Vercel 中导入项目
- 配置一次后，之后都会自动部署

**建议：**
- 先做一个小的测试修改
- Push 后观察 Vercel Dashboard
- 确认自动部署正常工作

