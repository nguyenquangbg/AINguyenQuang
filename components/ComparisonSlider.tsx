import React, { useState, useRef, useCallback } from 'react';

interface ComparisonSliderProps {
  originalImageUrl: string;
  generatedImageUrl: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ originalImageUrl, generatedImageUrl }) => {
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

  const handleInteractionStart = (clientX: number) => {
    isDragging.current = true;
    handleMove(clientX);
  };
  
  const handleInteractionEnd = () => {
    isDragging.current = false;
  };
  
  const handleInteractionMove = (clientX: number) => {
    if (!isDragging.current) return;
    handleMove(clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => handleInteractionStart(e.clientX);
  const handleTouchStart = (e: React.TouchEvent) => handleInteractionStart(e.touches[0].clientX);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleInteractionMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleInteractionMove(e.touches[0].clientX);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleInteractionEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleInteractionEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [handleInteractionMove]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full cursor-ew-resize select-none overflow-hidden rounded-lg bg-white dark:bg-slate-800"
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
        className="absolute top-0 h-full w-1 bg-white/50 backdrop-invert pointer-events-none z-20"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
         <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center border-2 border-white shadow-lg">
           <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
         </div>
      </div>
    </div>
  );
};