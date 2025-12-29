# 👨‍💻 Follow.ai 开发者指南

> **最后更新**: 2024-12-24  
> **目标读者**: 新加入的开发者（包括AI助手）

---

## 1. 快速开始

### 环境设置

```bash
# 克隆项目
git clone <repository-url>
cd follow.ai

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入Supabase URL和Key

# 启动开发服务器
npm run dev
```

### 首次配置

1. **Supabase设置**
   - 注册Supabase账户
   - 创建项目
   - 获取Project URL和Anon Key
   - 填入 `.env.local`

2. **数据库迁移**
   - 执行 `SUPABASE_SETUP_SQL.md` 中的SQL脚本
   - 创建必要的表和触发器

---

## 2. 项目架构

### 设计理念

- **Event Sourcing**: XP系统使用事件溯源，所有变化记录为事件
- **类型安全**: 全面使用TypeScript，避免 `any` 类型
- **模块化**: 清晰的目录结构，职责分离
- **可扩展**: 易于添加新功能和页面

### 技术栈

- **React 19**: UI框架
- **TypeScript 5.8**: 类型系统
- **Vite 6**: 构建工具
- **Supabase**: 后端服务（数据库、认证、存储）
- **React Router**: 路由（HashRouter，兼容静态托管）
- **Tailwind CSS**: 样式框架
- **Framer Motion**: 动画库

---

## 3. 常见任务

### 添加新页面

1. **创建页面文件**
   ```typescript
   // pages/NewPage.tsx
   import React from 'react';
   import { useLanguage } from '@/contexts/LanguageContext';
   
   const NewPage: React.FC = () => {
     const { t } = useLanguage();
     return <div>{t('newPage.title')}</div>;
   };
   
   export default NewPage;
   ```

2. **添加路由**
   ```typescript
   // src/App.tsx
   const NewPage = lazy(() => import('./pages/NewPage'));
   
   <Route path="/new-page" element={<NewPage />} />
   ```

3. **添加翻译**
   ```typescript
   // src/i18n/locales/en.ts
   newPage: {
     title: 'New Page',
   },
   ```

---

### 创建新组件

```typescript
// src/components/NewComponent.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface NewComponentProps {
  title: string;
  onAction: () => void;
}

const NewComponent: React.FC<NewComponentProps> = ({ title, onAction }) => {
  const { user } = useAuth();
  
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

export default NewComponent;
```

---

### 添加XP奖励到新功能

```typescript
import { grantXp } from '@/lib/xp-service';
import { useAuth } from '@/contexts/AuthContext';

const { user, notifyXpAction } = useAuth();

// 在功能完成后
// ⚠️ 注意：前端参数名会被映射到数据库字段
// deltaXp → amount, note → reason, refId → source_id
// refType和metadata不存储到数据库
await grantXp({
  userId: user.id,
  deltaXp: 50,              // 映射到数据库的 amount 字段
  source: 'bonus',
  refType: 'feature',        // 不存储，仅用于前端逻辑
  refId: featureId,          // 映射到数据库的 source_id 字段
  note: 'Completed feature', // 映射到数据库的 reason 字段
  metadata: { ... },         // 不存储，仅用于前端逻辑
});

// 乐观UI更新
notifyXpAction('bonus', 50, 'feature', featureId, 'Completed new feature');

// ⚠️ 重要：查看 docs/DB_SCHEMA_CANONICAL.md 了解完整的字段映射关系
```

---

### 安全查询Supabase

```typescript
import { supabase } from '@/lib/supabase';

// ✅ 正确：有错误处理
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('user_id', userId);

if (error) {
  console.error('[Service] Query failed:', {
    error: error.message,
    userId,
    timestamp: new Date().toISOString(),
  });
  throw error;
}

return data;
```

---

### 正确处理错误

```typescript
try {
  await riskyOperation();
} catch (error) {
  // ✅ 结构化错误日志
  console.error('[Component] Operation failed:', {
    error: error instanceof Error ? error.message : String(error),
    context: { userId, taskId },
    timestamp: new Date().toISOString(),
  });
  
  // 用户友好的错误提示
  toast.error('操作失败，请重试');
  
  // 必要时重新抛出
  throw error;
}
```

---

## 4. 测试

### 手动测试XP系统

1. **提交任务测试**
   ```bash
   # 1. 登录账号
   # 2. 访问 /tasks
   # 3. 选择一个任务
   # 4. 填写表单并提交
   # 5. 检查是否显示成功消息
   ```

2. **验证数据库**
   ```sql
   -- 检查XP事件
   SELECT * FROM xp_events
   WHERE user_id = 'USER_ID'
   ORDER BY created_at DESC
   LIMIT 10;
   
   -- 检查profiles更新
   SELECT id, xp, total_xp, level
   FROM profiles
   WHERE id = 'USER_ID';
   ```

3. **前端验证**
   - 刷新Profile页面
   - 检查XP是否增加
   - 检查Level是否变化
   - 检查进度条是否更新

---

### SQL查询验证

```sql
-- 查看所有XP事件
SELECT 
  e.*,
  p.username,
  p.total_xp
FROM xp_events e
JOIN profiles p ON e.user_id = p.id
ORDER BY e.created_at DESC
LIMIT 20;

-- 查看排行榜
SELECT 
  username,
  total_xp,
  level,
  xp
FROM profiles
ORDER BY total_xp DESC
LIMIT 10;
```

---

## 5. 部署

### 构建

```bash
npm run build
```

输出目录: `dist/`

### 环境变量

生产环境需要设置：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 部署到Vercel

1. 连接GitHub仓库
2. 设置环境变量
3. 自动部署

---

## 6. 故障排除

### 常见问题

#### "Import not found" 错误

**原因**: 导入路径错误

**解决**:
```typescript
// ❌ 错误
import { Component } from '../components/Component';

// ✅ 正确
import { Component } from '@/components/Component';
```

---

#### XP不更新

**检查清单**:
1. 是否使用 `grantXp()` 而不是直接UPDATE？
2. 数据库触发器是否存在？
3. `xp_events` 表是否有新记录？
4. `profiles` 表是否自动更新？

**调试**:
```sql
-- 检查触发器
SELECT trigger_name, event_manipulation
FROM information_schema.triggers
WHERE event_object_table = 'xp_events';

-- 手动测试触发器
INSERT INTO xp_events (user_id, amount, source, reason)
VALUES ('USER_ID', 50, 'task', 'Test');
-- 检查profiles是否更新
```

---

#### Profile页面崩溃

**原因**: 访问undefined属性

**解决**:
```typescript
// ❌ 错误
<div>{user.earnings.toLocaleString()}</div>

// ✅ 正确
<div>{(user.earnings ?? 0).toLocaleString()}</div>
```

---

#### 登录卡在Loading

**原因**: AuthContext初始化超时

**解决**:
- 检查Supabase连接
- 检查网络请求
- 查看控制台错误

---

## 7. 代码审查清单

提交代码前检查：

- [ ] 所有导入使用 `@/` 别名
- [ ] 错误处理完整（try-catch）
- [ ] 没有 `console.log` 调试语句
- [ ] 类型定义完整（无 `any`）
- [ ] XP变化使用 `grantXp()`，不直接UPDATE
- [ ] 代码格式一致
- [ ] 无未使用的导入
- [ ] 无未使用的变量

---

## 8. 资源

### 文档

- `docs/PROJECT_STRUCTURE.md` - 项目结构
- `docs/CODE_HEALTH_REPORT.md` - 代码健康报告
- `docs/XP_SYSTEM_DOCUMENTATION.md` - XP系统文档
- `docs/API_REFERENCE.md` - API参考
- `docs/CODING_STANDARDS.md` - 代码规范

### 外部资源

- [React文档](https://react.dev)
- [TypeScript文档](https://www.typescriptlang.org)
- [Supabase文档](https://supabase.com/docs)
- [Vite文档](https://vitejs.dev)

---

**下一步**: 查看 `CODING_STANDARDS.md` 了解代码规范

