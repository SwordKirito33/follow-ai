import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// 延迟初始化，避免在模块加载时抛出错误
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // 静默处理，只在开发环境显示警告
    if (import.meta.env.DEV) {
      console.warn('⚠️ Supabase environment variables not found. Using mock client for development.')
    }
    
    // 返回一个mock客户端，让应用至少能渲染
    // 实际使用时会在AuthContext中检查并显示错误
    const mockUrl = 'https://placeholder.supabase.co'
    const mockKey = 'REDACTED_JWT'
    
    supabaseInstance = createClient<Database>(mockUrl, mockKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
        storage: localStorage
      }
    })
    
    return supabaseInstance
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage
    }
  })

  return supabaseInstance
}

// 导出单例
export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(target, prop) {
    const client = getSupabaseClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

// 导出检查函数
export function checkSupabaseConfig(): { isValid: boolean; error?: string } {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      isValid: false,
      error: 'Missing Supabase environment variables. Please check .env.local file.'
    }
  }

  return { isValid: true }
}

/**
 * CRITICAL: Auto-create profile on login
 * 
 * This prevents "profile not found" errors.
 * Call immediately after detecting authenticated session.
 * 
 * Uses INSERT ... ON CONFLICT pattern for safety.
 * If profile exists, this is a no-op.
 * 
 * INTEGRATION:
 * Find your auth state management file and add:
 * 
 * supabase.auth.onAuthStateChange(async (event, session) => {
 *   if (event === 'SIGNED_IN' && session?.user) {
 *     await ensureProfileExists(session.user.id);
 *   }
 * });
 * 
 * Also check on initial load:
 * const { data: { session } } = await supabase.auth.getSession();
 * if (session?.user) {
 *   await ensureProfileExists(session.user.id);
 * }
 */
export async function ensureProfileExists(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        xp: 0,
        level: 1,
        total_xp: 0,
        profile_completion: 0,
        skills: [],
        ai_tools: [],
        reputation_score: 0,
      })
      .select()
      .single();

    if (error && !error.message.includes('duplicate') && error.code !== '23505') {
      console.error('Failed to ensure profile exists:', error);
    }
  } catch (err) {
    console.error('ensureProfileExists exception:', err);
  }
}

