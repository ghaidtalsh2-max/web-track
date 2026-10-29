import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, NavTab, ActionItem, WeeklyDay, Workshop, DayActivity } from '../../types';
import { store, NEXT_MISSION } from '../../services/store';
import { WorkshopDetailsModal } from './WorkshopDetailsModal';
import { DualProgressMeters } from './DualProgressMeters';
import { Calendar, Layers, ExternalLink, X, ChevronLeft, Trophy, Crown, Sparkles, TrendingUp, Info, ShieldCheck, Clock } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

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

  const getGreeting = () => {
    if (currentUser.role === 'track_leader') {
      const leaderFirst = currentUser.fullName.split(' ')[0];
      return `هلا بالقائدة ${leaderFirst}`;
    }
    const isFemale = currentUser.gender === 'female';
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
        {/* العمود الأيمن (الرئيسي): الخطوة التالية + ينتظرك */}
        <div className="flex flex-col gap-6">
          {/* بطاقة الخطوة التالية الصفراء */}
          <motion.div variants={itemVariants} className="next-mission-card">
            <div className="flex-1 text-right">
              <div className="text-xs sm:text-sm font-black text-gray-950 mb-1">
                الخطوة التالية · {NEXT_MISSION.dueText}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950">
                {NEXT_MISSION.title}
              </h2>
            </div>

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

          {/* بطاقات "ينتظرك" الثلاث (كاملة بالألوان الخاصة بها) */}
          <div className="flex flex-col gap-4">
            {/* 1. خانة الورشة التطبيقية (كاملة باللون الأخضر) */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="p-5 sm:p-6 rounded-3xl"
              style={{
                backgroundColor: '#E6F4EA', // خلفية خضراء كاملة
                borderRadius: '26px',
                border: '2.5px solid #34A853',
                boxShadow: '0 4px 14px rgba(52, 168, 83, 0.12)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-right flex-1">
                  <div className="w-13 h-13 rounded-2xl bg-white border-2 border-[#34A853] flex items-center justify-center shrink-0 shadow-xs">
                    <Layers size={26} className="text-[#34A853]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#34A853] text-white">
                        ورشة تطبيقية
                      </span>
                      {currentWorkshop && (
                        <span className="text-xs font-bold text-emerald-900">
                          {currentWorkshop.scheduledAt}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-gray-950 leading-tight">
                      {currentWorkshop ? currentWorkshop.title : 'ورشة العمل القادمة 💻'}
                    </h4>
                    {!currentWorkshop && (
                      <p className="text-xs text-emerald-800 font-medium mt-1">
                        في انتظار إعلان وتحديد موعد الورشة القادمة من القائدة ⏳
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {currentWorkshop ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedWorkshop(currentWorkshop);
                          setIsWorkshopModalOpen(true);
                        }}
                        className="btn-pill px-4 py-2 text-xs font-black cursor-pointer bg-white text-gray-950 border-2 border-[#0F1729]"
                      >
                        شوف التفاصيل
                      </button>
                      {currentWorkshop.registrationUrl && (
                        <a
                          href={currentWorkshop.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill btn-pill-green px-4 py-2 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer no-underline"
                        >
                          <span>رابط الحضور</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 bg-white/70 px-3 py-1.5 rounded-xl border border-emerald-300">
                      بانتظار الإعلان
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* 2. خانة الاستبيان والتصويت (كاملة باللون الأزرق) */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="p-5 sm:p-6 rounded-3xl"
              style={{
                backgroundColor: '#E8F0FE', // خلفية زرقاء كاملة
                borderRadius: '26px',
                border: '2.5px solid #4285F4',
                boxShadow: '0 4px 14px rgba(66, 133, 244, 0.12)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-right flex-1">
                  <div className="w-13 h-13 rounded-2xl bg-white border-2 border-[#4285F4] flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles size={26} className="text-[#4285F4]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#4285F4] text-white">
                        استبيان الأسبوع
                      </span>
                      {poll && (
                        <span className="text-xs font-bold text-blue-900">
                          ينتهي قريباً · اكسب نقاط
                        </span>
                      )}
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-gray-950 leading-tight">
                      {poll ? poll.title : 'استبيان الأسبوع والتصويت 📊'}
                    </h4>
                    {!poll && (
                      <p className="text-xs text-blue-800 font-medium mt-1">
                        في انتظار طرح الاستبيان والمشاركة القادمة من القائدة ⏳
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {poll ? (
                    <button
                      type="button"
                      onClick={() => onNavigateTab('community')}
                      className="btn-pill px-4 py-2 text-xs font-black cursor-pointer bg-[#4285F4] text-white border-none shadow-xs"
                    >
                      شارك وصوّت
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-blue-800 bg-white/70 px-3 py-1.5 rounded-xl border border-blue-300">
                      بانتظار الطرح
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* 3. خانة التحدي والتاسك البرمجي (كاملة باللون الكهرماني/الأصفر) */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="p-5 sm:p-6 rounded-3xl"
              style={{
                backgroundColor: '#FEF7E0', // خلفية صفراء كاملة
                borderRadius: '26px',
                border: '2.5px solid #F9AB00',
                boxShadow: '0 4px 14px rgba(249, 171, 0, 0.15)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-right flex-1">
                  <div className="w-13 h-13 rounded-2xl bg-white border-2 border-[#F9AB00] flex items-center justify-center shrink-0 shadow-xs">
                    <Trophy size={26} className="text-[#F9AB00]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#F9AB00] text-gray-950">
                        التحدي البرمجي
                      </span>
                      {tasks && tasks.length > 0 && (
                        <span className="text-xs font-bold text-amber-950">
                          +{tasks[0].pointsReward || 50} نقطة
                        </span>
                      )}
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-gray-950 leading-tight">
                      {tasks && tasks.length > 0 ? tasks[0].title : 'التحدي والتاسك البرمجي ⚡'}
                    </h4>
                    {(!tasks || tasks.length === 0) && (
                      <p className="text-xs text-amber-900 font-medium mt-1">
                        في انتظار إطلاق التحدي الأسبوعي الجديد من القائدة ⏳
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('challenges')}
                    className="btn-pill px-4 py-2 text-xs font-black cursor-pointer bg-gray-950 text-white border-none shadow-xs"
                  >
                    {tasks && tasks.length > 0 ? 'حل التحدي الآن' : 'عرض التحديات'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ================= لوحة تفاعل الأعضاء ================= */}
          <motion.div
            variants={itemVariants}
            id="leaderboard-section"
            className="mt-6 p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs relative overflow-hidden"
            style={{
              borderRadius: '28px',
            }}
          >
            {/* شريط علوي ملون بهوية قوقل */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#F9AB00]" />

            {/* ترويسة لوحة تفاعل الأعضاء الواضحة والمحفزة */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md">
                  <Trophy size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                      لوحة تفاعل الأعضاء ⚡
                    </h3>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      تفاعل الكل
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-gray-600 mt-1">
                    الميدان للجميع.. ورينا كيف بتتغلّب وتتصدّر! 🔥
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3.5 py-1.5 rounded-full border border-gray-200">
                  تنافس حي مباشر 🎯
                </span>
              </div>
            </div>

            {/* 1. تكريم عضو الشهر المتميز (Member of the Month) */}
            {rankings.memberOfTheMonth && (
              <div
                className="mb-6 p-4 sm:p-5 rounded-2xl border-2 border-amber-300 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #FFFDF5 0%, #FEF8E7 100%)',
                }}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <UserAvatar
                        letter={rankings.memberOfTheMonth.member.avatarLetter}
                        name={rankings.memberOfTheMonth.member.fullName}
                        avatarUrl={rankings.memberOfTheMonth.member.avatarUrl}
                        color={rankings.memberOfTheMonth.member.badgeColor || '#F9AB00'}
                        size="lg"
                        variant="flower"
                        role={rankings.memberOfTheMonth.member.role}
                      />
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#F9AB00] text-gray-950 flex items-center justify-center text-xs font-black shadow-md border-2 border-white">
                        👑
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                          عضو الشهر ⭐ الأعلى تفاعلاً
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-gray-900 mt-1">
                        {rankings.memberOfTheMonth.member.fullName}
                      </h4>
                      <div className="text-xs text-gray-600 font-medium mt-0.5">
                        {rankings.memberOfTheMonth.member.webLevelTitle} · {rankings.memberOfTheMonth.member.major || 'علوم حاسب'}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-left flex-shrink-0">
                    <div className="text-2xl sm:text-3xl font-black text-amber-600">
                      {rankings.memberOfTheMonth.monthPoints}
                    </div>
                    <div className="text-[11px] font-bold text-gray-500">
                      نقطة تفاعل
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. قائمة أعضاء الأسبوع الخمسة الأوائل (Top 5 of the Week) */}
            <div className="space-y-2.5 mb-5">
              <div className="text-xs font-bold text-gray-700 mb-2 flex items-center justify-between">
                <span>أعضاء الأسبوع الـ 5 الأوائل في التفاعل:</span>
                <span className="text-[11px] text-gray-500 font-bold">تحديث أسبوعي 🏆</span>
              </div>

              {rankings.topWeekly.map((item, idx) => {
                const rankIcons = ['🥇', '🥈', '🥉', '4', '5'];
                const rankColors = [
                  'bg-amber-100 text-amber-900 border-amber-300',
                  'bg-slate-100 text-slate-800 border-slate-300',
                  'bg-orange-100 text-orange-900 border-orange-300',
                  'bg-gray-100 text-gray-700 border-gray-200',
                  'bg-gray-100 text-gray-700 border-gray-200',
                ];

                return (
                  <div
                    key={item.member.id}
                    className="p-3 sm:p-3.5 rounded-2xl bg-gray-50/90 hover:bg-gray-100/90 border border-gray-200 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* وسام الرتبة */}
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black border flex-shrink-0 ${
                          rankColors[idx] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {rankIcons[idx] || idx + 1}
                      </div>

                      <UserAvatar
                        letter={item.member.avatarLetter}
                        name={item.member.fullName}
                        avatarUrl={item.member.avatarUrl}
                        color={item.member.badgeColor}
                        size="xs"
                        role={item.member.role}
                      />

                      <div className="min-w-0">
                        <div className="font-black text-xs sm:text-sm text-gray-900 truncate">
                          {item.member.fullName}
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                          المستوى {item.member.levelNumber} · @{item.member.username}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-left">
                        <span className="text-xs sm:text-sm font-black text-emerald-600 block">
                          +{item.weekPoints}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold block">
                          نقطة أسبوعية
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* زر عرض تفاعل بقية الأعضاء (تفاعل الكل) */}
            <div className="pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAllLeaderboard(!showAllLeaderboard)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:text-gray-950 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{showAllLeaderboard ? 'إخفاء بقية الأعضاء' : `عرض تفاعل بقية الأعضاء (${allMembers.length} عضو) 👥`}</span>
              </button>

              {/* القائمة الكاملة لتفاعل جميع الأعضاء عند الفتح */}
              {showAllLeaderboard && (
                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {[...allMembers]
                    .sort((a, b) => (b.points || 0) - (a.points || 0))
                    .map((m, mIdx) => (
                      <div
                        key={m.id}
                        className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 text-center font-bold text-gray-400 text-[11px]">
                            {mIdx + 1}
                          </span>
                          <UserAvatar
                            letter={m.avatarLetter}
                            name={m.fullName}
                            avatarUrl={m.avatarUrl}
                            color={m.badgeColor}
                            size="xs"
                            role={m.role}
                          />
                          <span className="font-bold text-gray-900 truncate">
                            {m.fullName}
                          </span>
                        </div>
                        <span className="font-black text-emerald-600 shrink-0">
                          {m.points || 0} نقطة
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
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
                    backgroundColor: '#F8FAFC',
                    color: '#64748B',
                    border: '2px solid #CBD5E1',
                  };
                } else if (count === 1) {
                  const actColor = d.activities[0].color;
                  circleStyle = {
                    backgroundColor: actColor, // كامل لون دائرة اليوم بالنشاط
                    color: '#FFFFFF',
                    border: '2px solid #0F1729',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
                  };
                } else if (count === 2) {
                  isMulti = true;
                  const c1 = d.activities[0].color;
                  const c2 = d.activities[1].color;
                  circleStyle = {
                    background: `conic-gradient(${c1} 0deg 180deg, ${c2} 180deg 360deg)`,
                    border: '2px solid #0F1729',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
                  };
                } else {
                  isMulti = true;
                  const c1 = d.activities[0].color;
                  const c2 = d.activities[1].color;
                  const c3 = d.activities[2].color;
                  circleStyle = {
                    background: `conic-gradient(${c1} 0deg 120deg, ${c2} 120deg 240deg, ${c3} 240deg 360deg)`,
                    border: '2px solid #0F1729',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
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
                      style={{
                        ...circleStyle,
                        outline: d.isToday ? '3px solid #0F1729' : 'none',
                        outlineOffset: '2px',
                      }}
                    >
                      {isMulti ? (
                        <div className="w-6 h-6 rounded-full bg-white text-gray-950 flex items-center justify-center font-black text-[11px] shadow-sm">
                          {d.dateNumber}
                        </div>
                      ) : (
                        <span className={count > 0 ? 'text-white font-black drop-shadow-sm' : 'font-bold'}>
                          {d.dateNumber}
                        </span>
                      )}
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
              engagementPercent={Math.min(100, Math.round(((currentUser.points || 0) / 200) * 100)) || 10}
              learningPercent={Math.min(100, Math.round(((currentUser.points || 0) / ((currentUser.levelNumber || 1) * 500)) * 100)) || 15}
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
