
import React, { useState, useMemo, useRef } from 'react';
import { PhotoUploader } from './PhotoUploader';
import { ComparisonSlider } from './ComparisonSlider';
import { Loader } from './Loader';
import { cleanOrRestoreObject } from '../services/geminiService';
import { CleaningSprayIcon } from './icons/CleaningSprayIcon';
import { RustIcon } from './icons/RustIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { WandIcon } from './icons/WandIcon';
import { CheckIcon } from './icons/CheckIcon';
import { PaintBrushIcon } from './icons/PaintBrushIcon';
import { VintageIcon } from './icons/VintageIcon';
import { SelectionCanvas, SelectionCanvasRef } from './SelectionCanvas';
import { BrushIcon } from './icons/BrushIcon';
import { EraserIcon } from './icons/EraserIcon';
import type { Option } from '../types';
import { compressImage } from '../utils/imageUtils';

type CleaningType = 'general' | 'rust' | 'polish' | 'full' | 'vintage' | 'refinish';
type ActiveControlTab = 'whole' | 'selection';
type SelectionTool = 'brush' | 'eraser';

interface CleaningOption extends Option {
  id: CleaningType;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const ObjectCleaner: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
  const [customPrompt, setCustomPrompt] = useState('');

  // Selection state
  const canvasRef = useRef<SelectionCanvasRef>(null);
  const [activeControlTab, setActiveControlTab] = useState<ActiveControlTab>('whole');
  const [selectionTool, setSelectionTool] = useState<SelectionTool>('brush');
  const [brushSize, setBrushSize] = useState(30);
  
  const cleaningOptions: CleaningOption[] = [
    { id: 'general', name: 'Làm sạch thông thường', description: 'Loại bỏ bụi bẩn, vết ố, dầu mỡ.', icon: CleaningSprayIcon },
    { id: 'rust', name: 'Tẩy gỉ sét', description: 'Phục hồi các bề mặt kim loại bị gỉ.', icon: RustIcon },
    { id: 'polish', name: 'Đánh bóng', description: 'Làm mới bề mặt, tăng độ sáng bóng.', icon: SparklesIcon },
    { id: 'vintage', name: 'Giữ lại nét cũ', description: 'Làm sạch nhẹ, giữ lại một phần dấu vết thời gian.', icon: VintageIcon },
    { id: 'refinish', name: 'Tái thiết kế', description: 'Thay đổi màu sắc, vật liệu hoặc kiểu dáng.', icon: PaintBrushIcon },
    { id: 'full', name: 'Phục hồi toàn diện', description: 'Kết hợp tất cả, làm mới hoàn toàn.', icon: WandIcon },
  ];
  
  const [selectedCleaningTypes, setSelectedCleaningTypes] = useState<CleaningOption[]>([cleaningOptions[0]]);

  const uploadedImagePreview = useMemo(() => {
    if (!uploadedImage) return null;
    return URL.createObjectURL(uploadedImage);
  }, [uploadedImage]);

  const handleImageUpload = async (file: File) => {
    let fileToUse = file;
    try {
        fileToUse = await compressImage(file);
    } catch (error) {
        console.error("Compression failed", error);
    }
    setUploadedImage(fileToUse);
    setRestoredImage(null);
    setError(null);
    setActiveControlTab('whole');
    canvasRef.current?.clearSelection();
  };
  
  const handleReset = () => {
    setUploadedImage(null);
    setRestoredImage(null);
    setIsLoading(false);
    setError(null);
    setSelectedCleaningTypes([cleaningOptions[0]]);
    setCustomPrompt('');
    setActiveControlTab('whole');
    canvasRef.current?.clearSelection();
  };

  const handleRestore = async () => {
    if (!uploadedImage) {
        setError("Vui lòng tải ảnh lên trước.");
        return;
    };
    setIsLoading(true);
    setError(null);
    
    let maskDataUrl: string | null = null;
    if (activeControlTab === 'selection') {
      maskDataUrl = await canvasRef.current?.getMaskDataUrl() || null;
      if (!maskDataUrl) {
        setError('Vui lòng chọn một vùng trên ảnh để phục hồi.');
        setIsLoading(false);
        return;
      }
    }
    
    const selectedIds = selectedCleaningTypes.map(o => o.id);

    try {
        const result = await cleanOrRestoreObject(
            uploadedImage,
            selectedIds,
            customPrompt,
            maskDataUrl
        );

        if (result.image) {
            setRestoredImage(result.image);
        } else {
            setError(result.text || 'Không thể phục hồi ảnh. Yêu cầu của bạn có thể đã bị AI từ chối.');
        }
    } catch (e: unknown) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không mong muốn khi phục hồi ảnh.');
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
        a.download = `restored-object.${downloadFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
  };

  const handleSelectionToggle = (option: CleaningOption) => {
    setSelectedCleaningTypes(prev => {
        const exclusiveOptions: CleaningType[] = ['full', 'vintage', 'refinish'];
        const nonExclusiveOptions: CleaningType[] = ['general', 'rust', 'polish'];

        if (exclusiveOptions.includes(option.id)) {
            // If an exclusive option is clicked
            if (prev.length === 1 && prev[0].id === option.id) {
                return prev; // Do nothing if it's already the sole selection
            }
            return [option]; // Make it the only selection
        }

        // If a non-exclusive option is clicked
        let newSelection;
        const isSelected = prev.some(o => o.id === option.id);

        if (isSelected) {
            newSelection = prev.filter(o => o.id !== option.id);
        } else {
            newSelection = [...prev.filter(o => !exclusiveOptions.includes(o.id as CleaningType)), option];
        }

        if (newSelection.length === 0) {
            return [cleaningOptions[0]]; // Default to 'general' if empty
        }

        return newSelection;
    });
  };

  const mainDisplayContent = () => {
    if (!uploadedImagePreview) {
      return <PhotoUploader onImageUpload={handleImageUpload} previewUrl={null} />;
    }
    
    return (
      <div className="w-full h-full relative">
        {restoredImage ? (
           <ComparisonSlider originalImageUrl={uploadedImagePreview} generatedImageUrl={restoredImage} />
        ) : (
          <img src={uploadedImagePreview} alt="Uploaded Object" className="object-contain w-full h-full rounded-lg" />
        )}

        {activeControlTab === 'selection' && uploadedImagePreview && (
            <SelectionCanvas 
                ref={canvasRef}
                imageUrl={uploadedImagePreview}
                tool={selectionTool}
                brushSize={brushSize}
            />
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">Làm Sạch & Phục Hồi Vật Thể Bằng AI</h2>
            <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Biến những vật dụng cũ, bẩn, gỉ sét trở nên như mới chỉ trong vài giây.</p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">
            
            <div className="lg:col-span-3 sticky top-24">
              <div className="aspect-square relative flex items-center justify-center bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2">
                {isLoading && <Loader />}
                {mainDisplayContent()}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => setActiveControlTab('whole')}
                  className={`flex-1 pb-2 text-sm font-semibold transition-colors ${activeControlTab === 'whole' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  Toàn bộ ảnh
                </button>
                <button 
                  onClick={() => setActiveControlTab('selection')}
                  className={`flex-1 pb-2 text-sm font-semibold transition-colors ${activeControlTab === 'selection' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  Chỉnh sửa vùng chọn
                </button>
              </div>

              {activeControlTab === 'selection' && (
                  <div className="space-y-4 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                    <div>
                      <h3 className="text-base font-semibold mb-2 text-slate-800 dark:text-slate-100">Công cụ</h3>
                      <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                        <button onClick={() => setSelectionTool('brush')} className={`flex-1 flex items-center justify-center py-1.5 text-sm rounded-md font-semibold transition-colors ${selectionTool === 'brush' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-600/70'}`}><BrushIcon className="w-5 h-5 mr-2"/> Bút vẽ</button>
                        <button onClick={() => setSelectionTool('eraser')} className={`flex-1 flex items-center justify-center py-1.5 text-sm rounded-md font-semibold transition-colors ${selectionTool === 'eraser' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-600/70'}`}><EraserIcon className="w-5 h-5 mr-2"/> Tẩy</button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="brush-size" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Kích thước: {brushSize}px</label>
                      <input
                        id="brush-size"
                        type="range"
                        min="5"
                        max="100"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <button onClick={() => canvasRef.current?.clearSelection()} className="w-full text-sm text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300">Xóa vùng chọn</button>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Tô lên vùng ảnh bạn muốn AI phục hồi.</p>
                  </div>
              )}

               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Chọn loại phục hồi</label>
                  <div className="grid grid-cols-2 gap-3">
                      {cleaningOptions.map((option) => {
                          const isSelected = selectedCleaningTypes.some(o => o.id === option.id);
                          return (
                              <button
                                  key={option.id}
                                  onClick={() => handleSelectionToggle(option)}
                                  className={`relative p-3 border rounded-lg text-left transition-all duration-200 w-full h-full flex items-start ${
                                      isSelected
                                      ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-500/30 bg-blue-50 dark:bg-blue-900/20'
                                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 hover:border-slate-400 dark:hover:border-slate-500'
                                  }`}
                              >
                                  <option.icon className="w-6 h-6 mr-3 text-slate-600 dark:text-slate-300 flex-shrink-0 mt-1" />
                                  <div>
                                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pr-5">{option.description}</p>
                                  </div>
                                  {isSelected && (
                                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                          <CheckIcon className="w-3 h-3 text-white" />
                                      </div>
                                  )}
                              </button>
                          );
                      })}
                  </div>
              </div>

              <div>
                <label htmlFor="cleaner-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Yêu cầu thêm (tùy chọn)</label>
                <textarea
                  id="cleaner-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ví dụ: giữ lại một vài vết xước để trông tự nhiên..."
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  rows={2}
                />
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                {error && (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" role="alert">
                      <p className="font-bold">Đã xảy ra lỗi</p>
                      <p>{error}</p>
                  </div>
                )}
                {restoredImage ? (
                  <div className="space-y-3">
                      <button
                          onClick={handleDownload}
                          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-base shadow"
                      >
                          Tải xuống ({downloadFormat.toUpperCase()})
                      </button>
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                          <button onClick={() => setDownloadFormat('png')} className={`flex-1 text-center py-1.5 text-sm rounded-md font-semibold transition-colors ${downloadFormat === 'png' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>PNG</button>
                          <button onClick={() => setDownloadFormat('jpg')} className={`flex-1 text-center py-1.5 text-sm rounded-md font-semibold transition-colors ${downloadFormat === 'jpg' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>JPG</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                          <button
                              onClick={handleRestore}
                              disabled={isLoading}
                              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                          >
                              {isLoading ? 'Đang xử lý...' : 'Thử lại'}
                          </button>
                          <button
                              onClick={handleReset}
                              className="w-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-100 text-center font-bold py-3 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                          >
                              Tạo mới
                          </button>
                      </div>
                  </div>
                ) : (
                  <button
                    onClick={handleRestore}
                    disabled={!uploadedImage || isLoading}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center text-base shadow"
                  >
                    {isLoading ? 'Đang xử lý...' : 'Bắt đầu làm sạch'}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
