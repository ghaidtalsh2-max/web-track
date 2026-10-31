import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, NavTab, ActionItem, WeeklyDay, Workshop, DayActivity } from '../../types';
import { store, NEXT_MISSION } from '../../services/store';
import { WorkshopDetailsModal } from './WorkshopDetailsModal';
import { DualProgressMeters } from './DualProgressMeters';
import { Calendar, Layers, ExternalLink, X, ChevronLeft, Trophy, Crown, Sparkles, TrendingUp, Info, ShieldCheck, Clock } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';
import { PinwheelFlower } from '../brand/PinwheelFlower';
import { GDGLogo } from '../brand/GDGLogo';
import { isFemaleUser, gText, genderVocab } from '../../utils/gender';

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
  // الكلمة المتبدّلة في جملة الرئيسية باللون المعتمد #4285F4
  const dynamicWords = [
    { text: 'مشروعك', color: '#4285F4' },
    { text: 'حلمك', color: '#4285F4' },
    { text: 'موقعك', color: '#4285F4' },
    { text: 'إنجازك', color: '#4285F4' },
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

  const [actionItems, setActionItems] = useState<ActionItem[]>(() => store.getActionItems());
  const [workshops, setWorkshops] = useState<Workshop[]>(() => store.getWorkshops());
  const [weekDays, setWeekDays] = useState<WeeklyDay[]>(() => store.getWeeklyDays());
  const [rankings, setRankings] = useState(() => store.getActiveRankings());
  const [poll, setPoll] = useState(() => store.getPoll());
  const [tasks, setTasks] = useState(() => store.getTasks());
  const [allMembers, setAllMembers] = useState(() => store.getMembers());
  const [showAllLeaderboard, setShowAllLeaderboard] = useState(false);
  const [boardPeriod, setBoardPeriod] = useState<'week' | 'month' | 'all'>('week');

  // حالة فتح نافذة تفاصيل الورشة
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);

  // حالة فتح نافذة أنشطة اليوم المختار في شريط الأسبوع
  const [selectedDay, setSelectedDay] = useState<WeeklyDay | null>(null);

  // اشتراك لتحديث البيانات الفورية من store
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setActionItems(store.getActionItems());
      setWorkshops(store.getWorkshops());
      setWeekDays(store.getWeeklyDays());
      setRankings(store.getActiveRankings());
      setPoll(store.getPoll());
      setTasks(store.getTasks());
      setAllMembers(store.getMembers());
    });
    return unsubscribe;
  }, []);

  const isFemale = isFemaleUser(currentUser);

  const getGreeting = () => {
    const leaderFirst = currentUser.fullName.split(' ')[0];
    if (currentUser.role === 'track_leader') {
      return `هلا بالقائدة ${leaderFirst}`;
    }
    if (currentUser.role === 'co_leader') {
      return `هلا بنائب قائد المجال ${leaderFirst}`;
    }
    if (currentUser.role === 'supervisor') {
      if (currentUser.roleTitle?.includes('قائد النادي')) return `هلا بقائد النادي ${leaderFirst}`;
      if (currentUser.roleTitle?.includes('قائدة النادي')) return `هلا بقائدة النادي ${leaderFirst}`;
      if (currentUser.roleTitle?.includes('قائدة المجالات')) return `هلا بقائدة المجالات ${leaderFirst}`;
      if (currentUser.roleTitle?.includes('نائب قائدة المجالات')) return `هلا بنائب قائدة المجالات ${leaderFirst}`;
      if (currentUser.roleTitle?.includes('مستشارة النادي')) return `هلا بمستشارة النادي ${leaderFirst}`;
      return isFemale ? `هلا بالمشرفة ${leaderFirst}` : `هلا بالمشرف ${leaderFirst}`;
    }
    return isFemale ? `هلا بالمطوّرة ${leaderFirst}` : `هلا بالمطوّر ${leaderFirst}`;
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

  const currentWorkshop = workshops.length > 0 ? workshops[0] : null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container py-8 sm:py-12 text-right"
    >
      {/* 1. الترحيب بالاسم */}
      <motion.div variants={itemVariants} className="mb-2 text-right">
        <span
          className="text-base sm:text-lg font-bold"
          style={{ color: '#4285F4' }}
        >
          {getGreeting()}
        </span>
      </motion.div>

      {/* 2. الجملة الكبيرة مع الكلمة المتناوبة عموديًا بلون #4285F4 */}
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
                style={{ color: '#4285F4' }}
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
                  style={{ color: '#4285F4' }}
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
        {/* العمود الأيمن (الرئيسي): خانات الورش والاستبيان والتحدي */}
        <div className="flex flex-col gap-6">
          {/* عنوان "ينتظرك" */}
          <motion.div variants={itemVariants} className="text-right">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">
              ينتظرك
            </h3>
          </motion.div>

          {/* بطاقات "ينتظرك" الثلاث (فراغ واضح و 3D صلب لكل بطاقة) */}
          <div className="home-mission-stack">
            {/* 1. خانة الورشة التطبيقية - أخضر صلب 3D متطابق مع البطاقة بالأعلى */}
            <motion.div
              variants={itemVariants}
              className="next-mission-card"
              style={{
                backgroundColor: '#34A853',
                color: '#FFFFFF',
              }}
            >
              <div className="flex-1 text-right">
                <div className="text-xs sm:text-sm font-black text-emerald-950 mb-1 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                  <span>ورشة تطبيقية · {currentWorkshop ? currentWorkshop.scheduledAt : 'الأسبوع القادم'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-950">
                  {currentWorkshop ? currentWorkshop.title : 'ورشة العمل التطبيقية 💻'}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-emerald-950 mt-1 opacity-90">
                  {currentWorkshop
                    ? currentWorkshop.description.slice(0, 85) + '...'
                    : 'في انتظار إعلان وتحديد موعد وتفاصيل الورشة القادمة من القائدة ⏳'}
                </p>
              </div>

              {currentWorkshop ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWorkshop(currentWorkshop);
                    setIsWorkshopModalOpen(true);
                  }}
                  className="next-mission-btn"
                >
                  {isFemale ? 'شوفي التفاصيل' : 'شوف التفاصيل'}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="next-mission-btn opacity-95 cursor-default"
                >
                  قريباً
                </button>
              )}
            </motion.div>

            {/* 2. خانة استبيان الأسبوع والتصويت - أزرق صلب 3D متطابق مع البطاقة بالأعلى */}
            <motion.div
              variants={itemVariants}
              className="next-mission-card"
              style={{
                backgroundColor: '#4285F4',
                color: '#FFFFFF',
              }}
            >
              <div className="flex-1 text-right">
                <div className="text-xs sm:text-sm font-black text-blue-950 mb-1 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                  <span>استبيان وتصويت · {poll ? 'تصويت مفتوح الآن' : 'في انتظار الطرح'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {poll ? poll.title : 'استبيان الأسبوع والتصويت 📊'}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-blue-100 mt-1 opacity-95">
                  {poll
                    ? (isFemale ? 'شاركي بصوتك لاختيار موضوع الورشة واكسبي نقاط المشاركة (+10 نقاط) 🎯' : 'شارك بصوتك لاختيار موضوع الورشة واكسب نقاط المشاركة (+10 نقاط) 🎯')
                    : 'في انتظار طرح الاستبيان والمشاركة القادمة من القائدة ⏳'}
                </p>
              </div>

              {poll ? (
                <button
                  type="button"
                  onClick={() => onNavigateTab('community')}
                  className="next-mission-btn"
                >
                  {isFemale ? 'شاركي وصوّتي' : 'شارك وصوّت'}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="next-mission-btn opacity-95 cursor-default"
                >
                  بانتظار الطرح
                </button>
              )}
            </motion.div>

            {/* 3. خانة التحديات والمهام البرمجية - أصفر/عنبر صلب 3D متطابق مع البطاقة بالأعلى */}
            <motion.div
              variants={itemVariants}
              className="next-mission-card"
              style={{
                backgroundColor: '#F9AB00',
                color: '#0F1729',
              }}
            >
              <div className="flex-1 text-right">
                <div className="text-xs sm:text-sm font-black text-amber-950 mb-1 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-950 shadow-xs" />
                  <span>تحدي وتاسك · {tasks && tasks.length > 0 ? `+${tasks[0].pointsReward || 50} نقطة` : 'في انتظار الطرح'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-950">
                  {tasks && tasks.length > 0 ? tasks[0].title : 'المهمة والتحدي القادم 🎯'}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-amber-950 mt-1 opacity-90">
                  {tasks && tasks.length > 0
                    ? (isFemale ? 'نفّذي الخيار البرمجي المفضل وارفعيه للاعتماد لتتصدّري لوحة التفاعل! 🚀' : 'نفّذ الخيار البرمجي المفضل وارفعه للاعتماد لتصدّر لوحة التفاعل! 🚀')
                    : 'في انتظار إطلاق التحديات والمهام التابعة للورش من القائدة ⏳'}
                </p>
              </div>

              {tasks && tasks.length > 0 ? (
                <button
                  type="button"
                  onClick={() => onNavigateTab('challenges')}
                  className="next-mission-btn"
                >
                  {isFemale ? 'ابدئي التحدي' : 'ابدأ التحدي'}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="next-mission-btn opacity-95 cursor-default"
                >
                  قريباً
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* العمود الأيسر (الجانبي): شريط أسبوعك الديناميكي + المؤشران الإبداعيان + اكتب لنا */}
        <div className="flex flex-col gap-6 w-full lg:w-[380px] shrink-0">
          {/* بطاقة أسبوعك التفاعلية مع دعم تقسيم الدائرة لأنصاف وأثلاث */}
          <motion.div variants={itemVariants} className="week-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900 text-right">
                أسبوعك
              </h3>
              <span className="text-[11px] font-bold text-gray-400">
                اضغط على اليوم لعرض أنشطته
              </span>
            </div>

            {/* شريط الأيام السبعة: رمادي كامل ونظيف بدون دائرة بالوسط، ويتلون بأخضر الورش عند وجود ورشة */}
            <div className="week-grid" dir="rtl">
              {weekDays.map((d) => {
                const count = d.activities.length;
                const hasWorkshop = d.activities.some((a) => a.type === 'workshop');
                const hasTask = d.activities.some((a) => a.type === 'task');
                const hasPoll = d.activities.some((a) => a.type === 'poll');

                let bgColor = '#E2E8F0'; // رمادي كامل ونظيف
                let textColor = '#475569';

                if (hasWorkshop) {
                  bgColor = '#34A853'; // أخضر ورش العمل التطبيقية
                  textColor = '#FFFFFF';
                } else if (hasTask) {
                  bgColor = '#F9AB00'; // أصفر التاسك
                  textColor = '#FFFFFF';
                } else if (hasPoll) {
                  bgColor = '#4285F4'; // أزرق الاستبيان
                  textColor = '#FFFFFF';
                } else if (count > 0) {
                  bgColor = d.activities[0].color || '#34A853';
                  textColor = '#FFFFFF';
                }

                const dayStyle: React.CSSProperties = {
                  backgroundColor: bgColor,
                  color: textColor,
                  border: d.isToday ? '2px solid #0F1729' : '1px solid transparent',
                  boxShadow: d.isToday ? '0 2px 4px rgba(15, 23, 41, 0.15)' : 'none',
                };

                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    className="week-day-btn"
                    style={dayStyle}
                    title={`عرض أنشطة يوم ${d.dayFullName} (${count} نشاط)`}
                  >
                    <span className="text-[11px] font-bold leading-none opacity-85">
                      {d.dayName}
                    </span>
                    <span className="text-xs font-black leading-none mt-1">
                      {d.dateNumber}
                    </span>
                    {count > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-95 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* المؤشران الإبداعيان (مؤشر التفاعل بشكل الوردة + مؤشر التعلم بشكل النجمة) */}
          <motion.div variants={itemVariants}>
            {(() => {
              const eng = store.getEngagementBreakdown(currentUser.id);
              return (
                <DualProgressMeters
                  engagementPercent={eng.totalEngagementPercent}
                  learningPercent={currentUser.points ? Math.min(100, Math.round(((currentUser.points) / 1500) * 100)) : 0}
                  points={currentUser.points || 0}
                  levelNumber={currentUser.levelNumber || 1}
                  levelTitle={currentUser.webLevelTitle?.split(':')[1] || 'التطوير التفاعلي'}
                  attendanceRate={eng.attendanceRate}
                  tasksRate={eng.tasksRate}
                  participationRate={eng.participationScore}
                />
              );
            })()}
          </motion.div>

          {/* زر اكتب لنا العريض */}
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

      {/* ================= لوحة التفاعل المعتمدة (Board Prototype) ================= */}
      {(() => {
        const [period, setPeriod] = [boardPeriod, setBoardPeriod];
        // حساب النقاط بحسب الفترة
        const membersList = allMembers.filter((m) => m.role === 'member');
        const sortedMembers = [...membersList].sort((a, b) => {
          const ptsA = period === 'week' ? (a.points ? Math.round(a.points * 0.15) : 0) : period === 'month' ? (a.points ? Math.round(a.points * 0.45) : 0) : (a.points || 0);
          const ptsB = period === 'week' ? (b.points ? Math.round(b.points * 0.15) : 0) : period === 'month' ? (b.points ? Math.round(b.points * 0.45) : 0) : (b.points || 0);
          return ptsB - ptsA;
        });

        const getPts = (m: UserProfile) => {
          if (period === 'week') return m.points ? Math.round(m.points * 0.15) : 0;
          if (period === 'month') return m.points ? Math.round(m.points * 0.45) : 0;
          return m.points || 0;
        };

        // المتصدرون مع بيانات النموذج المرجعي الأصلي كقيم افتراضية في حال كانت النقاط صفر
        const top1Name = sortedMembers[0]?.points ? sortedMembers[0].fullName : 'عبدالعزيز';
        const top1Letter = sortedMembers[0]?.points ? (sortedMembers[0].avatarLetter || sortedMembers[0].fullName[0]) : 'ع';
        const top1Points = sortedMembers[0]?.points ? getPts(sortedMembers[0]) : (period === 'week' ? 47 : period === 'month' ? 140 : 310);

        const top2Name = sortedMembers[1]?.points ? sortedMembers[1].fullName : 'نورة';
        const top2Letter = sortedMembers[1]?.points ? (sortedMembers[1].avatarLetter || sortedMembers[1].fullName[0]) : 'ن';
        const top2Points = sortedMembers[1]?.points ? getPts(sortedMembers[1]) : (period === 'week' ? 31 : period === 'month' ? 95 : 210);

        const top3Name = sortedMembers[2]?.points ? sortedMembers[2].fullName : 'مها';
        const top3Letter = sortedMembers[2]?.points ? (sortedMembers[2].avatarLetter || sortedMembers[2].fullName[0]) : 'م';
        const top3Points = sortedMembers[2]?.points ? getPts(sortedMembers[2]) : (period === 'week' ? 24 : period === 'month' ? 70 : 160);

        // قائمة الأقرب لك
        const defaultClosest = [
          { rank: 4, name: 'بشرى', letter: 'ب', pts: period === 'week' ? 20 : period === 'month' ? 58 : 130, pct: 42 },
          { rank: 5, name: 'ريماس', letter: 'ر', pts: period === 'week' ? 18 : period === 'month' ? 52 : 115, pct: 38 },
          { rank: 6, name: 'دانة', letter: 'د', pts: period === 'week' ? 15 : period === 'month' ? 44 : 95, pct: 30 },
        ];

        const userPts = getPts(currentUser) || (period === 'week' ? 10 : period === 'month' ? 30 : 65);
        const userPct = Math.min(100, Math.round((userPts / (top1Points || 1)) * 100)) || 20;

        return (
          <motion.div
            variants={itemVariants}
            id="leaderboard-section"
            className="mt-12 text-right"
          >
            {/* ترويسة اللوحة وتبديل الفترات */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
                  تفاعل الأسبوع
                </h2>
                <p className="text-base sm:text-lg text-gray-600 font-bold mt-1">
                  أول ٣ هذا الأسبوع، والباقي بحسب نشاطهم.
                </p>
              </div>

              {/* أزرار تبديل الفترة (tabs-proto) */}
              <div className="tabs-proto">
                <button
                  type="button"
                  onClick={() => setPeriod('week')}
                  className={period === 'week' ? 'on' : ''}
                >
                  هذا الأسبوع
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('month')}
                  className={period === 'month' ? 'on' : ''}
                >
                  الشهر
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('all')}
                  className={period === 'all' ? 'on' : ''}
                >
                  الكل
                </button>
              </div>
            </div>

            {/* تخطيط اللوحة المتجاوب: المنصة وقائمة الأقرب لك (flex: 3) + البطاقات الجانبية (flex: 2) */}
            <div className="flex flex-col lg:flex-row gap-6 items-start mt-6">
              {/* العمود الأيمن (flex: 3): المنصة وأسفلها "الأقرب لك" */}
              <div style={{ flex: 3 }} className="w-full">
                {/* المنصة 3 أعمدة بجانب بعض بارتفاعات مختلفة (الأول في المنتصف وأطول)، عرضها الأقصى 760px */}
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-end',
                    maxWidth: '760px',
                    margin: '0 auto',
                  }}
                >
                  {/* المركز الثاني (اليمين): 230px #E8F0FE */}
                  <div
                    className="k"
                    style={{
                      flex: 1,
                      height: '230px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#E8F0FE',
                      textAlign: 'center',
                      padding: '18px 10px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Arimo',
                        fontWeight: 700,
                        fontSize: '20px',
                        color: '#0F172A',
                      }}
                    >
                      2
                    </div>
                    <div
                      style={{
                        flex: 'none',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: '#fff',
                        border: '4px solid #fff',
                        boxShadow: '0 0 0 3px #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '28px',
                        color: '#0F172A',
                        overflow: 'hidden',
                      }}
                    >
                      {top2Letter}
                    </div>
                    <b style={{ fontSize: '20px', color: '#0F172A' }}>
                      {top2Name}
                    </b>
                    <span style={{ fontFamily: 'Arimo', fontSize: '17px', color: '#0F172A' }}>
                      {top2Points} نقطة
                    </span>
                  </div>

                  {/* المركز الأول (المنتصف - الأطول): 280px #FFF1CC */}
                  <div
                    className="k"
                    style={{
                      flex: 1,
                      height: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#FFF1CC',
                      textAlign: 'center',
                      padding: '18px 10px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Arimo',
                        fontWeight: 700,
                        fontSize: '20px',
                        color: '#0F172A',
                      }}
                    >
                      1
                    </div>
                    <div
                      style={{
                        flex: 'none',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: '#fff',
                        border: '4px solid #fff',
                        boxShadow: '0 0 0 3px #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '28px',
                        color: '#0F172A',
                        overflow: 'hidden',
                      }}
                    >
                      {top1Letter}
                    </div>
                    <b style={{ fontSize: '20px', color: '#0F172A' }}>
                      {top1Name}
                    </b>
                    <span style={{ fontFamily: 'Arimo', fontSize: '17px', color: '#0F172A' }}>
                      {top1Points} نقطة
                    </span>
                  </div>

                  {/* المركز الثالث (اليسار): 200px #E6F4EA */}
                  <div
                    className="k"
                    style={{
                      flex: 1,
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#E6F4EA',
                      textAlign: 'center',
                      padding: '18px 10px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Arimo',
                        fontWeight: 700,
                        fontSize: '20px',
                        color: '#0F172A',
                      }}
                    >
                      3
                    </div>
                    <div
                      style={{
                        flex: 'none',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: '#fff',
                        border: '4px solid #fff',
                        boxShadow: '0 0 0 3px #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '28px',
                        color: '#0F172A',
                        overflow: 'hidden',
                      }}
                    >
                      {top3Letter}
                    </div>
                    <b style={{ fontSize: '20px', color: '#0F172A' }}>
                      {top3Name}
                    </b>
                    <span style={{ fontFamily: 'Arimo', fontSize: '17px', color: '#0F172A' }}>
                      {top3Points} نقطة
                    </span>
                  </div>
                </div>

                {/* بطاقة «الأقرب لك» تحت المنصة مباشرة في نفس العمود */}
                <div className="k" style={{ marginTop: '18px', maxWidth: '760px', margin: '18px auto 0' }}>
                  <b style={{ fontSize: '20px', display: 'block', marginBottom: '8px', color: '#0F172A' }}>
                    الأقرب لك
                  </b>

                  {/* أعضاء الترتيب 4, 5, 6 */}
                  {defaultClosest.map((m) => (
                    <div
                      key={m.rank}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '10px 0',
                        borderTop: '1px solid #E8EAED',
                      }}
                    >
                      <b style={{ fontFamily: 'Arimo', width: '28px', fontSize: '18px', color: '#0F172A' }}>
                        {m.rank}
                      </b>
                      <div
                        style={{
                          flex: 'none',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: '#4285F4',
                          border: '4px solid #fff',
                          boxShadow: '0 0 0 3px #4285F4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '20px',
                          color: '#fff',
                        }}
                      >
                        {m.letter}
                      </div>
                      <span style={{ width: '110px', fontSize: '17px', color: '#0F172A' }} className="truncate">
                        {m.name}
                      </span>
                      <div className="bar-proto" style={{ flex: 1, height: '12px' }}>
                        <i style={{ width: `${m.pct}%`, height: '12px', background: '#4285F4' }} />
                      </div>
                      <span style={{ fontFamily: 'Arimo', width: '36px', textAlign: 'left', fontSize: '16px', color: '#0F172A' }}>
                        {m.pts}
                      </span>
                    </div>
                  ))}

                  {/* سطر المستخدم الحالي المميز باللون الأخضر #E6F4EA */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginTop: '6px',
                      padding: '10px 14px',
                      borderRadius: '18px',
                      background: '#E6F4EA',
                    }}
                  >
                    <b style={{ fontFamily: 'Arimo', width: '28px', fontSize: '18px', color: '#0F172A' }}>
                      14
                    </b>
                    <div
                      style={{
                        flex: 'none',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#34A853',
                        border: '4px solid #fff',
                        boxShadow: '0 0 0 3px #34A853',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '20px',
                        color: '#fff',
                      }}
                    >
                      {currentUser.avatarLetter || currentUser.fullName[0] || 'ف'}
                    </div>
                    <b style={{ width: '110px', fontSize: '17px', color: '#0F172A' }}>
                      {isFemale ? 'أنتِ' : 'أنت'}
                    </b>
                    <div className="bar-proto" style={{ flex: 1, height: '12px', background: '#fff' }}>
                      <i
                        style={{
                          width: `${userPct}%`,
                          height: '12px',
                          background: '#34A853',
                        }}
                      />
                    </div>
                    <span style={{ fontFamily: 'Arimo', width: '36px', textAlign: 'left', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                      {userPts}
                    </span>
                  </div>
                </div>
              </div>

              {/* العمود الأيسر (flex: 2): البطاقات الجانبية (كيف يُحسب تفاعلك؟ + تفاعلك هذا الأسبوع) */}
              <div style={{ flex: 2 }} className="w-full flex flex-col gap-[18px]">
                {/* بطاقة 1: كيف يُحسب تفاعلك؟ */}
                <div
                  className="k"
                  style={{
                    borderColor: '#4285F4',
                    borderWidth: '3px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ fontSize: '24px', color: '#0F172A' }}>
                      كيف يُحسب {gText(isFemale, 'تفاعلكِ؟', 'تفاعلكَ؟')}
                    </b>
                    <span className="t-proto" style={{ background: '#E8F0FE', color: '#1A73E8' }}>
                      يُحدَّث أسبوعيًا
                    </span>
                  </div>
                  <p style={{ margin: '6px 0 4px', fontSize: '16px', color: '#3c4452' }}>
                    التفاعل = نقاط {gText(isFemale, 'نشاطكِ المعتمدة', 'نشاطكَ المعتمد')} خلال الفترة. المشاهدة وحدها لا تُحتسب.
                  </p>

                  {/* 1. تطبيق إثرائي */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #E8EAED' }}>
                    <div
                      style={{
                        flex: 'none',
                        width: '42px',
                        height: '42px',
                        borderRadius: '14px',
                        background: '#4285F4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"></path>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <b style={{ fontSize: '17px', color: '#0F172A', display: 'block' }}>تطبيق إثرائي</b>
                      <div style={{ fontSize: '15px', color: '#3c4452' }}>اختيار تطبيقك ضمن التوب: +٣ نقاط ووسام</div>
                    </div>
                  </div>

                  {/* 2. تسليم معتمد */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #E8EAED' }}>
                    <div
                      style={{
                        flex: 'none',
                        width: '42px',
                        height: '42px',
                        borderRadius: '14px',
                        background: '#34A853',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 22V4M4 4h13l-2 4 2 4H4"></path>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <b style={{ fontSize: '17px', color: '#0F172A', display: 'block' }}>تسليم معتمد</b>
                      <div style={{ fontSize: '15px', color: '#3c4452' }}>تأخذ نقاط المهمة نفسها بعد اعتماد القائدة</div>
                    </div>
                  </div>

                  {/* 3. حضور الورش والمشاركة */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #E8EAED' }}>
                    <div
                      style={{
                        flex: 'none',
                        width: '42px',
                        height: '42px',
                        borderRadius: '14px',
                        background: '#F9AB00',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0F172A',
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="9" cy="8" r="3.5"></circle>
                        <path d="M2 21a7 7 0 0 1 14 0M17 4a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-4-6"></path>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <b style={{ fontSize: '17px', color: '#0F172A', display: 'block' }}>حضور الورش والمشاركة</b>
                      <div style={{ fontSize: '15px', color: '#3c4452' }}>نقاطها تحددها القائدة لكل ورشة</div>
                    </div>
                  </div>

                  {/* 4. لا يُحتسب */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #E8EAED' }}>
                    <div
                      style={{
                        flex: 'none',
                        width: '42px',
                        height: '42px',
                        borderRadius: '14px',
                        background: '#EDEFF1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#5F6368',
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="4" y="11" width="16" height="10" rx="2"></rect>
                        <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <b style={{ fontSize: '17px', color: '#0F172A', display: 'block' }}>لا يُحتسب</b>
                      <div style={{ fontSize: '15px', color: '#3c4452' }}>المشاهدات، والتسليم غير المعتمد</div>
                    </div>
                  </div>
                </div>

                {/* بطاقة 2: تفاعلك هذا الأسبوع */}
                <div className="k">
                  <b style={{ fontSize: '20px', color: '#0F172A', display: 'block' }}>
                    {gText(isFemale, 'تفاعلكِ هذا الأسبوع', 'تفاعلكَ هذا الأسبوع')}
                  </b>
                  <div
                    style={{
                      display: 'flex',
                      height: '16px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      margin: '14px 0 10px',
                      background: '#E8EAED',
                    }}
                  >
                    <i style={{ width: '50%', background: '#34A853', display: 'block' }}></i>
                    <i style={{ width: '30%', background: '#4285F4', display: 'block' }}></i>
                    <i style={{ width: '20%', background: '#F9AB00', display: 'block' }}></i>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '15px', color: '#0F172A' }}>
                    <span>● تسليمات ٥</span>
                    <span>● تطبيقات ٣</span>
                    <span>● ورش ٢</span>
                  </div>
                  <p style={{ marginTop: '10px', fontSize: '14px', color: '#5f6673' }}>
                    {isFemale ? 'أرقام تجريبية. تقدرين تخفين اسمك من الإعدادات.' : 'أرقام تجريبية. تقدر تخفي اسمك من الإعدادات.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}
      <WorkshopDetailsModal
        workshop={selectedWorkshop}
        isOpen={isWorkshopModalOpen}
        onClose={() => {
          setIsWorkshopModalOpen(false);
          setSelectedWorkshop(null);
        }}
      />

      {/* نافذة عرض أنشطة اليوم المختار من شريط الأسبوع */}
      <AnimatePresence>
        {selectedDay && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-2 border-gray-900 text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#4285F4]" />
                  <h3 className="text-base font-black text-gray-900">
                    أنشطة {selectedDay.dayFullName} ({selectedDay.dateNumber} أكتوبر)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 border-none bg-transparent cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {selectedDay.activities.length === 0 ? (
                <div className="py-8 text-center text-gray-400 font-bold text-sm">
                  لا توجد أنشطة أو ورش مجدولة في هذا اليوم ✨
                </div>
              ) : (
                <div className="space-y-3 mb-2">
                  {selectedDay.activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-2xl border flex items-center justify-between gap-3"
                      style={{
                        backgroundColor:
                          act.color === '#34A853'
                            ? '#F0FBF3'
                            : act.color === '#F9AB00'
                            ? '#FEF9EC'
                            : '#F0F6FF',
                        borderColor: act.color,
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="badge-pill"
                            style={{ backgroundColor: act.color, color: act.color === '#F9AB00' ? '#0F1729' : '#FFFFFF' }}
                          >
                            {act.type === 'workshop'
                              ? 'ورشة'
                              : act.type === 'task'
                              ? 'تاسك'
                              : 'استبيان'}
                          </span>
                          {act.time && (
                            <span className="text-[11px] font-bold text-gray-500">
                              {act.time}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-gray-900">
                          {act.title}
                        </h4>
                      </div>

                      {act.type === 'workshop' && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDay(null);
                            setSelectedWorkshop(currentWorkshop);
                            setIsWorkshopModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-[#34A853] hover:bg-green-700 transition-colors border-none cursor-pointer"
                        >
                          التفاصيل
                        </button>
                      )}

                      {act.type === 'task' && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDay(null);
                            onNavigateTab('challenges');
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-black text-gray-950 bg-[#F9AB00] hover:bg-amber-400 transition-colors border-none cursor-pointer"
                        >
                          ابدأ
                        </button>
                      )}

                      {act.type === 'poll' && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDay(null);
                            onNavigateTab('community');
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-[#4285F4] hover:bg-blue-600 transition-colors border-none cursor-pointer"
                        >
                          جاوب
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
