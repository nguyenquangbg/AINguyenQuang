import React from 'react';
import type { LightColor } from './types';

interface ColorPickerProps {
  label: string;
  colors: { name: LightColor; hex: string }[];
  selectedColor: LightColor;
  onSelect: (color: LightColor) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, colors, selectedColor, onSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{label}</label>
      <div className="flex items-center space-x-2">
        {colors.map(color => (
          <button
            key={color.name}
            onClick={() => onSelect(color.name)}
            className={`w-7 h-7 rounded-full border-2 transition-transform duration-150 ${
              selectedColor === color.name
                ? 'border-slate-800 dark:border-white scale-110 shadow-lg'
                : 'border-transparent hover:scale-110'
            }`}
            style={{ backgroundColor: color.hex }}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
    </div>
  );
};
