import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

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

