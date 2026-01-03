# Follow.ai 开发指南

## 核心原则 (10条)

1. **类型安全优先** - 禁止使用 `any`，始终明确类型
2. **组件标准化** - Props 接口必须定义，使用函数式组件
3. **错误处理** - 所有 async 函数必须 try-catch
4. **代码复用** - 复制3次必须抽离成共用组件
5. **命名规范** - 组件 PascalCase，函数 camelCase，文件夹 kebab-case
6. **响应式设计** - 移动端基本可用
7. **加载状态** - 所有异步操作显示 loading
8. **空状态** - 空数据要有友好提示
9. **安全检查** - 验证输入，使用环境变量
10. **Git规范** - 清晰的 commit message

## 自查清单

每完成一个功能：
- [ ] 类型都明确了吗？
- [ ] 错误处理完整吗？
- [ ] 空状态/加载状态有吗？
- [ ] 移动端测试了吗？
- [ ] 有重复代码吗？

## Commit Message 格式

```
type(scope): subject

body (可选)
```

Types: feat, fix, refactor, style, docs, test, chore
