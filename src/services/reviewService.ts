// src/services/reviewService.ts

import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

export interface CreateReviewParams {
  toolId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  outputDescription?: string;
  outputFiles?: {
    files: Array<{
      url: string;
      path: string;
      size: number;
      type: string;
    }>;
    qualityScore?: number | null;
  };
  promptUsed?: string;
  useCase?: string;
  timeSpent?: number;
}

export interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface GetReviewsParams {
  toolId?: string;
  userId?: string;
  status?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'rating' | 'upvotes';
  orderDirection?: 'asc' | 'desc';
}

/**
 * 获取评测列表
 */
export async function getReviews(
  params: GetReviewsParams = {}
): Promise<ServiceResponse<Review[]>> {
  try {
    let query = supabase.from('reviews').select('*')

    if (params.toolId) {
      query = query.eq('tool_id', params.toolId)
    }

    if (params.userId) {
      query = query.eq('user_id', params.userId)
    }

    if (params.status) {
      query = query.eq('status', params.status)
    }

    const orderBy = params.orderBy || 'created_at'
    const orderDirection = params.orderDirection || 'desc'
    query = query.order(orderBy, { ascending: orderDirection === 'asc' })

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
 * 创建新评论
 */
export async function createReview(
  params: CreateReviewParams
): Promise<ServiceResponse<Review>> {
  try {
    // 验证必填字段
    if (!params.toolId || !params.userId || !params.title || !params.content) {
      return {
        data: null,
        error: new Error('Missing required fields: toolId, userId, title, content'),
      };
    }

    // 验证 rating 范围
    if (params.rating < 1 || params.rating > 5) {
      return {
        data: null,
        error: new Error('Rating must be between 1 and 5'),
      };
    }

    // 构建 review 数据
    const reviewData: ReviewInsert = {
      tool_id: params.toolId,
      user_id: params.userId,
      rating: params.rating,
      title: params.title,
      content: params.content,
      output_description: params.outputDescription || null,
      output_files: params.outputFiles ? JSON.parse(JSON.stringify(params.outputFiles)) : null,
      prompt_used: params.promptUsed || null,
      use_case: params.useCase || null,
      time_spent: params.timeSpent || null,
      status: 'pending', // 默认状态为 pending，需要审核
      is_verified: false,
      ai_quality_score: params.outputFiles?.qualityScore || null,
      upvotes: 0,
    };

    // 插入数据库
    const { data, error } = await (supabase
      .from('reviews') as any)
      .insert(reviewData)
      .select()
      .single();

    if (error) {
      console.error('[reviewService] Create review error:', error);
      return {
        data: null,
        error: new Error(error.message),
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error('[reviewService] Unexpected error:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * 获取工具的所有评论
 */
export async function getToolReviews(
  toolId: string
): Promise<ServiceResponse<Review[]>> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('tool_id', toolId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      return {
        data: null,
        error: new Error(error.message),
      };
    }

    return {
      data: data || [],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * 获取用户的所有评论
 */
export async function getUserReviews(
  userId: string
): Promise<ServiceResponse<Review[]>> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        data: null,
        error: new Error(error.message),
      };
    }

    return {
      data: data || [],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * 更新评测
 */
export async function updateReview(
  reviewId: string,
  userId: string,
  updates: any
): Promise<ServiceResponse<Review>> {
  try {
    if (!reviewId || !userId) {
      return {
        data: null,
        error: new Error('Review ID and User ID are required')
      }
    }

    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single()

    if (fetchError || !existingReview) {
      return {
        data: null,
        error: new Error('Review not found')
      }
    }

    if ((existingReview as any).user_id !== userId) {
      return {
        data: null,
        error: new Error('You do not have permission to update this review')
      }
    }

    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await (supabase
      .from('reviews') as any)
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
