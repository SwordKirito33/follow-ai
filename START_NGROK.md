# 🌐 启动 ngrok 隧道

## 📋 当前状态

✅ ngrok 已安装：`/opt/homebrew/bin/ngrok`  
✅ 开发服务器正在运行（进程 ID: 23740）  
⚠️ 需要确认实际端口（可能是 5173 或 5175）

---

## 🚀 在 Cursor 中启动 ngrok

### 方法 1: 使用新终端（推荐）

1. **保持当前开发服务器运行**（不要关闭）

2. **打开新终端**：
   - 点击终端右上角的 **"+"** 按钮
   - 或按快捷键：**`Cmd+Shift+\``** (反引号)

3. **在新终端中运行**：

```bash
# 如果开发服务器在 5173 端口
ngrok http 5173

# 或者如果开发服务器在 5175 端口
ngrok http 5175
```

---

### 方法 2: 使用后台运行（当前终端）

如果你想在当前终端后台运行 ngrok：

```bash
# 后台运行 ngrok（端口 5173）
ngrok http 5173 > /dev/null 2>&1 &

# 或者端口 5175
ngrok http 5175 > /dev/null 2>&1 &
```

**查看 ngrok 状态**：
```bash
# 访问 ngrok 本地管理界面
open http://localhost:4040
```

---

## 🔍 确认开发服务器端口

运行以下命令确认实际端口：

```bash
# 检查 5173 端口
lsof -i:5173

# 检查 5175 端口
lsof -i:5175

# 或者查看所有 Node/Vite 进程
ps aux | grep -E "vite|node" | grep -v grep
```

---

## 📝 完整操作步骤

### Step 1: 确认开发服务器端口

```bash
# 在终端中运行
lsof -i:5173 -i:5175 | grep LISTEN
```

**预期输出**：
```
node    23740  ...  TCP *:5173 (LISTEN)
```

### Step 2: 打开新终端

- 点击 Cursor 终端右上角的 **"+"**
- 或按 **`Cmd+Shift+\``**

### Step 3: 在新终端运行 ngrok

```bash
# 根据实际端口选择
ngrok http 5173
# 或
ngrok http 5175
```

**预期输出**：
```
ngrok

Session Status                online
Account                       Your Account
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:5173

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### Step 4: 复制 ngrok URL

从输出中复制 `Forwarding` 行的 HTTPS URL，例如：
```
https://xxxx-xx-xx-xx-xx.ngrok-free.app
```

这个 URL 可以用于：
- Stripe Webhook 测试
- 外部访问开发服务器
- 移动设备测试

---

## ⚙️ ngrok 配置选项

### 自定义子域名（需要付费计划）

```bash
ngrok http 5173 --subdomain=follow-ai
```

### 指定区域

```bash
ngrok http 5173 --region=us
# 可选: us, eu, ap, au, sa, jp, in
```

### 查看详细日志

```bash
ngrok http 5173 --log=stdout
```

---

## 🔗 使用 ngrok URL

### 配置 Stripe Webhook

1. 登录 Stripe Dashboard
2. 进入 **Developers** → **Webhooks**
3. 点击 **Add endpoint**
4. 输入 ngrok URL：`https://xxxx-xx-xx-xx-xx.ngrok-free.app/functions/v1/stripe-webhook`
5. 选择要监听的事件
6. 保存

### 测试 Webhook

```bash
# 使用 Stripe CLI 测试
stripe listen --forward-to localhost:5173/functions/v1/stripe-webhook
```

---

## ⚠️ 注意事项

1. **免费版限制**：
   - 每次重启 ngrok 会生成新的 URL
   - 会话时间限制（通常 2 小时）
   - 需要 ngrok 账户（免费注册）

2. **端口确认**：
   - Vite 默认端口是 5173
   - 如果 5173 被占用，会自动使用 5174, 5175...
   - 使用 `lsof -i:5173` 确认实际端口

3. **保持运行**：
   - ngrok 和开发服务器都需要保持运行
   - 关闭终端会停止 ngrok
   - 建议使用 `screen` 或 `tmux` 保持会话

---

## 🛠️ 快速命令参考

```bash
# 1. 检查端口
lsof -i:5173 -i:5175 | grep LISTEN

# 2. 启动 ngrok（在新终端）
ngrok http 5173

# 3. 查看 ngrok 管理界面
open http://localhost:4040

# 4. 停止 ngrok
# 在 ngrok 终端按 Ctrl+C
```

---

## ✅ 完成检查清单

- [ ] 开发服务器正在运行
- [ ] 确认了实际端口（5173 或 5175）
- [ ] 打开了新终端
- [ ] 运行了 `ngrok http [端口]`
- [ ] 复制了 ngrok HTTPS URL
- [ ] 配置了 Stripe Webhook（如果需要）

