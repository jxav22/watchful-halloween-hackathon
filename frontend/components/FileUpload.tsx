"use client";

import { useState, useCallback } from "react";
import { Upload, FileImage, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UploadFile } from "@/types";

interface FileUploadProps {
  onFileSelect: (file: UploadFile) => void;
  selectedFile?: UploadFile | null;
  onClear: () => void;
}

export function FileUpload({ onFileSelect, selectedFile, onClear }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [onFileSelect]
  );

  const processFile = (file: File) => {
    const fileType = file.type.startsWith("image/") ? "image" : "document";
    
    if (fileType === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect({
          file,
          preview: reader.result as string,
          type: fileType,
        });
      };
      reader.readAsDataURL(file);
    } else {
      onFileSelect({
        file,
        type: fileType,
      });
    }
  };

  if (selectedFile) {
    return (
      <Card className="relative p-6 border-2 border-orange-500/20 bg-gradient-to-br from-orange-50 to-purple-50 dark:from-orange-950/20 dark:to-purple-950/20">
        <button
          onClick={onClear}
          className="absolute top-4 right-4 p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors"
          aria-label="Remove file"
        >
          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
        </button>
        
        <div className="flex items-start gap-4">
          {selectedFile.preview ? (
            <img
              src={selectedFile.preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border-2 border-orange-300 dark:border-orange-700"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-lg border-2 border-purple-300 dark:border-purple-700">
              <FileText className="h-12 w-12 text-purple-600 dark:text-purple-400" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
              {selectedFile.file.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {(selectedFile.file.size / 1024).toFixed(2)} KB
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {selectedFile.type === "image" ? "Image file" : "Document file"}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed transition-all duration-200 cursor-pointer",
        isDragging
          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 scale-105"
          : "border-gray-300 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-600"
      )}
    >
      <label className="flex flex-col items-center justify-center p-12 cursor-pointer">
        <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-orange-400 to-purple-600">
          <Upload className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Upload Content
        </h3>
        
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
          Drag and drop your image or document here, or click to browse
        </p>
        
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <FileImage className="h-4 w-4" />
            <span>Images</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <FileText className="h-4 w-4" />
            <span>PDFs</span>
          </div>
        </div>
        
        <Button type="button" variant="outline" size="sm">
          Browse Files
        </Button>
        
        <input
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileInput}
        />
      </label>
    </Card>
  );
}

