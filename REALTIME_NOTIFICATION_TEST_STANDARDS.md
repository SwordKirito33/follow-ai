# 实时通知测试标准（P1-9）

**制定日期：** 2024-01-05  
**技术栈：** WebSocket + Supabase Realtime  
**测试框架：** Playwright + WebSocket Mock

---

## 📋 测试标准

### 1. 功能测试标准

#### A. 通知类型覆盖

| 通知类型 | 触发条件 | 优先级 | 测试项 |
|---------|---------|--------|--------|
| **任务相关** | 任务创建、更新、完成 | P0 | 5 |
| **审核相关** | 审核通过、拒绝、评论 | P0 | 5 |
| **XP 相关** | XP 奖励、等级提升 | P0 | 4 |
| **支付相关** | 支付成功、提现批准 | P0 | 4 |
| **系统通知** | 维护、更新、公告 | P1 | 3 |
| **社交相关** | 关注、评论、点赞 | P1 | 3 |

#### B. 通知传递标准

| 指标 | 目标 | 验证方法 |
|------|------|---------|
| **延迟** | < 1 秒 | 测量发送到接收时间 |
| **可靠性** | 100% | 验证所有通知都被接收 |
| **顺序** | 按时间顺序 | 验证通知顺序正确 |
| **去重** | 无重复 | 验证相同通知不重复 |

#### C. 通知状态管理

| 状态 | 转换 | 验证项 |
|------|------|--------|
| **未读** | 创建时 | 显示未读标记 |
| **已读** | 用户点击 | 标记为已读 |
| **已删除** | 用户删除 | 从列表移除 |
| **已存档** | 用户存档 | 移到存档列表 |

### 2. 性能测试标准

#### 延迟指标

```
目标延迟分布:
- P50: < 200ms (50% 的通知)
- P95: < 500ms (95% 的通知)
- P99: < 1000ms (99% 的通知)
```

#### 吞吐量指标

```
目标吞吐量:
- 单用户: 100 条/分钟
- 多用户: 10,000 条/分钟
- 峰值: 50,000 条/分钟
```

#### 资源占用

| 资源 | 目标 |
|------|------|
| **内存** | < 50MB / 1000 连接 |
| **CPU** | < 20% / 1000 连接 |
| **网络** | < 100KB/s / 1000 连接 |

### 3. 可靠性测试标准

#### 连接管理

| 场景 | 预期行为 | 验证项 |
|------|---------|--------|
| **连接建立** | 成功连接 | 收到 connected 事件 |
| **连接断开** | 自动重连 | 3 秒内重连 |
| **连接失败** | 指数退避重试 | 最多重试 5 次 |
| **连接恢复** | 同步未送达通知 | 恢复后接收所有通知 |

#### 错误处理

| 错误类型 | 处理方式 | 验证项 |
|---------|---------|--------|
| **网络错误** | 自动重试 | 最终成功或显示错误 |
| **服务器错误** | 指数退避 | 5xx 错误重试 |
| **超时** | 重新连接 | 30 秒超时后重连 |
| **无效消息** | 记录并忽略 | 不影响其他通知 |

### 4. 用户体验测试标准

#### UI/UX 标准

| 元素 | 标准 | 验证项 |
|------|------|--------|
| **通知显示** | 即时显示 | 收到后 < 100ms 显示 |
| **通知声音** | 可选 | 用户可启用/禁用 |
| **通知图标** | 清晰 | 易于识别通知类型 |
| **通知操作** | 快速 | 点击后 < 500ms 响应 |

#### 可访问性标准

- ✅ 屏幕阅读器支持
- ✅ 键盘导航支持
- ✅ 高对比度支持
- ✅ 动画可禁用

---

## 🎯 测试条件

### 1. 前置条件

#### 环境准备

```typescript
// 测试前准备
beforeEach(async ({ page }) => {
  // 1. 启动 WebSocket 服务器
  await startWebSocketServer();
  
  // 2. 创建测试用户
  const user = await createTestUser({
    email: 'test@example.com',
    password: 'Test123!@#'
  });
  
  // 3. 登录用户
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button:has-text("Login")');
  
  // 4. 等待 WebSocket 连接
  await page.waitForEvent('websocket');
  
  // 5. 初始化通知系统
  await page.evaluate(() => {
    window.notificationTestHelper = {
      receivedNotifications: [],
      onNotification: (notification) => {
        window.notificationTestHelper.receivedNotifications.push({
          ...notification,
          receivedAt: Date.now()
        });
      }
    };
  });
});
```

#### 测试数据

```typescript
const testNotifications = {
  taskCreated: {
    type: 'task_created',
    title: 'New Task Created',
    message: 'A new task has been created',
    data: {
      taskId: 'task-123',
      taskTitle: 'Test Task',
      reward: 100
    }
  },
  reviewApproved: {
    type: 'review_approved',
    title: 'Review Approved',
    message: 'Your submission has been approved',
    data: {
      submissionId: 'sub-123',
      xpReward: 50
    }
  },
  xpEarned: {
    type: 'xp_earned',
    title: 'XP Earned',
    message: 'You earned 50 XP',
    data: {
      xp: 50,
      source: 'task_completion'
    }
  }
};
```

### 2. 执行条件

#### WebSocket 模拟

```typescript
// 模拟 WebSocket 连接
test('should receive notification in real-time', async ({ page }) => {
  // 1. 监听 WebSocket 消息
  let wsMessage;
  page.on('websocket', ws => {
    ws.on('framesent', event => {
      wsMessage = event.payload;
    });
    ws.on('framereceived', event => {
      // 处理接收到的消息
      const notification = JSON.parse(event.payload);
      page.evaluate((notif) => {
        window.notificationTestHelper.onNotification(notif);
      }, notification);
    });
  });
  
  // 2. 触发通知
  await triggerNotification(testNotifications.taskCreated);
  
  // 3. 验证接收
  await page.waitForTimeout(500); // 等待通知传递
  const received = await page.evaluate(() => 
    window.notificationTestHelper.receivedNotifications
  );
  expect(received).toHaveLength(1);
});
```

#### 网络条件模拟

```typescript
// 模拟不同网络条件
test('should handle slow network', async ({ page }) => {
  // 模拟 3G 网络
  await page.route('**/*', (route) => {
    setTimeout(() => route.continue(), 500); // 500ms 延迟
  });
  
  // 测试通知传递
  await triggerNotification(testNotifications.taskCreated);
  
  // 验证最终仍然收到
  const received = await page.evaluate(() => 
    window.notificationTestHelper.receivedNotifications
  );
  expect(received).toHaveLength(1);
});
```

### 3. 验证条件

#### 功能验证

```typescript
// 验证通知内容
expect(notification).toEqual({
  id: expect.any(String),
  type: 'task_created',
  title: 'New Task Created',
  message: 'A new task has been created',
  data: expect.objectContaining({
    taskId: 'task-123'
  }),
  createdAt: expect.any(Number),
  read: false
});

// 验证通知顺序
const notifications = await page.evaluate(() => 
  window.notificationTestHelper.receivedNotifications
);
for (let i = 1; i < notifications.length; i++) {
  expect(notifications[i].createdAt).toBeGreaterThanOrEqual(
    notifications[i-1].createdAt
  );
}
```

#### 性能验证

```typescript
// 验证延迟
const latency = notification.receivedAt - notification.sentAt;
expect(latency).toBeLessThan(1000); // < 1 秒

// 验证吞吐量
const startTime = Date.now();
for (let i = 0; i < 100; i++) {
  await triggerNotification(testNotifications.taskCreated);
}
const endTime = Date.now();
const throughput = (100 / (endTime - startTime)) * 1000; // 条/秒
expect(throughput).toBeGreaterThan(10); // > 10 条/秒
```

### 4. 清理条件

```typescript
// 测试后清理
afterEach(async ({ page }) => {
  // 1. 断开 WebSocket 连接
  await page.evaluate(() => {
    if (window.notificationSocket) {
      window.notificationSocket.close();
    }
  });
  
  // 2. 清除测试数据
  await cleanupTestNotifications();
  
  // 3. 清除用户数据
  await deleteTestUser();
  
  // 4. 关闭 WebSocket 服务器
  await stopWebSocketServer();
});
```

---

## 📊 测试矩阵

### 通知类型 × 用户状态 × 网络条件

```
通知类型: 6 种
用户状态: 在线, 离线, 弱网 (3)
网络条件: 快速, 正常, 慢速 (3)

总组合数: 6 × 3 × 3 = 54 种
```

### 优先级测试矩阵

| 优先级 | 通知类型 | 用户状态 | 网络条件 | 频率 |
|--------|---------|---------|---------|------|
| P0 | 任务、审核、XP、支付 | 在线 | 快速、正常 | 每次提交 |
| P1 | 系统、社交 | 在线、离线 | 所有 | 每天 |
| P2 | 所有 | 所有 | 所有 | 每周 |

---

## 🔍 测试用例标准

### 用例结构

```typescript
test('should [action] when [condition] and [precondition]', async ({ page }) => {
  // 1. Setup - 准备测试环境
  await setupNotificationTest();
  
  // 2. Action - 触发通知
  await triggerNotification(testNotifications.taskCreated);
  
  // 3. Assert - 验证结果
  const received = await page.evaluate(() => 
    window.notificationTestHelper.receivedNotifications
  );
  expect(received).toHaveLength(1);
  expect(received[0].type).toBe('task_created');
  
  // 4. Cleanup - 清理资源
  await cleanupNotificationTest();
});
```

### 用例分类

#### 基础功能测试
- 通知创建
- 通知接收
- 通知显示
- 通知标记已读
- 通知删除

#### 连接管理测试
- 连接建立
- 连接断开和重连
- 连接恢复
- 多连接管理

#### 错误处理测试
- 网络错误
- 服务器错误
- 超时处理
- 无效消息

#### 性能测试
- 单条通知延迟
- 批量通知吞吐量
- 内存占用
- CPU 占用

#### 用户体验测试
- 通知显示
- 通知声音
- 通知操作
- 通知清除

---

## ✅ 测试检查清单

### 测试编写前
- [ ] 理解通知系统架构
- [ ] 确定通知类型和优先级
- [ ] 准备测试数据
- [ ] 设计 WebSocket 模拟
- [ ] 计划测试用例

### 测试编写中
- [ ] 遵循命名规范
- [ ] 添加清晰的注释
- [ ] 使用显式等待
- [ ] 避免硬等待
- [ ] 记录性能指标

### 测试执行前
- [ ] WebSocket 服务器正常
- [ ] 测试数据正确准备
- [ ] 网络条件模拟正确
- [ ] 依赖项已安装

### 测试执行中
- [ ] 监控连接状态
- [ ] 记录延迟指标
- [ ] 收集错误日志
- [ ] 性能监控

### 测试执行后
- [ ] 分析测试结果
- [ ] 生成性能报告
- [ ] 修复失败的测试
- [ ] 优化通知系统

---

## 📈 测试指标

### 功能指标
- **通知接收率：** 100%
- **通知正确率：** 100%
- **通知顺序正确率：** 100%
- **去重率：** 100%

### 性能指标
- **平均延迟：** < 200ms
- **P95 延迟：** < 500ms
- **P99 延迟：** < 1000ms
- **吞吐量：** > 10 条/秒

### 可靠性指标
- **连接成功率：** 99.9%
- **重连成功率：** 99%
- **消息丢失率：** 0%
- **错误恢复率：** 100%

---

## 🚀 测试执行计划

### Day 1: 基础测试
- [ ] 通知创建和接收
- [ ] 通知显示
- [ ] 通知标记已读

### Day 2: 连接管理
- [ ] 连接建立
- [ ] 连接断开和重连
- [ ] 连接恢复

### Day 3: 错误处理
- [ ] 网络错误
- [ ] 服务器错误
- [ ] 超时处理

### Day 4: 性能测试
- [ ] 延迟测试
- [ ] 吞吐量测试
- [ ] 资源占用测试

### Day 5: 集成测试
- [ ] 多用户通知
- [ ] 通知去重
- [ ] 通知排序

---

## 总结

**测试标准：**
- ✅ 100% 通知接收率
- ✅ < 200ms 平均延迟
- ✅ 100% 正确性
- ✅ 99.9% 可靠性

**测试条件：**
- ✅ 完整的 WebSocket 模拟
- ✅ 多网络条件覆盖
- ✅ 完整的 setup/teardown
- ✅ 性能指标收集

**下一步：** 实现实时通知测试框架
