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

  const isFemale = currentUser.gender === 'female';

  const getGreeting = () => {
    if (currentUser.role === 'track_leader') {
      const leaderFirst = currentUser.fullName.split(' ')[0];
      return `هلا بالقائدة ${leaderFirst}`;
    }
    const first = currentUser.fullName.split(' ')[0];
    return isFemale ? `هلا بالمطوّرة ${first}` : `هلا بالمطوّر ${first}`;
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

            {/* شريط الأيام السبعة مع تلوين الدائرة بالكامل أو بالنصف أو بالأثلاث */}
            <div className="week-grid" dir="rtl">
              {weekDays.map((d) => {
                const count = d.activities.length;
                let circleStyle: React.CSSProperties = {};
                let isMulti = false;

                if (count === 0) {
                  circleStyle = {
                    backgroundColor: '#FFFFFF',
                    color: d.isToday ? '#0F1729' : '#64748B',
                    border: d.isToday ? '2px solid #0F1729' : '1.5px solid #CBD5E1',
                  };
                } else if (count === 1) {
                  const actColor = d.activities[0].color;
                  circleStyle = {
                    backgroundColor: actColor,
                    color: '#FFFFFF',
                    border: 'none',
                  };
                } else if (count === 2) {
                  isMulti = true;
                  const c1 = d.activities[0].color;
                  const c2 = d.activities[1].color;
                  circleStyle = {
                    background: `conic-gradient(${c1} 0deg 180deg, ${c2} 180deg 360deg)`,
                    color: '#FFFFFF',
                    border: 'none',
                  };
                } else {
                  isMulti = true;
                  const c1 = d.activities[0].color;
                  const c2 = d.activities[1].color;
                  const c3 = d.activities[2].color;
                  circleStyle = {
                    background: `conic-gradient(${c1} 0deg 120deg, ${c2} 120deg 240deg, ${c3} 240deg 360deg)`,
                    color: '#FFFFFF',
                    border: 'none',
                  };
                }

                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    className="flex flex-col items-center gap-1.5 p-1 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer border-none bg-transparent"
                    title={`عرض أنشطة يوم ${d.dayFullName} (${count} نشاط)`}
                  >
                    <span className="text-xs font-bold text-gray-700">
                      {d.dayName}
                    </span>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-transform active:scale-90 relative overflow-hidden"
                      style={circleStyle}
                    >
                      <span
                        className={
                          count > 0
                            ? 'text-white font-black'
                            : d.isToday
                            ? 'text-gray-950 font-black'
                            : 'text-gray-700 font-bold'
                        }
                      >
                        {d.dateNumber}
                      </span>
                    </div>

                    {/* النقاط الملونة تحت الرقم لكل نشاط */}
                    <div className="h-2 flex items-center justify-center gap-1">
                      {d.activities.map((act, actIdx) => (
                        <span
                          key={actIdx}
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ backgroundColor: act.color }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* المؤشران الإبداعيان (مؤشر التفاعل بشكل الوردة + مؤشر التعلم بشكل النجمة) */}
          <motion.div variants={itemVariants}>
            <DualProgressMeters
              engagementPercent={currentUser.points ? Math.min(100, Math.round(((currentUser.points) / 200) * 100)) : 0}
              learningPercent={currentUser.points ? Math.min(100, Math.round(((currentUser.points) / ((currentUser.levelNumber || 1) * 500)) * 100)) : 0}
              points={currentUser.points || 0}
              levelNumber={currentUser.levelNumber || 1}
              levelTitle={currentUser.webLevelTitle?.split(':')[1] || 'التطوير التفاعلي'}
            />
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

      {/* ================= لوحة تفاعل الأعضاء (في المنتصف تماماً، شاشة متناسقة بزهور الهوية وتمرير داخلي لـ 7 أعضاء) ================= */}
      <motion.div
        variants={itemVariants}
        id="leaderboard-section"
        className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs relative overflow-hidden max-w-2xl mx-auto w-full text-right"
        style={{
          borderRadius: '28px',
          boxShadow: '0 4px 0 0 #0F1729',
        }}
      >
        {/* زخرفة زهرة قوقل في الزوايا */}
        <div className="absolute -top-6 -left-6 opacity-15 pointer-events-none">
          <PinwheelFlower size={100} color="#4285F4" />
        </div>
        <div className="absolute -bottom-8 -right-8 opacity-10 pointer-events-none">
          <PinwheelFlower size={120} color="#F9AB00" />
        </div>

        {/* الشريط العلوي بهوية الألوان */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#F9AB00] to-[#34A853]" />

        {/* ترويسة اللوحة */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-950 text-xs font-black mb-2 border border-amber-300 shadow-2xs">
            <Trophy size={14} className="text-[#F9AB00]" />
            <span>تفاعل الكل</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            لوحة تفاعل الأعضاء ⚡
          </h3>

          <p className="text-xs sm:text-sm font-black text-gray-700 mt-1">
            {isFemale ? 'الميدان للجميع.. ورّينا كيف بتتغلّبين وتتصدّرين! 🔥' : 'الميدان للجميع.. ورينا كيف بتتغلّب وتتصدّر! 🔥'}
          </p>

          {/* بطاقة عضو الشهر إن وجد */}
          {rankings.memberOfTheMonth && (
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-300 flex items-center justify-between shadow-2xs max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <UserAvatar
                    letter={rankings.memberOfTheMonth.member.avatarLetter}
                    name={rankings.memberOfTheMonth.member.fullName}
                    avatarUrl={rankings.memberOfTheMonth.member.avatarUrl}
                    color={rankings.memberOfTheMonth.member.badgeColor || '#F9AB00'}
                    size="sm"
                    variant="flower"
                    role={rankings.memberOfTheMonth.member.role}
                  />
                  <span className="absolute -top-1.5 -right-1.5 text-xs">👑</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 inline-block mb-0.5">
                    عضو الشهر ⭐
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-gray-900">
                    {rankings.memberOfTheMonth.member.fullName}
                  </h4>
                </div>
              </div>
              <div className="text-left">
                <span className="text-base sm:text-lg font-black text-amber-600 block">
                  {rankings.memberOfTheMonth.monthPoints}
                </span>
                <span className="text-[10px] font-bold text-gray-500">نقطة تفاعل</span>
              </div>
            </div>
          )}
        </div>

        {/* شريط الإحصائية: يوضح أن اللوحة تحتوي على جميع الأعضاء مع إمكانية التمرير الداخلي لـ 7 أعضاء */}
        <div className="flex items-center justify-between mb-3 px-1 text-xs font-bold text-gray-500 border-b border-gray-100 pb-2">
          <span className="flex items-center gap-1.5 text-gray-800 font-black">
            <span>قائمة الأعضاء المتنافسين</span>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              {allMembers.filter((m) => m.role === 'member').length} عضو
            </span>
          </span>
          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
            <span>مرر داخل القائمة لتصفح الجميع</span>
            <span>↕</span>
          </span>
        </div>

        {/* شاشة الأعضاء: بارتفاع محدد يكفي تماماً لـ 7 أعضاء فقط والتمرير بالداخل (Scroll) */}
        <div
          className="leaderboard-scroll flex flex-col gap-2"
          style={{
            maxHeight: '400px',
          }}
        >
          {allMembers
            .filter((m) => m.role === 'member')
            .sort((a, b) => (b.points || 0) - (a.points || 0))
            .map((m, mIdx) => {
              const rankIcons = ['🥇', '🥈', '🥉'];
              const isTop3 = mIdx < 3;

              return (
                <div
                  key={m.id}
                  className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-between text-right ${
                    isTop3
                      ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                      : 'bg-gray-50/70 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        mIdx === 0
                          ? 'bg-amber-300 text-amber-950 border border-amber-400'
                          : mIdx === 1
                          ? 'bg-slate-200 text-slate-800 border border-slate-300'
                          : mIdx === 2
                          ? 'bg-orange-200 text-orange-950 border border-orange-300'
                          : 'bg-white text-gray-500 border border-gray-200'
                      }`}
                    >
                      {rankIcons[mIdx] || mIdx + 1}
                    </span>

                    <UserAvatar
                      letter={m.avatarLetter}
                      name={m.fullName}
                      avatarUrl={m.avatarUrl}
                      color={m.badgeColor}
                      size="xs"
                      role={m.role}
                    />

                    <div className="min-w-0">
                      <span className="font-black text-xs text-gray-900 block truncate">
                        {m.fullName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      {m.points || 0} نقطة
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* شريط الملاحظة والتمرير الميداني */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 text-[11px] font-bold text-gray-500">
          <span>يتم تحديث الترتيب تلقائياً فور اعتماد النقاط من القادة ✨</span>
          <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <span>مرر بالسحب داخل القائمة ↕️</span>
          </div>
        </div>
      </motion.div>

      {/* نافذة تفاصيل الورشة الرسمية */}
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
