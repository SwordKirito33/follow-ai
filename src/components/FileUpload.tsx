import { useState, useRef } from 'react';
import { Upload, X, FileIcon, Image, Video, File } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FileUploadProps {
  bucket: 'review-outputs' | 'user-avatars' | 'portfolio-images';
  path?: string;
  accept?: string;
  maxSize?: number; // in MB
  onUploadComplete?: (url: string, path: string) => void;
  onUploadError?: (error: Error) => void;
}

export default function FileUpload({
  bucket,
  path = '',
  accept = '*/*',
  maxSize = 10,
  onUploadComplete,
  onUploadError,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    return File;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      const error = new Error(`File size must be less than ${maxSize}MB`);
      onUploadError?.(error);
      alert(error.message);
      return;
    }

    setFileName(file.name);

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const filePath = path
        ? `${path}/${user.id}/${timestamp}.${fileExt}`
        : `${user.id}/${timestamp}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setProgress(100);
      onUploadComplete?.(publicUrl, data.path);

      // Log upload
      await supabase.from('upload_logs').insert({
        user_id: user.id,
        bucket_name: bucket,
        file_path: data.path,
        file_size: file.size,
        file_type: file.type,
      });
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error as Error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setPreview(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {!fileName ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-purple-500 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <div className="text-lg font-semibold text-gray-300 mb-2">
              Click to upload
            </div>
            <div className="text-sm text-gray-500">
              Max file size: {maxSize}MB
            </div>
          </div>
        </button>
      ) : (
        <div className="border-2 border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center flex-1">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
              ) : (
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                  <FileIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">
                  {fileName}
                </div>
                <div className="text-sm text-gray-500">
                  {uploading ? `Uploading... ${progress}%` : 'Upload complete'}
                </div>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={clearFile}
                className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {uploading && (
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
