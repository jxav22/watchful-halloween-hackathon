// API Types for book generation
export interface BookGenerationRequest {
  title: string;
  ageRange: number;
  story: string;
}

export interface UploadFile {
  file: File;
  preview?: string;
  type: "image" | "document";
}

export interface ValidationResult {
  isApproved: boolean;
  ageRating: string;
  safetyScore: number;
  contentWarnings: string[];
  analysis?: {
    hasViolence?: boolean;
    hasScaryContent?: boolean;
    hasInappropriateContent?: boolean;
  };
  recommendations?: Array<{
    id: string;
    title: string;
    author?: string;
    ageRange: string;
    description: string;
    coverUrl?: string;
    halloweenThemed: boolean;
  }>;
}

export interface BookPage {
  pageNumber: number;
  content: string;
  imageUrl?: string;
  emotion?: string;
  imagePrompt?: string;
}

export interface BookOutput {
  id: string;
  title: string;
  ageRange: number;
  pages: BookPage[];
  coverImage?: string;
  generatedAt: string;
  style?: string;
}

export interface GenerationProgress {
  step: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface GenerationResponse {
  success: boolean;
  bookId: string;
  book: BookOutput;
  message?: string;
}
