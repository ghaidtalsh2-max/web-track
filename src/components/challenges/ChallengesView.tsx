import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, ChallengeGroup, ChallengeOption } from '../../types';
import { store } from '../../services/store';
import { Pinwheel } from '../leader/leaderVisuals';
import confetti from 'canvas-confetti';
import {
  Plus,
  Check,
  Clock,
  ExternalLink,
  Code2,
  FolderGit2,
  Lock,
  Sparkles,
  Link as LinkIcon,
  X,
  AlertCircle,
  FileCode2,
} from 'lucide-react';

interface ChallengesViewProps {
  currentUser: UserProfile;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ currentUser }) => {
  const [challengeGroups, setChallengeGroups] = useState<ChallengeGroup[]>(() =>
    store.getChallengeGroups()
  );
  const [workshops] = useState(() => store.getWorkshops());

  const isLeader = currentUser.role === 'track_leader' || currentUser.role === 'supervisor';

  // حالة نموذج إنشاء تحدٍ جديد للقادة
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('none');
  const [newCategory, setNewCategory] = useState<'workshop' | 'side_learn' | 'side_fun' | 'general'>('workshop');
  const [newDueDate, setNewDueDate] = useState('');
  const [newMode, setNewMode] = useState<'mandatory' | 'choice'>('choice');
  const [newOptions, setNewOptions] = useState<
    Array<{ name: string; description: string; requirements: string; points: number }>
  >([
    {
      name: '',
      description: '',
      requirements: '',
      points: 50,
    },
  ]);
  const [createSuccessMsg, setCreateSuccessMsg] = useState('');

  // حالة التسليم للعضو
  const [activeSubmittingGroupId, setActiveSubmittingGroupId] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  const refreshGroups = () => {
    setChallengeGroups(store.getChallengeGroups());
  };

  const handleSelectOption = async (groupId: string, optionId: string) => {
    setActionErrorMsg('');
    try {
      await store.saveMemberChallengeChoice(currentUser.id, groupId, optionId);
      refreshGroups();
    } catch (err: any) {
      setActionErrorMsg(err.message || 'فشل تسجيل اختيار التحدي في Supabase');
    }
  };

  const handleOpenSubmissionForm = (groupId: string) => {
    const choice = store.getMemberChallengeChoice(currentUser.id, groupId);
    if (!choice || !choice.optionId) return;
    setActiveSubmittingGroupId(groupId);
    setRepoUrl(choice.repoUrl || '');
    setLiveUrl(choice.liveUrl || '');
    setSubmissionSuccessMsg('');
    setActionErrorMsg('');
  };

  const handleSubmitChallenge = async (groupId: string) => {
    if (!repoUrl.trim()) return;
    setActionErrorMsg('');

    try {
      await store.submitMemberChallenge(
        currentUser.id,
        groupId,
        repoUrl.trim(),
        liveUrl.trim() || undefined
      );

      if (currentUser.settings?.celebrations) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4285F4', '#34A853', '#F9AB00', '#EA4335'],
        });
      }
      setSubmissionSuccessMsg('تم رفع تسليم التحدي بنجاح وقفل الخيار المختار ✓');
      refreshGroups();
      setTimeout(() => {
        setActiveSubmittingGroupId(null);
        setSubmissionSuccessMsg('');
        setActionErrorMsg('');
      }, 1500);
    } catch (err: any) {
      setActionErrorMsg(err.message || 'فشل تسليم التحدي في Supabase');
    }
  };

  const handleAddOptionField = () => {
    setNewOptions([
      ...newOptions,
      {
        name: '',
        description: '',
        requirements: '',
        points: 50,
      },
    ]);
  };

  const handleRemoveOptionField = (index: number) => {
    if (newOptions.length <= 1) return;
    setNewOptions(newOptions.filter((_, idx) => idx !== index));
  };

  const handleCreateChallengeGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate.trim()) return;

    const linkedWorkshop = workshops.find((w) => w.id === selectedWorkshopId);

    const formattedOptions: ChallengeOption[] = newOptions.map((opt, idx) => ({
      id: `opt-${Date.now()}-${idx}`,
      groupId: '',
      name: opt.name.trim() || `خيار التحدي ${idx + 1}`,
      description: opt.description.trim() || 'وصف ومجال تنفيذ التحدي البرمجي.',
      requirements: opt.requirements.trim() || 'تطبيق عملي واستخدام أفضل ممارسات الويب.',
      points: Number(opt.points) || 50,
    }));

    await store.addChallengeGroup({
      title: newTitle.trim(),
      workshopId: selectedWorkshopId !== 'none' ? selectedWorkshopId : undefined,
      workshopTitle: linkedWorkshop ? linkedWorkshop.title : undefined,
      category: newCategory,
      dueDate: newDueDate.trim(),
      mode: newMode,
      options: formattedOptions,
    });

    setCreateSuccessMsg('تم إنشاء مجموعة التحدي ونشرها لجميع الأعضاء بنجاح ✓');
    setTimeout(() => {
      setCreateModalOpen(false);
      setNewTitle('');
      setSelectedWorkshopId('none');
      setNewDueDate('');
      setNewOptions([{ name: '', description: '', requirements: '', points: 50 }]);
      setCreateSuccessMsg('');
      refreshGroups();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container py-8 sm:py-12 text-right"
      dir="rtl"
    >
      {/* رأس الصفحة مع زر الإنشاء للقادة */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] mb-2">
            التحديات والمهام البرمجية
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-bold">
            التاسكات تُنشأ وتدار هنا حصراً مع إمكانية ربطها بورش العمل والخيارات المتعددة
          </p>
        </div>

        {isLeader && (
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="pill"
            style={{ backgroundColor: '#F9AB00', color: '#0F172A' }}
          >
            <Plus size={18} className="stroke-[3]" />
            <span>+ إنشاء تحدٍّ جديد</span>
          </button>
        )}
      </div>

      {/* نافذة إنشاء تحدٍ جديد للقائد */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#0F172A] text-right max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F9AB00]" />
                  <span>إنشاء مجموعة تحدٍّ جديدة (التاسكات الحصرية)</span>
                </h3>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateChallengeGroup} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    عنوان مجموعة التحدي *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: تحدي ورشة Flexbox و CSS Grid التطبيقي"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      الربط بورشة عمل (اختياري)
                    </label>
                    <select
                      value={selectedWorkshopId}
                      onChange={(e) => setSelectedWorkshopId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none cursor-pointer"
                    >
                      <option value="none">مستقل لا علاقة له بورشة</option>
                      {workshops.map((w) => (
                        <option key={w.id} value={w.id}>
                          تابع لورشة: {w.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      التصنيف *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none cursor-pointer"
                    >
                      <option value="workshop">ورشة عمل</option>
                      <option value="side_learn">جانبي - تعلّم</option>
                      <option value="side_fun">جانبي - متعة</option>
                      <option value="general">عام للمسار</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      الموعد والتسليم النهائي *
                    </label>
                    <input
                      type="text"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      placeholder="مثال: الخميس القادم · ١١:٥٩ مساءً"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      نمط التحدي *
                    </label>
                    <select
                      value={newMode}
                      onChange={(e) => setNewMode(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none cursor-pointer"
                    >
                      <option value="choice">اختيار من خيارات (يختار العضو مساراً واحداً)</option>
                      <option value="mandatory">إلزامي (تاسك واحد يُطلب من الجميع)</option>
                    </select>
                  </div>
                </div>

                {/* خيارات المجموعة (خيارات التحدي) */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-black text-gray-800">
                      خيارات التحدي ({newOptions.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddOptionField}
                      className="text-xs font-bold text-[#4285F4] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={14} />
                      <span>+ إضافة خيار آخر</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-200 relative text-right"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#4285F4]">
                            الخيار {idx + 1}
                          </span>
                          {newOptions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOptionField(idx)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="حذف هذا الخيار"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={opt.name}
                              onChange={(e) => {
                                const copy = [...newOptions];
                                copy[idx].name = e.target.value;
                                setNewOptions(copy);
                              }}
                              placeholder="اسم الخيار (مثال: بناء متجر متجاوب)"
                              className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900"
                              required
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              value={opt.points}
                              onChange={(e) => {
                                const copy = [...newOptions];
                                copy[idx].points = Number(e.target.value);
                                setNewOptions(copy);
                              }}
                              placeholder="النقاط"
                              className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900"
                              required
                            />
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={opt.description}
                          onChange={(e) => {
                            const copy = [...newOptions];
                            copy[idx].description = e.target.value;
                            setNewOptions(copy);
                          }}
                          placeholder="وصف مختصر للخيار وما سيتم بناؤه..."
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 mb-2"
                        />

                        <input
                          type="text"
                          value={opt.requirements}
                          onChange={(e) => {
                            const copy = [...newOptions];
                            copy[idx].requirements = e.target.value;
                            setNewOptions(copy);
                          }}
                          placeholder="ما المطلوب بالتحديد (المتطلبات التقنية المفصلة)..."
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {createSuccessMsg && (
                  <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold text-center">
                    {createSuccessMsg}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="pill"
                    style={{ backgroundColor: '#4285F4', color: '#0F172A' }}
                  >
                    اعتماد ونشر التحدي ✓
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* قائمة مجموعات التحديات */}
      <div className="space-y-10">
        {challengeGroups.map((group, gIdx) => {
          const userChoice = store.getMemberChallengeChoice(currentUser.id, group.id);
          const isSubmitted = userChoice?.submitted;

          // ترجمة التصنيف
          const categoryLabels: Record<string, { text: string; bg: string; color: string }> = {
            workshop: { text: 'ورشة عمل', bg: '#E8F0FE', color: '#1A73E8' },
            side_learn: { text: 'جانبي - تعلّم', bg: '#FEF7E0', color: '#B06000' },
            side_fun: { text: 'جانبي - متعة', bg: '#CEEAD6', color: '#137333' },
            general: { text: 'عام للمسار', bg: '#FCE8E6', color: '#C5221F' },
          };

          const catInfo = categoryLabels[group.category] || categoryLabels.general;

          return (
            <div
              key={group.id}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm text-right border-2 border-[#0F172A] rise"
              style={{ '--i': gIdx } as React.CSSProperties}
            >
              {/* الرأس: شارات التصنيف والورشة والموعد */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-black"
                    style={{ backgroundColor: catInfo.bg, color: catInfo.color }}
                  >
                    {catInfo.text}
                  </span>

                  {group.workshopTitle && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-[#4285F4] border border-blue-200 flex items-center gap-1">
                      <LinkIcon size={12} />
                      <span>تابع لورشة: {group.workshopTitle}</span>
                    </span>
                  )}

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                    {group.mode === 'choice' ? 'اختيار من خيارات' : 'تاسك إلزامي للجميع'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                  <Clock size={14} className="text-[#EA4335]" />
                  <span>الموعد: {group.dueDate}</span>
                </div>
              </div>

              {/* عنوان المجموعة */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-amber-500 text-white flex items-center justify-center shadow-xs shrink-0 border-2 border-[#0F172A]">
                  <Code2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
                    {group.title}
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 font-medium mb-6">
                {group.mode === 'choice'
                  ? 'اختر خياراً واحداً فقط لتنفيذه. يمكنك تعديل اختيارك في أي وقت قبل التسليم، وسيتم قفل الخيار تلقائياً بعد رفع التسليم.'
                  : 'هذا التحدي إلزامي ومطلوب من جميع أعضاء المسار.'}
              </p>

              {actionErrorMsg && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                  ⚠️ {actionErrorMsg}
                </div>
              )}

              {/* شبكة خيارات التحدي كبطاقات تشبه التصويت */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {group.options.map((option, optIdx) => {
                  const isSelected = userChoice?.optionId === option.id;

                  const creativeIcon =
                    optIdx === 0 ? (
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-[#4285F4] shadow-2xs shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                          <line x1="14" y1="4" x2="10" y2="20" stroke="#EA4335" />
                        </svg>
                      </div>
                    ) : optIdx === 1 ? (
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-[#34A853] shadow-2xs shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" fill="#34A853" fillOpacity="0.25" stroke="#34A853" />
                          <rect x="14" y="3" width="7" height="7" stroke="#F9AB00" />
                          <rect x="14" y="14" width="7" height="7" fill="#F9AB00" fillOpacity="0.25" stroke="#F9AB00" />
                          <rect x="3" y="14" width="7" height="7" stroke="#4285F4" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-[#F9AB00] shadow-2xs shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="#F9AB00" stroke="#0F1729" strokeWidth="1.5" />
                        </svg>
                      </div>
                    );

                  return (
                    <div
                      key={option.id}
                      onClick={() => {
                        if (!isSubmitted) {
                          handleSelectOption(group.id, option.id);
                        }
                      }}
                      className={`p-5 rounded-2xl border-2 transition-all text-right flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#34A853] bg-emerald-50/40 shadow-sm'
                          : 'border-gray-200 bg-gray-50/60 hover:border-gray-300'
                      } ${!isSubmitted ? 'cursor-pointer hover:translate-y-[-2px]' : 'cursor-default'}`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-3 min-w-0">
                            {creativeIcon}
                            <div className="min-w-0">
                              <h3 className="text-sm font-black text-[#0F172A] leading-tight truncate">
                                {option.name}
                              </h3>
                              <span className="text-[11px] font-bold text-gray-500">
                                خيار التحدي #{optIdx + 1}
                              </span>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs shrink-0">
                            +{option.points} نقطة
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 font-medium mb-3 leading-relaxed">
                          {option.description}
                        </p>

                        <div className="p-3 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 mb-3">
                          <b className="text-gray-900 block mb-1">المطلوب بالتحديد:</b>
                          <span>{option.requirements}</span>
                        </div>
                      </div>

                      {/* زر / مؤشر الاختيار */}
                      <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                        {isSelected ? (
                          <div className="flex items-center gap-1.5 text-xs font-black text-[#34A853]">
                            <Check size={16} className="stroke-[3]" />
                            <span>
                              {isSubmitted ? 'خيارك المعتمد (مقفل بعد التسليم)' : 'خيارك المختار حالياً'}
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={isSubmitted}
                            className="text-xs font-bold text-gray-500 hover:text-[#4285F4] transition-colors disabled:opacity-40"
                          >
                            {isSubmitted ? 'مغلق' : 'اختر هذا المسار للتحدي ←'}
                          </button>
                        )}

                        {isSubmitted && isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                            <Lock size={12} />
                            <span>مقفل</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* صندوق التسليم ورفع العمل */}
              <div className="p-5 rounded-2xl bg-[#F7F7F4] border border-gray-200">
                {isSubmitted ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-bold">
                    <div className="flex items-center gap-2 text-[#34A853]">
                      <Check size={18} className="stroke-[3]" />
                      <span>تم تسليم هذا التحدي بنجاح وهو قيد المراجعة والتدقيق بواسطة القادة ✓</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {userChoice?.repoUrl && (
                        <a
                          href={userChoice.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-full bg-white border border-gray-300 text-gray-800 flex items-center gap-1 hover:bg-gray-100"
                        >
                          <FolderGit2 size={13} />
                          <span>الكود (GitHub)</span>
                        </a>
                      )}
                      {userChoice?.liveUrl && (
                        <a
                          href={userChoice.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-full bg-white border border-gray-300 text-[#4285F4] flex items-center gap-1 hover:bg-gray-100"
                        >
                          <ExternalLink size={13} />
                          <span>معاينة حية</span>
                        </a>
                      )}
                    </div>
                  </div>
                ) : userChoice?.optionId ? (
                  <div>
                    {activeSubmittingGroupId === group.id ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-black text-gray-900">
                            رفع تسليم الخيار المختار:
                          </h4>
                          <button
                            type="button"
                            onClick={() => setActiveSubmittingGroupId(null)}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            إلغاء
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-gray-700 block mb-1">
                              رابط مستودع الكود (GitHub Repo) *
                            </label>
                            <input
                              type="url"
                              value={repoUrl}
                              onChange={(e) => setRepoUrl(e.target.value)}
                              placeholder="https://github.com/..."
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-300 text-left"
                              dir="ltr"
                              required
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-gray-700 block mb-1">
                              رابط المعاينة الحية (GitHub Pages / Vercel)
                            </label>
                            <input
                              type="url"
                              value={liveUrl}
                              onChange={(e) => setLiveUrl(e.target.value)}
                              placeholder="https://...github.io"
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-300 text-left"
                              dir="ltr"
                            />
                          </div>
                        </div>

                        {actionErrorMsg && (
                          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                            ⚠️ {actionErrorMsg}
                          </div>
                        )}

                        {submissionSuccessMsg && (
                          <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold text-center">
                            {submissionSuccessMsg}
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleSubmitChallenge(group.id)}
                            className="pill"
                            style={{ backgroundColor: '#4285F4', color: '#0F172A' }}
                          >
                            تأكيد التسليم وقفل الخيار المختار ✓
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-xs font-bold text-gray-700">
                          لقد اخترت مسار هذا التحدي. هل انتهيت من بناء مشروعك؟
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenSubmissionForm(group.id)}
                          className="pill"
                          style={{ backgroundColor: '#F9AB00', color: '#0F172A' }}
                        >
                          رفع تسليم المشروع للتحدي ←
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 font-bold text-center">
                    الرجاء اختيار أحد الخيارات أعلاه للبدء بالتحدي وتفعيل استمارة التسليم.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
