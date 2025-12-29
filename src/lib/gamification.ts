import { supabase } from '@/lib/supabase';

export type XpSource = 'task' | 'bonus' | 'admin';

export type LevelDef = { level: number; min_xp: number; name: string; badge?: string };

export type LevelConfig = {
  level: number;
  min_xp: number;
  name: string;
  badge: string;
};

export type GamificationConfig = {
  levels: LevelDef[];
  xp_sources: Record<string, { label: string; emoji?: string }>;
};

// Cache for getActiveLevels
let cache: Record<string, LevelConfig[]> = {};

// Legacy cache for getGamificationConfig
let cached: GamificationConfig | null = null;

/**
 * Get active levels for a specific variant with caching
 * @param variant - Variant identifier (default: 'A')
 * @returns Array of level configurations
 */
export async function getActiveLevels(variant = 'A'): Promise<LevelConfig[]> {
  if (cache[variant]) return cache[variant];

  const { data, error } = await supabase
    .from('gamification_config')
    .select('value')
    .eq('key', 'levels')
    .eq('variant', variant)
    .single() as any;

  if (error || !data || !data.value) {
    throw error || new Error('Failed to fetch levels');
  }

  const levels = data.value as LevelConfig[];
  cache[variant] = levels;
  return levels;
}

/**
 * Get level configuration for a given XP value
 * @param xp - Current XP value
 * @param levels - Array of level configurations
 * @returns Level configuration that matches the XP
 */
export function getLevelByXp(xp: number, levels: LevelConfig[]): LevelConfig {
  return (
    levels
      .slice()
      .reverse()
      .find(l => xp >= l.min_xp) ?? levels[0]
  );
}

// Legacy function - kept for backward compatibility
export async function getGamificationConfig(): Promise<GamificationConfig> {
  if (cached) return cached;

  const { data: levelsRow } = await supabase
    .from('gamification_config')
    .select('value')
    .eq('key', 'levels')
    .maybeSingle() as any;

  const { data: sourcesRow } = await supabase
    .from('gamification_config')
    .select('value')
    .eq('key', 'xp_sources')
    .maybeSingle() as any;

  const levels = levelsRow ? ((levelsRow.value as any) ?? []) : [];
  const xp_sources = sourcesRow ? ((sourcesRow.value as any) ?? {}) : {};

  cached = { levels, xp_sources };
  return cached;
}

// Legacy function - kept for backward compatibility
export function getLevelFromXpWithConfig(xp: number, levels: LevelDef[]) {
  const sorted = [...levels].sort((a, b) => a.min_xp - b.min_xp);
  let current = sorted[0] ?? { level: 1, min_xp: 0, name: 'Novice', badge: '🌱' };
  for (const lv of sorted) if (xp >= lv.min_xp) current = lv;
  const next = sorted.find(lv => lv.min_xp > current.min_xp) ?? null;
  const progress = next ? (xp - current.min_xp) / Math.max(1, (next.min_xp - current.min_xp)) : 1;
  return { current, next, progress: Math.min(1, Math.max(0, progress)) };
}

// Legacy function - kept for backward compatibility
export function getSourceMeta(source: string, xp_sources: GamificationConfig['xp_sources']) {
  return xp_sources?.[source] ?? { label: source, emoji: '' };
}

/**
 * Get gamification levels for a specific variant (legacy - use getActiveLevels instead)
 * @param variant - Variant identifier (default: 'A')
 * @returns Array of level configurations
 */
export async function getGamificationLevels(
  variant: string = 'A'
): Promise<LevelConfig[]> {
  return getActiveLevels(variant);
}
