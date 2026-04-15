import React from 'react';

export const RustIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h9v9h-9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5v9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 9h.01M14.5 10.5h.01M13.5 12h.01M14.5 13.5h.01M13.5 15h.01" />
  </svg>
);