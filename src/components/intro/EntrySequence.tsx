import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PinwheelFlower } from '../brand/PinwheelFlower';
import { AsteriskStar } from '../brand/AsteriskStar';
import { BrandDots } from '../brand/BrandDots';
import { ColorLines } from '../brand/ColorLines';
import { GDGLogo } from '../brand/GDGLogo';
import { X, Sparkles } from 'lucide-react';

interface EntrySequenceProps {
  onComplete: () => void;
  isShortVersion?: boolean;
}

export const EntrySequence: React.FC<EntrySequenceProps> = ({
  onComplete,
  isShortVersion = false,
}) => {
  // زمن المشاهد بالثواني
  // 0.0 - 1.0s: شاشة بيضاء بنص تمهيدي
  // 1.0 - 2.6s: أربع موجات قوقل ترتفع في أسفل الشاشة
  // 1.8 - 3.0s: تظهر أيقونات ورموز الهوية الرسمية وتطفو
  // 2.2 - 4.5s: تظهر عبارة «هلا بالمطوّر القوقلي» في المنتصف تماماً بخط كبير ولون أسود
  // 4.4 - 5.2s: تنزل الموجات بسلاسة
  // 5.0 - 5.8s: يرتفع نموذج الدخول ثم يكتمل التسلسل
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const startTime = performance.now();
    const totalDuration = isShortVersion ? 2200 : 5800;

    const interval = setInterval(() => {
      const now = performance.now();
      const diff = (now - startTime) / 1000;
      setElapsed(diff);

      if (diff >= totalDuration / 1000) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete, isShortVersion]);

  const factor = isShortVersion ? 0.38 : 1.0;

  const showInitialText = elapsed < 1.0 * factor;
  const showWaves = elapsed >= 1.0 * factor && elapsed < 5.2 * factor;
  const wavesLowering = elapsed >= 4.4 * factor;
  const showShapes = elapsed >= 1.8 * factor && elapsed < 5.0 * factor;
  const showGreeting = elapsed >= 2.2 * factor && elapsed < 4.5 * factor;
  const showLoginPreview = elapsed >= 5.0 * factor;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF', // خلفية بيضاء نقية دائمة ومطابقة للهوية الرسمية
      }}
      role="dialog"
      aria-modal="true"
      aria-label="تسلسل الدخول الترحيبي الرسمي"
    >
      {/* زر التخطي الدائم */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 100,
        }}
      >
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#000000',
            border: '2px solid #000000',
            boxShadow: '0 4px 0 0 #000000',
          }}
          aria-label="تخطي تسلسل الدخول"
        >
          <span>تخطّي (Esc)</span>
          <X size={15} />
        </button>
      </div>

      {/* الهاشتاق الرسمي #خلّك_قوقلي في الزاوية المقابلة */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          className="px-4 py-2 rounded-full text-xs font-black tracking-wider"
          style={{
            backgroundColor: '#EEF4FD',
            color: '#1D4ED8',
            border: '2px solid #000000',
            boxShadow: '0 4px 0 0 #000000',
          }}
        >
          #خلّك_قوقلي
        </span>
      </div>

      {/* 1. المرحلة الأولى (0.0 – 1.0 ث): شاشة بيضاء بنص تمهيدي */}
      <AnimatePresence>
        {showInitialText && (
          <motion.div
            key="initial-text"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center px-4 z-20"
          >
            <GDGLogo variant="symbol" size="lg" />
            <h2 className="text-xl sm:text-2xl font-black mt-4 text-black">
              نادي قوقل للطلبة المطورين · جامعة الطائف
            </h2>
            <p className="text-sm sm:text-base mt-2 text-gray-600 font-bold">
              مسار تصميم وتطوير الويب 2026
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. الأشكال الرسمية تطفو في الزوايا العلوية والجانبية */}
      <AnimatePresence>
        {showShapes && (
          <motion.div
            key="brand-shapes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
              zIndex: 25,
            }}
          >
            {/* وردة الهوية (Pinwheel) في الزاوية العلوية اليمنى */}
            <motion.div
              initial={{ scale: 0.4, x: 60, y: -60, rotate: -45 }}
              animate={{
                scale: 1,
                x: 0,
                y: [0, -12, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                scale: { duration: 0.8, ease: 'easeOut' },
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{
                position: 'absolute',
                top: '70px',
                right: '70px',
              }}
            >
              <PinwheelFlower color="multi" size={88} animate={true} />
            </motion.div>

            {/* نجمة الهوية بلون أصفر في الزاوية العلوية اليسرى */}
            <motion.div
              initial={{ scale: 0.4, x: -60, y: -40, rotate: 45 }}
              animate={{
                scale: 1,
                x: 0,
                y: [0, 14, 0],
                rotate: [0, -12, 12, 0],
              }}
              transition={{
                scale: { duration: 0.8, ease: 'easeOut', delay: 0.1 },
                y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{
                position: 'absolute',
                top: '90px',
                left: '70px',
              }}
            >
              <AsteriskStar color="yellow" size={72} animate={true} />
            </motion.div>

            {/* خطوط الهوية الملونة في الأعلى */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: 0.9,
              }}
            >
              <ColorLines height={5} gap={3} width={200} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. عبارة «هلا بالمطوّر القوقلي» في المنتصف تماماً وباللون الأسود والخط الكبير */}
      <AnimatePresence>
        {showGreeting && (
          <div
            className="fixed inset-0 flex flex-col items-center justify-center px-4 pointer-events-none"
            style={{
              zIndex: 35,
              paddingBottom: '120px', // رفع خفيف لتستقر في مساحة المنتصف البيضاء فوق التموجات بانسيابية تامة
            }}
          >
            <motion.div
              key="greeting-heading"
              initial={{ opacity: 0, scale: 0.88, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.35 } }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center w-full max-w-4xl"
            >
              {/* الشارة الترحيبية المجسمة في المنتصف */}
              <div className="inline-flex items-center gap-2 mb-5 px-6 py-2 rounded-full bg-white text-black font-black text-xs sm:text-sm border-2 border-black shadow-md">
                <Sparkles size={16} className="text-[#F9AB00]" />
                <span>نادي الطلبة المطورين — جامعة الطائف</span>
              </div>

              {/* العنوان الرئيسي الترحيبي العريض الواضح باللون الأسود الكامل كما طلب */}
              <h1
                className="font-black tracking-tight leading-tight mb-4"
                style={{
                  color: '#000000',
                  fontSize: 'clamp(2.75rem, 5.5vw, 4.75rem)',
                  lineHeight: 1.15,
                  textShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                هلا بالمطوّر القوقلي! ✨
              </h1>

              {/* النص الفرعي التوضيحي باللون الداكن الواضح */}
              <p
                className="font-bold max-w-2xl mx-auto mb-6 text-gray-800"
                style={{
                  fontSize: 'clamp(1.15rem, 2.2vw, 1.6rem)',
                }}
              >
                كل يوم خطوة نحو بناء أفكارك ومشاريعك
              </p>

              <div className="flex justify-center">
                <BrandDots size={14} gap={10} pulse={true} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. تموجات Google الأربع الانسيابية المريحة والسلسة */}
      {showWaves && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* الموجة 1: أصفر (#F9AB00) - تموج انسيابي مريح وسلس ينساب تحت النص برقة */}
            <motion.path
              d="M0,900 L0,530 C 380,450 760,630 1140,510 C 1280,460 1380,490 1440,500 L1440,900 Z"
              fill="#F9AB00"
              initial={{ y: 900 }}
              animate={{ y: wavesLowering ? 900 : 0 }}
              transition={{
                duration: wavesLowering ? 0.9 : 1.5,
                ease: [0.25, 0.1, 0.25, 1.0],
                delay: wavesLowering ? 0.2 : 0.0,
              }}
            />

            {/* الموجة 2: أحمر (#EA4335) */}
            <motion.path
              d="M0,900 L0,600 C 360,530 740,700 1120,590 C 1260,540 1360,570 1440,580 L1440,900 Z"
              fill="#EA4335"
              initial={{ y: 900 }}
              animate={{ y: wavesLowering ? 900 : 0 }}
              transition={{
                duration: wavesLowering ? 0.9 : 1.5,
                ease: [0.25, 0.1, 0.25, 1.0],
                delay: wavesLowering ? 0.15 : 0.1,
              }}
            />

            {/* الموجة 3: أزرق (#4285F4) */}
            <motion.path
              d="M0,900 L0,670 C 340,610 720,770 1100,670 C 1240,620 1340,650 1440,660 L1440,900 Z"
              fill="#4285F4"
              initial={{ y: 900 }}
              animate={{ y: wavesLowering ? 900 : 0 }}
              transition={{
                duration: wavesLowering ? 0.9 : 1.5,
                ease: [0.25, 0.1, 0.25, 1.0],
                delay: wavesLowering ? 0.1 : 0.2,
              }}
            />

            {/* الموجة 4: أخضر (#34A853) */}
            <motion.path
              d="M0,900 L0,750 C 320,690 700,840 1080,750 C 1220,710 1320,730 1440,740 L1440,900 Z"
              fill="#34A853"
              initial={{ y: 900 }}
              animate={{ y: wavesLowering ? 900 : 0 }}
              transition={{
                duration: wavesLowering ? 0.9 : 1.5,
                ease: [0.25, 0.1, 0.25, 1.0],
                delay: wavesLowering ? 0.05 : 0.3,
              }}
            />
          </svg>
        </div>
      )}

      {/* 5. المرحلة الأخيرة (5.0 – 5.8 ث): يرتفع نموذج الدخول برقة */}
      <AnimatePresence>
        {showLoginPreview && (
          <motion.div
            key="login-rising-preview"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center z-40 px-4"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-3xl p-3 shadow-xl border-2 border-[#0F1729]">
              <GDGLogo variant="symbol" size="md" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
              أهلاً بك في مسار الويب 2026
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-bold mb-4">
              الانتقال لشاشة تسجيل الدخول...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
