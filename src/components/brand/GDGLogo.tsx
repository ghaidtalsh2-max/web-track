import React from 'react';
import symbolImg from '../../assets/brand/symbol.png';
import logoStackedLight from '../../assets/brand/logo-stacked-light.png';
import logoStackedDark from '../../assets/brand/logo-stacked-dark.png';
import logoHorizontalColor from '../../assets/brand/logo-horizontal-color.png';

interface GDGLogoProps {
  variant?: 'full' | 'symbol' | 'stacked';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GDGLogo: React.FC<GDGLogoProps> = ({
  variant = 'full',
  theme = 'auto',
  className = '',
  size = 'md',
}) => {
  const heightMap = {
    sm: { symbol: 24, full: 32, stacked: 48 },
    md: { symbol: 32, full: 42, stacked: 64 },
    lg: { symbol: 48, full: 56, stacked: 88 },
    xl: { symbol: 64, full: 72, stacked: 110 },
  };

  const currentHeight = heightMap[size];

  if (variant === 'symbol') {
    return (
      <img
        src={symbolImg}
        alt="شعار نادي قوقل للطلبة المطورين"
        style={{
          height: `${currentHeight.symbol}px`,
          width: 'auto',
          objectFit: 'contain',
        }}
        className={`inline-block flex-shrink-0 ${className}`}
      />
    );
  }

  if (variant === 'stacked') {
    return (
      <img
        src={theme === 'dark' ? logoStackedDark : logoStackedLight}
        alt="شعار GDG on Campus — جامعة الطائف"
        style={{
          height: `${currentHeight.stacked}px`,
          width: 'auto',
          objectFit: 'contain',
        }}
        className={`inline-block flex-shrink-0 ${className}`}
      />
    );
  }

  // Full / Horizontal
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} dir="ltr">
      <img
        src={theme === 'dark' ? logoStackedDark : logoHorizontalColor}
        alt="Google Developer Groups on Campus — Taif University"
        style={{
          height: `${currentHeight.full}px`,
          width: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};
