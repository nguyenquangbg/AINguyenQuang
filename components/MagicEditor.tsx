
import React, { useState, useMemo } from 'react';
import { PhotoUploader } from './PhotoUploader';
import { ComparisonSlider } from './ComparisonSlider';
import { Loader } from './Loader';
import { editImageWithFreePrompt, enhancePrompt } from '../services/geminiService';
import { WandIcon } from './icons/WandIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { CheckIcon } from './icons/CheckIcon';
import { compressImage } from '../utils/imageUtils';
import { PaletteIcon } from './icons/PaletteIcon';
import { UndoIcon } from './icons/UndoIcon';
import { RedoIcon } from './icons/RedoIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ZoomInIcon } from './icons/ZoomInIcon';
import { ZoomModal } from './ZoomModal';

interface EditHistoryItem {
    imageUrl: string; // URL of the selected variant
    variants: string[]; // All variants for this step
    prompt: string;
    feedback: string | null;
    selectedVariantIndex: number;
}

export const MagicEditor: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  // History state: stores successful edits
  const [history, setHistory] = useState<EditHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1); // -1 means showing original, 0+ means showing history[index]
  
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  
  // Filter state
  const [customColor, setCustomColor] = useState('#ff0000');

  const uploadedImagePreview = useMemo(() => {
    if (!uploadedImage) return null;
    return URL.createObjectURL(uploadedImage);
  }, [uploadedImage]);

  const currentHistoryItem = useMemo(() => {
      if (historyIndex >= 0 && history[historyIndex]) {
          return history[historyIndex];
      }
      return null;
  }, [history, historyIndex]);

  const currentImage = useMemo(() => {
      if (currentHistoryItem) {
          return currentHistoryItem.variants[currentHistoryItem.selectedVariantIndex];
      }
      return null;
  }, [currentHistoryItem]);
  
  const currentVariants = useMemo(() => {
       if (currentHistoryItem) {
          return currentHistoryItem.variants;
      }
      return [];
  }, [currentHistoryItem]);
  
  const currentFeedback = useMemo(() => {
      if (currentHistoryItem) {
          return currentHistoryItem.feedback;
      }
      return null;
  }, [currentHistoryItem]);


  // When a new image is uploaded, reset everything
  const handleImageUpload = async (file: File) => {
      try {
        const compressed = await compressImage(file);
        setUploadedImage(compressed);
      } catch (e) {
        setUploadedImage(file);
      }
      setHistory([]);
      setHistoryIndex(-1);
      setPrompt('');
      setError(null);
      setViewMode('grid');
  };

  const handleEnhancePrompt = async () => {
      if (!prompt.trim()) return;
      setIsEnhancing(true);
      try {
          const enhanced = await enhancePrompt(prompt);
          setPrompt(enhanced);
      } catch (e) {
          console.error(e);
      } finally {
          setIsEnhancing(false);
      }
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !prompt.trim()) {
      setError('Vui lòng tải ảnh và nhập yêu cầu chỉnh sửa.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await editImageWithFreePrompt(uploadedImage, prompt);
      if (result.images && result.images.length > 0) {
        
        const newItem: EditHistoryItem = {
            imageUrl: result.images[0],
            variants: result.images,
            prompt: prompt,
            feedback: result.text || null,
            selectedVariantIndex: 0
        };
        
        // If we are in the middle of history and generate new, we discard future history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newItem);
        
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        
        // Default to grid view if multiple images
        setViewMode(result.images.length > 1 ? 'grid' : 'single');

      } else {
        setError(result.text || 'Không thể chỉnh sửa ảnh. Yêu cầu của bạn có thể đã bị từ chối.');
      }
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không mong muốn.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectVariant = (index: number) => {
       if (historyIndex >= 0) {
          const newHistory = [...history];
          newHistory[historyIndex] = {
              ...newHistory[historyIndex],
              selectedVariantIndex: index,
              imageUrl: newHistory[historyIndex].variants[index]
          };
          setHistory(newHistory);
          setViewMode('single');
      }
  };

  const handleDownload = (url?: string) => {
    const targetUrl = url || currentImage;
    if (!targetUrl) return;
    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = `${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setHistory([]);
    setHistoryIndex(-1);
    setPrompt('');
    setError(null);
    setViewMode('grid');
  };

  const handleUndo = () => {
      if (historyIndex >= -1) {
          setHistoryIndex(prev => prev - 1);
          setViewMode('grid'); // Reset to grid view on undo often helps see context
      }
  };

  const handleRedo = () => {
      if (historyIndex < history.length - 1) {
          setHistoryIndex(prev => prev + 1);
          setViewMode('grid');
      }
  };
  
  const appendPrompt = (text: string) => {
      setPrompt(prev => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed}, ${text}` : text;
      });
  };

  const filters = [
      { name: 'Vintage', label: 'Cổ điển', prompt: 'Apply a vintage retro filter' },
      { name: 'Sepia', label: 'Sepia', prompt: 'Apply a sepia filter' },
      { name: 'B&W', label: 'Đen trắng', prompt: 'Convert to black and white' },
      { name: 'Warm', label: 'Ấm áp', prompt: 'Apply a warm golden hour filter' },
      { name: 'Cool', label: 'Mát mẻ', prompt: 'Apply a cool blue tone filter' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">Chỉnh Sửa Magic AI</h2>
          <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Chỉnh sửa ảnh bằng lời nói. Hãy thử: "Thêm pháo hoa", "Biến thành tranh sơn dầu", "Xóa người ở nền".
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[400px_1fr] gap-8 items-start">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">1. Tải ảnh gốc</label>
                <div className="h-64">
                     <PhotoUploader onImageUpload={handleImageUpload} previewUrl={uploadedImagePreview} />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">2. Nhập yêu cầu chỉnh sửa</label>
                
                {/* Filters Toolbar */}
                <div className="mb-3 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1 pr-2 border-r border-slate-300 dark:border-slate-600 mr-1">
                        <PaletteIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-semibold text-slate-500">Bộ lọc:</span>
                    </div>
                    {filters.map(f => (
                        <button 
                            key={f.name} 
                            onClick={() => appendPrompt(f.prompt)}
                            className="px-2 py-1 text-xs font-medium bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded hover:bg-blue-50 dark:hover:bg-slate-500 transition-colors whitespace-nowrap"
                        >
                            {f.label}
                        </button>
                    ))}
                    <div className="flex items-center gap-2 pl-2 border-l border-slate-300 dark:border-slate-600 ml-1">
                        <input 
                            type="color" 
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="w-6 h-6 p-0 border-0 rounded cursor-pointer" 
                            title="Chọn màu tùy chỉnh"
                        />
                        <button 
                             onClick={() => appendPrompt(`Apply a ${customColor} color tint overlay`)}
                             className="text-xs font-medium bg-white dark:bg-slate-600 px-2 py-1 rounded border border-slate-200 dark:border-slate-500 hover:bg-blue-50 dark:hover:bg-slate-500 whitespace-nowrap"
                        >
                            Áp dụng màu
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ví dụ: Làm cho bầu trời màu tím, Thêm kính râm cho người..."
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 pr-10"
                        rows={3}
                    />
                    <button 
                        onClick={handleEnhancePrompt}
                        disabled={isEnhancing || !prompt.trim()}
                        className="absolute bottom-2 right-2 p-1.5 bg-white dark:bg-slate-600 rounded-md text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-500 border border-slate-200 dark:border-slate-500 disabled:opacity-50 shadow-sm transition-colors"
                        title="Tối ưu hóa lời nhắc với Gemini"
                    >
                        <SparklesIcon className={`w-4 h-4 ${isEnhancing ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !uploadedImage || !prompt.trim()}
                    className="mt-4 w-full py-3 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                >
                    {isLoading ? (
                         <>
                            <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                            Đang thực hiện phép màu...
                        </>
                    ) : (
                        <>
                            <WandIcon className="w-5 h-5" />
                            Thực hiện
                        </>
                    )}
                </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="space-y-4">
             <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow border border-slate-200 dark:border-slate-700 h-full min-h-[600px] flex flex-col">
                 <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Kết quả</label>
                    <div className="flex items-center gap-2">
                        {/* View Mode Toggles */}
                        {currentVariants.length > 0 && !isLoading && (
                            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5 mr-2">
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow text-purple-600 dark:text-purple-300' : 'text-slate-500 dark:text-slate-400'}`}
                                >
                                    Lưới
                                </button>
                                <button 
                                    onClick={() => setViewMode('single')}
                                    className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${viewMode === 'single' ? 'bg-white dark:bg-slate-600 shadow text-purple-600 dark:text-purple-300' : 'text-slate-500 dark:text-slate-400'}`}
                                >
                                    Đơn
                                </button>
                            </div>
                        )}

                        {/* Undo/Redo Controls */}
                        <div className="flex gap-1">
                             <button 
                                onClick={handleUndo} 
                                disabled={historyIndex < 0}
                                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-slate-200 dark:border-slate-600"
                                title="Hoàn tác"
                            >
                                 <UndoIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                             </button>
                             <button 
                                onClick={handleRedo} 
                                disabled={historyIndex >= history.length - 1}
                                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-slate-200 dark:border-slate-600"
                                title="Làm lại"
                            >
                                 <RedoIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                             </button>
                        </div>
                    </div>
                 </div>
                 
                 <div className={`flex-grow relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700 ${!currentImage ? 'flex items-center justify-center' : ''} min-h-[400px]`}>
                    {isLoading && <Loader />}
                    
                    {!isLoading && currentImage && uploadedImagePreview ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 gap-2 p-2 w-full h-full overflow-y-auto">
                                {currentVariants.map((variant, idx) => (
                                    <div 
                                        key={idx} 
                                        className="relative group cursor-pointer rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all aspect-square"
                                        onClick={() => setZoomedImageUrl(variant)}
                                    >
                                        <img src={variant} alt={`Variant ${idx + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg flex items-center gap-1">
                                                <ZoomInIcon className="w-3 h-3"/> Phóng to
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleSelectVariant(idx); }}
                                                className="p-1.5 bg-white/80 dark:bg-slate-800/80 rounded-full text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700"
                                                title="Chọn ảnh này"
                                            >
                                                <CheckIcon className="w-4 h-4"/>
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDownload(variant); }}
                                                className="p-1.5 bg-white/80 dark:bg-slate-800/80 rounded-full text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700"
                                                title="Tải xuống nhanh"
                                            >
                                                <DownloadIcon className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             // Single view shows comparison
                            <div className="w-full h-full relative group">
                                <ComparisonSlider originalImageUrl={uploadedImagePreview} generatedImageUrl={currentImage} />
                                <button 
                                    onClick={() => setZoomedImageUrl(currentImage)}
                                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    title="Phóng to"
                                >
                                    <ZoomInIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )
                    ) : !isLoading && uploadedImagePreview && !currentImage ? (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <img src={uploadedImagePreview} alt="Original" className="max-w-full max-h-full object-contain opacity-50" />
                        </div>
                    ) : !isLoading && (
                         <div className="text-center text-slate-400 p-4">
                            <WandIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Kết quả sẽ hiện ở đây</p>
                        </div>
                    )}
                 </div>

                 {/* Single View Thumbnails */}
                 {viewMode === 'single' && currentVariants.length > 1 && (
                     <div className="mt-4 grid grid-cols-4 gap-2">
                        {currentVariants.map((variant, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelectVariant(idx)}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                    currentHistoryItem?.selectedVariantIndex === idx
                                    ? 'border-purple-500 ring-2 ring-purple-500/30'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-400'
                                }`}
                            >
                                <img src={variant} alt={`Variant ${idx + 1}`} className="w-full h-full object-cover" />
                                {currentHistoryItem?.selectedVariantIndex === idx && (
                                    <div className="absolute top-0 right-0 bg-purple-500 text-white p-0.5 rounded-bl">
                                        <CheckIcon className="w-3 h-3" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                 )}

                 {currentFeedback && (
                     <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 text-xs text-slate-600 dark:text-slate-400">
                         <span className="font-bold text-blue-600 dark:text-blue-400 mr-1">AI Feedback:</span>
                         {currentFeedback}
                     </div>
                 )}
                 
                 {currentImage && (
                     <div className="mt-4 grid grid-cols-2 gap-3">
                         <button onClick={() => handleDownload()} className="flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm">
                             <DownloadIcon className="w-4 h-4" /> Tải xuống
                         </button>
                         <button onClick={handleReset} className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-semibold text-sm">
                             <RefreshIcon className="w-4 h-4" /> Làm mới
                         </button>
                     </div>
                 )}
             </div>
             
             {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                    <p className="font-bold">Lỗi</p>
                    <p>{error}</p>
                </div>
            )}
          </div>
        </div>
      </main>
      {zoomedImageUrl && (
        <ZoomModal imageUrl={zoomedImageUrl} onClose={() => setZoomedImageUrl(null)} />
      )}
    </div>
  );
};
