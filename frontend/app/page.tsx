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
  };

  const handleGenerationComplete = (book: BookOutput) => {
    setGeneratedBook(book);
  };

  const handleGenerationError = (error: string) => {
    console.error("Generation error:", error);
    // Could show error state here
    setCurrentPage("landing");
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
      
      {currentPage === "loading" && bookData && (
        <LoadingPage 
          bookRequest={bookData}
          onGenerationComplete={handleGenerationComplete}
          onShowBook={handleShowBook}
          onError={handleGenerationError}
        />
      )}
      
      {currentPage === "output" && generatedBook && (
        <OutputPage book={generatedBook} onBack={handleBackFromOutput} />
      )}
    </>
  );
}
