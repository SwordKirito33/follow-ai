# 🔌 AITok API 接口设计

## API 架构

### 技术选择
- **Supabase REST API** - 主要数据操作
- **Supabase Realtime** - 实时订阅
- **Vercel Serverless Functions** - 自定义业务逻辑
- **Stripe API** - 支付处理

### API 基础 URL
```
开发环境: http://localhost:54321
生产环境: https://[project].supabase.co
```

---

## 🔐 认证

### 所有需要认证的接口都需要在 Header 中携带 Token

```http
Authorization: Bearer <access_token>
```

### 获取 Token
```typescript
// 登录
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
// data.session.access_token 就是 token
```

---

## 📹 视频相关 API

### 1. 获取视频列表

**GET** `/rest/v1/videos`

**Query Parameters**:
- `limit`: number (默认: 20)
- `offset`: number (默认: 0)
- `category`: string (可选)
- `order`: string (默认: 'created_at.desc') - 'created_at.desc' | 'likes_count.desc' | 'views_count.desc'
- `user_id`: UUID (可选，获取特定用户的视频)

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "AI Generated Video",
      "description": "...",
      "video_url": "https://...",
      "thumbnail_url": "https://...",
      "views_count": 1000,
      "likes_count": 50,
      "comments_count": 10,
      "created_at": "2025-01-01T00:00:00Z",
      "user": {
        "id": "uuid",
        "username": "creator123",
        "avatar_url": "https://...",
        "display_name": "Creator Name"
      }
    }
  ],
  "count": 100
}
```

---

### 2. 获取单个视频

**GET** `/rest/v1/videos?id=eq.{video_id}&select=*,user:profiles(*)`

**Response**:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "AI Generated Video",
  "description": "...",
  "video_url": "https://...",
  "thumbnail_url": "https://...",
  "views_count": 1000,
  "likes_count": 50,
  "comments_count": 10,
  "created_at": "2025-01-01T00:00:00Z",
  "user": {
    "id": "uuid",
    "username": "creator123",
    "avatar_url": "https://...",
    "display_name": "Creator Name"
  }
}
```

---

### 3. 创建视频

**POST** `/rest/v1/videos`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "title": "My AI Video",
  "description": "This is a cool video",
  "video_url": "https://...",
  "thumbnail_url": "https://...",
  "category": "video",
  "tags": ["ai", "video", "cool"],
  "ai_tool_used": "runway",
  "prompt_used": "A beautiful sunset...",
  "generation_params": {
    "model": "gen2",
    "duration": 5
  }
}
```

**Response**:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "My AI Video",
  "status": "published",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 4. 点赞视频

**POST** `/rest/v1/likes`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "video_id": "uuid"
}
```

**Response**:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "video_id": "uuid",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 5. 取消点赞

**DELETE** `/rest/v1/likes?video_id=eq.{video_id}&user_id=eq.{user_id}`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: 204 No Content

---

### 6. 添加评论

**POST** `/rest/v1/comments`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "video_id": "uuid",
  "content": "Great video!",
  "parent_id": null
}
```

**Response**:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "video_id": "uuid",
  "content": "Great video!",
  "likes_count": 0,
  "created_at": "2025-01-01T00:00:00Z",
  "user": {
    "id": "uuid",
    "username": "commenter123",
    "avatar_url": "https://..."
  }
}
```

---

### 7. 获取视频评论

**GET** `/rest/v1/comments?video_id=eq.{video_id}&select=*,user:profiles(id,username,avatar_url)&order=created_at.desc`

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "content": "Great video!",
      "likes_count": 5,
      "created_at": "2025-01-01T00:00:00Z",
      "user": {
        "id": "uuid",
        "username": "commenter123",
        "avatar_url": "https://..."
      }
    }
  ]
}
```

---

## 🎨 AI 生成相关 API

### 1. 生成图片

**POST** `/api/ai/generate-image`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "prompt": "A beautiful sunset over the ocean",
  "model": "dalle-3",
  "size": "1024x1024",
  "quality": "standard"
}
```

**Response**:
```json
{
  "image_url": "https://...",
  "generation_id": "uuid",
  "cost": 0.04
}
```

---

### 2. 生成视频

**POST** `/api/ai/generate-video`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "prompt": "A cat walking on the moon",
  "model": "runway-gen2",
  "duration": 5,
  "aspect_ratio": "16:9"
}
```

**Response**:
```json
{
  "video_url": "https://...",
  "generation_id": "uuid",
  "status": "processing",
  "cost": 0.05
}
```

---

### 3. 检查生成状态

**GET** `/api/ai/generation-status?generation_id={generation_id}`

**Response**:
```json
{
  "status": "completed", // 'processing' | 'completed' | 'failed'
  "result_url": "https://...",
  "error": null
}
```

---

## 💼 任务相关 API

### 1. 获取任务列表

**GET** `/rest/v1/tasks?select=*,client:profiles(id,username,avatar_url),assigned_creator:profiles(id,username,avatar_url)&status=eq.open&order=created_at.desc`

**Query Parameters**:
- `status`: string (默认: 'open')
- `category`: string (可选)
- `min_budget`: number (可选)
- `max_budget`: number (可选)
- `limit`: number (默认: 20)
- `offset`: number (默认: 0)

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "client_id": "uuid",
      "title": "Create AI Video for Brand",
      "description": "...",
      "category": "video",
      "budget": 100.00,
      "currency": "USD",
      "deadline": "2025-01-15T00:00:00Z",
      "status": "open",
      "created_at": "2025-01-01T00:00:00Z",
      "client": {
        "id": "uuid",
        "username": "client123",
        "avatar_url": "https://..."
      }
    }
  ]
}
```

---

### 2. 创建任务

**POST** `/rest/v1/tasks`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "title": "Create AI Video for Brand",
  "description": "I need a 30-second promotional video",
  "category": "video",
  "budget": 100.00,
  "currency": "USD",
  "deadline": "2025-01-15T00:00:00Z",
  "requirements": "High quality, professional style",
  "attachments": [
    {
      "url": "https://...",
      "type": "image"
    }
  ]
}
```

**Response**:
```json
{
  "id": "uuid",
  "client_id": "uuid",
  "title": "Create AI Video for Brand",
  "status": "open",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 3. 申请任务

**POST** `/rest/v1/task_applications`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "task_id": "uuid",
  "proposal": "I have 5 years of experience...",
  "proposed_price": 90.00,
  "estimated_delivery_days": 3,
  "portfolio_items": [
    {
      "type": "video",
      "url": "https://..."
    }
  ]
}
```

**Response**:
```json
{
  "id": "uuid",
  "task_id": "uuid",
  "creator_id": "uuid",
  "status": "pending",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 4. 接受申请

**PATCH** `/rest/v1/tasks?id=eq.{task_id}`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
Prefer: return=representation
```

**Body**:
```json
{
  "status": "in_progress",
  "assigned_creator_id": "uuid",
  "assigned_at": "2025-01-01T00:00:00Z"
}
```

---

### 5. 交付任务

**PATCH** `/rest/v1/tasks?id=eq.{task_id}`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "status": "completed",
  "delivery_url": "https://...",
  "delivery_notes": "Here is the final video",
  "delivered_at": "2025-01-01T00:00:00Z"
}
```

---

## 📚 课程相关 API

### 1. 获取课程列表

**GET** `/rest/v1/courses?select=*,creator:profiles(id,username,avatar_url)&status=eq.published&order=created_at.desc`

**Query Parameters**:
- `category`: string (可选)
- `min_price`: number (可选)
- `max_price`: number (可选)
- `is_free`: boolean (可选)
- `limit`: number (默认: 20)
- `offset`: number (默认: 0)

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "creator_id": "uuid",
      "title": "AI Video Creation Masterclass",
      "description": "...",
      "thumbnail_url": "https://...",
      "price": 49.99,
      "currency": "USD",
      "is_free": false,
      "students_count": 150,
      "rating": 4.8,
      "reviews_count": 30,
      "created_at": "2025-01-01T00:00:00Z",
      "creator": {
        "id": "uuid",
        "username": "expert123",
        "avatar_url": "https://..."
      }
    }
  ]
}
```

---

### 2. 创建课程

**POST** `/rest/v1/courses`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "title": "AI Video Creation Masterclass",
  "description": "Learn how to create amazing AI videos",
  "thumbnail_url": "https://...",
  "preview_video_url": "https://...",
  "price": 49.99,
  "currency": "USD",
  "category": "intermediate",
  "tags": ["ai", "video", "tutorial"],
  "content_type": "video",
  "content_url": "https://..."
}
```

---

### 3. 购买课程

**POST** `/api/courses/purchase`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "course_id": "uuid"
}
```

**Response**:
```json
{
  "payment_intent_id": "pi_...",
  "client_secret": "pi_..._secret_...",
  "amount": 49.99
}
```

---

### 4. 获取课程内容（已购买）

**GET** `/api/courses/{course_id}/content`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "content_url": "https://...", // 签名 URL
  "expires_at": "2025-01-01T01:00:00Z"
}
```

---

## 👤 用户相关 API

### 1. 获取用户资料

**GET** `/rest/v1/profiles?id=eq.{user_id}&select=*`

**Response**:
```json
{
  "id": "uuid",
  "username": "creator123",
  "display_name": "Creator Name",
  "avatar_url": "https://...",
  "bio": "AI video creator",
  "user_type": "freelancer",
  "industry_tags": ["AI视频创作者", "AI插画师"],
  "skill_level": "advanced",
  "followers_count": 1000,
  "following_count": 500,
  "videos_count": 50,
  "likes_received": 5000,
  "total_earnings": 5000.00,
  "rating": 4.8,
  "is_verified": true
}
```

---

### 2. 更新用户资料

**PATCH** `/rest/v1/profiles?id=eq.{user_id}`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
Prefer: return=representation
```

**Body**:
```json
{
  "display_name": "New Name",
  "bio": "Updated bio",
  "industry_tags": ["AI视频创作者"],
  "skill_level": "expert"
}
```

---

### 3. 关注用户

**POST** `/rest/v1/follows`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "following_id": "uuid"
}
```

---

### 4. 取消关注

**DELETE** `/rest/v1/follows?follower_id=eq.{user_id}&following_id=eq.{following_id}`

**Headers**:
```
Authorization: Bearer <token>
```

---

## 💰 支付相关 API

### 1. 创建支付意图（Stripe）

**POST** `/api/payments/create-intent`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "amount": 100.00,
  "currency": "USD",
  "type": "task", // 'task' | 'course' | 'subscription'
  "related_id": "uuid"
}
```

**Response**:
```json
{
  "client_secret": "pi_..._secret_...",
  "payment_intent_id": "pi_..."
}
```

---

### 2. 确认支付

**POST** `/api/payments/confirm`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "payment_intent_id": "pi_...",
  "type": "task",
  "related_id": "uuid"
}
```

**Response**:
```json
{
  "status": "succeeded",
  "transaction_id": "uuid"
}
```

---

### 3. 提现

**POST** `/api/payments/withdraw`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "amount": 100.00,
  "currency": "USD",
  "payment_method": "stripe" // 'stripe' | 'paypal'
}
```

**Response**:
```json
{
  "withdrawal_id": "uuid",
  "status": "pending",
  "estimated_arrival": "2025-01-05T00:00:00Z"
}
```

---

## 📨 消息相关 API

### 1. 获取消息列表

**GET** `/rest/v1/messages?or=(sender_id.eq.{user_id},receiver_id.eq.{user_id})&order=created_at.desc&limit=50`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "task_id": "uuid",
      "sender_id": "uuid",
      "receiver_id": "uuid",
      "content": "Hello!",
      "attachment_url": null,
      "is_read": false,
      "created_at": "2025-01-01T00:00:00Z",
      "sender": {
        "id": "uuid",
        "username": "sender123",
        "avatar_url": "https://..."
      }
    }
  ]
}
```

---

### 2. 发送消息

**POST** `/rest/v1/messages`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "task_id": "uuid",
  "receiver_id": "uuid",
  "content": "Hello!",
  "attachment_url": null
}
```

---

### 3. 标记消息为已读

**PATCH** `/rest/v1/messages?id=eq.{message_id}`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "is_read": true,
  "read_at": "2025-01-01T00:00:00Z"
}
```

---

## 📊 实时订阅（Supabase Realtime）

### 订阅新视频

```typescript
const channel = supabase
  .channel('new-videos')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'videos',
    filter: 'status=eq.published'
  }, (payload) => {
    console.log('New video:', payload.new);
  })
  .subscribe();
```

### 订阅任务更新

```typescript
const channel = supabase
  .channel('task-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'tasks',
    filter: `id=eq.${taskId}`
  }, (payload) => {
    console.log('Task updated:', payload.new);
  })
  .subscribe();
```

### 订阅新消息

```typescript
const channel = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `receiver_id=eq.${userId}`
  }, (payload) => {
    console.log('New message:', payload.new);
  })
  .subscribe();
```

---

## 🔒 错误处理

### 标准错误响应格式

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### 常见错误码

- `AUTH_REQUIRED` - 需要认证
- `PERMISSION_DENIED` - 权限不足
- `NOT_FOUND` - 资源不存在
- `VALIDATION_ERROR` - 验证失败
- `RATE_LIMIT_EXCEEDED` - 请求过于频繁
- `PAYMENT_FAILED` - 支付失败
- `INSUFFICIENT_CREDITS` - 额度不足

---

## 📝 API 使用示例

### 完整流程：创建并发布视频

```typescript
// 1. 生成视频
const generateResponse = await fetch('/api/ai/generate-video', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A cat walking on the moon',
    model: 'runway-gen2',
    duration: 5
  })
});

const { video_url, generation_id } = await generateResponse.json();

// 2. 等待生成完成
let status = 'processing';
while (status === 'processing') {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const statusResponse = await fetch(`/api/ai/generation-status?generation_id=${generation_id}`);
  const statusData = await statusResponse.json();
  status = statusData.status;
}

// 3. 创建视频记录
const videoResponse = await supabase
  .from('videos')
  .insert({
    title: 'My AI Video',
    description: 'A cat walking on the moon',
    video_url: video_url,
    category: 'video',
    tags: ['ai', 'video', 'cat'],
    ai_tool_used: 'runway',
    prompt_used: 'A cat walking on the moon'
  })
  .select()
  .single();

console.log('Video created:', videoResponse.data);
```

---

**文档版本**：V1.0  
**创建日期**：2025-01-XX







