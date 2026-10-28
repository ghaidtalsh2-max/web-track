import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, MemberSkillItem, BadgeItem, UserStats } from '../../types';
import { store } from '../../services/store';
import { UserAvatar } from '../common/UserAvatar';
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
  const isStaff = currentUser.role === 'track_leader' || currentUser.role === 'supervisor';

  // البحث والفلترة في دليل الأعضاء
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredMembers = allMembers.filter((m) => {
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
        /* ================= صفحة الملف الشخصي الشاملة ================= */
        <>
          {/* 1. بطاقة الهوية الأساسية للعضو */}
          <div
            className="p-6 sm:p-8 rounded-3xl card-navy mb-8 bg-white relative overflow-hidden"
            style={{
              border: '2.5px solid #0F1729',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
            }}
          >
            {/* زخرفة خفيفة بهوية قوقل في الزاوية */}
            <div className="absolute top-0 left-0 w-32 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#F9AB00]" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* تفاصيل العضو والصورة */}
              <div className="flex items-start sm:items-center gap-5 sm:gap-6 flex-wrap sm:flex-nowrap">
                <UserAvatar
                  letter={displayedMember.avatarLetter}
                  name={displayedMember.fullName}
                  avatarUrl={displayedMember.avatarUrl}
                  color={displayedMember.badgeColor}
                  size="xl"
                  role={displayedMember.role}
                  showBadge
                  className="shadow-md"
                />

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                      {displayedMember.fullName}
                    </h1>
                    <span className="badge-pill bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      @{displayedMember.username}
                    </span>
                    <span className="badge-pill bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                      {displayedMember.roleTitle}
                    </span>
                    {displayedMember.webLevel === 'advanced' ? (
                      <span className="badge-pill bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                        مستوى الاستبيان: متقدم ⭐
                      </span>
                    ) : displayedMember.webLevel === 'intermediate' ? (
                      <span className="badge-pill bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                        مستوى الاستبيان: متوسط ⚡
                      </span>
                    ) : (
                      <span className="badge-pill bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                        مستوى الاستبيان: مبتدئ 🌱
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap mt-2.5 text-xs text-gray-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={15} className="text-[#4285F4]" />
                      <span>{displayedMember.major || 'علوم حاسب'} · المستوى الدراسي: <strong className="text-gray-900 font-bold">{displayedMember.academicYear || 'غير محدد'}</strong></span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar size={15} className="text-gray-400" />
                      <span>انضم في: {displayedMember.onboarded_at ? new Date(displayedMember.onboarded_at).toLocaleDateString('ar-SA') : 'أكتوبر 2026'}</span>
                    </span>

                    {/* حماية خصوصية رقم الجوال */}
                    <span className="flex items-center gap-1.5">
                      <Phone size={14} className="text-emerald-600" />
                      {isViewingSelf || isStaff ? (
                        <span className="font-bold text-gray-800 font-mono" dir="ltr">
                          {displayedMember.phone || 'لم يُحدد بعد'}
                        </span>
                      ) : (
                        <span className="text-gray-400 flex items-center gap-1 text-[11px] font-bold">
                          <Lock size={12} />
                          <span>خاص ومحمي</span>
                        </span>
                      )}
                    </span>
                  </div>

                  {/* النبذة التعريفية */}
                  {displayedMember.bio ? (
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-3 max-w-2xl bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                      {displayedMember.bio}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 italic mt-3">
                      لم تتم إضافة نبذة شخصية بعد.
                    </p>
                  )}
                </div>
              </div>

              {/* بطاقة النقاط وزر تعديل الملف */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                <div className="text-right sm:text-left lg:text-left">
                  <div className="text-4xl sm:text-5xl font-black text-[#34A853] tracking-tight leading-none">
                    {displayedMember.points}
                  </div>
                  <div className="text-xs font-bold text-gray-500 mt-1">
                    نقطة إنجاز مسجلة
                  </div>
                </div>

                {/* زر التعديل لصاحب الحساب فقط */}
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
                    className="px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-900 bg-white border-2 border-[#0F1729] hover:bg-gray-50 shadow-xs transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 size={15} />
                    <span>تعديل الملف الشخصي</span>
                  </button>
                )}
              </div>
            </div>

            {/* شريط التقدم نحو المستوى التالي */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-2">
                <span>
                  المستوى الحالي: <strong className="text-blue-600">{displayedMember.webLevelTitle}</strong>
                </span>
                <span>
                  {displayedMember.points} / {targetPointsForNext} نقطة ({levelProgressPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div
                  className="h-full bg-gradient-to-l from-[#34A853] to-[#4285F4] rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. المؤشرات المستقلة الأربعة (KPI Metrics) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* 1. الورش المكتملة */}
            <div
              className="p-5 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs flex flex-col justify-between"
              style={{ minHeight: '125px' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">الورش المكتملة</span>
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#4285F4] flex items-center justify-center">
                  <BookOpen size={16} />
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 mt-2">
                {userStats.workshopsCompleted}
              </div>
              <span className="text-[11px] text-gray-400 font-medium">ورشة تدريبية عملية</span>
            </div>

            {/* 2. التحديات المنجزة */}
            <div
              className="p-5 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs flex flex-col justify-between"
              style={{ minHeight: '125px' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">التحديات المنجزة</span>
                <span className="w-8 h-8 rounded-xl bg-amber-50 text-[#F9AB00] flex items-center justify-center">
                  <Terminal size={16} />
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 mt-2">
                {userStats.challengesCompleted}
              </div>
              <span className="text-[11px] text-gray-400 font-medium">تحدي كود ومختبر الويب</span>
            </div>

            {/* 3. المشاريع المعتمدة */}
            <div
              className="p-5 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs flex flex-col justify-between"
              style={{ minHeight: '125px' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">المشاريع المعتمدة</span>
                <span className="w-8 h-8 rounded-xl bg-green-50 text-[#34A853] flex items-center justify-center">
                  <Code2 size={16} />
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 mt-2">
                {userStats.projectsCompleted}
              </div>
              <span className="text-[11px] text-gray-400 font-medium">مشروع برمجي مكتمل</span>
            </div>

            {/* 4. المبادرات والمشاركات */}
            <div
              className="p-5 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs flex flex-col justify-between"
              style={{ minHeight: '125px' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">المشاركات والمبادرات</span>
                <span className="w-8 h-8 rounded-xl bg-red-50 text-[#EA4335] flex items-center justify-center">
                  <HeartHandshake size={16} />
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 mt-2">
                {userStats.initiativesCount}
              </div>
              <span className="text-[11px] text-gray-400 font-medium">تفاعل مجتمعي واستبيانات</span>
            </div>
          </div>

          {/* 3. قسم المهارات التقنية + قسم الإنجازات والشارات */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* صندوق المهارات التقنية */}
            <div
              className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Shield size={20} className="text-[#4285F4]" />
                    <span>المهارات التقنية</span>
                  </h2>
                  <span className="text-xs font-bold text-gray-400">
                    {skillsList.length} مهارة مسجلة
                  </span>
                </div>

                {/* قائمة المهارات مع التمييز الواضح */}
                <div className="flex flex-col gap-4">
                  {skillsList.map((skill, idx) => {
                    const isApproved = skill.source === 'approved_by_leader';
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          {isApproved ? (
                            <span
                              className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs"
                              title="معتمدة رسمياً من قادة المسار"
                            >
                              🛡️
                            </span>
                          ) : (
                            <span
                              className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs"
                              title="أضافها العضو ذاتياً"
                            >
                              ✍️
                            </span>
                          )}
                          <div>
                            <span className="font-bold text-xs text-gray-900">
                              {skill.name}
                            </span>
                            <div className="text-[10px] text-gray-500 font-medium">
                              {isApproved ? 'معتمدة من قادة المسار' : 'أضافها العضو'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                              isApproved
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {skill.progressPercent}%
                          </span>

                          {/* زر حذف المهارة الشخصية لصاحب الحساب فقط */}
                          {isViewingSelf && !isApproved && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill.name)}
                              className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer"
                              title="حذف المهارة"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* إضافة مهارة شخصية لصاحب الحساب */}
                {isViewingSelf && (
                  <form onSubmit={handleAddSkill} className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="أضف مهارة شخصية (مثال: React, Tailwind)..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={isAddingSkill || !newSkillName.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#4285F4] hover:bg-blue-600 disabled:opacity-50 transition-colors border-none cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={14} />
                      <span>إضافة</span>
                    </button>
                  </form>
                )}
              </div>

              <div className="text-[11px] text-gray-400 font-medium mt-6 pt-3 border-t border-gray-100 flex items-center gap-1.5">
                <Info size={13} className="text-blue-500 flex-shrink-0" />
                <span>المهارات المعتمدة تُمنح تلقائياً عند اعتماد المشاريع من قبل قادة المسار.</span>
              </div>
            </div>

            {/* صندوق الإنجازات والشارات */}
            <div
              className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Trophy size={20} className="text-[#F9AB00]" />
                    <span>الإنجازات والشارات</span>
                  </h2>
                  <span className="text-xs font-bold text-gray-400">
                    {userBadges.length} شارات مكتسبة
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {userBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3 relative overflow-hidden"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                        {getBadgeIcon(badge.iconName)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-xs text-gray-900">
                          {badge.name}
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium mt-0.5 leading-tight">
                          {badge.description}
                        </div>
                        <div className="text-[10px] text-blue-600 font-bold mt-1">
                          {badge.reason}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-gray-400 font-medium mt-6 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span>تُمنح الشارات آلياً بناءً على إنجازاتك في المنصة.</span>
                <span className="text-emerald-600 font-bold">نظام الشارات نشط ✨</span>
              </div>
            </div>
          </div>

          {/* 4. قسم المشاريع المعتمدة */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Code2 size={20} className="text-[#34A853]" />
                  <span>مشاريع وتطبيقات العضو</span>
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  المشاريع البرمجية التي عمل عليها وسلّم روابطها في المسار
                </p>
              </div>

              <a
                href="/?tab=showcase"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>معرض المشاريع العام</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {userSubmissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userSubmissions.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-black text-gray-900">
                          {sub.taskTitle || 'مشروع مسار الويب'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sub.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status === 'approved' ? 'معتمد ✅' : 'قيد المراجعة'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                        {sub.notes || 'مشروع تطبيقي يجسد المهارات المكتسبة في مسار الويب.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                      {sub.repoUrl && (
                        <a
                          href={sub.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-gray-800 hover:text-black flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-xl"
                        >
                          <FolderGit2 size={13} />
                          <span>الكود</span>
                        </a>
                      )}
                      {sub.liveUrl && (
                        <a
                          href={sub.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl"
                        >
                          <ExternalLink size={13} />
                          <span>معاينة حية</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-gray-50 border border-dashed border-gray-300 text-center text-xs text-gray-500">
                لم يتم تسليم مشاريع معتمدة بعد في هذا الملف.
              </div>
            )}
          </div>
        </>
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
      </AnimatePresence>
    </motion.div>
  );
};
