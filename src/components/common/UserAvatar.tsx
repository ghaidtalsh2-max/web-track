import React from 'react';

export interface UserAvatarProps {
  letter?: string;
  name?: string;
  avatarUrl?: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'flower';
  showBadge?: boolean;
  role?: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  letter,
  name,
  avatarUrl,
  color = '#4285F4',
  size = 'md',
  variant = 'circle',
  showBadge = false,
  role,
  className = '',
}) => {
  // استخراج الحرف الأول من الاسم إذا لم يُمرر الحرف مباشرة
  const displayLetter = letter || (name ? name.trim().charAt(0) : 'ق');

  // أبعاد الأحجام المختلفة
  const sizeMap = {
    xs: { px: 28, text: 'text-[11px]', border: '1.5px', stroke: 2 },
    sm: { px: 38, text: 'text-[15px]', border: '2px', stroke: 2.5 },
    md: { px: 48, text: 'text-[19px]', border: '2.5px', stroke: 3 },
    lg: { px: 76, text: 'text-[30px]', border: '3px', stroke: 3.5 },
    xl: { px: 96, text: 'text-[40px]', border: '3.5px', stroke: 4 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // شارة القائد أو المشرف
  const isLeader = role === 'track_leader';
  const isSupervisor = role === 'supervisor';

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{
        width: `${currentSize.px}px`,
        height: `${currentSize.px}px`,
        minWidth: `${currentSize.px}px`,
        minHeight: `${currentSize.px}px`,
        maxWidth: `${currentSize.px}px`,
        maxHeight: `${currentSize.px}px`,
        borderRadius: '50%',
        aspectRatio: '1 / 1',
      }}
    >
      {/* 1. نمط وردة الهوية الرقمية (Google Pinwheel Petal Frame) */}
      {variant === 'flower' ? (
        <div className="relative w-full h-full flex items-center justify-center rounded-full" style={{ borderRadius: '50%', aspectRatio: '1 / 1' }}>
          {/* بتلات الوردة الخلفية بألوان الهوية الأربعة المتناغمة */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full drop-shadow-sm transition-transform duration-300 hover:rotate-12"
          >
            {/* 4 بتلات هندسية بألوان قوقل الأربعة */}
            <circle cx="50" cy="20" r="18" fill="#EA4335" opacity="0.9" />
            <circle cx="80" cy="50" r="18" fill="#4285F4" opacity="0.9" />
            <circle cx="50" cy="80" r="18" fill="#34A853" opacity="0.9" />
            <circle cx="20" cy="50" r="18" fill="#F9AB00" opacity="0.9" />
            {/* الدائرة المركزية مع حد فاخر */}
            <circle cx="50" cy="50" r="32" fill={color} stroke="#0F1729" strokeWidth="4" />
          </svg>

          {/* محتوى الدائرة المركزية */}
          <div className="relative z-10 flex items-center justify-center text-white font-black">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name || 'صورة العضو'}
                className="w-full h-full rounded-full object-cover"
                style={{ width: currentSize.px * 0.65, height: currentSize.px * 0.65, borderRadius: '50%' }}
              />
            ) : (
              <span
                className={`${currentSize.text} leading-none tracking-tight font-black text-white`}
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {displayLetter}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* 2. نمط الدائرة الكاملة المتقنة الدائرية تماماً */
        <div
          className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-200 hover:scale-[1.03]"
          style={{
            backgroundColor: color,
            borderRadius: '50%',
            aspectRatio: '1 / 1',
            border: `${currentSize.border} solid #0F1729`,
            boxShadow:
              size === 'lg' || size === 'xl'
                ? '0 10px 24px rgba(15, 23, 42, 0.14), inset 0 2px 4px rgba(255, 255, 255, 0.35)'
                : '0 2px 6px rgba(15, 23, 42, 0.15)',
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name || 'صورة العضو'}
              className="w-full h-full object-cover rounded-full"
              style={{ borderRadius: '50%' }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full relative rounded-full" style={{ borderRadius: '50%' }}>
              <span
                className={`${currentSize.text} font-black text-white leading-none drop-shadow-xs select-none`}
                style={{
                  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                }}
              >
                {displayLetter}
              </span>
            </div>
          )}
        </div>
      )}

      {/* شارة التميز أو الرتبة التلقائية إن طُلبت */}
      {showBadge && (isLeader || isSupervisor) && (
        <span
          className="absolute -bottom-1 -left-1 rounded-full flex items-center justify-center bg-[#0F1729] text-white shadow-md border-2 border-white"
          style={{
            width: size === 'lg' || size === 'xl' ? '24px' : '16px',
            height: size === 'lg' || size === 'xl' ? '24px' : '16px',
            fontSize: size === 'lg' || size === 'xl' ? '12px' : '9px',
          }}
          title={isLeader ? 'قائدة المسار' : 'مشرف المسار'}
        >
          {isLeader ? '👑' : '⭐'}
        </span>
      )}
    </div>
  );
};
