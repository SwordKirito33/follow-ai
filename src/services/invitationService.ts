import { supabase } from '../lib/supabase';

export interface Invitation {
  id: string;
  code: string;
  creator_id: string;
  product_id?: string;
  task_id?: string;
  invited_user_id?: string;
  status: 'pending' | 'accepted' | 'expired';
  expires_at?: string;
  created_at: string;
  accepted_at?: string;
}

// 创建邀请链接
export async function createInvitation(
  creatorId: string,
  options: {
    productId?: string;
    taskId?: string;
    expiresInDays?: number;
  } = {}
): Promise<{ invitation: Invitation; inviteUrl: string }> {
  // 生成邀请码
  const { data: codeData, error: codeError } = await supabase
    .rpc('generate_invitation_code');

  if (codeError || !codeData) {
    throw new Error('Failed to generate invitation code');
  }

  const code = codeData as string;

  // 计算过期时间
  const expiresAt = options.expiresInDays
    ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  // 创建邀请记录
  const { data, error } = await supabase
    .from('invitations')
    .insert({
      code,
      creator_id: creatorId,
      product_id: options.productId,
      task_id: options.taskId,
      expires_at: expiresAt,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  const inviteUrl = `${window.location.origin}/invite/${code}`;

  return {
    invitation: data as Invitation,
    inviteUrl,
  };
}

// 接受邀请
export async function acceptInvitation(code: string, userId: string): Promise<Invitation> {
  // 查找邀请
  const { data: invitation, error: fetchError } = await supabase
    .from('invitations')
    .select('*')
    .eq('code', code)
    .single();

  if (fetchError || !invitation) {
    throw new Error('Invitation not found');
  }

  // 检查状态
  if (invitation.status !== 'pending') {
    throw new Error('Invitation already used or expired');
  }

  // 检查过期时间
  if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
    await supabase
      .from('invitations')
      .update({ status: 'expired' })
      .eq('id', invitation.id);
    throw new Error('Invitation expired');
  }

  // 更新邀请状态
  const { data, error } = await supabase
    .from('invitations')
    .update({
      status: 'accepted',
      invited_user_id: userId,
      accepted_at: new Date().toISOString(),
    })
    .eq('id', invitation.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // 奖励创建者 XP（可选）
  if (invitation.creator_id) {
    await supabase.from('xp_events').insert({
      user_id: invitation.creator_id,
      amount: 10,
      reason: 'invite_accepted',
      source: `Invited user ${userId}`,
    });
  }

  return data as Invitation;
}

// 获取用户的邀请列表
export async function getUserInvitations(userId: string): Promise<Invitation[]> {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Invitation[];
}

// 获取邀请详情
export async function getInvitationByCode(code: string): Promise<Invitation | null> {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('code', code)
    .single();

  if (error) {
    return null;
  }

  return data as Invitation;
}

export default {
  createInvitation,
  acceptInvitation,
  getUserInvitations,
  getInvitationByCode,
};
