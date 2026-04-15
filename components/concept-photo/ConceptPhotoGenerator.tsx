
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PortraitUploader } from './PortraitUploader';
import { FamilyUploader } from './FamilyUploader';
import { ReferenceModeSelector } from './ReferenceModeSelector';
import { ConceptSelector } from './ConceptSelector';
import { StyleReferenceUploader } from './StyleReferenceUploader';
import { ResultGrid } from './ResultGrid';
import { GenerationProgress } from './GenerationProgress';
import { generateConceptPhoto, analyzeStyleFromImage } from '../../services/geminiService';
import { conceptCategories } from '../../data/conceptData';
import { compressImage } from '../../utils/imageUtils';
import { SparklesIcon } from '../icons/SparklesIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { AddConceptModal } from './AddConceptModal';
import type { Concept, Pose, UploadedPortrait, GeneratedImage, ReferenceMode, FamilyMember, ConceptCategory } from './types';

const MAX_RETRIES = 3;

// Basic poses for style reference mode
const BASIC_POSES: Omit<Pose, 'id'>[] = [
    { name: 'Chân dung cận mặt', prompt: 'a beautiful headshot portrait of [face1], upper chest up, looking at the camera, {style}' },
    { name: 'Đứng toàn thân', prompt: 'a beautiful full-body shot of [face1] standing, {style}' },
    { name: 'Ngồi trên ghế', prompt: 'a beautiful shot of [face1] sitting on a chair, {style}' },
    { name: 'Nhìn nghiêng', prompt: 'a beautiful profile shot of [face1] looking to the side, {style}' },
    { name: 'Chân dung 3/4', prompt: 'a beautiful three-quarters portrait of [face1], {style}' },
    { name: 'Đi bộ', prompt: 'a beautiful shot of [face1] walking, in motion, {style}' },
    { name: 'Tựa vào tường', prompt: 'a beautiful shot of [face1] leaning against a wall, {style}' },
    { name: 'Nằm thư giãn', prompt: 'a beautiful shot of [face1] lying down relaxedly, {style}' },
];

export const ConceptPhotoGenerator: React.FC = () => {
    const [uploadedPortraits, setUploadedPortraits] = useState<UploadedPortrait[]>([]);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [referenceMode, setReferenceMode] = useState<ReferenceMode>('concept');
    const [styleReference, setStyleReference] = useState<File | null>(null);
    const [styleReferencePreview, setStyleReferencePreview] = useState<string | null>(null);
    const [styleOutfitPrompt, setStyleOutfitPrompt] = useState<string>('');
    const [styleContextPrompt, setStyleContextPrompt] = useState<string>('');
    const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
    const [selectedPoses, setSelectedPoses] = useState<Pose[]>([]);
    
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const [allConcepts, setAllConcepts] = useState<ConceptCategory[]>(conceptCategories);
    const [isAddConceptModalOpen, setIsAddConceptModalOpen] = useState(false);

    const isGeneratingRef = useRef(false);

    useEffect(() => {
        try {
            const storedConceptsJSON = localStorage.getItem('userConcepts');
            const userConcepts: Concept[] = storedConceptsJSON ? JSON.parse(storedConceptsJSON) : [];
            
            const mergedCategories = JSON.parse(JSON.stringify(conceptCategories));

            if (userConcepts.length > 0) {
                const customCategoryId = 'user-custom';
                let customCategory = mergedCategories.find((c: ConceptCategory) => c.id === customCategoryId);

                if (!customCategory) {
                    customCategory = { id: customCategoryId, name: 'Tạo bởi bạn', concepts: [] };
                    mergedCategories.push(customCategory);
                }
                
                customCategory.concepts = [...userConcepts];
            }
            
            setAllConcepts(mergedCategories);
        } catch (error) {
            console.error("Failed to load or merge user concepts", error);
            setAllConcepts(conceptCategories);
        }
    }, []);

    useEffect(() => {
        // Reset selections when switching modes
        setSelectedConcept(null);
        setStyleReference(null);
        setStyleReferencePreview(null);
        setStyleOutfitPrompt('');
        setStyleContextPrompt('');
        setSelectedPoses([]);
        setUploadedPortraits([]);
        setFamilyMembers([]);
    }, [referenceMode]);

    const handlePortraitsChange = async (files: File[]) => {
        const processedFiles: UploadedPortrait[] = [];
        for (const file of files) {
            const id = `${file.name}-${file.lastModified}-${Math.random()}`;
            processedFiles.push({ id, file, status: 'compressing', previewUrl: URL.createObjectURL(file) });
        }
        setUploadedPortraits(processedFiles);

        for (const portrait of processedFiles) {
            try {
                const compressedFile = await compressImage(portrait.file);
                setUploadedPortraits(prev => prev.map(p => p.id === portrait.id ? { ...p, file: compressedFile, status: 'done' } : p));
            } catch (err) {
                console.error('Compression failed:', err);
                setUploadedPortraits(prev => prev.map(p => p.id === portrait.id ? { ...p, status: 'error' } : p));
            }
        }
    };
    
    const handleFamilyChange = async (members: FamilyMember[]) => {
        setFamilyMembers(members);
        const newMembers = members.filter(m => m.status === 'compressing');

        for (const member of newMembers) {
             try {
                const compressedFile = await compressImage(member.file);
                setFamilyMembers(prev => prev.map(m => m.id === member.id ? { ...m, file: compressedFile, status: 'done' } : m));
            } catch (err) {
                console.error('Compression failed:', err);
                setFamilyMembers(prev => prev.map(m => m.id === member.id ? { ...m, status: 'error' } : m));
            }
        }
    };

    const handleStyleFileChange = (file: File | null) => {
        setStyleReference(file);
        if (file) {
            setStyleReferencePreview(URL.createObjectURL(file));
            // Clear text prompts so the image is the source of truth
            setStyleOutfitPrompt('');
            setStyleContextPrompt('');
        } else {
            setStyleReferencePreview(null);
        }
    };

    const handleStopGeneration = () => {
        isGeneratingRef.current = false;
        setIsLoading(false);
        setProgressMessage('Đã dừng tạo ảnh.');
    };

    const runGeneration = async (
        promptsToRun: Pose[], 
        conceptName: string, 
        portraitsToUse: (UploadedPortrait | FamilyMember)[], 
        isFamily: boolean, 
        simpleFamilyMode: boolean = false,
        styleReferenceImage?: File | null
    ) => {
        setIsLoading(true);
        isGeneratingRef.current = true;
        setError(null);
        setGeneratedImages([]);

        let generatedCount = 0;
        for (const currentPose of promptsToRun) {
            if (!isGeneratingRef.current) break;

            setProgress((generatedCount / promptsToRun.length) * 100);
            setProgressMessage(`Đang tạo ảnh ${generatedCount + 1} / ${promptsToRun.length}: ${currentPose.name}`);

            let success = false;
            for (let i = 0; i < MAX_RETRIES; i++) {
                if (!isGeneratingRef.current) break;
                try {
                    const result = await generateConceptPhoto(
                        portraitsToUse, 
                        currentPose.prompt, 
                        isFamily, 
                        simpleFamilyMode, 
                        styleReferenceImage || undefined
                    );
                    if (result.image) {
                        setGeneratedImages(prev => [...prev, {
                            id: `${conceptName}-${currentPose.id || generatedCount}`,
                            url: result.image,
                            prompt: currentPose.prompt,
                            name: `${conceptName} - ${currentPose.name}`
                        }]);
                        success = true;
                        break; 
                    } else {
                        console.warn(`Attempt ${i+1} failed for "${currentPose.name}":`, result.text);
                         if (i === MAX_RETRIES - 1) { // Last attempt failed
                            setError(`Không thể tạo ảnh "${currentPose.name}". Yêu cầu có thể bị chặn. ${result.text || ''}`);
                        }
                    }
                } catch (e) {
                    console.error(`Attempt ${i+1} error for "${currentPose.name}":`, e);
                }
                if (i < MAX_RETRIES - 1) {
                    await new Promise(res => setTimeout(res, 1000 * (2 ** i)));
                }
            }

            if (!success) {
                console.error(`Failed to generate image for prompt: ${currentPose.name} after ${MAX_RETRIES} retries.`);
            }
            
            generatedCount++;
            if (promptsToRun.length > 1) {
                await new Promise(res => setTimeout(res, 2000)); 
            }
        }

        setProgress(100);
        setProgressMessage(isGeneratingRef.current ? 'Hoàn tất!' : 'Đã dừng.');
        setIsLoading(false);
        isGeneratingRef.current = false;
    };
    
    const handleGenerateClick = async () => {
        if (referenceMode === 'concept') {
            if (!selectedConcept || selectedPoses.length === 0) {
                setError('Vui lòng chọn một concept và ít nhất một dáng chụp.');
                return;
            }
            const portraitsToUse = selectedConcept.isFamilyPrompt 
                ? familyMembers.filter(p => p.status === 'done')
                : uploadedPortraits.filter(p => p.status === 'done');
                
            if (portraitsToUse.length === 0) {
                 setError('Vui lòng tải lên và chờ xử lý ảnh chân dung.');
                 return;
            }
            if(!selectedConcept.isFamilyPrompt && selectedConcept.requiredPortraits > portraitsToUse.length) {
                setError(`Concept "${selectedConcept.name}" yêu cầu ${selectedConcept.requiredPortraits} ảnh chân dung, nhưng bạn chỉ tải lên ${portraitsToUse.length}.`);
                return;
            }
            runGeneration(selectedPoses, selectedConcept.name, portraitsToUse, !!selectedConcept.isFamilyPrompt, selectedConcept.simpleFamilyMode);
        } else { // Style reference mode
            const readyPortraits = uploadedPortraits.filter(p => p.status === 'done');
            if (readyPortraits.length === 0) {
                setError('Vui lòng tải lên ảnh chân dung.');
                return;
            }
            if (!styleReference && !styleOutfitPrompt.trim() && !styleContextPrompt.trim()) {
                setError('Vui lòng tải ảnh hoặc nhập mô tả trang phục/phong cách.');
                return;
            }

            setIsLoading(true);
            setProgressMessage('Đang chuẩn bị...');
            
            let finalStyleInstructions = '';

            if (styleReference) {
                setProgressMessage('Đang phân tích phong cách từ ảnh...');
                try {
                    const analyzedStyle = await analyzeStyleFromImage(styleReference);
                    if(analyzedStyle) {
                        const outfitOverride = styleOutfitPrompt.trim() ? `CRUCIAL OUTFIT OVERRIDE: The subject MUST be wearing: "${styleOutfitPrompt}". This is the most important instruction regarding clothing.` : 'The outfit from the style reference image MUST be kept consistent.';
                        finalStyleInstructions = `The overall style is: "${analyzedStyle}". ${outfitOverride}`;
                        
                        if (!styleContextPrompt) {
                            setStyleContextPrompt(analyzedStyle);
                        }
                    } else {
                        throw new Error("Phân tích không trả về kết quả.");
                    }
                } catch (e) {
                    setError('Lỗi khi phân tích ảnh phong cách.');
                    setIsLoading(false);
                    return;
                }
            } else {
                const outfitDescription = styleOutfitPrompt.trim() ? `The subject MUST be wearing this specific outfit: "${styleOutfitPrompt}".` : '';
                const contextDescription = styleContextPrompt.trim() ? `The overall style, mood, and context is: "${styleContextPrompt}".` : '';
                const consistencyInstruction = "CRUCIAL: The specified outfit MUST remain completely consistent across all generated images and poses.";
                
                const instructions = [outfitDescription, contextDescription];
                if (styleOutfitPrompt.trim()) {
                    instructions.push(consistencyInstruction);
                }
                finalStyleInstructions = instructions.filter(Boolean).join(' ');
            }


            if(finalStyleInstructions.trim()) {
                const stylePrompts: Pose[] = BASIC_POSES.map((p, i) => ({
                    id: `style-${i}`,
                    name: p.name,
                    prompt: p.prompt.replace('{style}', finalStyleInstructions),
                }));
                runGeneration(stylePrompts, 'Phong cách tùy chỉnh', readyPortraits, false, false, styleReference);
            } else {
                setError('Không thể xác định phong cách.');
                setIsLoading(false);
            }
        }
    };
    
    const getReadyPortraitsCount = () => {
        if (referenceMode === 'concept' && selectedConcept?.isFamilyPrompt) {
            return familyMembers.filter(p => p.status === 'done').length;
        }
        return uploadedPortraits.filter(p => p.status === 'done').length;
    }

    const isGenerateDisabled = isLoading || getReadyPortraitsCount() === 0;

    const handleSaveConcept = (newConcept: Concept) => {
        try {
            const storedConceptsJSON = localStorage.getItem('userConcepts');
            const userConcepts: Concept[] = storedConceptsJSON ? JSON.parse(storedConceptsJSON) : [];
            
            userConcepts.push(newConcept);
            localStorage.setItem('userConcepts', JSON.stringify(userConcepts));

            const nextConcepts = JSON.parse(JSON.stringify(allConcepts));
            const customCategoryId = 'user-custom';
            let customCategory = nextConcepts.find((c: ConceptCategory) => c.id === customCategoryId);
             if (!customCategory) {
                customCategory = { id: customCategoryId, name: 'Tạo bởi bạn', concepts: [] };
                nextConcepts.push(customCategory);
            }
            customCategory.concepts.push(newConcept);
            setAllConcepts(nextConcepts);
            
            setIsAddConceptModalOpen(false);
            setSelectedConcept(newConcept);
        } catch (error) {
            console.error("Failed to save user concept", error);
            setError("Không thể lưu concept mới.");
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen">
            <main className="container mx-auto px-4 py-8 sm:py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white relative inline-block">
                        Tạo ảnh concept DIP
                        <SparklesIcon className="w-8 h-8 absolute -top-2 -right-6 text-purple-500 dark:text-purple-400" />
                    </h1>
                    <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Biến ảnh chân dung thành những tác phẩm nghệ thuật độc đáo.</p>
                </div>
                
                <div className="grid lg:grid-cols-[400px_1fr] gap-10 items-start">
                    {/* Left Column: Controls */}
                    <div className="lg:sticky lg:top-8 lg:self-start space-y-8">
                        <section className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                            <h2 className="flex items-center text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold mr-4 text-base">1</span>
                                Tải Lên Ảnh Chân Dung
                            </h2>
                            {referenceMode === 'concept' && selectedConcept?.isFamilyPrompt ? (
                                <FamilyUploader 
                                    familyMembers={familyMembers} 
                                    onFamilyChange={handleFamilyChange}
                                    maxMembers={selectedConcept.maxPortraits}
                                />
                            ) : (
                                <PortraitUploader onFilesChange={handlePortraitsChange} uploadedPortraits={uploadedPortraits} />
                            )}
                        </section>

                        <section className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                             <h2 className="flex items-center text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold mr-4 text-base">2</span>
                                Chọn Nguồn Tham Chiếu
                            </h2>
                            <ReferenceModeSelector mode={referenceMode} setMode={setReferenceMode} />
                        </section>

                        <section className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="flex items-center text-xl font-semibold text-slate-900 dark:text-slate-100">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold mr-4 text-base">3</span>
                                    {referenceMode === 'concept' ? 'Chọn Concept' : 'Cung Cấp Phong Cách'}
                                </h2>
                                {referenceMode === 'concept' && (
                                    <button 
                                        onClick={() => setIsAddConceptModalOpen(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900"
                                        title="Thêm concept của riêng bạn"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Thêm mới
                                    </button>
                                )}
                            </div>
                            {referenceMode === 'concept' ? (
                                <ConceptSelector 
                                    concepts={allConcepts} 
                                    selectedConcept={selectedConcept}
                                    setSelectedConcept={setSelectedConcept}
                                    selectedPoses={selectedPoses}
                                    setSelectedPoses={setSelectedPoses}
                                />
                            ) : (
                                <StyleReferenceUploader 
                                    onFileChange={handleStyleFileChange}
                                    outfitPrompt={styleOutfitPrompt}
                                    onOutfitPromptChange={setStyleOutfitPrompt}
                                    stylePrompt={styleContextPrompt}
                                    onStylePromptChange={setStyleContextPrompt}
                                    stylePreviewUrl={styleReferencePreview}
                                />
                            )}
                        </section>

                         <button
                            onClick={handleGenerateClick}
                            disabled={isGenerateDisabled}
                            className="w-full py-4 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400/50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg shadow-purple-500/30"
                          >
                            <SparklesIcon className="w-5 h-5 mr-3" />
                            {isLoading ? 'Đang tạo...' : 'Tạo Ảnh'}
                          </button>
                    </div>

                    {/* Right Column: Results */}
                    <div className="min-w-0">
                       {(isLoading || generatedImages.length > 0) ? (
                           <>
                                {isLoading && (
                                    <GenerationProgress 
                                        progress={progress} 
                                        message={progressMessage} 
                                        onStop={handleStopGeneration} 
                                    />
                                )}
                                <ResultGrid images={generatedImages} />
                           </>
                       ) : (
                           <div className="h-full min-h-[60vh] flex items-center justify-center bg-white dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8">
                                <div className="text-center">
                                    <p className="text-slate-500 dark:text-slate-400 text-lg">Kết quả của bạn sẽ xuất hiện ở đây.</p>
                                    <p className="text-slate-400 dark:text-slate-500 mt-2">Hãy hoàn tất các bước bên trái để bắt đầu sáng tạo.</p>
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
            </main>
            <AddConceptModal 
                isOpen={isAddConceptModalOpen}
                onClose={() => setIsAddConceptModalOpen(false)}
                onSave={handleSaveConcept}
            />
        </div>
    );
};
