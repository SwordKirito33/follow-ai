# 🔍 如何查看开发服务器端口号

## 📍 方法1: 查看终端输出（最简单）

**在运行 `npm run dev` 的终端窗口中，查找：**

```
VITE ready in xxx ms

➜  Local:   http://localhost:XXXX/
➜  Network: http://192.168.x.x:XXXX/
```

**端口号就是 `XXXX` 部分！**

例如：
- `http://localhost:3000/` → 端口号是 **3000**
- `http://localhost:3001/` → 端口号是 **3001**

---

## 📍 方法2: 查看终端标题栏

**在终端窗口的标题栏，通常会显示：**
```
Terminal - npm run dev (localhost:XXXX)
```

---

## 📍 方法3: 使用命令查找

**在终端执行：**
```bash
lsof -i -P | grep LISTEN | grep node
```

**会显示类似：**
```
node    12345  kirito   23u  IPv6 0x...  TCP *:3001 (LISTEN)
```

**端口号就是最后的数字（例如：3001）**

---

## 📍 方法4: 检查 vite.config.ts

**查看配置文件中的端口设置：**
```bash
cat vite.config.ts | grep port
```

**但注意：** 如果端口被占用，Vite会自动使用下一个可用端口！

---

## ⚠️ 重要提示

### 如果看到多个端口

**Vite可能会显示：**
```
Port 3000 is in use, trying another one...
➜  Local:   http://localhost:3001/
```

**这种情况下，应该使用 3001，而不是 3000！**

---

## 🎯 快速检查

**在终端执行：**
```bash
# 查看所有监听的端口
lsof -i -P | grep LISTEN | grep -E "3000|3001|5173"
```

**会显示当前使用的端口号。**

---

## 📋 访问测试页面

**找到端口号后，访问：**
```
http://localhost:端口号/#/test-supabase
```

**例如：**
- 如果端口是 3000：`http://localhost:3000/#/test-supabase`
- 如果端口是 3001：`http://localhost:3001/#/test-supabase`

**记住：** 使用 `#` 符号（HashRouter）！

---

**最后更新**：2025-12-15

