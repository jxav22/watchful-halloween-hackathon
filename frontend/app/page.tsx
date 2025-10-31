"use client";

import { useState } from "react";
import { Ghost, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { LoadingState } from "@/components/LoadingState";
import type { UploadFile, ValidationResult } from "@/types";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: UploadFile) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  const handleValidate = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile.file);

      // TODO: Replace with actual API endpoint when backend is ready
      const response = await fetch("/api/validate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Validation failed");
      }

      const data = await response.json();
      setResult(data.validation);
    } catch (err) {
      // For demo purposes, show mock data
      console.warn("API not available, showing mock data:", err);
      
      // Mock validation result
      setTimeout(() => {
        setResult({
          isApproved: true,
          ageRating: "7+",
          safetyScore: 85,
          contentWarnings: ["Contains mild spooky imagery"],
          analysis: {
            hasViolence: false,
            hasScaryContent: true,
            hasInappropriateContent: false,
          },
          recommendations: [
            {
              id: "1",
              title: "Room on the Broom",
              author: "Julia Donaldson",
              ageRange: "4-8 years",
              description: "A friendly witch and her cat share their broomstick with some unlikely friends.",
              halloweenThemed: true,
            },
            {
              id: "2",
              title: "The Little Old Lady Who Was Not Afraid of Anything",
              author: "Linda Williams",
              ageRange: "4-8 years",
              description: "A cumulative tale perfect for Halloween with a not-too-scary pumpkin head.",
              halloweenThemed: true,
            },
          ],
        });
        setIsLoading(false);
      }, 2000);
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-orange-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-orange-200 dark:border-orange-900 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-400 to-purple-600">
                <Ghost className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                  Watchful Halloween
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kid-Safe Content Validator
                </p>
              </div>
            </div>
            <Sparkles className="h-6 w-6 text-orange-500 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Card */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              🎃 Keep Halloween Fun & Safe!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Upload images or books to check if they&apos;re appropriate for kids. 
              Get age ratings, safety scores, and kid-friendly recommendations!
            </p>
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onClear={handleClearFile}
            />

            {selectedFile && !result && !isLoading && (
              <div className="flex justify-center">
                <Button
                  onClick={handleValidate}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-8"
                >
                  Validate Content
                </Button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && <LoadingState />}

          {/* Error State */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200 text-center">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && !isLoading && <ResultsDisplay result={result} />}

          {/* Reset Button */}
          {result && (
            <div className="flex justify-center">
              <Button
                onClick={handleClearFile}
                variant="outline"
                size="lg"
                className="px-8"
              >
                Check Another File
              </Button>
            </div>
          )}

          {/* Info Section */}
          {!selectedFile && !result && (
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-900">
                <div className="text-4xl mb-3">📤</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Upload Content
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Images or PDF documents - we&apos;ll analyze it for you
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-900">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Get Validated
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered age ratings and content warnings
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-900">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Find Alternatives
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Discover kid-friendly Halloween books
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-200 dark:border-orange-900 bg-white/50 dark:bg-black/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Built with 🎃 for Halloween Hackathon • Keeping content kid-friendly since 2025</p>
        </div>
      </footer>
    </div>
  );
}
