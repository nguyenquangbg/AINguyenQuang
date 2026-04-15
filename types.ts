
export interface Background {
  id: string;
  name: string;
  tailwindColor: string;
}

export interface Outfit {
  id: string;
  name: string;
  previewUrl: string;
  gender?: 'Nam' | 'Nữ';
  documentTypes?: string[];
  isRecommended?: boolean;
}

export interface Hairstyle {
  id: string;
  name: string;
  previewUrl: string;
  gender?: 'Nam' | 'Nữ';
}

export interface RetouchOption {
  id: string;
  name: string;
  description: string;
}

export interface QualityEnhancementOption {
  id: string;
  name: string;
  description: string;
}

export interface SkinToneOption {
    id: string;
    name: string;
    description: string;
    colorCode: string;
}

export interface AspectRatio {
  id: string;
  name: string;
}

export interface CountryTemplate {
  id: string;
  name: string;
  backgroundId: string;
  aspectRatioId: string;
}

export interface ImageAnalysisFeedbackItem {
  isGood: boolean;
  message: string;
}

export interface ImageAnalysisResult {
  feedback: ImageAnalysisFeedbackItem[];
  gender?: Gender;
  age?: string;
}


export type Gender = 'Nữ' | 'Nam';

export interface GenderOption {
  id: Gender;
  name: Gender;
}

// A generic Option type that our new types satisfy
export interface Option {
  id: string;
  name: string;
  isRecommended?: boolean;
  [key: string]: any;
}

export interface DocumentType extends Option {
  // empty
}

export interface LightingOption extends Option {
  // empty
}

export interface ExpressionOption extends Option {
  description: string;
}
