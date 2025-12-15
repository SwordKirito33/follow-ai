import { supabase } from '../lib/supabase'
import type { Database } from '../types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export interface SignUpParams {
  email: string
  password: string
  username: string
  fullName?: string
}

export interface SignInParams {
  email: string
  password: string
}

export interface UpdateProfileParams {
  fullName?: string
  bio?: string
  avatarUrl?: string
}

export interface ServiceResponse<T> {
  data: T | null
  error: Error | null
}

/**
 * 用户注册
 * 注册后自动创建profile记录
 */
export async function signUp(params: SignUpParams): Promise<ServiceResponse<{ user: any; profile: Profile }>> {
  try {
    // 验证输入
    if (!params.email || !params.password || !params.username) {
      return {
        data: null,
        error: new Error('Email, password, and username are required')
      }
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(params.email)) {
      return {
        data: null,
        error: new Error('Invalid email format')
      }
    }

    // 验证密码长度
    if (params.password.length < 6) {
      return {
        data: null,
        error: new Error('Password must be at least 6 characters')
      }
    }

    // 验证用户名
    if (params.username.length < 3 || params.username.length > 20) {
      return {
        data: null,
        error: new Error('Username must be between 3 and 20 characters')
      }
    }

    // 检查用户名是否已存在
    // 注意：在用户注册前，我们无法使用auth.uid()，所以需要允许匿名查询
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', params.username)
      .maybeSingle()
    
    // 如果查询失败但不是因为表不存在，记录错误
    if (checkError && checkError.code !== 'PGRST116') {
      console.warn('Error checking username:', checkError)
      // 继续注册流程，让数据库约束处理重复用户名
    }

    if (existingProfile) {
      return {
        data: null,
        error: new Error('Username already exists')
      }
    }

    // 注册用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          username: params.username,
          full_name: params.fullName
        }
      }
    })

    if (authError) {
      return {
        data: null,
        error: new Error(authError.message)
      }
    }

    if (!authData.user) {
      return {
        data: null,
        error: new Error('Failed to create user')
      }
    }

    // 自动创建profile
    const profileData: ProfileInsert = {
      id: authData.user.id,
      username: params.username,
      full_name: params.fullName || null,
      avatar_url: null,
      bio: null,
      total_earnings: 0,
      reputation_score: 0,
      total_reviews: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (profileError) {
      // 如果profile创建失败，尝试删除已创建的用户（可选）
      console.error('Failed to create profile:', profileError)
      return {
        data: null,
        error: new Error('Failed to create user profile')
      }
    }

    return {
      data: {
        user: authData.user,
        profile: profile
      },
      error: null
    }
  } catch (error) {
    console.error('Sign up error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 用户登录
 */
export async function signIn(params: SignInParams): Promise<ServiceResponse<{ user: any; session: any }>> {
  try {
    // 验证输入
    if (!params.email || !params.password) {
      return {
        data: null,
        error: new Error('Email and password are required')
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password
    })

    if (error) {
      return {
        data: null,
        error: new Error(error.message)
      }
    }

    return {
      data: {
        user: data.user,
        session: data.session
      },
      error: null
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 用户登出
 */
export async function signOut(): Promise<ServiceResponse<null>> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        data: null,
        error: new Error(error.message)
      }
    }

    return {
      data: null,
      error: null
    }
  } catch (error) {
    console.error('Sign out error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 获取当前用户
 */
export async function getCurrentUser(): Promise<ServiceResponse<{ user: any; profile: Profile | null }>> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      return {
        data: null,
        error: new Error(userError.message)
      }
    }

    if (!user) {
      return {
        data: {
          user: null,
          profile: null
        },
        error: null
      }
    }

    // 获取用户profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is acceptable for new users
      console.error('Failed to fetch profile:', profileError)
    }

    return {
      data: {
        user,
        profile: profile || null
      },
      error: null
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 更新用户profile
 */
export async function updateProfile(
  userId: string,
  params: UpdateProfileParams
): Promise<ServiceResponse<Profile>> {
  try {
    // 验证用户ID
    if (!userId) {
      return {
        data: null,
        error: new Error('User ID is required')
      }
    }

    // 验证bio长度
    if (params.bio && params.bio.length > 500) {
      return {
        data: null,
        error: new Error('Bio must be less than 500 characters')
      }
    }

    const updateData: ProfileUpdate = {
      ...params,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return {
        data: null,
        error: new Error(error.message)
      }
    }

    return {
      data,
      error: null
    }
  } catch (error) {
    console.error('Update profile error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 重置密码（发送重置邮件）
 */
export async function resetPassword(email: string): Promise<ServiceResponse<null>> {
  try {
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        data: null,
        error: new Error('Invalid email format')
      }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      return {
        data: null,
        error: new Error(error.message)
      }
    }

    return {
      data: null,
      error: null
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 更新密码
 */
export async function updatePassword(newPassword: string): Promise<ServiceResponse<null>> {
  try {
    // 验证密码长度
    if (newPassword.length < 6) {
      return {
        data: null,
        error: new Error('Password must be at least 6 characters')
      }
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      return {
        data: null,
        error: new Error(error.message)
      }
    }

    return {
      data: null,
      error: null
    }
  } catch (error) {
    console.error('Update password error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

