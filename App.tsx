
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IdPhotoGenerator } from './components/IdPhotoGenerator';
import { PhotoRestorer } from './components/PhotoRestorer';
import { ImageGenerator } from './components/ImageGenerator';
import { ConceptPhotoGenerator } from './components/concept-photo/ConceptPhotoGenerator';
import { BackgroundChanger } from './components/BackgroundChanger';

type ActiveApp = 'conceptPhoto' | 'idPhoto' | 'photoRestorer' | 'imageGenerator' | 'backgroundChanger';
export type Theme = 'light' | 'dark';

export default function App() {
  const [activeApp, setActiveApp] = useState<ActiveApp>('conceptPhoto');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const apps = [
    { id: 'conceptPhoto', component: <ConceptPhotoGenerator />, name: 'Tạo Concept' },
    { id: 'idPhoto', component: <IdPhotoGenerator />, name: 'Ảnh Thẻ' },
    { id: 'backgroundChanger', component: <BackgroundChanger />, name: 'Thay Nền' },
    { id: 'photoRestorer', component: <PhotoRestorer />, name: 'Phục Hồi Ảnh Cũ' },
    { id: 'imageGenerator', component: <ImageGenerator />, name: 'Tạo Ảnh' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 flex flex-col">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <nav className="bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 sticky top-[64px] z-40 backdrop-blur-md">
        <div className="container mx-auto px-4 flex justify-center">
            <div className="flex items-center space-x-2 p-2 overflow-x-auto no-scrollbar w-full md:w-auto md:justify-center">
                 {apps.map(app => (
                    <button
                        key={app.id}
                        onClick={() => setActiveApp(app.id as ActiveApp)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                            activeApp === app.id 
                              ? 'bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-white shadow-sm' 
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        {app.name}
                    </button>
                 ))}
            </div>
        </div>
      </nav>

      <div className="app-container flex-grow">
        {apps.map(app => (
            <div key={app.id} style={{ display: activeApp === app.id ? 'block' : 'none' }}>
                {app.component}
            </div>
        ))}
      </div>
      
      <footer className="text-center mt-10 pb-8 text-slate-500 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-900/50 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4">
            <p className="mb-2">Powered by Google Gemini & Imagen 3</p>
            <div className="flex items-center justify-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">© AI NGUYỄN QUANG</span>
                <span className="mx-2">•</span>
                <a 
                    href="https://www.facebook.com/quangbg/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                    Liên hệ hỗ trợ
                </a>
            </div>
          </div>
      </footer>
    </div>
  );
}
