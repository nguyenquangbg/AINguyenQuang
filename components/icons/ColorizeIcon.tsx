import React from 'react';

export const ColorizeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 007.5-12.75L6.75 20.25A9 9 0 0012 21z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 017.5 12.75L3.75 5.25A9 9 0 0112 3z" />
  </svg>
);
