/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#ec4899',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // 优化配置
  safelist: [
    // 常用的动态类
    'opacity-0',
    'opacity-100',
    'animate-pulse',
    'animate-spin',
    'transition-opacity',
    'duration-300',
  ],
  // 禁用不必要的变体以减少 CSS 大小
  corePlugins: {
    // 可以禁用不需要的功能
    // 例如：
    // 'preflight': false,
  },
};
