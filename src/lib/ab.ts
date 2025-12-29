import { supabase } from '@/lib/supabase';

/**
 * Deterministic A/B test assignment by hashing user.id to 0..99
 */
function getBucket(userId: string): number {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % 100;
}

export interface ExperimentVariant {
  key: string;
  variant: string;
  value: any;
  is_active: boolean;
}

/**
 * Get active experiment variant for a user
 */
export async function getExperimentVariant(
  userId: string,
  experimentKey: string
): Promise<string | null> {
  try {
    // Fetch active experiment rows
    const { data, error } = await supabase
      .from('gamification_experiments')
      .select('*')
      .eq('key', experimentKey)
      .eq('is_active', true);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    // Get user's bucket
    const bucket = getBucket(userId);

    // Choose variant: bucket < 50 => A, else B
    const variant = bucket < 50 ? 'A' : 'B';

    // Find matching variant
    const variantData = data.find((d: any) => d.variant === variant);
    return variantData ? variant : null;
  } catch (err) {
    console.error('Failed to get experiment variant:', err);
    return null;
  }
}

/**
 * Get experiment value for a user
 */
export async function getExperimentValue(
  userId: string,
  experimentKey: string,
  defaultValue: any = null
): Promise<any> {
  try {
    const variant = await getExperimentVariant(userId, experimentKey);
    if (!variant) return defaultValue;

    const { data, error } = await supabase
      .from('gamification_experiments')
      .select('value')
      .eq('key', experimentKey)
      .eq('variant', variant)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data?.value ?? defaultValue;
  } catch (err) {
    console.error('Failed to get experiment value:', err);
    return defaultValue;
  }
}

