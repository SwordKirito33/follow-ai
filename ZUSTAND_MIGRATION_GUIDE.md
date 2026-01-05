# Zustand 状态管理迁移指南

## 概述

本指南说明如何从 AuthContext 迁移到 Zustand 状态管理。

## 新的状态管理结构

```
src/stores/
├── userStore.ts          # 用户信息
├── authStore.ts          # 认证状态
├── notificationStore.ts  # 通知
├── preferencesStore.ts   # 用户偏好
└── index.ts             # 导出
```

## 迁移步骤

### 1. 替换 useAuth() 为 useAuthStore()

**Before (AuthContext):**
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isLoading, error, logout } = useAuth();
  // ...
}
```

**After (Zustand):**
```typescript
import { useAuthStore, useUserStore } from '@/stores';

function MyComponent() {
  const { session, isLoading, error } = useAuthStore();
  const { user } = useUserStore();
  
  // 登出逻辑需要在 AuthContext 中处理
  // ...
}
```

### 2. 用户信息管理

**Before:**
```typescript
const { user } = useAuth();
```

**After:**
```typescript
import { useUserStore } from '@/stores';

function MyComponent() {
  const { user, updateUser } = useUserStore();
  
  // 更新用户信息
  updateUser({ username: 'new-name' });
}
```

### 3. 通知管理

**Before:**
```typescript
// 使用 toast 或其他方式
```

**After:**
```typescript
import { useNotificationStore } from '@/stores';

function MyComponent() {
  const { addNotification } = useNotificationStore();
  
  // 添加通知
  addNotification({
    type: 'success',
    title: 'Success',
    message: 'Operation completed',
  });
}
```

### 4. 用户偏好

**Before:**
```typescript
// 存储在 localStorage 中
```

**After:**
```typescript
import { usePreferencesStore } from '@/stores';

function MyComponent() {
  const { preferences, setPreference } = usePreferencesStore();
  
  // 获取偏好
  const theme = preferences.theme;
  
  // 更新偏好
  setPreference('theme', 'light');
}
```

## 关键差异

| 功能 | AuthContext | Zustand |
|------|------------|---------|
| 状态持久化 | 手动 localStorage | 自动（persist 中间件） |
| 状态分离 | 单一 context | 多个独立 store |
| 性能 | 全局重新渲染 | 选择性订阅 |
| 类型安全 | 部分 | 完整 |
| 中间件 | 无 | 支持（immer, persist） |

## 迁移检查清单

- [ ] 安装 Zustand 和 Immer
- [ ] 创建所有 store 文件
- [ ] 更新所有组件使用新的 hooks
- [ ] 移除 AuthContext 中的冗余代码
- [ ] 保留 AuthContext 用于认证流程
- [ ] 测试所有功能
- [ ] 验证状态持久化
- [ ] 检查性能改进

## 常见问题

### Q: 为什么保留 AuthContext？
A: AuthContext 仍然用于认证流程（登录、登出、刷新令牌）。Zustand 只管理状态，不处理业务逻辑。

### Q: 如何处理异步操作？
A: 在 AuthContext 中处理异步操作，然后更新 Zustand store。

### Q: 状态会自动同步吗？
A: 不会。需要在 AuthContext 中显式调用 store 的更新方法。

### Q: 如何调试状态？
A: 使用 Redux DevTools 浏览器扩展（需要配置）或直接在控制台访问 store。

## 示例：完整的迁移

### Before (AuthContext)
```typescript
function Dashboard() {
  const { user, isLoading, updateProfile } = useAuth();
  
  return (
    <div>
      <h1>{user?.username}</h1>
      <button onClick={() => updateProfile({ bio: 'New bio' })}>
        Update
      </button>
    </div>
  );
}
```

### After (Zustand)
```typescript
function Dashboard() {
  const { user, updateUser } = useUserStore();
  const { isLoading } = useAuthStore();
  
  return (
    <div>
      <h1>{user?.username}</h1>
      <button onClick={() => updateUser({ bio: 'New bio' })}>
        Update
      </button>
    </div>
  );
}
```

## 性能优化

Zustand 提供更好的性能，因为：

1. **选择性订阅** - 组件只订阅需要的状态
2. **自动去重** - 相同的状态不会触发重新渲染
3. **中间件支持** - 可以添加自定义优化

## 下一步

1. 逐步迁移所有组件
2. 测试所有功能
3. 监控性能改进
4. 收集用户反馈
5. 考虑添加更多 store（如 UIStore）

---

**迁移状态：** 🟡 进行中  
**预计完成：** 3 天  
**优先级：** P2-1
