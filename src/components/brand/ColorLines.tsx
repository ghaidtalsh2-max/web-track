import React from 'react';

interface ColorLinesProps {
  height?: number;
  gap?: number;
  width?: string | number;
  className?: string;
  rounded?: boolean;
}

export const ColorLines: React.FC<ColorLinesProps> = ({
  height = 4,
  gap = 3,
  width = '100%',
  className = '',
  rounded = true,
}) => {
  const lines = [
    { color: '#F9AB00', name: 'yellow' },
    { color: '#EA4335', name: 'red' },
    { color: '#4285F4', name: 'blue' },
    { color: '#34A853', name: 'green' },
  ];

  return (
    <div
      className={`flex flex-col ${className}`}
      style={{
        gap: `${gap}px`,
        width: typeof width === 'number' ? `${width}px` : width,
      }}
      aria-hidden="true"
    >
      {lines.map((l) => (
        <div
          key={l.name}
          style={{
            height: `${height}px`,
            backgroundColor: l.color,
            borderRadius: rounded ? '999px' : '0px',
            width: '100%',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
};
