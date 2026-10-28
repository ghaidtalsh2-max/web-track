import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../../types';
import { soundEngine } from '../../services/audio';
import { ColorLines } from '../brand/ColorLines';
import { X, Sparkles } from 'lucide-react';

interface WelcomeCelebrationModalProps {
  currentUser: UserProfile;
  phraseText: string;
  onComplete: () => void;
}

export const WelcomeCelebrationModal: React.FC<WelcomeCelebrationModalProps> = ({
  currentUser,
  phraseText,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const reducedMotion =
    currentUser.settings?.reducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const soundEnabled = currentUser.settings?.soundEnabled !== false;
  const celebrationsEnabled = currentUser.settings?.celebrations !== false;

  useEffect(() => {
    // تشغيل الأصوات عبر Web Audio API عند فتح النافذة
    if (soundEnabled) {
      soundEngine.resume();
      soundEngine.playWelcomeChime(0.4);
      if (celebrationsEnabled && !reducedMotion) {
        const popTimer = setTimeout(() => {
          soundEngine.playPopSound(0.35);
        }, 180);
        return () => clearTimeout(popTimer);
      }
    }
  }, [soundEnabled, celebrationsEnabled, reducedMotion]);

  useEffect(() => {
    // إغلاق تلقائي بعد 2.8 ثانية
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, 2800);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(autoCloseTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onComplete, 220);
  };

  // أشكال وألوان قصاصات الهوية الرسمية (confetti)
  const confettiItems = React.useMemo(() => {
    if (reducedMotion || !celebrationsEnabled) return [];
    const colors = ['#4285F4', '#EA4335', '#34A853', '#F9AB00'];
    const shapes = ['circle', 'star', 'flower'] as const;

    return Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // 0 - 100%
      yStart: -20 - Math.random() * 40,
      yEnd: 110 + Math.random() * 30,
      duration: 1.8 + Math.random() * 1.2,
      delay: Math.random() * 0.4,
      rotation: Math.random() * 360,
      color: colors[i % colors.length],
      shape: shapes[i % shapes.length],
      size: 14 + Math.random() * 12,
    }));
  }, [reducedMotion, celebrationsEnabled]);

  // شرائط ملونة هابطة من أعلى الشاشة (Streamers)
  const streamerItems = React.useMemo(() => {
    if (reducedMotion || !celebrationsEnabled) return [];
    const colors = ['#4285F4', '#EA4335', '#34A853', '#F9AB00'];
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      left: 6 + i * 9.5 + (Math.random() * 4 - 2),
      width: 6 + Math.random() * 4,
      height: 120 + Math.random() * 80,
      color: colors[i % colors.length],
      duration: 2.2 + Math.random() * 0.8,
      delay: Math.random() * 0.25,
      tilt: (Math.random() - 0.5) * 25,
    }));
  }, [reducedMotion, celebrationsEnabled]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
          onClick={handleClose}
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-label="ترحيب الدخول"
        >
          {/* شرائط الزينة الهابطة من الأعلى (Streamers) */}
          {!reducedMotion &&
            streamerItems.map((s) => (
              <motion.div
                key={s.id}
                initial={{ y: '-150%', opacity: 0, rotate: s.tilt }}
                animate={{ y: '120vh', opacity: [0, 1, 1, 0], rotate: s.tilt * 1.5 }}
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  ease: 'easeInOut',
                }}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: `${s.left}%`,
                  width: `${s.width}px`,
                  height: `${s.height}px`,
                  backgroundColor: s.color,
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))',
                }}
              />
            ))}

          {/* قصاصات الهوية (Confetti: وردة، نجمة، دوائر) */}
          {!reducedMotion &&
            confettiItems.map((c) => (
              <motion.div
                key={c.id}
                initial={{
                  top: `${c.yStart}%`,
                  left: `${c.x}%`,
                  opacity: 0,
                  rotate: 0,
                  scale: 0.6,
                }}
                animate={{
                  top: `${c.yEnd}%`,
                  opacity: [0, 1, 1, 0],
                  rotate: c.rotation + 360,
                  scale: [0.6, 1, 0.9],
                }}
                transition={{
                  duration: c.duration,
                  delay: c.delay,
                  ease: 'easeOut',
                }}
                className="absolute pointer-events-none"
                style={{
                  width: `${c.size}px`,
                  height: `${c.size}px`,
                }}
              >
                {c.shape === 'circle' && (
                  <div
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                )}
                {c.shape === 'star' && (
                  <svg viewBox="0 0 24 24" fill={c.color} className="w-full h-full">
                    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                  </svg>
                )}
                {c.shape === 'flower' && (
                  <svg viewBox="0 0 24 24" fill={c.color} className="w-full h-full">
                    <circle cx="12" cy="7" r="4" />
                    <circle cx="12" cy="17" r="4" />
                    <circle cx="7" cy="12" r="4" />
                    <circle cx="17" cy="12" r="4" />
                    <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
                  </svg>
                )}
              </motion.div>
            ))}

          {/* بطاقة الترحيب المركزية الفاخرة */}
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 30 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg relative z-20 text-center card-3d-tactile"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '32px',
              border: '2.5px solid #0F1729',
              boxShadow:
                '0 25px 60px -15px rgba(15, 23, 42, 0.28), 0 8px 0 0 #0F1729',
              padding: '36px 32px 30px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* زر تخطي في الزاوية */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute left-4 top-4 px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-1 cursor-pointer border-none"
              aria-label="تخطي الترحيب"
            >
              <span>تخطّي</span>
              <X size={14} />
            </button>

            {/* شريط خطوط ألوان الهوية */}
            <div className="flex justify-center mb-5">
              <ColorLines height={4} width="110px" rounded={true} />
            </div>

            {/* أفاتار العضو مع وميض أنيق */}
            <div className="relative inline-block mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl text-white shadow-md mx-auto"
                style={{
                  backgroundColor: currentUser.badgeColor || '#4285F4',
                }}
              >
                {currentUser.avatarLetter || 'م'}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: '#F9AB00' }}
              >
                <Sparkles size={13} />
              </div>
            </div>

            {/* العبارة الترحيبية المختارة بالاسم وباللهجة السعودية المعتمدة */}
            <h2
              className="text-2xl sm:text-3xl font-black text-gray-950 leading-relaxed mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {phraseText}
            </h2>

            <p className="text-xs sm:text-sm font-bold text-gray-500 mb-6">
              مسار تصميم وتطوير الويب · نادي قوقل للطلبة المطورين 🚀
            </p>

            {/* شريط تقدم زمني متحرك ينتهي عند الانتقال التلقائي */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.6, ease: 'linear' }}
                className="h-full rounded-full"
                style={{ backgroundColor: '#4285F4' }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
