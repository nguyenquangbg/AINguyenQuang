import React, { useState, ReactNode } from 'react';

interface TabbedControlsProps {
  tabs: { [key: string]: ReactNode };
}

export const TabbedControls: React.FC<TabbedControlsProps> = ({ tabs }) => {
  const tabKeys = Object.keys(tabs);
  const [activeTab, setActiveTab] = useState(tabKeys[0]);

  return (
    <div>
      <div className="bg-slate-200/70 dark:bg-slate-700/50 rounded-lg p-1 flex items-center mb-6 shadow-inner">
        {tabKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-2 px-1 rounded-md font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-offset-slate-800
              ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow'
                  : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/70'
              }
            `}
            aria-current={activeTab === tab ? 'page' : undefined}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="space-y-6">
        {tabs[activeTab]}
      </div>
    </div>
  );
};