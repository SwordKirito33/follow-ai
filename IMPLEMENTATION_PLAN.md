# Follow.ai 完整实施计划

## 📋 当前状态

✅ **已完成**：
- 多语言支持（i18n）- 正在完善翻译
- 核心页面和组件
- 基础UI和UX

🔄 **进行中**：
- 完善所有页面的翻译

📝 **待实施**：
- 真实数据集成（Firebase/Supabase）
- Stripe支付完整集成
- 用户认证系统
- 真实AI分析（Gemini API）
- 评论系统增强
- 搜索功能

---

## 🚀 实施步骤（按优先级）

### 阶段1：完善翻译（今天完成）

#### 1.1 更新剩余页面翻译

**需要更新的页面**：
- [x] SubmitReview ✅
- [x] Home ✅  
- [x] RankingsPage ✅
- [x] ToolDetail ✅
- [ ] About
- [ ] Terms
- [ ] NewsPage
- [ ] Profile
- [ ] Payments
- [ ] NewsWidget
- [ ] ReviewCard

**快速修复方法**：
```bash
# 查找所有硬编码英文文本
grep -r "Submit Review\|Browse Tools\|Earn Money" pages/ components/ --include="*.tsx"
```

---

### 阶段2：真实数据集成（1-2周）

#### 2.1 选择数据库：**Supabase（推荐）**

**为什么选择Supabase**：
- ✅ 免费额度充足（500MB数据库，1GB文件存储）
- ✅ 实时数据库（PostgreSQL）
- ✅ 内置认证系统
- ✅ 文件存储（用于上传的作品）
- ✅ 自动生成API
- ✅ 澳洲可用，速度快

#### 2.2 设置Supabase

**步骤1：创建Supabase项目**
1. 访问 https://supabase.com
2. 注册/登录账户
3. 点击 "New Project"
4. 项目名称：`follow-ai`
5. 数据库密码：设置强密码（保存好）
6. 区域：选择 `Southeast Asia (Singapore)` 或 `Australia (Sydney)`
7. 点击 "Create new project"

**步骤2：获取API密钥**
1. 项目设置 → API
2. 复制以下信息：
   - Project URL: `https://xxxxx.supabase.co`
   - anon/public key: `eyJhbGc...`
   - service_role key: `eyJhbGc...`（保密！）

**步骤3：安装Supabase客户端**
```bash
npm install @supabase/supabase-js
```

**步骤4：创建数据库表**

在Supabase SQL Editor中执行：

```sql
-- 用户表（扩展Supabase Auth）
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  avatar TEXT,
  level INTEGER DEFAULT 1,
  level_name TEXT DEFAULT 'Novice',
  earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 工具表
CREATE TABLE tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  logo TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  growth TEXT,
  description TEXT,
  use_cases TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 评测表
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  tool_id TEXT REFERENCES tools(id) NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  quality_score DECIMAL(3,1),
  text TEXT NOT NULL,
  output_url TEXT, -- 存储到Supabase Storage
  likes INTEGER DEFAULT 0,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 任务表
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  tool_id TEXT REFERENCES tools(id),
  title TEXT NOT NULL,
  reward DECIMAL(10,2) NOT NULL,
  spots INTEGER NOT NULL,
  time_left TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 新闻表
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL, -- 'launch', 'update', 'trending', 'highlight'
  title TEXT NOT NULL,
  description TEXT,
  meta1 TEXT,
  meta2 TEXT,
  meta3 TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 成就表
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  unlocked_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
```

**步骤5：设置文件存储**

1. Supabase Dashboard → Storage
2. 创建Bucket：`review-outputs`
3. 设置为Public（或使用Signed URLs）
4. 设置策略（允许用户上传自己的文件）

**步骤6：创建Supabase客户端文件**

创建 `lib/supabase.ts`：
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**步骤7：更新环境变量**

在 `.env` 文件中添加：
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

在 Vercel 中也添加这些环境变量。

---

### 阶段3：用户认证（1周）

#### 3.1 使用Supabase Auth

**创建认证组件** `components/Auth.tsx`：
```typescript
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

const Auth: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) alert(error.message);
      else alert('Check your email for confirmation link!');
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
    }
  };

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
    </form>
  );
};
```

**创建认证Context** `contexts/AuthContext.tsx`：
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取当前用户
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**更新App.tsx**：
```typescript
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        {/* ... */}
      </LanguageProvider>
    </AuthProvider>
  );
};
```

---

### 阶段4：Stripe支付集成（1周）

#### 4.1 设置Stripe账户

1. 注册Stripe账户：https://stripe.com
2. 完成账户验证（澳洲需要ABN或ACN）
3. 获取API密钥：
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`（保密！）

#### 4.2 安装Stripe

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

#### 4.3 创建支付组件

创建 `components/StripeCheckout.tsx`：
```typescript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// 使用Stripe Elements进行支付
```

#### 4.4 创建后端API（Vercel Serverless Functions）

创建 `api/create-payment-intent.ts`：
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency = 'aud' } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // 转换为分
    currency,
  });

  res.json({ clientSecret: paymentIntent.client_secret });
}
```

---

### 阶段5：真实AI分析（Gemini API）（1周）

#### 5.1 获取Gemini API Key

1. 访问 https://makersuite.google.com/app/apikey
2. 创建API Key
3. 保存到环境变量：`VITE_GEMINI_API_KEY`

#### 5.2 创建AI分析服务

创建 `services/aiAnalysis.ts`：
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeOutput = async (file: File, reviewText: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
  
  // 读取文件内容
  const fileData = await file.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(fileData)));
  
  const prompt = `Analyze this AI tool output file and review text. Rate the quality (0-10) based on:
  1. Complexity and sophistication
  2. Originality and creativity
  3. Practical value
  4. Technical quality
  
  Review text: ${reviewText}
  
  Return JSON: { score: number, complexity: "Low|Medium|High", originality: number, feedback: string }`;

  const result = await model.generateContent([
    { mimeType: file.type, data: base64 },
    prompt,
  ]);

  return JSON.parse(result.response.text());
};
```

**安装Gemini SDK**：
```bash
npm install @google/generative-ai
```

---

### 阶段6：文件上传到Supabase Storage（1周）

#### 6.1 创建上传服务

创建 `services/upload.ts`：
```typescript
import { supabase } from '../lib/supabase';

export const uploadFile = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('review-outputs')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('review-outputs')
    .getPublicUrl(fileName);

  return publicUrl;
};
```

---

## 📝 环境变量清单

创建 `.env.local` 文件：

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PAYMENT_LINK_URL=https://buy.stripe.com/...
VITE_STRIPE_CONNECT_ONBOARD_URL=https://connect.stripe.com/...

# Gemini AI
VITE_GEMINI_API_KEY=AIza...

# ChatGPT (如果需要)
VITE_OPENAI_API_KEY=sk-...
```

---

## 🎯 实施优先级

### 第1周
1. ✅ 完善所有翻译
2. ⚠️ 设置Supabase项目
3. ⚠️ 创建数据库表
4. ⚠️ 实现文件上传

### 第2周
1. ⚠️ 实现用户认证
2. ⚠️ 连接真实数据（替换mock data）
3. ⚠️ 实现真实文件上传

### 第3周
1. ⚠️ 集成Stripe支付
2. ⚠️ 实现支付流程

### 第4周
1. ⚠️ 集成Gemini API
2. ⚠️ 实现真实AI分析
3. ⚠️ 优化用户体验

---

## 💰 成本估算

### Supabase（免费版）
- 数据库：500MB（足够初期使用）
- 文件存储：1GB（足够初期使用）
- 带宽：2GB/月
- **成本：$0/月**

### Stripe
- 交易费：2.9% + $0.30 AUD/交易
- **无月费**

### Gemini API
- 免费额度：60 requests/分钟
- 超出后：$0.001/1K tokens
- **预估成本：$10-50/月**（初期）

### Vercel
- Hobby计划：免费
- **成本：$0/月**

**总成本（初期）：约 $10-50/月**

---

## 🚀 快速开始

### 今天可以做的：

1. **完善翻译**（1-2小时）
   - 更新About, Terms, NewsPage等页面

2. **注册Supabase**（10分钟）
   - 创建项目
   - 获取API密钥

3. **注册Stripe**（15分钟）
   - 创建账户
   - 获取API密钥

4. **获取Gemini API Key**（5分钟）
   - 访问Google AI Studio
   - 创建API Key

### 明天可以做的：

1. **设置数据库表**（1小时）
   - 在Supabase SQL Editor执行SQL
   - 创建Storage bucket

2. **安装依赖**（5分钟）
   ```bash
   npm install @supabase/supabase-js @stripe/stripe-js @stripe/react-stripe-js @google/generative-ai
   ```

3. **创建服务文件**（2小时）
   - `lib/supabase.ts`
   - `services/upload.ts`
   - `services/aiAnalysis.ts`

---

## 📞 需要帮助？

如果你在实施过程中遇到问题，告诉我：
1. 你卡在哪一步？
2. 遇到了什么错误？
3. 需要我帮你写具体的代码吗？

**现在先完善翻译，然后我们一步步实施这些功能！** 🚀

