import React from 'react';

interface ProgressBarProps {
  message: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ message }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-800/80 rounded-lg z-10 p-4">
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
        <div className="bg-blue-600 h-2.5 rounded-full animate-progress"></div>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">{message}</p>
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
};
