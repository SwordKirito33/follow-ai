import { supabase } from '@/lib/supabase';
import { STORAGE_BUCKETS, UPLOAD_LIMITS } from '@/lib/constants';

export const storageService = {
  async canUpload(userId: string, bucket: string): Promise<{
    allowed: boolean;
    remaining: number;
    message?: string;
  }> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const { count, error } = await supabase
      .from('upload_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('bucket', bucket)
      .gte('created_at', oneDayAgo.toISOString());

    if (error) {
      console.error('Failed to check upload limit:', error);
      return { allowed: true, remaining: UPLOAD_LIMITS.DAILY_PER_BUCKET };
    }

    const uploadCount = count || 0;
    const remaining = Math.max(0, UPLOAD_LIMITS.DAILY_PER_BUCKET - uploadCount);
    const allowed = uploadCount < UPLOAD_LIMITS.DAILY_PER_BUCKET;

    return {
      allowed,
      remaining,
      message: allowed 
        ? undefined 
        : `Upload limit reached (${UPLOAD_LIMITS.DAILY_PER_BUCKET} per day). Try again tomorrow.`,
    };
  },

  async uploadFile(params: {
    file: File;
    bucket: string;
    userId: string;
    path?: string;
    allowedTypes?: string[];
  }): Promise<string> {
    const { file, bucket, userId, path, allowedTypes } = params;

    const limitCheck = await this.canUpload(userId, bucket);
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.message || 'Upload limit reached');
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > UPLOAD_LIMITS.MAX_FILE_SIZE_MB) {
      throw new Error(`File too large (max ${UPLOAD_LIMITS.MAX_FILE_SIZE_MB}MB)`);
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }

    const timestamp = Date.now();
    const fileName = path || `${userId}/${timestamp}-${file.name}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: bucket === STORAGE_BUCKETS.AVATARS,
      });

    if (error) throw error;

    await supabase.from('upload_logs').insert({
      user_id: userId,
      bucket,
      file_size: file.size,
      ip_address: null,
    });

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const extension = file.name.split('.').pop();
    return this.uploadFile({
      file,
      bucket: STORAGE_BUCKETS.AVATARS,
      userId,
      path: `${userId}/avatar.${extension}`,
      allowedTypes: UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES,
    });
  },

  async uploadTaskOutput(userId: string, file: File): Promise<string> {
    return this.uploadFile({
      file,
      bucket: STORAGE_BUCKETS.REVIEW_OUTPUTS,
      userId,
      allowedTypes: [
        ...UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES,
        ...UPLOAD_LIMITS.ALLOWED_DOCUMENT_TYPES,
      ],
    });
  },

  async uploadPortfolioImage(userId: string, file: File): Promise<string> {
    return this.uploadFile({
      file,
      bucket: STORAGE_BUCKETS.PORTFOLIO_IMAGES,
      userId,
      allowedTypes: UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES,
    });
  },

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  },
};
