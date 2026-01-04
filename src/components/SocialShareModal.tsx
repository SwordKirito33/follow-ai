import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  rating: number;
}

const SocialShareModal: React.FC<Props> = ({ isOpen, onClose, toolName, rating }) => {
  const [activeTab, setActiveTab] = useState<'twitter' | 'linkedin' | 'reddit'>('twitter');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = {
    twitter: `🧵 Just tested ${toolName} for 2 hours. Here's what I found:\n\n1/5 Built a real project from scratch. The output quality is surprisingly high.\n2/5 Most impressive feature: context awareness.\n3/5 Rating: ${'⭐'.repeat(Math.floor(rating))}/5.\n\nSee my full review & proof of work on Follow.ai #AI #${toolName.replace(/\s/g, '')}`,
    linkedin: `Why ${toolName} is changing my workflow.\n\nAfter intensive testing, I can confidently say ${toolName} delivers. I built a production-ready asset in under 30 minutes.\n\nKey takeaways:\n• High accuracy\n• Saved 2h of work\n\nCheck out the actual outputs in my verified review on Follow.ai.\n\n#ArtificialIntelligence #TechReview #Productivity`,
    reddit: `[Review] I tested ${toolName} - Here's my honest take with proof.\n\nI spent the afternoon putting ${toolName} through its paces. TL;DR: It's legit.\n\nPros: Fast, Accurate.\nCons: Slight learning curve.\n\nVerdict: ${rating}/10.\n\nFull breakdown + outputs: [Link to Follow.ai]`
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="bg-green-50 p-6 border-b border-green-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">🎉 Review Submitted!</h2>
              <p className="text-green-700 font-medium">Potential earnings: <span className="font-bold">$35</span> (pending verification)</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-400 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            📢 Share to Boost Your Reputation
            <span className="text-xs font-normal text-white bg-gradient-to-r from-primary-cyan to-primary-blue px-2 py-0.5 rounded-full">AI Generated</span>
          </h3>
          
          <div className="flex gap-2 mb-4 border-b border-white/10 pb-1">
            {['twitter', 'linkedin', 'reddit'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors capitalize ${
                  activeTab === tab 
                  ? 'bg-white/10 text-white border-b-2 border-blue-600' 
                  : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6 font-mono text-sm text-gray-300 whitespace-pre-wrap">
            {content[activeTab]}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => handleCopy(content[activeTab])}
              className="flex-1 bg-gradient-to-r from-primary-cyan to-primary-blue hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-3 border border-white/10 font-bold text-gray-400 rounded-xl hover:bg-white/5 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShareModal;