export type BacklightDirection = 'left' | 'middle' | 'right';
export type LightType = 'natural' | 'one-light' | 'two-lights' | 'three-lights';
export type LightColor = 'Red' | 'Green' | 'Blue' | 'Purple' | 'White' | 'Yellow' | 'Orange';
export type Quality = 'standard' | '2k' | '4k';
export type Language = 'vi' | 'en';

export interface RelightSettings {
  backlightDirection: BacklightDirection;
  lightType: LightType;
  lightColor1: LightColor;
  lightColor2: LightColor;
  lightColor3: LightColor;
  quality: Quality;
  customPrompt: string;
}

export interface PostProcessingSettings {
  temperature: number;
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  saturation: number;
}

export interface Translation {
  controls: {
    languageTooltip: string;
    backlightDirection: {
      title: string;
      left: string;
      middle: string;
      right: string;
    },
    lightType: {
      title: string;
      natural: string;
      oneLight: string;
      twoLights: string;
      threeLights: string;
    },
    lightColor: {
      light1: string;
      light2: string;
      light3: string;
    },
    quality: {
      title: string;
      standard: string;
      q2k: string;
      q4k: string;
    },
    customPrompt: {
      title: string;
      placeholder: string;
    },
    relightButton: string;
    relightingButton: string;
  },
  imageDisplay: {
    original: string;
    edited: string;
    uploadPrompt: string;
    resultPrompt: string;
    downloadButton: string;
  },
  postProcessing: {
    title: string;
    temperature: string;
    exposure: string;
    contrast: string;
    highlights: string;
    shadows: string;
    saturation: string;
    resetButton: string;
  },
  loadingMessages: string[],
  error: {
    title: string;
    generationFailed: string;
    unexpected: string;
  }
}
