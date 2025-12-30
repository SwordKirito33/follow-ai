import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nbvnnhojvkxfnididast.supabase.co';
const SUPABASE_SERVICE_KEY = 'REDACTED_JWT';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function generateAllTasks() {
  console.log('🚀 Starting bulk task generation...\n');

  // 1. 获取所有工具
  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, name')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Failed to fetch tools:', error);
    return;
  }

  console.log(`📋 Found ${tools.length} tools\n`);

  // 2. 检查哪些工具已有任务
  const { data: existingTasks } = await supabase
    .from('tasks')
    .select('tool_id')
    .in('tool_id', tools.map(t => t.id));

  const toolsWithTasks = new Set(existingTasks?.map(t => t.tool_id) || []);

  // 3. 遍历工具生成任务
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const [index, tool] of tools.entries()) {
    console.log(`[${index + 1}/${tools.length}] ${tool.name}`);

    // 跳过已有任务的工具
    if (toolsWithTasks.has(tool.id)) {
      console.log(`  ⏭️  Already has tasks, skipping\n`);
      skipCount++;
      continue;
    }

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/task-generator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ tool_id: tool.id }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log(`  ✅ Generated ${result.tasks_generated} tasks\n`);
        successCount++;
      } else {
        console.error(`  ❌ Failed: ${result.error || 'Unknown error'}\n`);
        failCount++;
      }

    } catch (err) {
      console.error(`  ❌ Network error:`, err, '\n');
      failCount++;
    }

    // 休息2秒，避免OpenAI rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('📊 Summary:');
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ⏭️  Skipped: ${skipCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log('\n🎉 Bulk generation complete!');
}

generateAllTasks();

