import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, Course } from '../../types';
import { store } from '../../services/store';
import confetti from 'canvas-confetti';
import { Check, ExternalLink, X, ArrowUpRight, Sparkles, Layers } from 'lucide-react';

interface EducationalJourneyProps {
  currentUser: UserProfile;
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

type FilterCategory = 'all' | 'tracks' | 'languages' | 'frameworks' | 'hosting_tools';

export const EducationalJourney: React.FC<EducationalJourneyProps> = ({ currentUser }) => {
  const [courses, setCourses] = useState<Course[]>(() => store.getCourses());
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  
  // الكورس المفتوح حالياً (null يعني كل الصفحة أيقونات كما طلب المستخدم)
  const [openedCourse, setOpenedCourse] = useState<Course | null>(null);
  const [selectedSubCourse, setSelectedSubCourse] = useState<Course | null>(null);

  // حالة رابط المشروع وزر الاعتماد داخل نافذة الكورس المفتوح
  const [projectInput, setProjectInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleOpenCourse = (course: Course) => {
    if (course.subLevels && course.subLevels.length > 0) {
      setSelectedSubCourse(course);
      return;
    }
    setOpenedCourse(course);
    setFeedbackMsg('');
    setProjectInput(course.projectRepoUrl || '');
  };

  const handleCloseCourse = () => {
    setOpenedCourse(null);
    setFeedbackMsg('');
  };

  const handleStageClick = (stageNum: number) => {
    if (stageNum === 1 && currentUser.settings?.celebrations) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.3 },
        colors: ['#34A853', '#4285F4', '#F9AB00', '#EA4335'],
      });
    }
  };

  // اعتماد الرابط عند الضغط على زر الاعتماد أو الإرسال
  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!openedCourse || !projectInput.trim()) return;

    setIsSubmitting(true);
    store.submitCourseProject(openedCourse.id, projectInput.trim());
    setCourses(store.getCourses());

    if (currentUser.settings?.celebrations) {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#34A853', '#F9AB00'],
      });
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setFeedbackMsg('تم اعتماد رابط المشروع بنجاح ✓');
    }, 450);
  };

  // التحقق من متطلب المستوى: المبتدئ أو من لا يملك المهارة يعتبر إجباري
  const checkCourseRequirement = (course: Course): { isMandatory: boolean; label: string } => {
    const userSkills = currentUser.skills || [];
    const hasSkill = userSkills.some(
      (s) =>
        s.toLowerCase() === course.skillReward.toLowerCase() ||
        course.skillReward.toLowerCase().includes(s.toLowerCase())
    );

    if (hasSkill) {
      return { isMandatory: false, label: 'مكتمل ✓' };
    }

    if (course.isRecommendedTrack) {
      return { isMandatory: false, label: 'مرشحة لاكتسابها ⭐' };
    }

    return { isMandatory: true, label: 'إجباري' };
  };

  // تصنيف الكورسات حسب الأقسام
  const tracksCourses = courses.filter((c) => c.category === 'tracks');
  const languagesCourses = courses.filter((c) => c.category === 'languages');
  const frameworksCourses = courses.filter((c) => c.category === 'frameworks');
  const hostingToolsCourses = courses.filter((c) => c.category === 'hosting_tools');

  // مكون بطاقة الأيقونة الموحدة
  const renderIconCard = (c: Course) => {
    const req = checkCourseRequirement(c);
    const isRecommended = c.isRecommendedTrack;

    return (
      <button
        key={c.id}
        onClick={() => handleOpenCourse(c)}
        className="card-3d-tactile p-5 sm:p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-3 text-right w-full"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: isRecommended ? '2.5px solid #4285F4' : '2px solid #0F1729',
          borderBottom: isRecommended ? '6px solid #4285F4' : '5px solid #0F1729',
          boxShadow: isRecommended ? '0 10px 24px rgba(66, 133, 244, 0.18)' : '0 6px 14px rgba(15, 23, 42, 0.08)',
        }}
      >
        {/* رمز الأيقونة الملون المطابق لصفحة 7 بالمرجع */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: c.symbol.length > 2 ? '1rem' : '1.25rem',
            fontWeight: 900,
            color: '#FFFFFF',
            backgroundColor:
              c.color === 'red'
                ? '#EA4335'
                : c.color === 'blue'
                ? '#4285F4'
                : c.color === 'yellow'
                ? '#F9AB00'
                : '#34A853',
          }}
        >
          {c.symbol}
        </div>

        <div className="font-black text-base text-gray-900 mt-1">
          {c.title}
        </div>

        {c.description && (
          <p className="text-xs text-gray-500 line-clamp-2 px-1 leading-relaxed">
            {c.description}
          </p>
        )}

        <div className="mt-2">
          <span
            className={`badge-pill text-xs font-bold ${
              isRecommended
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : req.isMandatory
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {req.label}
          </span>
        </div>
      </button>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container py-8 sm:py-12 text-right"
    >
      {/* 1. العنوان الرئيسي للصفحة مطابق لصفحة 7 */}
      <motion.div variants={itemVariants} className="mb-6 text-right">
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-tight">
          رحلتك التعليمية
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">
          مسارات ودورات معتمدة متكاملة لصقل مهاراتك من الأساسيات حتى احتراف الويب.
        </p>
      </motion.div>

      {/* 2. تايم لاين المراحل الثلاثة المطابق لصفحة 7 بالمرجع */}
      <motion.section variants={itemVariants} className="journey-timeline" dir="rtl">
        <div className="journey-timeline-line" aria-hidden="true" />

        {/* المرحلة 1: التأسيس */}
        <div
          onClick={() => handleStageClick(1)}
          className="timeline-step cursor-pointer"
        >
          <div className="timeline-circle" style={{ backgroundColor: '#34A853' }}>
            <Check size={24} strokeWidth={3} />
          </div>
          <div className="text-center mt-2.5">
            <span className="text-sm font-black text-gray-900 block">
              التأسيس
            </span>
            <span className="text-xs font-bold text-gray-600 block mt-0.5">
              مكتملة
            </span>
          </div>
        </div>

        {/* المرحلة 2: التطوير التفاعلي */}
        <div className="timeline-step">
          <div className="timeline-circle" style={{ backgroundColor: '#4285F4' }}>
            <span className="text-lg font-black">2</span>
          </div>
          <div className="text-center mt-2.5">
            <span className="text-sm font-black text-gray-900 block">
              التطوير التفاعلي
            </span>
            <span className="text-xs font-bold text-blue-600 block mt-0.5">
              أنتِ هنا
            </span>
          </div>
        </div>

        {/* المرحلة 3: البناء والتخصص */}
        <div className="timeline-step">
          <div
            className="timeline-circle"
            style={{
              backgroundColor: '#F1F3F5',
              color: '#475569',
              border: '1.5px solid #CBD5E1',
            }}
          >
            <span className="text-lg font-black">3</span>
          </div>
          <div className="text-center mt-2.5">
            <span className="text-sm font-bold text-gray-800 block">
              البناء والتخصص
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">
              تنفتح بعد المرحلة 2
            </span>
          </div>
        </div>
      </motion.section>

      {/* 3. شريط تصنيف الكورسات والمسارات */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory('all')}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border"
            style={{
              backgroundColor: activeCategory === 'all' ? '#0F1729' : '#FFFFFF',
              color: activeCategory === 'all' ? '#FFFFFF' : '#334155',
              borderColor: activeCategory === 'all' ? '#0F1729' : '#E2E8F0',
            }}
          >
            جميع الأقسام
          </button>
          <button
            onClick={() => setActiveCategory('tracks')}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border"
            style={{
              backgroundColor: activeCategory === 'tracks' ? '#4285F4' : '#FFFFFF',
              color: activeCategory === 'tracks' ? '#FFFFFF' : '#334155',
              borderColor: activeCategory === 'tracks' ? '#4285F4' : '#E2E8F0',
            }}
          >
            المسارات الكاملة
          </button>
          <button
            onClick={() => setActiveCategory('languages')}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border"
            style={{
              backgroundColor: activeCategory === 'languages' ? '#EA4335' : '#FFFFFF',
              color: activeCategory === 'languages' ? '#FFFFFF' : '#334155',
              borderColor: activeCategory === 'languages' ? '#EA4335' : '#E2E8F0',
            }}
          >
            اللغات
          </button>
          <button
            onClick={() => setActiveCategory('frameworks')}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border"
            style={{
              backgroundColor: activeCategory === 'frameworks' ? '#34A853' : '#FFFFFF',
              color: activeCategory === 'frameworks' ? '#FFFFFF' : '#334155',
              borderColor: activeCategory === 'frameworks' ? '#34A853' : '#E2E8F0',
            }}
          >
            الأطر
          </button>
          <button
            onClick={() => setActiveCategory('hosting_tools')}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border"
            style={{
              backgroundColor: activeCategory === 'hosting_tools' ? '#F9AB00' : '#FFFFFF',
              color: activeCategory === 'hosting_tools' ? '#FFFFFF' : '#334155',
              borderColor: activeCategory === 'hosting_tools' ? '#F9AB00' : '#E2E8F0',
            }}
          >
            الاستضافة والأدوات
          </button>
        </div>
      </motion.div>

      {/* 4. عرض الأيقونات لجميع الأقسام (كلها أيقونات متناسقة كما طلب المستخدم) */}

      {/* أ. قسم المسارات الكاملة */}
      {(activeCategory === 'all' || activeCategory === 'tracks') && (
        <motion.section variants={itemVariants} className="mb-10 text-right">
          <div className="mb-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Layers size={22} className="text-[#4285F4]" />
              <span>المسارات الكاملة</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              سلاسل دورات متكاملة تغطي التخصص بالكامل من البداية وحتى الاحتراف
            </p>
          </div>

          <div className="cards-grid-4">
            {tracksCourses.map((track) => renderIconCard(track))}
          </div>
        </motion.section>
      )}

      {/* ب. قسم اللغات */}
      {(activeCategory === 'all' || activeCategory === 'languages') && (
        <motion.section variants={itemVariants} className="mb-10 text-right">
          <div className="mb-4">
            <h2 className="text-2xl font-black text-gray-900">
              اللغات
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              اللغات الأساسية لبناء وبرمجة واجهات الويب التفاعلية
            </p>
          </div>

          <div className="cards-grid-4">
            {languagesCourses.map((c) => renderIconCard(c))}
          </div>
        </motion.section>
      )}

      {/* ج. قسم الأطر والبرمجة الخلفية */}
      {(activeCategory === 'all' || activeCategory === 'frameworks') && (
        <motion.section variants={itemVariants} className="mb-10 text-right">
          <div className="mb-4">
            <h2 className="text-2xl font-black text-gray-900">
              الأطر والبرمجة الخلفية
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              أطر عمل بيئة الخادم وتصميم واجهات APIs وهيكلة البرمجيات
            </p>
          </div>

          <div className="cards-grid-4">
            {frameworksCourses.map((c) => renderIconCard(c))}
          </div>
        </motion.section>
      )}

      {/* د. قسم الاستضافة والأدوات */}
      {(activeCategory === 'all' || activeCategory === 'hosting_tools') && (
        <motion.section variants={itemVariants} className="mb-10 text-right">
          <div className="mb-4">
            <h2 className="text-2xl font-black text-gray-900">
              الاستضافة والأدوات
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              إدارة الإصدارات والمستودعات والبيئات السحابية
            </p>
          </div>

          <div className="cards-grid-4">
            {hostingToolsCourses.map((c) => renderIconCard(c))}
          </div>
        </motion.section>
      )}

      {/* 5. نافذة تفاصيل الكورس المنبثقة عند الضغط على أي أيقونة مع تعتيم كامل للخلفية وبروز 3D */}
      <AnimatePresence>
        {openedCourse && (
          <div
            className="modal-backdrop-dark"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(10, 15, 29, 0.82)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseCourse();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="modal-3d-card w-full max-w-2xl p-6 sm:p-8 text-right max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2.5px solid #0F1729',
                borderRadius: '32px',
                boxShadow: '0 30px 70px -10px rgba(0, 0, 0, 0.5), 0 8px 0 0 #0F1729',
              }}
            >
              {/* رأس نافذة الكورس */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      border: '2px solid #0F1729',
                      boxShadow: '0 4px 0 0 #0F1729',
                      backgroundColor:
                        openedCourse.color === 'red'
                          ? '#EA4335'
                          : openedCourse.color === 'blue'
                          ? '#4285F4'
                          : openedCourse.color === 'yellow'
                          ? '#F9AB00'
                          : '#34A853',
                    }}
                  >
                    {openedCourse.symbol}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">
                      {openedCourse.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {openedCourse.description || openedCourse.levelRequirement}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`badge-pill text-xs font-bold ${
                      openedCourse.isRecommendedTrack
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : checkCourseRequirement(openedCourse).isMandatory
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  >
                    {checkCourseRequirement(openedCourse).label}
                  </span>

                  <button
                    onClick={handleCloseCourse}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all cursor-pointer border border-gray-200"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* صناديق تفاصيل الكورس الثلاثة: سطر، يوتيوب، رابط مشروعك مع بروز 3D */}
              <div className="journey-details-grid mb-6">
                {/* الصندوق 1: منصة سطر */}
                <div
                  className="card-3d-tactile p-5 flex flex-col justify-between text-right"
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-gray-800">منصة سطر</span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                        رسمي
                      </span>
                    </div>
                    <div className="text-sm font-black text-gray-900">
                      {openedCourse.sources[0]?.title || openedCourse.title}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {openedCourse.sources[0]?.outcome || 'اكتساب المهارة العملية وتطبيق المشاريع البرمجية.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <a
                      href={openedCourse.directUrl || openedCourse.sources[0]?.url || 'https://satr.tuwaiq.edu.sa'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-3d btn-3d-blue w-full text-xs font-black inline-flex items-center justify-center gap-1.5"
                    >
                      <span>فتح في منصة سطر</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                {/* الصندوق 2: يوتيوب */}
                <div
                  className="card-3d-tactile p-5 flex flex-col justify-between text-right"
                  style={{ backgroundColor: '#FFFBEB' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-gray-800">يوتيوب (قريباً)</span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                        محتوى إثرائي
                      </span>
                    </div>
                    <div className="text-sm font-black text-gray-900">
                      محتوى إثرائي قادم
                    </div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      سيتم تزويدكم بشروحات اليوتيوب المعتمدة من قادة المسار قريباً.
                    </p>
                  </div>
                  <div className="text-[11px] text-gray-500 font-bold mt-4 pt-3 border-t border-amber-200">
                    قيد الإعداد بواسطة قادة المسار
                  </div>
                </div>

                {/* الصندوق 3: رابط مشروعك مع زر الاعتماد الصريح ثلاثي الأبعاد */}
                <div
                  className="card-3d-tactile p-5 flex flex-col justify-between text-right"
                  style={{
                    backgroundColor: '#FEF9C3',
                    borderColor: '#0F1729',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-gray-900">
                        رابط مشروعك
                      </span>
                      {openedCourse.projectRepoUrl && (
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                          معتمد ✓
                        </span>
                      )}
                    </div>

                    <form onSubmit={handleSubmitProject} className="flex flex-col gap-2">
                      <input
                        type="url"
                        value={projectInput}
                        onChange={(e) => setProjectInput(e.target.value)}
                        placeholder="https://github.com/username/repo"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white text-gray-900 border-2 border-[#0F1729] font-mono text-left focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        dir="ltr"
                        required
                      />
                      {/* زر اعتماد الرابط الصريح ثلاثي الأبعاد */}
                      <button
                        type="submit"
                        disabled={isSubmitting || !projectInput.trim()}
                        className="btn-3d btn-3d-blue w-full text-xs font-black"
                      >
                        {isSubmitting ? (
                          <span>جارِ الاعتماد...</span>
                        ) : (
                          <>
                            <Check size={14} strokeWidth={2.5} />
                            <span>اعتماد الرابط</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="text-[11px] font-bold mt-3 leading-tight" style={{ color: feedbackMsg ? '#166534' : '#475569' }}>
                    {feedbackMsg || `بعد اعتماد المشروع تنضاف مهارة ${openedCourse.skillReward} لملفك.`}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCloseCourse}
                  className="btn-3d btn-3d-gray px-6 py-2 text-xs font-black cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. نافذة مستويات الكورس المنبثقة عند الضغط على أيقونة كورس متعدد المستويات */}
      <AnimatePresence>
        {selectedSubCourse && (
          <div
            className="modal-backdrop-dark"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(10, 15, 29, 0.82)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedSubCourse(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="modal-3d-card w-full max-w-lg p-6 sm:p-8 text-right max-h-[90vh] flex flex-col"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2.5px solid #0F1729',
                borderRadius: '32px',
                boxShadow: '0 30px 70px -10px rgba(0, 0, 0, 0.5), 0 8px 0 0 #0F1729',
              }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: selectedSubCourse.symbol.length > 2 ? '1rem' : '1.25rem',
                      fontWeight: 900,
                      color: selectedSubCourse.color === '#F9AB00' ? '#0F1729' : '#FFFFFF',
                      border: '2px solid #0F1729',
                      boxShadow: '0 4px 0 0 #0F1729',
                      backgroundColor: selectedSubCourse.color,
                    }}
                  >
                    {selectedSubCourse.symbol}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">
                      مستويات {selectedSubCourse.title} المعتمدة
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {selectedSubCourse.subLevels?.length || 0} مستويات تدريجية عبر منصة سطر
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSubCourse(null)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all cursor-pointer border border-gray-200"
                >
                  <X size={18} />
                </button>
              </div>

              {/* بطاقات المستويات وكل واحد ورابطه */}
              <div className="flex flex-col gap-3.5 mb-6 overflow-y-auto pr-1">
                {selectedSubCourse.subLevels?.map((level) => (
                  <div
                    key={level.id}
                    className="card-3d-tactile p-4.5 bg-white flex items-center justify-between gap-3 text-right"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                          {level.level}
                        </span>
                        <h4 className="text-sm font-black text-gray-900">
                          {level.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        {level.outcome}
                      </p>
                    </div>

                    <a
                      href={level.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-3d btn-3d-blue px-3.5 py-1.5 text-xs font-black flex-shrink-0"
                    >
                      <span>بدء الكورس</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={() => {
                    const c = selectedSubCourse;
                    setSelectedSubCourse(null);
                    setOpenedCourse(c);
                    setProjectInput(c.projectRepoUrl || '');
                  }}
                  className="btn-3d btn-3d-yellow text-xs font-black cursor-pointer"
                >
                  تسليم مشروع {selectedSubCourse.title} ⭐
                </button>

                <button
                  onClick={() => setSelectedSubCourse(null)}
                  className="btn-3d btn-3d-gray px-5 py-2 text-xs font-black cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
