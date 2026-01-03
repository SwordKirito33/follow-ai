// Demo Data Seeding Script for Follow.ai
// Creates 10 AI tools and 30 reviews for demo purposes

import { createClient } from '@supabase/supabase-js';

// ============================================
// Configuration
// ============================================

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================
// Demo AI Tools Data
// ============================================

const demoTools = [
  {
    name: 'ChatGPT',
    slug: 'chatgpt',
    description: 'OpenAI的旗舰对话AI，支持多轮对话、代码生成、文本创作等多种任务。',
    category: 'chatbot',
    website: 'https://chat.openai.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    pricing: 'freemium',
    features: ['多轮对话', '代码生成', '文本创作', '图像理解', '插件支持'],
    tags: ['AI对话', '写作助手', '编程助手'],
    rating: 4.8,
    review_count: 15000,
    is_featured: true,
    is_verified: true,
  },
  {
    name: 'Midjourney',
    slug: 'midjourney',
    description: '领先的AI图像生成工具，通过文字描述创建惊艳的艺术作品和设计。',
    category: 'image-generation',
    website: 'https://midjourney.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
    pricing: 'paid',
    features: ['文生图', '图生图', '风格迁移', '高分辨率输出', '批量生成'],
    tags: ['AI绘画', '设计工具', '创意'],
    rating: 4.9,
    review_count: 12000,
    is_featured: true,
    is_verified: true,
  },
  {
    name: 'Claude',
    slug: 'claude',
    description: 'Anthropic开发的AI助手，以安全性和有帮助性著称，擅长长文本分析。',
    category: 'chatbot',
    website: 'https://claude.ai',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Claude_AI_logo.svg',
    pricing: 'freemium',
    features: ['长文本处理', '代码分析', '文档理解', '多语言支持', '安全对话'],
    tags: ['AI对话', '文档分析', '研究助手'],
    rating: 4.7,
    review_count: 8000,
    is_featured: true,
    is_verified: true,
  },
  {
    name: 'Stable Diffusion',
    slug: 'stable-diffusion',
    description: '开源的AI图像生成模型，可本地部署，支持高度自定义。',
    category: 'image-generation',
    website: 'https://stability.ai',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Stability_AI_logo.svg',
    pricing: 'free',
    features: ['开源免费', '本地部署', '模型微调', 'ControlNet', 'LoRA支持'],
    tags: ['AI绘画', '开源', '本地部署'],
    rating: 4.6,
    review_count: 10000,
    is_featured: false,
    is_verified: true,
  },
  {
    name: 'Notion AI',
    slug: 'notion-ai',
    description: 'Notion内置的AI写作助手，帮助用户更高效地创建和组织内容。',
    category: 'writing',
    website: 'https://notion.so',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    pricing: 'freemium',
    features: ['智能写作', '内容总结', '翻译', '头脑风暴', '任务管理'],
    tags: ['写作助手', '生产力', '笔记'],
    rating: 4.5,
    review_count: 6000,
    is_featured: false,
    is_verified: true,
  },
  {
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    description: 'GitHub和OpenAI联合开发的AI编程助手，实时提供代码建议。',
    category: 'coding',
    website: 'https://github.com/features/copilot',
    logo: 'https://github.githubassets.com/images/modules/site/copilot/copilot.png',
    pricing: 'paid',
    features: ['代码补全', '多语言支持', 'IDE集成', '代码解释', '测试生成'],
    tags: ['编程助手', '代码生成', '开发工具'],
    rating: 4.7,
    review_count: 9000,
    is_featured: true,
    is_verified: true,
  },
  {
    name: 'Runway',
    slug: 'runway',
    description: '专业的AI视频编辑和生成平台，支持文生视频、视频编辑等功能。',
    category: 'video',
    website: 'https://runway.ml',
    logo: 'https://runway.ml/favicon.ico',
    pricing: 'freemium',
    features: ['文生视频', '视频编辑', '背景移除', '动作捕捉', '风格迁移'],
    tags: ['视频制作', 'AI视频', '创意工具'],
    rating: 4.6,
    review_count: 5000,
    is_featured: false,
    is_verified: true,
  },
  {
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    description: '领先的AI语音合成平台，提供逼真的文字转语音和语音克隆服务。',
    category: 'audio',
    website: 'https://elevenlabs.io',
    logo: 'https://elevenlabs.io/favicon.ico',
    pricing: 'freemium',
    features: ['文字转语音', '语音克隆', '多语言', '情感控制', 'API接口'],
    tags: ['语音合成', 'TTS', '配音'],
    rating: 4.8,
    review_count: 4000,
    is_featured: false,
    is_verified: true,
  },
  {
    name: 'Perplexity AI',
    slug: 'perplexity-ai',
    description: 'AI驱动的搜索引擎，提供带引用来源的智能回答。',
    category: 'search',
    website: 'https://perplexity.ai',
    logo: 'https://perplexity.ai/favicon.ico',
    pricing: 'freemium',
    features: ['智能搜索', '引用来源', '实时信息', '多模态', '对话式'],
    tags: ['AI搜索', '研究工具', '信息获取'],
    rating: 4.7,
    review_count: 7000,
    is_featured: true,
    is_verified: true,
  },
  {
    name: 'Cursor',
    slug: 'cursor',
    description: '基于AI的代码编辑器，内置GPT-4，专为AI辅助编程设计。',
    category: 'coding',
    website: 'https://cursor.sh',
    logo: 'https://cursor.sh/favicon.ico',
    pricing: 'freemium',
    features: ['AI代码编辑', 'GPT-4集成', '代码重构', '智能补全', '对话编程'],
    tags: ['代码编辑器', 'AI编程', 'IDE'],
    rating: 4.8,
    review_count: 3000,
    is_featured: false,
    is_verified: true,
  },
];

// ============================================
// Demo Reviews Data
// ============================================

const reviewTemplates = [
  {
    rating: 5,
    title: '非常棒的工具！',
    content: '这个工具彻底改变了我的工作流程，效率提升了至少50%。界面直观，功能强大，强烈推荐！',
  },
  {
    rating: 5,
    title: '超出预期',
    content: '使用了一个月，效果远超预期。特别是{feature}功能，真的太好用了。',
  },
  {
    rating: 4,
    title: '很好用，但有改进空间',
    content: '整体体验很好，{feature}功能特别实用。希望能增加更多自定义选项。',
  },
  {
    rating: 4,
    title: '值得推荐',
    content: '作为{category}类工具，这个产品做得相当不错。性价比很高。',
  },
  {
    rating: 5,
    title: '最佳选择',
    content: '对比了市面上多款{category}工具，这个是我用过最好的。',
  },
  {
    rating: 4,
    title: '专业级工具',
    content: '功能全面，适合专业用户。学习曲线稍陡，但值得投入时间。',
  },
  {
    rating: 5,
    title: '改变游戏规则',
    content: 'AI技术的应用非常成熟，{feature}功能让我印象深刻。',
  },
  {
    rating: 4,
    title: '稳定可靠',
    content: '使用半年了，从未出现过重大问题。客服响应也很及时。',
  },
  {
    rating: 5,
    title: '物超所值',
    content: '免费版功能就很强大了，付费版更是物超所值。',
  },
  {
    rating: 4,
    title: '持续进步',
    content: '每次更新都有惊喜，团队很用心在改进产品。',
  },
];

const userNames = [
  '科技爱好者', '设计师小王', '程序员老张', '产品经理Lisa',
  '自由职业者', '创业者Tom', '学生小明', '内容创作者',
  '数据分析师', '市场营销专家', 'AI研究员', '独立开发者',
];

// ============================================
// Seed Functions
// ============================================

async function seedTools() {
  console.log('Seeding AI tools...');
  
  for (const tool of demoTools) {
    const { error } = await supabase
      .from('tools')
      .upsert(tool, { onConflict: 'slug' });
    
    if (error) {
      console.error(`Error seeding tool ${tool.name}:`, error);
    } else {
      console.log(`✓ Seeded tool: ${tool.name}`);
    }
  }
}

async function seedReviews() {
  console.log('Seeding reviews...');
  
  // Get all tools
  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('id, name, category, features');
  
  if (toolsError || !tools) {
    console.error('Error fetching tools:', toolsError);
    return;
  }
  
  // Create 3 reviews per tool
  for (const tool of tools) {
    for (let i = 0; i < 3; i++) {
      const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
      const userName = userNames[Math.floor(Math.random() * userNames.length)];
      const feature = tool.features?.[Math.floor(Math.random() * (tool.features?.length || 1))] || '核心';
      
      const review = {
        tool_id: tool.id,
        user_name: userName,
        rating: template.rating,
        title: template.title,
        content: template.content
          .replace('{feature}', feature)
          .replace('{category}', tool.category),
        is_verified: Math.random() > 0.3,
        helpful_count: Math.floor(Math.random() * 50),
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      const { error } = await supabase
        .from('reviews')
        .insert(review);
      
      if (error) {
        console.error(`Error seeding review for ${tool.name}:`, error);
      } else {
        console.log(`✓ Seeded review for: ${tool.name}`);
      }
    }
  }
}

// ============================================
// Main Execution
// ============================================

async function main() {
  console.log('Starting demo data seeding...\n');
  
  try {
    await seedTools();
    console.log('\n');
    await seedReviews();
    console.log('\n✅ Demo data seeding completed!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();
