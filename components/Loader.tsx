import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 bg-opacity-75 rounded-lg z-10">
      <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-semibold text-slate-600">AI đang xử lý ảnh của bạn...</p>
      <p className="mt-1 text-xs text-slate-500">Quá trình này có thể mất một lúc.</p>
    </div>
  );
};