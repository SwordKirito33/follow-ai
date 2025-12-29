# 🎨 AITok 前端架构设计

## 技术栈

### 核心框架
- **React 19** + **TypeScript**
- **Vite** - 构建工具
- **React Router v7** - 路由

### UI 框架
- **Tailwind CSS** - 样式
- **Lucide React** - 图标
- **Framer Motion** - 动画（可选）

### 状态管理
- **Zustand** - 轻量级状态管理
- **React Context** - 全局状态（语言、主题等）

### 视频/媒体
- **Video.js** 或 **Plyr** - 视频播放器
- **react-player** - 多格式播放器

### 表单处理
- **React Hook Form** - 表单管理
- **Zod** - 表单验证

### 实时通信
- **Supabase Realtime** - 实时订阅

### 文件上传
- **Supabase Storage** - 文件存储

---

## 📁 项目结构

```
aitok/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── common/          # 通用组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── Avatar.tsx
│   │   ├── video/           # 视频相关组件
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── VideoCard.tsx
│   │   │   ├── VideoFeed.tsx
│   │   │   └── VideoUpload.tsx
│   │   ├── ai/              # AI 创作组件
│   │   │   ├── AIGenerator.tsx
│   │   │   ├── ImageGenerator.tsx
│   │   │   ├── VideoGenerator.tsx
│   │   │   └── PromptInput.tsx
│   │   ├── task/            # 任务相关组件
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskDetail.tsx
│   │   │   └── ApplicationForm.tsx
│   │   ├── course/          # 课程相关组件
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CoursePlayer.tsx
│   │   │   └── CourseForm.tsx
│   │   └── chat/            # 聊天组件
│   │       ├── ChatWindow.tsx
│   │       ├── MessageList.tsx
│   │       └── MessageInput.tsx
│   │
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx         # 首页（视频流）
│   │   ├── Discover.tsx    # 发现页
│   │   ├── Create.tsx       # 创作页
│   │   ├── Profile.tsx     # 个人主页
│   │   ├── TaskMarket.tsx  # 任务广场
│   │   ├── TaskDetail.tsx  # 任务详情
│   │   ├── CourseMarket.tsx # 课程市场
│   │   ├── CourseDetail.tsx # 课程详情
│   │   ├── Messages.tsx    # 消息中心
│   │   ├── Wallet.tsx       # 钱包
│   │   └── Settings.tsx     # 设置
│   │
│   ├── layouts/             # 布局组件
│   │   ├── MainLayout.tsx   # 主布局（带导航栏）
│   │   ├── AuthLayout.tsx   # 认证布局
│   │   └── VideoLayout.tsx  # 全屏视频布局
│   │
│   ├── contexts/            # Context 提供者
│   │   ├── AuthContext.tsx  # 认证状态
│   │   ├── LanguageContext.tsx # 多语言
│   │   └── ThemeContext.tsx # 主题
│   │
│   ├── stores/              # Zustand 状态管理
│   │   ├── useAuthStore.ts
│   │   ├── useVideoStore.ts
│   │   ├── useTaskStore.ts
│   │   └── useUIStore.ts
│   │
│   ├── services/            # API 服务
│   │   ├── api/
│   │   │   ├── videos.ts
│   │   │   ├── tasks.ts
│   │   │   ├── courses.ts
│   │   │   ├── ai.ts
│   │   │   └── upload.ts
│   │   ├── supabase.ts      # Supabase 客户端
│   │   └── stripe.ts         # Stripe 客户端
│   │
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useAuth.ts
│   │   ├── useVideo.ts
│   │   ├── useTask.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── useRealtime.ts
│   │
│   ├── utils/               # 工具函数
│   │   ├── format.ts        # 格式化
│   │   ├── validation.ts    # 验证
│   │   └── constants.ts     # 常量
│   │
│   ├── types/               # TypeScript 类型
│   │   ├── user.ts
│   │   ├── video.ts
│   │   ├── task.ts
│   │   └── course.ts
│   │
│   ├── i18n/                # 国际化
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.ts
│   │       └── zh.ts
│   │
│   ├── App.tsx              # 根组件
│   ├── main.tsx             # 入口文件
│   └── vite-env.d.ts        # Vite 类型定义
│
├── public/                  # 静态资源
│   ├── images/
│   └── videos/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🎯 核心页面设计

### 1. 首页（Home.tsx）- 视频流

**功能**：
- 无限滚动视频流
- 上下滑动切换视频
- 点赞、评论、分享
- 关注按钮
- 视频信息展示

**组件结构**：
```tsx
<VideoFeed>
  <VideoPlayer />
  <VideoActions /> {/* 点赞、评论、分享 */}
  <VideoInfo /> {/* 作者、标题、描述 */}
  <CommentSection />
</VideoFeed>
```

**状态管理**：
- 使用 `useInfiniteScroll` hook
- 使用 `useVideoStore` 管理视频列表

---

### 2. 创作页（Create.tsx）

**功能**：
- AI 图片生成
- AI 视频生成
- 视频编辑
- 一键发布

**组件结构**：
```tsx
<CreatePage>
  <AIGeneratorTabs /> {/* 图片/视频/音乐 */}
  <PromptInput />
  <GenerationSettings />
  <PreviewPanel />
  <PublishButton />
</CreatePage>
```

---

### 3. 任务广场（TaskMarket.tsx）

**功能**：
- 任务列表展示
- 筛选（分类、价格、时间）
- 搜索
- 发布任务按钮

**组件结构**：
```tsx
<TaskMarket>
  <TaskFilters />
  <TaskList>
    <TaskCard />
  </TaskList>
  <CreateTaskButton />
</TaskMarket>
```

---

### 4. 个人主页（Profile.tsx）

**功能**：
- 用户信息（头像、标签、统计数据）
- 作品展示（视频/图片网格）
- 关注/粉丝列表
- 编辑资料按钮

**组件结构**：
```tsx
<Profile>
  <ProfileHeader /> {/* 头像、标签、统计 */}
  <ProfileTabs /> {/* 作品/收藏/课程 */}
  <ContentGrid /> {/* 视频/图片网格 */}
</Profile>
```

---

### 5. 任务详情（TaskDetail.tsx）

**功能**：
- 任务信息展示
- 申请任务表单
- 聊天窗口（如果已接单）
- 交付区域

**组件结构**：
```tsx
<TaskDetail>
  <TaskInfo />
  <TaskActions /> {/* 申请/聊天/交付 */}
  <ChatWindow /> {/* 如果已接单 */}
  <DeliveryArea /> {/* 如果已接单 */}
</TaskDetail>
```

---

## 🧩 核心组件设计

### VideoPlayer 组件

```tsx
interface VideoPlayerProps {
  videoUrl: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  autoplay = true,
  loop = true,
  muted = true,
  onEnded
}) => {
  // 实现视频播放逻辑
};
```

### AIGenerator 组件

```tsx
interface AIGeneratorProps {
  type: 'image' | 'video' | 'audio';
  onGenerate: (result: GenerationResult) => void;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({
  type,
  onGenerate
}) => {
  // 实现 AI 生成逻辑
};
```

### TaskCard 组件

```tsx
interface TaskCardProps {
  task: Task;
  onApply?: () => void;
  onView?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onApply,
  onView
}) => {
  // 实现任务卡片展示
};
```

---

## 🔄 状态管理设计

### useAuthStore (Zustand)

```typescript
interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    // 实现登录逻辑
  },
  // ...
}));
```

### useVideoStore (Zustand)

```typescript
interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  loading: boolean;
  fetchVideos: (page?: number) => Promise<void>;
  likeVideo: (videoId: string) => Promise<void>;
  addComment: (videoId: string, content: string) => Promise<void>;
}

export const useVideoStore = create<VideoState>((set) => ({
  videos: [],
  currentVideo: null,
  loading: false,
  fetchVideos: async (page) => {
    // 实现获取视频逻辑
  },
  // ...
}));
```

---

## 🎨 UI/UX 设计原则

### 1. 移动优先
- 响应式设计
- 触摸友好
- 快速加载

### 2. 视频体验
- 全屏播放
- 自动播放（静音）
- 流畅切换

### 3. AI 创作体验
- 实时预览
- 进度提示
- 错误处理

### 4. 任务系统
- 清晰的状态展示
- 简单的操作流程
- 实时通知

---

## 📱 响应式断点

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
}
```

---

## 🚀 性能优化

### 1. 代码分割
- 路由级别的代码分割
- 组件懒加载

### 2. 图片优化
- 使用 WebP 格式
- 懒加载
- 响应式图片

### 3. 视频优化
- 使用 CDN
- 自适应码率
- 预加载策略

### 4. 状态优化
- 使用 React.memo
- 使用 useMemo/useCallback
- 虚拟滚动（长列表）

---

## 🔐 安全考虑

### 1. 输入验证
- 使用 Zod 验证
- XSS 防护
- SQL 注入防护（后端）

### 2. 文件上传
- 文件类型验证
- 文件大小限制
- 病毒扫描（可选）

### 3. 认证
- JWT Token
- 刷新 Token
- 权限控制

---

## 📦 依赖包清单

```json
{
  "dependencies": {
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "react-router-dom": "^7.10.1",
    "zustand": "^4.5.0",
    "lucide-react": "^0.556.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "@supabase/supabase-js": "^2.39.0",
    "@stripe/stripe-js": "^2.4.0",
    "video.js": "^8.6.0",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "^5.8.2",
    "vite": "^6.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## 🎯 MVP 页面优先级

### Phase 1（必须）
1. ✅ 首页（视频流）
2. ✅ 创作页（AI 生成）
3. ✅ 个人主页
4. ✅ 任务广场

### Phase 2（重要）
5. ⏭️ 任务详情
6. ⏭️ 消息中心
7. ⏭️ 课程市场

### Phase 3（优化）
8. ⏭️ 钱包
9. ⏭️ 设置
10. ⏭️ AI 助理

---

**文档版本**：V1.0  
**创建日期**：2025-01-XX



