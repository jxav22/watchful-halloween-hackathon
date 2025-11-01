"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  useEffect(() => {
    // Force reinit of Unicorn Studio on component mount
    if (window.UnicornStudio) {
      window.UnicornStudio.isInitialized = false;
    }

    // Load Unicorn Studio script
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init?.();
          window.UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(script);
    } else {
      // If script already loaded, just reinitialize
      window.UnicornStudio.init?.();
      window.UnicornStudio.isInitialized = true;
    }

    // Remove Unicorn Studio watermark after animation loads
    const removeWatermark = setInterval(() => {
      const projectDiv = document.querySelector('[data-us-project]');
      if (projectDiv) {
        // Remove all anchor tags within the project
        const anchors = projectDiv.querySelectorAll('a');
        anchors.forEach(anchor => {
          anchor.remove();
        });
        
        // Also check for any absolute positioned divs that might contain the badge
        const absoluteDivs = projectDiv.querySelectorAll('div[style*="position: absolute"], div[style*="position: fixed"]');
        absoluteDivs.forEach(div => {
          const hasLink = div.querySelector('a');
          if (hasLink) {
            div.remove();
          }
        });
      }
    }, 500);

    // Clean up after 10 seconds
    setTimeout(() => clearInterval(removeWatermark), 10000);

    return () => clearInterval(removeWatermark);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-black">
      <div className="w-full max-w-6xl space-y-12">
        {/* Logo and Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <Image 
              src="/Logo.webp" 
              alt="Hallofright Logo" 
              width={300}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          
          <p className="text-lg text-gray-400">
            Turn Horror stories into a kids children book
          </p>
        </div>

        {/* Spooky Text with Unicorn Studio Animation */}
        <div className="relative flex justify-center items-center min-h-[400px]">
          <div 
            data-us-project="XjVBhfu4P6vyklplWTaW" 
            style={{ width: "100%", maxWidth: "1440px", height: "400px" }}
          />
          
          {/* CTA Button positioned to cover watermark */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-white hover:bg-gray-100 text-black px-8 py-6 text-base font-medium rounded-full shadow-2xl hover:scale-105 transition-transform duration-200 flex items-center gap-2"
            >
              🎃 Create your Story Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// TypeScript declaration for window.UnicornStudio
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init?: () => void;
    };
  }
}

