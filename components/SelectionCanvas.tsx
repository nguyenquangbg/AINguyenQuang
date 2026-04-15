import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';

type Tool = 'brush' | 'eraser';

interface SelectionCanvasProps {
  imageUrl: string;
  tool: Tool;
  brushSize: number;
}

export interface SelectionCanvasRef {
  clearSelection: () => void;
  getMaskDataUrl: () => Promise<string | null>;
}

export const SelectionCanvas = forwardRef<SelectionCanvasRef, SelectionCanvasProps>(
  ({ imageUrl, tool, brushSize }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, top: 0, left: 0 });

    const getCanvasContext = () => canvasRef.current?.getContext('2d');

    // Effect to resize canvas based on image dimensions
    useEffect(() => {
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const parent = canvas.parentElement;
          if (parent) {
            const parentRect = parent.getBoundingClientRect();
            const parentAspectRatio = parentRect.width / parentRect.height;
            const imageAspectRatio = image.naturalWidth / image.naturalHeight;
            
            let width, height, top, left;

            if (imageAspectRatio > parentAspectRatio) {
              width = parentRect.width;
              height = width / imageAspectRatio;
              top = (parentRect.height - height) / 2;
              left = 0;
            } else {
              height = parentRect.height;
              width = height * imageAspectRatio;
              left = (parentRect.width - width) / 2;
              top = 0;
            }

            canvas.width = width;
            canvas.height = height;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            canvas.style.top = `${top}px`;
            canvas.style.left = `${left}px`;
            
            setImageDimensions({ width, height, top, left });
          }
        }
      };
    }, [imageUrl]);


    useImperativeHandle(ref, () => ({
      clearSelection: () => {
        const ctx = getCanvasContext();
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      },
      getMaskDataUrl: async (): Promise<string | null> => {
        const canvas = canvasRef.current;
        const ctx = getCanvasContext();
        if (!canvas || !ctx) return null;

        const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const originalPixels = originalImageData.data;
        
        let hasDrawing = false;
        for (let i = 3; i < originalPixels.length; i += 4) {
          if (originalPixels[i] > 0) {
            hasDrawing = true;
            break;
          }
        }
        if (!hasDrawing) return null; // No drawing, no mask

        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return null;

        maskCtx.fillStyle = '#000000';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        
        const maskImageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        const maskPixels = maskImageData.data;

        for (let i = 0; i < originalPixels.length; i += 4) {
          // If the original canvas pixel has any alpha (meaning it was drawn on)
          if (originalPixels[i + 3] > 0) {
            // Set the corresponding mask pixel to white
            maskPixels[i] = 255;     // R
            maskPixels[i + 1] = 255; // G
            maskPixels[i + 2] = 255; // B
          }
        }
        maskCtx.putImageData(maskImageData, 0, 0);
        return maskCanvas.toDataURL('image/png');
      }
    }));

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const ctx = getCanvasContext();
      if (!ctx) return;
      setIsDrawing(true);
      const { x, y } = getCoordinates(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const ctx = getCanvasContext();
      if (!ctx) return;

      ctx.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.5)'; // red-500 with 50% opacity
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const { x, y } = getCoordinates(e);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const stopDrawing = () => {
      const ctx = getCanvasContext();
      if (!ctx) return;
      ctx.closePath();
      setIsDrawing(false);
    };

    return (
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 cursor-crosshair"
        style={{ touchAction: 'none' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    );
  }
);
