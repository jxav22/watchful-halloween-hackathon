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
  { step: "Reading your transcript", status: "pending" },
  { step: "Interpreting your transcript based on Age and Validation rules", status: "pending" },
  { step: "reviewing uploaded imagery", status: "pending" },
  { step: "Re aligning imagery based on Age range", status: "pending" },
  { step: "Outputting story chapters", status: "pending" },
  { step: "Merging story chapter with imagery", status: "pending" },
  { step: "Combining all content", status: "pending" },
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
        
        // Mark all steps as complete once API call finishes
        setTimeout(() => {
          setSteps((prev) => prev.map((step) => ({ ...step, status: "completed" as const })));
          setCurrentStep(steps.length);
          setIsComplete(true);
        }, 300);
      } catch (error) {
        console.error("Failed to generate book:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to generate book";
        if (onError) {
          onError(errorMessage);
        }
      }
    };

    generateBook();
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
    }, 5000);

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

