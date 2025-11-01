// API Types for book generation
export interface BookGenerationRequest {
  title: string;
  ageRange: number;
  story: string;
}

export interface BookPage {
  pageNumber: number;
  content: string;
  imageUrl?: string;
}

export interface BookOutput {
  id: string;
  title: string;
  ageRange: number;
  pages: BookPage[];
  coverImage?: string;
  generatedAt: string;
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
