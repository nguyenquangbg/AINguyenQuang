import React from 'react';

interface GenerationProgressProps {
  progress: number;
  message: string;
  onStop: () => void;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({ progress, message, onStop }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg mb-4 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{message}</p>
        <p className="text-sm font-mono text-slate-500 dark:text-slate-400">{Math.round(progress)}%</p>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
        <div 
          className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4">
          <button 
            onClick={onStop} 
            className="w-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-100 text-center font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-sm"
          >
            Dừng tạo ảnh
          </button>
      </div>
    </div>
  );
};
