
import React, { useState, useMemo } from 'react';
import { PhotoUploader } from './PhotoUploader';
import { ComparisonSlider } from './ComparisonSlider';
import { Loader } from './Loader';
import { FaceIcon } from './icons/FaceIcon';
import { NoiseIcon } from './icons/NoiseIcon';
import { SharpenIcon } from './icons/SharpenIcon';
import { UpscaleIcon } from './icons/UpscaleIcon';
import { ColorizeIcon } from './icons/ColorizeIcon';
import { restorePhoto, analyzeImageForRestoration, upscaleImage, enhancePrompt } from '../services/geminiService';
import { dataUrlToFile, compressImage } from '../utils/imageUtils';
import { RestorationAnalysisFeedback } from './RestorationAnalysisFeedback';
import { SparklesIcon } from './icons/SparklesIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CheckIcon } from './icons/CheckIcon';
import { TrashIcon } from './icons/TrashIcon';

type RestoreOption = 'faceEnhance' | 'denoise' | 'sharpen' | 'upscale' | 'colorize';
type WorkflowMode = 'standard' | 'pro-phase-one';

interface ProcessedImage {
  id: number;
  originalUrl: string;
  restoredUrl: string;
  timestamp: string;
}

interface AnalysisResult {
    needsUpscaling: boolean;
    reason: string;
    detectedIssues: string[];
}

export const PhotoRestorer: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>('standard'); 
  
  const [options, setOptions] = useState({
    faceEnhance: true,
    denoise: true,
    sharpen: false,
    upscale: false,
    colorize: false,
  });

  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
  const [imageQueue, setImageQueue] = useState<ProcessedImage[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Upscaling & Analysis flow state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [upscaledImageFile, setUpscaledImageFile] = useState<File | null>(null);

  const uploadedImagePreview = useMemo(() => {
    if (!uploadedImage) return null;
    return URL.createObjectURL(uploadedImage);
  }, [uploadedImage]);

  const upscaledImagePreview = useMemo(() => {
    if (!upscaledImageFile) return null;
    return URL.createObjectURL(upscaledImageFile);
  }, [upscaledImageFile]);

  const performAnalysis = async () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeImageForRestoration(uploadedImage);
      setAnalysisResult(result);
      
      // Auto-configure options based on analysis (Standard mode only)
      if (workflowMode === 'standard') {
          const newOptions = { ...options };
          if (result.needsUpscaling) newOptions.upscale = true;
          if (result.detectedIssues.includes('noise')) newOptions.denoise = true;
          if (result.detectedIssues.includes('blur')) newOptions.sharpen = true;
          if (result.detectedIssues.includes('face_damage')) newOptions.faceEnhance = true;
          
          setOptions(newOptions);
      }
      
    } catch (e) {
      console.error("Image analysis failed:", e);
      setError("Không thể phân tích ảnh. Vui lòng thử lại.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setRestoredImage(null);
    setIsLoading(false);
    setError(null);
    setOptions({ faceEnhance: true, denoise: true, sharpen: false, upscale: false, colorize: false });
    setCustomPrompt('');
    setIsAnalyzing(false);
    setAnalysisResult(null);
    setIsUpscaling(false);
    setUpscaledImageFile(null);
  };
  
  const handleClearHistory = () => {
      setImageQueue([]);
  };

  const handleSelectHistory = (item: ProcessedImage) => {
      setRestoredImage(item.restoredUrl);
  };

  const handleImageUpload = async (file: File) => {
    handleReset();
    setImageQueue([]); 
    let fileToUse = file;
    try {
        fileToUse = await compressImage(file);
    } catch (error) {
        console.error("Compression failed", error);
    }
    setUploadedImage(fileToUse);
  };

  const handleEnhancePrompt = async () => {
      if (!customPrompt.trim()) return;
      setIsEnhancing(true);
      try {
          const enhanced = await enhancePrompt(customPrompt);
          setCustomPrompt(enhanced);
      } catch (e) {
          console.error(e);
      } finally {
          setIsEnhancing(false);
      }
  };

  const toggleOption = (option: RestoreOption) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };
  
  const handleUpscaleAndSet = async () => {
      const imgToUpscale = upscaledImageFile || uploadedImage;
      if (!imgToUpscale) return;
      setIsUpscaling(true);
      setError(null);
      try {
          const result = await upscaleImage(imgToUpscale);
          if (result.image) {
              const file = await dataUrlToFile(result.image, 'upscaled_image.png');
              setUpscaledImageFile(file);
              if (analysisResult) {
                  setAnalysisResult({ ...analysisResult, needsUpscaling: false, reason: 'Đã nâng cấp độ phân giải thành công.' });
              }
              setOptions(prev => ({ ...prev, upscale: false })); 
          } else {
              setError(result.text || 'Không thể nâng cấp ảnh.');
          }
      } catch(e) {
          console.error(e);
          setError(e instanceof Error ? e.message : 'Lỗi không mong muốn khi nâng cấp ảnh.');
      } finally {
          setIsUpscaling(false);
      }
  };

  const handleRestore = async () => {
    const imageToRestore = upscaledImageFile || uploadedImage;
    if (!imageToRestore) {
      setError("Vui lòng tải ảnh lên trước.");
      return;
    }
    setIsLoading(true);
    setError(null);

    // Pass 'proMode' option flag based on workflow selection
    const restoreOptions = {
        ...options,
        proMode: workflowMode === 'pro-phase-one'
    };

    try {
      const result = await restorePhoto(imageToRestore, restoreOptions, customPrompt, null);
      if (result.image) {
        setRestoredImage(result.image);
        const originalDisplayUrl = upscaledImagePreview || uploadedImagePreview;
        if(originalDisplayUrl) {
            const newHistory: ProcessedImage = {
                id: Date.now(),
                originalUrl: originalDisplayUrl,
                restoredUrl: result.image,
                timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
            setImageQueue(prev => [newHistory, ...prev].slice(0, 10));
        }
      } else {
        setError(result.text || 'Không thể phục hồi ảnh. Yêu cầu của bạn có thể đã bị AI từ chối.');
      }
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không mong muốn.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!restoredImage) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = restoredImage;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (restoredImage.startsWith('data:image/png') && downloadFormat === 'jpg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(image, 0, 0);
        const imageUrl = canvas.toDataURL(`image/${downloadFormat === 'jpg' ? 'jpeg' : 'png'}`, 1.0);
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `${Date.now()}.${downloadFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
  };
  
  const mainDisplayContent = () => {
    const displayUrl = upscaledImagePreview || uploadedImagePreview;
    
    if (!displayUrl) {
      return <PhotoUploader onImageUpload={handleImageUpload} previewUrl={null} />;
    }
    
    return (
      <div className="w-full h-full relative">
        {restoredImage ? (
           <ComparisonSlider originalImageUrl={displayUrl} generatedImageUrl={restoredImage} />
        ) : (
          <img src={displayUrl} alt="Uploaded" className="object-contain w-full h-full rounded-lg" />
        )}
      </div>
    );
  };

  const restoreOptionsList: { id: RestoreOption; name: string; description: string; icon: React.FC<any> }[] = [
    { id: 'faceEnhance', name: 'CodeFormer Face Restore (2024)', description: 'Khôi phục chi tiết khuôn mặt, mắt và da (GFPGAN/CodeFormer).', icon: FaceIcon },
    { id: 'upscale', name: 'DiffBIR / SUPIR Upscaling', description: 'Tăng độ phân giải, tái tạo chi tiết siêu thực.', icon: UpscaleIcon },
    { id: 'colorize', name: 'DeOldify Colorization', description: 'Tô màu ảnh đen trắng bằng công nghệ Deep Learning.', icon: ColorizeIcon },
    { id: 'denoise', name: 'Khử nhiễu & Hạt (Denoise)', description: 'Loại bỏ nhiễu hạt ISO và nén ảnh.', icon: NoiseIcon },
    { id: 'sharpen', name: 'Làm nét chi tiết', description: 'Tăng độ sắc nét cho các cạnh và chi tiết mờ.', icon: SharpenIcon },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">Phục Hồi Ảnh Cũ Bằng AI</h2>
          <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Công nghệ AI tiên tiến giúp chẩn đoán và phục hồi ảnh cũ, xước, mờ trở nên sống động như mới.</p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-3 sticky top-24">
              <div className="aspect-square relative flex items-center justify-center bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2">
                {isLoading && <Loader />}
                {mainDisplayContent()}
              </div>
              
               {uploadedImage && !restoredImage && (
                   <div className="mt-4">
                        {!analysisResult && !isAnalyzing ? (
                            <button 
                                onClick={performAnalysis}
                                className="w-full py-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800 font-semibold flex items-center justify-center gap-2 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                            >
                                <SparklesIcon className="w-5 h-5" />
                                Phân tích thông minh (Smart Scan)
                            </button>
                        ) : (
                            <RestorationAnalysisFeedback 
                                result={analysisResult} 
                                isAnalyzing={isAnalyzing} 
                                isUpscaling={isUpscaling} 
                                onUpscale={handleUpscaleAndSet} 
                            />
                        )}
                   </div>
               )}
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="space-y-6">
                  
                  {/* Workflow Selector */}
                  <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quy trình xử lý (Workflow)</label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                          <button
                              onClick={() => setWorkflowMode('standard')}
                              className={`py-2 px-3 text-sm font-semibold rounded-md transition-all ${
                                  workflowMode === 'standard'
                                  ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow'
                                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50'
                              }`}
                          >
                              Tiêu chuẩn
                          </button>
                          <button
                              onClick={() => setWorkflowMode('pro-phase-one')}
                              className={`py-2 px-3 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                                  workflowMode === 'pro-phase-one'
                                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50'
                              }`}
                          >
                              <SparklesIcon className="w-3 h-3" />
                              Studio Pro
                          </button>
                      </div>
                  </div>

                  {/* Conditional UI based on Workflow */}
                  {workflowMode === 'standard' ? (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex justify-between items-center">
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tùy chọn thủ công</label>
                              {analysisResult && <span className="text-xs text-green-600 dark:text-green-400 font-medium">Đã tối ưu theo ảnh</span>}
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                              {restoreOptionsList.map(opt => {
                                  const isSelected = options[opt.id];
                                  return (
                                      <button key={opt.id} onClick={() => toggleOption(opt.id)} className={`flex items-start p-3 border rounded-lg text-left transition-all ${isSelected ? 'border-blue-600 ring-1 ring-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' : 'border-slate-300 bg-white hover:border-slate-400 dark:bg-slate-800/50 dark:border-slate-600 dark:hover:border-slate-500'}`}>
                                          <opt.icon className={`w-6 h-6 mr-3 flex-shrink-0 mt-0.5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                          <div className="flex-grow">
                                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">{opt.name}</span>
                                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.description}</p>
                                          </div>
                                          {isSelected && <CheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                                      </button>
                                  )
                              })}
                          </div>
                      </div>
                  ) : (
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center gap-2 mb-3">
                              <div className="p-1.5 bg-purple-600 rounded-lg">
                                  <SparklesIcon className="w-4 h-4 text-white" />
                              </div>
                              <h3 className="font-bold text-purple-900 dark:text-purple-100">Studio Pro (Phase One)</h3>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                              Chế độ tự động hoàn toàn. Hệ thống sẽ áp dụng quy trình xử lý ảnh cấp bảo tàng dựa trên giả lập máy ảnh Phase One XF IQ4 150MP.
                          </p>
                          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                              <li className="flex items-center gap-2">
                                  <CheckIcon className="w-3 h-3 text-green-500" />
                                  <span>Giả lập ống kính Schneider Kreuznach 80mm</span>
                              </li>
                              <li className="flex items-center gap-2">
                                  <CheckIcon className="w-3 h-3 text-green-500" />
                                  <span>Xử lý da & mắt chuẩn Studio (Realistic)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                  <CheckIcon className="w-3 h-3 text-green-500" />
                                  <span>Bảo toàn danh tính & nền gốc tuyệt đối</span>
                              </li>
                               <li className="flex items-center gap-2">
                                  <CheckIcon className="w-3 h-3 text-green-500" />
                                  <span>Khử nhiễu giấy ảnh & Màu điện ảnh (Cinematic)</span>
                              </li>
                          </ul>
                      </div>
                  )}
                </div>
              
               <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="restore-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Yêu cầu đặc biệt (tùy chọn)</label>
                    <button 
                        onClick={handleEnhancePrompt}
                        disabled={isEnhancing || !customPrompt.trim()}
                        className="flex items-center text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50 transition-colors"
                    >
                        <SparklesIcon className={`w-3.5 h-3.5 mr-1 ${isEnhancing ? 'animate-spin' : ''}`} />
                        {isEnhancing ? 'Đang tối ưu...' : 'Tối ưu prompt'}
                    </button>
                </div>
                <textarea id="restore-prompt" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="Ví dụ: màu áo là xanh navy, mắt màu nâu..." className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm" rows={2}/>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                {error && <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" role="alert"><p className="font-bold">Đã xảy ra lỗi</p><p>{error}</p></div>}
                {restoredImage ? (
                  <div className="space-y-3">
                    <button onClick={handleDownload} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-base shadow-lg shadow-green-500/30"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg> Tải xuống ({downloadFormat.toUpperCase()})</button>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      <button onClick={() => setDownloadFormat('png')} className={`flex-1 text-center py-1.5 text-sm rounded-md font-semibold transition-colors ${downloadFormat === 'png' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>PNG</button>
                      <button onClick={() => setDownloadFormat('jpg')} className={`flex-1 text-center py-1.5 text-sm rounded-md font-semibold transition-colors ${downloadFormat === 'jpg' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>JPG</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={handleRestore} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">{isLoading ? 'Đang xử lý...' : 'Thử lại'}</button>
                      <button onClick={handleReset} className="w-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-100 text-center font-bold py-3 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Tạo mới</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={handleRestore} disabled={!uploadedImage || isLoading} className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center text-base shadow-lg shadow-blue-500/30">{isLoading ? 'Đang phục hồi...' : 'Bắt đầu phục hồi'}</button>
                )}

                {/* Edit History Section */}
                {imageQueue.length > 0 && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lịch sử chỉnh sửa ({imageQueue.length})</h4>
                            <button onClick={handleClearHistory} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                                <TrashIcon className="w-3 h-3"/> Xóa
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {imageQueue.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelectHistory(item)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                        restoredImage === item.restoredUrl
                                        ? 'border-blue-500 ring-2 ring-blue-500/30' 
                                        : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                                    }`}
                                    title={`Tạo lúc ${item.timestamp}`}
                                >
                                    <img src={item.restoredUrl} alt={`Restored at ${item.timestamp}`} className="w-full h-full object-cover" />
                                    {restoredImage === item.restoredUrl && (
                                        <div className="absolute top-0 right-0 bg-blue-500 text-white p-0.5 rounded-bl">
                                            <CheckIcon className="w-3 h-3" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
