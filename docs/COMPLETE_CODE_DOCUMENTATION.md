# Follow.ai 完整代码文档

> **生成时间**: 2024-12-24  
> **项目版本**: 2.0  
> **总文件数**: 103 个文件  
> **总代码行数**: ~17,801 行

---

## 📋 目录

1. [项目配置](#1-项目配置)
2. [入口文件](#2-入口文件)
3. [核心上下文](#3-核心上下文)
4. [类型定义](#4-类型定义)
5. [核心服务](#5-核心服务)
6. [工具函数](#6-工具函数)
7. [UI组件](#7-ui组件)
8. [页面组件](#8-页面组件)
9. [服务层](#9-服务层)
10. [国际化](#10-国际化)
11. [常量与数据](#11-常量与数据)

---

## 1. 项目配置

### 1.1 package.json

```json
{
  "name": "follow.ai",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "check-imports": "grep -r \"from ['\\\"]\\.\\.\" src/ pages/ || echo 'All imports use @ alias ✅'",
    "health-check": "npm run type-check && npm run check-imports"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.87.1",
    "framer-motion": "^12.23.26",
    "lucide-react": "^0.556.0",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "react-router-dom": "^7.10.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

### 1.2 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
```

### 1.3 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "types": ["node"],
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### 1.4 index.html

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Follow.ai - Where AI Tools Show Their Real Work</title>
    <meta name="description" content="The world's first AI tool review platform where real work outputs are mandatory. Join the community of authentic AI testers. Earn $20-200 per review." />
    <!-- ... (完整meta标签) ... -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- ... (完整样式和脚本) ... -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 2. 入口文件

### 2.1 src/main.tsx

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import ErrorBoundary from '@/components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

### 2.2 src/App.tsx

```typescript
import React, { useEffect, lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider, useToast } from '@/components/ui/toast';
import XpEventRenderer from '@/components/XpEventRenderer';
import Navbar from '@/components/Navbar';
import VisitTracker from '@/components/VisitTracker';
import IntroAnimation from '@/components/IntroAnimation/IntroAnimation';
import CommandPalette from '@/components/CommandPalette';
import Footer from '@/components/Footer';
import { hasSeenIntro } from '@/components/IntroAnimation/utils';

// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const SubmitReview = lazy(() => import('../pages/SubmitReview'));
const TaskSubmit = lazy(() => import('../pages/TaskSubmit'));
// ... (其他lazy imports)

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const { isLoading } = useAuth();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <IntroAnimation />
      <XpEventRenderer />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
      <motion.div
        className="flex flex-col min-h-screen font-sans text-gray-900"
        initial={{ opacity: hasSeenIntro() ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <VisitTracker />
        <Navbar />
        <main className="flex-grow page-transition">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/test-supabase" element={<SupabaseTest />} />
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={<SubmitReview />} />
              <Route path="/task/:taskId/submit" element={<TaskSubmit />} />
              <Route path="/history" element={<SubmissionHistory />} />
              <Route path="/xp-history" element={<XpHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tasks" element={<Tasks />} />
              {/* ... (其他路由) ... */}
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </motion.div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
```

---

## 3. 核心上下文

### 3.1 src/contexts/AuthContext.tsx

```typescript
// 完整文件内容请参考实际文件
// 主要功能：
// - 用户认证状态管理
// - Supabase会话管理
// - 用户资料获取和更新
// - XP事件广播
// - 超时保护机制
```

### 3.2 src/contexts/LanguageContext.tsx

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, translations, defaultLocale, supportedLocales } from '@/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const getInitialLocale = (): Locale => {
    const saved = localStorage.getItem('follow-ai-locale') as Locale;
    if (saved && supportedLocales.includes(saved)) {
      return saved;
    }
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'zh' && supportedLocales.includes('zh')) {
      return 'zh';
    }
    return defaultLocale;
  };

  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('follow-ai-locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        let fallbackValue: any = translations[defaultLocale];
        for (const fk of keys) {
          fallbackValue = fallbackValue?.[fk];
        }
        return fallbackValue || key;
      }
    }
    
    return value || key;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

---

## 4. 类型定义

### 4.1 src/types/database.ts

```typescript
// 完整的数据库类型定义
// 包含所有Supabase表的Row、Insert、Update类型
// 主要表：profiles, tools, reviews, tasks, task_submissions, xp_events等
```

### 4.2 src/types/progression.ts

```typescript
// 用户进度相关类型
// - OnboardingStep
// - HireTask
// - TaskType
// - RewardType
```

### 4.3 src/vite-env.d.ts

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string
  readonly VITE_GEMINI_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 5. 核心服务

### 5.1 src/lib/supabase.ts

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ Supabase environment variables not found. Using mock client for development.')
    }
    
    const mockUrl = 'https://placeholder.supabase.co'
    const mockKey = 'REDACTED_JWT'
    
    supabaseInstance = createClient<Database>(mockUrl, mockKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
        storage: localStorage
      }
    })
    
    return supabaseInstance
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage
    }
  })

  return supabaseInstance
}

export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(target, prop) {
    const client = getSupabaseClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

export async function ensureProfileExists(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        xp: 0,
        level: 1,
        total_xp: 0,
        profile_completion: 0,
        skills: [],
        ai_tools: [],
        reputation_score: 0,
      })
      .select()
      .single();

    if (error && !error.message.includes('duplicate') && error.code !== '23505') {
      console.error('Failed to ensure profile exists:', error);
    }
  } catch (err) {
    console.error('ensureProfileExists exception:', err);
  }
}
```

### 5.2 src/lib/xp-service.ts

```typescript
// XP系统核心服务
// - grantXp(): 授予用户XP（通过xp_events表）
// - adminGrantXp(): 管理员授予XP（通过RPC）
// - listXpEvents(): 列出用户的XP事件
// - fetchLeaderboard(): 获取排行榜数据

// 字段映射：
// - deltaXp → amount
// - note → reason
// - refId → source_id
// - refType 和 metadata 不存储到数据库
```

### 5.3 src/lib/gamification.ts

```typescript
// 游戏化配置和计算
// - getGamificationConfig(): 从数据库获取配置
// - getLevelFromXp(): 根据XP计算等级
// - getActiveLevels(): 获取活跃等级配置
```

### 5.4 src/lib/constants.ts

```typescript
/**
 * XP progression table
 */
export const XP_PER_LEVEL = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  // ... (更多等级)
] as const;

/**
 * Profile completion weights
 */
export const PROFILE_COMPLETION_WEIGHTS = {
  avatar: 20,
  bio: 20,
  skills: 20,
  ai_tools: 20,
  portfolio: 20,
} as const;

export const MIN_EXPERIENCE_CHARS = 100;
export const MIN_BIO_LENGTH = 50;
export const MAX_SKILLS = 50;
export const MAX_AI_TOOLS = 50;

export const UPLOAD_LIMITS = {
  DAILY_PER_BUCKET: 30,
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'text/markdown'],
} as const;

export const STORAGE_BUCKETS = {
  AVATARS: 'user-avatars',
  REVIEW_OUTPUTS: 'review-outputs',
  PORTFOLIO_IMAGES: 'portfolio-images',
} as const;
```

### 5.5 src/lib/validation.ts

```typescript
import { MIN_EXPERIENCE_CHARS } from './constants';

/**
 * Unicode-aware character counting
 */
export function countCharacters(value: string): number {
  const trimmed = value.trim();
  return Array.from(trimmed).length;
}

/**
 * Validate experience text
 */
export function validateExperienceText(value: string): {
  valid: boolean;
  charCount: number;
  message: string;
} {
  const charCount = countCharacters(value);
  
  if (charCount < MIN_EXPERIENCE_CHARS) {
    return {
      valid: false,
      charCount,
      message: `Experience must be at least ${MIN_EXPERIENCE_CHARS} characters (currently ${charCount})`,
    };
  }

  if (detectRepetitiveText(value)) {
    return {
      valid: false,
      charCount,
      message: 'Experience appears to be repetitive. Please provide meaningful content.',
    };
  }

  return {
    valid: true,
    charCount,
    message: 'Valid',
  };
}

function detectRepetitiveText(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 20) return false;

  const segments = trimmed.split(/\s+/);
  if (segments.length < 5) return false;

  const freqMap = new Map<string, number>();
  segments.forEach(seg => {
    const normalized = seg.toLowerCase();
    freqMap.set(normalized, (freqMap.get(normalized) || 0) + 1);
  });

  const maxFreq = Math.max(...freqMap.values());
  return maxFreq > segments.length * 0.5;
}
```

### 5.6 src/lib/ab.ts

```typescript
// A/B测试工具
// - getVariant(): 根据用户ID确定测试变体
```

### 5.7 src/lib/analytics.ts

```typescript
// 事件追踪
// - trackEvent(): 追踪用户行为事件
```

---

## 6. 工具函数

### 6.1 src/hooks/useXpQueue.ts

```typescript
// XP事件队列Hook
// - 合并短时间内发生的多个XP事件
// - 避免UI通知刷屏
```

---

## 7. UI组件

### 7.1 src/components/ui/follow-button.tsx

```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'subtle';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface FollowButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
  to?: string;
  as?: 'button' | 'link';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

const FollowButton: React.FC<FollowButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  to,
  as,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = [
    'inline-flex items-center justify-center',
    'font-medium text-sm',
    'h-10',
    'px-4 py-2',
    'rounded-xl',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'active:scale-95',
  ].join(' ');

  const variantStyles = {
    primary: [
      'bg-gradient-to-r from-[#3BA7FF] to-[#0F6FFF]',
      'text-white',
      'hover:from-[#4BB7FF] hover:to-[#1F7FFF]',
      'hover:shadow-lg hover:shadow-blue-500/30',
      'active:from-[#2B97EF] active:to-[#005FEF]',
    ].join(' '),
    // ... (其他变体)
  };

  const sizeStyles = {
    sm: 'h-8 px-3 py-1.5 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 py-3 text-base',
  };

  // ... (完整实现)
};

export default FollowButton;
```

### 7.2 src/components/Navbar.tsx

```typescript
// 导航栏组件
// - 响应式设计
// - 用户菜单
// - 语言选择器
// - 登录/注册按钮
```

### 7.3 src/components/Footer.tsx

```typescript
// 页脚组件
// - 链接导航
// - 社交媒体链接
// - 版权信息
```

### 7.4 src/components/AuthModal.tsx

```typescript
// 认证模态框
// - 登录表单
// - 注册表单（包含username字段）
// - 密码显示/隐藏
// - 错误处理
```

### 7.5 src/components/LevelUpModal.tsx

```typescript
// 升级模态框
// - 显示升级动画
// - 展示新等级信息
// - 解锁功能提示
```

### 7.6 src/components/XpEventRenderer.tsx

```typescript
// XP事件渲染器
// - 监听xp:earned事件
// - 显示XP获得通知
// - 处理升级逻辑
```

### 7.7 src/components/ErrorBoundary.tsx

```typescript
// React错误边界
// - 捕获组件错误
// - 显示友好错误页面
```

### 7.8 src/components/CommandPalette.tsx

```typescript
// 命令面板（Cmd+K / Ctrl+K）
// - 快速导航
// - 搜索功能
// - 快捷键操作
```

### 7.9 src/components/IntroAnimation/IntroAnimation.tsx

```typescript
// 首次访问动画
// - F形状卡片动画
// - 扫描验证效果
// - 响应式设计
```

---

## 8. 页面组件

### 8.1 pages/Home.tsx

```typescript
// 首页
// - Hero区域
// - 排行榜预览
// - 最新评测
// - 功能展示
```

### 8.2 pages/Tasks.tsx

```typescript
// 任务列表页
// - 从Supabase获取真实任务数据
// - 难度筛选
// - XP奖励显示
// - 用户进度显示
```

### 8.3 pages/TaskSubmit.tsx

```typescript
// 任务提交页
// - 加载任务详情
// - 提交表单
// - XP奖励计算
// - 使用grantXp()授予XP
```

### 8.4 pages/Profile.tsx

```typescript
// 用户资料页
// - 显示用户信息
// - XP和等级显示
// - 进度条
// - 资料编辑
```

### 8.5 pages/Leaderboard.tsx

```typescript
// 排行榜页
// - 本周/全时间排行榜
// - 使用fetchLeaderboard()获取数据
// - 用户排名显示
```

### 8.6 pages/XpHistory.tsx

```typescript
// XP历史页
// - 显示所有XP事件
// - 使用listXpEvents()获取数据
// - 事件详情展示
// - 分页加载
```

### 8.7 pages/SubmitReview.tsx

```typescript
// 提交评测页
// - 文件上传
// - AI质量分析（模拟）
// - 评测文本输入（支持中文字符计数）
// - 提交处理
```

### 8.8 pages/Onboarding.tsx

```typescript
// 新用户引导页
// - 多步骤引导
// - 完成奖励XP
// - 进度追踪
```

### 8.9 pages/Hire.tsx

```typescript
// 招聘市场页
// - 任务列表
// - 筛选功能
// - 等级要求检查
```

### 8.10 pages/Dashboard.tsx

```typescript
// 用户仪表板
// - KPI展示
// - 下一步行动建议
// - 快速链接
```

---

## 9. 服务层

### 9.1 src/services/authService.ts

```typescript
// 认证服务
// - 登录
// - 注册
// - 登出
// - 密码重置
```

### 9.2 src/services/taskService.ts

```typescript
// 任务服务
// - 获取任务列表
// - 获取任务详情
// - 检查用户资格
```

### 9.3 src/services/submissionService.ts

```typescript
// 提交服务
// - 创建提交
// - 获取提交历史
// - 更新提交状态
```

### 9.4 src/services/profileService.ts

```typescript
// 资料服务
// - 获取/更新资料
// - 添加/删除技能
// - 添加/删除AI工具
// - 计算资料完成度
```

### 9.5 src/services/storageService.ts

```typescript
// 存储服务
// - 文件上传
// - 上传限制检查
// - 头像上传
// - 任务输出上传
```

### 9.6 src/services/reviewService.ts

```typescript
// 评测服务
// - 获取评测列表
// - 创建评测
// - 更新评测
```

### 9.7 src/services/leaderboardService.ts

```typescript
// 排行榜服务
// - 获取排行榜
// - 获取用户排名
```

### 9.8 src/services/portfolioService.ts

```typescript
// 作品集服务
// - 获取作品集
// - 创建/更新/删除作品项
```

### 9.9 src/services/waitlistService.ts

```typescript
// 等待列表服务
// - 添加到等待列表
// - 检查等待列表状态
// - 获取等待列表数量
```

---

## 10. 国际化

### 10.1 src/i18n/index.ts

```typescript
// 国际化配置
// - 支持的语言
// - 默认语言
// - 翻译对象
```

### 10.2 src/i18n/locales/en.ts

```typescript
// 英文翻译
// - 所有UI文本的英文版本
```

### 10.3 src/i18n/locales/zh.ts

```typescript
// 中文翻译
// - 所有UI文本的中文版本
```

---

## 11. 常量与数据

### 11.1 src/data.ts

```typescript
// 模拟数据
// - TOOLS: AI工具列表
// - REVIEWS: 评测列表
// - NEWS: 新闻列表
```

### 11.2 src/constants/intro.ts

```typescript
// 介绍动画常量
// - 动画时间
// - F形状网格定义
// - 卡片尺寸
// - 弹簧动画配置
```

---

## 📊 项目统计

- **总文件数**: 103
- **总代码行数**: ~17,801
- **TypeScript文件**: 103
- **React组件**: ~60
- **服务文件**: 11
- **页面组件**: 23

---

## 🔑 关键特性

1. **XP系统（Event Sourcing）**
   - 所有XP变更通过`xp_events`表记录
   - 数据库触发器自动更新`profiles.xp`和`profiles.total_xp`
   - 前端通过`grantXp()`授予XP

2. **认证系统**
   - Supabase Auth集成
   - 自动创建用户资料
   - 超时保护机制

3. **国际化**
   - 支持英文和中文
   - 本地存储语言偏好
   - 浏览器语言检测

4. **响应式设计**
   - 移动端适配
   - 平板适配
   - 桌面端优化

5. **代码分割**
   - 页面级懒加载
   - 供应商代码分离
   - 优化构建体积

---

## 📝 注意事项

1. **导入路径**: 所有导入必须使用`@/`别名，禁止使用相对路径
2. **XP授予**: 必须使用`grantXp()`，禁止直接更新`profiles.xp`
3. **错误处理**: 所有异步操作必须包含错误处理
4. **类型安全**: 禁止使用`any`类型
5. **字符计数**: 使用`Array.from()`进行Unicode字符计数

---

**文档生成时间**: 2024-12-24  
**最后更新**: 2024-12-24

