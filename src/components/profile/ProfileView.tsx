import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { UserProfile, MemberSkillItem, BadgeItem, UserStats } from '../../types';
import { store } from '../../services/store';
import { UserAvatar } from '../common/UserAvatar';
import { isFemaleUser, gText, genderVocab } from '../../utils/gender';
import {
  Award,
  Shield,
  Search,
  Sparkles,
  CheckCircle2,
  Phone,
  GraduationCap,
  Calendar,
  Lock,
  Edit3,
  ExternalLink,
  FolderGit2,
  Plus,
  Trash2,
  BookOpen,
  Code2,
  Users,
  Trophy,
  ArrowRight,
  Info,
  Check,
  X,
  FileCode2,
  Palette,
  HeartHandshake,
  Terminal,
  Crown,
  Zap,
  Flame,
  Target,
  Rocket,
  Star,
  Code,
  Wrench,
  Diamond,
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: UserProfile;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser }) => {
  const [allMembers, setAllMembers] = useState<UserProfile[]>(() => store.getMembers());
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentUser.id);
  const [activeTab, setActiveTab] = useState<'profile' | 'directory'>('profile');

  // مزامنة البيانات عند أي تحديث في المتجر
  useEffect(() => {
    const sync = () => setAllMembers(store.getMembers());
    sync();
    return store.subscribe(sync);
  }, []);

  const displayedMember = allMembers.find((m) => m.id === selectedMemberId) || currentUser;
  const isViewingSelf = displayedMember.id === currentUser.id;
  const isStaff = currentUser.role === 'track_leader' || currentUser.role === 'co_leader' || currentUser.role === 'supervisor';
  const isFemale = isFemaleUser(displayedMember);

  // البحث والفلترة في دليل الأعضاء
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const excludedStaffNames = ['رنا', 'أثير', 'اثير', 'عامر', 'وجد', 'ثامر', 'ريتال', 'غيداء'];

  const filteredMembers = allMembers.filter((m) => {
    // استبعاد الإشراف والقادة بناءً على الدور والرتبة والاسم الصريح
    if (m.role === 'supervisor' || m.role === 'track_leader') return false;
    if (excludedStaffNames.some((n) => m.fullName.includes(n))) return false;

    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || m.webLevel === levelFilter;
    return matchesSearch && matchesLevel;
  });

  // حالة نافذة تعديل الملف الشخصي
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBio, setEditBio] = useState(displayedMember.bio || '');
  const [editPhone, setEditPhone] = useState(displayedMember.phone || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(displayedMember.avatarUrl || '');
  const [editMajor, setEditMajor] = useState(displayedMember.major || '');
  const [editAcademicYear, setEditAcademicYear] = useState(displayedMember.academicYear || '');
  const [editSaveMessage, setEditSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // حالة إضافة مهارة شخصية جديدة
  const [newSkillName, setNewSkillName] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // حالة نافذة تسليم إثبات المهارة (استبيان / رابط تطبيق / كويز / رابط قيت)
  const [selectedSkillForProof, setSelectedSkillForProof] = useState<MemberSkillItem | null>(null);
  const [proofType, setProofType] = useState<'app_link' | 'quiz' | 'git_url'>('app_link');
  const [proofValue, setProofValue] = useState('');
  const [proofFeedback, setProofFeedback] = useState<string | null>(null);
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  // أسئلة كويز المهارات الأربعة متوسطة المستوى مع تمهيد ومؤقت 60 ثانية لكل سؤال
  const [quizStep, setQuizStep] = useState<'intro' | 'question' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // إعادة ضبط حالة الكويز عند فتحه
  useEffect(() => {
    setQuizStep('intro');
    setCurrentQuestionIndex(0);
    setTimeLeft(60);
    setQuizAnswers({});
    setQuizFeedback(null);
  }, [selectedSkillForProof, proofType]);

  const SKILL_QUIZ_QUESTIONS = [
    {
      id: 1,
      question: 'في CSS Flexbox، ما الخاصية المسؤولة عن محاذاة العناصر على المحور الثانوي (Cross Axis)؟',
      options: ['align-items', 'justify-content', 'flex-direction', 'align-self-all'],
      correctIndex: 0,
    },
    {
      id: 2,
      question: 'ما هو الفرق الجوهري بين localStorage و sessionStorage في متصفح الويب؟',
      options: [
        'بيانات localStorage تدوم بعد إغلاق المتصفح، بينما sessionStorage تُمسح بإغلاق التبويب',
        'sessionStorage يخزن بيانات مشفرة تلقائياً فقط',
        'localStorage محدود بحجم 5 كيلوبايت فقط',
        'لا يوجد أي فرق بينهما في آلية الصلاحية',
      ],
      correctIndex: 0,
    },
    {
      id: 3,
      question: 'في CSS Grid، كيف ننشئ شبكة متجاوبة تملأ السطر بأعمدة لا يقل عرضها عن 240px وتتوزع تلقائياً؟',
      options: [
        'grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))',
        'grid-columns: flex-auto(240px, 100%)',
        'grid-template-rows: repeat(auto-fill, 240px)',
        'display: flex-grid(minmax(240px))',
      ],
      correctIndex: 0,
    },
    {
      id: 4,
      question: 'عند كتابة JavaScript لمعالجة حدث إرسال النموذج onsubmit، ما فائدة استدعاء event.preventDefault()؟',
      options: [
        'منع إعادة تحميل الصفحة الافتراضية للتعامل مع البيانات بسلاسة عبر JS',
        'حذف جميع البيانات المدخلة في حقول النموذج',
        'إغلاق نافذة المتصفح فوراً',
        'إرسال البيانات مباشرة إلى السيرفر دون تشفير',
      ],
      correctIndex: 0,
    },
  ];

  // جلب إحصائيات وشارات وتسليمات العضو المختار
  const userStats: UserStats = store.getUserStats(displayedMember.id);
  const userBadges: BadgeItem[] = store.getUserBadges(displayedMember.id);
  const userSubmissions = store
    .getSubmissions()
    .filter((s: any) => s.profile_id === displayedMember.id || s.profileId === displayedMember.id);

  // حساب التقدم نحو المستوى التالي (500 نقطة لكل مستوى)
  const currentLevelNumber = displayedMember.levelNumber || 1;
  const targetPointsForNext = currentLevelNumber * 500;
  const levelProgressPercent = Math.min(
    100,
    Math.round((displayedMember.points / targetPointsForNext) * 100)
  );

  // خريطة أيقونات الشارات
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap size={18} className="text-[#4285F4]" />;
      case 'Flame':
        return <Flame size={18} className="text-[#EA4335]" />;
      case 'Diamond':
        return <Diamond size={18} className="text-[#34A853]" />;
      case 'Target':
        return <Target size={18} className="text-[#4285F4]" />;
      case 'Rocket':
        return <Rocket size={18} className="text-[#34A853]" />;
      case 'Star':
        return <Star size={18} className="text-[#F9AB00]" />;
      case 'Code':
        return <Code size={18} className="text-[#4285F4]" />;
      case 'Wrench':
        return <Wrench size={18} className="text-[#EA4335]" />;
      case 'Trophy':
        return <Trophy size={18} className="text-[#34A853]" />;
      case 'Sparkles':
        return <Sparkles size={18} className="text-[#F9AB00]" />;
      case 'FileCode2':
        return <FileCode2 size={18} className="text-[#4285F4]" />;
      case 'CheckCircle2':
        return <CheckCircle2 size={18} className="text-[#34A853]" />;
      case 'Palette':
        return <Palette size={18} className="text-[#EA4335]" />;
      case 'HeartHandshake':
        return <HeartHandshake size={18} className="text-[#4285F4]" />;
      case 'Terminal':
        return <Terminal size={18} className="text-[#34A853]" />;
      case 'Crown':
        return <Crown size={18} className="text-[#F9AB00]" />;
      default:
        return <Award size={18} className="text-[#F9AB00]" />;
    }
  };

  // معالجة حفظ تعديلات الملف الشخصي
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setEditSaveMessage(null);

    try {
      await store.updateUserProfile(displayedMember.id, {
        bio: editBio,
        phone: editPhone,
        avatarUrl: editAvatarUrl,
        major: editMajor,
        academicYear: editAcademicYear,
      });
      setEditSaveMessage('تم حفظ التعديلات بنجاح في قاعدة البيانات ✨');
      setTimeout(() => {
        setShowEditModal(false);
        setEditSaveMessage(null);
      }, 1200);
    } catch (err: any) {
      setEditSaveMessage(err?.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  // معالجة إضافة مهارة شخصية
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setIsAddingSkill(true);
    try {
      await store.addSelfSkill(displayedMember.id, newSkillName.trim());
      setNewSkillName('');
    } finally {
      setIsAddingSkill(false);
    }
  };

  // معالجة حذف مهارة شخصية
  const handleRemoveSkill = async (skillName: string) => {
    await store.removeSelfSkill(displayedMember.id, skillName);
  };

  // فتح نافذة تقديم إثبات للمهارة
  const handleOpenProofModal = (skill: MemberSkillItem) => {
    setSelectedSkillForProof(skill);
    setProofValue(skill.gitUrl || '');
    setProofFeedback(null);
    if (skill.source === 'survey_registration') {
      setProofType('app_link');
    } else {
      setProofType('git_url');
    }
  };

  // معالجة إرسال إثبات المهارة (رابط تطبيق / طلب كويز / رابط قيت)
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillForProof) return;
    setIsSubmittingProof(true);
    setProofFeedback(null);
    try {
      await store.submitSkillProof(
        displayedMember.id,
        selectedSkillForProof.name,
        proofType,
        proofValue
      );
      setProofFeedback('تم تسليم إثبات المهارة للقائدة للمراجعة واعتماد النقاط! ✨');
      setTimeout(() => {
        setSelectedSkillForProof(null);
        setProofFeedback(null);
      }, 1500);
    } catch (err: any) {
      setProofFeedback('حدث خطأ أثناء التسليم، يرجى المحاولة ثانية');
    } finally {
      setIsSubmittingProof(false);
    }
  };

  // مؤقت 60 ثانية لكل سؤال في الكويز
  useEffect(() => {
    if (proofType !== 'quiz' || quizStep !== 'question') return;
    if (timeLeft <= 0) {
      handleNextQuizQuestion();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [proofType, quizStep, timeLeft, currentQuestionIndex]);

  const handleStartQuiz = () => {
    setQuizStep('question');
    setCurrentQuestionIndex(0);
    setTimeLeft(60);
    setQuizAnswers({});
    setQuizFeedback(null);
  };

  const handleNextQuizQuestion = async () => {
    if (currentQuestionIndex < SKILL_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(60);
    } else {
      // نهاية الكويز وحساب النتيجة
      let score = 0;
      SKILL_QUIZ_QUESTIONS.forEach((q) => {
        if (quizAnswers[q.id] === q.correctIndex) {
          score++;
        }
      });
      setQuizScore(score);
      setQuizStep('result');

      if (score >= 3) {
        if (selectedSkillForProof) {
          await store.approveSkillViaQuiz(displayedMember.id, selectedSkillForProof.name, score);
        }
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#34A853', '#4285F4', '#F9AB00', '#EA4335'],
        });
      }
    }
  };

  // مهارات العضو المفصلة من قاعدة البيانات والاستبيان
  const skillsList: MemberSkillItem[] =
    displayedMember.detailedSkills && displayedMember.detailedSkills.length > 0
      ? displayedMember.detailedSkills
      : (displayedMember.skills || []).map((s) => ({
          name: s,
          progressPercent: 100,
          status: 'approved',
          source: 'approved_by_leader',
        }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container py-8 sm:py-12 text-right"
      dir="rtl"
    >
      {/* 1. التبديل بين البروفايل ودليل الأعضاء */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-100 border border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-none ${
              activeTab === 'profile'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {isViewingSelf ? 'ملفي الشخصي' : `ملف: ${displayedMember.fullName}`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-none flex items-center gap-1.5 ${
              activeTab === 'directory'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users size={15} />
            <span>استكشاف أعضاء المسار</span>
          </button>
        </div>

        {!isViewingSelf && (
          <button
            type="button"
            onClick={() => setSelectedMemberId(currentUser.id)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200 flex items-center gap-1.5"
          >
            <ArrowRight size={14} className="rotate-180" />
            <span>العودة لملفي الشخصي</span>
          </button>
        )}
      </div>

      {activeTab === 'directory' ? (
        /* ================= دليل استكشاف الأعضاء ================= */
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                أعضاء ومطورو مسار الويب 🚀
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                اضغط على أي عضو للاطلاع على مهاراته وإنجازاته ومشاريعه المعتمدة
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث بالاسم أو التخصص أو المعرّف..."
                  className="w-full pl-3 pr-9 py-2 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                />
                <Search size={14} className="absolute right-3 top-2.5 text-gray-400" />
              </div>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none"
              >
                <option value="all">كل المستويات</option>
                <option value="beginner">مبتدئ</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">متقدم</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMemberId(m.id);
                  setActiveTab('profile');
                }}
                className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer hover:shadow-md hover:border-blue-400 flex items-center justify-between gap-4 ${
                  m.id === selectedMemberId
                    ? 'border-blue-600 ring-2 ring-blue-100'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <UserAvatar
                    letter={m.avatarLetter}
                    name={m.fullName}
                    avatarUrl={m.avatarUrl}
                    color={m.badgeColor}
                    size="md"
                    role={m.role}
                    showBadge
                  />
                  <div className="min-w-0">
                    <div className="font-black text-sm text-gray-900 truncate">
                      {m.fullName}
                    </div>
                    <div className="text-xs text-blue-600 font-bold mt-0.5 truncate">
                      @{m.username || 'عضو'}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate mt-0.5">
                      {m.major || 'علوم حاسب'}
                    </div>
                  </div>
                </div>

                <div className="text-left flex-shrink-0">
                  <div className="text-sm font-black text-[#34A853]">
                    {m.points}
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold">
                    نقطة
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ================= صفحة الملف الشخصي الشاملة (ProfileV2) ================= */
        <div className="flex flex-col gap-6">
          {/* 1. كارت الهوية الأساسية مع شريط موجات الهوية وتداخل الصورة */}
          <div
            className="k u"
            style={{
              animationDelay: '.2s',
              marginTop: '12px',
              padding: 0,
              overflow: 'hidden',
              border: '2px solid #0F172A',
              borderRadius: '28px',
              background: '#fff',
              position: 'relative',
            }}
          >
            {/* 1. النصف العلوي: شريط أمواج متحرك بانسيابية كخلفية جمالية علوية */}
            <div
              style={{
                position: 'relative',
                height: '140px',
                minHeight: '140px',
                width: '100%',
                backgroundColor: '#E6F4EA',
                overflow: 'hidden',
                zIndex: 0,
              }}
            >
              {/* طبقة الأمواج الأساسية المتموجة */}
              <svg
                viewBox="0 0 1280 140"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="animated-waves-layer1"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '200%',
                  height: '100%',
                  display: 'block',
                  opacity: 0.95,
                  pointerEvents: 'none',
                }}
              >
                {/* 1. الموجة الصفراء */}
                <path
                  fill="#F9AB00"
                  d="M0 40 C100 10 200 65 320 40 S520 10 640 40 S840 65 960 40 S1160 10 1280 40 V140 H0 Z"
                />
                {/* 2. الموجة الحمراء */}
                <path
                  fill="#EA4335"
                  d="M0 55 C100 25 200 80 320 55 S520 25 640 55 S840 80 960 55 S1160 25 1280 55 V140 H0 Z"
                />
                {/* 3. الموجة الزرقاء */}
                <path
                  fill="#4285F4"
                  d="M0 70 C100 40 200 95 320 70 S520 40 640 70 S840 95 960 70 S1160 40 1280 70 V140 H0 Z"
                />
                {/* 4. الموجة الخضراء */}
                <path
                  fill="#34A853"
                  d="M0 85 C100 55 200 110 320 85 S520 55 640 85 S840 110 960 85 S1160 55 1280 85 V140 H0 Z"
                />
              </svg>

              {/* طبقة تموج ثانوية متداخلة لإعطاء عمق بصري مائي */}
              <svg
                viewBox="0 0 1280 140"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="animated-waves-layer2"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '200%',
                  height: '100%',
                  display: 'block',
                  opacity: 0.25,
                  mixBlendMode: 'overlay',
                  pointerEvents: 'none',
                }}
              >
                <path
                  fill="#FFFFFF"
                  d="M0 60 C120 25 240 85 360 60 S540 25 640 60 S840 85 960 60 S1140 25 1280 60 V140 H0 Z"
                />
              </svg>
            </div>

            {/* 2. النصف السفلي: الأيقونة والبيانات في طبقة فوقية واضحة تماماً ولا تغطيها الأمواج أبداً */}
            <div style={{ padding: '0 36px 32px', position: 'relative', zIndex: 10 }}>
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start',
                  marginTop: '-60px',
                  flexWrap: 'wrap',
                }}
              >
                {/* الأيقونة الدائرية على اليمين - نصفها العلوي يمتد فوق الأمواج كخلفية لها */}
                <div
                  style={{
                    flex: 'none',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: displayedMember.badgeColor || '#34A853',
                    border: '4px solid #FFFFFF',
                    boxShadow: '0 0 0 3px #0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '60px',
                    color: '#0F172A',
                    position: 'relative',
                    zIndex: 20,
                  }}
                >
                  {displayedMember.avatarLetter || (displayedMember.fullName ? displayedMember.fullName[0] : 'ع')}
                </div>

                {/* الاسم والمعرف وبيانات المسار بجانب الأيقونة - تبدأ في المساحة البيضاء بوضوح تام */}
                <div style={{ flex: 1, minWidth: '260px', paddingTop: '68px', position: 'relative', zIndex: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <h1
                      style={{
                        fontSize: '44px',
                        lineHeight: 1.15,
                        fontWeight: 800,
                        color: '#0F172A',
                        margin: 0,
                      }}
                    >
                      {displayedMember.fullName}
                    </h1>

                    {isViewingSelf && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditBio(displayedMember.bio || '');
                          setEditPhone(displayedMember.phone || '');
                          setEditAvatarUrl(displayedMember.avatarUrl || '');
                          setEditMajor(displayedMember.major || '');
                          setEditAcademicYear(displayedMember.academicYear || '');
                          setShowEditModal(true);
                        }}
                        className="b cursor-pointer hover:bg-gray-100 transition-colors"
                        style={{
                          backgroundColor: '#F1F3F4',
                          border: '2px solid #0F172A',
                          borderRadius: '99px',
                          padding: '8px 20px',
                          minHeight: '40px',
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#0F172A',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 3px 0 0 #0F172A',
                        }}
                      >
                        <Edit3 size={15} />
                        <span>تعديل الملف الشخصي</span>
                      </button>
                    )}
                  </div>

                  <p
                    style={{
                      marginTop: '6px',
                      fontSize: '18px',
                      color: '#3c4452',
                      fontWeight: 600,
                      margin: '6px 0 0',
                    }}
                  >
                    <span className="font-['Arimo'] font-bold text-gray-700">@{displayedMember.username || 'عضو'}</span> · {displayedMember.major || 'علوم حاسب'} · المستوى الدراسي {displayedMember.academicYear || '1'}
                  </p>
                </div>
              </div>

              {/* النبذة التعريفية */}
              <p
                style={{
                  marginTop: '18px',
                  fontSize: '19px',
                  lineHeight: 1.6,
                  maxWidth: '900px',
                  color: '#0F172A',
                  margin: '18px 0 0',
                }}
              >
                {displayedMember.bio ||
                  gText(
                    isFemale,
                    'مهتمة بتجربة المستخدم وأداء المواقع. أحب بناء الواجهات والتصاميم التفاعلية وأتعلم من المشاريع.',
                    'مهتم بتجربة المستخدم وأداء المواقع. أحب بناء الواجهات والتصاميم التفاعلية وأتعلم من المشاريع.'
                  )}
              </p>

              {/* الشرائح الثلاث */}
              <div
                style={{
                  marginTop: '14px',
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="t"
                  style={{
                    background: '#E8F0FE',
                    color: '#0F172A',
                    borderRadius: '99px',
                    padding: '4px 14px',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  مستوى الاستبيان: {displayedMember.webLevel === 'advanced' ? 'متقدم' : displayedMember.webLevel === 'intermediate' ? 'متوسط' : 'مبتدئ'}
                </span>

                <span
                  className="t"
                  style={{
                    background: '#F1F3F4',
                    color: '#0F172A',
                    borderRadius: '99px',
                    padding: '4px 14px',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {displayedMember.joinedAt || 'انضمت في ١٨ جمادى'}
                </span>

                <span
                  className="t"
                  style={{
                    background: '#FFF4D6',
                    color: '#0F172A',
                    borderRadius: '99px',
                    padding: '4px 14px',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  نبذتك معتمدة ✓
                </span>
              </div>
            </div>
          </div>

          {/* 2. الصف الثاني: شريط تقدم رحلتك (3 محطات) + شبكة الإحصاءات الأربع بأيقونات Lucide SVG */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">
            {/* شريط تقدم رحلتك (flex: 2 -> lg:col-span-2) */}
            <div
              className="rounded-[28px] bg-white border-2 border-[#0F172A] p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <b className="text-xl sm:text-2xl font-black text-gray-900">رحلتك</b>
                  <span className="font-['Arimo'] text-base sm:text-lg text-gray-600 font-bold">
                    <b className="text-3xl sm:text-4xl font-black text-[#34A853] ml-1">{displayedMember.points}</b> / 1500 نقطة
                  </span>
                </div>

                {/* شريط التقدم الموحد بارتفاع 16px */}
                <div className="w-full h-4 bg-[#E8EAED] rounded-full overflow-hidden my-4">
                  <div
                    className="h-full bg-[#34A853] rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(100, Math.max(8, Math.round((displayedMember.points / 1500) * 100)))}%`,
                    }}
                  />
                </div>
              </div>

              {/* المحطات الثلاث المنفصلة */}
              <div className="flex justify-between items-center text-sm sm:text-base font-bold text-gray-600 pt-2 border-t border-gray-100">
                <span className={displayedMember.points >= 200 ? 'text-[#34A853] font-black' : ''}>التأسيس</span>
                <span className={displayedMember.points >= 600 ? 'text-[#34A853] font-black' : ''}>التخصص</span>
                <span className={displayedMember.points >= 1100 ? 'text-[#34A853] font-black' : ''}>الاستكشاف</span>
              </div>
            </div>

            {/* شبكة الإحصاءات الأربع بأيقونات SVG المطابقة للنموذج (lg:col-span-3) */}
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* 1. ورش مكتملة */}
              <div className="k" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#4285F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
                  </svg>
                </div>
                <b style={{ fontFamily: 'Arimo', fontSize: '34px', lineHeight: 1 }}>
                  {userStats.workshopsCompleted || 0}
                </b>
                <span style={{ fontSize: '15px' }}>ورش مكتملة</span>
              </div>

              {/* 2. تحديات منجزة */}
              <div className="k" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#F9AB00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
                  </svg>
                </div>
                <b style={{ fontFamily: 'Arimo', fontSize: '34px', lineHeight: 1 }}>
                  {userStats.challengesCompleted || 0}
                </b>
                <span style={{ fontSize: '15px' }}>تحديات منجزة</span>
              </div>

              {/* 3. مشاريع معتمدة */}
              <div className="k" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#34A853', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 22V4M4 4h13l-2 4 2 4H4" />
                  </svg>
                </div>
                <b style={{ fontFamily: 'Arimo', fontSize: '34px', lineHeight: 1 }}>
                  {userStats.projectsCompleted || 0}
                </b>
                <span style={{ fontSize: '15px' }}>مشاريع معتمدة</span>
              </div>

              {/* 4. مبادرات */}
              <div className="k" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#EA4335', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="9" cy="8" r="3.5" />
                    <path d="M2 21a7 7 0 0 1 14 0M17 4a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-4-6" />
                  </svg>
                </div>
                <b style={{ fontFamily: 'Arimo', fontSize: '34px', lineHeight: 1 }}>
                  {store.getMemberAttendanceRate(displayedMember.id) > 0 ? `${store.getMemberAttendanceRate(displayedMember.id)}%` : '0'}
                </b>
                <span style={{ fontSize: '15px' }}>{store.getMemberAttendanceRate(displayedMember.id) > 0 ? 'نسبة الحضور' : 'مبادرات'}</span>
              </div>
            </div>
          </div>

          {/* 3. الصف الثالث: مهاراتك (Chips) + الإنجازات (شبكة شارات بقفل) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
            {/* مهاراتك (lg:col-span-3) */}
            <div
              className="lg:col-span-3 k flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <b style={{ fontSize: '24px' }}>{gText(isFemale, 'مهاراتكِ', 'مهاراتكَ')}</b>
                  <span className="t-proto">
                    {skillsList.filter((s) => s.status === 'approved').length} معتمدة · {skillsList.filter((s) => s.status !== 'approved').length} بانتظار الإثبات
                  </span>
                </div>

                {/* نص التوضيح الموحد مع التأنيث والتذكير التفاعلي */}
                <p style={{ margin: '8px 0 14px', fontSize: '16px', color: '#3c4452' }}>
                  {gText(
                    isFemale,
                    'المهارات من استبيان التسجيل تصير معتمدة لما تسلّمين تطبيقاً عملياً أو تجتازين كويز.',
                    'المهارات من استبيان التسجيل تصير معتمدة لما تسلّم تطبيقاً عملياً أو تجتاز كويز.'
                  )}
                </p>

                {/* رقائق المهارات الصغيرة (Chips) مع إمكانية النقر لاختيار أي مهارة */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {skillsList.slice(0, 10).map((skill, idx) => {
                    const isApproved = skill.status === 'approved';
                    return (
                      <span
                        key={idx}
                        onClick={() => {
                          if (isViewingSelf) handleOpenProofModal(skill);
                        }}
                        title={isApproved ? 'مهارة معتمدة' : gText(isFemale, 'انقري لتسليم إثبات هذه المهارة', 'انقر لتسليم إثبات هذه المهارة')}
                        style={{
                          background: isApproved ? '#E6F4EA' : '#fff',
                          border: isApproved ? '2px solid #34A853' : '2px dashed #9AA0A6',
                          padding: '8px 16px',
                          fontSize: '16px',
                          fontFamily: 'Arimo',
                          borderRadius: '99px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: isApproved ? '#137333' : '#0F172A',
                          fontWeight: 600,
                          cursor: isViewingSelf ? 'pointer' : 'default',
                        }}
                      >
                        {isApproved && <Check size={16} strokeWidth={3} className="text-[#34A853]" />}
                        <span>{skill.name}</span>
                      </span>
                    );
                  })}
                  {skillsList.length > 10 && (
                    <span className="t-proto" style={{ padding: '8px 16px', background: '#E8F0FE', fontFamily: 'Arimo', fontSize: '16px', fontWeight: 700 }}>
                      +{skillsList.length - 10}
                    </span>
                  )}
                </div>
              </div>

              {/* زر تسليم إثبات مهارة مع مراعاة الجنس واختيار المهارة */}
              {isViewingSelf && (
                <div style={{ marginTop: '18px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const unverified = skillsList.find((s) => s.status !== 'approved') || skillsList[0];
                      if (unverified) handleOpenProofModal(unverified);
                    }}
                    className="b-proto y"
                  >
                    {genderVocab.submit(isFemale)} إثبات لمهارة
                  </button>
                </div>
              )}
            </div>

            {/* الإنجازات والشارات (lg:col-span-2) */}
            <div
              className="lg:col-span-2 k"
            >
              <b style={{ fontSize: '24px' }}>الإنجازات</b>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '14px' }}>
                {/* شارة 1: أول دخول (مفتوحة دائماً بالعضو المسجل) */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '72px', height: '72px', margin: '0 auto 6px', borderRadius: '50%', background: '#F9AB00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m12 2 3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '15px' }}>أول دخول</span>
                </div>

                {/* شارة 2: أول تسليم */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '72px', height: '72px', margin: '0 auto 6px', borderRadius: '50%', background: userSubmissions.length > 0 ? '#34A853' : '#F1F3F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: userSubmissions.length > 0 ? '#fff' : '#5f6673' }}>
                    {userSubmissions.length > 0 ? (
                      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: '15px' }}>أول تسليم</span>
                </div>

                {/* شارة 3: أول ورشة */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '72px', height: '72px', margin: '0 auto 6px', borderRadius: '50%', background: store.getMemberAttendanceStats(displayedMember.id).attended > 0 ? '#4285F4' : '#F1F3F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: store.getMemberAttendanceStats(displayedMember.id).attended > 0 ? '#fff' : '#5f6673' }}>
                    {store.getMemberAttendanceStats(displayedMember.id).attended > 0 ? (
                      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: '15px' }}>أول ورشة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= نافذة تعديل الملف الشخصي (Modal) ================= */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full card-navy shadow-2xl relative border-2 border-[#0F1729]"
            >
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Edit3 size={18} className="text-[#4285F4]" />
                  <span>تعديل الملف الشخصي</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 border-none bg-transparent cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                {/* النبذة الشخصية */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    النبذة التعريفية (50 حرفاً على الأقل):
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="اكتب نبذة عن اهتماماتك وشغفك في تطوير الويب..."
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 text-xs"
                  />
                  <div className="text-[10px] text-gray-400 text-left mt-0.5">
                    {editBio.length} / 50 حرف
                  </div>
                </div>

                {/* رقم الجوال المحمي */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    رقم الجوال (محمي ولا يظهر للأعضاء الآخرين):
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 text-xs text-left"
                  />
                </div>

                {/* التخصص والمستوى الدراسي */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">التخصص:</label>
                    <input
                      type="text"
                      value={editMajor}
                      onChange={(e) => setEditMajor(e.target.value)}
                      placeholder="علوم حاسب"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">السنة الدراسية:</label>
                    <input
                      type="text"
                      value={editAcademicYear}
                      onChange={(e) => setEditAcademicYear(e.target.value)}
                      placeholder="السنة الثالثة"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>

                {/* رابط صورة الأفاتار */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    رابط صورتك الشخصية (اختياري):
                  </label>
                  <input
                    type="url"
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    dir="ltr"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 text-xs text-left"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    إذا تركت الرابط فارغاً، سيظهر الحرف الأول بهوية قوقل الأنيقة.
                  </span>
                </div>

                {/* رسالة التأكيد */}
                {editSaveMessage && (
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs text-center border border-blue-200">
                    {editSaveMessage}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#4285F4] text-white font-bold hover:bg-blue-600 transition-colors border-none cursor-pointer flex items-center gap-1.5"
                  >
                    {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* نافذة تسليم إثبات المهارة (استبيان / رابط تطبيق / كويز / رابط قيت) */}
        {selectedSkillForProof && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedSkillForProof(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border-2 border-[#0F1729] shadow-2xl text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-black">
                    {selectedSkillForProof.source === 'survey_registration' ? '📋' : '🐙'}
                  </div>
                  <div>
                    <h3 className="font-black text-base text-gray-900">
                      اعتماد مهارة: {selectedSkillForProof.name}
                    </h3>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {selectedSkillForProof.source === 'survey_registration'
                        ? 'مأخوذة من استبيان التسجيل'
                        : 'مهارة شخصية مضافة'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSkillForProof(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 border-none bg-transparent cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitProof} className="space-y-4 text-xs">
                {selectedSkillForProof.source === 'survey_registration' ? (
                  <>
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed font-medium">
                      📌 <strong>ملاحظة الاعتماد:</strong> مهارات الاستبيان تُعتمد بعد تسليم رابط تطبيق عملي أنجزته أو تقديم طلب لحل كويز المسار ليتم رصد النقاط لك.
                    </div>

                    {/* قائمة منسدلة لاختيار المهارة بحرية كاملة */}
                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">
                        {gText(isFemale, 'اختاري المهارة التي تودين تسليم إثبات لها:', 'اختار المهارة التي تود تسليم إثبات لها:')}
                      </label>
                      <select
                        value={selectedSkillForProof.name}
                        onChange={(e) => {
                          const chosen = skillsList.find((s) => s.name === e.target.value);
                          if (chosen) {
                            setSelectedSkillForProof(chosen);
                            setProofValue(chosen.gitUrl || '');
                            if (chosen.source === 'survey_registration') {
                              setProofType('app_link');
                            } else {
                              setProofType('git_url');
                            }
                          }
                        }}
                        className="w-full p-2.5 rounded-xl border border-gray-300 bg-white font-bold text-gray-900 focus:outline-none focus:border-blue-500 text-xs shadow-xs"
                      >
                        {skillsList.map((s, idx) => (
                          <option key={idx} value={s.name}>
                            {s.name} {s.status === 'approved' ? '✓ (معتمدة)' : '⏳ (بانتظار الإثبات)'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-2">طريقة الإثبات التي تفضلها:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setProofType('app_link')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            proofType === 'app_link'
                              ? 'bg-blue-50 border-blue-600 text-blue-800'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          <FileCode2 size={14} />
                          <span>رابط تطبيق عملي</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProofType('quiz')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            proofType === 'quiz'
                              ? 'bg-blue-50 border-blue-600 text-blue-800'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          <Award size={14} />
                          <span>حل كويز تقييمي</span>
                        </button>
                      </div>
                    </div>

                    {proofType === 'app_link' ? (
                      <div>
                        <label className="block font-bold text-gray-800 mb-1">
                          رابط التطبيق أو مستودع الكود (GitHub / Vercel / Netlify):
                        </label>
                        <input
                          type="url"
                          required
                          value={proofValue}
                          onChange={(e) => setProofValue(e.target.value)}
                          placeholder="https://github.com/username/project"
                          dir="ltr"
                          className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 text-xs text-left"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                        {quizStep === 'intro' && (
                          <div className="p-5 rounded-2xl bg-blue-50/70 border-2 border-blue-200 text-right space-y-4">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                ⏱️
                              </span>
                              <div>
                                <h3 className="text-base font-black text-gray-950">
                                  تمهيد: كويز اعتماد مهارة «{selectedSkillForProof?.name}»
                                </h3>
                                <span className="text-[11px] font-bold text-gray-500">
                                  تقييم مباشر ومعتمد لتوثيق المهارة في ملفك الشخصي
                                </span>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2 text-xs font-bold text-gray-700">
                              <div className="flex items-center gap-2">
                                <span className="text-blue-600">•</span>
                                <span>عدد الأسئلة: <strong>4 أسئلة برمجية متوسطة</strong></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-blue-600">•</span>
                                <span>الوقت المخصص: <strong>دقيقة واحدة (60 ثانية) لكل سؤال على حدة</strong></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-blue-600">•</span>
                                <span>شرط النجاح: <strong>3 إجابات صحيحة على الأقل</strong></span>
                              </div>
                              <div className="flex items-center gap-2 text-emerald-800">
                                <span className="text-emerald-600">✓</span>
                                <span>المكافأة: <strong>اعتماد المهارة فوراً + إضافة 25 نقطة لرصيدك!</strong></span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleStartQuiz}
                              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer border-none shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <span>بدء الكويز الآن</span>
                              <span>🚀</span>
                            </button>
                          </div>
                        )}

                        {quizStep === 'question' && (() => {
                          const q = SKILL_QUIZ_QUESTIONS[currentQuestionIndex];
                          const hasAnswer = quizAnswers[q.id] !== undefined;

                          return (
                            <div className="space-y-4">
                              {/* شريط التقدم والعداد */}
                              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-gray-900">
                                    السؤال {currentQuestionIndex + 1} من {SKILL_QUIZ_QUESTIONS.length}
                                  </span>
                                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-600 transition-all duration-300"
                                      style={{ width: `${((currentQuestionIndex + 1) / SKILL_QUIZ_QUESTIONS.length) * 100}%` }}
                                    />
                                  </div>
                                </div>

                                <div
                                  className={`px-3 py-1 rounded-xl font-mono text-xs font-black border flex items-center gap-1.5 ${
                                    timeLeft <= 15
                                      ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                                      : 'bg-white text-gray-800 border-gray-300'
                                  }`}
                                >
                                  <span>⏱️</span>
                                  <span>00:{timeLeft < 10 ? '0' : ''}{timeLeft}</span>
                                </div>
                              </div>

                              {/* نص السؤال والخيارات */}
                              <div className="p-4 rounded-2xl bg-white border-2 border-gray-200">
                                <span className="font-black text-gray-950 block mb-3 text-sm leading-relaxed">
                                  {q.question}
                                </span>

                                <div className="space-y-2">
                                  {q.options.map((opt, optIdx) => (
                                    <label
                                      key={optIdx}
                                      className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 cursor-pointer text-xs ${
                                        quizAnswers[q.id] === optIdx
                                          ? 'bg-blue-50 border-blue-600 font-black text-blue-950 shadow-2xs'
                                          : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`quiz-q-${q.id}`}
                                        checked={quizAnswers[q.id] === optIdx}
                                        onChange={() =>
                                          setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                        }
                                        className="accent-blue-600 cursor-pointer w-4 h-4"
                                      />
                                      <span className="flex-1">{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              {/* زر الانتقال أو الإنهاء */}
                              <button
                                type="button"
                                onClick={handleNextQuizQuestion}
                                disabled={!hasAnswer}
                                className={`w-full py-3 rounded-xl font-black text-xs cursor-pointer border-none shadow-sm transition-all flex items-center justify-center gap-2 ${
                                  hasAnswer
                                    ? 'bg-[#34A853] hover:bg-green-700 text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                {currentQuestionIndex < SKILL_QUIZ_QUESTIONS.length - 1 ? (
                                  <>
                                    <span>السؤال التالي</span>
                                    <span>←</span>
                                  </>
                                ) : (
                                  <>
                                    <span>إنهاء الكويز وعرض النتيجة</span>
                                    <span>✓</span>
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })()}

                        {quizStep === 'result' && (
                          <div className="p-5 rounded-2xl bg-white border-2 border-gray-200 text-center space-y-4">
                            {quizScore >= 3 ? (
                              <div className="space-y-3">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto shadow-sm">
                                  🎉
                                </div>
                                <h3 className="text-lg font-black text-emerald-900">
                                  ألف مبروك! اجتزت الكويز بنجاح
                                </h3>
                                <p className="text-xs font-bold text-gray-600">
                                  حصلت على <span className="text-emerald-700 font-black text-sm">{quizScore} من 4</span> إجابات صحيحة.
                                  تم اعتماد مهارة «{selectedSkillForProof?.name}» فوراً وإضافة <strong>+25 نقطة</strong> إلى رصيدك!
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSkillForProof(null);
                                    setQuizStep('intro');
                                  }}
                                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs border-none cursor-pointer hover:bg-emerald-700"
                                >
                                  إغلاق والعودة للملف الشخصي
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 text-3xl flex items-center justify-center mx-auto shadow-sm">
                                  ⏳
                                </div>
                                <h3 className="text-lg font-black text-amber-950">
                                  لم يتم اجتياز الكويز هذه المرة
                                </h3>
                                <p className="text-xs font-bold text-gray-600">
                                  حصلت على <span className="text-amber-800 font-black text-sm">{quizScore} من 4</span>. يلزم 3 إجابات صحيحة للاعتماد.
                                  يمكنك مراجعة المفاهيم وإعادة المحاولة.
                                </p>
                                <button
                                  type="button"
                                  onClick={handleStartQuiz}
                                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs border-none cursor-pointer hover:bg-blue-700"
                                >
                                  إعادة المحاولة 🔄
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 leading-relaxed font-medium">
                      🐙 <strong>اعتماد المهارة برابط Git:</strong> الصق رابط مستودع GitHub الذي يثبت استخدامك لهذه المهارة لتقوم القائدة بمراجعته وإضافة النقاط إلى رصيدك.
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1">
                        رابط مستودع GitHub:
                      </label>
                      <input
                        type="url"
                        required
                        value={proofValue}
                        onChange={(e) => setProofValue(e.target.value)}
                        placeholder="https://github.com/username/repository"
                        dir="ltr"
                        className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 text-xs text-left"
                      />
                    </div>
                  </>
                )}

                {proofFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-center border border-emerald-200">
                    {proofFeedback}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedSkillForProof(null)}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer font-bold"
                  >
                    إلغاء
                  </button>
                  {proofType !== 'quiz' && (
                    <button
                      type="submit"
                      disabled={isSubmittingProof || !proofValue.trim()}
                      className="px-5 py-2 rounded-xl bg-[#4285F4] text-white font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors border-none cursor-pointer flex items-center gap-1.5"
                    >
                      {isSubmittingProof ? 'جاري الإرسال...' : 'إرسال للقائدة للاعتماد ✨'}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
