/**
 * File upload validation and utilities
 * Ensures security and consistency across file uploads
 */

import { supabase } from './supabase';

// Allowed file types by bucket
export const ALLOWED_TYPES = {
  'user-avatars': ['image/jpeg', 'image/png', 'image/webp'],
  'portfolio-images': ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  'review-outputs': ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};

// Maximum file sizes by bucket (in bytes)
export const MAX_SIZES = {
  'user-avatars': 5 * 1024 * 1024,      // 5MB
  'portfolio-images': 10 * 1024 * 1024,  // 10MB
  'review-outputs': 20 * 1024 * 1024,    // 20MB
};

// Allowed extensions by bucket
export const ALLOWED_EXTENSIONS = {
  'user-avatars': ['jpg', 'jpeg', 'png', 'webp'],
  'portfolio-images': ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  'review-outputs': ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
};

export type UploadBucket = keyof typeof ALLOWED_TYPES;

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate file before upload
 * Checks: type, size, extension
 */
export function validateFile(
  file: File,
  bucket: UploadBucket
): UploadValidationResult {
  // 1. Validate file type
  const allowedTypes = ALLOWED_TYPES[bucket];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`,
    };
  }

  // 2. Validate file size
  const maxSize = MAX_SIZES[bucket];
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  // 3. Validate file extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  const allowedExts = ALLOWED_EXTENSIONS[bucket];
  if (!ext || !allowedExts.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${allowedExts.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Generate safe filename to prevent path traversal attacks
 * Uses UUID + original extension
 */
export function generateSafeFileName(
  originalName: string,
  bucket: UploadBucket
): string {
  const ext = originalName.split('.').pop()?.toLowerCase();
  const allowedExts = ALLOWED_EXTENSIONS[bucket];

  if (!ext || !allowedExts.includes(ext)) {
    throw new Error('Invalid file extension');
  }

  // Use UUID to prevent collisions and path traversal
  const uuid = crypto.randomUUID();
  return `${uuid}.${ext}`;
}

/**
 * Upload file to Supabase Storage with validation
 */
export async function uploadFile(
  file: File,
  bucket: UploadBucket,
  path: string
): Promise<{ url: string; path: string }> {
  // 1. Validate file
  const validation = validateFile(file, bucket);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 2. Get user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // 3. Generate safe filename
  const safeName = generateSafeFileName(file.name, bucket);
  const fullPath = `${path}/${user.id}/${safeName}`;

  // 4. Upload to Supabase Storage
  const { error: uploadError, data } = await supabase.storage
    .from(bucket)
    .upload(fullPath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  if (!data) {
    throw new Error('Upload failed: no data returned');
  }

  // 5. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { url: publicUrl, path: data.path };
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(
  bucket: UploadBucket,
  path: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw error;
  }
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
