// API Types for backend integration
export interface UploadFile {
  file: File;
  preview?: string;
  type: 'image' | 'document';
}

export interface ValidationResult {
  isApproved: boolean;
  ageRating: string; // e.g., "3+", "7+", "13+"
  contentWarnings: string[];
  safetyScore: number; // 0-100
  recommendations?: BookRecommendation[];
  analysis?: {
    hasViolence?: boolean;
    hasScaryContent?: boolean;
    hasInappropriateContent?: boolean;
  };
}

export interface BookRecommendation {
  id: string;
  title: string;
  author?: string;
  ageRange: string;
  description: string;
  coverUrl?: string;
  halloweenThemed: boolean;
}

export interface UploadResponse {
  success: boolean;
  fileId: string;
  validation: ValidationResult;
  message?: string;
}

