"use client";

import { Ghost, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Analyzing content..." }: LoadingStateProps) {
  return (
    <Card className="border-2 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Ghost className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-bounce" />
            <Loader2 className="h-4 w-4 text-orange-500 absolute -top-1 -right-1 animate-spin" />
          </div>
          <div>
            <CardTitle>Processing...</CardTitle>
            <CardDescription>
              Our spooky validators are checking your content
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Progress value={undefined} className="h-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center animate-pulse">
          {message}
        </p>
        <div className="flex justify-center gap-2 text-2xl">
          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>👻</span>
          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>🎃</span>
          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>🦇</span>
        </div>
      </CardContent>
    </Card>
  );
}

