// This utility simulates client-side image compression.
// In a real-world scenario, you might use a library like 'browser-image-compression'.

const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;
const QUALITY = 0.8;

export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        image.src = e.target.result;
      } else {
        reject(new Error("Couldn't read file."));
      }
    };

    image.onload = () => {
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error("Couldn't get canvas context."));
        return;
      }

      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas to Blob conversion failed."));
            return;
          }
          const compressedFile = new File([blob], file.name, {
            type: `image/jpeg`,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        'image/jpeg',
        QUALITY
      );
    };

    image.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const mimeType = blob.type || 'image/png';
  const fileExtension = mimeType.split('/')[1];
  const newFilename = filename.includes('.') ? filename : `${filename}.${fileExtension}`;
  
  return new File([blob], newFilename, { type: mimeType });
};
