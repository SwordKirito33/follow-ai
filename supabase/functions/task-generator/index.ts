import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("🚀 Task Generator (Secure + Clean Mode) Started");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error("❌ Auth Error:", authError);
      throw new Error('Invalid token. Please log in.');
    }

    console.log(`✅ User authenticated: ${user.id} (${user.email})`);

    // 2. Get tool
    const { tool_id } = await req.json();
    if (!tool_id) throw new Error('Missing tool_id');

    const { data: tool, error: toolError } = await supabaseAdmin
      .from('tools')
      .select('name, description')
      .eq('id', tool_id)
      .single();

    if (toolError || !tool) throw new Error('Tool not found');
    console.log(`🛠️  Generating tasks for: ${tool.name}`);

    // 3. Call OpenAI
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) throw new Error('OpenAI API key not configured');

    const prompt = `Create 3 gamified tasks for "${tool.name}".
Description: ${tool.description || 'An AI tool'}

Generate exactly 3 tasks: beginner (100 XP), intermediate (200 XP), advanced (300 XP).
Each task: 15-30 minutes, practical, specific.

Return ONLY valid JSON (no markdown):
{
  "tasks": [
    {
      "title": "Clear task title",
      "difficulty": "beginner",
      "xp_reward": 100,
      "description": "What to do (2-3 sentences)",
      "estimated_time": 20,
      "requirements": ["Req 1", "Req 2"],
      "acceptance_criteria": "How to verify"
    },
    { "difficulty": "intermediate", "xp_reward": 200, ... },
    { "difficulty": "advanced", "xp_reward": 300, ... }
  ]
}`;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a gamification expert. Output only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!aiResponse.ok) {
      const err = await aiResponse.json();
      throw new Error(`OpenAI error: ${err.error?.message || 'Unknown'}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;
    if (!content) throw new Error('No AI response');

    // 4. Parse response
    let parsedData;
    try {
      const clean = content.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(clean);
    } catch (e) {
      throw new Error('Failed to parse AI response');
    }

    if (!parsedData.tasks || !Array.isArray(parsedData.tasks)) {
      throw new Error('Invalid task format');
    }

    // 🔥 5. DELETE OLD TASKS FIRST (Critical Fix)
    console.log(`🗑️  Deleting old tasks for: ${tool.name}`);
    const { error: deleteError } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('tool_id', tool_id);

    if (deleteError) {
      console.warn('⚠️  Delete warning:', deleteError.message);
    } else {
      console.log(`✅ Old tasks deleted`);
    }

    // 6. Insert NEW tasks
    const tasksToInsert = parsedData.tasks.map((task: any) => ({
      tool_id,
      title: task.title,
      description: task.description,
      difficulty: task.difficulty,
      xp_reward: task.xp_reward,
      estimated_time: task.estimated_time,
      requirements: task.requirements,
      acceptance_criteria: task.acceptance_criteria,
      status: 'active'
    }));

    const { error: insertError } = await supabaseAdmin
      .from('tasks')
      .insert(tasksToInsert);

    if (insertError) throw new Error(`Insert failed: ${insertError.message}`);

    console.log(`✅ Generated ${tasksToInsert.length} tasks`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        tool: tool.name,
        tasks_generated: tasksToInsert.length,
        tasks: tasksToInsert
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
