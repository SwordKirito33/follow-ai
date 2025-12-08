# 🚀 AITok 部署指南

## 📋 部署架构

```
用户
  ↓
Cloudflare CDN
  ↓
Vercel (前端)
  ↓
Supabase (后端 + 数据库)
  ↓
第三方 API (OpenAI, Stripe, etc.)
```

---

## 🛠️ 环境准备

### 1. 注册必要账户

#### Supabase
- 访问 https://supabase.com
- 注册账户
- 创建新项目
- 选择区域：`Southeast Asia (Singapore)` 或 `Australia (Sydney)`

#### Vercel
- 访问 https://vercel.com
- 使用 GitHub 账户登录
- 连接 GitHub 仓库

#### Cloudflare（可选）
- 访问 https://cloudflare.com
- 注册账户
- 添加域名

#### Stripe
- 访问 https://stripe.com
- 注册账户
- 完成账户验证
- 获取 API 密钥

#### OpenAI / Stability AI
- 注册相应账户
- 获取 API 密钥

---

## 📦 本地开发环境设置

### 1. 克隆项目

```bash
git clone <repository-url>
cd aitok
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# OpenAI
VITE_OPENAI_API_KEY=sk-...

# Stability AI
VITE_STABILITY_API_KEY=sk-...

# Runway
VITE_RUNWAY_API_KEY=...

# 其他
VITE_APP_URL=http://localhost:5173
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

---

## 🗄️ Supabase 设置

### 1. 创建数据库表

在 Supabase SQL Editor 中执行 `AITOK_DATABASE_SCHEMA.md` 中的所有 SQL 语句。

### 2. 设置 Row Level Security (RLS)

为每个表启用 RLS 并创建策略：

```sql
-- 示例：profiles 表
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 3. 创建 Storage Buckets

在 Supabase Dashboard → Storage 中创建以下 Buckets：

1. **videos**
   - Public: Yes
   - File size limit: 500MB
   - Allowed MIME types: video/*

2. **images**
   - Public: Yes
   - File size limit: 10MB
   - Allowed MIME types: image/*

3. **thumbnails**
   - Public: Yes
   - File size limit: 2MB
   - Allowed MIME types: image/*

4. **course-content**
   - Public: No
   - File size limit: 1GB
   - Allowed MIME types: video/*, application/pdf

5. **task-attachments**
   - Public: No
   - File size limit: 100MB
   - Allowed MIME types: *

6. **avatars**
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/*

### 4. 设置 Storage Policies

```sql
-- 示例：videos bucket
CREATE POLICY "Anyone can view videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own videos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 🌐 Vercel 部署

### 1. 连接 GitHub 仓库

1. 在 Vercel Dashboard 点击 "New Project"
2. 选择 GitHub 仓库
3. 点击 "Import"

### 2. 配置项目设置

**Framework Preset**: Vite

**Build Command**: `npm run build`

**Output Directory**: `dist`

**Install Command**: `npm install`

### 3. 配置环境变量

在 Vercel Dashboard → Project Settings → Environment Variables 中添加：

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_STRIPE_PUBLISHABLE_KEY
VITE_OPENAI_API_KEY
VITE_STABILITY_API_KEY
VITE_RUNWAY_API_KEY
VITE_APP_URL
```

### 4. 部署

点击 "Deploy" 按钮，Vercel 会自动构建和部署。

### 5. 配置自定义域名（可选）

1. 在 Vercel Dashboard → Settings → Domains
2. 添加自定义域名
3. 按照提示配置 DNS

---

## 🔧 Vercel Serverless Functions

### 创建 API 路由

在项目根目录创建 `api/` 文件夹：

```
api/
├── ai/
│   ├── generate-image.ts
│   ├── generate-video.ts
│   └── generation-status.ts
├── payments/
│   ├── create-intent.ts
│   ├── confirm.ts
│   └── withdraw.ts
└── courses/
    └── content.ts
```

### 示例：generate-image.ts

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, size = '1024x1024', quality = 'standard' } = req.body;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: size as '1024x1024' | '1792x1024' | '1024x1792',
      quality: quality as 'standard' | 'hd',
      n: 1,
    });

    return res.json({
      image_url: response.data[0].url,
      generation_id: response.data[0].revised_prompt,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
```

### 配置 Vercel

创建 `vercel.json`：

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

---

## 🔐 Stripe 支付集成

### 1. 获取 API 密钥

在 Stripe Dashboard → Developers → API keys 获取：
- Publishable key (前端使用)
- Secret key (后端使用，保密！)

### 2. 配置 Webhook

在 Stripe Dashboard → Developers → Webhooks 创建 Webhook：

**Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`

**Events to listen to**:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

### 3. 创建 Webhook Handler

创建 `api/webhooks/stripe.ts`：

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 处理事件
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // 更新数据库
      // await updatePaymentStatus(paymentIntent.id, 'succeeded');
      break;
    case 'payment_intent.payment_failed':
      // 处理支付失败
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
```

---

## 📊 监控和日志

### 1. Sentry 错误监控

#### 安装 Sentry

```bash
npm install @sentry/react
```

#### 配置 Sentry

在 `main.tsx` 中：

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 1.0,
});
```

#### 获取 DSN

1. 访问 https://sentry.io
2. 创建项目
3. 复制 DSN
4. 添加到环境变量：`VITE_SENTRY_DSN`

### 2. Google Analytics

在 `index.html` 中添加：

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔒 安全配置

### 1. CORS 配置

在 Supabase Dashboard → Settings → API 中配置 CORS：

```
https://your-domain.com
https://www.your-domain.com
```

### 2. API 限流

在 Vercel Dashboard → Settings → Rate Limiting 中配置。

### 3. 环境变量安全

- ✅ 永远不要提交 `.env` 文件到 Git
- ✅ 使用 Vercel 环境变量管理
- ✅ 定期轮换 API 密钥
- ✅ 使用不同的密钥用于开发/生产

---

## 🚀 部署检查清单

### 部署前

- [ ] 所有环境变量已配置
- [ ] 数据库表已创建
- [ ] RLS 策略已设置
- [ ] Storage Buckets 已创建
- [ ] Stripe Webhook 已配置
- [ ] 域名 DNS 已配置
- [ ] SSL 证书已配置

### 部署后

- [ ] 测试用户注册/登录
- [ ] 测试视频上传/播放
- [ ] 测试 AI 生成功能
- [ ] 测试支付流程
- [ ] 测试实时聊天
- [ ] 检查错误监控
- [ ] 检查性能指标

---

## 🔄 持续部署 (CI/CD)

### GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 配置 Secrets

在 GitHub Repository → Settings → Secrets 中添加：
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## 📈 性能优化

### 1. 图片优化

- 使用 WebP 格式
- 实现懒加载
- 使用 CDN（Cloudflare）

### 2. 视频优化

- 使用 CDN
- 实现自适应码率
- 实现预加载策略

### 3. 代码优化

- 代码分割
- 懒加载路由
- 使用 React.memo
- 使用 useMemo/useCallback

### 4. 数据库优化

- 创建必要的索引
- 使用连接池
- 优化查询语句

---

## 🐛 故障排查

### 常见问题

#### 1. 环境变量未加载

**解决方案**：
- 检查 `.env.local` 文件是否存在
- 检查环境变量名称是否正确（Vite 需要 `VITE_` 前缀）
- 重启开发服务器

#### 2. Supabase 连接失败

**解决方案**：
- 检查 Supabase URL 和 Key 是否正确
- 检查网络连接
- 检查 Supabase 项目状态

#### 3. 文件上传失败

**解决方案**：
- 检查文件大小是否超过限制
- 检查文件类型是否允许
- 检查 Storage Bucket 策略

#### 4. 支付失败

**解决方案**：
- 检查 Stripe API 密钥
- 检查 Webhook 配置
- 检查支付意图状态

---

## 📞 支持资源

### 文档
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Stripe Docs: https://stripe.com/docs

### 社区
- Supabase Discord: https://discord.supabase.com
- Vercel Discord: https://vercel.com/discord

---

**文档版本**：V1.0  
**创建日期**：2025-01-XX

