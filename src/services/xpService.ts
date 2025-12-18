import { supabase } from '@/lib/supabase';
import { XP_PER_LEVEL, XP_SOURCES } from '@/lib/constants';

type XpSource = typeof XP_SOURCES[keyof typeof XP_SOURCES];

interface AwardXpParams {
  userId: string;
  amount: number;
  reason: string;
  source: XpSource;
  sourceId?: string;
}

interface AwardXpResult {
  success: boolean;
  alreadyAwarded?: boolean;
  newTotalXp?: number;
  newLevel?: number;
  currentLevelXp?: number;
  leveledUp?: boolean;
}

export const xpService = {
  calculateLevel(totalXp: number): number {
    let level = 1;
    for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
      if (totalXp >= XP_PER_LEVEL[i]) {
        level = i + 1;
        break;
      }
    }
    return level;
  },

  calculateCurrentXp(totalXp: number, level: number): number {
    const xpForThisLevel = XP_PER_LEVEL[level - 1] || 0;
    return totalXp - xpForThisLevel;
  },

  getXpForNextLevel(level: number): number {
    if (level >= XP_PER_LEVEL.length) {
      const lastDefined = XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
      const extraLevels = level - XP_PER_LEVEL.length + 1;
      return lastDefined + (extraLevels * 1000);
    }
    return XP_PER_LEVEL[level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  },

  async awardXp(params: AwardXpParams): Promise<AwardXpResult> {
    const { userId, amount, reason, source, sourceId } = params;

    if (amount <= 0) {
      return { success: false };
    }

    try {
      const { data: event, error: eventError } = await supabase
        .from('xp_events')
        .insert({
          user_id: userId,
          amount,
          reason,
          source,
          source_id: sourceId || null,
          is_penalty: false,
        })
        .select()
        .single();

      if (eventError) {
        if (eventError.code === '23505' || eventError.message.includes('duplicate')) {
          console.log('XP already awarded for this source');
          return { success: true, alreadyAwarded: true };
        }
        throw eventError;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('total_xp, level')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const oldTotalXp = profile.total_xp || 0;
      const oldLevel = profile.level || 1;
      const newTotalXp = oldTotalXp + amount;
      const newLevel = this.calculateLevel(newTotalXp);
      const currentLevelXp = this.calculateCurrentXp(newTotalXp, newLevel);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          total_xp: newTotalXp,
          level: newLevel,
          xp: currentLevelXp,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      return {
        success: true,
        newTotalXp,
        newLevel,
        currentLevelXp,
        leveledUp: newLevel > oldLevel,
      };
    } catch (error) {
      console.error('Failed to award XP:', error);
      return { success: false };
    }
  },

  async getXpHistory(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('xp_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  getXpStats(totalXp: number, level: number) {
    const currentLevelXp = this.calculateCurrentXp(totalXp, level);
    const xpForNextLevel = this.getXpForNextLevel(level);
    const xpForCurrentLevel = XP_PER_LEVEL[level - 1] || 0;
    const xpNeededForNext = xpForNextLevel - totalXp;
    const progressPercent = Math.min(
      100,
      (currentLevelXp / (xpForNextLevel - xpForCurrentLevel)) * 100
    );

    return {
      level,
      totalXp,
      currentLevelXp,
      xpForNextLevel,
      xpNeededForNext,
      progressPercent,
    };
  },
};

