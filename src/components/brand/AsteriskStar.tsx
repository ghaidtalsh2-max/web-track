import React from 'react';

interface AsteriskStarProps {
  color?: 'yellow' | 'red' | 'blue' | 'green' | 'multi';
  size?: number;
  className?: string;
  animate?: boolean;
}

export const AsteriskStar: React.FC<AsteriskStarProps> = ({
  color = 'multi',
  size = 32,
  className = '',
  animate = false,
}) => {
  const colorMap = {
    yellow: '#F9AB00',
    red: '#EA4335',
    blue: '#4285F4',
    green: '#34A853',
  };

  const currentColor = color === 'multi' ? '#F9AB00' : colorMap[color];

  return (
    <svg
      width={size}
      height={size}
      viewBox="18 18 339 339"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? 'spin-slow' : ''} ${className}`}
      style={{ display: 'inline-block', flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* 3 intersecting bars of the official 6-arm brand asterisk */}
      <path
        d="M310.73439 63.08203 356.8086 142.76563 64.23047 311.9375 18.160157 232.25782Z"
        fill={color === 'multi' ? '#4285F4' : currentColor}
      />
      <path
        d="M141.48047 18.535157H233.51953V356.5H141.48047Z"
        fill={color === 'multi' ? '#EA4335' : currentColor}
      />
      <path
        d="M18.085938 143.14844 63.976564 63.36328 356.9414 231.86328 311.05079 311.64845Z"
        fill={color === 'multi' ? '#34A853' : currentColor}
      />
    </svg>
  );
};
