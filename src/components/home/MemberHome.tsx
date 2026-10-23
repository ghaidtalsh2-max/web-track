import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, NavTab, ActionItem } from '../../types';
import { store, NEXT_MISSION } from '../../services/store';

interface MemberHomeProps {
  currentUser: UserProfile;
  onNavigateTab: (tab: NavTab) => void;
  onOpenInquiryModal: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const MemberHome: React.FC<MemberHomeProps> = ({
  currentUser,
  onNavigateTab,
  onOpenInquiryModal,
}) => {
  const dynamicWords = [
    { text: 'مشروعك', color: '#4285F4' },
    { text: 'حلمك', color: '#EA4335' },
    { text: 'موقعك', color: '#34A853' },
    { text: 'إنجازك', color: '#FBBC04' },
  ];
  const [wordIndex, setWordIndex] = useState(0);

  const prefersReducedMotion =
    currentUser.settings?.reducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, dynamicWords.length]);

  const [actionItems] = useState<ActionItem[]>(() => store.getActionItems());

  const getGreeting = () => {
    if (currentUser.role === 'track_leader') {
      const leaderFirst = currentUser.fullName.split(' ')[0];
      return `هلا بالقائدة ${leaderFirst}`;
    }
    const isFemale = currentUser.gender === 'female';
    const first = currentUser.fullName.split(' ')[0];
    return isFemale ? `هلا بالمطوّرة ${first}` : `هلا بالمطوّر ${first}`;
  };

  const handleActionClick = (item: ActionItem) => {
    if (item.targetTab) {
      onNavigateTab(item.targetTab);
    }
  };

  const [progressPercent, setProgressPercent] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) {
      setProgressPercent(60);
      return;
    }
    const startTime = performance.now();
    const duration = 1000;
    const animateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setProgressPercent(Math.round(eased * 60));
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    };
    const frame = requestAnimationFrame(animateCounter);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion]);

  // أيام الأسبوع المطابقة لصفحة 3 بالمرجع
  // ح 4 (أزرق)، ن 5، ث 6، ر 7 (أزرق)، خ 8 (أصفر)، ج 9 (أصفر)، س 10
  const weekDays = [
    { label: 'ح', num: 4, hasDot: true, dotColor: '#4285F4', bgCircle: '#EEF4FD' },
    { label: 'ن', num: 5, hasDot: false },
    { label: 'ث', num: 6, hasDot: false },
    { label: 'ر', num: 7, hasDot: true, dotColor: '#4285F4', bgCircle: '#EEF4FD' },
    { label: 'خ', num: 8, hasDot: true, dotColor: '#F9AB00', bgCircle: '#FEF7E0' },
    { label: 'ج', num: 9, hasDot: true, dotColor: '#F9AB00', bgCircle: '#FEF7E0' },
    { label: 'س', num: 10, hasDot: false },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container py-8 sm:py-12 text-right"
    >
      {/* 1. الترحيب (العنصر الأول في التتابع) */}
      <motion.div variants={itemVariants} className="mb-2 text-right">
        <span
          className="text-base sm:text-lg font-bold"
          style={{ color: '#4285F4' }}
        >
          {getGreeting()}
        </span>
      </motion.div>

      {/* 2. الجملة الكبيرة مع الكلمة المتناوبة عموديًا وبدون خط سفلي (العنصر الثاني في التتابع) */}
      <motion.div variants={itemVariants} className="mb-8 sm:mb-12 text-right">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            كل يوم خطوة نحو
          </h1>

          <div
            className="inline-flex items-baseline relative overflow-hidden h-[1.3em] align-baseline"
            style={{
              minWidth: '220px',
              maxWidth: '320px',
            }}
          >
            {prefersReducedMotion ? (
              <span
                className="text-3xl sm:text-5xl md:text-6xl font-black inline-block"
                style={{ color: dynamicWords[0].color }}
              >
                {dynamicWords[0].text}
              </span>
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={dynamicWords[wordIndex].text}
                  initial={{ y: 35, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -35, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="text-3xl sm:text-5xl md:text-6xl font-black inline-block whitespace-nowrap"
                  style={{ color: dynamicWords[wordIndex].color }}
                >
                  {dynamicWords[wordIndex].text}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>

      {/* 3. شبكة المحتوى (home-grid: 1fr للعمود الأيمن و 360px للعمود الأيسر) */}
      <div className="home-grid">
        {/* العمود الأيمن (الرئيسي): الخطوة التالية + ينتظرك */}
        <div className="flex flex-col gap-6">
          {/* بطاقة الخطوة التالية الصفراء */}
          <motion.div variants={itemVariants} className="next-mission-card">
            {/* النص على اليمين */}
            <div className="flex-1 text-right">
              <div className="text-xs sm:text-sm font-black text-gray-950 mb-1">
                الخطوة التالية · {NEXT_MISSION.dueText}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950">
                {NEXT_MISSION.title}
              </h2>
            </div>

            {/* الزر على اليسار */}
            <button
              onClick={() => onNavigateTab('challenges')}
              className="next-mission-btn"
            >
              ابدأ
            </button>
          </motion.div>

          {/* عنوان "ينتظرك" */}
          <motion.div variants={itemVariants} className="mt-2 text-right">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">
              ينتظرك
            </h3>
          </motion.div>

          {/* بطاقات "ينتظرك" الثلاثة بالتتابع */}
          <div className="flex flex-col gap-4">
            {/* 1. استبيان */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="p-5 sm:p-6 rounded-3xl flex items-center justify-between gap-4 card-navy"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '28px',
                border: '2px solid #4285F4',
              }}
            >
              {/* المحتوى على اليمين */}
              <div className="flex items-center gap-4 text-right flex-1">
                <span
                  className="badge-pill"
                  style={{
                    backgroundColor: '#4285F4',
                    color: '#FFFFFF',
                  }}
                >
                  استبيان
                </span>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-gray-900">
                    أي ورشة تبغون الأسبوع الجاي؟
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                    ينتهي بعد ٣ أيام · يفتح صفحة الاستبيان ←
                  </p>
                </div>
              </div>

              {/* الزر على اليسار */}
              <button
                onClick={() => handleActionClick(actionItems[0])}
                className="btn-pill btn-pill-blue px-7 py-2.5 text-sm"
              >
                جاوب
              </button>
            </motion.div>

            {/* 2. ورشة */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="p-5 sm:p-6 rounded-3xl flex items-center justify-between gap-4 card-navy"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '28px',
                border: '2px solid #0F1729',
              }}
            >
              {/* المحتوى على اليمين */}
              <div className="flex items-center gap-4 text-right flex-1">
                <span
                  className="badge-pill"
                  style={{
                    backgroundColor: '#34A853',
                    color: '#FFFFFF',
                  }}
                >
                  ورشة
                </span>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-gray-900">
                    Grid و Flexbox · الأحد ٨ مساءً
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                    سجّلي حضورك
                  </p>
                </div>
              </div>

              {/* الزر على اليسار */}
              <button
                onClick={() => handleActionClick(actionItems[1])}
                className="btn-pill btn-pill-green px-7 py-2.5 text-sm"
              >
                سجّل
              </button>
            </motion.div>

            {/* 3. اتعلّم */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="p-5 sm:p-6 rounded-3xl flex items-center justify-between gap-4 card-navy"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '28px',
                border: '2px solid #0F1729',
              }}
            >
              {/* المحتوى على اليمين */}
              <div className="flex items-center gap-4 text-right flex-1">
                <span
                  className="badge-pill"
                  style={{
                    backgroundColor: '#F9AB00',
                    color: '#0F1729',
                  }}
                >
                  اتعلّم
                </span>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-gray-900">
                    CSS · Flexbox
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                    اختياري لمستواك
                  </p>
                </div>
              </div>

              {/* الزر على اليسار */}
              <button
                onClick={() => handleActionClick(actionItems[2])}
                className="btn-pill btn-pill-yellow px-7 py-2.5 text-sm"
              >
                افتح
              </button>
            </motion.div>
          </div>
        </div>

        {/* العمود الأيسر (الجانبي): أسبوعك + حلقة التقدم + اكتب لنا */}
        <div className="flex flex-col gap-6">
          {/* بطاقة أسبوعك */}
          <motion.div variants={itemVariants} className="week-card">
            <h3 className="text-lg font-black text-gray-900 mb-6 text-right">
              أسبوعك
            </h3>

            {/* شريط الأيام من الأحد إلى السبت في صف أفقي واحد */}
            <div className="week-grid" dir="rtl">
              {weekDays.map((d) => (
                <div key={d.label} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-gray-600">
                    {d.label}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                    style={{
                      backgroundColor: d.bgCircle || '#F1F3F5',
                      color: '#0F1729',
                    }}
                  >
                    {d.num}
                  </div>
                  <div className="h-2 flex items-center justify-center">
                    {d.hasDot && (
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ backgroundColor: d.dotColor }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* بطاقة نسبة التقدم (النص على اليمين والحلقة الخضراء على اليسار) */}
          <motion.div variants={itemVariants} className="progress-card">
            {/* تفاصيل المستوى والنقاط على اليمين */}
            <div className="text-right flex-1">
              <div className="text-sm font-bold text-gray-500 mb-0.5">
                المرحلة 2
              </div>
              <h4 className="text-base font-black text-gray-900">
                التطوير التفاعلي
              </h4>
              <div className="text-sm font-black text-green-600 mt-1">
                350 نقطة
              </div>
            </div>

            {/* الحلقة الخضراء على اليسار */}
            <div className="progress-ring-box">
              <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E2E8F0"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#34A853"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
              </svg>
              <span className="absolute font-black text-xl text-gray-900">
                {progressPercent}%
              </span>
            </div>
          </motion.div>

          {/* زر اكتب لنا العريض الأصفر */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenInquiryModal}
            className="inquiry-btn"
          >
            <span>✎ اكتب لنا</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
