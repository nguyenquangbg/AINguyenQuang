import React from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface GeneratedLogoProps {
  name: string;
  acronym: string;
  size?: string;
}

export const GeneratedLogo: React.FC<GeneratedLogoProps> = ({ name, acronym, size = '100%' }) => {
  const stringToColor = (str: string) => {
    // Add randomness to generate different colors on re-render
    str += Math.random();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  const getLuminance = (hex: string) => {
    if (!hex || hex.length < 7) return 0;
    try {
        const rgb = parseInt(hex.substring(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    } catch (e) {
        return 0;
    }
  };

  const bgColor = stringToColor(name);
  const textColor = getLuminance(bgColor) > 0.4 ? '#000000' : '#FFFFFF';
  
  const containerSize = parseInt(size, 10);
  
  // Use 80% of the container for content to leave some padding
  const contentScaleFactor = 0.8; 
  const contentAreaSize = containerSize * contentScaleFactor;

  // Allocate space: 40% for icon, 5% for gap, 55% for text
  const iconHeight = contentAreaSize * 0.4;
  const textMaxHeight = contentAreaSize * 0.55;
  const marginTop = contentAreaSize * 0.05;
  
  // Calculate font size based on width to prevent overflow
  const availableTextWidth = containerSize * 0.9; // Use 90% of width for text
  const avgCharWidthRatio = 0.65; // Heuristic for bold fonts
  const fontSizeFromWidth = availableTextWidth / (acronym.length * avgCharWidthRatio);

  const finalFontSize = Math.floor(Math.min(textMaxHeight, fontSizeFromWidth));

  return (
    <div
      className="w-full h-full rounded-full flex flex-col items-center justify-center font-bold overflow-hidden"
      style={{ 
          backgroundColor: bgColor, 
          color: textColor,
          width: size, 
          height: size, 
          lineHeight: 1
      }}
    >
        <BookOpenIcon style={{ width: `${iconHeight}px`, height: `${iconHeight}px` }} className="opacity-80 shrink-0" />
        <p className="text-center" style={{ fontSize: `${finalFontSize}px`, marginTop: `${marginTop}px` }}>{acronym}</p>
    </div>
  );
};