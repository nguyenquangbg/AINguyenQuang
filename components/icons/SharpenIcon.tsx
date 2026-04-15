
import React from 'react';

export const SharpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5l7.5 7.5-7.5 7.5-7.5-7.5L12 4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l-7.5-7.5" opacity="0.4"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l7.5-7.5" opacity="0.4"/>
    </svg>
);
