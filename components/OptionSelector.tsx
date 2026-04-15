import React from 'react';
import type { Option } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface OptionSelectorProps<T extends Option> {
  label: string;
  options: T[];
  selectedOption: T;
  onSelect: (option: T) => void;
  renderOption: (option: T) => React.ReactNode;
  disabled?: boolean;
}

export const OptionSelector = <T extends Option>(
  { label, options, selectedOption, onSelect, renderOption, disabled = false }: OptionSelectorProps<T>
) => {
  return (
    <div className={disabled ? 'opacity-50' : ''}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option)}
            disabled={disabled}
            className={`relative p-3 border rounded-lg text-left transition-all duration-200 w-full h-full ${
              selectedOption.id === option.id
                ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-500/30 bg-blue-50 dark:bg-blue-900/20'
                : option.isRecommended
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 hover:border-green-600 dark:hover:border-green-500'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 hover:border-slate-400 dark:hover:border-slate-500'
            } ${disabled ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''}`}
          >
            {renderOption(option)}
            {selectedOption.id === option.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};