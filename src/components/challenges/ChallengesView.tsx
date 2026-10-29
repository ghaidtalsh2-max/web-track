import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, ChallengeGroup, ChallengeOption } from '../../types';
import { store } from '../../services/store';
import confetti from 'canvas-confetti';
import {
  Plus,
  Check,
  Clock,
  ExternalLink,
  Code2,
  Lock,
  Sparkles,
  X,
  FileCode2,
  Layers,
  Layout,
  Trophy,
} from 'lucide-react';

interface ChallengesViewProps {
  currentUser: UserProfile;
}

type FilterCategory = 'all' | 'workshop' | 'side_fun' | 'side_learn' | 'general';

interface ChallengeCardModel {
  groupId: string;
  optionId: string;
  title: string;
  groupTitle: string;
  category: 'workshop' | 'side_fun' | 'side_learn' | 'general';
  workshopTitle?: string;
  dueDate: string;
  mode: 'mandatory' | 'choice';
  points: number;
  description: string;
  requirements: string;
  iconSymbol: string;
  iconBg: string;
  iconColor: string;
  optionLabel: string;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ currentUser }) => {
  const [challengeGroups, setChallengeGroups] = useState<ChallengeGroup[]>(() =>
    store.getChallengeGroups()
  );
  const [workshops] = useState(() => store.getWorkshops());
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  const isLeader = currentUser.role === 'track_leader' || currentUser.role === 'supervisor';

  // التحدي المفتوح حالياً في النافذة المنبثقة
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeCardModel | null>(null);

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
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshGroups = () => {
    setChallengeGroups(store.getChallengeGroups());
  };

  // تفكيك مجموعات التحديات إلى بطاقات أيقونات فردية مثل الرحلة التعليمية تماماً
  const allChallengeCards: ChallengeCardModel[] = challengeGroups.flatMap((group) => {
    return group.options.map((opt, optIdx) => {
      let iconSymbol = 'CSS';
      let iconBg = '#34A853';
      let iconColor = '#FFFFFF';

      if (opt.name.includes('Grid') || opt.name.includes('متجر')) {
        iconSymbol = 'GRID';
        iconBg = '#34A853';
      } else if (opt.name.includes('داشبورد') || opt.name.includes('Dashboard')) {
        iconSymbol = 'UI';
        iconBg = '#4285F4';
      } else if (opt.name.includes('زر') || opt.name.includes('Micro')) {
        iconSymbol = 'FX';
        iconBg = '#F9AB00';
        iconColor = '#0F1729';
      } else if (opt.name.includes('HTML')) {
        iconSymbol = 'HTML';
        iconBg = '#EA4335';
      } else if (opt.name.includes('JS') || opt.name.includes('JavaScript')) {
        iconSymbol = 'JS';
        iconBg = '#F9AB00';
        iconColor = '#0F1729';
      } else {
        iconSymbol = `0${optIdx + 1}`;
        iconBg = optIdx % 2 === 0 ? '#4285F4' : '#34A853';
      }

      return {
        groupId: group.id,
        optionId: opt.id,
        title: opt.name,
        groupTitle: group.title,
        category: group.category,
        workshopTitle: group.workshopTitle,
        dueDate: group.dueDate,
        mode: group.mode,
        points: opt.points,
        description: opt.description,
        requirements: opt.requirements,
        iconSymbol,
        iconBg,
        iconColor,
        optionLabel: `خيار #${optIdx + 1}`,
      };
    });
  });

  const filteredCards = allChallengeCards.filter((c) => {
    if (activeCategory === 'all') return true;
    return c.category === activeCategory;
  });

  const handleOpenCard = (card: ChallengeCardModel) => {
    setSelectedChallenge(card);
    const choice = store.getMemberChallengeChoice(currentUser.id, card.groupId);
    setRepoUrl(choice?.repoUrl || '');
    setLiveUrl(choice?.liveUrl || '');
    setSubmissionSuccessMsg(choice?.submitted ? 'تم تسليم هذا التحدي مسبقاً بنجاح ✓' : '');
    setActionErrorMsg('');
  };

  const handleSelectAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge || !repoUrl.trim()) return;
    setIsSubmitting(true);
    setActionErrorMsg('');

    try {
      // 1. حفظ الاختيار
      await store.saveMemberChallengeChoice(currentUser.id, selectedChallenge.groupId, selectedChallenge.optionId);
      // 2. رفع التسليم
      await store.submitMemberChallenge(
        currentUser.id,
        selectedChallenge.groupId,
        repoUrl.trim(),
        liveUrl.trim() || undefined
      );

      if (currentUser.settings?.celebrations) {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4285F4', '#34A853', '#F9AB00', '#EA4335'],
        });
      }

      setSubmissionSuccessMsg('تم رفع وتسليم التحدي للاعتماد بنجاح! 🚀');
      refreshGroups();
      setTimeout(() => {
        setSelectedChallenge(null);
        setSubmissionSuccessMsg('');
      }, 1400);
    } catch (err: any) {
      setActionErrorMsg(err.message || 'فشل تسليم التحدي، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateChallengeGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate.trim()) return;

    const linkedWorkshop = workshops.find((w) => w.id === selectedWorkshopId);

    const formattedOptions: ChallengeOption[] = newOptions.map((opt, idx) => ({
      id: `opt-${Date.now()}-${idx}`,
      groupId: '',
      name: opt.name.trim() || `خيار التحدي #${idx + 1}`,
      description: opt.description.trim() || 'وصف التحدي والمتطلبات التقنية.',
      requirements: opt.requirements.trim() || 'المطلوب بالتحديد والتنفيذ البرمجي.',
      points: Number(opt.points) || 50,
    }));

    try {
      await store.createChallengeGroup({
        title: newTitle.trim(),
        workshopId: selectedWorkshopId !== 'none' ? selectedWorkshopId : undefined,
        workshopTitle: linkedWorkshop ? linkedWorkshop.title : undefined,
        category: newCategory,
        dueDate: newDueDate.trim(),
        mode: newMode,
        options: formattedOptions,
      });

      setCreateSuccessMsg('تم إنشاء مجموعة التحديات بنجاح!');
      refreshGroups();
      setTimeout(() => {
        setCreateModalOpen(false);
        setCreateSuccessMsg('');
        setNewTitle('');
        setNewDueDate('');
        setNewOptions([{ name: '', description: '', requirements: '', points: 50 }]);
      }, 1000);
    } catch (err: any) {
      console.error(err);
    }
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
      {/* رأس الصفحة مطابق للرحلة التعليمية */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F9AB00] animate-pulse" />
            <span className="text-xs font-bold text-gray-500">مسار الويب · التحديات والمهام البرمجية الحصرية</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            التحديات والمهام البرمجية
          </h1>
        </div>

        {isLeader && (
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-full text-xs font-black text-white bg-[#0F1729] hover:bg-gray-800 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer border-none"
          >
            <Plus size={16} />
            <span>+ إنشاء تحدٍ جديد</span>
          </button>
        )}
      </div>

      {/* شريط الفلاتر مطابق لتبويب المرحلة التعليمية */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'workshop', label: 'تحديات الورش' },
          { id: 'side_fun', label: 'تحديات جانبية - متعة' },
          { id: 'side_learn', label: 'تحديات جانبية - تعلّم' },
          { id: 'general', label: 'تحديات عامة' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer border-2 ${
              activeCategory === cat.id
                ? 'bg-[#0F1729] text-white border-[#0F1729] shadow-md -translate-y-0.5'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* شبكة بطاقات الأيقونات المطابقة لتبويب المرحلة التعليمية (cards-grid-4) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {filteredCards.map((c) => {
          const userChoice = store.getMemberChallengeChoice(currentUser.id, c.groupId);
          const isSelected = userChoice?.optionId === c.optionId;
          const isSubmitted = isSelected && userChoice?.submitted;

          return (
            <button
              key={`${c.groupId}-${c.optionId}`}
              type="button"
              onClick={() => handleOpenCard(c)}
              className="card-3d-tactile p-5 sm:p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-3 text-right w-full"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: isSelected ? '2.5px solid #34A853' : '2px solid #0F1729',
                boxShadow: isSelected
                  ? '0 8px 0 0 #34A853'
                  : '0 6px 0 0 #0F1729',
              }}
            >
              {/* صندوق الأيقونة الملونة الكبيرة المطابق للرحلة التعليمية */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: c.iconSymbol.length > 2 ? '0.95rem' : '1.25rem',
                  fontWeight: 900,
                  color: c.iconColor,
                  backgroundColor: c.iconBg,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  border: '2px solid #0F1729',
                }}
              >
                {c.iconSymbol}
              </div>

              {/* عنوان التحدي ومعلومات النقاط */}
              <div className="w-full text-center my-auto">
                <span className="text-[10px] font-black uppercase tracking-wider block text-gray-400 mb-1">
                  {c.category === 'workshop' ? 'تحدي ورشة 💻' : 'تحدي إبداعي ⚡'}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-gray-900 leading-snug line-clamp-2">
                  {c.title}
                </h3>
              </div>

              {/* الشارات السفلية: النقاط والحالة */}
              <div className="w-full pt-2 border-t border-gray-100 flex items-center justify-between gap-1 text-[11px] font-bold">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 font-black">
                  +{c.points} نقطة
                </span>

                {isSubmitted ? (
                  <span className="text-emerald-700 font-black flex items-center gap-1">
                    <Check size={12} />
                    <span>تم التسليم</span>
                  </span>
                ) : isSelected ? (
                  <span className="text-blue-700 font-black">مختار 📌</span>
                ) : (
                  <span className="text-gray-400 font-medium">عرض التحدي</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* نافذة تفاصيل التحدي والتسليم عند النقر على أيقونة التحدي */}
      <AnimatePresence>
        {selectedChallenge && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-2 border-[#0F1729] shadow-2xl text-right max-h-[90vh] overflow-y-auto"
            >
              {/* الرأس */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      color: selectedChallenge.iconColor,
                      backgroundColor: selectedChallenge.iconBg,
                      border: '2px solid #0F1729',
                    }}
                  >
                    {selectedChallenge.iconSymbol}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-950">
                      {selectedChallenge.title}
                    </h3>
                    <span className="text-xs font-bold text-gray-500">
                      {selectedChallenge.groupTitle} · موعد التسليم: {selectedChallenge.dueDate}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedChallenge(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer border-none bg-transparent"
                >
                  <X size={18} />
                </button>
              </div>

              {/* تفاصيل التحدي والمتطلبات */}
              <div className="space-y-4 mb-6 text-right">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <span className="text-xs font-black text-gray-800 block mb-1">
                    وصف التحدي:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                    {selectedChallenge.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs font-black text-amber-950 block mb-1">
                    المطلوب بالتحديد:
                  </span>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                    {selectedChallenge.requirements}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-950">
                  <span>المكافأة عند الاعتماد:</span>
                  <span className="font-black text-blue-700">+{selectedChallenge.points} نقطة لرصيدك</span>
                </div>
              </div>

              {/* نموذج التسليم */}
              <form onSubmit={handleSelectAndSubmit} className="space-y-3 pt-3 border-t border-gray-100">
                <div>
                  <label className="text-xs font-black text-gray-800 block mb-1">
                    رابط مستودع الكود (GitHub Repo URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                    dir="ltr"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs text-left focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-gray-800 block mb-1">
                    رابط المعاينة المباشرة (Live Demo - Vercel / GitHub Pages) - اختياري
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://project.vercel.app"
                    dir="ltr"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs text-left focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {actionErrorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 text-center">
                    {actionErrorMsg}
                  </div>
                )}

                {submissionSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 text-center">
                    {submissionSuccessMsg}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedChallenge(null)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer border-none bg-transparent"
                  >
                    إغلاق
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !repoUrl.trim()}
                    className="px-7 py-2.5 rounded-full text-xs font-black text-white bg-[#0F1729] hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md cursor-pointer border-none"
                  >
                    {isSubmitting ? 'جارِ التسليم...' : 'اختيار وتسليم التحدي ✓'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة إنشاء تحدٍ جديد للقادة */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#0F1729] text-right max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
                <h3 className="text-lg font-black text-gray-950 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F9AB00]" />
                  <span>إنشاء مجموعة تحدٍ جديدة</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer border-none bg-transparent"
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

                <div className="grid grid-cols-2 gap-3">
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
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <label className="text-xs font-black text-gray-800 block mb-2">
                    تفاصيل خيار التحدي
                  </label>
                  <input
                    type="text"
                    value={newOptions[0].name}
                    onChange={(e) => {
                      const copy = [...newOptions];
                      copy[0].name = e.target.value;
                      setNewOptions(copy);
                    }}
                    placeholder="اسم الخيار (مثال: بناء متجر متجاوب)"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 mb-2"
                    required
                  />
                  <input
                    type="text"
                    value={newOptions[0].description}
                    onChange={(e) => {
                      const copy = [...newOptions];
                      copy[0].description = e.target.value;
                      setNewOptions(copy);
                    }}
                    placeholder="وصف مختصر للخيار..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 mb-2"
                  />
                  <input
                    type="text"
                    value={newOptions[0].requirements}
                    onChange={(e) => {
                      const copy = [...newOptions];
                      copy[0].requirements = e.target.value;
                      setNewOptions(copy);
                    }}
                    placeholder="المطلوب بالتحديد بالتفصيل..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300"
                    required
                  />
                </div>

                {createSuccessMsg && (
                  <div className="p-3 rounded-xl bg-green-50 text-green-700 text-xs font-bold text-center border border-green-200">
                    {createSuccessMsg}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700 cursor-pointer border-none"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full text-xs font-black bg-[#4285F4] text-white cursor-pointer border-none shadow-sm"
                  >
                    اعتماد ونشر التحدي ✓
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
