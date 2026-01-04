import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Bot, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AchievementNotification from '@/components/AchievementNotification';
import SocialShareModal from '@/components/SocialShareModal';
import { Achievement } from '@/types';
import FollowButton from '@/components/ui/follow-button';

const SubmitReview: React.FC = () => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFlags, setAiFlags] = useState<string[]>([]);
  const [manualReviewRequested, setManualReviewRequested] = useState(false);
  
  // Modals state
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Helper function to properly count characters including Chinese characters
  const getCharacterCount = (text: string): number => {
    return Array.from(text.trim()).length;
  };
  
  const characterCount = getCharacterCount(reviewText);
  const MIN_CHARACTERS = 100;
  const meetsRequirements = !!file && analysisComplete && qualityScore !== null && characterCount >= MIN_CHARACTERS;
  const canSubmit = meetsRequirements && !isSubmitting;

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
      const simulated = 8.7;
      setQualityScore(simulated);
      setAnalysisComplete(true);
      const flags: string[] = [];
      if (simulated < 7.5) flags.push(t('submitReview.lowQualityScore'));
      if (!file?.type.startsWith('image') && !file?.name.match(/\.(py|js|jsx|tsx|html|css|pdf)$/)) {
        flags.push(t('submitReview.uncommonFileType'));
      }
      if (getCharacterCount(reviewText) < 400) {
        flags.push(t('submitReview.shortNarrative'));
      }
      setAiFlags(flags);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetsRequirements) return;

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
    <div className="min-h-screen bg-slate-800/50/5 dark:bg-gray-950 py-12 px-4">
      {/* Components for "Black Tech" interactions */}
      <AchievementNotification achievement={achievement} onClose={() => setAchievement(null)} />
      <SocialShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        toolName="Cursor" 
        rating={5} 
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white dark:text-white tracking-tight mb-2">
            {t('submitReview.title')}
          </h1>
          <p className="text-lg text-gray-400 dark:text-gray-400 font-medium">
            {t('submitReview.subtitle')}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-300 dark:text-gray-300">
              Submission Progress
            </span>
            <span className="text-sm text-gray-400 dark:text-gray-400">
              {[
                file ? 1 : 0,
                analysisComplete ? 1 : 0,
                characterCount >= MIN_CHARACTERS ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}/3 Complete
            </span>
          </div>
          <div className="w-full bg-slate-800/50/10 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-blue to-primary-purple h-2 rounded-full transition-all duration-300"
              style={{
                width: `${([
                  file ? 1 : 0,
                  analysisComplete ? 1 : 0,
                  characterCount >= MIN_CHARACTERS ? 1 : 0,
                ].reduce((a, b) => a + b, 0) / 3) * 100}%`,
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tool Selection */}
               <div className="glass-card p-6 rounded-xl shadow-xl">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              {t('submitReview.toolSelection')}
            </label>
            <select className="w-full p-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">{t('submitReview.selectTool')}</option>
              <option value="cursor">Cursor</option>
              <option value="claude">Claude 3.5 Sonnet</option>
              <option value="midjourney">Midjourney</option>
            </select>
          </div>

          {/* Mandatory Upload Section - BLACK TECH #1 Integration */}
               <div className="glass-card p-6 rounded-xl shadow-xl">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              {t('submitReview.uploadWork')} <span className="text-red-500">{t('submitReview.mandatory')}</span>
            </label>
            <p className="text-xs text-gray-400 mb-4">{t('submitReview.mandatoryNote')}</p>

            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative overflow-hidden ${
                file ? 'border-green-300 bg-green-50' : 'border-white/20 hover:border-blue-400 bg-slate-800/50/5'
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
                  <p className="text-sm font-medium text-gray-400">{t('submitReview.clickToUpload')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('submitReview.fileTypes')}</p>
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                 <div className="w-full">
                    <p className="text-sm font-bold text-primary-cyan mb-2">{t('submitReview.uploading')} {uploadProgress}%</p>
                    <div className="w-full bg-slate-800/50/10 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-primary-cyan to-primary-blue h-2.5 rounded-full transition-all duration-100" style={{ width: `${uploadProgress}%` }}></div>
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
                    {t('submitReview.remove')}
                  </button>
                </div>
              )}
            </div>

            {/* AI Quality Analysis Display */}
            {analyzing && (
               <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-3">
                 <Loader2 className="animate-spin text-primary-cyan" size={20} />
                 <span className="text-sm font-medium text-primary-blue">{t('submitReview.analyzing')}</span>
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
                        <h4 className="font-bold text-sm uppercase tracking-wide text-blue-200">{t('submitReview.aiQualityAnalysis')}</h4>
                    </div>
                    
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-bold text-green-400">{qualityScore}</span>
                        <span className="text-gray-400 text-lg mb-1">/ 10</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-800/50/10 p-2 rounded flex justify-between">
                            <span>{t('submitReview.complexity')}</span>
                            <span className="text-green-300 font-bold">{t('submitReview.high')}</span>
                        </div>
                        <div className="bg-slate-800/50/10 p-2 rounded flex justify-between">
                            <span>{t('submitReview.originality')}</span>
                            <span className="text-blue-300 font-bold">98%</span>
                        </div>
                        <div className="bg-slate-800/50/10 p-2 rounded flex justify-between">
                            <span>{t('submitReview.metadata')}</span>
                            <span className="text-green-300 font-bold">{t('submitReview.verified')}</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 italic">
                        "{t('submitReview.greatWork')}"
                    </p>
                  {aiFlags.length > 0 && (
                    <div className="mt-3 bg-slate-800/50/10 border border-white/20 rounded-lg p-3 text-xs space-y-1">
                      <div className="flex items-center gap-2 text-amber-200 font-semibold">
                        <ShieldAlert size={14} /> {t('submitReview.aiFlagsTitle')}
                      </div>
                      <ul className="list-disc list-inside text-amber-100">
                        {aiFlags.map((flag, idx) => <li key={idx}>{flag}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Review Text */}
          <div className="glass-card p-6 rounded-xl shadow-xl">
            <label className="block text-sm font-bold text-gray-300 dark:text-gray-300 mb-2">
              {t('submitReview.yourExperience')} <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 dark:text-gray-300 mb-3">
              Describe your experience using the tool. Include the prompt you used, what you expected, 
              and what you actually got. Be specific and honest.
            </p>
            <textarea 
              className="w-full p-4 border border-white/20 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-40 bg-slate-800/50 dark:bg-gray-800 text-white dark:text-white resize-y"
              placeholder={t('submitReview.experiencePlaceholder')}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            ></textarea>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-gray-400 dark:text-gray-300">
                {t('submitReview.minimumWords').replace('{count}', MIN_CHARACTERS.toString())}
              </span>
              <span className={characterCount < MIN_CHARACTERS ? "text-red-500 font-semibold" : "text-accent-green font-semibold"}>
                {characterCount} / {MIN_CHARACTERS} {t('submitReview.words')}
              </span>
            </div>
          </div>
          
          {/* Additional Context (Optional) */}
          <div className="glass-card p-6 rounded-xl shadow-xl">
            <label className="block text-sm font-bold text-gray-300 dark:text-gray-300 mb-2">
              Additional Context (Optional)
            </label>
            <textarea 
              className="w-full p-4 border border-white/20 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-32 bg-slate-800/50 dark:bg-gray-800 text-white dark:text-white resize-y"
              placeholder="Any additional context, constraints, or goals you had when using the tool..."
            ></textarea>
          </div>

        <div className="bg-slate-800/50 rounded-xl border border-white/10 p-4 space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-300">
            <ShieldCheck size={18} className="text-accent-green mt-0.5" />
            <div>
              <p className="font-semibold text-white">{t('submitReview.verificationChecklist')}</p>
              <ul className="list-disc list-inside text-xs text-gray-400 space-y-1 mt-1">
                <li className={file ? 'text-gray-300' : 'text-red-600'}>{t('submitReview.outputUploaded')}</li>
                <li className={analysisComplete ? 'text-gray-300' : 'text-red-600'}>{t('submitReview.aiAnalysisCompleted')}</li>
                <li className={characterCount >= MIN_CHARACTERS ? 'text-gray-300' : 'text-red-600'}>{t('submitReview.narrativeWords').replace('{count}', MIN_CHARACTERS.toString())}</li>
                <li className={qualityScore && qualityScore >= 5 ? 'text-gray-300' : 'text-red-600'}>{t('submitReview.qualityScoreMin')}</li>
              </ul>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={manualReviewRequested}
              onChange={(e) => setManualReviewRequested(e.target.checked)}
            />
            {t('submitReview.requestManualReviewer')}
          </label>
        </div>

        <div className="flex flex-col gap-4 items-stretch">
          <FollowButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={!canSubmit}
            isLoading={isSubmitting}
            className="w-full"
          >
            Submit output
          </FollowButton>
          
          {!canSubmit && (
            <div className="flex items-start gap-3 text-sm glass-card rounded-xl p-4 border-l-4 border-amber-500">
              <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-black text-white dark:text-white">{t('submitReview.completeSteps')}</p>
                <ul className="space-y-1.5">
                  <li className={`flex items-center gap-2 ${
                    file ? "text-gray-300 dark:text-gray-300" : "text-red-600 dark:text-red-400"
                  }`}>
                    <span className={file ? "text-accent-green" : "text-red-500"}>
                      {file ? '✓' : '✗'}
                    </span>
                    {t('submitReview.uploadFile')}
                  </li>
                  <li className={`flex items-center gap-2 ${
                    analysisComplete && qualityScore !== null ? "text-gray-300 dark:text-gray-300" : "text-red-600 dark:text-red-400"
                  }`}>
                    <span className={analysisComplete && qualityScore !== null ? "text-accent-green" : "text-red-500"}>
                      {analysisComplete && qualityScore !== null ? '✓' : '✗'}
                    </span>
                    {t('submitReview.waitAnalysis')}
                  </li>
                  <li className={`flex items-center gap-2 ${
                    characterCount >= MIN_CHARACTERS ? "text-gray-300 dark:text-gray-300" : "text-red-600 dark:text-red-400"
                  }`}>
                    <span className={characterCount >= MIN_CHARACTERS ? "text-accent-green" : "text-red-500"}>
                      {characterCount >= MIN_CHARACTERS ? '✓' : '✗'}
                    </span>
                    {t('submitReview.writeWords').replace('{count}', MIN_CHARACTERS.toString())}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
          
        </form>
      </div>
    </div>
  );
};

export default SubmitReview;