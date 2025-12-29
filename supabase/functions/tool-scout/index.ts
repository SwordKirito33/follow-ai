import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const phToken = Deno.env.get('PRODUCT_HUNT_TOKEN');
    const phQuery = `
      query {
        posts(topic: "artificial-intelligence", order: VOTES, first: 10) {
          edges {
            node {
              name
              tagline
              description
              url
              thumbnail { url }
              votesCount
            }
          }
        }
      }
    `;

    const phResponse = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${phToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: phQuery }),
    });

    const phData = await phResponse.json();
    const tools = phData.data?.posts?.edges || [];
    let toolsAdded = 0;
    let toolsSkipped = 0;

    for (const { node } of tools) {
      const slug = node.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const { data: existing } = await supabaseClient.from('tools').select('id').eq('slug', slug).single();
      if (existing) {
        toolsSkipped++;
        continue;
      }

      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${openaiKey}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ 
            role: 'user', 
            content: `Is "${node.name}: ${node.tagline}" an AI tool? Answer only: yes or no` 
          }],
          max_tokens: 10,
        }),
      });
      
      const aiData = await aiResponse.json();
      const isAi = aiData.choices?.[0]?.message?.content?.toLowerCase().includes('yes');

      if (!isAi) {
        toolsSkipped++;
        continue;
      }

      const { error } = await supabaseClient.from('tools').insert({
        name: node.name,
        slug,
        tagline: node.tagline,
        description: node.description,
        website_url: node.url,
        logo_url: node.thumbnail?.url,
        category: ['AI Tools'],
        status: 'pending_review',
        ai_confidence: 0.9,
      });

      if (!error) toolsAdded++;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        tools_found: tools.length,
        tools_added: toolsAdded, 
        tools_skipped: toolsSkipped 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
