"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import type { GenerationProgress } from "@/types";

interface LoadingPageProps {
  onShowBook: () => void;
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

export function LoadingPage({ onShowBook }: LoadingPageProps) {
  const [steps, setSteps] = useState<GenerationProgress[]>(GENERATION_STEPS);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentStep < steps.length) {
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
      }, 800);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      // All steps completed
      setIsComplete(true);
    }
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

