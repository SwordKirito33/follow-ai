# ✅ 提交前检查清单

> **使用时机**: 每次Git提交前

---

## 代码质量检查

- [ ] **导入路径**: 所有导入使用 `@/` 别名
  ```bash
  npm run check-imports
  ```

- [ ] **类型检查**: 无TypeScript错误
  ```bash
  npm run type-check
  ```

- [ ] **错误处理**: 所有async操作有try-catch
- [ ] **Console语句**: 无 `console.log`，只有 `console.error`/`console.warn`
- [ ] **类型安全**: 无 `any` 类型（除非必要）
- [ ] **XP系统**: 使用 `grantXp()`，不直接UPDATE profiles

---

## 功能测试

- [ ] **登录/注册**: 功能正常
- [ ] **任务提交**: 可以提交，XP正确更新
- [ ] **Profile页面**: 显示正确的XP和等级
- [ ] **无控制台错误**: 浏览器控制台无错误

---

## 代码审查

- [ ] **代码格式**: 使用Prettier格式化
- [ ] **未使用代码**: 无未使用的导入/变量
- [ ] **注释**: 复杂逻辑有注释
- [ ] **文件大小**: 组件文件 < 300行

---

## Git提交

- [ ] **提交消息**: 符合规范（type(scope): subject）
- [ ] **文件变更**: 只包含相关文件
- [ ] **无敏感信息**: 无API密钥、密码等

---

**快速检查命令**:
```bash
npm run health-check
```

