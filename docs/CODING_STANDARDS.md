# 📋 Follow.ai 代码规范

> **建立时间**: 2024-12-24  
> **适用范围**: 所有源代码文件

---

## 1. 导入约定

### ✅ 正确

```typescript
// 使用 @/ 别名
import { ComponentName } from '@/components/ComponentName';
import { utilFunction } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

// 具名导入
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
```

### ❌ 错误

```typescript
// 不要使用相对路径
import { ComponentName } from '../../components/ComponentName';
import { utilFunction } from '../../../lib/utils';

// 不要导入整个模块
import * as lib from '@/lib'; // ❌
import React from 'react'; // ✅ 但通常不需要
```

---

## 2. 文件命名

### 组件文件
- **格式**: PascalCase.tsx
- **示例**: `TaskSubmit.tsx`, `AuthModal.tsx`, `LevelUpModal.tsx`

### 工具文件
- **格式**: kebab-case.ts
- **示例**: `xp-service.ts`, `validation.ts`, `xp-system.ts`

### 类型文件
- **格式**: types.ts 或 database.types.ts
- **示例**: `database.ts`, `progression.ts`

### Hooks文件
- **格式**: useHookName.ts
- **示例**: `useXpQueue.ts`

---

## 3. 错误处理模式

### ✅ 正确

```typescript
try {
  await riskyOperation();
} catch (error) {
  console.error('[ComponentName] Operation failed:', {
    error: error instanceof Error ? error.message : String(error),
    context: { userId, taskId },
    timestamp: new Date().toISOString()
  });
  throw error; // 或处理错误
}
```

### ❌ 错误

```typescript
try {
  await riskyOperation();
} catch (error) {
  console.log(error); // ❌ 太模糊，没有上下文
  // ❌ 没有错误处理
}
```

---

## 4. 组件结构

### 标准顺序

```typescript
// 1. 导入语句
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// 2. 类型定义
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. 组件函数
const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  // Hooks
  const { user } = useAuth();
  const [state, setState] = useState('');
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 事件处理
  const handleClick = () => {
    // ...
  };
  
  // 渲染
  return (
    <div>
      {/* ... */}
    </div>
  );
};

// 4. 导出
export default Component;
```

---

## 5. Supabase查询模式

### ✅ 正确

```typescript
const { data, error } = await supabase
  .from('table')
  .select('columns')
  .eq('id', userId);

if (error) {
  console.error('[ServiceName] Query failed:', {
    error: error.message,
    userId,
    timestamp: new Date().toISOString(),
  });
  throw error;
}

return data;
```

### ❌ 错误

```typescript
const { data } = await supabase.from('table').select('*'); // ❌ 没有错误处理
```

---

## 6. XP系统使用

### ✅ 正确

```typescript
import { grantXp } from '@/lib/xp-service';

await grantXp({
  userId: user.id,
  deltaXp: 100,
  source: 'task',
  refType: 'task',
  refId: taskId,
  note: 'Task completion',
});
```

### ❌ 错误

```typescript
// ❌ 不要直接更新profiles表
await supabase
  .from('profiles')
  .update({ xp: user.xp + 100 });

// ❌ 不要绕过xp-service
await supabase.from('xp_events').insert({ ... });
```

---

## 7. Console语句规范

### ✅ 允许

```typescript
// 错误日志（必须）
console.error('[Component] Operation failed:', error);

// 警告日志（合理）
console.warn('[Component] Deprecated feature used');
```

### ❌ 禁止

```typescript
// ❌ 调试日志（生产环境应移除）
console.log('Debug info:', data);

// ❌ 信息日志（使用专门的日志工具）
console.info('User action');
```

---

## 8. 类型安全

### ✅ 正确

```typescript
interface User {
  id: string;
  email: string;
  profile: {
    xp: number;
    level: number;
  };
}

function processUser(user: User): number {
  return user.profile.xp;
}
```

### ❌ 错误

```typescript
// ❌ 使用any类型
function processUser(user: any): any {
  return user.profile.xp;
}

// ❌ 类型断言过多
const xp = (user as any).profile.total_xp;
```

---

## 9. 性能优化

### React优化

```typescript
// ✅ 使用React.memo防止不必要的重渲染
const ExpensiveComponent = React.memo(({ data }) => {
  // ...
});

// ✅ 使用useMemo缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ 使用useCallback缓存函数
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);
```

---

## 10. 代码组织

### 目录结构

```
src/
├── components/     # 可复用组件
├── pages/          # 页面组件
├── contexts/       # React Context
├── hooks/          # 自定义Hooks
├── lib/            # 工具函数和服务
├── services/       # 业务服务层
├── types/          # TypeScript类型定义
└── utils/          # 通用工具函数
```

### 文件大小

- **组件文件**: 建议 < 300行
- **服务文件**: 建议 < 200行
- **工具文件**: 建议 < 150行

如果文件过大，考虑拆分：
- 提取子组件
- 提取自定义hooks
- 提取工具函数

---

## 11. 注释规范

### 函数注释

```typescript
/**
 * 授予用户XP
 * @param userId - 用户UUID
 * @param deltaXp - XP数量（正数）
 * @param source - XP来源 ('task' | 'bonus' | 'admin')
 * @param note - 原因说明
 * @returns Promise<void>
 * @throws Error 如果数据库插入失败
 */
export async function grantXp(params: GrantXpParams): Promise<void> {
  // ...
}
```

### 复杂逻辑注释

```typescript
// 合并800ms内的XP事件，避免UI刷屏
const MERGE_WINDOW_MS = 800;

// 处理延迟，确保用户能看到每个事件
const PROCESS_DELAY_MS = 2200;
```

---

## 12. Git提交规范

### 提交消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试
- `chore`: 构建/工具

### 示例

```
fix(xp): 修复XP字段名错误 (note→reason)

修复grantXp函数中的字段名不匹配问题。
数据库使用'reason'字段，但代码使用'note'。

Fixes #123
```

---

## 13. 代码审查清单

提交代码前检查：

- [ ] 所有导入使用 `@/` 别名
- [ ] 错误处理完整（try-catch）
- [ ] 没有 `console.log` 调试语句
- [ ] 类型定义完整（无 `any`）
- [ ] XP变化使用 `grantXp()`，不直接UPDATE
- [ ] 代码格式一致（使用Prettier）
- [ ] 无未使用的导入
- [ ] 无未使用的变量

---

**下一步**: 扫描代码库，生成规范违反清单

