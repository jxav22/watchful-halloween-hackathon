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

    // Simulate API call - replace with actual backend call
    // In production, this would call your backend API
    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/api/generate", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      // const result = await response.json();
      // setGeneratedBook(result.book);
      
      // Mock data for now
      const mockBook: BookOutput = {
        id: `book-${Date.now()}`,
        title: data.title,
        ageRange: data.ageRange,
        generatedAt: new Date().toISOString(),
        coverImage: "/placeholder-cover.jpg",
        pages: [
          {
            pageNumber: 1,
            content: "HalloFright is a delightful storytelling platform that allows parents to transform horror tales into enchanting kid-friendly books. It's all about capturing that nostalgic magic and creating a cozy atmosphere for little readers!",
            imageUrl: "/placeholder-page1.jpg",
          },
          {
            pageNumber: 2,
            content: `Once upon a time in ${data.title}, there lived a brave little hero who loved adventures...`,
            imageUrl: undefined,
          },
          {
            pageNumber: 3,
            content: "The journey was filled with magical moments and friendly creatures that made every day special.",
            imageUrl: undefined,
          },
        ],
      };
      
      // Set generated book immediately
      setGeneratedBook(mockBook);
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
