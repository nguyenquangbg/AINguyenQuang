
import React from 'react';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { UpscaleIcon } from './icons/UpscaleIcon';

interface AnalysisResult {
    needsUpscaling: boolean;
    reason: string;
    detectedIssues: string[];
}

interface RestorationAnalysisFeedbackProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  isUpscaling: boolean;
  onUpscale: () => void;
}

export const RestorationAnalysisFeedback: React.FC<RestorationAnalysisFeedbackProps> = ({ result, isAnalyzing, isUpscaling, onUpscale }) => {
  if (isAnalyzing) {
    return (
      <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex items-center">
        <div className="w-4 h-4 border-2 border-slate-400 dark:border-slate-500 border-t-slate-600 dark:border-t-slate-300 rounded-full animate-spin mr-3"></div>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Đang phân tích chất lượng ảnh...</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const { needsUpscaling, reason, detectedIssues } = result;
  
  const issueLabels: Record<string, string> = {
      scratch: 'Xước / Rách',
      noise: 'Nhiễu hạt',
      blur: 'Mờ nét',
      fading: 'Phai màu',
      face_damage: 'Hư hỏng mặt'
  };

  return (
    <div className={`mt-4 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800`}>
      <div className="flex items-center mb-3">
        <LightbulbIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Kết quả chẩn đoán AI</h4>
      </div>
      
      <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">{reason}</p>
      
      {detectedIssues && detectedIssues.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
              {detectedIssues.map(issue => (
                  <span key={issue} className="px-2 py-1 text-xs font-medium bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-600">
                      {issueLabels[issue] || issue}
                  </span>
              ))}
          </div>
      )}

      {needsUpscaling && (
        <button
            onClick={onUpscale}
            disabled={isUpscaling}
            className="w-full mt-2 bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors disabled:bg-amber-300 disabled:cursor-not-allowed flex items-center justify-center text-sm shadow"
        >
            {isUpscaling ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                    Đang nâng cấp độ phân giải...
                </>
            ) : (
                <>
                    <UpscaleIcon className="w-5 h-5 mr-2" />
                    Nâng cấp chất lượng ảnh (HD)
                </>
            )}
        </button>
      )}
    </div>
  );
};
