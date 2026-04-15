import React from 'react';
import { ProgressBar } from './ProgressBar';
import { Translation } from './types';
import { ComparisonSlider } from '../ComparisonSlider';

interface ImageDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  isLoading: boolean;
  loadingMessage: string;
  onDownload: () => void;
  t: Translation['imageDisplay'];
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  originalImage,
  generatedImage,
  isLoading,
  loadingMessage,
  onDownload,
  t
}) => {

  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch">
      {/* Original Image Column */}
      <div className="flex flex-col items-center w-full md:w-1/2">
        <h2 className="text-lg font-semibold mb-2 text-slate-500 dark:text-slate-400">{t.original}</h2>
        <div className="w-full flex-grow bg-white dark:bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 p-2 min-h-96">
          {originalImage ? (
            <img src={originalImage} alt={t.original} className="max-w-full max-h-full object-contain rounded-md" />
          ) : (
            <div className="p-4 text-center">
              <p className="text-slate-500 dark:text-slate-400">{t.uploadPrompt}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Edited Image Column */}
      <div className="flex flex-col items-center w-full md:w-1/2">
        <h2 className="text-lg font-semibold mb-2 text-slate-500 dark:text-slate-400">{t.edited}</h2>
        <div 
            className="w-full flex-grow bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative flex items-center justify-center p-2 min-h-96"
        >
          {isLoading && <ProgressBar message={loadingMessage} />}
          {!isLoading && !generatedImage && (
            <div className="p-4 text-center">
               <p className="text-slate-500 dark:text-slate-400">{t.resultPrompt}</p>
            </div>
          )}
          {generatedImage && originalImage && !isLoading && (
            <ComparisonSlider
              originalImageUrl={originalImage}
              generatedImageUrl={generatedImage}
            />
          )}
        </div>
        {generatedImage && !isLoading && (
            <button
                onClick={onDownload}
                className="mt-4 w-full max-w-xs bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-base shadow-lg shadow-green-500/30"
            >
                {t.downloadButton}
            </button>
        )}
      </div>
    </div>
  );
};
