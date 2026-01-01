// src/services/storageService.ts

import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/javascript',
  'text/python',
  'application/json',
];

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * 上传评论输出文件到 Storage
 */
export async function uploadOutputFile(
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  // 验证文件大小
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  // 验证文件类型
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`);
  }

  // 生成唯一文件名
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}_${randomStr}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // 模拟上传进度（Supabase Storage 不支持原生进度回调）
  if (onProgress) {
    const interval = setInterval(() => {
      const progress = Math.min(Math.random() * 100, 90);
      onProgress({
        loaded: (file.size * progress) / 100,
        total: file.size,
        percentage: progress,
      });
    }, 200);

    // 清理定时器
    setTimeout(() => clearInterval(interval), 2000);
  }

  // 上传文件
  const { data, error } = await supabase.storage
    .from('review-outputs')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('[storageService] Upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  // 获取公开 URL
  const { data: urlData } = supabase.storage
    .from('review-outputs')
    .getPublicUrl(filePath);

  if (onProgress) {
    onProgress({
      loaded: file.size,
      total: file.size,
      percentage: 100,
    });
  }

  return {
    url: urlData.publicUrl,
    path: filePath,
    size: file.size,
    type: file.type,
  };
}

/**
 * 上传用户头像
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<UploadResult> {
  // 验证文件类型（仅允许图片）
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed for avatars');
  }

  // 验证文件大小（头像最大 2MB）
  const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error(`Avatar size exceeds ${MAX_AVATAR_SIZE / 1024 / 1024}MB limit`);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `avatar.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // 上传文件（覆盖旧头像）
  const { data, error } = await supabase.storage
    .from('user-avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // 覆盖旧文件
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('user-avatars')
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath,
    size: file.size,
    type: file.type,
  };
}

/**
 * 上传作品集图片
 */
export async function uploadPortfolioImage(
  file: File,
  userId: string
): Promise<UploadResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}_${randomStr}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('portfolio-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath,
    size: file.size,
    type: file.type,
  };
}

/**
 * 删除文件
 */
export async function deleteOutputFile(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('review-outputs')
      .remove([filePath]);
    
    if (error) {
      console.error('Delete error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

/**
 * 验证文件类型
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const prefix = type.split('/')[0];
      return file.type.startsWith(prefix + '/');
    }
    return file.type === type;
  });
}

/**
 * 验证文件大小
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
