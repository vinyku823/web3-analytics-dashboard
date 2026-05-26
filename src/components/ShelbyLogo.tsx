import React from 'react';

interface ShelbyLogoProps {
  className?: string;
  size?: number;
  withPinkBg?: boolean;
}

export function ShelbyLogo({ className = "w-10 h-10", size = 40, withPinkBg = true }: ShelbyLogoProps) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Intense neon/mid-pink premium backplane container matching user image */}
      {withPinkBg && <rect width="200" height="200" rx="46" fill="#ff5fc0" />}
      
      {/* Charcoal brown/black cyber emblem drawn exactly like the image shape */}
      <g transform={withPinkBg ? "translate(25, 25) scale(0.75)" : "translate(0, 0)"} fill={withPinkBg ? "#181316" : "#ff5fc0"}>
        {/* Central three-spoke rotating propeller */}
        <path d="M 100 100 
                 C 100 85, 90 70, 70 70 
                 C 85 85, 90 95, 90 100 
                 C 90 105, 85 115, 70 130 
                 C 90 130, 100 115, 100 100 Z" />
        <path d="M 100 100 
                 C 113 92.5, 126 100, 126 120 
                 C 113 111, 104 105, 100 105 
                 C 96 105, 87 111, 74 120 
                 C 74 100, 87 92.5, 100 100 Z" />
        <path d="M 100 100 
                 C 87 107.5, 74 100, 74 80 
                 C 87 89, 96 95, 100 95 
                 C 104 95, 113 89, 126 80 
                 C 126 100, 113 107.5, 100 100 Z" />
        
        {/* Outer segmented hexagonal ring arcs */}
        {/* Arc A: Left facing rounded hexagonal bracket */}
        <path d="M 50 40 
                 C 40 50, 25 70, 25 100 
                 C 25 130, 40 150, 50 160 
                 L 65 150 
                 C 55 140, 42 120, 42 100 
                 C 42 80, 55 60, 65 50 
                 Z" />
                 
        {/* Arc B: Top Right sloped hexagonal bracket */}
        <path d="M 85 22 
                 L 155 62 
                 C 165 68, 172 78, 172 94 
                 L 154 94 
                 C 154 85, 149 80, 142 76 
                 L 85 40 
                 Z" />
                 
        {/* Arc C: Bottom Right sloped hexagonal bracket */}
        <path d="M 172 106 
                 C 172 122, 165 132, 155 138 
                 L 85 178 
                 L 85 160 
                 L 142 124 
                 C 149 120, 154 115, 154 106 
                 Z" />
      </g>
    </svg>
  );
}
