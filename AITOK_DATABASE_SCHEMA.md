# 🗄️ AITok 数据库结构设计

## 数据库选择：Supabase (PostgreSQL)

**为什么选择 Supabase**：
- ✅ 免费额度充足（500MB数据库，1GB文件存储）
- ✅ 实时数据库（PostgreSQL）
- ✅ 内置认证系统
- ✅ 文件存储（用于视频、图片）
- ✅ 自动生成 API
- ✅ 实时订阅功能

---

## 📊 核心数据表

### 1. 用户表（profiles）

扩展 Supabase Auth 的用户信息

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  user_type TEXT NOT NULL DEFAULT 'individual', -- 'individual', 'freelancer', 'business', 'company'
  
  -- 技能标签
  industry_tags TEXT[], -- ['AI插画师', 'AI视频创作者']
  skill_level TEXT DEFAULT 'novice', -- 'novice', 'intermediate', 'advanced', 'expert', 'enterprise'
  
  -- 统计数据
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  videos_count INTEGER DEFAULT 0,
  likes_received INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0, -- 0-5分
  
  -- 认证
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badge TEXT, -- 'expert', 'top_creator', 'verified'
  
  -- 设置
  language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_industry_tags ON profiles USING GIN(industry_tags);
```

---

### 2. 视频表（videos）

存储所有 AI 生成的视频内容

```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- 视频信息
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  duration INTEGER, -- 秒数
  
  -- AI 生成信息
  ai_tool_used TEXT, -- 'runway', 'pika', 'stable-video'
  prompt_used TEXT,
  generation_params JSONB, -- 存储生成参数
  
  -- 分类
  category TEXT, -- 'image', 'video', 'music', 'game', 'business', 'tutorial'
  tags TEXT[],
  
  -- 统计数据
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  
  -- 状态
  status TEXT DEFAULT 'published', -- 'draft', 'published', 'archived', 'deleted'
  is_featured BOOLEAN DEFAULT FALSE,
  is_nsfw BOOLEAN DEFAULT FALSE,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_videos_likes_count ON videos(likes_count DESC);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_tags ON videos USING GIN(tags);
```

---

### 3. 图片表（images）

存储 AI 生成的图片内容

```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- 图片信息
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- AI 生成信息
  ai_tool_used TEXT, -- 'dalle', 'midjourney', 'stable-diffusion'
  prompt_used TEXT,
  generation_params JSONB,
  
  -- 分类
  category TEXT,
  tags TEXT[],
  
  -- 统计数据
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  
  -- 状态
  status TEXT DEFAULT 'published',
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_images_created_at ON images(created_at DESC);
```

---

### 4. 评论表（comments）

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  image_id UUID REFERENCES images(id) ON DELETE CASCADE,
  
  -- 评论内容
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- 回复评论
  
  -- 统计数据
  likes_count INTEGER DEFAULT 0,
  
  -- 状态
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_video_id ON comments(video_id);
CREATE INDEX idx_comments_image_id ON comments(image_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
```

---

### 5. 点赞表（likes）

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  image_id UUID REFERENCES images(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, video_id),
  UNIQUE(user_id, image_id),
  UNIQUE(user_id, comment_id)
);

CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_video_id ON likes(video_id);
CREATE INDEX idx_likes_image_id ON likes(image_id);
```

---

### 6. 关注表（follows）

```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
```

---

### 7. 任务表（tasks）

接单广场的任务

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- 任务信息
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'image', 'video', 'audio', 'copywriting', 'model_training', 'course', 'consulting'
  
  -- 预算和时间
  budget DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  deadline TIMESTAMP,
  
  -- 要求
  requirements TEXT,
  attachments JSONB, -- 参考文件
  
  -- 状态
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'cancelled', 'disputed'
  
  -- 匹配的创作者
  assigned_creator_id UUID REFERENCES profiles(id),
  assigned_at TIMESTAMP,
  
  -- 交付
  delivery_url TEXT,
  delivery_notes TEXT,
  delivered_at TIMESTAMP,
  
  -- 评价
  client_rating INTEGER, -- 1-5
  client_review TEXT,
  creator_rating INTEGER,
  creator_review TEXT,
  
  -- 支付
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  platform_fee DECIMAL(10,2), -- 平台抽成
  creator_earnings DECIMAL(10,2),
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_client_id ON tasks(client_id);
CREATE INDEX idx_tasks_assigned_creator_id ON tasks(assigned_creator_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

---

### 8. 任务申请表（task_applications）

创作者申请任务

```sql
CREATE TABLE task_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- 申请信息
  proposal TEXT NOT NULL,
  proposed_price DECIMAL(10,2),
  estimated_delivery_days INTEGER,
  portfolio_items JSONB, -- 相关作品链接
  
  -- 状态
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'withdrawn'
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(task_id, creator_id)
);

CREATE INDEX idx_task_applications_task_id ON task_applications(task_id);
CREATE INDEX idx_task_applications_creator_id ON task_applications(creator_id);
CREATE INDEX idx_task_applications_status ON task_applications(status);
```

---

### 9. 课程表（courses）

知识付费课程

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- 课程信息
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  preview_video_url TEXT,
  
  -- 价格
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  is_free BOOLEAN DEFAULT FALSE,
  discount_percent INTEGER DEFAULT 0,
  
  -- 分类
  category TEXT, -- 'beginner', 'intermediate', 'advanced', 'expert'
  tags TEXT[],
  
  -- 内容
  content_type TEXT, -- 'video', 'pdf', 'prompt_pack', 'model', 'workflow', 'assets'
  content_url TEXT, -- 加密内容URL
  content_size INTEGER, -- 文件大小（字节）
  
  -- 统计数据
  students_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  
  -- 状态
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_courses_creator_id ON courses(creator_id);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);
```

---

### 10. 课程购买表（course_purchases）

```sql
CREATE TABLE course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- 支付信息
  amount_paid DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  platform_fee DECIMAL(10,2),
  creator_earnings DECIMAL(10,2),
  
  -- 支付状态
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  payment_intent_id TEXT, -- Stripe Payment Intent ID
  
  -- 学习进度
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(course_id, student_id)
);

CREATE INDEX idx_course_purchases_course_id ON course_purchases(course_id);
CREATE INDEX idx_course_purchases_student_id ON course_purchases(student_id);
```

---

### 11. 钱包表（wallets）

用户钱包和交易记录

```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- 余额
  balance DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  
  -- 统计数据
  total_earned DECIMAL(10,2) DEFAULT 0,
  total_withdrawn DECIMAL(10,2) DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
```

---

### 12. 交易记录表（transactions）

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  
  -- 交易信息
  type TEXT NOT NULL, -- 'earn', 'spend', 'withdraw', 'refund', 'payout'
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- 关联
  related_type TEXT, -- 'task', 'course', 'subscription', 'withdrawal'
  related_id UUID, -- 关联的任务/课程ID
  
  -- 支付信息
  payment_method TEXT, -- 'stripe', 'paypal', 'wallet'
  payment_intent_id TEXT,
  
  -- 状态
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
  
  -- 描述
  description TEXT,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
```

---

### 13. 订阅表（subscriptions）

AI 使用额度订阅

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- 订阅信息
  plan_type TEXT NOT NULL, -- 'basic', 'pro', 'business'
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- 额度
  image_credits INTEGER NOT NULL,
  video_credits INTEGER NOT NULL,
  used_image_credits INTEGER DEFAULT 0,
  used_video_credits INTEGER DEFAULT 0,
  
  -- 状态
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  
  -- 支付
  payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  
  -- 时间
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

---

### 14. 消息表（messages）

接单聊天系统

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- 消息内容
  content TEXT,
  attachment_url TEXT,
  attachment_type TEXT, -- 'image', 'video', 'file'
  
  -- 状态
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_task_id ON messages(task_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

---

### 15. AI 助理对话表（ai_assistant_conversations）

```sql
CREATE TABLE ai_assistant_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- 对话信息
  conversation_type TEXT, -- 'skill_recommendation', 'prompt_generation', 'job_matching', 'content_optimization'
  messages JSONB NOT NULL, -- 存储对话历史
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_assistant_user_id ON ai_assistant_conversations(user_id);
```

---

## 🔐 Row Level Security (RLS) 策略

### 示例：profiles 表

```sql
-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 任何人都可以查看公开资料
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- 用户只能更新自己的资料
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 示例：videos 表

```sql
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 任何人都可以查看已发布的视频
CREATE POLICY "Published videos are viewable by everyone"
  ON videos FOR SELECT
  USING (status = 'published');

-- 用户只能管理自己的视频
CREATE POLICY "Users can manage own videos"
  ON videos FOR ALL
  USING (auth.uid() = user_id);
```

---

## 📦 文件存储 Buckets

### Supabase Storage Buckets

1. **videos** - 视频文件
   - 公开访问
   - 最大文件大小：500MB

2. **images** - 图片文件
   - 公开访问
   - 最大文件大小：10MB

3. **thumbnails** - 缩略图
   - 公开访问
   - 最大文件大小：2MB

4. **course-content** - 课程内容（加密）
   - 私有访问
   - 需要签名 URL

5. **task-attachments** - 任务附件
   - 私有访问
   - 需要签名 URL

6. **avatars** - 用户头像
   - 公开访问
   - 最大文件大小：5MB

---

## 🔄 数据库函数和触发器

### 自动更新 updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 应用到需要的表
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 自动更新统计数据

```sql
-- 当视频被点赞时，自动更新 likes_count
CREATE OR REPLACE FUNCTION update_video_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE videos SET likes_count = likes_count + 1 WHERE id = NEW.video_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE videos SET likes_count = likes_count - 1 WHERE id = OLD.video_id;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_video_likes_trigger
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_video_likes_count();
```

---

## 📊 数据库初始化脚本

创建 `database/init.sql` 文件，包含所有表、索引、函数和触发器。

---

**文档版本**：V1.0  
**创建日期**：2025-01-XX







