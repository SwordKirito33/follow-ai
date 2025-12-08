# 多语言功能使用指南

## ✅ 已完成的功能

### 1. **i18n 系统架构**
- ✅ 使用 React Context API 实现
- ✅ 支持英文（en）和中文（zh）
- ✅ 自动检测浏览器语言
- ✅ 语言选择保存到 localStorage

### 2. **语言选择器组件**
- ✅ 位于 Navbar 右上角（桌面端）
- ✅ 移动端菜单中也包含
- ✅ 显示当前语言和国旗图标
- ✅ 下拉菜单选择语言

### 3. **已翻译的页面和组件**
- ✅ Navbar（导航栏）
- ✅ Hero（首页横幅）
- ✅ Rankings（排行榜）
- ✅ Home（主页）
- ✅ Tasks（任务页面）
- ✅ Footer（页脚）

## 📁 文件结构

```
follow.ai/
├── i18n/
│   ├── index.ts              # i18n配置和导出
│   └── locales/
│       ├── en.ts             # 英文翻译
│       └── zh.ts             # 中文翻译
├── contexts/
│   └── LanguageContext.tsx   # 语言Context和Provider
└── components/
    └── LanguageSelector.tsx   # 语言选择器组件
```

## 🔧 如何使用

### 在组件中使用翻译

```tsx
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent: React.FC = () => {
  const { t, locale, setLocale } = useLanguage();
  
  return (
    <div>
      <h1>{t('nav.browseTools')}</h1>
      <p>当前语言: {locale}</p>
      <button onClick={() => setLocale('zh')}>切换到中文</button>
    </div>
  );
};
```

### 翻译键的命名规则

使用点号分隔的层级结构：
- `nav.browseTools` - 导航栏的"浏览工具"
- `hero.title` - Hero部分的标题
- `tasks.title` - 任务页面的标题

### 添加新的翻译

1. **在 `i18n/locales/en.ts` 中添加英文翻译**：
```typescript
export const en = {
  // ... 现有翻译
  myNewSection: {
    title: 'My New Title',
    description: 'My new description',
  },
};
```

2. **在 `i18n/locales/zh.ts` 中添加中文翻译**：
```typescript
export const zh = {
  // ... 现有翻译
  myNewSection: {
    title: '我的新标题',
    description: '我的新描述',
  },
};
```

3. **在组件中使用**：
```tsx
const { t } = useLanguage();
<h1>{t('myNewSection.title')}</h1>
```

## 🌍 支持的语言

当前支持：
- 🇺🇸 **English (en)** - 默认语言
- 🇨🇳 **中文 (zh)** - 简体中文

### 添加新语言

1. 创建新的翻译文件 `i18n/locales/[locale].ts`
2. 在 `i18n/index.ts` 中导入并添加到 `translations` 对象
3. 在 `supportedLocales` 数组中添加新语言代码
4. 在 `LanguageSelector.tsx` 中添加语言选项

示例：
```typescript
// i18n/locales/ja.ts
export const ja = {
  nav: {
    browseTools: 'ツールを閲覧',
    // ...
  },
  // ...
};

// i18n/index.ts
import { ja } from './locales/ja';
export const translations: Record<Locale, Translations> = {
  en,
  zh,
  ja, // 添加新语言
};
export const supportedLocales: Locale[] = ['en', 'zh', 'ja'];
```

## 🎨 语言选择器位置

- **桌面端**：Navbar 右上角，在"Submit Review"按钮之前
- **移动端**：移动菜单中，在导航链接之后

## 💾 语言持久化

- 用户选择的语言保存在 `localStorage` 中
- Key: `follow-ai-locale`
- 下次访问时自动恢复用户选择的语言

## 🔄 自动语言检测

系统会按以下顺序检测语言：
1. localStorage 中保存的用户选择
2. 浏览器语言设置
3. 默认语言（英文）

## 📝 翻译键列表

### 导航 (nav)
- `nav.browseTools` - 浏览工具
- `nav.earnMoney` - 赚取收益
- `nav.payments` - 支付
- `nav.rankings` - 排行榜
- `nav.aiNews` - AI新闻
- `nav.about` - 关于
- `nav.submitReview` - 提交评测
- `nav.profile` - 个人资料

### Hero 部分 (hero)
- `hero.title` - 标题
- `hero.titleHighlight` - 高亮标题
- `hero.subtitle` - 副标题
- `hero.joinCount` - 加入人数
- `hero.startEarning` - 开始赚钱
- `hero.getValidated` - 获得验证
- `hero.stats.reviews` - 真实评测
- `hero.stats.tools` - 已验证工具
- `hero.stats.earned` - 测试者已赚取

### 排行榜 (rankings)
- `rankings.title` - 标题
- `rankings.subtitle` - 副标题
- `rankings.reviewAndEarn` - 评测赚取
- `rankings.reviewsToday` - 今日评测
- `rankings.useCases` - 使用场景

### 任务 (tasks)
- `tasks.title` - 标题
- `tasks.subtitle` - 副标题
- `tasks.preCheck` - AI预检
- `tasks.manualVerification` - 人工验证
- `tasks.requiredForPayout` - 支付所需
- `tasks.reward` - 奖励
- `tasks.spotsRemaining` - 剩余名额
- `tasks.timeLeft` - 剩余时间
- `tasks.startTask` - 开始任务

更多翻译键请查看 `i18n/locales/en.ts` 和 `i18n/locales/zh.ts`

## 🐛 常见问题

### Q: 翻译没有显示？
A: 确保：
1. 组件被 `LanguageProvider` 包裹
2. 使用了 `useLanguage()` hook
3. 翻译键在两种语言文件中都存在

### Q: 如何添加动态内容到翻译？
A: 目前翻译系统不支持插值。如果需要动态内容，可以在翻译后手动拼接：
```tsx
const { t } = useLanguage();
<p>{t('tasks.spotsRemaining')}: {task.spots}</p>
```

### Q: 如何翻译数字和日期？
A: 数字通常不需要翻译。日期可以使用 `toLocaleDateString()`：
```tsx
new Date().toLocaleDateString(locale, { ... })
```

## 🚀 下一步

可以考虑添加：
- [ ] 更多语言支持（日语、韩语等）
- [ ] 翻译插值功能（支持变量）
- [ ] 复数形式支持
- [ ] RTL（从右到左）语言支持
- [ ] 翻译管理工具/界面

---

**多语言功能已完全集成！** 🎉

现在用户可以在右上角选择语言，整个网站会立即切换。

