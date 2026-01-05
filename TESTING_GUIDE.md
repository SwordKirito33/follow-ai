# 测试执行指南

**创建日期：** 2024-01-05  
**测试框架：** Playwright  
**覆盖率目标：** 80%+

---

## 📋 快速开始

### 1. 安装依赖

```bash
npm install -D @playwright/test dotenv
```

### 2. 配置环境

```bash
# 复制测试环境配置
cp .env.test .env.local
```

### 3. 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm run test:auth
npm run test:dashboard

# 以 UI 模式运行
npm run test:ui

# 以调试模式运行
npm run test:debug

# 以有头模式运行（显示浏览器）
npm run test:headed

# 在特定浏览器上运行
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### 4. 查看报告

```bash
npm run test:report
```

---

## 📁 项目结构

```
tests/
├── e2e/                    # E2E 测试用例
│   ├── auth.spec.ts       # 认证测试（12 个用例）
│   ├── dashboard.spec.ts  # 仪表板测试（18 个用例）
│   └── ...
├── pages/                  # Page Object Models
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── ...
├── utils/                  # 测试工具函数
│   └── testHelpers.ts
└── screenshots/            # 失败时的截图

playwright.config.ts        # Playwright 配置
.env.test                  # 测试环境变量
```

---

## 🎯 测试用例

### 已实现的测试

#### 认证测试 (tests/e2e/auth.spec.ts)
- ✅ 导航到登录页面
- ✅ 使用有效凭证成功登录
- ✅ 使用无效邮箱显示错误
- ✅ 使用错误密码显示错误
- ✅ 使用空凭证显示错误
- ✅ 空字段时禁用登录按钮
- ✅ 成功登出
- ✅ 未认证时重定向到登录
- ✅ 持久化登录会话
- ✅ 登出时清除会话
- ✅ 登录后显示用户名
- ✅ 优雅处理登录超时

**运行方式：**
```bash
npm run test:auth
```

#### 仪表板测试 (tests/e2e/dashboard.spec.ts)
- ✅ 成功加载仪表板
- ✅ 显示用户信息
- ✅ 显示用户统计
- ✅ 显示活跃任务计数
- ✅ 显示已完成任务计数
- ✅ 导航到创建任务页面
- ✅ 导航到任务页面
- ✅ 导航到排行榜页面
- ✅ 打开用户菜单
- ✅ 导航到设置
- ✅ 显示通知徽章
- ✅ 打开通知面板
- ✅ 显示最近活动
- ✅ 刷新仪表板
- ✅ 优雅处理网络错误
- ✅ 在可接受时间内加载仪表板
- ✅ 导航时维持仪表板状态
- ✅ 显示用户头像
- ✅ 显示欢迎信息

**运行方式：**
```bash
npm run test:dashboard
```

---

## 🔧 Page Object Models

### LoginPage

```typescript
import { LoginPage } from '../pages/LoginPage';

const loginPage = new LoginPage(page);

// 导航到登录页面
await loginPage.goto();

// 登录
await loginPage.login(email, password);

// 检查登录状态
const isLoggedIn = await loginPage.isLoggedIn();

// 获取错误信息
const error = await loginPage.getErrorMessage();
```

### DashboardPage

```typescript
import { DashboardPage } from '../pages/DashboardPage';

const dashboardPage = new DashboardPage(page);

// 导航到仪表板
await dashboardPage.goto();

// 获取用户信息
const xp = await dashboardPage.getUserXP();
const level = await dashboardPage.getUserLevel();
const balance = await dashboardPage.getUserBalance();

// 导航操作
await dashboardPage.clickCreateTaskButton();
await dashboardPage.clickViewAllTasks();
await dashboardPage.logout();
```

---

## 🛠️ 测试工具函数

### 常用函数

```typescript
import { 
  TEST_USERS, 
  TEST_DATA,
  loginAsUser,
  logout,
  createTaskViaUI,
  waitForToast,
  clearStorage
} from '../utils/testHelpers';

// 使用测试用户
const user = TEST_USERS.user;

// 登录
await loginAsUser(page);

// 创建任务
await createTaskViaUI(page, TEST_DATA.tasks.simple);

// 等待通知
await waitForToast(page, 'Task created successfully');

// 清除存储
await clearStorage(page);
```

---

## 📊 覆盖率报告

### 生成覆盖率报告

```bash
# 运行测试并生成覆盖率
npm test -- --reporter=coverage

# 查看 HTML 报告
open coverage/index.html
```

### 覆盖率目标

| 类型 | 目标 | 当前 |
|------|------|------|
| 语句覆盖率 | 80%+ | ⏳ |
| 分支覆盖率 | 75%+ | ⏳ |
| 函数覆盖率 | 85%+ | ⏳ |
| 行覆盖率 | 80%+ | ⏳ |

---

## 🐛 调试测试

### 调试模式

```bash
# 启用调试模式
npm run test:debug

# 这将打开 Playwright Inspector
# 可以逐步执行测试并检查状态
```

### 有头模式

```bash
# 以有头模式运行（显示浏览器）
npm run test:headed

# 可以看到浏览器的实际操作
```

### 查看失败截图

```bash
# 失败的测试会自动截图
# 位置：tests/screenshots/

# 查看报告中的截图
npm run test:report
```

---

## 🔍 常见问题

### Q: 测试超时怎么办？

**A:** 增加超时时间
```typescript
test('should load slowly', async ({ page }) => {
  // 为单个测试增加超时
  test.setTimeout(60000); // 60 秒
  
  // 操作...
}, { timeout: 60000 });
```

### Q: 如何跳过某个测试？

**A:** 使用 `test.skip()`
```typescript
test.skip('should be skipped', async ({ page }) => {
  // 这个测试会被跳过
});
```

### Q: 如何只运行某个测试？

**A:** 使用 `test.only()`
```typescript
test.only('should run only this', async ({ page }) => {
  // 只有这个测试会运行
});
```

### Q: 如何处理随机失败的测试？

**A:** 使用重试
```typescript
test('flaky test', async ({ page }) => {
  // 这个测试会自动重试
}, { retries: 2 });
```

---

## 📈 性能优化

### 并行执行

```bash
# 使用 4 个工作进程并行执行
npm test -- --workers=4
```

### 只运行修改的文件

```bash
# 只运行修改过的测试
npm test -- --changed
```

### 按标签运行

```bash
# 运行标记为 @smoke 的测试
npm test -- --grep @smoke
```

---

## 🚀 CI/CD 集成

### GitHub Actions 示例

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📝 编写新测试

### 测试模板

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_USERS } from '../utils/testHelpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // 前置条件
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERS.user.email, TEST_USERS.user.password);
  });

  test('should do something', async ({ page }) => {
    // 执行操作
    await page.click('button');
    
    // 验证结果
    expect(await page.isVisible('text=Success')).toBeTruthy();
  });

  test.afterEach(async ({ page }) => {
    // 清理资源
    await page.close();
  });
});
```

---

## 📚 资源

- [Playwright 官方文档](https://playwright.dev)
- [Playwright API 参考](https://playwright.dev/docs/api/class-page)
- [最佳实践](https://playwright.dev/docs/best-practices)

---

## ✅ 检查清单

在运行测试前，请确保：

- [ ] 安装了所有依赖 (`npm install`)
- [ ] 配置了环境变量 (`.env.local`)
- [ ] 开发服务器已启动 (`npm run dev`)
- [ ] 没有其他应用占用端口 5173
- [ ] 浏览器已更新到最新版本

---

## 📞 支持

如有问题，请：

1. 查看 [Playwright 文档](https://playwright.dev)
2. 检查 [已知问题](./KNOWN_ISSUES.md)
3. 提交 GitHub Issue

---

**最后更新：** 2024-01-05  
**维护者：** Follow-AI 团队
