import React from 'react';

interface PinwheelFlowerProps {
  color?: 'yellow' | 'red' | 'blue' | 'green' | 'multi';
  variant?: 'flower' | 'disc';
  size?: number;
  className?: string;
  animate?: boolean;
}

export const PinwheelFlower: React.FC<PinwheelFlowerProps> = ({
  color = 'multi',
  variant = 'flower',
  size = 36,
  className = '',
  animate = false,
}) => {
  const colorMap = {
    yellow: '#F9AB00',
    red: '#EA4335',
    blue: '#4285F4',
    green: '#34A853',
  };

  const selectedColor = color === 'multi' ? '#4285F4' : colorMap[color];

  // إذا كان المطلوب القرص الدائري الرسمي (كما في صفحة 6 وصفحة 13)
  if (variant === 'disc') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 249 249"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animate ? 'spin-slow' : ''} ${className}`}
        style={{ display: 'inline-block', flexShrink: 0 }}
        aria-hidden="true"
      >
        {/* القرص الملون الدائري */}
        <circle cx="124.5" cy="124.5" r="124" fill={selectedColor} />
        {/* تفريغ شكل الوردة الرباعية بالمسار الهندسي الدقيق من كتيب الهوية */}
        <path
          d="M248.03186 63.515604C213.95767 29.441315 159.22315 28.770886 124.2983 61.382066L63.46592 .5496826C29.391633 34.624017 28.721203 89.358409 61.332384 124.28324L.5 185.11563C34.574335 219.1898 89.30872 219.86054 124.23356 187.24916L185.06595 248.08155C219.14012 214.00736 219.81085 159.27283 187.19948 124.347988L248.03186 63.515604Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // الوردة المستقلة بالألوان الأربعة
  const getPetalColors = () => {
    if (color === 'multi') {
      return ['#F9AB00', '#EA4335', '#4285F4', '#34A853'];
    }
    const single = colorMap[color];
    return [single, single, single, single];
  };

  const petals = getPetalColors();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? 'spin-slow' : ''} ${className}`}
      style={{ display: 'inline-block', flexShrink: 0 }}
      aria-hidden="true"
    >
      <g transform="translate(50, 50)">
        <path
          d="M0 0 C 0 -26, 22 -48, 48 -48 C 48 -22, 26 0, 0 0 Z"
          fill={petals[0]}
          transform="rotate(270)"
        />
        <path
          d="M0 0 C 0 -26, 22 -48, 48 -48 C 48 -22, 26 0, 0 0 Z"
          fill={petals[1]}
          transform="rotate(0)"
        />
        <path
          d="M0 0 C 0 -26, 22 -48, 48 -48 C 48 -22, 26 0, 0 0 Z"
          fill={petals[2]}
          transform="rotate(90)"
        />
        <path
          d="M0 0 C 0 -26, 22 -48, 48 -48 C 48 -22, 26 0, 0 0 Z"
          fill={petals[3]}
          transform="rotate(180)"
        />
        <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" opacity="0.95" />
      </g>
    </svg>
  );
};
