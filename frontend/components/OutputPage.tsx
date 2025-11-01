"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BookOutput } from "@/types";

interface OutputPageProps {
  book: BookOutput;
  onBack: () => void;
}

export function OutputPage({ book, onBack }: OutputPageProps) {
  return (
    <div className="min-h-screen p-8">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <Button
            onClick={onBack}
            variant="secondary"
            className="mb-6 bg-white/10 hover:bg-white/20 text-white border-0"
          >
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white">Book output</h1>
          <p className="text-gray-400 text-sm">How you do this</p>
        </div>

        {/* Book Pages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {book.pages.map((page, idx) => (
            <Card
              key={page.pageNumber}
              className="relative aspect-[3/4] overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 group hover:scale-105 transition-transform duration-300"
            >
              {page.imageUrl ? (
                <img
                  src={page.imageUrl}
                  alt={`Page ${page.pageNumber}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800" />
              )}
              
              {/* Text Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
                <p className="text-white text-sm leading-relaxed line-clamp-6">
                  {page.content}
                </p>
                <p className="text-gray-400 text-xs mt-3">
                  Page {page.pageNumber}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors duration-300" />
            </Card>
          ))}

          {/* Placeholder cards if less than 3 pages */}
          {book.pages.length < 3 &&
            Array.from({ length: 3 - book.pages.length }).map((_, idx) => (
              <Card
                key={`placeholder-${idx}`}
                className="aspect-[3/4] bg-gradient-to-br from-gray-300 to-gray-400 border-0 shadow-xl"
              />
            ))}
        </div>

        {/* Book Info */}
        <div className="bg-card/30 border border-border rounded-xl p-6 space-y-2">
          <h2 className="text-xl font-semibold text-white">{book.title}</h2>
          <p className="text-gray-400 text-sm">
            Age Range: {book.ageRange}+ years old
          </p>
          <p className="text-gray-500 text-xs">
            Generated: {new Date(book.generatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

