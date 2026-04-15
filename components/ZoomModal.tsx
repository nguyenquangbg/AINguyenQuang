
import React, { useEffect } from 'react';
import { XIcon } from './icons/XIcon';

interface ZoomModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({ imageUrl, onClose }) => {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ảnh đã phóng to"
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on the image itself
      >
        <img 
            src={imageUrl} 
            alt="Ảnh đã tạo được phóng to" 
            className="object-contain w-full h-full max-h-[90vh] rounded-lg"
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Đóng"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
