import { useState, useRef, useEffect, useCallback } from 'react';

const MIN_SCALE = 1;
const MAX_SCALE = 5;

// Helper to get distance between two touch points
const getTouchDistance = (touch1: Touch, touch2: Touch) => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

// Helper to get the center point between two touches
const getTouchCenter = (touch1: Touch, touch2: Touch) => {
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
    };
}

export const useImageZoomPan = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [transform, setTransform] = useState('scale(1) translate(0px, 0px)');
  
  const panState = useRef({
    isPanning: false,
    isZooming: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    scale: 1,
    initialTouchDistance: 0,
  });

  const updateTransform = useCallback(() => {
    let { x, y, scale } = panState.current;
    
    if (scale <= MIN_SCALE) {
        x = 0;
        y = 0;
        scale = MIN_SCALE;
        panState.current.x = x;
        panState.current.y = y;
        panState.current.scale = scale;
    }
    
    setTransform(`scale(${scale}) translate(${x}px, ${y}px)`);
  }, []);
  
  const resetTransform = useCallback(() => {
      panState.current = {
          isPanning: false,
          isZooming: false,
          startX: 0,
          startY: 0,
          x: 0,
          y: 0,
          scale: 1,
          initialTouchDistance: 0,
      };
      updateTransform();
  }, [updateTransform]);

  const onMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    panState.current.isPanning = true;
    panState.current.startX = e.clientX - panState.current.x;
    panState.current.startY = e.clientY - panState.current.y;
  }, []);
  
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!panState.current.isPanning) return;
    e.preventDefault();
    panState.current.x = e.clientX - panState.current.startX;
    panState.current.y = e.clientY - panState.current.startY;
    updateTransform();
  }, [updateTransform]);

  const onMouseUp = useCallback(() => {
    panState.current.isPanning = false;
  }, []);

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const { scale, x, y } = panState.current;
    const { clientX, clientY } = e;
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const delta = e.deltaY * -0.01;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));
    
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    
    const imageX = (mouseX - x) / scale;
    const imageY = (mouseY - y) / scale;
    
    const newX = mouseX - imageX * newScale;
    const newY = mouseY - imageY * newScale;

    panState.current.scale = newScale;
    panState.current.x = newX;
    panState.current.y = newY;
    
    updateTransform();
  }, [updateTransform]);
  
  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        panState.current.isPanning = true;
        panState.current.isZooming = false;
        panState.current.startX = touch.clientX - panState.current.x;
        panState.current.startY = touch.clientY - panState.current.y;
    } else if (e.touches.length === 2) {
        panState.current.isPanning = false;
        panState.current.isZooming = true;
        panState.current.initialTouchDistance = getTouchDistance(e.touches[0], e.touches[1]);
    }
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (panState.current.isPanning && e.touches.length === 1) {
        const touch = e.touches[0];
        panState.current.x = touch.clientX - panState.current.startX;
        panState.current.y = touch.clientY - panState.current.startY;
        updateTransform();
    } else if (panState.current.isZooming && e.touches.length === 2) {
        const newDist = getTouchDistance(e.touches[0], e.touches[1]);
        const scaleMultiplier = newDist / panState.current.initialTouchDistance;
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, panState.current.scale * scaleMultiplier));
        
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const center = getTouchCenter(e.touches[0], e.touches[1]);
        const mouseX = center.x - rect.left;
        const mouseY = center.y - rect.top;

        const imageX = (mouseX - panState.current.x) / panState.current.scale;
        const imageY = (mouseY - panState.current.y) / panState.current.scale;
        
        const newX = mouseX - imageX * newScale;
        const newY = mouseY - imageY * newScale;

        panState.current.x = newX;
        panState.current.y = newY;
        panState.current.scale = newScale;
        panState.current.initialTouchDistance = newDist;
        updateTransform();
    }
  }, [updateTransform]);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) panState.current.isZooming = false;
    if (e.touches.length < 1) panState.current.isPanning = false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', onMouseDown);
      container.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      container.addEventListener('mouseleave', onMouseUp);
      container.addEventListener('wheel', onWheel, { passive: false });
      
      container.addEventListener('touchstart', onTouchStart, { passive: false });
      container.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('touchcancel', onTouchEnd);

      return () => {
        container.removeEventListener('mousedown', onMouseDown);
        container.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('mouseleave', onMouseUp);
        container.removeEventListener('wheel', onWheel);
        
        container.removeEventListener('touchstart', onTouchStart);
        container.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchcancel', onTouchEnd);
      };
    }
  }, [onMouseDown, onMouseMove, onMouseUp, onWheel, onTouchStart, onTouchMove, onTouchEnd]);
  
  useEffect(() => {
      resetTransform();
  }, [imageRef.current, resetTransform]);

  return { containerRef, imageRef, transform };
};