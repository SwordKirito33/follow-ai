# 数据一致性测试标准（P1-7）

**制定日期：** 2024-01-05  
**范围：** 客户端 ↔ 服务器 ↔ 数据库  
**测试框架：** Playwright + API 测试

---

## 📋 测试标准

### 1. 数据一致性定义

#### A. 一致性类型

| 类型 | 定义 | 验证方法 |
|------|------|---------|
| **强一致性** | 写入后立即可读 | 写入后立即查询 |
| **最终一致性** | 写入后最终一致 | 写入后延迟查询 |
| **因果一致性** | 因果关系保持 | 验证操作顺序 |
| **会话一致性** | 单会话内一致 | 验证会话内操作 |

#### B. 一致性范围

| 范围 | 验证项 | 优先级 |
|------|--------|--------|
| **用户数据** | 个人资料、偏好、设置 | P0 |
| **任务数据** | 任务信息、状态、进度 | P0 |
| **XP 数据** | XP 值、历史、排名 | P0 |
| **支付数据** | 交易、余额、历史 | P0 |
| **审核数据** | 审核状态、评论、决定 | P1 |
| **通知数据** | 通知状态、已读标记 | P1 |

### 2. 验证标准

#### 数据完整性

```
标准：
- ✅ 所有字段都存在
- ✅ 字段值正确
- ✅ 没有数据丢失
- ✅ 没有数据重复
```

#### 数据准确性

```
标准：
- ✅ 数值计算正确
- ✅ 日期时间准确
- ✅ 状态转换正确
- ✅ 关系引用正确
```

#### 数据有效性

```
标准：
- ✅ 符合数据类型
- ✅ 符合业务规则
- ✅ 符合约束条件
- ✅ 符合范围限制
```

### 3. 同步标准

#### 同步延迟

| 操作 | 目标延迟 | 验证方法 |
|------|---------|---------|
| **创建** | < 1s | 创建后查询 |
| **更新** | < 1s | 更新后查询 |
| **删除** | < 1s | 删除后查询 |
| **批量** | < 5s | 批量操作后查询 |

#### 同步可靠性

| 指标 | 目标 | 验证方法 |
|------|------|---------|
| **成功率** | 100% | 验证所有操作成功 |
| **重复率** | 0% | 验证没有重复数据 |
| **丢失率** | 0% | 验证没有丢失数据 |
| **冲突率** | 0% | 验证没有数据冲突 |

### 4. 冲突解决标准

#### 冲突检测

| 冲突类型 | 检测方式 | 解决策略 |
|---------|---------|---------|
| **并发更新** | 版本号 | Last-Write-Wins |
| **删除冲突** | 软删除标记 | 保留历史 |
| **重复创建** | 唯一约束 | 返回已存在 |
| **状态冲突** | 状态机验证 | 拒绝非法转换 |

#### 冲突恢复

```
恢复流程：
1. 检测冲突
2. 记录冲突日志
3. 选择解决策略
4. 应用解决方案
5. 验证一致性
```

---

## 🎯 测试条件

### 1. 前置条件

#### 环境准备

```typescript
// 测试前准备
beforeEach(async ({ page }) => {
  // 1. 清除所有缓存
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // 2. 重置数据库
  await resetTestDatabase();
  
  // 3. 创建测试用户
  const user = await createTestUser({
    email: 'test@example.com',
    password: 'Test123!@#'
  });
  
  // 4. 登录用户
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button:has-text("Login")');
  
  // 5. 等待数据加载
  await page.waitForLoadState('networkidle');
});
```

#### 测试数据

```typescript
const testData = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    totalXp: 1000,
    balance: 5000
  },
  task: {
    id: 'task-123',
    title: 'Test Task',
    description: 'A test task',
    reward: 100,
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  submission: {
    id: 'sub-123',
    taskId: 'task-123',
    userId: 'user-123',
    status: 'pending',
    submittedAt: new Date()
  }
};
```

### 2. 执行条件

#### 单用户一致性测试

```typescript
test('should maintain data consistency for single user', async ({ page }) => {
  // 1. 创建数据
  const task = await createTask(testData.task);
  
  // 2. 在客户端验证
  await page.goto(`/tasks/${task.id}`);
  const clientData = await page.evaluate(() => 
    window.__INITIAL_STATE__.task
  );
  
  // 3. 在服务器验证
  const serverData = await getTaskFromServer(task.id);
  
  // 4. 在数据库验证
  const dbData = await getTaskFromDatabase(task.id);
  
  // 5. 验证一致性
  expect(clientData).toEqual(serverData);
  expect(serverData).toEqual(dbData);
});
```

#### 多用户一致性测试

```typescript
test('should maintain data consistency for multiple users', async ({ browser }) => {
  // 1. 创建两个用户上下文
  const user1Context = await browser.newContext();
  const user2Context = await browser.newContext();
  
  const user1Page = await user1Context.newPage();
  const user2Page = await user2Context.newPage();
  
  // 2. 用户1 创建任务
  await user1Page.goto('http://localhost:5173/tasks/create');
  const task = await createTaskOnPage(user1Page, testData.task);
  
  // 3. 用户2 查看任务
  await user2Page.goto(`http://localhost:5173/tasks/${task.id}`);
  const user2ViewData = await user2Page.evaluate(() => 
    window.__INITIAL_STATE__.task
  );
  
  // 4. 验证一致性
  expect(user2ViewData.id).toBe(task.id);
  expect(user2ViewData.title).toBe(task.title);
  
  // 5. 清理
  await user1Context.close();
  await user2Context.close();
});
```

#### 并发操作一致性测试

```typescript
test('should handle concurrent updates correctly', async ({ page }) => {
  // 1. 创建初始数据
  const task = await createTask({ ...testData.task, status: 'open' });
  
  // 2. 并发更新
  const updates = [
    updateTaskStatus(task.id, 'in_progress'),
    updateTaskStatus(task.id, 'completed'),
    updateTaskStatus(task.id, 'approved')
  ];
  
  const results = await Promise.all(updates);
  
  // 3. 验证最终状态
  const finalTask = await getTaskFromServer(task.id);
  
  // 4. 验证状态转换正确
  expect(['in_progress', 'completed', 'approved']).toContain(finalTask.status);
});
```

#### 网络中断恢复测试

```typescript
test('should recover from network interruption', async ({ page }) => {
  // 1. 创建数据
  const task = await createTask(testData.task);
  
  // 2. 模拟网络中断
  await page.context().setOffline(true);
  
  // 3. 尝试更新（应该失败）
  const updatePromise = updateTaskOnPage(page, task.id, { status: 'completed' });
  
  // 4. 恢复网络
  await page.waitForTimeout(1000);
  await page.context().setOffline(false);
  
  // 5. 验证最终一致
  const finalTask = await getTaskFromServer(task.id);
  expect(finalTask).toBeDefined();
});
```

### 3. 验证条件

#### 数据完整性验证

```typescript
// 验证所有字段都存在
function verifyDataCompleteness(data, schema) {
  for (const [key, type] of Object.entries(schema)) {
    expect(data).toHaveProperty(key);
    expect(typeof data[key]).toBe(type);
  }
}

// 验证没有数据丢失
async function verifyNoDataLoss(operation) {
  const before = await countRecords();
  await operation();
  const after = await countRecords();
  expect(after).toBeGreaterThanOrEqual(before);
}

// 验证没有重复数据
async function verifyNoDuplicates(table, uniqueField) {
  const records = await getRecords(table);
  const values = records.map(r => r[uniqueField]);
  const uniqueValues = new Set(values);
  expect(uniqueValues.size).toBe(values.length);
}
```

#### 数据准确性验证

```typescript
// 验证计算正确
function verifyCalculations(data) {
  expect(data.totalXp).toBe(
    data.xpHistory.reduce((sum, event) => sum + event.amount, 0)
  );
  expect(data.balance).toBe(
    data.initialBalance + data.income - data.expense
  );
}

// 验证日期时间准确
function verifyDateTime(data) {
  expect(new Date(data.createdAt)).toBeLessThanOrEqual(new Date());
  expect(new Date(data.updatedAt)).toBeGreaterThanOrEqual(
    new Date(data.createdAt)
  );
}

// 验证状态转换正确
function verifyStateTransition(fromState, toState, allowedTransitions) {
  const key = `${fromState}->${toState}`;
  expect(allowedTransitions).toContain(key);
}
```

#### 一致性验证

```typescript
// 验证客户端-服务器一致
async function verifySyncConsistency(clientData, serverId) {
  const serverData = await getFromServer(serverId);
  expect(clientData).toEqual(serverData);
}

// 验证服务器-数据库一致
async function verifyServerDbConsistency(serverId) {
  const serverData = await getFromServer(serverId);
  const dbData = await getFromDatabase(serverId);
  expect(serverData).toEqual(dbData);
}

// 验证三层一致
async function verifyFullConsistency(clientData, serverId) {
  await verifySyncConsistency(clientData, serverId);
  await verifyServerDbConsistency(serverId);
}
```

### 4. 清理条件

```typescript
// 测试后清理
afterEach(async ({ page }) => {
  // 1. 清除所有缓存
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // 2. 重置数据库
  await resetTestDatabase();
  
  // 3. 关闭所有连接
  await page.close();
});
```

---

## 📊 测试矩阵

### 操作类型 × 用户数 × 网络条件

```
操作: 创建, 更新, 删除, 批量 (4)
用户: 单用户, 双用户, 多用户 (3)
网络: 在线, 离线, 弱网 (3)

总组合数: 4 × 3 × 3 = 36 种
```

### 优先级测试矩阵

| 优先级 | 操作 | 用户 | 网络 | 频率 |
|--------|------|------|------|------|
| P0 | 创建、更新、删除 | 单用户 | 在线 | 每次提交 |
| P1 | 批量、并发 | 双用户 | 在线、弱网 | 每天 |
| P2 | 所有 | 多用户 | 所有 | 每周 |

---

## 🔍 测试用例标准

### 用例分类

#### 基础一致性测试
- 单操作一致性
- 多操作一致性
- 并发操作一致性

#### 数据完整性测试
- 字段完整性
- 数据完整性
- 关系完整性

#### 数据准确性测试
- 计算准确性
- 日期准确性
- 状态准确性

#### 同步测试
- 创建同步
- 更新同步
- 删除同步

#### 冲突解决测试
- 并发冲突
- 删除冲突
- 状态冲突

#### 恢复测试
- 网络中断恢复
- 服务器故障恢复
- 数据库故障恢复

---

## ✅ 测试检查清单

### 测试编写前
- [ ] 理解数据模型
- [ ] 确定一致性要求
- [ ] 准备测试数据
- [ ] 设计验证方法
- [ ] 计划测试用例

### 测试编写中
- [ ] 遵循命名规范
- [ ] 添加清晰的注释
- [ ] 验证所有层级
- [ ] 记录时间戳
- [ ] 处理异常情况

### 测试执行前
- [ ] 数据库正常
- [ ] 服务器正常
- [ ] 测试数据准备
- [ ] 网络条件模拟

### 测试执行中
- [ ] 监控数据变化
- [ ] 记录操作日志
- [ ] 收集一致性指标
- [ ] 性能监控

### 测试执行后
- [ ] 分析测试结果
- [ ] 生成一致性报告
- [ ] 修复失败的测试
- [ ] 优化同步机制

---

## 📈 测试指标

### 一致性指标
- **强一致率：** 100%
- **最终一致率：** 99.9%
- **同步延迟：** < 1s
- **冲突解决率：** 100%

### 可靠性指标
- **数据完整率：** 100%
- **数据准确率：** 100%
- **数据有效率：** 100%
- **恢复成功率：** 100%

### 性能指标
- **同步速度：** < 1s
- **冲突检测时间：** < 100ms
- **恢复时间：** < 5s

---

## 🚀 测试执行计划

### Day 1: 基础一致性
- [ ] 单操作一致性
- [ ] 多操作一致性
- [ ] 数据完整性

### Day 2: 并发和冲突
- [ ] 并发操作
- [ ] 冲突检测
- [ ] 冲突解决

### Day 3: 同步测试
- [ ] 创建同步
- [ ] 更新同步
- [ ] 删除同步

### Day 4: 恢复测试
- [ ] 网络中断恢复
- [ ] 服务器故障恢复
- [ ] 数据库故障恢复

### Day 5: 集成测试
- [ ] 多用户场景
- [ ] 复杂操作
- [ ] 压力测试

---

## 总结

**测试标准：**
- ✅ 100% 一致性
- ✅ 100% 数据完整性
- ✅ < 1s 同步延迟
- ✅ 100% 冲突解决

**测试条件：**
- ✅ 完整的验证方法
- ✅ 多场景覆盖
- ✅ 完整的 setup/teardown
- ✅ 性能指标收集

**下一步：** 实现数据一致性测试框架
