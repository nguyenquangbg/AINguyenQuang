
import React, { useState } from 'react';
import { GeneratedImage } from './types';
import { ZoomModal } from '../ZoomModal';
import { DownloadIcon } from '../icons/DownloadIcon';
import { ZoomInIcon } from '../icons/ZoomInIcon';


interface ResultGridProps {
  images: GeneratedImage[];
}

export const ResultGrid: React.FC<ResultGridProps> = ({ images }) => {
    const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

    const handleDownload = (imageUrl: string, filename: string) => {
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (images.length === 0) return null;

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <div 
                        key={image.id} 
                        className="relative group aspect-square rounded-lg overflow-hidden animate-fade-in bg-slate-200 dark:bg-slate-800 cursor-pointer"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => setZoomedImageUrl(image.url)}
                    >
                        <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 text-center">
                            <ZoomInIcon className="w-10 h-10 text-white opacity-80" />
                            <p className="text-white text-xs font-semibold mt-2">{image.name}</p>
                            <div className="absolute bottom-3">
                                 <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(image.url, image.name);
                                    }} 
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-md text-xs font-semibold hover:bg-purple-700"
                                >
                                    <DownloadIcon className="w-3.5 h-3.5" />
                                    Tải xuống
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             {zoomedImageUrl && (
                <ZoomModal imageUrl={zoomedImageUrl} onClose={() => setZoomedImageUrl(null)} />
            )}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </>
    );
};
