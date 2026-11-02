import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { UserProfile, MemberSkillItem, BadgeItem, UserStats } from '../../types';
import { store } from '../../services/store';
import { UserAvatar } from '../common/UserAvatar';
import { isFemaleUser, gText, genderVocab } from '../../utils/gender';
import { getQuizQuestionsForSkill } from '../../data/skillQuizBanks';
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
  viewingMember?: UserProfile | null;
  hideDirectoryTab?: boolean;
  onClose?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  viewingMember = null,
  hideDirectoryTab = false,
  onClose,
}) => {
  const [allMembers, setAllMembers] = useState<UserProfile[]>(() => store.getMembers());
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    viewingMember ? viewingMember.id : currentUser.id
  );
  const [activeTab, setActiveTab] = useState<'profile' | 'directory'>('profile');
  const [viewingInquiryModal, setViewingInquiryModal] = useState<any | null>(null);

  // حالة نافذة منح واعتماد النقاط من قبل القيادة
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [awardPointsAmount, setAwardPointsAmount] = useState<number>(20);
  const [awardReason, setAwardReason] = useState<string>('حضور ورشة / لقاء تفاعلي');
  const [customReason, setCustomReason] = useState<string>('');
  const [isSubmittingAward, setIsSubmittingAward] = useState(false);
  const [awardSuccessMsg, setAwardSuccessMsg] = useState<string | null>(null);

  // مزامنة البيانات عند أي تحديث في المتجر
  useEffect(() => {
    const sync = () => setAllMembers(store.getMembers());
    sync();
    return store.subscribe(sync);
  }, []);

  // تحديث العضو المختار عند تغيير المستخدم أو تفعيل وضع المعاينة
  useEffect(() => {
    if (viewingMember) {
      setSelectedMemberId(viewingMember.id);
      setActiveTab('profile');
    } else {
      setSelectedMemberId(currentUser.id);
      if (hideDirectoryTab) {
        setActiveTab('profile');
      }
    }
  }, [viewingMember?.id, currentUser.id, hideDirectoryTab]);

  // إغلاق المعاينة عند الضغط على زر Escape
  useEffect(() => {
    if (!onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const displayedMember = viewingMember || allMembers.find((m) => m.id === selectedMemberId) || currentUser;
  const isViewingSelf = !viewingMember && displayedMember.id === currentUser.id;
  const isStaff = currentUser.role === 'track_leader' || currentUser.role === 'co_leader' || currentUser.role === 'supervisor';
  const isFemale = isFemaleUser(displayedMember);

  // البحث في دليل الأعضاء
  const [searchTerm, setSearchTerm] = useState('');

  const excludedStaffNames = ['رنا', 'أثير', 'اثير', 'عامر', 'وجد', 'ثامر', 'ريتال', 'غيداء'];

  const filteredMembers = allMembers.filter((m) => {
    // استبعاد الإشراف والقادة بناءً على الدور والرتبة والاسم الصريح
    if (m.role === 'supervisor' || m.role === 'track_leader') return false;
    if (excludedStaffNames.some((n) => m.fullName.includes(n))) return false;

    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.username?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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
  const [showAllSkills, setShowAllSkills] = useState(false);

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

  // بنك الأسئلة المخصص والمطابق للمهارة المحددة (Git، VS Code، HTML، CSS، إلخ)
  const currentSkillQuizQuestions = getQuizQuestionsForSkill(selectedSkillForProof?.name || '');

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
    if (skill.status === 'approved') {
      alert(`مهارة «${skill.name}» معتمدة ومثبتة رسمياً في ملفك الشخصي! 🌟`);
      return;
    }
    setSelectedSkillForProof(skill);
    setProofValue(skill.gitUrl || '');
    setProofFeedback(null);
    setQuizStep('intro');
    setQuizAnswers({});
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
    if (currentQuestionIndex < currentSkillQuizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(60);
    } else {
      // نهاية الكويز وحساب النتيجة
      let score = 0;
      currentSkillQuizQuestions.forEach((q) => {
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

  // معالجة منح القيادة للنقاط
  const handleAwardPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customReason.trim() ? customReason.trim() : awardReason;
    if (!finalReason) return;
    setIsSubmittingAward(true);
    setAwardSuccessMsg(null);
    try {
      await store.awardPoints(
        displayedMember.id,
        Number(awardPointsAmount),
        finalReason,
        currentUser.id,
        `manual-leader-${Date.now()}-${displayedMember.id.slice(0, 5)}`
      );
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#34A853', '#4285F4', '#F9AB00', '#EA4335'],
      });
      setAwardSuccessMsg(`تم اعتماد وإضافة +${awardPointsAmount} نقطة لملف ${displayedMember.fullName} بنجاح! 🌟`);
      setTimeout(() => {
        setShowAwardModal(false);
        setAwardSuccessMsg(null);
        setCustomReason('');
      }, 1500);
    } catch (err: any) {
      setAwardSuccessMsg(err?.message || 'حدث خطأ أثناء اعتماد النقاط');
    } finally {
      setIsSubmittingAward(false);
    }
  };

  const getLeaderInfo = (leaderId?: string) => {
    if (!leaderId) return { name: 'إدارة المسار', role: 'لجنة التحكيم والتقييم', color: '#64748B', bg: '#F1F5F9', border: '#CBD5E1' };
    if (leaderId === '1734f887-f9f3-4d6c-a963-d00f767d86e6') {
      return { name: 'غيداء الشريف', role: 'قائدة مسار الويب 👑', color: '#B91C1C', bg: '#FEE2E2', border: '#FCA5A5' };
    }
    if (leaderId === '6a3430df-424d-4bc0-99d1-b5b196b7fef3') {
      return { name: 'ريتال القثامي', role: 'نائبة القادة 🛡️', color: '#1D4ED8', bg: '#DBEAFE', border: '#93C5FD' };
    }
    if (leaderId === 'fe04b670-48b6-4ff0-9826-27b0de853abb') {
      return { name: 'سلمان الشهري', role: 'نائب القادة 🛡️', color: '#15803D', bg: '#DCFCE7', border: '#86EFAC' };
    }
    const found = allMembers.find((m) => m.id === leaderId);
    if (found) {
      const roleText = found.role === 'track_leader' ? 'قائدة المسار 👑' : 'نائب القادة 🛡️';
      return { name: found.fullName, role: roleText, color: '#4338CA', bg: '#EEF2FF', border: '#C7D2FE' };
    }
    return { name: 'إدارة مسار الويب', role: 'القيادة', color: '#475569', bg: '#F1F5F9', border: '#CBD5E1' };
  };

  // جلب سجل تفاصيل النقاط الفعلي للعضو المعروض
  const memberLedger = store.getPointsLedger().filter(
    (l: any) => l.profile_id === displayedMember.id || l.profileId === displayedMember.id
  );

  const fullLedger: any[] = [...memberLedger];

  // 1. نقاط الترحيب بالانضمام (+100)
  const hasWelcome = fullLedger.some((l) => l.reason?.includes('ترحيب') || l.reason?.includes('انضمام'));
  if (!hasWelcome && displayedMember.points >= 100) {
    fullLedger.push({
      id: 'welcome-init-base',
      profile_id: displayedMember.id,
      points_amount: 100,
      reason: 'نقاط الترحيب بالانضمام لمسار تصميم وتطوير الويب 🚀',
      approved_by: '1734f887-f9f3-4d6c-a963-d00f767d86e6',
      created_at: displayedMember.joinedAt || '2026-10-29T10:00:00Z',
    });
  }

  // 2. نقاط حضور اللقاء التعريفي (+20) إذا كان معتمداً بالحضور ولم يسجل قيد منفصل
  const attStats = store.getMemberAttendanceStats(displayedMember.id);
  const hasAttendedIntro = attStats.attended > 0;
  const hasIntroLedger = fullLedger.some((l) => l.reason?.includes('اللقاء التعريفي') || l.reason?.includes('حضور'));
  if (hasAttendedIntro && !hasIntroLedger) {
    fullLedger.push({
      id: 'att-intro-base',
      profile_id: displayedMember.id,
      points_amount: 20,
      reason: 'حضور اللقاء التعريفي الأول لمسار الويب 🎯',
      approved_by: '6a3430df-424d-4bc0-99d1-b5b196b7fef3',
      created_at: '2026-10-29T18:00:00Z',
    });
  }

  // ترتيب السجل بالأحدث أولاً
  fullLedger.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  const skillsList: MemberSkillItem[] =
    displayedMember.detailedSkills && displayedMember.detailedSkills.length > 0
      ? displayedMember.detailedSkills
      : (displayedMember.skills || []).map((s) => ({
          name: s,
          progressPercent: 0,
          status: 'in_progress',
          source: 'survey_registration',
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
      {/* شريط الإغلاق والتنقل المرن عند معاينة ملف عضو محدد */}
      {onClose && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-2 border-gray-900 rounded-2xl p-3 sm:p-4 mb-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-black bg-gray-900 text-white hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border-none"
            >
              <X size={16} />
              <span>إغلاق ✕</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 hidden sm:inline">معاينة حساب العضو:</span>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-amber-100 text-amber-900 border border-amber-300">
                {displayedMember.fullName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isStaff && !isViewingSelf && (
              <button
                type="button"
                onClick={() => setShowAwardModal(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border-none"
              >
                <Sparkles size={13} className="text-amber-300" />
                <span>+ منح نقاط 🎁</span>
              </button>
            )}
            <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300 font-['Arimo']">
              ⭐ {displayedMember.points} نقطة
            </span>
          </div>
        </div>
      )}

      {/* 1. التبديل بين البروفايل ودليل الأعضاء (يُخفى تلقائياً عند معاينة ملف عضو محدد) */}
      {!hideDirectoryTab && (
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
      )}

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

                    {isViewingSelf ? (
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
                    ) : isStaff ? (
                      <button
                        type="button"
                        onClick={() => setShowAwardModal(true)}
                        className="cursor-pointer hover:bg-gray-800 transition-all text-white border-none shadow-md active:scale-95"
                        style={{
                          backgroundColor: '#0F172A',
                          borderRadius: '99px',
                          padding: '10px 22px',
                          minHeight: '42px',
                          fontSize: '15px',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 0 0 #34A853',
                        }}
                      >
                        <Sparkles size={17} className="text-amber-400" />
                        <span>+ منح نقاط للعضو 🎁</span>
                      </button>
                    ) : null}
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
                {isStaff && (
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
                )}

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

          {/* ================= سجل تفاصيل النقاط والاعتمادات الرسمية 📊 ================= */}
          <div className="rounded-[28px] bg-white border-2 border-[#0F172A] p-6 sm:p-7 shadow-xs text-right">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📊</span>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                    سجل تفاصيل النقاط والاعتمادات الرسمية
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                  كشف شفاف ومفصل يوضح سبب كل نقطة ومَن اعتمدها من قيادة المسار بالتاريخ الدقيق
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-900">إجمالي النقاط المعتمدة:</span>
                  <span className="text-lg font-black text-emerald-700 font-['Arimo']">
                    {displayedMember.points}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">نقطة ⭐</span>
                </div>

                {isStaff && !isViewingSelf && (
                  <button
                    type="button"
                    onClick={() => setShowAwardModal(true)}
                    className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-black bg-[#0F172A] text-white hover:bg-gray-800 transition-all flex items-center gap-2 cursor-pointer shadow-xs border-none"
                  >
                    <Sparkles size={15} className="text-amber-400" />
                    <span>+ منح نقاط للعضو 🎁</span>
                  </button>
                )}
              </div>
            </div>

            {fullLedger.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <Award size={36} className="mx-auto text-gray-400 mb-2" />
                <div className="text-sm font-black text-gray-800">لا توجد قيود نقاط مسجلة بعد</div>
                <p className="text-xs text-gray-500 mt-1">
                  سيتم إدراج النقاط فور حضور الورش أو تسليم المهام واعتمادها من القيادة
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {fullLedger.map((item, idx) => {
                  const approver = getLeaderInfo(item.approved_by);
                  const pts = Number(item.points_amount) || 0;
                  const dateStr = item.created_at
                    ? new Date(item.created_at).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'أكتوبر 2026';

                  return (
                    <div
                      key={item.id || idx}
                      className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-200 hover:border-gray-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* جهة اليمين: مقدار النقاط والسبب */}
                      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                        <div
                          className={`px-3 py-1.5 rounded-xl font-black text-sm sm:text-base font-['Arimo'] shrink-0 flex items-center gap-1 shadow-2xs ${
                            pts >= 100
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : pts >= 50
                              ? 'bg-purple-100 text-purple-900 border border-purple-300'
                              : pts >= 25
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-blue-100 text-blue-900 border border-blue-300'
                          }`}
                        >
                          <span>+{pts}</span>
                          <span className="text-[11px] font-sans">نقطة</span>
                        </div>

                        <div className="min-w-0">
                          <div className="text-sm sm:text-base font-black text-gray-900 leading-snug">
                            {item.reason || 'مكافأة مسار الويب'}
                          </div>
                          <div className="text-xs text-gray-500 font-semibold mt-0.5 flex items-center gap-2 flex-wrap">
                            <span>📅 {dateStr}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">معتمد وموثق ✓</span>
                          </div>
                        </div>
                      </div>

                      {/* جهة اليسار: بطاقة المعتمد (غيداء، ريتال، سلمان) */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="text-[11px] font-bold text-gray-500">اعتمدت بواسطة:</span>
                        <div
                          className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border shadow-2xs"
                          style={{
                            backgroundColor: approver.bg,
                            color: approver.color,
                            borderColor: approver.border,
                          }}
                        >
                          <Shield size={13} />
                          <span>{approver.name}</span>
                          <span className="text-[10px] opacity-80">({approver.role})</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* قسم متابعة طلبات العضو وتحديثات الاعتماد (موافقة / رفض / شاهد الرد) */}
          {/* قسم متابعة طلبات العضو وتحديثات الاعتماد (موافقة / رفض / شاهد الرد) */}
          {(() => {
            const memberInquiries = store
              .getInquiries()
              .filter((inq: any) => {
                const senderName = (inq.userName || '').trim().toLowerCase();
                const myName = (displayedMember.fullName || '').trim().toLowerCase();
                return (
                  inq.userId === displayedMember.id ||
                  inq.profile_id === displayedMember.id ||
                  (myName && senderName && senderName === myName) ||
                  (inq.title && displayedMember.fullName && inq.title.includes(`(${displayedMember.fullName})`)) ||
                  (inq.details && displayedMember.fullName && inq.details.includes(displayedMember.fullName)) ||
                  (displayedMember.fullName.includes('عامر') && (senderName.includes('عامر') || (inq.title || '').includes('عامر'))) ||
                  (displayedMember.fullName.includes('أثير') && (senderName.includes('أثير') || (inq.title || '').includes('أثير'))) ||
                  (displayedMember.fullName.includes('وجد') && (senderName.includes('وجد') || (inq.title || '').includes('وجد'))) ||
                  (displayedMember.fullName.includes('ثامر') && (senderName.includes('ثامر') || (inq.title || '').includes('ثامر')))
                );
              });
            if (memberInquiries.length === 0) return null;

            return (
              <div className="rounded-[28px] bg-white border-2 border-[#0F172A] p-6 sm:p-7 shadow-xs text-right">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">📬</span>
                    <h3 className="text-xl font-black text-gray-900">
                      طلبات الاعتماد وتحديثات الإشراف
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    {memberInquiries.length} طلبات مسجلة
                  </span>
                </div>

                <div className="space-y-3">
                  {memberInquiries.map((inq: any) => {
                    const isApproved = inq.status === 'approved' || inq.decision === 'approved';
                    const isRejected = inq.status === 'rejected' || inq.decision === 'rejected';
                    const isPending = !isApproved && !isRejected;
                    const hasReply = Boolean(inq.responseText || inq.response_text || inq.decisionNotes);

                    return (
                      <div
                        key={inq.id}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:border-gray-400 transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-sm font-black text-gray-900">
                              {inq.title || 'طلب اعتماد / استفسار'}
                            </span>
                            {isApproved && (
                              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                معتمد ومقبول بنجاح ✅
                              </span>
                            )}
                            {isRejected && (
                              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                                مرفوض ❌
                              </span>
                            )}
                            {isPending && (
                              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                                قيد المراجعة ⏳
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 font-medium">
                            {inq.details || 'لا توجد تفاصيل إضافية'}
                          </p>

                          {hasReply && (
                            <div className="mt-2.5 p-3 rounded-xl bg-white border border-emerald-200 text-xs text-gray-800 shadow-2xs">
                              <span className="font-black text-emerald-800 block mb-1">
                                💬 رد وملاحظات القيادة ({inq.respondedBy || inq.answered_by || 'غيداء تركي الشريف'}):
                              </span>
                              <p className="font-semibold whitespace-pre-wrap leading-relaxed text-gray-900">
                                {inq.responseText || inq.response_text || inq.decisionNotes}
                              </p>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setViewingInquiryModal(inq)}
                          className="px-4 py-2 rounded-xl text-xs font-black bg-gray-900 text-white hover:bg-black transition-all cursor-pointer whitespace-nowrap shadow-xs flex items-center gap-1.5 self-end md:self-center"
                        >
                          <span>👁️ شاهد الرد والتفاصيل</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

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
                  {(showAllSkills ? skillsList : skillsList.slice(0, 10)).map((skill, idx) => {
                    const isApproved = skill.status === 'approved';
                    return (
                      <span
                        key={idx}
                        onClick={() => {
                          if (isViewingSelf) handleOpenProofModal(skill);
                        }}
                        title={
                          isApproved
                            ? 'مهارة معتمدة ومثبتة رسمياً ✓'
                            : gText(isFemale, 'انقري لتسليم إثبات هذه المهارة', 'انقر لتسليم إثبات هذه المهارة')
                        }
                        style={{
                          background: isApproved ? '#FEF9C3' : '#FFFFFF',
                          border: isApproved ? '2px solid #EAB308' : '2px dashed #94A3B8',
                          padding: '8px 16px',
                          fontSize: '15px',
                          borderRadius: '99px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: isApproved ? '#713F12' : '#1E293B',
                          fontWeight: 700,
                          cursor: isViewingSelf ? (isApproved ? 'default' : 'pointer') : 'default',
                          boxShadow: isApproved ? '0 1px 3px rgba(234, 179, 8, 0.25)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {isApproved && <Check size={16} strokeWidth={3} className="text-[#CA8A04]" />}
                        <span>{skill.name}</span>
                        {isApproved ? (
                          <span
                            style={{
                              fontSize: '11px',
                              background: '#FDE047',
                              color: '#713F12',
                              padding: '1px 7px',
                              borderRadius: '99px',
                              fontWeight: 800,
                            }}
                          >
                            معتمدة
                          </span>
                        ) : null}
                      </span>
                    );
                  })}
                  {skillsList.length > 10 && (
                    <button
                      type="button"
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="t-proto hover:bg-blue-100 transition-colors cursor-pointer border-none"
                      style={{ padding: '8px 16px', background: '#E8F0FE', fontSize: '14px', fontWeight: 700 }}
                    >
                      {showAllSkills ? 'عرض أقل ▴' : `+${skillsList.length - 10} المزيد`}
                    </button>
                  )}
                </div>
              </div>

              {/* زر تسليم إثبات مهارة مع مراعاة الجنس واختيار المهارة */}
              {isViewingSelf && (
                <div style={{ marginTop: '18px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const unverified = skillsList.find((s) => s.status !== 'approved');
                      if (unverified) {
                        handleOpenProofModal(unverified);
                      } else {
                        alert('🎉 تبارك الله! جميع مهاراتك معتمدة ومثبتة بنجاح.');
                      }
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

                    {/* قائمة منسدلة لاختيار المهارة غير المعتمدة فقط (المهارات المعتمدة لا تظهر في الخيارات) */}
                    <div>
                      <label className="block font-bold text-gray-800 mb-1.5">
                        {gText(isFemale, 'اختاري المهارة التي تودين تسليم إثبات لها:', 'اختار المهارة التي تود تسليم إثبات لها:')}
                      </label>
                      {skillsList.filter((s) => s.status !== 'approved').length > 0 ? (
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
                          {skillsList
                            .filter((s) => s.status !== 'approved')
                            .map((s, idx) => (
                              <option key={idx} value={s.name}>
                                {s.name} ⏳ (بانتظار الإثبات)
                              </option>
                            ))}
                        </select>
                      ) : (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-center">
                          🎉 تبارك الله! جميع مهاراتك معتمدة ومثبتة رسمياً.
                        </div>
                      )}
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
                          const q = currentSkillQuizQuestions[currentQuestionIndex];
                          const hasAnswer = quizAnswers[q.id] !== undefined;

                          return (
                            <div className="space-y-4">
                              {/* شريط التقدم والعداد */}
                              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-gray-900">
                                    السؤال {currentQuestionIndex + 1} من {currentSkillQuizQuestions.length}
                                  </span>
                                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-600 transition-all duration-300"
                                      style={{ width: `${((currentQuestionIndex + 1) / currentSkillQuizQuestions.length) * 100}%` }}
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
                                {currentQuestionIndex < currentSkillQuizQuestions.length - 1 ? (
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

      {/* نافذة شاهد الرد والتفاصيل للعضو */}
      <AnimatePresence>
        {viewingInquiryModal && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-900 text-right"
            >
              {(() => {
                const isApproved = viewingInquiryModal.status === 'approved' || viewingInquiryModal.decision === 'approved';
                const isRejected = viewingInquiryModal.status === 'rejected' || viewingInquiryModal.decision === 'rejected';

                return (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                      <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <span>تفاصيل ورد القيادة</span>
                      </h3>
                      {isApproved && (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          معتمد ومقبول بنجاح ✅
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                          مرفوض ❌
                        </span>
                      )}
                      {!isApproved && !isRejected && (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                          قيد المراجعة ⏳
                        </span>
                      )}
                    </div>

                    {/* بطاقة الطلب الأصلي */}
                    <div className="mb-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 mb-1">الطلب المُرسل:</p>
                      <b className="text-sm text-gray-900 block mb-2">{viewingInquiryModal.title}</b>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {viewingInquiryModal.details}
                      </p>
                    </div>

                    {/* بطاقة رد القيادة الرسمي */}
                    <div className={`mb-6 p-4 rounded-2xl border ${
                      isApproved
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : isRejected
                        ? 'bg-rose-50 border-rose-300 text-rose-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black flex items-center gap-1.5">
                          {isApproved && '✅ قرار القيادة: تمت الموافقة والاعتماد'}
                          {isRejected && '❌ قرار القيادة: نعتذر، لم يتم الاعتماد'}
                          {!isApproved && !isRejected && '⏳ قيد المراجعة والدراسة'}
                        </span>
                        {viewingInquiryModal.respondedBy && (
                          <span className="text-[11px] font-bold opacity-80">
                            بواسطة: {viewingInquiryModal.respondedBy}
                          </span>
                        )}
                      </div>

                      <p className="text-xs leading-relaxed whitespace-pre-wrap font-medium">
                        {viewingInquiryModal.responseText ||
                          viewingInquiryModal.response_text ||
                          viewingInquiryModal.decisionNotes ||
                          (isApproved
                            ? 'تم اعتماد طلبك رسمياً وتفعيل الصلاحية/النقاط في حسابك بنجاح.'
                            : 'طلبك قيد المتابعة من قِبل إدارة المسار.')}
                      </p>

                      {isApproved && (
                        <div className="mt-3 pt-2 border-t border-emerald-200 text-[11px] font-bold text-emerald-800">
                          ⭐ الأثر: تم تفعيل الصلاحية أو رصد نقاط الإنجاز لحسابك تلقائياً.
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingInquiryModal(null)}
                  className="px-6 py-2.5 rounded-full text-xs font-black bg-gray-900 text-white hover:bg-black transition-all cursor-pointer shadow-sm"
                >
                  إغلاق النافذة
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* نافذة منح نقاط واعتماد رسمي للعضو */}
        {showAwardModal && (
          <div
            className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            dir="rtl"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAwardModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-gray-900 shadow-2xl text-right relative"
            >
              <button
                type="button"
                onClick={() => setShowAwardModal(false)}
                className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer border-none"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl">
                  🎁
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">
                    منح وتوثيق نقاط رسمية
                  </h3>
                  <p className="text-xs text-gray-500 font-bold mt-0.5">
                    للعضو: <span className="text-gray-900 font-black">{displayedMember.fullName}</span> (@{displayedMember.username})
                  </p>
                </div>
              </div>

              {awardSuccessMsg && (
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-black text-emerald-800 text-center animate-bounce">
                  {awardSuccessMsg}
                </div>
              )}

              <form onSubmit={handleAwardPoints} className="space-y-4">
                {/* 1. تحديد عدد النقاط الممنوحة */}
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-2">
                    اختيار مقدار النقاط:
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-2.5">
                    {[20, 25, 30, 50, 67, 100].map((pts) => (
                      <button
                        key={pts}
                        type="button"
                        onClick={() => setAwardPointsAmount(pts)}
                        className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer font-['Arimo'] ${
                          awardPointsAmount === pts
                            ? 'bg-[#0F172A] text-white border-black shadow-xs scale-102'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        +{pts} نقطة
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 shrink-0">أو إدخال رصيد مخصص:</span>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={awardPointsAmount}
                      onChange={(e) => setAwardPointsAmount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs font-black rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 font-['Arimo'] text-center"
                    />
                  </div>
                </div>

                {/* 2. سبب منح النقاط */}
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-2">
                    سبب الاعتماد (يظهر رسمياً في سجل نقاط العضو):
                  </label>
                  <select
                    value={awardReason}
                    onChange={(e) => setAwardReason(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 mb-2"
                  >
                    <option value="حضور ورشة / لقاء تفاعلي">حضور ورشة / لقاء تفاعلي (+20)</option>
                    <option value="تسليم مهمة / تطبيق عملي معتمد">تسليم مهمة / تطبيق عملي معتمد (+25)</option>
                    <option value="تفاعل ومشاركة مميزة في مسار الويب">تفاعل ومشاركة مميزة في مسار الويب (+67)</option>
                    <option value="إنجاز تحدي إضافي وحل مشكلة برمجية">إنجاز تحدي إضافي وحل مشكلة برمجية (+50)</option>
                    <option value="مكافأة خاصة من القيادة لتميز الأداء">مكافأة خاصة من القيادة لتميز الأداء (+100)</option>
                    <option value="custom">سبب مخصص آخر...</option>
                  </select>

                  {awardReason === 'custom' && (
                    <input
                      type="text"
                      placeholder="اكتب سبب منح النقاط بالتفصيل..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
                      required
                    />
                  )}
                </div>

                {/* 3. توثيق المعتمد */}
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-500">مَن يعتمد النقاط الآن:</span>
                    <span className="font-black text-gray-900">{currentUser.fullName} ({currentUser.role === 'track_leader' ? 'قائدة المسار 👑' : 'نائب القادة 🛡️'})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingAward}
                    className="flex-1 py-3 rounded-2xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer shadow-md disabled:opacity-50 border-none flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    <span>{isSubmittingAward ? 'جاري الاعتماد...' : `تأكيد ومنح +${awardPointsAmount} نقطة ✓`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAwardModal(false)}
                    className="px-5 py-3 rounded-2xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all cursor-pointer border border-gray-200"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
