
import React, { useState, useCallback, useMemo } from 'react';
import { generateImageFromPrompt, enhancePrompt } from '../services/geminiService';
import { Quality } from './pro-ai-relight/types';
import { Loader } from './Loader';
import { CheckIcon } from './icons/CheckIcon';
import { PhotoUploader } from './PhotoUploader';
import { TrashIcon } from './icons/TrashIcon';
import { compressImage } from '../utils/imageUtils';
import { SparklesIcon } from './icons/SparklesIcon';
import { ZoomInIcon } from './icons/ZoomInIcon';
import { ZoomModal } from './ZoomModal';

// A simple button group component for quality selection
const Button: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode }> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow'
        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
    }`}
  >
    {children}
  </button>
);

const presets = [
    { name: 'Tuyết rơi', prompt: 'Khung cảnh tuyết rơi chân thực với độ phân giải cao, các bông tuyết có kích thước đa dạng để tạo cảm giác tự nhiên và chiều sâu. Hiệu ứng tán xạ ánh sáng mềm mại, ánh sáng điện ảnh làm tăng độ chân thực. Tách biệt hoàn toàn trên nền đen để dễ ghép trong hậu kỳ.' },
    { name: 'Bong bóng', prompt: 'A dense cluster of shimmering soap bubbles, various sizes from tiny to large, gently scattered and evenly spaced, with minimal overlapping, creating depth and clarity. Photorealistic, translucent with iridescent rainbow highlights, floating gently against a solid black background for easy compositing.' },
    { name: 'Mưa rơi', prompt: 'Realistic falling rain streaks, high-resolution, slight motion blur, on a black background for compositing.' },
    { name: 'Hiệu ứng bokeh vàng', prompt: 'Một cụm hiệu ứng bokeh vàng rực rỡ, ánh sáng mờ ảo, nhiều kích thước khác nhau để tạo độ sâu. Phong cách điện ảnh, siêu chân thực, hiệu ứng lấp lánh dải động cao (HDR shimmer). Nổi bật trên nền đen trơn để dễ dàng compositing.' },
    { name: 'Tia nắng kịch tính', prompt: 'Một khung cảnh các tia nắng mạnh mẽ với hiệu ứng ánh sáng thể tích (volumetric light beams), tỏa xuống không gian trong sắc vàng của giờ hoàng hôn. Siêu chi tiết, chân thực, ánh sáng xuyên qua lớp sương mờ tạo chiều sâu. Nền đen tinh khiết, tách biệt hoàn toàn để dễ dàng ghép vào hậu kỳ.' },
    { name: 'Khói ma mị', prompt: 'Wispy, ethereal smoke tendrils, mystical, white and grey smoke, on a black background for easy blending.' },
    { name: 'ID Sinh viên', prompt: 'Ảnh thẻ chân dung studio của một sinh viên Việt Nam ngẫu nhiên, độ tuổi 18-26, giới tính ngẫu nhiên. Tóc tai gọn gàng, mặc áo sơ mi trắng hoặc xanh. Khuôn mặt nhìn thẳng, biểu cảm trung tính. Phông nền màu xanh nhạt. Ánh sáng chuyên nghiệp, ảnh chất lượng cao, siêu thực.' },
];

const aspectRatios = [
    { id: '1:1', name: 'Vuông' },
    { id: '16:9', name: 'Ngang' },
    { id: '9:16', name: 'Dọc' },
    { id: '4:3', name: 'Ngang (4:3)' },
    { id: '3:4', name: 'Dọc (3:4)' },
    { id: '2:3', name: 'Dọc (2:3)' },
    { id: '3:2', name: 'Ngang (3:2)' },
    { id: '21:9', name: 'Siêu rộng' },
];

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [quality, setQuality] = useState<Quality>('standard');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  
  // Reference Image State
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const referenceImagePreview = useMemo(() => referenceImage ? URL.createObjectURL(referenceImage) : null, [referenceImage]);

  // Model Selection
  const [useGeminiModel, setUseGeminiModel] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);

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
    if (!prompt.trim()) {
      setError('Vui lòng nhập yêu cầu để tạo ảnh.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setSelectedImage(null);

    try {
      const result = await generateImageFromPrompt(prompt, aspectRatio, referenceImage || undefined, useGeminiModel, quality === 'standard' ? '1K' : (quality === '2k' ? '2K' : '4K'));
      if (result.images && result.images.length > 0) {
        setGeneratedImages(result.images);
        setSelectedImage(result.images[0]); // Auto select first image
      } else {
        setError(result.text || 'Không thể tạo ảnh. Yêu cầu của bạn có thể đã bị AI từ chối.');
      }
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không mong muốn.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = useCallback(() => {
    if (!selectedImage) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = selectedImage;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let finalWidth = image.naturalWidth;
      let finalHeight = image.naturalHeight;

      if (quality === '2k' && image.naturalWidth < 2048) {
          finalWidth = 2048;
          finalHeight = image.naturalHeight * (2048 / image.naturalWidth);
      } else if (quality === '4k' && image.naturalWidth < 4096) {
          finalWidth = 4096;
          finalHeight = image.naturalHeight * (4096 / image.naturalWidth);
      }
      
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };
  }, [selectedImage, quality]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">Tạo Ảnh AI Từ Văn Bản</h2>
            <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Biến ý tưởng của bạn thành hình ảnh độc đáo chỉ với vài từ mô tả.</p>
          </div>

          <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 items-start">
            {/* Controls */}
            <div className="space-y-6 bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-transparent dark:border-slate-700 shadow-lg">
              
              {/* Reference Image Section */}
              <div>
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                        Ảnh tham khảo (Tùy chọn)
                    </h3>
                    {referenceImage && (
                        <button onClick={() => setReferenceImage(null)} className="text-xs text-red-500 hover:text-red-600 flex items-center transition-colors">
                            <TrashIcon className="w-3 h-3 mr-1"/> Xóa
                        </button>
                    )}
                 </div>
                 
                 {referenceImage ? (
                     <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-600">
                        <img src={referenceImagePreview!} alt="Reference" className="h-full w-full object-contain" />
                    </div>
                 ) : (
                    <div className="h-40">
                         <PhotoUploader onImageUpload={async (file) => {
                            try {
                                const compressed = await compressImage(file);
                                setReferenceImage(compressed);
                            } catch (e) {
                                setReferenceImage(file);
                            }
                        }} previewUrl={null} />
                    </div>
                 )}
                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Tải ảnh lên để AI có thêm ý tưởng sáng tạo hoặc chỉnh sửa trực tiếp.</p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                 <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    Gợi ý nhanh
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {presets.map((p) => (
                    <button
                        key={p.name}
                        onClick={() => setPrompt(p.prompt)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
                    >
                        {p.name}
                    </button>
                    ))}
                </div>

                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="image-prompt" className="block text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Nhập yêu cầu của bạn
                    </label>
                    <button 
                        onClick={handleEnhancePrompt}
                        disabled={isEnhancing || !prompt.trim()}
                        className="flex items-center text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50 transition-colors"
                    >
                        <SparklesIcon className={`w-3.5 h-3.5 mr-1 ${isEnhancing ? 'animate-spin' : ''}`} />
                        {isEnhancing ? 'Đang tối ưu...' : 'Tối ưu với Gemini'}
                    </button>
                </div>
                <textarea
                  id="image-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ví dụ: một chú mèo phi hành gia đang cưỡi ngựa trên sao hỏa, phong cách nghệ thuật số..."
                  className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base"
                  rows={4}
                />
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">Tỷ lệ khung hình</h3>
                 <div className="flex flex-wrap gap-2">
                    {aspectRatios.map((ratio) => (
                        <button
                            key={ratio.id}
                            onClick={() => setAspectRatio(ratio.id)}
                             className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                                aspectRatio === ratio.id
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                            }`}
                        >
                            {ratio.name} ({ratio.id})
                        </button>
                    ))}
                </div>
              </div>

              {!referenceImage && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                       <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">Model AI</h3>
                       <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                           <button 
                                onClick={() => setUseGeminiModel(false)}
                                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${!useGeminiModel ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}
                            >
                                Imagen 4 (Chất lượng cao)
                            </button>
                            <button 
                                onClick={() => setUseGeminiModel(true)}
                                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${useGeminiModel ? 'bg-white dark:bg-slate-600 shadow text-purple-600 dark:text-purple-300' : 'text-slate-500 dark:text-slate-400'}`}
                            >
                                Gemini 3.1 Flash (Tốc độ cao)
                            </button>
                       </div>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                           {useGeminiModel ? 'Gemini 3.1 Flash tạo ra 4 biến thể nhanh chóng.' : 'Imagen 4 tạo ra hình ảnh chi tiết và nghệ thuật hơn.'}
                       </p>
                  </div>
              )}

              <div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">Chất lượng đầu ra</h3>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                  <Button onClick={() => setQuality('standard')} isActive={quality === 'standard'}>Tiêu chuẩn</Button>
                  <Button onClick={() => setQuality('2k')} isActive={quality === '2k'}>2K</Button>
                  <Button onClick={() => setQuality('4k')} isActive={quality === '4k'}>4K</Button>
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg shadow-blue-500/30"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-3"></div>
                    Đang tạo...
                  </>
                ) : 'Tạo Ảnh'}
              </button>
            </div>

            {/* Image Display Area - Main Preview + Thumbnails */}
            <div className="sticky top-24 space-y-4">
              {/* Main Large Preview */}
              <div className="w-full bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 min-h-[500px] flex flex-col">
                  {isLoading && (
                      <div className="flex-grow flex items-center justify-center min-h-[400px] relative">
                         <Loader />
                      </div>
                  )}
                  
                  {!isLoading && selectedImage ? (
                      <div className="relative group flex-grow flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-lg overflow-hidden cursor-zoom-in" onClick={() => setZoomedImageUrl(selectedImage)}>
                          <img src={selectedImage} alt="Main Generated" className="max-w-full max-h-[600px] object-contain" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                                <div className="opacity-0 group-hover:opacity-100 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
                                    <ZoomInIcon className="w-4 h-4" /> Phóng to
                                </div>
                          </div>
                      </div>
                  ) : !isLoading && (
                      <div className="flex-grow flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-lg font-semibold">Kết quả ảnh sẽ hiện ở đây</p>
                        <p className="text-sm opacity-70 mt-2">Hãy nhập mô tả và nhấn "Tạo Ảnh"</p>
                      </div>
                  )}

                   {/* Download Button for Main Image */}
                   {selectedImage && !isLoading && (
                        <button
                            onClick={handleDownload}
                            className="mt-4 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-base shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Tải ảnh này xuống (PNG)
                        </button>
                    )}
              </div>

              {/* Thumbnails Grid */}
              {generatedImages && generatedImages.length > 0 && !isLoading && (
                  <div className="grid grid-cols-4 gap-3">
                      {generatedImages.map((imgSrc, index) => (
                          <button
                              key={index}
                              onClick={() => setSelectedImage(imgSrc)}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 group ${
                                  selectedImage === imgSrc
                                      ? 'border-blue-600 ring-2 ring-blue-200 dark:ring-blue-900'
                                      : 'border-transparent hover:border-blue-400'
                              }`}
                          >
                              <img src={imgSrc} alt={`Variant ${index + 1}`} className="w-full h-full object-cover" />
                              {selectedImage === imgSrc && (
                                  <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-0.5 shadow-sm">
                                      <CheckIcon className="w-3 h-3 text-white" />
                                  </div>
                              )}
                          </button>
                      ))}
                  </div>
              )}

              {error && (
                <div className="mt-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" role="alert">
                  <p className="font-bold">Đã xảy ra lỗi</p>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
       {zoomedImageUrl && (
            <ZoomModal imageUrl={zoomedImageUrl} onClose={() => setZoomedImageUrl(null)} />
        )}
    </div>
  );
};
