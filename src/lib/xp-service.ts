import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import type { XpSource } from './gamification';

export type XpEvent = Database['public']['Tables']['xp_events']['Row'];

export async function grantXp(params: {
  userId: string;
  deltaXp: number; // positive
  source: Exclude<XpSource, 'admin'>; // task/bonus
  refType?: string;
  refId?: string;
  note?: string;
  metadata?: Record<string, any>;
}) {
  if (params.deltaXp <= 0) throw new Error('deltaXp must be positive');
  
  // ✅ 修复：调用 RPC 时使用正确的参数名
  const { error } = await (supabase.rpc as any)('grant_xp', {
    p_user_id: params.userId,
    p_amount: params.deltaXp,
    p_source: params.source,
    // p_reference_type 字段在数据库不存在，已移除
    p_source_id: params.refId ?? null, // 映射到 p_source_id
    p_reason: params.note ?? `XP from ${params.source}`
  });

  if (error) {
    console.error('[XP] Failed to grant XP:', {
      userId: params.userId,
      deltaXp: params.deltaXp,
      source: params.source,
      error: error.message,
      details: error
    });
    throw error;
  }
}

export async function adminGrantXp(params: {
  userId: string;
  deltaXp: number; // can be negative
  refType?: string;
  refId?: string;
  note?: string;
  metadata?: Record<string, any>;
}) {
  if (params.deltaXp === 0) throw new Error('deltaXp cannot be 0');

  const { error } = await (supabase.rpc as any)('admin_grant_xp', {
    p_user_id: params.userId,
    p_delta_xp: params.deltaXp,
    p_source: 'admin',
    p_ref_type: params.refType ?? null,
    p_ref_id: params.refId ?? null,
    p_note: params.note ?? null,
    p_metadata: params.metadata ?? {},
  });

  if (error) throw error;
}

export async function listXpEvents(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('xp_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function fetchLeaderboard(limit = 50) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, xp, total_xp')
    .order('total_xp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
