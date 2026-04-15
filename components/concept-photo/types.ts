export interface UploadedPortrait {
  id: string;
  file: File;
  status: 'compressing' | 'done' | 'error';
  previewUrl: string;
}

export type MemberRole = 'adult_male' | 'adult_female' | 'child';

export interface FamilyMember {
  id: string;
  file: File;
  status: 'compressing' | 'done' | 'error';
  previewUrl: string;
  role: MemberRole;
}

export type ReferenceMode = 'concept' | 'style';

export interface Pose {
  id: string;
  name: string;
  prompt: string;
}

export interface Concept {
  id: string;
  name: string;
  category: string;
  description?: string;
  prompts: string[];
  poses: Pose[];
  requiredPortraits: number;
  isFamilyPrompt?: boolean;
  simpleFamilyMode?: boolean;
  maxPortraits?: number;
}

export interface ConceptCategory {
  id: string;
  name: string;
  concepts: Concept[];
}

export interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
    name: string;
}