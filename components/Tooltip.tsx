import React, { ReactNode } from 'react';

interface Props {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
}

const Tooltip: React.FC<Props> = ({ content, children, position = 'top' }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div 
        className={`absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 bg-gray-900 text-white text-xs py-1 px-2 rounded w-max max-w-[200px] text-center pointer-events-none left-1/2 transform -translate-x-1/2 ${
          position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}
      >
        {content}
        {/* Arrow */}
        <div 
          className={`absolute left-1/2 transform -translate-x-1/2 border-4 border-transparent ${
            position === 'top' ? 'border-t-gray-900 top-full' : 'border-b-gray-900 bottom-full'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default Tooltip;