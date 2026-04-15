import React from 'react';
import type { ImageAnalysisResult } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface ImageAnalysisFeedbackProps {
  result: ImageAnalysisResult | null;
  isLoading: boolean;
}

export const ImageAnalysisFeedback: React.FC<ImageAnalysisFeedbackProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex items-center">
        <div className="w-4 h-4 border-2 border-slate-400 dark:border-slate-500 border-t-slate-600 dark:border-t-slate-300 rounded-full animate-spin mr-3"></div>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Đang phân tích ảnh của bạn...</p>
      </div>
    );
  }

  if (!result || (!result.feedback && !result.gender && !result.age)) {
    return null;
  }

  const allGood = result.feedback?.every(item => item.isGood) ?? true;

  return (
    <div className={`mt-4 p-4 rounded-lg ${allGood ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
      <h4 className="flex items-center text-sm font-semibold mb-3">
        <LightbulbIcon className={`w-5 h-5 mr-2 ${allGood ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`} />
        <span className={`${allGood ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300'}`}>Phân tích nhanh</span>
      </h4>
      <ul className="space-y-2 text-sm">
        {result.gender && (
            <li className="flex items-start">
                <UserCircleIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2.5 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                    Giới tính phát hiện: <strong>{result.gender}</strong>
                </span>
            </li>
        )}
        {result.age && (
            <li className="flex items-start">
                <CalendarIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2.5 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                    Độ tuổi ước tính: <strong>{result.age}</strong>
                </span>
            </li>
        )}
        {result.feedback?.map((item, index) => (
          <li key={index} className="flex items-start">
            {item.isGood ? (
              <CheckIcon className="w-4 h-4 text-green-500 dark:text-green-400 mr-2.5 mt-0.5 flex-shrink-0" strokeWidth={2.5}/>
            ) : (
              <XIcon className="w-4 h-4 text-amber-500 dark:text-amber-400 mr-2.5 mt-0.5 flex-shrink-0" />
            )}
            <span className={item.isGood ? 'text-slate-600 dark:text-slate-300' : 'text-slate-700 dark:text-slate-200'}>{item.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};