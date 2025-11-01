"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import type { GenerationProgress, BookGenerationRequest, BookOutput } from "@/types";
import { API_ENDPOINTS } from "@/config/api";
import type { StoryResponse } from "@/types/backend";

interface LoadingPageProps {
  bookRequest: BookGenerationRequest;
  onGenerationComplete: (book: BookOutput) => void;
  onShowBook: () => void;
  onError?: (error: string) => void;
}

const GENERATION_STEPS: GenerationProgress[] = [
  { step: "Processing your input", status: "pending" },
  { step: "Adjusting content for age-appropriate reading", status: "pending" },
  { step: "Generating story illustrations", status: "pending" },
  { step: "Applying final touches to the content", status: "pending" },
  { step: "Performing quality checks", status: "pending" },
  { step: "Preparing the final output", status: "pending" },
  { step: "Compiling everything together", status: "pending" },
];

export function LoadingPage({ 
  bookRequest, 
  onGenerationComplete, 
  onShowBook, 
  onError 
}: LoadingPageProps) {
  const [steps, setSteps] = useState<GenerationProgress[]>(GENERATION_STEPS);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const hasCalledApi = useRef(false);
  const preloadAbortController = useRef<AbortController | null>(null);

  // Preload all images from the book with timeout and better error handling
  const preloadImages = async (
    pages: Array<{ imageUrl?: string }>,
    coverImage?: string,
    timeout: number = 30000
  ): Promise<{ loaded: number; failed: number; total: number }> => {
    // Collect all image URLs
    const imageUrls: string[] = [];
    
    // Add cover image if present
    if (coverImage) {
      imageUrls.push(coverImage);
    }
    
    // Add page images
    pages.forEach((page) => {
      if (page.imageUrl) {
        imageUrls.push(page.imageUrl);
      }
    });

    if (imageUrls.length === 0) {
      return { loaded: 0, failed: 0, total: 0 };
    }

    // Create abort controller for cleanup
    preloadAbortController.current = new AbortController();
    const signal = preloadAbortController.current.signal;

    // Preload each image with timeout
    const preloadPromises = imageUrls.map((url) => {
      return new Promise<{ url: string; success: boolean }>((resolve) => {
        // Timeout promise
        const timeoutPromise = new Promise<{ url: string; success: boolean }>((timeoutResolve) => {
          setTimeout(() => {
            timeoutResolve({ url, success: false });
          }, timeout);
        });

        // Image load promise
        const imagePromise = new Promise<{ url: string; success: boolean }>((imageResolve) => {
          if (signal.aborted) {
            imageResolve({ url, success: false });
            return;
          }

          const img = new Image();
          
          img.onload = () => {
            if (!signal.aborted) {
              imageResolve({ url, success: true });
            }
          };
          
          img.onerror = () => {
            if (!signal.aborted) {
              imageResolve({ url, success: false });
            }
          };

          // Set src after attaching handlers
          img.src = url;
          
          // If image is already cached, trigger load immediately
          if (img.complete) {
            imageResolve({ url, success: true });
          }
        });

        // Race between image load and timeout
        Promise.race([imagePromise, timeoutPromise]).then(resolve);
      });
    });

    // Wait for all images to settle (regardless of success/failure)
    const results = await Promise.allSettled(preloadPromises);
    
    const stats = {
      loaded: 0,
      failed: 0,
      total: imageUrls.length,
    };

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        if (result.value.success) {
          stats.loaded++;
        } else {
          stats.failed++;
        }
      } else {
        stats.failed++;
      }
    });

    return stats;
  };

  // Main API call effect - triggers generation on mount
  useEffect(() => {
    if (hasCalledApi.current) return; // Prevent duplicate calls
    
    hasCalledApi.current = true;
    
    const generateBook = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.STORY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: bookRequest.title,
            paragraph: bookRequest.story,
            age: bookRequest.ageRange,
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }

        const backendData: StoryResponse = await response.json();
        
        // Transform backend response to frontend format
        const book: BookOutput = {
          id: `book-${Date.now()}`,
          title: backendData.story_title || bookRequest.title,
          ageRange: backendData.target_age || bookRequest.ageRange,
          generatedAt: new Date().toISOString(),
          coverImage: undefined,
          style: backendData.style,
          pages: backendData.pages.map((page) => ({
            pageNumber: page.page_number,
            content: `${page.title}\n\n${page.text}`,
            imageUrl: page.image_url || undefined,
            emotion: page.emotion,
            imagePrompt: page.image_prompt,
          })),
        };
        
        onGenerationComplete(book);
        
        // Preload all images in the background (non-blocking)
        preloadImages(book.pages, book.coverImage)
          .then((stats) => {
            if (stats.total > 0) {
              console.log(
                `Image preload complete: ${stats.loaded}/${stats.total} loaded, ${stats.failed} failed`
              );
            }
          })
          .catch((error) => {
            console.warn("Image preload error:", error);
          });
        
        // Mark all steps as complete once API call finishes
        setTimeout(() => {
          setSteps((prev) => prev.map((step) => ({ ...step, status: "completed" as const })));
          setCurrentStep(steps.length);
          setIsComplete(true);
        }, 800);
      } catch (error) {
        console.error("Failed to generate book:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to generate book";
        if (onError) {
          onError(errorMessage);
        }
      }
    };

    generateBook();

    // Cleanup: abort image preloading if component unmounts
    return () => {
      if (preloadAbortController.current) {
        preloadAbortController.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate through steps while API is loading
  useEffect(() => {
    if (isComplete || currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setSteps((prev) =>
        prev.map((step, idx) => {
          if (idx === currentStep) {
            return { ...step, status: "completed" };
          }
          return step;
        })
      );
      setCurrentStep((prev) => prev + 1);
    }, 15000);

    return () => clearTimeout(timer);
  }, [currentStep, steps.length, isComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Generating your book</h1>
        </div>

        {/* Progress Steps */}
        <div className="bg-card/30 border border-border rounded-xl p-8 space-y-4">
          {steps.map((stepItem, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 transition-opacity duration-300 ${
                idx > currentStep ? "opacity-40" : "opacity-100"
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {stepItem.status === "completed" ? (
                  <Check className="h-5 w-5 text-green-400" />
                ) : idx === currentStep ? (
                  <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
                )}
              </div>
              <p
                className={`text-sm ${
                  stepItem.status === "completed"
                    ? "text-gray-400 line-through"
                    : idx === currentStep
                    ? "text-white font-medium"
                    : "text-gray-500"
                }`}
              >
                {stepItem.step}
              </p>
            </div>
          ))}
        </div>

        {/* Show Book Button */}
        <div className="flex justify-center">
          <Button
            onClick={onShowBook}
            disabled={!isComplete}
            variant="secondary"
            className="bg-white hover:bg-gray-100 text-black px-8 py-6 text-base font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isComplete ? "Show the book" : "Generating..."}
          </Button>
        </div>
      </div>
    </div>
  );
}

