import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: POST /api/generate
 * 
 * This endpoint generates a kid-friendly book from a story input.
 * Your backend team should implement the actual generation logic.
 * 
 * Expected Request:
 * {
 *   title: string;
 *   ageRange: number;
 *   story: string;
 * }
 * 
 * Expected Response:
 * {
 *   success: boolean;
 *   bookId: string;
 *   book: {
 *     id: string;
 *     title: string;
 *     ageRange: number;
 *     pages: Array<{
 *       pageNumber: number;
 *       content: string;
 *       imageUrl?: string;
 *     }>;
 *     coverImage?: string;
 *     generatedAt: string;
 *   };
 *   message?: string;
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, ageRange, story } = body;

    if (!title || !ageRange || !story) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Integrate with your backend generation service
    // Example: Forward the data to your backend API
    // const backendResponse = await fetch('http://your-backend-url/generate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ title, ageRange, story }),
    // });
    // const data = await backendResponse.json();
    // return NextResponse.json(data);

    // Mock response for testing
    const mockBook = {
      id: `book-${Date.now()}`,
      title,
      ageRange,
      generatedAt: new Date().toISOString(),
      pages: [
        {
          pageNumber: 1,
          content: "HalloFright is a delightful storytelling platform that allows parents to transform horror tales into enchanting kid-friendly books.",
          imageUrl: undefined,
        },
        {
          pageNumber: 2,
          content: `Once upon a time in ${title}, there lived a brave little hero who loved adventures...`,
          imageUrl: undefined,
        },
        {
          pageNumber: 3,
          content: story.substring(0, 200) + "...",
          imageUrl: undefined,
        },
      ],
    };

    return NextResponse.json({
      success: true,
      bookId: mockBook.id,
      book: mockBook,
      message: "Book generated successfully",
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { success: false, message: "Generation failed" },
      { status: 500 }
    );
  }
}

