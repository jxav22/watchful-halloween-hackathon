"use client";

import { useState } from "react";
import { HomePage } from "@/components/HomePage";
import { LandingPage } from "@/components/LandingPage";
import { LoadingPage } from "@/components/LoadingPage";
import { OutputPage } from "@/components/OutputPage";
import type { BookGenerationRequest, BookOutput } from "@/types";

type PageState = "home" | "landing" | "loading" | "output";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageState>("home");
  const [bookData, setBookData] = useState<BookGenerationRequest | null>(null);
  const [generatedBook, setGeneratedBook] = useState<BookOutput | null>(null);

  const handleGetStarted = () => {
    setCurrentPage("landing");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setBookData(null);
    setGeneratedBook(null);
  };

  const handleGenerate = async (data: BookGenerationRequest) => {
    setBookData(data);
    setCurrentPage("loading");

    try {
      // Call the actual backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/story`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.title,
          paragraph: data.story,
          age: data.ageRange,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const backendData = await response.json();
      
      // Transform backend response to frontend format
      const generatedBook: BookOutput = {
        id: `book-${Date.now()}`,
        title: backendData.story_title || data.title,
        ageRange: backendData.target_age || data.ageRange,
        generatedAt: new Date().toISOString(),
        coverImage: undefined,
        pages: backendData.pages.map((page: any) => ({
          pageNumber: page.page_number,
          content: `${page.title}\n\n${page.text}`,
          imageUrl: undefined,
        })),
      };
      
      setGeneratedBook(generatedBook);
    } catch (error) {
      console.error("Failed to generate book:", error);
      // Handle error - could show error page
      setCurrentPage("landing");
    }
  };

  const handleShowBook = () => {
    setCurrentPage("output");
  };

  const handleBackFromOutput = () => {
    setCurrentPage("home");
    setBookData(null);
    setGeneratedBook(null);
  };

  return (
    <>
      {currentPage === "home" && <HomePage onGetStarted={handleGetStarted} />}
      
      {currentPage === "landing" && (
        <LandingPage onGenerate={handleGenerate} onBack={handleBackToHome} />
      )}
      
      {currentPage === "loading" && (
        <LoadingPage onShowBook={handleShowBook} />
      )}
      
      {currentPage === "output" && generatedBook && (
        <OutputPage book={generatedBook} onBack={handleBackFromOutput} />
      )}
    </>
  );
}
