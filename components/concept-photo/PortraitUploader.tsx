import React, { useRef } from 'react';
import { UploadedPortrait } from './types';
import { UploadIcon } from '../icons/UploadIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';

interface PortraitUploaderProps {
  onFilesChange: (files: File[]) => void;
  uploadedPortraits: UploadedPortrait[];
}

export const PortraitUploader: React.FC<PortraitUploaderProps> = ({ onFilesChange, uploadedPortraits }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesChange(Array.from(event.target.files));
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const getStatusIndicator = (status: UploadedPortrait['status']) => {
    switch(status) {
      case 'compressing':
        return <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>;
      case 'done':
        return <CheckIcon className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XIcon className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  }

  return (
    <div className="space-y-4">
      <div 
        onClick={handleClick}
        className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          multiple
        />
        <div className="text-slate-500 dark:text-slate-400">
          <UploadIcon className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
          <p className="font-semibold text-sm">Tải tệp lên</p>
          <p className="text-xs mt-1">Tải lên một hoặc nhiều ảnh</p>
        </div>
      </div>
      
      {uploadedPortraits.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {uploadedPortraits.map(portrait => (
            <div key={portrait.id} className="relative aspect-square">
              <img src={portrait.previewUrl} alt={portrait.file.name} className="w-full h-full object-cover rounded-md" />
              <div className="absolute top-1 right-1 bg-black/50 rounded-full p-1">
                {getStatusIndicator(portrait.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
