import { supabase } from '../lib/supabase'
import type { Database } from '../types/database.types'

type Waitlist = Database['public']['Tables']['waitlist']['Row']
type WaitlistInsert = Database['public']['Tables']['waitlist']['Insert']

export interface ServiceResponse<T> {
  data: T | null
  error: Error | null
}

export interface AddToWaitlistParams {
  email: string
  source?: string
}

/**
 * 验证邮箱格式
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 添加到等待列表
 * 优雅处理重复邮箱（如果已存在，返回成功但不创建新记录）
 */
export async function addToWaitlist(
  params: AddToWaitlistParams
): Promise<ServiceResponse<Waitlist>> {
  try {
    // 验证输入
    if (!params.email) {
      return {
        data: null,
        error: new Error('Email is required')
      }
    }

    // 验证邮箱格式
    if (!validateEmail(params.email)) {
      return {
        data: null,
        error: new Error('Invalid email format')
      }
    }

    // 检查邮箱是否已存在
    const { data: existing, error: checkError } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', params.email.toLowerCase().trim())
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      console.error('Error checking existing email:', checkError)
    }

    // 如果已存在，返回现有记录（优雅处理）
    if (existing) {
      return {
        data: existing,
        error: null
      }
    }

    // 创建新记录
    const waitlistData: WaitlistInsert = {
      email: params.email.toLowerCase().trim(),
      source: params.source || null,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('waitlist')
      .insert(waitlistData)
      .select()
      .single()

    if (error) {
      // 如果是唯一约束错误，尝试再次获取现有记录
      if (error.code === '23505') {
        const { data: existingRecord } = await supabase
          .from('waitlist')
          .select('*')
          .eq('email', params.email.toLowerCase().trim())
          .single()

        if (existingRecord) {
          return {
            data: existingRecord,
            error: null
          }
        }
      }

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
    console.error('Add to waitlist error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 检查邮箱是否在等待列表中
 */
export async function checkWaitlistStatus(
  email: string
): Promise<ServiceResponse<{ exists: boolean; waitlist: Waitlist | null }>> {
  try {
    if (!email) {
      return {
        data: null,
        error: new Error('Email is required')
      }
    }

    if (!validateEmail(email)) {
      return {
        data: null,
        error: new Error('Invalid email format')
      }
    }

    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      return {
        data: null,
        error: new Error(error.message)
      }
    }

    return {
      data: {
        exists: !!data,
        waitlist: data || null
      },
      error: null
    }
  } catch (error) {
    console.error('Check waitlist status error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 获取等待列表总数（管理员功能）
 */
export async function getWaitlistCount(): Promise<ServiceResponse<number>> {
  try {
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return {
        data: null,
        error: new Error(error.message)
      }
    }

    return {
      data: count || 0,
      error: null
    }
  } catch (error) {
    console.error('Get waitlist count error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

