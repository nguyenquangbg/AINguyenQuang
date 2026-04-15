import React, { useCallback, useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { CheckIcon } from './icons/CheckIcon';

interface PhotoUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
}

export interface PhotoUploaderRef {
  triggerClick: () => void;
}

export const PhotoUploader = forwardRef<PhotoUploaderRef, PhotoUploaderProps>(({ onImageUpload, previewUrl }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDropped, setIsDropped] = useState(false);

  useImperativeHandle(ref, () => ({
    triggerClick: () => {
      inputRef.current?.click();
    },
  }));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
        return;
    }
    setIsDraggingOver(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsDropped(true);
      onImageUpload(file);
    }
  };

  // Effect to reset the confirmation state
  useEffect(() => {
    if (isDropped) {
      const timer = setTimeout(() => {
        setIsDropped(false);
      }, 1500); // Show confirmation for 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isDropped]);

  // Reset drop state if the image is cleared externally
  useEffect(() => {
    if (!previewUrl) {
        setIsDropped(false);
    }
  }, [previewUrl]);

  return (
    <div
      className={`relative w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center text-center p-4 cursor-pointer transition-all duration-300 overflow-hidden ${
        isDraggingOver 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-lg' 
        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 hover:border-blue-500 dark:hover:border-blue-500'
      }`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      
      {/* Drag Over Overlay */}
      <div className={`absolute inset-0 bg-white/95 dark:bg-slate-800/95 flex flex-col items-center justify-center z-10 rounded-lg transition-opacity duration-300 ${isDraggingOver ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <UploadIcon className="w-16 h-16 text-blue-500 dark:text-blue-400 animate-bounce" />
          <p className="text-xl font-semibold text-blue-600 dark:text-blue-300 mt-4">Thả ảnh vào đây</p>
      </div>

      {/* Drop Confirmation Overlay */}
      <div className={`absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center z-20 rounded-lg transition-opacity duration-300 ${isDropped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <CheckIcon className="w-16 h-16 text-white" />
          <p className="text-xl font-semibold text-white mt-4">Đã nhận ảnh!</p>
      </div>

      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="object-contain max-w-full max-h-full rounded-md" />
      ) : (
        <div className="text-slate-500 dark:text-slate-400 pointer-events-none">
          <UploadIcon className="w-10 h-10 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
          <p className="font-semibold">Nhấn hoặc kéo ảnh vào đây</p>
          <p className="text-xs mt-1">Định dạng PNG, JPG, hoặc WEBP</p>
        </div>
      )}
    </div>
  );
});