import { supabase } from '@/lib/supabase';

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  total_xp: number;
  level: number;
  rank: number;
}

/**
 * Get leaderboard with a single SQL query
 * Uses RPC or direct query to get top users by total_xp
 */
export const leaderboardService = {
  /**
   * Get top users by total XP (single query)
   * Returns top N users with their rank, XP, and level
   */
  async getTopUsers(limit = 100, offset = 0): Promise<LeaderboardEntry[]> {
    // Single query: get profiles ordered by total_xp
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, total_xp, level')
      .order('total_xp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Add rank (offset + index + 1)
    return (data || []).map((user, index) => ({
      user_id: user.id,
      username: user.username || 'user',
      full_name: user.full_name || user.username || 'User',
      avatar_url: user.avatar_url,
      total_xp: (user.total_xp as number) || 0,
      level: (user.level as number) || 1,
      rank: offset + index + 1,
    }));
  },

  /**
   * Get user's rank by total XP
   */
  async getUserRank(userId: string): Promise<number | null> {
    // Get user's total_xp
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('total_xp')
      .eq('id', userId)
      .single();

    if (userError || !userData) return null;

    const userXp = (userData.total_xp as number) || 0;

    // Count how many users have more XP
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('total_xp', userXp);

    if (error) throw error;

    // Rank is count + 1
    return (count || 0) + 1;
  },
};

