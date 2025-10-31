"use client";

import { CheckCircle, XCircle, AlertTriangle, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import type { ValidationResult } from "@/types";

interface ResultsDisplayProps {
  result: ValidationResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const getSafetyColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getSafetyBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className="border-2 border-orange-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {result.isApproved ? (
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              )}
              <div>
                <CardTitle className="text-2xl">
                  {result.isApproved ? "Content Approved!" : "Content Flagged"}
                </CardTitle>
                <CardDescription>
                  Age Rating: <span className="font-bold text-orange-600 dark:text-orange-400">{result.ageRating}</span>
                </CardDescription>
              </div>
            </div>
            <Badge variant={result.isApproved ? "default" : "destructive"} className="text-lg px-4 py-2">
              {result.isApproved ? "Safe" : "Caution"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Safety Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Safety Score
              </span>
              <span className={`text-2xl font-bold ${getSafetyColor(result.safetyScore)}`}>
                {result.safetyScore}%
              </span>
            </div>
            <Progress 
              value={result.safetyScore} 
              className="h-3"
              indicatorClassName={getSafetyBgColor(result.safetyScore)}
            />
          </div>

          {/* Content Warnings */}
          {result.contentWarnings && result.contentWarnings.length > 0 && (
            <Alert variant="destructive" className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <AlertTitle className="text-yellow-900 dark:text-yellow-200">Content Warnings</AlertTitle>
              <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {result.contentWarnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Analysis Details */}
          {result.analysis && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">Violence</p>
                <p className={`text-lg font-bold ${result.analysis.hasViolence ? 'text-red-600' : 'text-green-600'}`}>
                  {result.analysis.hasViolence ? "Yes" : "No"}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">Scary Content</p>
                <p className={`text-lg font-bold ${result.analysis.hasScaryContent ? 'text-red-600' : 'text-green-600'}`}>
                  {result.analysis.hasScaryContent ? "Yes" : "No"}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">Inappropriate</p>
                <p className={`text-lg font-bold ${result.analysis.hasInappropriateContent ? 'text-red-600' : 'text-green-600'}`}>
                  {result.analysis.hasInappropriateContent ? "Yes" : "No"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Book Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <Card className="border-2 border-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <CardTitle>Recommended for Kids</CardTitle>
            </div>
            <CardDescription>
              Kid-friendly Halloween books based on this content
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {result.recommendations.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex gap-4 p-4">
                    {book.coverUrl && (
                      <img 
                        src={book.coverUrl} 
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                        {book.title}
                      </h4>
                      {book.author && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {book.author}
                        </p>
                      )}
                      <Badge variant="secondary" className="mt-2">
                        {book.ageRange}
                      </Badge>
                      {book.halloweenThemed && (
                        <Badge variant="outline" className="mt-2 ml-2">
                          🎃 Halloween
                        </Badge>
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                        {book.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

