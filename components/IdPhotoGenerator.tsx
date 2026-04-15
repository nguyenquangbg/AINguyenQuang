
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PhotoUploader } from './PhotoUploader';
import { OptionSelector } from './OptionSelector';
import { ResultView } from './ResultView';
import { Loader } from './Loader';
import { BACKGROUNDS, OUTFITS, GENDERS, HAIRSTYLES, ASPECT_RATIOS, RETOUCH_OPTIONS, QUALITY_ENHANCEMENT_OPTIONS, SKIN_TONE_OPTIONS, COUNTRY_TEMPLATES, DOCUMENT_TYPES, LIGHTING_OPTIONS, EXPRESSION_OPTIONS } from '../constants';
import type { Background, Outfit, GenderOption, Hairstyle, AspectRatio, RetouchOption, QualityEnhancementOption, SkinToneOption, CountryTemplate, ImageAnalysisResult, DocumentType, LightingOption, ExpressionOption } from '../types';
import { generateIdPhoto, analyzeImage } from '../services/geminiService';
import { ImageAnalysisFeedback } from './ImageAnalysisFeedback';
import { GlobeIcon } from './icons/GlobeIcon';
import { TabbedControls } from './TabbedControls';
import { ZoomModal } from './ZoomModal';
import { SparklesIcon } from './icons/SparklesIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CheckIcon } from './icons/CheckIcon';
import { compressImage } from '../utils/imageUtils';

interface GeneratedHistoryItem {
  id: string;
  imageUrl: string;
  timestamp: string;
}

const STORAGE_KEY = 'idPhotoGeneratorSettings';

const DEFAULT_CUSTOM_PROMPT = "Ảnh chân dung chuyên nghiệp trong studio, nhiếp ảnh siêu thực, giữ nguyên các đặc điểm khuôn mặt và biểu cảm tự nhiên với độ trung thực tuyệt đối, nổi bật trên nền trắng tinh khiết (màu Hex #FFFFFF), bố cục cân bằng hoàn hảo, khung hình rõ nét, cắt xén đối xứng, ánh sáng studio khuếch tán nhẹ, chiếu sáng đều, không đổ bóng, lấy nét sắc nét, kết cấu da cực kỳ chi tiết, độ phân giải 8k, chụp bằng Hasselblad X2D, ống kính chân dung 85mm, phong cách chụp ảnh thương mại cao cấp.";

export const IdPhotoGenerator: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  
  // History state
  const [history, setHistory] = useState<GeneratedHistoryItem[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initializers from localStorage
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to load settings", e);
      return {};
    }
  };

  const savedSettings = useMemo(() => loadSettings(), []);

  // Controls State with persistence defaults
  const [selectedCountryTemplate, setSelectedCountryTemplate] = useState<CountryTemplate>(() => 
    COUNTRY_TEMPLATES.find(t => t.id === savedSettings.countryTemplateId) || COUNTRY_TEMPLATES[0]
  );
  const [selectedBackground, setSelectedBackground] = useState<Background>(() => 
    BACKGROUNDS.find(b => b.id === savedSettings.backgroundId) || BACKGROUNDS[0]
  );
  const [selectedGender, setSelectedGender] = useState<GenderOption>(() => 
    GENDERS.find(g => g.id === savedSettings.genderId) || GENDERS[0]
  );
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>(() => 
    DOCUMENT_TYPES.find(d => d.id === savedSettings.documentTypeId) || DOCUMENT_TYPES[0]
  );
  const [selectedLighting, setSelectedLighting] = useState<LightingOption>(() => 
    LIGHTING_OPTIONS.find(l => l.id === savedSettings.lightingId) || LIGHTING_OPTIONS[0]
  );
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(() => 
    ASPECT_RATIOS.find(a => a.id === savedSettings.aspectRatioId) || ASPECT_RATIOS[0]
  );
  const [selectedRetouch, setSelectedRetouch] = useState<RetouchOption>(() => 
    RETOUCH_OPTIONS.find(r => r.id === savedSettings.retouchId) || RETOUCH_OPTIONS[1]
  );
  const [selectedQualityEnhancement, setSelectedQualityEnhancement] = useState<QualityEnhancementOption>(() => 
    QUALITY_ENHANCEMENT_OPTIONS.find(q => q.id === savedSettings.qualityId) || QUALITY_ENHANCEMENT_OPTIONS[0]
  );
  const [selectedSkinTone, setSelectedSkinTone] = useState<SkinToneOption>(() => 
    SKIN_TONE_OPTIONS.find(s => s.id === savedSettings.skinToneId) || SKIN_TONE_OPTIONS[0]
  );
  const [selectedExpression, setSelectedExpression] = useState<ExpressionOption>(() => 
    EXPRESSION_OPTIONS.find(e => e.id === savedSettings.expressionId) || EXPRESSION_OPTIONS[0]
  );
  const [allowAiCreativity, setAllowAiCreativity] = useState<boolean>(savedSettings.allowAiCreativity || false);
  // Set default custom prompt
  const [customPrompt, setCustomPrompt] = useState<string>(DEFAULT_CUSTOM_PROMPT);
  const [customBackgroundColor, setCustomBackgroundColor] = useState<string>(savedSettings.customBackgroundColor || '#4a90e2');

  // Custom Outfit State
  const [customOutfitFile, setCustomOutfitFile] = useState<File | null>(null);
  const [customOutfitPreview, setCustomOutfitPreview] = useState<string | null>(null);
  const customOutfitInputRef = useRef<HTMLInputElement>(null);

  // Image Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);

  // Zoom Modal State
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  
  // Derived active image
  const activeImage = useMemo(() => {
    if (!selectedImageId) return null;
    return history.find(item => item.id === selectedImageId)?.imageUrl || null;
  }, [history, selectedImageId]);

  // Memoized values for dynamic options and previews
  const filteredOutfits = useMemo(() => {
    const genderFiltered = OUTFITS.filter(outfit => !outfit.gender || outfit.gender === selectedGender.name || outfit.id === 'custom');
    
    if (selectedDocumentType.id === 'all') {
      return genderFiltered.map(o => ({ ...o, isRecommended: false }));
    }

    const recommended = genderFiltered
      .filter(o => o.documentTypes?.includes(selectedDocumentType.id))
      .map(o => ({ ...o, isRecommended: true }));
    
    const others = genderFiltered
      .filter(o => !o.documentTypes?.includes(selectedDocumentType.id))
      .map(o => ({ ...o, isRecommended: false }));
      
    return [...recommended, ...others];
  }, [selectedGender, selectedDocumentType]);
  
  const filteredHairstyles = useMemo(() => HAIRSTYLES.filter(style => !style.gender || style.gender === selectedGender.name), [selectedGender]);
  
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit>(() => {
      // Try to restore outfit selection if valid in current context
      const savedOutfitId = savedSettings.outfitId;
      const found = filteredOutfits.find(o => o.id === savedOutfitId);
      return found || filteredOutfits[0];
  });
  const [selectedHairstyle, setSelectedHairstyle] = useState<Hairstyle>(() => {
       const savedHairstyleId = savedSettings.hairstyleId;
       const found = filteredHairstyles.find(h => h.id === savedHairstyleId);
       return found || filteredHairstyles[0];
  });
  
  const uploadedImagePreview = useMemo(() => {
    if (!uploadedImage) return null;
    return URL.createObjectURL(uploadedImage);
  }, [uploadedImage]);

  // Persist settings to localStorage
  useEffect(() => {
      const settingsToSave = {
        countryTemplateId: selectedCountryTemplate.id,
        backgroundId: selectedBackground.id,
        genderId: selectedGender.id,
        documentTypeId: selectedDocumentType.id,
        lightingId: selectedLighting.id,
        aspectRatioId: selectedAspectRatio.id,
        retouchId: selectedRetouch.id,
        qualityId: selectedQualityEnhancement.id,
        skinToneId: selectedSkinTone.id,
        expressionId: selectedExpression.id,
        outfitId: selectedOutfit.id,
        hairstyleId: selectedHairstyle.id,
        allowAiCreativity,
        customBackgroundColor
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
  }, [
      selectedCountryTemplate, selectedBackground, selectedGender, selectedDocumentType, 
      selectedLighting, selectedAspectRatio, selectedRetouch, selectedQualityEnhancement, selectedSkinTone,
      selectedExpression, selectedOutfit, selectedHairstyle, allowAiCreativity, customBackgroundColor
  ]);

  // Effect for Country Template Selection
  useEffect(() => {
    if (selectedCountryTemplate.id === 'custom') return;

    const templateBg = BACKGROUNDS.find(b => b.id === selectedCountryTemplate.backgroundId);
    const templateAr = ASPECT_RATIOS.find(a => a.id === selectedCountryTemplate.aspectRatioId);

    if (templateBg) setSelectedBackground(templateBg);
    if (templateAr) setSelectedAspectRatio(templateAr);

  }, [selectedCountryTemplate]);

  // Effect for Gender or Document Type Change
  useEffect(() => {
    const updatedSelectedOutfit = filteredOutfits.find(o => o.id === selectedOutfit.id);

    if (updatedSelectedOutfit) {
        setSelectedOutfit(updatedSelectedOutfit);
    } else if (filteredOutfits.length > 0) {
        setSelectedOutfit(filteredOutfits.find(o => o.isRecommended) || filteredOutfits[0]);
    }
    
    const isCurrentHairstyleValid = filteredHairstyles.some(h => h.id === selectedHairstyle.id);
    if (!isCurrentHairstyleValid && filteredHairstyles.length > 0) {
      setSelectedOutfit(filteredOutfits.find(o => o.id === 'none') || filteredOutfits[0]);
    }
  }, [selectedGender, selectedDocumentType, filteredOutfits, filteredHairstyles]);


  // Effect for Image Upload and Analysis
  useEffect(() => {
    if (!uploadedImage) {
        setAnalysisResult(null);
        return;
    }
    const performAnalysis = async () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeImage(uploadedImage);
            setAnalysisResult(result);
            if (result.gender) {
                const detectedGender = GENDERS.find(g => g.name === result.gender);
                if (detectedGender) {
                    setSelectedGender(detectedGender);
                }
            }
        } catch (e) {
            console.error("Image analysis failed:", e);
        } finally {
            setIsAnalyzing(false);
        }
    };
    performAnalysis();
  }, [uploadedImage]);

  const handleImageUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file);
      setUploadedImage(compressed);
    } catch (e) {
      console.error("Image compression failed", e);
      setUploadedImage(file);
    }
    setHistory([]); // Clear history when a new image is uploaded
    setSelectedImageId(null);
  };

  const handleCustomOutfitUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCustomOutfitFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCustomOutfitPreview(previewUrl);
      
      const customOutfitOption = OUTFITS.find(o => o.id === 'custom');
      if (customOutfitOption) {
        setSelectedOutfit(customOutfitOption);
      }
    }
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleOutfitSelect = (outfit: Outfit) => {
    if (outfit.id === 'custom') {
      customOutfitInputRef.current?.click();
    }
    setSelectedOutfit(outfit);
  };

  const handleGenerateClick = async () => {
    if (!uploadedImage) {
      setError('Vui lòng tải ảnh lên trước.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const backgroundColor = selectedBackground.id === 'custom-color' 
        ? customBackgroundColor 
        : selectedBackground.name;
    
    const outfitSelection = {
        name: selectedOutfit.name,
        file: selectedOutfit.id === 'custom' ? customOutfitFile : null,
    };

    try {
      const result = await generateIdPhoto(
        uploadedImage,
        backgroundColor,
        outfitSelection,
        selectedGender.name,
        selectedHairstyle.name,
        selectedAspectRatio.name,
        selectedRetouch.name,
        selectedLighting.name,
        selectedExpression.name,
        selectedQualityEnhancement.id,
        selectedSkinTone.id,
        allowAiCreativity,
        customPrompt
      );
      if (result.image) {
        const newId = Date.now().toString();
        const newItem: GeneratedHistoryItem = {
            id: newId,
            imageUrl: result.image,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setHistory(prev => [newItem, ...prev]);
        setSelectedImageId(newId);
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

  const handleReset = () => {
    // Only reset transient state, not preferences
    setUploadedImage(null);
    setHistory([]);
    setSelectedImageId(null);
    setError(null);
    setIsLoading(false);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setCustomPrompt(DEFAULT_CUSTOM_PROMPT); // Reset to default prompt
    setCustomOutfitFile(null);
    setCustomOutfitPreview(null);
    // Reset to default template if needed, but keep user preferences mostly intact or reset to sensible defaults?
    // Let's reset to defaults for a "fresh start" feeling, but they will be saved to localstorage again on change.
    setSelectedCountryTemplate(COUNTRY_TEMPLATES[0]);
  };

  const handleClearHistory = () => {
      setHistory([]);
      setSelectedImageId(null);
  };

  const handleDownload = (format: 'jpeg' | 'png') => {
    if (!activeImage) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = activeImage;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(image, 0, 0);
        
        const mimeType = `image/${format}`;
        const fileExtension = format === 'jpeg' ? 'jpg' : 'png';
        
        const imageUrl = canvas.toDataURL(mimeType, 1.0);
        
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `${Date.now()}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
  };

  const isGenerateDisabled = !uploadedImage || isLoading || isAnalyzing;
  
  const tabContent = {
    'Phông nền & kích thước': (
        <>
            <div title="Chọn màu nền cho ảnh thẻ">
                <OptionSelector<Background>
                label="Màu nền"
                options={BACKGROUNDS}
                selectedOption={selectedBackground}
                onSelect={setSelectedBackground}
                disabled={selectedCountryTemplate.id !== 'custom'}
                renderOption={(option) => (
                    <div className="flex items-center">
                    {option.id === 'custom-color' ? (
                        <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 mr-3" style={{ backgroundColor: customBackgroundColor }}></div>
                    ) : (
                        <div className={`w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 ${option.tailwindColor} mr-3`}></div>
                    )}
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>
                    </div>
                )}
                />
            </div>
            {selectedBackground.id === 'custom-color' && selectedCountryTemplate.id === 'custom' && (
              <div className="mt-3 flex items-center gap-3" title="Nhấp để chọn màu nền tùy chỉnh">
                  <label htmlFor="custom-bg-color" className="text-sm font-medium text-slate-700 dark:text-slate-300">Màu tùy chọn:</label>
                  <div className="relative w-8 h-8 rounded-md border border-slate-300 dark:border-slate-600 overflow-hidden shadow-inner">
                      <div className="absolute inset-0" style={{ backgroundColor: customBackgroundColor }}></div>
                      <input
                      type="color"
                      id="custom-bg-color"
                      value={customBackgroundColor}
                      onChange={(e) => setCustomBackgroundColor(e.target.value)}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                      aria-label="Chọn màu nền tùy chỉnh"
                      />
                  </div>
                  <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">{customBackgroundColor.toUpperCase()}</span>
              </div>
            )}
            <div title="Tỷ lệ khung hình của ảnh đầu ra">
                <OptionSelector<AspectRatio>
                label="Tỷ lệ ảnh"
                options={ASPECT_RATIOS}
                selectedOption={selectedAspectRatio}
                onSelect={setSelectedAspectRatio}
                disabled={selectedCountryTemplate.id !== 'custom'}
                renderOption={(option) => <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>}
                />
            </div>
        </>
    ),
    'Trang phục & kiểu tóc': (
        <>
            <div title="Giới tính để gợi ý trang phục và kiểu tóc phù hợp">
                <OptionSelector<GenderOption>
                label="Giới tính"
                options={GENDERS}
                selectedOption={selectedGender}
                onSelect={setSelectedGender}
                renderOption={(option) => <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>}
                />
            </div>
            <div title="Loại giấy tờ để lọc trang phục phù hợp nhất">
                <OptionSelector<DocumentType>
                label="Loại giấy tờ (để gợi ý trang phục)"
                options={DOCUMENT_TYPES}
                selectedOption={selectedDocumentType}
                onSelect={setSelectedDocumentType}
                renderOption={(option) => <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>}
                />
            </div>
            <div title="Chọn trang phục thay thế">
                <OptionSelector<Outfit>
                label="Trang phục"
                options={filteredOutfits}
                selectedOption={selectedOutfit}
                onSelect={handleOutfitSelect}
                renderOption={(option) => {
                    const isCustom = option.id === 'custom';
                    const previewUrl = isCustom && customOutfitPreview ? customOutfitPreview : option.previewUrl;
                    return (
                        <div className="flex items-center">
                        <img src={previewUrl} alt={option.name} className={`w-8 h-8 rounded-md object-cover mr-3 ${isCustom && customOutfitPreview ? 'bg-slate-200 dark:bg-slate-700' : ''}`} />
                        <div className='flex-grow'>
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>
                        </div>
                        {option.isRecommended && <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 font-semibold px-2 py-0.5 rounded-full">Gợi ý</span>}
                        </div>
                    );
                }}
                />
            </div>
            <div title="Thay đổi kiểu tóc của người trong ảnh">
                <OptionSelector<Hairstyle>
                label="Kiểu tóc"
                options={filteredHairstyles}
                selectedOption={selectedHairstyle}
                onSelect={setSelectedHairstyle}
                renderOption={(option) => (
                    <div className="flex items-center">
                    <img src={option.previewUrl} alt={option.name} className="w-8 h-8 rounded-md object-cover mr-3" />
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>
                    </div>
                )}
                />
            </div>
        </>
    ),
    'Chỉnh sửa da & ánh sáng': (
        <>
            <div title="Tự động cân bằng và tối ưu ánh sáng">
                <OptionSelector<LightingOption>
                    label="Chỉnh sửa ánh sáng"
                    options={LIGHTING_OPTIONS}
                    selectedOption={selectedLighting}
                    onSelect={setSelectedLighting}
                    renderOption={(option) => (
                        <div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>
                        {option.id === 'on' && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pr-5">Tự động cân bằng ánh sáng, xóa bóng gắt trên mặt.</p>}
                    </div>
                    )}
                />
            </div>
            <div title="Mức độ làm mịn và chỉnh sửa da mặt">
                <OptionSelector<RetouchOption>
                    label="Chỉnh sửa da"
                    options={RETOUCH_OPTIONS}
                    selectedOption={selectedRetouch}
                    onSelect={setSelectedRetouch}
                    renderOption={(option) => (
                    <div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pr-5">{option.description}</p>
                    </div>
                    )}
                />
            </div>
            <div title="Điều chỉnh tông màu da">
                <OptionSelector<SkinToneOption>
                    label="Tông màu da"
                    options={SKIN_TONE_OPTIONS}
                    selectedOption={selectedSkinTone}
                    onSelect={setSelectedSkinTone}
                    renderOption={(option) => (
                    <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 mr-3 flex-shrink-0" style={{ backgroundColor: option.colorCode }}></div>
                        <div>
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>
                        </div>
                    </div>
                    )}
                />
            </div>
            <div title="Tăng độ nét và giảm nhiễu cho ảnh">
                <OptionSelector<QualityEnhancementOption>
                    label="Nâng cao chất lượng ảnh"
                    options={QUALITY_ENHANCEMENT_OPTIONS}
                    selectedOption={selectedQualityEnhancement}
                    onSelect={setSelectedQualityEnhancement}
                    renderOption={(option) => (
                    <div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pr-5">{option.description}</p>
                    </div>
                    )}
                />
            </div>
            <div title="Điều chỉnh biểu cảm khuôn mặt">
                <OptionSelector<ExpressionOption>
                    label="Điều chỉnh biểu cảm"
                    options={EXPRESSION_OPTIONS}
                    selectedOption={selectedExpression}
                    onSelect={setSelectedExpression}
                    renderOption={(option) => (
                    <div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pr-5">{option.description}</p>
                    </div>
                    )}
                />
            </div>
            
            <div className="mt-4 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg" title="Cho phép AI thay đổi nhẹ các đặc điểm để ảnh đẹp hơn">
                 <div className="flex items-center justify-between mb-2">
                    <label htmlFor="ai-creativity-toggle" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
                        <SparklesIcon className="w-5 h-5 text-purple-500"/>
                        Cho phép AI sáng tạo
                    </label>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            id="ai-creativity-toggle" 
                            className="sr-only peer" 
                            checked={allowAiCreativity} 
                            onChange={() => setAllowAiCreativity(!allowAiCreativity)} 
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {allowAiCreativity 
                        ? "AI sẽ tự do tinh chỉnh nhẹ các đường nét để ảnh đẹp hơn (khoảng 10-15%), nhưng có thể làm thay đổi nhẹ đặc điểm nhận dạng. Phù hợp nếu bạn muốn ảnh đẹp lung linh." 
                        : "AI sẽ tuân thủ nghiêm ngặt các đặc điểm khuôn mặt gốc để đảm bảo độ chính xác cao nhất cho giấy tờ tùy thân."
                    }
                </p>
            </div>
        </>
    )
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
      <input
        type="file"
        ref={customOutfitInputRef}
        onChange={handleCustomOutfitUpload}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg overflow-hidden border border-transparent dark:border-slate-700">
          <div className="p-6 sm:p-10">
            <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">Ảnh Thẻ Chuyên Nghiệp Trong Vài Giây</h2>
                <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Sử dụng AI để tạo ảnh thẻ đáp ứng mọi tiêu chuẩn chỉ với vài cú nhấp chuột.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left Column: Controls */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold mr-4 text-base">1</span>
                    Tải ảnh chân dung
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4 ml-12">Để có kết quả tốt nhất, hãy sử dụng ảnh chụp chính diện, đủ sáng.</p>
                  <div className="ml-12" title="Tải ảnh gốc lên tại đây">
                    <PhotoUploader onImageUpload={handleImageUpload} previewUrl={uploadedImagePreview} />
                    {(isAnalyzing || analysisResult) && (
                        <ImageAnalysisFeedback result={analysisResult} isLoading={isAnalyzing} />
                    )}
                    {/* Tips Section */}
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm flex items-center">
                        <LightbulbIcon className="w-4 h-4 mr-2"/> Mẹo chụp ảnh gốc tốt nhất
                      </h4>
                      <ul className="list-disc list-inside text-xs text-blue-700 dark:text-blue-200 space-y-1 ml-1">
                         <li>Chụp ở nơi có ánh sáng tự nhiên tốt, mặt sáng đều, không bị bóng.</li>
                         <li>Nhìn thẳng vào camera, mắt mở to, biểu cảm trung tính.</li>
                         <li>Không đeo kính râm, kính màu. Vén tóc gọn gàng để lộ tai và trán.</li>
                         <li>Sử dụng ảnh gốc chất lượng cao, chưa qua chỉnh sửa app làm đẹp.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div id="step2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold mr-4 text-base">2</span>
                    Tùy chỉnh thông minh
                  </h3>
                   <p className="text-slate-500 dark:text-slate-400 mb-4 ml-12">Chọn mẫu có sẵn hoặc tùy chỉnh theo ý muốn của bạn.</p>
                  <div className="space-y-6 ml-12">
                     <div title="Chọn mẫu cài đặt sẵn theo quốc gia">
                        <OptionSelector<CountryTemplate>
                        label="Mẫu theo quốc gia"
                        options={COUNTRY_TEMPLATES}
                        selectedOption={selectedCountryTemplate}
                        onSelect={setSelectedCountryTemplate}
                        renderOption={(option) => (
                            <div className="flex items-center">
                            <GlobeIcon className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400" />
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.name}</span>
                            </div>
                        )}
                        />
                     </div>
                    <TabbedControls tabs={tabContent} />
                  </div>
                </div>
              </div>

              {/* Right Column: Output */}
              <div className="sticky top-24">
                 <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                     <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 text-center">
                       {activeImage ? 'So sánh kết quả' : isLoading ? 'AI đang sáng tạo...' : 'Xem trước kết quả'}
                    </h3>
                    <div className="aspect-square relative">
                      {isLoading && <Loader />}
                      {!isLoading && activeImage && uploadedImagePreview && (
                        <ResultView 
                            originalImageUrl={uploadedImagePreview} 
                            generatedImageUrl={activeImage} 
                            onZoomRequest={setZoomedImageUrl}
                        />
                      )}
                      {!isLoading && !activeImage && (
                        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800/50 p-4">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-4 text-base font-semibold text-slate-500 dark:text-slate-400">Kết quả của bạn sẽ xuất hiện ở đây</p>
                            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Hoàn tất các bước để bắt đầu tạo ảnh.</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 space-y-4">
                        {activeImage && (
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleDownload('jpeg')}
                                    className="w-full bg-blue-600 text-white text-center font-bold py-3 px-2 rounded-lg hover:bg-blue-700 transition-colors text-sm shadow"
                                    title="Tải ảnh xuống dưới dạng tệp JPG"
                                >
                                    Tải JPG
                                </button>
                                <button
                                    onClick={() => handleDownload('png')}
                                    className="w-full bg-sky-500 text-white text-center font-bold py-3 px-2 rounded-lg hover:bg-sky-600 transition-colors text-sm shadow"
                                    title="Tải ảnh xuống dưới dạng tệp PNG chất lượng cao"
                                >
                                    Tải PNG
                                </button>
                            </div>
                        )}

                        {!isLoading && uploadedImage && (
                             <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleGenerateClick}
                                    disabled={isGenerateDisabled}
                                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center text-base shadow"
                                    title="Tạo phiên bản mới với cài đặt hiện tại"
                                >
                                    {activeImage ? 'Tạo thêm phiên bản' : 'Tạo ảnh ngay'}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="w-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-100 text-center font-bold py-3 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-base"
                                    title="Xóa ảnh hiện tại và bắt đầu lại"
                                >
                                    Tạo mới
                                </button>
                            </div>
                        )}
                        
                        {!activeImage && (
                             <div>
                                <label htmlFor="custom-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Yêu cầu thêm (tùy chọn)</label>
                                <textarea
                                    id="custom-prompt"
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    placeholder="Ví dụ: làm cho tóc gọn gàng hơn, xóa kính..."
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    rows={4}
                                    title="Nhập hướng dẫn cụ thể cho AI (không bắt buộc)"
                                />
                            </div>
                        )}

                        {!isLoading && !activeImage && !uploadedImage && (
                            <button
                                onClick={handleGenerateClick}
                                disabled={isGenerateDisabled}
                                className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg shadow-blue-500/30"
                                title="Bắt đầu quá trình tạo ảnh"
                            >
                                Tạo ảnh ngay
                            </button>
                        )}

                        {/* Generation History */}
                        {history.length > 0 && (
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lịch sử tạo ({history.length})</h4>
                                    <button onClick={handleClearHistory} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1" title="Xóa toàn bộ lịch sử">
                                        <TrashIcon className="w-3 h-3"/> Xóa
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {history.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedImageId(item.id)}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImageId === item.id 
                                                ? 'border-blue-500 ring-2 ring-blue-500/30' 
                                                : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                                            }`}
                                            title={`Ảnh tạo lúc ${item.timestamp}`}
                                        >
                                            <img src={item.imageUrl} alt={`Generated at ${item.timestamp}`} className="w-full h-full object-cover" />
                                            {selectedImageId === item.id && (
                                                <div className="absolute top-0 right-0 bg-blue-500 text-white p-0.5 rounded-bl">
                                                    <CheckIcon className="w-3 h-3" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
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
