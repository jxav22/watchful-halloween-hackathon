import { API_ENDPOINTS } from '@/config/api';
import type { BookGenerationRequest, BookOutput, GenerationResponse } from '@/types';
import type { StoryResponse } from '@/types/backend';

// Transform backend response to frontend format
function transformBackendToFrontend(
  backendResponse: StoryResponse,
  request: BookGenerationRequest
): BookOutput {
  return {
    id: `book-${Date.now()}`,
    title: backendResponse.story_title || request.title,
    ageRange: backendResponse.target_age || request.ageRange,
    generatedAt: new Date().toISOString(),
    coverImage: undefined, // Can be added later when image generation is implemented
    pages: backendResponse.pages.map((page) => ({
      pageNumber: page.page_number,
      content: `${page.title}\n\n${page.text}`,
      imageUrl: undefined, // Can be added later when image generation is implemented
    })),
  };
}

/**
 * Generate a story using the backend API
 */
export async function generateStory(
  request: BookGenerationRequest
): Promise<GenerationResponse> {
  try {
    // Transform frontend request to backend format
    const backendRequest = {
      text: request.title,
      paragraph: request.story,
      age: request.ageRange,
    };

    const response = await fetch(API_ENDPOINTS.STORY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const backendData: StoryResponse = await response.json();
    const book = transformBackendToFrontend(backendData, request);

    return {
      success: true,
      bookId: book.id,
      book,
      message: 'Book generated successfully',
    };
  } catch (error) {
    console.error('Failed to generate story:', error);
    throw error;
  }
}

