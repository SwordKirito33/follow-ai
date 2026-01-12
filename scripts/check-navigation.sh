#!/bin/bash

echo "=== 导航链接检查 ==="
echo ""

# 1. 检查 /rankings 引用
echo "1. 检查是否还有 to=\"/rankings\" 引用:"
grep -rn "to=\"/rankings\"" src/ --include="*.tsx" --include="*.ts" 2>/dev/null
if [ $? -ne 0 ]; then
  echo "   ✅ 没有发现 to=\"/rankings\" 引用"
else
  echo "   ❌ 发现 to=\"/rankings\" 引用，需要修复"
fi
echo ""

# 2. 检查 navigate('/rankings')
echo "2. 检查是否还有 navigate('/rankings'):"
grep -rn "navigate('/rankings')" src/ --include="*.tsx" --include="*.ts" 2>/dev/null
if [ $? -ne 0 ]; then
  echo "   ✅ 没有发现 navigate('/rankings') 引用"
else
  echo "   ❌ 发现 navigate('/rankings') 引用，需要修复"
fi
echo ""

# 3. 检查 404 路由
echo "3. 检查 404 路由是否存在:"
grep -n "path=\"\*\"" src/App.tsx
if [ $? -eq 0 ]; then
  echo "   ✅ 404 路由已定义"
else
  echo "   ❌ 404 路由未定义"
fi
echo ""

# 4. 检查 /tools 路由
echo "4. 检查 /tools 路由是否存在:"
grep -n "path=\"/tools\"" src/App.tsx
if [ $? -eq 0 ]; then
  echo "   ✅ /tools 路由已定义"
else
  echo "   ❌ /tools 路由未定义"
fi
echo ""

# 5. 检查 /login 路由
echo "5. 检查 /login 路由是否存在:"
grep -n "path=\"/login\"" src/App.tsx
if [ $? -eq 0 ]; then
  echo "   ✅ /login 路由已定义"
else
  echo "   ❌ /login 路由未定义"
fi
echo ""

echo "=== 检查完成 ==="
