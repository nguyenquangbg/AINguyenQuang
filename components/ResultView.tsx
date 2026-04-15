import React, { useState, useRef, useCallback } from 'react';
import { ZoomInIcon } from './icons/ZoomInIcon';

interface ResultViewProps {
  originalImageUrl: string;
  generatedImageUrl: string;
  onZoomRequest: (url: string) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ originalImageUrl, generatedImageUrl, onZoomRequest }) => {
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
    const handleMouseUpGlobal = () => handleMouseUp();
    const handleMouseMoveGlobal = (event: MouseEvent) => handleMouseMove(event);
    const handleTouchEndGlobal = () => handleTouchEnd();
    const handleTouchMoveGlobal = (event: TouchEvent) => handleTouchMove(event);

    window.addEventListener('mouseup', handleMouseUpGlobal);
    window.addEventListener('mousemove', handleMouseMoveGlobal);
    window.addEventListener('touchend', handleTouchEndGlobal);
    window.addEventListener('touchmove', handleTouchMoveGlobal);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('touchend', handleTouchEndGlobal);
      window.removeEventListener('touchmove', handleTouchMoveGlobal);
    };
  }, [handleMouseMove]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full cursor-ew-resize select-none overflow-hidden rounded-lg bg-white dark:bg-slate-800 group"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <img src={originalImageUrl} alt="Original" className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />
      <div
        className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={generatedImageUrl} alt="Generated" className="absolute top-0 left-0 w-full h-full object-contain" />
         <button 
              onClick={() => onZoomRequest(generatedImageUrl)}
              className="absolute inset-0 w-full h-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10"
              aria-label="Phóng to ảnh"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
              <ZoomInIcon className="w-10 h-10 text-white" />
          </button>
      </div>
      <div
        className="absolute top-0 h-full w-1 bg-white/50 backdrop-invert pointer-events-none z-20"
        style={{ left: `${sliderPosition}%` }}
      >
         <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center border-2 border-white shadow-lg">
           <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
         </div>
      </div>
    </div>
  );
};