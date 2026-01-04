import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  Image,
  FileText,
  Link2,
  Check,
  AlertCircle,
  Loader2,
  Paperclip,
  Star,
  MessageSquare,
} from 'lucide-react';

interface TaskSubmissionFormProps {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  requiredFields: {
    screenshots: boolean;
    feedback: boolean;
    rating: boolean;
    url: boolean;
  };
  onSubmit: (data: SubmissionData) => Promise<void>;
  onCancel: () => void;
}

interface SubmissionData {
  taskId: string;
  feedback: string;
  rating: number;
  url?: string;
  screenshots: File[];
}

const TaskSubmissionForm: React.FC<TaskSubmissionFormProps> = ({
  taskId,
  taskTitle,
  taskDescription,
  requiredFields,
  onSubmit,
  onCancel,
}) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [url, setUrl] = useState('');
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        if (screenshots.length + newFiles.length < 5) {
          newFiles.push(file);
          newPreviews.push(URL.createObjectURL(file));
        }
      }
    });

    setScreenshots([...screenshots, ...newFiles]);
    setPreviews([...previews, ...newPreviews]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeScreenshot = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setScreenshots(screenshots.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (requiredFields.feedback && feedback.trim().length < 50) {
      newErrors.feedback = 'Feedback must be at least 50 characters';
    }

    if (requiredFields.rating && rating === 0) {
      newErrors.rating = 'Please provide a rating';
    }

    if (requiredFields.url && !url.trim()) {
      newErrors.url = 'URL is required';
    } else if (url && !isValidUrl(url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    if (requiredFields.screenshots && screenshots.length === 0) {
      newErrors.screenshots = 'At least one screenshot is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        taskId,
        feedback: feedback.trim(),
        rating,
        url: url.trim() || undefined,
        screenshots,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = feedback.length;
  const minCharacters = 50;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-blue to-primary-purple p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">Submit Task</h2>
              <p className="text-blue-100 mt-1 line-clamp-1">{taskTitle}</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Task description */}
          <div className="p-4 bg-white/5 dark:bg-gray-800 rounded-xl">
            <p className="text-sm text-gray-400 dark:text-gray-400">
              {taskDescription}
            </p>
          </div>

          {/* Rating */}
          {requiredFields.rating && (
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                Rate this AI tool {requiredFields.rating && <span className="text-red-500">*</span>}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.rating}
                </p>
              )}
            </div>
          )}

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Your Feedback {requiredFields.feedback && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with this AI tool. What did you like? What could be improved?"
              rows={5}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 text-white dark:text-white focus:outline-none resize-none transition-colors ${
                errors.feedback
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white/10 dark:border-gray-700 focus:border-blue-500'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.feedback ? (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.feedback}
                </p>
              ) : (
                <span />
              )}
              <span
                className={`text-sm ${
                  characterCount >= minCharacters
                    ? 'text-accent-green'
                    : 'text-gray-400'
                }`}
              >
                {characterCount}/{minCharacters} characters
              </span>
            </div>
          </div>

          {/* URL */}
          {requiredFields.url && (
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                <Link2 className="w-4 h-4 inline mr-1" />
                Related URL {requiredFields.url && <span className="text-red-500">*</span>}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 text-white dark:text-white focus:outline-none transition-colors ${
                  errors.url
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/10 dark:border-gray-700 focus:border-blue-500'
                }`}
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.url}
                </p>
              )}
            </div>
          )}

          {/* Screenshots */}
          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
              <Image className="w-4 h-4 inline mr-1" />
              Screenshots {requiredFields.screenshots && <span className="text-red-500">*</span>}
              <span className="text-gray-400 font-normal ml-1">(max 5)</span>
            </label>

            {/* Drop zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : errors.screenshots
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-white/20 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-400 dark:text-gray-400">
                Drag and drop images here, or click to select
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>

            {errors.screenshots && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.screenshots}
              </p>
            )}

            {/* Preview grid */}
            {previews.length > 0 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 dark:border-gray-700 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border-2 border-white/20 dark:border-gray-600 text-gray-300 dark:text-gray-300 rounded-xl font-medium hover:bg-white/5 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Submit Task
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskSubmissionForm;
