
import { GoogleGenAI, Modality, Type, GenerateContentResponse, ThinkingLevel } from "@google/genai";
import type { ImageAnalysisResult, Gender } from "../types";
import type { RelightSettings, Quality } from '../components/pro-ai-relight/types';
import type { UploadedPortrait, FamilyMember, MemberRole } from '../components/concept-photo/types';


const getApiKey = () => {
    const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!key) {
        console.warn("API_KEY is missing. Please set it in your environment variables.");
    }
    return key || "MISSING_API_KEY";
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

// Model Constants - Optimized for high-quota free tier
const MODELS = {
    TEXT_FAST: 'gemini-3-flash-preview',
    TEXT_SMART: 'gemini-3-flash-preview',
    TEXT_PRO: 'gemini-3-flash-preview', // Use Flash even for Pro to save quota
    IMAGE_GEN: 'gemini-2.5-flash-image', // Nano Banana supports image generation
    IMAGE_PRO: 'gemini-3.1-flash-image-preview',
    IMAGEN: 'imagen-3.0-generate-001'
};

// Chat types
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export interface ChatResponse {
  text: string;
  groundingMetadata?: any;
}

// Helper for delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry operation wrapper
async function retryOperation<T>(operation: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
    try {
        return await operation();
    } catch (error: any) {
        const msg = error instanceof Error ? error.message : String(error);
        const isRateLimit = 
            msg.includes('429') || 
            msg.includes('quota') || 
            msg.includes('RESOURCE_EXHAUSTED') || 
            error?.status === 429 || 
            error?.code === 429;
            
        if (retries > 0 && isRateLimit) {
            console.warn(`Rate limit hit. Retrying in ${delay}ms... (${retries} attempts left)`);
            await wait(delay);
            return retryOperation(operation, retries - 1, delay * 2); // Exponential backoff
        }
        throw error;
    }
}

const handleGeminiError = (error: unknown) => {
    console.error("Gemini API Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    const errObj = error as any;

    if (
        msg.includes('403') || 
        msg.includes('API_KEY_INVALID') || 
        msg.includes('invalid API key') ||
        errObj?.status === 403
    ) {
        throw new Error("Lỗi xác thực (403): API Key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại cấu hình API Key trong cài đặt ứng dụng.");
    }

    if (
        msg.includes('429') || 
        msg.includes('quota') || 
        msg.includes('RESOURCE_EXHAUSTED') || 
        errObj?.status === 429 || 
        errObj?.code === 429
    ) {
        throw new Error("Hệ thống đang quá tải (Lỗi 429). Bạn đã hết lượt sử dụng miễn phí của Google Gemini. Vui lòng thử lại sau ít phút.");
    }

    if (
        msg.includes('500') ||
        msg.includes('xhr error') ||
        msg.includes('Rpc failed') ||
        msg.includes('network') ||
        errObj?.status === 500 ||
        errObj?.code === 500 ||
        errObj?.code === 6 
    ) {
        throw new Error("Lỗi kết nối đến máy chủ AI (Lỗi 500). Vui lòng kiểm tra kết nối mạng hoặc thử lại với ảnh dung lượng nhỏ hơn.");
    }
    
    throw error;
};

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

async function dataUrlToGenerativePart(dataUrl: string) {
    const [header, data] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
    return {
      inlineData: { data, mimeType },
    };
}

// Helper to safely parse image model responses
const parseImageModelResponse = (response: GenerateContentResponse): { image: string | null; text: string | null } => {
    let generatedImage: string | null = null;
    let generatedText: string | null = null;

    if (!response.candidates || response.candidates.length === 0) {
        return { image: null, text: "The AI model did not return a response. This could be due to a network issue or an internal error." };
    }

    const candidate = response.candidates[0];

    if (candidate.finishReason === 'SAFETY') {
        return { image: null, text: "The request was blocked due to safety settings. Please modify your prompt or image." };
    }
    
    if (candidate.finishReason === 'RECITATION') {
         return { image: null, text: "The request was blocked due to recitation policy." };
    }
    
    if (!candidate.content || !candidate.content.parts) {
         return { image: null, text: "The AI model returned an empty or blocked response. Please try again." };
    }

    for (const part of candidate.content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            generatedImage = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        } else if (part.text) {
            generatedText = part.text;
        }
    }

    return { image: generatedImage, text: generatedText };
};

export async function enhancePrompt(originalPrompt: string): Promise<string> {
  if (!originalPrompt.trim()) return '';
  
  const prompt = `You are an expert AI prompt engineer. 
  Rewrite the following user prompt to be more descriptive, artistic, and detailed to get the best possible visual result from an AI image generator.
  Enhance lighting, texture, mood, and composition descriptions.
  Keep the response in the same language as the original input (Vietnamese or English).
  Return ONLY the enhanced prompt text, no explanations.
  
  User Prompt: "${originalPrompt}"`;

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: MODELS.TEXT_FAST,
      contents: { parts: [{ text: prompt }] }
    }));
    return response.text?.trim() || originalPrompt;
  } catch (e) {
    console.error("Enhance prompt error:", e);
    return originalPrompt;
  }
}

export async function analyzeImage(imageFile: File): Promise<ImageAnalysisResult> {
  const imagePart = await fileToGenerativePart(imageFile);
  const prompt = `Bạn là một chuyên gia AI kiểm tra ảnh hộ chiếu/visa với độ chính xác cao. Phân tích kỹ lưỡng hình ảnh được cung cấp và thực hiện ba nhiệm vụ:
1.  **Xác định giới tính:** Nhận diện giới tính của người trong ảnh.
2.  **Ước tính độ tuổi:** Cung cấp một khoảng tuổi ước tính (ví dụ: 25-30 tuổi).
3.  **Kiểm tra hợp lệ:** Đánh giá xem ảnh có khả năng bị từ chối khi nộp hồ sơ chính thức hay không dựa trên các tiêu chí nghiêm ngặt sau.

**Tiêu chí kiểm tra:**
- **Phông nền:** Nền phải là màu trơn, trung tính, không có bóng hoặc hoa văn.
- **Ánh sáng:** Khuôn mặt phải được chiếu sáng đều, không có bóng tối che khuất đường nét.
- **Tư thế:** Người phải nhìn thẳng vào máy ảnh, đầu thẳng, không nghiêng.
- **Biểu cảm:** Biểu cảm phải trung tính, mắt mở to, miệng ngậm.
- **Vật cản:** Khuôn mặt phải hoàn toàn rõ ràng, không bị tóc che mắt/chân mày, kính không lóa.
- **Chất lượng:** Ảnh phải rõ nét, không mờ, nhiễu hạt.

**Định dạng đầu ra:**
Cung cấp kết quả dưới dạng một đối tượng JSON duy nhất.
- Ở cấp cao nhất, thêm trường "gender" (giá trị "Nam" hoặc "Nữ") và trường "age" (ví dụ: "25-30 tuổi").
- Thêm một trường "feedback" là một mảng các đối tượng. Đối với mỗi tiêu chí kiểm tra, tạo một đối tượng trong mảng này với:
  - "isGood": true nếu đạt, false nếu không đạt.
  - "message": Một câu phản hồi. Nếu không đạt, bắt đầu bằng "Ảnh bạn có thể bị từ chối vì...".`;
  
  try {
      const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
        model: MODELS.TEXT_PRO,
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gender: { 
                type: Type.STRING, 
                description: "Giới tính được phát hiện, chỉ có thể là 'Nam' hoặc 'Nữ'." 
              },
              age: {
                type: Type.STRING,
                description: "Độ tuổi ước tính của người trong ảnh, ví dụ: '25-30 tuổi'."
              },
              feedback: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    isGood: { type: Type.BOOLEAN },
                    message: { type: Type.STRING },
                  },
                  required: ['isGood', 'message']
                },
              },
            },
            required: ['gender', 'feedback']
          },
        },
      }));

      const jsonString = response.text?.trim() || "{}";
      const cleanedJsonString = jsonString.replace(/^```json\s*|```\s*$/g, '');
      const parsed = JSON.parse(cleanedJsonString);
      if (parsed.gender !== 'Nam' && parsed.gender !== 'Nữ') {
          delete parsed.gender;
      }
      return parsed as ImageAnalysisResult;
  } catch (e) {
    handleGeminiError(e);
    return {
      feedback: [{ isGood: false, message: "Không thể phân tích ảnh. Vui lòng thử lại." }]
    };
  }
}

export async function generateIdPhoto(
  imageFile: File,
  background: string,
  outfit: { name: string; file?: File | null },
  gender: string,
  hairstyle: string,
  aspectRatio: string,
  retouch: string,
  lighting: string,
  expression: string,
  qualityEnhancement: string,
  skinTone: string, // Added skinTone parameter
  allowAiCreativity: boolean,
  customPrompt: string
): Promise<{ image: string | null; text: string | null }> {
  const imagePart = await fileToGenerativePart(imageFile);
  const parts: ({ inlineData: { data: string; mimeType: string; } } | { text: string; })[] = [imagePart];

  let retouchPromptPart = '';
  switch (retouch) {
    case 'Nhẹ nhàng':
      retouchPromptPart = `**Skin Retouching (Gentle):** Perform gentle skin retouching. Smooth out minor blemishes, spots, or redness. Even out the skin tone slightly but you MUST preserve the natural skin texture. **Crucially, maintain the original skin tone and color; do not make it warmer or otherwise alter its hue.** The result should look natural, not overly airbrushed or fake.`;
      break;
    case 'Chuyên nghiệp':
      retouchPromptPart = `**Skin Retouching (Professional):** Apply professional-level skin retouching. Smooth the skin and even out the skin tone. **It is absolutely essential to maintain the original skin tone and color palette of the person. Do not make the skin tone warmer, cooler, or change its hue in any way.** Perform subtle dodging and burning to enhance facial contours (cheeks, nose, jawline) and add dimension, making the face look more defined. It is CRITICAL that you preserve essential details like skin texture for a realistic yet polished and high-end look.`;
      break;
    case 'Frequency Separation (FS)':
      retouchPromptPart = `**Skin Retouching (Frequency Separation):** Apply an advanced frequency separation technique for skin retouching.
1.  **Separation:** Conceptually separate the image into two layers: a high-frequency layer containing fine details and texture (pores, fine lines, hair) and a low-frequency layer containing color and tone information.
2.  **Low-Frequency Editing (Tone/Color):** On the low-frequency layer, meticulously smooth out blotchy skin tones, correct uneven coloration, and reduce the appearance of blemishes and acne without affecting the texture. The goal is to create a perfectly even and smooth color gradient on the skin.
3.  **High-Frequency Preservation (Texture):** The high-frequency layer MUST be preserved. It is absolutely critical to retain all natural skin texture, including pores and fine details. Do not blur or soften this layer.
4.  **Recombination:** Combine the edited low-frequency layer with the preserved high-frequency layer.
**Final Result:** The final image must have flawlessly smooth skin tone and color, with all blemishes removed, while retaining 100% of the natural, sharp skin texture. The result should be extremely high-end and realistic, avoiding any plastic or airbrushed look. As with all other retouching, **you must maintain the original skin tone and color; do not make it warmer or otherwise alter its hue.**`;
      break;
    default: // 'Không'
      break;
  }

  let qualityPromptPart = '';
  switch (qualityEnhancement) {
    case 'gentle':
      qualityPromptPart = `**Quality Enhancement (Gentle):** Subtly enhance image details and sharpness. Reduce digital noise slightly while maintaining a natural look.`;
      break;
    case 'advanced':
      qualityPromptPart = `**Quality Enhancement (Super Resolution 8x):** Apply simulated 8x Super Resolution upscaling. Aggressively enhance fine details (hair, skin pores, fabric weave) and sharpness to achieve a crisp, ultra-high-definition look suitable for large format printing. Apply strong noise reduction to ensure a clean, grain-free image while hallucinating plausible high-frequency textures.`;
      break;
    default:
      break;
  }

  let skinTonePromptPart = '';
  switch (skinTone) {
      case 'fair':
          skinTonePromptPart = `**Skin Tone Adjustment:** Adjust the subject's skin tone to be **Fair/Light**. Ensure a bright, porcelain-like finish while maintaining realistic texture.`;
          break;
      case 'rosy':
          skinTonePromptPart = `**Skin Tone Adjustment:** Adjust the subject's skin tone to have a **Rosy/Pinkish** undertone. Make the complexion look fresh, healthy, and vibrant.`;
          break;
      case 'warm':
          skinTonePromptPart = `**Skin Tone Adjustment:** Adjust the subject's skin tone to have a **Warm/Golden** undertone (typical healthy Asian skin tone). Ensure it matches the neck and hands.`;
          break;
      case 'tan':
          skinTonePromptPart = `**Skin Tone Adjustment:** Adjust the subject's skin tone to be **Light Tan/Bronze**. Create a healthy, sun-kissed look.`;
          break;
      default: // 'natural'
          skinTonePromptPart = `**Skin Tone:** Maintain the subject's original skin tone strictly. Do not lighten or darken it.`;
          break;
  }

  let outfitPromptPart = '';
  if (outfit.file) {
      const outfitPart = await fileToGenerativePart(outfit.file);
      parts.push(outfitPart);
      outfitPromptPart = `**Outfit:** Replace the person's current outfit with the one from the provided custom outfit image. The outfit should look natural, fit the person's posture, and be appropriate for their specified gender: '${gender}'. Ensure the custom outfit is seamlessly integrated onto the person.`;
  } else if (outfit.name !== 'Giữ nguyên trang phục') {
      outfitPromptPart = `**Outfit:** Dress the person in a '${outfit.name}'. The outfit should look natural, fit the person's posture, and be appropriate for their specified gender: '${gender}'.`;
  } else {
      outfitPromptPart = 'Maintain the original outfit. Do not change the person\'s clothing.';
  }
  
  const edits = [
    `**Background:** Completely replace the current background with a solid, even '${background}' color.`,
    outfitPromptPart,
    `**Hairstyle:** ${hairstyle !== 'Giữ nguyên' ? `Change the person's hairstyle to '${hairstyle}'.` : 'Maintain the original hairstyle.'} The new hairstyle must look realistic and suit their face.`
  ];

  if (expression !== 'Giữ nguyên') {
    edits.push(`**Facial Expression Adjustment:** Modify the person's facial expression to '${expression}'. The adjustment must be subtle, natural, and believable. **IMPORTANT:** This is a very sensitive change. You MUST strictly adhere to the main crucial instruction to preserve the person's core identity and facial structure. The expression change should not make the person unrecognizable.`);
  }

  if (lighting === 'Bật') {
      edits.push(`**Lighting Adjustment (Studio Quality):** Simulate professional studio lighting on the person's face. The lighting must be soft and even. **Eliminate any harsh shadows, especially under the nose, chin, and around the eyes.** Ensure there are no hotspots or blown-out highlights on the skin. The goal is to create a balanced, well-lit portrait where facial features are clear and distinct.`);
  }

  if (retouchPromptPart) {
      edits.push(retouchPromptPart);
  }

  if (qualityPromptPart) {
      edits.push(qualityPromptPart);
  }
  
  // Add skin tone instruction
  if (skinTonePromptPart) {
      edits.push(skinTonePromptPart);
  }
  
  edits.push(`**Cropping & Aspect Ratio:** The final image must be a front-facing portrait, focusing on the head and shoulders. Crop the photo to a standard ID photo aspect ratio of '${aspectRatio}'. If 'Ảnh gốc' (Original) is selected, maintain the original aspect ratio but still apply all other edits.`);
  edits.push(`**Quality & Resolution:** The final image must be of the **highest possible resolution (simulating 8x upscale)**. Ensure ultra-sharp details, free from any digital noise or compression artifacts. Aim for a professional, crystal-clear result suitable for high-DPI printing. Do not add any text, watermarks, or other artifacts.`);
  
  const numberedEdits = edits.map((edit, index) => `${index + 1}. ${edit}`).join('\n\n');

  const crucialInstruction = allowAiCreativity
    ? `**CREATIVE ENHANCEMENT INSTRUCTION: Your goal is to create a 'perfected' version of the person in the photo. You should preserve approximately 90% of their core facial features and identity, ensuring they are still clearly recognizable. However, you are permitted to make subtle, flattering enhancements. This may include slightly improving facial symmetry, making the skin appear flawless, subtly refining features like the nose or jawline, and adjusting the expression to be more confident and pleasant. The final result should look like a hyper-realistic, professionally shot portrait, but it must strongly resemble the original person. This is a balance between preservation and artistic idealization.**`
    : `**CRUCIAL INSTRUCTION: You MUST NOT alter the person's facial features or identity.** The primary goal is to preserve the exact likeness of the individual from the original photo. Any changes to the facial structure, eyes, nose, mouth, or skin tone are strictly forbidden. The person in the output image must be perfectly recognizable as the same person in the input image. This is the most important rule.`;


  let prompt = `Please edit the user's photo to make it a professional, high-quality ID photo suitable for official documents.

${crucialInstruction}

Apply the following edits based on the user's selections, while strictly adhering to the crucial instruction above:

${numberedEdits}
`;

  if (customPrompt) {
    prompt += `\n**Additional User Request:** ${customPrompt}\nThis is a high-priority instruction from the user that you must follow carefully.`;
  }

  parts.push({ text: prompt });

  try {
      const response = await retryOperation(() => ai.models.generateContent({
        model: MODELS.IMAGE_GEN,
        contents: { parts },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
      }));
      return parseImageModelResponse(response);
  } catch (e) {
      handleGeminiError(e);
      return { image: null, text: null };
  }
}

export async function generateConceptPhoto(portraitData: any[], conceptPrompt: string, isFamily: boolean, simple: boolean, styleRef?: File) {
    const portraitFiles = portraitData.map(p => p.file);
    const portraitParts = await Promise.all(portraitFiles.map(fileToGenerativePart));
    const parts: any[] = [...portraitParts];
    if (styleRef) {
        const stylePart = await fileToGenerativePart(styleRef);
        parts.push(stylePart);
    }
    
    const facePlaceholders = portraitFiles.map((_, i) => `[face${i+1}]`).join(', ');
    const prompt = `Generate concept photo: ${conceptPrompt}. Preserving faces from inputs (${facePlaceholders}).`; 
    parts.push({text: prompt});
     try {
        const response = await retryOperation(() => ai.models.generateContent({
            model: MODELS.IMAGE_GEN,
            contents: { parts },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        }));
        return parseImageModelResponse(response);
    } catch (e) { handleGeminiError(e); return { image: null, text: null }; }
}

export async function analyzeStyleFromImage(imageFile: File): Promise<string | null> {
     const imagePart = await fileToGenerativePart(imageFile);
     try {
        const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
            model: MODELS.TEXT_SMART,
            contents: { parts: [imagePart, { text: "Analyze style" }] },
        }));
        return response.text || null;
    } catch (e) { return null; }
}

export async function cleanOrRestoreObject(imageFile: File, types: string[], prompt: string, mask: string | null) {
     const imagePart = await fileToGenerativePart(imageFile);
     const parts: any[] = [imagePart];
     if(mask) parts.push(await dataUrlToGenerativePart(mask));
     parts.push({text: `Clean object: ${types.join(',')}. ${prompt}`});
     try {
        const response = await retryOperation(() => ai.models.generateContent({
            model: MODELS.IMAGE_GEN,
            contents: { parts },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
        }));
        return parseImageModelResponse(response);
    } catch (e) { handleGeminiError(e); return { image: null, text: null }; }
}

export async function relightImage(imageFile: File, settings: RelightSettings) {
     const imagePart = await fileToGenerativePart(imageFile);
     const prompt = `Relight image: ${JSON.stringify(settings)}`;
     try {
        const response = await retryOperation(() => ai.models.generateContent({
            model: MODELS.IMAGE_GEN,
            contents: { parts: [imagePart, { text: prompt }] },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
        }));
        return parseImageModelResponse(response);
    } catch (e) { handleGeminiError(e); return { image: null, text: null }; }
}

export async function generateImageFromPrompt(prompt: string, aspectRatio: string, refImage?: File, useGemini: boolean = false, imageSize: string = "1K") {
    if (refImage || useGemini) {
         // Gemini logic
         let parts: any[] = [{text: prompt}];
         if(refImage) parts = [await fileToGenerativePart(refImage), {text: prompt}];
         
         const promises = Array(4).fill(null).map(async (_, i) => {
             try {
                 return await retryOperation(() => ai.models.generateContent({
                     model: MODELS.IMAGE_GEN,
                     contents: { parts },
                     config: { 
                         responseModalities: [Modality.IMAGE], 
                         seed: i,
                         imageConfig: {
                             aspectRatio,
                             imageSize
                         }
                     }
                 }));
             } catch(e) { return null; }
         });
         const responses = await Promise.all(promises);
         const images = responses.map(r => r ? parseImageModelResponse(r).image : null).filter(Boolean) as string[];
         return { images: images.length ? images : null, text: null };
    } else {
         try {
            const response: any = await retryOperation(() => ai.models.generateImages({
                model: MODELS.IMAGEN,
                prompt,
                config: { numberOfImages: 4, aspectRatio }
            }));
            const images = response.generatedImages?.map((img: any) => `data:image/png;base64,${img.image.imageBytes}`) || null;
            return { images, text: null };
         } catch(e) { handleGeminiError(e); return { images: null, text: null }; }
    }
}

export async function replaceBackground(imageFile: File, backgroundPrompt: string, backgroundImage?: File) {
    const subjectPart = await fileToGenerativePart(imageFile);
    const parts: any[] = [subjectPart];
    let prompt = "";

    if (backgroundImage) {
        const bgPart = await fileToGenerativePart(backgroundImage);
        parts.push(bgPart);
        prompt = `
        Task: Composite the subject from the first image onto the background of the second image.
        1. Identify the main subject(s) in the FIRST image (foreground).
        2. Use the SECOND image as the destination background.
        3. Cut out the subject from the first image and place it onto the second image naturally.
        4. Adjust lighting, shadows, and color tone of the subject to match the new background environment.
        5. The result must be a cohesive, high-quality, photorealistic composite image.
        ${backgroundPrompt ? `Additional User Instructions: "${backgroundPrompt}"` : ''}
        `;
    } else {
        prompt = `
        Task: Replace the background of this image.
        1. Identify the main subject(s) in the foreground. It could be a person, an object, or a product.
        2. PRESERVE the main subject completely intact. Do not alter their face, body, clothing, or key details.
        3. Remove the original background completely.
        4. Generate a new background based on this description: "${backgroundPrompt}".
        5. Ensure the lighting and shadows on the subject match the new background for a realistic composition.
        6. High quality, photorealistic result.
        `;
    }
    
    parts.push({ text: prompt });
    
    try {
        const response = await retryOperation(() => ai.models.generateContent({
            model: MODELS.IMAGE_GEN,
            contents: { parts },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
        }));
        return parseImageModelResponse(response);
    } catch (e) {
        handleGeminiError(e);
        return { image: null, text: null };
    }
}

export async function generateTattooSketch(imageFile: File) {
    const imagePart = await fileToGenerativePart(imageFile);
     try {
        const response = await retryOperation(() => ai.models.generateContent({
            model: MODELS.IMAGE_GEN,
            contents: { parts: [imagePart, { text: "Generate tattoo sketch" }] },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
        }));
        return parseImageModelResponse(response);
    } catch (e) { handleGeminiError(e); return { image: null, text: null }; }
}

export async function refineTattooSketch(dataUrl: string) {
    const imagePart = await dataUrlToGenerativePart(dataUrl);
     try {
        const response = await retryOperation(() => ai.models.generateContent({
            model: MODELS.IMAGE_GEN,
            contents: { parts: [imagePart, { text: "Refine tattoo sketch" }] },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
        }));
        return parseImageModelResponse(response);
    } catch (e) { handleGeminiError(e); return { image: null, text: null }; }
}

export async function sendChatMessage(history: ChatMessage[], msg: string, img: File | null, opts: any) {
    const parts: any[] = [];
    if (img) parts.push(await fileToGenerativePart(img));
    parts.push({ text: msg });

    const model = opts.modelMode === 'fast' ? MODELS.TEXT_FAST : (opts.modelMode === 'thinking' ? MODELS.TEXT_PRO : MODELS.TEXT_SMART);
    const config: any = {
        tools: []
    };

    if (opts.useSearch) config.tools.push({ googleSearch: {} });
    if (opts.useMaps) config.tools.push({ googleMaps: {} });
    if (config.tools.length > 0) config.toolConfig = { includeServerSideToolInvocations: true };

    if (opts.modelMode === 'thinking') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    try {
        const response = await retryOperation(() => ai.models.generateContent({
            model,
            contents: { parts },
            config
        }));
        return { text: response.text || "", groundingMetadata: (response as any).groundingMetadata };
    } catch (e) {
        handleGeminiError(e);
        return { text: "Lỗi khi gửi tin nhắn.", groundingMetadata: null };
    }
}

export async function editImageWithFreePrompt(imageFile: File, prompt: string) {
    const imagePart = await fileToGenerativePart(imageFile);
     const promises = Array(4).fill(null).map(async (_, i) => {
             try {
                 return await retryOperation(() => ai.models.generateContent({
                     model: MODELS.IMAGE_GEN,
                     contents: { parts: [imagePart, {text: prompt}] },
                     config: { responseModalities: [Modality.IMAGE, Modality.TEXT], seed: i }
                 }));
             } catch(e) { return null; }
         });
    const responses = await Promise.all(promises);
    const images = responses.map(r => r ? parseImageModelResponse(r).image : null).filter(Boolean) as string[];
    return { images: images.length ? images : null, text: null };
}

export async function analyzeImageForRestoration(imageFile: File): Promise<{ needsUpscaling: boolean; reason: string; detectedIssues: string[] }> {
  const imagePart = await fileToGenerativePart(imageFile);
  const prompt = `Analyze this image for restoration needs.
  Detect issues like: scratch, noise, blur, fading, face_damage.
  Determine if upscaling is needed (if resolution is low or details are blurry).
  Return JSON: { "needsUpscaling": boolean, "reason": string, "detectedIssues": string[] }`;

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: MODELS.TEXT_PRO,
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                needsUpscaling: { type: Type.BOOLEAN },
                reason: { type: Type.STRING },
                detectedIssues: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            },
            required: ['needsUpscaling', 'reason', 'detectedIssues']
        }
      },
    }));
    const jsonString = response.text?.trim() || "{}";
    const cleanedJsonString = jsonString.replace(/^```json\s*|```\s*$/g, '');
    return JSON.parse(cleanedJsonString);
  } catch (e) {
    console.error("Analysis failed", e);
    return { needsUpscaling: false, reason: "Analysis failed", detectedIssues: [] };
  }
}

export async function restorePhoto(
    imageFile: File,
    options: {
        faceEnhance: boolean;
        denoise: boolean;
        sharpen: boolean;
        upscale: boolean;
        colorize: boolean;
        proMode?: boolean;
    },
    customPrompt: string,
    mask: string | null
) {
    const imagePart = await fileToGenerativePart(imageFile);
    const parts: any[] = [imagePart];
    
    let instructions = "Restore this photo.";
    
    if (options.proMode) {
        instructions += `
        **Studio Pro (Phase One) Workflow:**
        1.  **Lens Simulation:** Simulate Schneider Kreuznach 80mm lens optics for natural depth and compression.
        2.  **Face Restoration (Realistic):** Apply advanced face restoration. Fix eyes, skin texture, and facial features while preserving the person's identity and natural look. Do not over-smooth.
        3.  **Denoise & Detail:** Remove digital noise and grain while retaining high-frequency texture details (skin pores, fabric weave).
        4.  **Color Grading (Cinematic):** Apply cinematic color grading for a rich, deep, and professional look.
        5.  **Preservation:** Strictly preserve the original background and overall composition.
        `;
    } else {
        if (options.faceEnhance) instructions += " Enhance facial details, fix eyes and skin texture.";
        if (options.denoise) instructions += " Remove noise and grain.";
        if (options.sharpen) instructions += " Sharpen details and edges.";
        if (options.upscale) instructions += " Upscale image resolution and clarity.";
        if (options.colorize) instructions += " Colorize the black and white image naturally.";
    }

    if (customPrompt) {
        instructions += ` Additional user instruction: ${customPrompt}`;
    }

    parts.push({ text: instructions });

    try {
        const response = await retryOperation(() => ai.models.generateContent({
            model: MODELS.IMAGE_GEN,
            contents: { parts },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
        }));
        return parseImageModelResponse(response);
    } catch (e) {
        handleGeminiError(e);
        return { image: null, text: null };
    }
}

export async function upscaleImage(imageFile: File) {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = "Upscale this image to high resolution (4K). Enhance details, sharpness, and clarity while maintaining the original content fidelity.";
    
    try {
        const response = await retryOperation(() => ai.models.generateContent({
            model: MODELS.IMAGE_GEN,
            contents: { parts: [imagePart, { text: prompt }] },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
        }));
        return parseImageModelResponse(response);
    } catch (e) {
        handleGeminiError(e);
        return { image: null, text: null };
    }
}