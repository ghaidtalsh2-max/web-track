import React from 'react';

interface BrandDotsProps {
  size?: number;
  gap?: number;
  className?: string;
  pulse?: boolean;
}

export const BrandDots: React.FC<BrandDotsProps> = ({
  size = 10,
  gap = 8,
  className = '',
  pulse = false,
}) => {
  const dots = [
    { color: '#F9AB00', name: 'yellow' },
    { color: '#EA4335', name: 'red' },
    { color: '#4285F4', name: 'blue' },
    { color: '#34A853', name: 'green' },
  ];

  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ gap: `${gap}px` }}
      aria-hidden="true"
    >
      {dots.map((d, i) => (
        <span
          key={d.name}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: d.color,
            display: 'inline-block',
            flexShrink: 0,
            animation: pulse ? `pulse-subtle 2s infinite ease-in-out ${i * 0.2}s` : 'none',
          }}
        />
      ))}
    </div>
  );
};
