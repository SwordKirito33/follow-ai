import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    host: true, // 允许外部访问
    allowedHosts: [
      'sharlene-gasiform-unflatteringly.ngrok-free.dev',
      '.ngrok-free.dev', // 允许所有 ngrok 域名
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    // 优化构建输出
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console 语句
        drop_debugger: true, // 移除 debugger 语句
      },
    },
    // 优化 rollup 配置
    rollupOptions: {
      output: {
        // 优化代码分割策略
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI 库
          'ui-vendor': ['lucide-react', 'sonner'],
          
          // 数据库和后端
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // 状态管理
          'state-vendor': ['zustand', 'immer'],
          
          // 数据获取
          'query-vendor': ['@tanstack/react-query'],
          
          // 监控和分析
          'monitoring-vendor': ['@sentry/react', '@sentry/tracing'],
          
          // 其他库
          'utils-vendor': ['framer-motion', 'i18next', 'react-i18next', 'react-window'],
        },
        // 优化文件名
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // 增加 chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
    
    // 启用 source map 用于生产环境调试
    sourcemap: false,
    
    // 优化 CSS 处理
    cssCodeSplit: true,
    
    // 禁用 CSS 压缩（让 Tailwind 处理）
    cssMinify: true,
  },
  
  // 优化依赖预加载
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      '@tanstack/react-query',
      '@supabase/supabase-js',
    ],
    // 排除不需要预加载的大型库
    exclude: ['@sentry/react'],
  },
});
