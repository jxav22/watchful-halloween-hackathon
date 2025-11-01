"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Sparkles, Wand2 } from "lucide-react";

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-purple-500/20 backdrop-blur-sm">
              <BookOpen className="h-16 w-16 text-purple-300" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-white leading-tight">
            Welcome to <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              HalloFright
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform your stories into enchanting kid-friendly books. 
            Create magical reading experiences with AI-powered content validation and beautiful illustrations.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-white hover:bg-gray-100 text-black px-12 py-7 text-xl font-semibold rounded-xl shadow-2xl hover:scale-105 transition-transform duration-200"
          >
            <Wand2 className="mr-3 h-6 w-6" />
            Create Your Book
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="p-6 bg-card/30 border-border backdrop-blur-sm hover:bg-card/40 transition-colors">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-purple-500/20">
                <BookOpen className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Story Input
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Paste your story and customize it for your child&apos;s age group
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-card/30 border-border backdrop-blur-sm hover:bg-card/40 transition-colors">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-pink-500/20">
                <Sparkles className="h-8 w-8 text-pink-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                AI Validation
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Smart content filtering ensures age-appropriate material
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-card/30 border-border backdrop-blur-sm hover:bg-card/40 transition-colors">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-purple-500/20">
                <Wand2 className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Beautiful Books
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Generate stunning illustrated pages ready for reading
              </p>
            </div>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center pt-8">
          <p className="text-sm text-gray-500">
            🎃 Built for Halloween Hackathon • Making stories kid-friendly since 2025
          </p>
        </div>
      </div>
    </div>
  );
}

