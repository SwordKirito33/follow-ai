import { supabase } from '../lib/supabase'

export interface ServiceResponse<T> {
  data: T | null
  error: Error | null
}

export interface UploadFileParams {
  file: File
  bucket: 'review-outputs' | 'user-avatars'
  userId: string
  folder?: string
}

// 文件类型白名单（根据安全文档）
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  'review-outputs': [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/javascript',
    'text/css',
    'application/x-python',
    'text/x-python',
    'text/html'
  ],
  'user-avatars': [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
}

// 文件扩展名白名单
const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  'review-outputs': [
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
    '.pdf',
    '.txt',
    '.js', '.jsx', '.ts', '.tsx', '.py', '.html', '.css'
  ],
  'user-avatars': [
    '.jpg', '.jpeg', '.png', '.gif', '.webp'
  ]
}

// 文件大小限制（根据要求）
const MAX_FILE_SIZES: Record<string, number> = {
  'review-outputs': 50 * 1024 * 1024, // 50MB
  'user-avatars': 5 * 1024 * 1024 // 5MB
}

/**
 * 验证文件
 */
function validateFile(file: File, bucket: 'review-outputs' | 'user-avatars'): { valid: boolean; error?: string } {
  // 检查文件类型
  const allowedMimeTypes = ALLOWED_MIME_TYPES[bucket]
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed for ${bucket}`
    }
  }

  // 检查文件扩展名
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  const allowedExtensions = ALLOWED_EXTENSIONS[bucket]
  if (!ext || !allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `File extension ${ext} is not allowed for ${bucket}`
    }
  }

  // 检查文件大小
  const maxSize = MAX_FILE_SIZES[bucket]
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${(maxSize / 1024 / 1024).toFixed(2)}MB for ${bucket}`
    }
  }

  // 检查文件名（防止路径遍历攻击）
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return {
      valid: false,
      error: 'Filename contains illegal characters'
    }
  }

  // 检查文件名长度
  if (file.name.length > 255) {
    return {
      valid: false,
      error: 'Filename is too long (max 255 characters)'
    }
  }

  return { valid: true }
}

/**
 * 生成唯一文件名
 */
function generateUniqueFileName(originalName: string, userId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const ext = originalName.split('.').pop()
  const sanitizedName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 50)
  
  return `${userId}/${timestamp}_${random}_${sanitizedName}.${ext}`
}

/**
 * 上传文件
 */
export async function uploadFile(
  params: UploadFileParams
): Promise<ServiceResponse<{ path: string; url: string }>> {
  try {
    // 验证输入
    if (!params.file || !params.bucket || !params.userId) {
      return {
        data: null,
        error: new Error('File, bucket, and userId are required')
      }
    }

    // 验证文件
    const validation = validateFile(params.file, params.bucket)
    if (!validation.valid) {
      return {
        data: null,
        error: new Error(validation.error || 'File validation failed')
      }
    }

    // 生成唯一文件名
    const fileName = params.folder
      ? `${params.folder}/${generateUniqueFileName(params.file.name, params.userId)}`
      : generateUniqueFileName(params.file.name, params.userId)

    // 上传文件
    const { data, error } = await supabase.storage
      .from(params.bucket)
      .upload(fileName, params.file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return {
        data: null,
        error: new Error(error.message)
      }
    }

    // 获取公共URL
    const { data: urlData } = supabase.storage
      .from(params.bucket)
      .getPublicUrl(data.path)

    return {
      data: {
        path: data.path,
        url: urlData.publicUrl
      },
      error: null
    }
  } catch (error) {
    console.error('Upload file error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 删除文件
 */
export async function deleteFile(
  bucket: 'review-outputs' | 'user-avatars',
  filePath: string,
  userId: string
): Promise<ServiceResponse<null>> {
  try {
    if (!bucket || !filePath || !userId) {
      return {
        data: null,
        error: new Error('Bucket, filePath, and userId are required')
      }
    }

    // 验证文件路径属于该用户（安全措施）
    if (!filePath.startsWith(userId + '/')) {
      return {
        data: null,
        error: new Error('You do not have permission to delete this file')
      }
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

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
    console.error('Delete file error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 获取公共URL
 */
export function getPublicUrl(
  bucket: 'review-outputs' | 'user-avatars',
  filePath: string
): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * 获取预签名URL（带过期时间）
 */
export async function getSignedUrl(
  bucket: 'review-outputs' | 'user-avatars',
  filePath: string,
  expiresIn: number = 3600
): Promise<ServiceResponse<string>> {
  try {
    if (!bucket || !filePath) {
      return {
        data: null,
        error: new Error('Bucket and filePath are required')
      }
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      return {
        data: null,
        error: new Error(error.message)
      }
    }

    return {
      data: data.signedUrl,
      error: null
    }
  } catch (error) {
    console.error('Get signed URL error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

/**
 * 列出用户文件
 */
export async function listUserFiles(
  bucket: 'review-outputs' | 'user-avatars',
  userId: string,
  folder?: string
): Promise<ServiceResponse<Array<{ name: string; size: number; updated_at: string }>>> {
  try {
    if (!bucket || !userId) {
      return {
        data: null,
        error: new Error('Bucket and userId are required')
      }
    }

    const path = folder ? `${userId}/${folder}` : userId

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      return {
        data: null,
        error: new Error(error.message)
      }
    }

    const files = (data || []).map(file => ({
      name: file.name,
      size: file.metadata?.size || 0,
      updated_at: file.updated_at || file.created_at
    }))

    return {
      data: files,
      error: null
    }
  } catch (error) {
    console.error('List user files error:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }
}

