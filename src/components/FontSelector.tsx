import React, { useState, useRef, useEffect } from 'react';
import { Type, Check, ChevronDown } from 'lucide-react';

export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display';
  googleFont?: string;
}

const FONT_OPTIONS: FontOption[] = [
  // Sans-serif fonts
  { id: 'inter', name: 'Inter', family: 'Inter, sans-serif', category: 'sans-serif', googleFont: 'Inter:wght@400;500;600;700;800;900' },
  { id: 'roboto', name: 'Roboto', family: 'Roboto, sans-serif', category: 'sans-serif', googleFont: 'Roboto:wght@400;500;700' },
  { id: 'open-sans', name: 'Open Sans', family: '"Open Sans", sans-serif', category: 'sans-serif', googleFont: 'Open+Sans:wght@400;500;600;700' },
  { id: 'lato', name: 'Lato', family: 'Lato, sans-serif', category: 'sans-serif', googleFont: 'Lato:wght@400;700' },
  { id: 'poppins', name: 'Poppins', family: 'Poppins, sans-serif', category: 'sans-serif', googleFont: 'Poppins:wght@400;500;600;700' },
  { id: 'nunito', name: 'Nunito', family: 'Nunito, sans-serif', category: 'sans-serif', googleFont: 'Nunito:wght@400;600;700' },
  { id: 'montserrat', name: 'Montserrat', family: 'Montserrat, sans-serif', category: 'sans-serif', googleFont: 'Montserrat:wght@400;500;600;700' },
  
  // Serif fonts
  { id: 'merriweather', name: 'Merriweather', family: 'Merriweather, serif', category: 'serif', googleFont: 'Merriweather:wght@400;700' },
  { id: 'playfair', name: 'Playfair Display', family: '"Playfair Display", serif', category: 'serif', googleFont: 'Playfair+Display:wght@400;500;600;700' },
  { id: 'lora', name: 'Lora', family: 'Lora, serif', category: 'serif', googleFont: 'Lora:wght@400;500;600;700' },
  
  // Monospace fonts
  { id: 'fira-code', name: 'Fira Code', family: '"Fira Code", monospace', category: 'monospace', googleFont: 'Fira+Code:wght@400;500;600' },
  { id: 'jetbrains', name: 'JetBrains Mono', family: '"JetBrains Mono", monospace', category: 'monospace', googleFont: 'JetBrains+Mono:wght@400;500;600' },
  
  // Display fonts
  { id: 'space-grotesk', name: 'Space Grotesk', family: '"Space Grotesk", sans-serif', category: 'display', googleFont: 'Space+Grotesk:wght@400;500;600;700' },
  { id: 'dm-sans', name: 'DM Sans', family: '"DM Sans", sans-serif', category: 'display', googleFont: 'DM+Sans:wght@400;500;600;700' },
  
  // Chinese fonts
  { id: 'noto-sc', name: 'Noto Sans SC', family: '"Noto Sans SC", sans-serif', category: 'sans-serif', googleFont: 'Noto+Sans+SC:wght@400;500;700' },
  { id: 'noto-tc', name: 'Noto Sans TC', family: '"Noto Sans TC", sans-serif', category: 'sans-serif', googleFont: 'Noto+Sans+TC:wght@400;500;700' },
  
  // Japanese fonts
  { id: 'noto-jp', name: 'Noto Sans JP', family: '"Noto Sans JP", sans-serif', category: 'sans-serif', googleFont: 'Noto+Sans+JP:wght@400;500;700' },
  
  // Korean fonts
  { id: 'noto-kr', name: 'Noto Sans KR', family: '"Noto Sans KR", sans-serif', category: 'sans-serif', googleFont: 'Noto+Sans+KR:wght@400;500;700' },
];

const FONT_SIZE_OPTIONS = [
  { id: 'small', name: 'Small', scale: 0.875 },
  { id: 'medium', name: 'Medium', scale: 1 },
  { id: 'large', name: 'Large', scale: 1.125 },
  { id: 'xlarge', name: 'Extra Large', scale: 1.25 },
];

interface FontSelectorProps {
  className?: string;
}

const FontSelector: React.FC<FontSelectorProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState<FontOption>(FONT_OPTIONS[0]);
  const [selectedSize, setSelectedSize] = useState(FONT_SIZE_OPTIONS[1]);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set(['inter']));
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved preferences
  useEffect(() => {
    const savedFontId = localStorage.getItem('follow-ai-font');
    const savedSizeId = localStorage.getItem('follow-ai-font-size');
    
    if (savedFontId) {
      const font = FONT_OPTIONS.find(f => f.id === savedFontId);
      if (font) {
        setSelectedFont(font);
        loadGoogleFont(font);
        applyFont(font);
      }
    }
    
    if (savedSizeId) {
      const size = FONT_SIZE_OPTIONS.find(s => s.id === savedSizeId);
      if (size) {
        setSelectedSize(size);
        applyFontSize(size);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadGoogleFont = (font: FontOption) => {
    if (loadedFonts.has(font.id) || !font.googleFont) return;
    
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    setLoadedFonts(prev => new Set([...prev, font.id]));
  };

  const applyFont = (font: FontOption) => {
    document.documentElement.style.setProperty('--font-family', font.family);
    document.body.style.fontFamily = font.family;
  };

  const applyFontSize = (size: typeof FONT_SIZE_OPTIONS[0]) => {
    document.documentElement.style.setProperty('--font-scale', size.scale.toString());
    document.documentElement.style.fontSize = `${size.scale * 16}px`;
  };

  const handleFontChange = (font: FontOption) => {
    loadGoogleFont(font);
    setSelectedFont(font);
    applyFont(font);
    localStorage.setItem('follow-ai-font', font.id);
  };

  const handleSizeChange = (size: typeof FONT_SIZE_OPTIONS[0]) => {
    setSelectedSize(size);
    applyFontSize(size);
    localStorage.setItem('follow-ai-font-size', size.id);
  };

  const groupedFonts = FONT_OPTIONS.reduce((acc, font) => {
    if (!acc[font.category]) acc[font.category] = [];
    acc[font.category].push(font);
    return acc;
  }, {} as Record<string, FontOption[]>);

  const categoryLabels: Record<string, string> = {
    'sans-serif': 'Sans Serif',
    'serif': 'Serif',
    'monospace': 'Monospace',
    'display': 'Display',
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50/10 dark:hover:bg-gray-800 transition-colors text-gray-300 dark:text-gray-300"
        aria-label="Font settings"
        aria-expanded={isOpen}
      >
        <Type size={18} />
        <span className="hidden sm:inline text-sm font-medium">{selectedFont.name}</span>
        <ChevronDown 
          size={14} 
          className={`hidden sm:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/10 dark:border-gray-700 py-2 z-50 animate-fadeIn">
          {/* Font Size Section */}
          <div className="px-3 py-2 border-b border-white/10 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider mb-2">
              Font Size
            </p>
            <div className="flex gap-1">
              {FONT_SIZE_OPTIONS.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleSizeChange(size)}
                  className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedSize.id === size.id
                      ? 'bg-primary-blue/20 dark:bg-blue-900/30 text-primary-cyan dark:text-blue-400'
                      : 'hover:bg-slate-800/50/10 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-400'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family Section */}
          <div className="max-h-[300px] overflow-y-auto py-1">
            {Object.entries(groupedFonts).map(([category, fonts]) => (
              <div key={category}>
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                    {categoryLabels[category]}
                  </p>
                </div>
                {fonts.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => handleFontChange(font)}
                    onMouseEnter={() => loadGoogleFont(font)}
                    className={`w-full flex items-center justify-between px-4 py-2 hover:bg-slate-800/50/5 dark:hover:bg-gray-800 transition-colors text-left ${
                      selectedFont.id === font.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <span 
                      className="text-sm text-white dark:text-gray-100"
                      style={{ fontFamily: loadedFonts.has(font.id) ? font.family : 'inherit' }}
                    >
                      {font.name}
                    </span>
                    {selectedFont.id === font.id && (
                      <Check size={16} className="text-primary-cyan dark:text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSelector;
