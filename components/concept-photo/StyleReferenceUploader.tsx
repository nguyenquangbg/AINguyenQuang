import React, { useState, useRef, useEffect } from 'react';
import { UploadIcon } from '../icons/UploadIcon';

interface StyleReferenceUploaderProps {
  onFileChange: (file: File | null) => void;
  outfitPrompt: string;
  onOutfitPromptChange: (text: string) => void;
  stylePrompt: string;
  onStylePromptChange: (text: string) => void;
  stylePreviewUrl: string | null;
}

export const StyleReferenceUploader: React.FC<StyleReferenceUploaderProps> = ({ 
    onFileChange, 
    outfitPrompt, 
    onOutfitPromptChange, 
    stylePrompt, 
    onStylePromptChange,
    stylePreviewUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'upload'>('prompt');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If an image is uploaded externally (from the parent), switch to the upload tab
    if(stylePreviewUrl) {
      setActiveTab('upload');
    }
  }, [stylePreviewUrl]);

  const handleFileChangeInternal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
      setActiveTab('upload');
    }
  };

  const handleOutfitChangeInternal = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    onOutfitPromptChange(text);
    if (text) {
      onFileChange(null);
      setActiveTab('prompt');
    }
  };
  
  const handleStyleChangeInternal = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    onStylePromptChange(text);
    if (text) {
      onFileChange(null);
      setActiveTab('prompt');
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex bg-slate-200 dark:bg-slate-700/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors ${
            activeTab === 'prompt' ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50'
          }`}
        >
          Nhập Mô Tả
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors ${
            activeTab === 'upload' ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50'
          }`}
        >
          Tải Ảnh
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div
          onClick={handleClick}
          className="w-full aspect-video border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700/50 transition-colors relative"
        >
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChangeInternal}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          {stylePreviewUrl ? (
            <img src={stylePreviewUrl} alt="Style reference preview" className="w-full h-full object-contain rounded-md" />
          ) : (
            <div className="text-slate-500 dark:text-slate-400">
              <UploadIcon className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
              <p className="font-semibold text-sm">Tải ảnh tham chiếu</p>
              <p className="text-xs mt-1">AI sẽ học phong cách từ ảnh này.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
            <div>
                <label htmlFor="outfit-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trang phục (quan trọng)</label>
                <textarea
                    id="outfit-prompt"
                    value={outfitPrompt}
                    onChange={handleOutfitChangeInternal}
                    placeholder="Ví dụ: váy dạ hội màu đỏ, áo sơ mi trắng và quần jean xanh..."
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition-all duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    rows={2}
                />
            </div>
            <div>
                <label htmlFor="style-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phong cách & Bối cảnh</label>
                 <textarea
                    id="style-prompt"
                    value={stylePrompt}
                    onChange={handleStyleChangeInternal}
                    placeholder="Ví dụ: ánh sáng điện ảnh, tông màu phim hoài cổ, bối cảnh studio tối giản..."
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition-all duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    rows={3}
                />
            </div>
        </div>
      )}
    </div>
  );
};
