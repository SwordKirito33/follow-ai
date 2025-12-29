import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type Review = Database['public']['Tables']['reviews']['Row']
type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

export interface ServiceResponse<T> {
  data: T | null
  error: Error | null
}

export interface GetReviewsParams {
  toolId?: string
  userId?: string
  status?: string
  limit?: number
  offset?: number
  orderBy?: 'created_at' | 'rating' | 'upvotes'
  orderDirection?: 'asc' | 'desc'
}

export interface CreateReviewParams {
  toolId: string
  userId: string
  rating: number
  title: string
  content: string
  outputDescription?: string
  outputFiles?: any
  promptUsed?: string
  useCase?: string
  timeSpent?: number
}

/**
 * 获取评测列表（支持筛选）
 */
export async function getReviews(
  params: GetReviewsParams = {}
): Promise<ServiceResponse<Review[]>> {
  try {
    let query = supabase
      .from('reviews')
      .select('*')

    // 应用筛选条件
    if (params.toolId) {
      query = query.eq('tool_id', params.toolId)
    }

    if (params.userId) {
      query = query.eq('user_id', params.userId)
    }

    if (params.status) {
      query = query.eq('status', params.status)
    }

    // 排序
    const orderBy = params.orderBy || 'created_at'
    const orderDirection = params.orderDirection || 'desc'
    query = query.order(orderBy, { ascending: orderDirection === 'asc' })

    // 分页
    if (params.limit) {
      query = query.limit(params.limit)
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      return {
        data: null,
        error: new Error(error.message)
      }
    }

    return {
      data: data || [],
      error: null
    }
  } catch (error) {
    console.error('Get reviews error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 根据ID获取单个评测
 */
export async function getReviewById(reviewId: string): Promise<ServiceResponse<Review>> {
  try {
    if (!reviewId) {
      return {
        data: null,
        error: new Error('Review ID is required')
      }
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
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
    console.error('Get review by ID error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 创建评测
 */
export async function createReview(
  params: CreateReviewParams
): Promise<ServiceResponse<Review>> {
  try {
    // 验证输入
    if (!params.toolId || !params.userId) {
      return {
        data: null,
        error: new Error('Tool ID and User ID are required')
      }
    }

    if (!params.rating || params.rating < 1 || params.rating > 5) {
      return {
        data: null,
        error: new Error('Rating must be between 1 and 5')
      }
    }

    if (!params.title || params.title.trim().length < 5) {
      return {
        data: null,
        error: new Error('Title must be at least 5 characters')
      }
    }

    if (!params.content || params.content.trim().length < 100) {
      return {
        data: null,
        error: new Error('Content must be at least 100 characters')
      }
    }

    // 验证内容长度
    if (params.content.length > 5000) {
      return {
        data: null,
        error: new Error('Content must be less than 5000 characters')
      }
    }

    const reviewData: ReviewInsert = {
      tool_id: params.toolId,
      user_id: params.userId,
      rating: params.rating,
      title: params.title.trim(),
      content: params.content.trim(),
      output_description: params.outputDescription || null,
      output_files: params.outputFiles || null,
      prompt_used: params.promptUsed || null,
      use_case: params.useCase || null,
      time_spent: params.timeSpent || null,
      is_verified: false,
      ai_quality_score: null,
      upvotes: 0,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
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
    console.error('Create review error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 更新评测
 */
export async function updateReview(
  reviewId: string,
  userId: string,
  updates: Partial<ReviewUpdate>
): Promise<ServiceResponse<Review>> {
  try {
    if (!reviewId || !userId) {
      return {
        data: null,
        error: new Error('Review ID and User ID are required')
      }
    }

    // 验证用户是否有权限更新（只能更新自己的评测）
    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single()

    if (fetchError) {
      return {
        data: null,
        error: new Error('Review not found')
      }
    }

    if (existingReview.user_id !== userId) {
      return {
        data: null,
        error: new Error('You do not have permission to update this review')
      }
    }

    // 验证内容长度
    if (updates.content && updates.content.length > 5000) {
      return {
        data: null,
        error: new Error('Content must be less than 5000 characters')
      }
    }

    const updateData: ReviewUpdate = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', reviewId)
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
    console.error('Update review error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 删除评测
 */
export async function deleteReview(
  reviewId: string,
  userId: string
): Promise<ServiceResponse<null>> {
  try {
    if (!reviewId || !userId) {
      return {
        data: null,
        error: new Error('Review ID and User ID are required')
      }
    }

    // 验证用户是否有权限删除（只能删除自己的评测）
    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single()

    if (fetchError) {
      return {
        data: null,
        error: new Error('Review not found')
      }
    }

    if (existingReview.user_id !== userId) {
      return {
        data: null,
        error: new Error('You do not have permission to delete this review')
      }
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

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
    console.error('Delete review error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 点赞评测
 */
export async function upvoteReview(
  reviewId: string,
  userId: string
): Promise<ServiceResponse<Review>> {
  try {
    if (!reviewId || !userId) {
      return {
        data: null,
        error: new Error('Review ID and User ID are required')
      }
    }

    // 获取当前评测
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('upvotes')
      .eq('id', reviewId)
      .single()

    if (fetchError) {
      return {
        data: null,
        error: new Error('Review not found')
      }
    }

    // 增加点赞数
    const { data, error } = await supabase
      .from('reviews')
      .update({
        upvotes: (review.upvotes || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
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
    console.error('Upvote review error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

