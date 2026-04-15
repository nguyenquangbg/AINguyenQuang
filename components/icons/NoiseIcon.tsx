
import React from 'react';

export const NoiseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="10" fill="transparent" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 12h.01M12 12h.01M17 12h.01M9 9h.01M15 9h.01M9 15h.01M15 15h.01" />
  </svg>
);
