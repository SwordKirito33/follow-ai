import React, { useState } from 'react';
import { X, Plus, Star, TrendingUp, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TOOLS } from '@/data';

interface ToolComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

const ToolComparison: React.FC<ToolComparisonProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [showToolSelector, setShowToolSelector] = useState(false);

  const availableTools = TOOLS.filter(tool => !selectedTools.includes(tool.id));

  const addTool = (toolId: string) => {
    if (selectedTools.length < 4 && !selectedTools.includes(toolId)) {
      setSelectedTools([...selectedTools, toolId]);
      setShowToolSelector(false);
    }
  };

  const removeTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter(id => id !== toolId));
  };

  const comparedTools = TOOLS.filter(tool => selectedTools.includes(tool.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-primary-blue to-primary-purple text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold">{t('comparison.title')}</h2>
          <p className="text-sm text-blue-100 mt-1">{t('comparison.subtitle')}</p>
        </div>

        {/* Tool Selector */}
        <div className="p-6 border-b border-white/10 relative">
          <div className="flex items-center gap-4 flex-wrap">
            {comparedTools.map(tool => (
              <div key={tool.id} className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg">
                <img loading="lazy" src={tool.logo} alt={tool.name} className="w-8 h-8 rounded" />
                <span className="font-semibold text-sm">{tool.name}</span>
                <button
                  onClick={() => removeTool(tool.id)}
                  className="text-gray-400 hover:text-gray-400"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {selectedTools.length < 4 && (
              <div className="relative">
                <button
                  onClick={() => setShowToolSelector(!showToolSelector)}
                  className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg border-2 border-dashed border-white/20 hover:border-blue-500 transition-colors"
                >
                  <Plus size={20} />
                  <span className="text-sm font-medium">{t('comparison.addTool')}</span>
                </button>

                {showToolSelector && (
                  <div className="absolute top-full left-0 mt-2 glass-card rounded-xl p-4 shadow-xl z-10 max-h-60 overflow-y-auto w-64">
                    {availableTools.length === 0 ? (
                      <p className="text-sm text-gray-400">{t('comparison.noMoreTools')}</p>
                    ) : (
                      <div className="space-y-2">
                        {availableTools.map(tool => (
                          <button
                            key={tool.id}
                            onClick={() => addTool(tool.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                          >
                            <img loading="lazy" src={tool.logo} alt={tool.name} className="w-8 h-8 rounded" />
                            <div>
                              <div className="font-semibold text-sm">{tool.name}</div>
                              <div className="text-xs text-gray-400">{tool.category}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        {comparedTools.length > 0 && (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-white/10">
                  <th className="pb-3 pr-4 font-semibold text-gray-300">{t('comparison.feature')}</th>
                  {comparedTools.map(tool => (
                    <th key={tool.id} className="pb-3 pr-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <img loading="lazy" src={tool.logo} alt={tool.name} className="w-12 h-12 rounded-xl" />
                        <span className="font-bold text-sm">{tool.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-4 pr-4 font-medium">{t('comparison.rating')}</td>
                  {comparedTools.map(tool => (
                    <td key={tool.id} className="py-4 pr-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-amber-500">
                        <Star size={16} fill="currentColor" />
                        <span className="font-bold">{tool.rating}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 pr-4 font-medium">{t('comparison.reviews')}</td>
                  {comparedTools.map(tool => (
                    <td key={tool.id} className="py-4 pr-4 text-center font-semibold">
                      {tool.reviewCount}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 pr-4 font-medium">{t('comparison.growth')}</td>
                  {comparedTools.map(tool => (
                    <td key={tool.id} className="py-4 pr-4 text-center">
                      <span className="text-accent-green font-semibold flex items-center justify-center gap-1">
                        <TrendingUp size={14} />
                        {tool.growth}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 pr-4 font-medium">{t('comparison.category')}</td>
                  {comparedTools.map(tool => (
                    <td key={tool.id} className="py-4 pr-4 text-center">
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{tool.category}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium">{t('comparison.useCases')}</td>
                  {comparedTools.map(tool => (
                    <td key={tool.id} className="py-4 pr-4 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {tool.useCases?.slice(0, 3).map((uc, idx) => (
                          <span key={idx} className="text-xs bg-blue-50 text-primary-blue px-2 py-0.5 rounded">
                            {uc}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {comparedTools.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">{t('comparison.selectTools')}</p>
            <button
              onClick={() => setShowToolSelector(true)}
              className="bg-gradient-to-r from-primary-cyan to-primary-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('comparison.addFirstTool')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolComparison;

