import { useState, useRef } from 'react';
import { Upload, X, FileIcon, Image, Video, File } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { validateFile, generateSafeFileName, uploadFile as uploadFileUtil, UploadBucket } from '@/lib/upload';

interface FileUploadProps {
  bucket: UploadBucket;
  path?: string;
  accept?: string;
  onUploadComplete?: (url: string, path: string) => void;
  onUploadError?: (error: Error) => void;
}

export default function FileUpload({
  bucket,
  path = '',
  accept = '*/*',
  onUploadComplete,
  onUploadError,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileType: string) => {
  const { t } = useLanguage();
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    return File;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file, bucket);
    if (!validation.valid) {
      const error = new Error(validation.error);
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
      const uploadPath = path || 'uploads';
      const { url, path: filePath } = await uploadFileUtil(file, bucket, uploadPath);

      setProgress(100);
      onUploadComplete?.(url, filePath);

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
            <div className="text-sm text-gray-400">
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
                <div className="w-16 h-16 bg-gray-800/10 rounded-lg flex items-center justify-center mr-4">
                  <FileIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">
                  {fileName}
                </div>
                <div className="text-sm text-gray-400">
                  {uploading ? `Uploading... ${progress}%` : 'Upload complete'}
                </div>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={clearFile}
                className="ml-4 p-2 hover:bg-gray-800/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {uploading && (
            <div className="w-full bg-gray-800/10 rounded-full h-2">
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
