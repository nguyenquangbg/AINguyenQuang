import React from 'react';
import type { ReferenceMode } from './types';

interface ReferenceModeSelectorProps {
  mode: ReferenceMode;
  setMode: (mode: ReferenceMode) => void;
}

export const ReferenceModeSelector: React.FC<ReferenceModeSelectorProps> = ({ mode, setMode }) => {
  return (
    <div className="flex bg-slate-200 dark:bg-slate-700/50 rounded-lg p-1">
      <button
        onClick={() => setMode('concept')}
        className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors ${
          mode === 'concept' ? 'bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50'
        }`}
      >
        Dùng Concept
      </button>
      <button
        onClick={() => setMode('style')}
        className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors ${
          mode === 'style' ? 'bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50'
        }`}
      >
        Dùng Ảnh
      </button>
    </div>
  );
};
