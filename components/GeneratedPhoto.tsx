
import React, { useState, useRef, useCallback } from 'react';

interface ResultViewProps {
  originalImageUrl: string;
  generatedImageUrl: string;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ originalImageUrl, generatedImageUrl, onReset }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleMove(e.clientX);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
      isDragging.current = true;
      handleMove(e.touches[0].clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };
  
  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove]);

  const handleDownload = () => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = generatedImageUrl;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(image, 0, 0);
        const jpgUrl = canvas.toDataURL('image/jpeg', 1.0);
        const a = document.createElement('a');
        a.href = jpgUrl;
        a.download = `${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
  };

  return (
    <div className="flex flex-col items-center space-y-4 h-full">
      <div 
        ref={containerRef}
        className="relative w-full h-full cursor-ew-resize select-none overflow-hidden rounded-lg"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <img src={originalImageUrl} alt="Original" className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />
        <div
          className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img src={generatedImageUrl} alt="Generated" className="absolute top-0 left-0 w-full h-full object-contain" />
        </div>
        <div
          className="absolute top-0 h-full w-1 bg-white mix-blend-difference pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
           <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center border-2 border-white shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
           </div>
        </div>
      </div>
       <div className="w-full grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={handleDownload}
          className="w-full bg-blue-600 text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-base shadow"
        >
          Tải xuống (JPG)
        </button>
        <button
          onClick={onReset}
          className="w-full bg-slate-200 text-slate-700 text-center font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors text-base"
        >
          Tạo ảnh mới
        </button>
      </div>
    </div>
  );
};
