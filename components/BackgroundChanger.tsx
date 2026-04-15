
import React, { useState, useMemo } from 'react';
import { PhotoUploader } from './PhotoUploader';
import { ComparisonSlider } from './ComparisonSlider';
import { Loader } from './Loader';
import { replaceBackground, enhancePrompt } from '../services/geminiService';
import { compressImage } from '../utils/imageUtils';
import { BackgroundIcon } from './icons/BackgroundIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ZoomModal } from './ZoomModal';
import { ZoomInIcon } from './icons/ZoomInIcon';
import { UploadIcon } from './icons/UploadIcon';

const PRESETS = [
    { name: 'Studio Trắng', prompt: 'clean bright white studio background, professional lighting, minimal' },
    { name: 'Studio Xám', prompt: 'professional dark grey studio background, elegant lighting' },
    { name: 'Văn Phòng', prompt: 'modern blurred office background, bright windows, professional setting' },
    { name: 'Bãi Biển', prompt: 'sunny tropical beach at sunset, golden hour lighting, blurred ocean background' },
    { name: 'Đường Phố', prompt: 'blurred busy city street at night with bokeh lights, cinematic' },
    { name: 'Thiên Nhiên', prompt: 'lush green forest background with sunlight filtering through leaves, soft bokeh' },
    { name: 'Quán Cafe', prompt: 'cozy coffee shop interior, warm lighting, blurred background' },
    { name: 'Neon', prompt: 'cyberpunk neon city background, blue and purple lights, cinematic' },
];

export const BackgroundChanger: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    // Custom Background Image State
    const [customBgImage, setCustomBgImage] = useState<File | null>(null);
    
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
    
    // Tab State
    const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

    const uploadedImagePreview = useMemo(() => {
        if (!uploadedImage) return null;
        return URL.createObjectURL(uploadedImage);
    }, [uploadedImage]);

    const customBgPreview = useMemo(() => {
        if (!customBgImage) return null;
        return URL.createObjectURL(customBgImage);
    }, [customBgImage]);

    const handleImageUpload = async (file: File) => {
        try {
            const compressed = await compressImage(file);
            setUploadedImage(compressed);
        } catch (e) {
            setUploadedImage(file);
        }
        setGeneratedImage(null);
        setError(null);
        setPrompt('');
    };

    const handleBgImageUpload = async (file: File) => {
        try {
            const compressed = await compressImage(file);
            setCustomBgImage(compressed);
        } catch (e) {
            setCustomBgImage(file);
        }
    };

    const handleGenerate = async () => {
        const isTextMode = activeTab === 'text';
        const hasPrompt = !!prompt.trim();
        const hasBgImage = !!customBgImage;

        if (!uploadedImage) {
            setError('Vui lòng tải ảnh gốc (chủ thể) trước.');
            return;
        }

        if (isTextMode && !hasPrompt) {
             setError('Vui lòng nhập mô tả hoặc chọn mẫu nền.');
             return;
        }

        if (!isTextMode && !hasBgImage) {
            setError('Vui lòng tải ảnh nền bạn muốn ghép.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // If in image mode, pass the customBgImage. If in text mode, pass undefined.
            const bgFile = activeTab === 'image' ? (customBgImage || undefined) : undefined;
            
            const result = await replaceBackground(uploadedImage, prompt, bgFile);
            if (result.image) {
                setGeneratedImage(result.image);
            } else {
                setError(result.text || 'Không thể thay nền. Yêu cầu có thể bị AI từ chối.');
            }
        } catch (e: unknown) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không mong muốn.');
        } finally {
            setIsLoading(false);
        }
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

    const handleDownload = () => {
        if (!generatedImage) return;
        const a = document.createElement('a');
        a.href = generatedImage;
        a.download = `bg-changed-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleReset = () => {
        setUploadedImage(null);
        setCustomBgImage(null);
        setGeneratedImage(null);
        setPrompt('');
        setError(null);
        setActiveTab('text');
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
            <main className="container mx-auto px-4 py-8 sm:py-12">
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-3">
                        <BackgroundIcon className="w-8 h-8 text-blue-600" />
                        Thay Nền AI Tự Động
                    </h2>
                    <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Tách chủ thể và ghép vào bối cảnh mới chỉ trong tích tắc với AI.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid lg:grid-cols-[400px_1fr] gap-8 items-start">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow border border-slate-200 dark:border-slate-700">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">1. Tải ảnh gốc</label>
                            <div className="h-64">
                                <PhotoUploader onImageUpload={handleImageUpload} previewUrl={uploadedImagePreview} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow border border-slate-200 dark:border-slate-700">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">2. Chọn nền mới</label>
                            
                            {/* Tabs */}
                            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg mb-4">
                                <button
                                    onClick={() => setActiveTab('text')}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                                        activeTab === 'text'
                                            ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                    }`}
                                >
                                    Mô tả / Mẫu
                                </button>
                                <button
                                    onClick={() => setActiveTab('image')}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                                        activeTab === 'image'
                                            ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                    }`}
                                >
                                    Tải ảnh nền
                                </button>
                            </div>

                            {activeTab === 'text' ? (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    {/* Presets */}
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        {PRESETS.map((p) => (
                                            <button
                                                key={p.name}
                                                onClick={() => setPrompt(p.prompt)}
                                                className="px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-transparent hover:border-blue-300 transition-colors text-left"
                                            >
                                                {p.name}
                                            </button>
                                        ))}
                                    </div>

                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Hoặc nhập mô tả tùy chỉnh:</label>
                                    <div className="relative">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Ví dụ: Đứng trên đỉnh núi tuyết, bầu trời đầy sao..."
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 pr-10 text-sm"
                                            rows={3}
                                        />
                                        <button 
                                            onClick={handleEnhancePrompt}
                                            disabled={isEnhancing || !prompt.trim()}
                                            className="absolute bottom-2 right-2 p-1.5 bg-white dark:bg-slate-600 rounded-md text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-500 border border-slate-200 dark:border-slate-500 disabled:opacity-50 shadow-sm transition-colors"
                                            title="Tối ưu hóa mô tả với AI"
                                        >
                                            <SparklesIcon className={`w-4 h-4 ${isEnhancing ? 'animate-spin' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                                    <div className="h-40">
                                        <PhotoUploader onImageUpload={handleBgImageUpload} previewUrl={customBgPreview} />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Mô tả bổ sung (Tùy chọn):</label>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Ví dụ: Ghép người vào giữa ảnh, chỉnh ánh sáng cho phù hợp..."
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 text-sm"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !uploadedImage || (activeTab === 'text' && !prompt.trim()) || (activeTab === 'image' && !customBgImage)}
                                className="mt-4 w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <BackgroundIcon className="w-5 h-5" />
                                        {activeTab === 'image' ? 'Ghép Ảnh Ngay' : 'Tạo Nền Mới'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow border border-slate-200 dark:border-slate-700 h-full min-h-[500px] flex flex-col">
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Kết quả</label>
                            </div>

                            <div className={`flex-grow relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700 ${!generatedImage ? 'flex items-center justify-center' : ''} min-h-[400px]`}>
                                {isLoading && <Loader />}
                                
                                {!isLoading && generatedImage && uploadedImagePreview ? (
                                    <div className="w-full h-full relative group">
                                        <ComparisonSlider originalImageUrl={uploadedImagePreview} generatedImageUrl={generatedImage} />
                                        <button 
                                            onClick={() => setZoomedImageUrl(generatedImage)}
                                            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                            title="Phóng to"
                                        >
                                            <ZoomInIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : !isLoading && uploadedImagePreview ? (
                                    <div className="w-full h-full flex items-center justify-center p-4">
                                        <img src={uploadedImagePreview} alt="Original" className="max-w-full max-h-full object-contain opacity-50" />
                                    </div>
                                ) : !isLoading && (
                                    <div className="text-center text-slate-400 p-4">
                                        <BackgroundIcon className="w-16 h-16 mx-auto mb-2 opacity-30" />
                                        <p>Ảnh kết quả sẽ hiện ở đây</p>
                                    </div>
                                )}
                            </div>

                            {generatedImage && !isLoading && (
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <button onClick={handleDownload} className="flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm">
                                        <DownloadIcon className="w-4 h-4" /> Tải xuống
                                    </button>
                                    <button onClick={handleReset} className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-semibold text-sm">
                                        Tạo mới
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
