# Phase 2: 综合测试计划

**制定日期：** 2024-01-05  
**总耗时：** 24 小时（3 天）  
**测试框架：** Playwright + WebSocket Mock + API 测试

---

## 📊 测试概览

### 三大测试支柱

| 支柱 | 任务 | 时间 | 覆盖率 | 状态 |
|------|------|------|--------|------|
| **P2-13** | E2E 测试 | 8h | 80%+ | ⏳ |
| **P1-9** | 实时通知 | 8h | 100% | ⏳ |
| **P1-7** | 数据一致性 | 8h | 100% | ⏳ |

### 测试标准对比

| 指标 | E2E | 通知 | 一致性 |
|------|-----|------|--------|
| **覆盖率** | 80%+ | 100% | 100% |
| **延迟** | < 30s/测试 | < 1s | < 1s |
| **可靠性** | 95%+ | 99.9% | 100% |
| **用例数** | 150+ | 54+ | 36+ |

---

## 🎯 详细测试计划

### Day 1: E2E 测试框架搭建（8 小时）

#### 上午（4 小时）：框架搭建

**1. 安装和配置（1 小时）**
```bash
# 安装 Playwright
npm install -D @playwright/test

# 安装依赖
npm install -D @playwright/test dotenv

# 创建配置
touch playwright.config.ts
```

**2. 配置文件编写（1 小时）**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**3. Page Object Model 设计（1 小时）**
```typescript
// tests/pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/login');
  }
  
  async login(email: string, password: string) {
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button:has-text("Login")');
  }
  
  async isLoggedIn() {
    return await this.page.isVisible('text=Dashboard');
  }
}
```

**4. 测试工具函数（1 小时）**
```typescript
// tests/utils/testHelpers.ts
export async function createTestUser(email: string, password: string) {
  // 通过 API 创建用户
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

export async function resetTestDatabase() {
  // 重置数据库
  await fetch('http://localhost:3000/api/test/reset', {
    method: 'POST'
  });
}
```

#### 下午（4 小时）：关键流程测试编写

**5. 认证流程测试（2 小时）**
```typescript
// tests/e2e/auth.spec.ts
test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // 准备
    const user = await createTestUser('test@example.com', 'Test123!@#');
    
    // 执行
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    
    // 验证
    expect(await loginPage.isLoggedIn()).toBeTruthy();
  });
  
  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test@example.com', 'wrongpassword');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
```

**6. 任务管理测试（2 小时）**
```typescript
// tests/e2e/tasks.spec.ts
test.describe('Task Management', () => {
  test('should create a new task', async ({ page }) => {
    // 登录
    await loginAsUser(page);
    
    // 创建任务
    await page.goto('/tasks/create');
    await page.fill('input[name="title"]', 'Test Task');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.fill('input[name="reward"]', '100');
    await page.click('button:has-text("Create")');
    
    // 验证
    await expect(page.locator('text=Task created successfully')).toBeVisible();
  });
});
```

### Day 2: 实时通知测试（8 小时）

#### 上午（4 小时）：WebSocket 测试框架

**1. WebSocket 服务器模拟（1 小时）**
```typescript
// tests/utils/websocketMock.ts
export class WebSocketMock {
  private ws: WebSocket;
  private messages: any[] = [];
  
  async connect(url: string) {
    this.ws = new WebSocket(url);
    
    this.ws.addEventListener('message', (event) => {
      this.messages.push(JSON.parse(event.data));
    });
  }
  
  async getMessages(timeout = 1000) {
    await new Promise(resolve => setTimeout(resolve, timeout));
    return this.messages;
  }
  
  async sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }
}
```

**2. 通知测试工具（1 小时）**
```typescript
// tests/utils/notificationHelpers.ts
export async function triggerNotification(type: string, data: any) {
  await fetch('http://localhost:3000/api/test/notification', {
    method: 'POST',
    body: JSON.stringify({ type, data })
  });
}

export async function waitForNotification(page: Page, type: string, timeout = 5000) {
  return page.waitForEvent('websocket', async (ws) => {
    const message = await ws.waitForEvent('framereceived');
    return JSON.parse(message.payload).type === type;
  }, { timeout });
}
```

**3. 通知接收测试（2 小时）**
```typescript
// tests/e2e/notifications.spec.ts
test.describe('Real-time Notifications', () => {
  test('should receive task created notification', async ({ page }) => {
    // 登录
    await loginAsUser(page);
    
    // 初始化通知监听
    const notifications: any[] = [];
    page.on('websocket', (ws) => {
      ws.on('framereceived', (event) => {
        notifications.push(JSON.parse(event.payload));
      });
    });
    
    // 触发通知
    await triggerNotification('task_created', {
      taskId: 'task-123',
      title: 'New Task'
    });
    
    // 验证接收
    await page.waitForTimeout(500);
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('task_created');
  });
});
```

#### 下午（4 小时）：高级通知测试

**4. 连接管理测试（2 小时）**
```typescript
// tests/e2e/notification-connection.spec.ts
test('should reconnect on connection loss', async ({ page }) => {
  // 登录
  await loginAsUser(page);
  
  // 断开连接
  await page.evaluate(() => {
    (window as any).notificationSocket?.close();
  });
  
  // 等待重连
  await page.waitForTimeout(3000);
  
  // 验证重新连接
  const isConnected = await page.evaluate(() => {
    return (window as any).notificationSocket?.readyState === WebSocket.OPEN;
  });
  
  expect(isConnected).toBeTruthy();
});
```

**5. 性能和可靠性测试（2 小时）**
```typescript
// tests/e2e/notification-performance.spec.ts
test('should handle high throughput', async ({ page }) => {
  await loginAsUser(page);
  
  const startTime = Date.now();
  const notifications: any[] = [];
  
  // 发送 100 条通知
  for (let i = 0; i < 100; i++) {
    await triggerNotification('test', { id: i });
  }
  
  // 等待接收
  await page.waitForTimeout(2000);
  
  const endTime = Date.now();
  const throughput = (100 / (endTime - startTime)) * 1000;
  
  expect(throughput).toBeGreaterThan(10); // > 10 条/秒
});
```

### Day 3: 数据一致性测试（8 小时）

#### 上午（4 小时）：基础一致性测试

**1. 单操作一致性（2 小时）**
```typescript
// tests/e2e/consistency.spec.ts
test.describe('Data Consistency', () => {
  test('should maintain consistency for create operation', async ({ page, browser }) => {
    // 用户1 创建任务
    const user1Page = await browser.newPage();
    await loginAsUser(user1Page);
    
    const task = await createTaskOnPage(user1Page, {
      title: 'Test Task',
      reward: 100
    });
    
    // 用户2 查看任务
    const user2Page = await browser.newPage();
    await loginAsUser(user2Page);
    
    await user2Page.goto(`/tasks/${task.id}`);
    const taskData = await user2Page.evaluate(() => 
      (window as any).__INITIAL_STATE__.task
    );
    
    // 验证一致
    expect(taskData.id).toBe(task.id);
    expect(taskData.title).toBe(task.title);
    expect(taskData.reward).toBe(100);
  });
});
```

**2. 并发操作一致性（2 小时）**
```typescript
// tests/e2e/consistency-concurrent.spec.ts
test('should handle concurrent updates', async ({ page, browser }) => {
  // 创建初始任务
  const task = await createTask({
    title: 'Test Task',
    status: 'open'
  });
  
  // 并发更新
  const updates = [
    updateTaskStatus(task.id, 'in_progress'),
    updateTaskStatus(task.id, 'completed'),
    updateTaskStatus(task.id, 'approved')
  ];
  
  const results = await Promise.all(updates);
  
  // 验证最终状态
  const finalTask = await getTaskFromServer(task.id);
  expect(['in_progress', 'completed', 'approved']).toContain(finalTask.status);
});
```

#### 下午（4 小时）：高级一致性测试

**3. 网络中断恢复（2 小时）**
```typescript
// tests/e2e/consistency-recovery.spec.ts
test('should recover from network interruption', async ({ page }) => {
  // 创建任务
  const task = await createTask({ title: 'Test Task' });
  
  // 模拟网络中断
  await page.context().setOffline(true);
  
  // 尝试更新
  const updatePromise = updateTaskOnPage(page, task.id, { 
    status: 'completed' 
  });
  
  // 恢复网络
  await page.waitForTimeout(1000);
  await page.context().setOffline(false);
  
  // 等待同步
  await page.waitForTimeout(2000);
  
  // 验证一致
  const finalTask = await getTaskFromServer(task.id);
  expect(finalTask).toBeDefined();
});
```

**4. 冲突解决（2 小时）**
```typescript
// tests/e2e/consistency-conflict.spec.ts
test('should resolve conflicts correctly', async ({ browser }) => {
  // 创建任务
  const task = await createTask({ title: 'Test', version: 1 });
  
  // 两个用户并发修改
  const page1 = await browser.newPage();
  const page2 = await browser.newPage();
  
  // 用户1 修改
  await updateTaskOnPage(page1, task.id, { 
    title: 'Updated by User1',
    version: 1
  });
  
  // 用户2 修改（版本冲突）
  const result = await updateTaskOnPage(page2, task.id, { 
    title: 'Updated by User2',
    version: 1
  });
  
  // 验证冲突解决
  expect(result.conflict).toBeDefined();
  expect(result.resolvedVersion).toBeGreaterThan(1);
});
```

---

## 📋 测试执行检查清单

### 测试前准备
- [ ] 安装所有依赖
- [ ] 配置 Playwright
- [ ] 创建 Page Objects
- [ ] 准备测试数据
- [ ] 启动测试服务器

### 测试执行
- [ ] 运行 E2E 测试
- [ ] 运行通知测试
- [ ] 运行一致性测试
- [ ] 监控测试进度
- [ ] 记录失败原因

### 测试后分析
- [ ] 生成覆盖率报告
- [ ] 分析失败用例
- [ ] 性能分析
- [ ] 修复失败的测试
- [ ] 优化测试性能

---

## 📊 测试指标目标

### 覆盖率指标
| 指标 | 目标 | E2E | 通知 | 一致性 |
|------|------|-----|------|--------|
| 功能覆盖 | 80%+ | ✅ | ✅ | ✅ |
| 分支覆盖 | 75%+ | ✅ | ✅ | ✅ |
| 用例数 | 240+ | 150 | 54 | 36 |

### 质量指标
| 指标 | 目标 | 状态 |
|------|------|------|
| 通过率 | 95%+ | ⏳ |
| 缺陷检出 | 90%+ | ⏳ |
| 执行时间 | < 10min | ⏳ |

### 性能指标
| 指标 | 目标 | 状态 |
|------|------|------|
| 单测试时间 | < 30s | ⏳ |
| 通知延迟 | < 1s | ⏳ |
| 同步延迟 | < 1s | ⏳ |

---

## 🚀 执行时间表

### Day 1: E2E 测试
| 时段 | 任务 | 时间 |
|------|------|------|
| 上午 | 框架搭建 | 4h |
| 下午 | 关键流程测试 | 4h |
| **总计** | **8h** | |

### Day 2: 实时通知测试
| 时段 | 任务 | 时间 |
|------|------|------|
| 上午 | WebSocket 框架 | 4h |
| 下午 | 高级通知测试 | 4h |
| **总计** | **8h** | |

### Day 3: 数据一致性测试
| 时段 | 任务 | 时间 |
|------|------|------|
| 上午 | 基础一致性 | 4h |
| 下午 | 高级一致性 | 4h |
| **总计** | **8h** | |

---

## ✨ 总结

**Phase 2 测试计划：**
- ✅ 3 个主要测试支柱
- ✅ 240+ 个测试用例
- ✅ 完整的测试框架
- ✅ 详细的执行计划

**预期成果：**
- ✅ 80%+ 代码覆盖率
- ✅ 95%+ 测试通过率
- ✅ 完整的测试文档
- ✅ 自动化测试框架

**下一步：** 按照计划执行测试
