import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        <ChevronDownIcon
          className={`w-5 h-5 text-slate-500 dark:text-slate-400 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="p-4 bg-white dark:bg-slate-800/30 rounded-b-lg">
          {children}
        </div>
      </div>
    </div>
  );
};
