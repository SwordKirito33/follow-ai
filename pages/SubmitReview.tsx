import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Bot, Loader2 } from 'lucide-react';
import AchievementNotification from '../components/AchievementNotification';
import SocialShareModal from '../components/SocialShareModal';
import { Achievement } from '../types';

const SubmitReview: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modals state
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(null); // Reset
      setUploadProgress(0);
      
      // Simulate Upload Progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setFile(selectedFile);
            runAnalysis();
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulate AI Analysis
    setTimeout(() => {
      setAnalyzing(false);
      setQualityScore(8.7);
      setAnalysisComplete(true);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !qualityScore || reviewText.length < 100) return;

    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
        setIsSubmitting(false);
        // Unlock achievement
        setAchievement({
            id: 'first_review',
            name: 'First Steps',
            description: 'Submitted your first review',
            icon: '🏆'
        });

        // Show share modal after a delay
        setTimeout(() => {
            setShowShareModal(true);
        }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Components for "Black Tech" interactions */}
      <AchievementNotification achievement={achievement} onClose={() => setAchievement(null)} />
      <SocialShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        toolName="Cursor" 
        rating={5} 
      />

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit a Review</h1>
          <p className="text-gray-600">Share your real experience. Get paid.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tool Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Which AI tool are you reviewing?
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">Select a tool...</option>
              <option value="cursor">Cursor</option>
              <option value="claude">Claude 3.5 Sonnet</option>
              <option value="midjourney">Midjourney</option>
            </select>
          </div>

          {/* Mandatory Upload Section - BLACK TECH #1 Integration */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Upload Your Work Output <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-4">Mandatory. No output, no review.</p>

            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative overflow-hidden ${
                file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'
              }`}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*,.pdf,.py,.js"
              />
              
              {!file && uploadProgress === 0 && (
                <div className="cursor-pointer">
                  <UploadCloud className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-600">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-1">Code files, Images, Videos (Max 50MB)</p>
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                 <div className="w-full">
                    <p className="text-sm font-bold text-blue-600 mb-2">Uploading... {uploadProgress}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-100" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                 </div>
              )}

              {file && (
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle size={20} />
                  <span className="font-medium">{file.name}</span>
                  <button 
                    type="button" 
                    className="ml-4 text-xs text-red-500 underline hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setAnalysisComplete(false);
                      setQualityScore(null);
                      setUploadProgress(0);
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* AI Quality Analysis Display */}
            {analyzing && (
               <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-3">
                 <Loader2 className="animate-spin text-blue-600" size={20} />
                 <span className="text-sm font-medium text-blue-700">AI Analyzing output complexity & authenticity...</span>
               </div>
            )}

            {analysisComplete && qualityScore && (
              <div className="mt-4 animate-slide-in">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Bot size={100} />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <Bot size={20} className="text-blue-400" />
                        <h4 className="font-bold text-sm uppercase tracking-wide text-blue-200">AI Quality Analysis</h4>
                    </div>
                    
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-bold text-green-400">{qualityScore}</span>
                        <span className="text-gray-400 text-lg mb-1">/ 10</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/10 p-2 rounded flex justify-between">
                            <span>Complexity</span>
                            <span className="text-green-300 font-bold">High</span>
                        </div>
                        <div className="bg-white/10 p-2 rounded flex justify-between">
                            <span>Originality</span>
                            <span className="text-blue-300 font-bold">98%</span>
                        </div>
                        <div className="bg-white/10 p-2 rounded flex justify-between">
                            <span>Metadata</span>
                            <span className="text-green-300 font-bold">Verified</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 italic">
                        "Great work! Your output demonstrates advanced usage of the tool."
                    </p>
                </div>
              </div>
            )}
          </div>

          {/* Review Text */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <label className="block text-sm font-bold text-gray-700 mb-2">
              Your Experience
            </label>
            <textarea 
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-40"
              placeholder="What did you create? How was the process?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Minimum 100 words</span>
                <span className={reviewText.split(" ").filter(w => w.length > 0).length < 100 ? "text-red-500" : "text-green-600"}>
                    {reviewText.split(" ").filter(w => w.length > 0).length} words
                </span>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <button 
              type="submit" 
              disabled={!file || !analysisComplete || isSubmitting}
              className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 ${
                !file || !analysisComplete || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Submitting Review...
                  </>
              ) : (
                  "Submit Review"
              )}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default SubmitReview;