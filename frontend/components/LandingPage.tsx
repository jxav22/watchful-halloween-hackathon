"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BookGenerationRequest } from "@/types";

interface LandingPageProps {
  onGenerate: (data: BookGenerationRequest) => Promise<void>;
  onBack: () => void;
}

export function LandingPage({ onGenerate, onBack }: LandingPageProps) {
  const [title, setTitle] = useState("");
  const [ageRange, setAgeRange] = useState(5);
  const [story, setStory] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSubmit = async () => {
    if (!title || !story) {
      alert("Please fill in all fields");
      return;
    }
    await onGenerate({ title, ageRange, story });
  };

  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 3000) {
      setStory(value);
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  return (
    <div className="min-h-screen p-8 flex items-start justify-center">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Side - Form */}
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <Button
              onClick={onBack}
              variant="secondary"
              className="mb-6 bg-white/10 hover:bg-white/20 text-white border-0"
            >
              Back
            </Button>
            <h1 className="text-4xl font-bold text-white">Create your book</h1>
            <p className="text-gray-400 text-sm">How you do this</p>
          </div>

          {/* Title Input */}
          <div className="space-y-3">
            <label className="text-white font-medium text-sm">
              Title of Book
            </label>
            <input
              type="text"
              placeholder="Example"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Age Range Slider */}
          <div className="space-y-3">
            <label className="text-white font-medium text-sm">Age Range</label>
            <p className="text-white text-sm">{ageRange} Years old</p>
            <input
              type="range"
              min="3"
              max="18"
              value={ageRange}
              onChange={(e) => setAgeRange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Story Text Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white font-medium text-sm">
                Paste in your story
              </label>
              {isSyncing && (
                <span className="text-xs text-gray-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  Syncing
                </span>
              )}
            </div>
            <textarea
              placeholder="Maximum Characters 3000"
              value={story}
              onChange={handleStoryChange}
              rows={8}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <p className="text-xs text-gray-500 text-right">
              {story.length} / 3000
            </p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleSubmit}
            className="w-full py-6 text-lg font-medium bg-white hover:bg-gray-100 text-black rounded-lg"
          >
            Generate my Story
          </Button>
        </div>

        {/* Right Side - Preview */}
        <div className="hidden lg:block">
          <Card className="aspect-[3/4] bg-gradient-to-br from-gray-300 to-gray-400 border-0 shadow-2xl" />
        </div>
      </div>
    </div>
  );
}

