// =============================================================================
// GDG on Campus — Taif University (Web Track Platform 2026)
// التحدي التخصصي | Specialized Challenges (Slides 7 - 15)
// =============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../../types';
import { store } from '../../services/store';
import { isFemaleUser, gText, genderVocab } from '../../utils/gender';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Rocket,
  Lightbulb,
  Palette,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  GitBranch,
  Globe,
  Bot,
  Layers,
  Send,
  Info,
  Check,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface SpecializedChallengeSectionProps {
  currentUser: UserProfile;
}

export interface SpecializedChallenge {
  id: string;
  numberStr: string;
  titleAr: string;
  titleEn: string;
  tagline: string;
  description: string;
  focus: string;
  color: string;
  bgLight: string;
  icon: 'product' | 'creative' | 'redefine';
}

export const SPECIALIZED_CHALLENGES: SpecializedChallenge[] = [
  {
    id: 'challenge-01',
    numberStr: '01',
    titleAr: 'من الفكرة إلى المنتج',
    titleEn: 'Challenge 01 — Idea to Product',
    tagline: 'عندكم فكرة؟ حوّلوها إلى منتج ويب',
    description:
      'اختاروا فكرة من ابتكاركم تعالج احتياجاً حقيقياً، وحددوا الفئة المستهدفة، ثم صمموا وطوّروا منتجكم من البداية إلى النهاية. للفريق حرية اختيار الفكرة والاسم والهوية البصرية وتصميم الواجهات والخصائص وطريقة العمل.',
    focus: 'تحويل الفكرة إلى منتج ويب متكامل، من التخطيط والتصميم إلى التطوير والنشر.',
    color: '#4285F4',
    bgLight: '#EEF4FE',
    icon: 'product',
  },
  {
    id: 'challenge-02',
    numberStr: '02',
    titleAr: 'ويب خارج المألوف',
    titleEn: 'Challenge 02 — Beyond the Ordinary',
    tagline: 'نبي نشوف الويب من منظور مختلف',
    description:
      'ابتكروا تجربة ويب تتميز بطريقة تصميمها أو تفاعلها أو تقديمها للوظائف. يمكن استكشاف الواجهات التفاعلية والأنيميشن وطرق عرض المحتوى وتجارب الاستخدام غير التقليدية، بشرط أن تخدم العناصر فكرة المشروع ووظيفته.',
    focus: 'الإبداع في تجارب ويب تجمع بين التفاعل وجودة التنفيذ وسهولة الاستخدام.',
    color: '#EA4335',
    bgLight: '#FDECEB',
    icon: 'creative',
  },
  {
    id: 'challenge-03',
    numberStr: '03',
    titleAr: 'إعادة تشكيل المألوف',
    titleEn: 'Challenge 03 — Redefine the Ordinary',
    tagline: 'أشياء كثيرة نستخدمها يومياً، لكن هل ممكن تكون لها طريقة أفضل؟',
    description:
      'اختاروا تجربة أو عملية مألوفة، وأعيدوا التفكير في طريقة تنفيذها أو الاستفادة منها، ثم حوّلوها إلى حل رقمي عبر الويب.',
    focus: 'اكتشاف فرص تحسين التجارب المألوفة وتحويلها إلى حلول ويب عملية ومبتكرة.',
    color: '#34A853',
    bgLight: '#E8F6ED',
    icon: 'redefine',
  },
];

export const SpecializedChallengeSection: React.FC<
  SpecializedChallengeSectionProps
> = ({ currentUser }) => {
  const isFemale = isFemaleUser(currentUser);

  // استرجاع التحدي المختار للعضو إن وجد من localStorage
  const userChoiceStorageKey = `webtrack_specialized_choice_${currentUser.id}`;
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    () => {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(userChoiceStorageKey);
    }
  );

  const [activeReqTab, setActiveReqTab] = useState<
    'prd' | 'github_deploy' | 'quality_ai' | 'tools'
  >('prd');

  // نموذج تسليم التحدي التخصصي
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [prdUrl, setPrdUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [teamMembersNote, setTeamMembersNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSelectChallenge = (c: SpecializedChallenge) => {
    setSelectedChallengeId(c.id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(userChoiceStorageKey, c.id);
    }
    if (currentUser.settings?.celebrations) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: [c.color, '#F9AB00', '#0F172A'],
      });
    }
  };

  const handleSubmitSpecializedProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallengeId || !repoUrl.trim() || !projectTitle.trim()) return;

    const chosenChallenge = SPECIALIZED_CHALLENGES.find(
      (c) => c.id === selectedChallengeId
    );
    if (!chosenChallenge) return;

    setIsSubmitting(true);
    setFeedbackMsg('');

    try {
      await store.submitTaskOrChallenge({
        profileId: currentUser.id,
        taskId: `specialized-${chosenChallenge.id}`,
        taskTitle: `التحدي التخصصي: ${chosenChallenge.titleAr} (${projectTitle})`,
        repoUrl: repoUrl.trim(),
        liveUrl: liveUrl.trim() || undefined,
        submissionText: `اسم المشروع: ${projectTitle}\nالتحدي: ${chosenChallenge.titleAr}\nرابط PRD: ${prdUrl.trim() || 'داخل المستودع'}\nالمستودع: ${repoUrl.trim()}${liveUrl ? `\nالمعاينة الحية: ${liveUrl.trim()}` : ''}${teamMembersNote ? `\nبيانات الفريق: ${teamMembersNote.trim()}` : ''}`,
        notes: teamMembersNote.trim() || undefined,
      });

      if (currentUser.settings?.celebrations) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#4285F4', '#EA4335', '#34A853', '#F9AB00'],
        });
      }

      setFeedbackMsg(
        `تم تسليم مشروع التحدي التخصصي «${projectTitle}» بنجاح! سيتم اعتماده بواسطة قائدة المسار ليظهر مباشرة في المعرض العام ويُضاف لرصيد نقاطك ✨`
      );

      setTimeout(() => {
        setIsSubmitting(false);
        setShowSubmitModal(false);
      }, 3000);
    } catch (err: any) {
      setIsSubmitting(false);
      setFeedbackMsg(err?.message || 'تعذّر إرسال التسليم، يرجى المحاولة لاحقاً.');
    }
  };

  const selectedChallenge = SPECIALIZED_CHALLENGES.find(
    (c) => c.id === selectedChallengeId
  );

  return (
    <div className="space-y-8 text-right">
      {/* 1. تنبيه اختيار فرق العمل والتحدي الواحد (مطلوب بالنص) */}
      <div
        className="card-3d-tactile p-5 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-300 flex items-start gap-4"
        style={{ boxShadow: '0 8px 24px rgba(245, 158, 11, 0.12)' }}
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm text-2xl font-black">
          📢
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black mb-1" style={{ color: '#78350F' }}>
            توجيهات هامة بخصوص التحدي التخصصي وفرق العمل
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed font-medium" style={{ color: '#78350F' }}>
            يجب على كل {gText(isFemale, 'عضوة', 'عضو')} اختيار{' '}
            <strong className="font-black underline" style={{ color: '#451A03' }}>تحدٍ تخصصي واحد فقط</strong>{' '}
            من التحديات الثلاثة المطروحة أدناه.
            <br />
            <span className="font-bold" style={{ color: '#451A03' }}>
              📌 تنبيه فرق العمل: سيتاح لكم اختيار فرق العمل لاحقاً وفق آلية التسجيل المعتمدة التي ستعلنها قائدة المجال. حالياً حددوا مسار التحدي للبدء في تحضير الفكرة.
            </span>
          </p>
        </div>
      </div>

      {/* 2. ترويسة التحديات التخصصية */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-blue-600 block mb-1">
            الخطوة الجاية · من التعلّم إلى المنتج
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            التحديات التخصصية (...ثلاثة تحديات تنتظركم)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            الهدف مو موقع وبس — بل تجربة واضحة ومفيدة وقابلة للاستخدام 🚀
          </p>
        </div>

        {selectedChallenge && (
          <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-2xl flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" />
            <span className="text-xs font-black text-green-900">
              {gText(isFemale, 'تحديكِ المختار:', 'تحديكَ المختار:')}{' '}
              {selectedChallenge.titleAr}
            </span>
          </div>
        )}
      </div>

      {/* 3. بطاقات الأيقونات الثلاثة للتحديات التخصصية (سلايدات 7-11) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SPECIALIZED_CHALLENGES.map((challenge) => {
          const isSelected = selectedChallengeId === challenge.id;

          return (
            <motion.div
              key={challenge.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleSelectChallenge(challenge)}
              className="card-3d-tactile p-6 text-right cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '28px',
                border: isSelected
                  ? `3px solid ${challenge.color}`
                  : '2px solid #E2E8F0',
                borderBottom: isSelected
                  ? `7px solid ${challenge.color}`
                  : '5px solid #CBD5E1',
                boxShadow: isSelected
                  ? `0 14px 30px ${challenge.color}25`
                  : '0 6px 16px rgba(15, 23, 42, 0.05)',
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-black text-white shadow-sm flex items-center gap-1"
                  style={{ backgroundColor: challenge.color }}
                >
                  <Check size={12} strokeWidth={3} />
                  <span>تحديك المختار</span>
                </div>
              )}

              <div>
                {/* رمز الأيقونة التخصصي الملون */}
                <div
                  className="mb-4"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: challenge.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 900,
                    boxShadow: `0 8px 16px ${challenge.color}35`,
                  }}
                >
                  {challenge.icon === 'product' && <Rocket size={32} />}
                  {challenge.icon === 'creative' && <Palette size={32} />}
                  {challenge.icon === 'redefine' && <RefreshCw size={32} />}
                </div>

                <div className="text-xs font-black font-mono mb-1" style={{ color: '#64748B' }}>
                  {challenge.titleEn}
                </div>
                <h3 className="text-xl font-black mb-1 leading-snug" style={{ color: '#0F172A' }}>
                  {challenge.titleAr}
                </h3>
                <div
                  className="text-xs font-black mb-3"
                  style={{ color: challenge.color }}
                >
                  «{challenge.tagline}»
                </div>

                <p className="text-xs leading-relaxed font-medium mb-4" style={{ color: '#334155' }}>
                  {challenge.description}
                </p>

                {/* شريط التركيز */}
                <div
                  className="p-3 rounded-xl text-xs font-bold leading-relaxed"
                  style={{
                    backgroundColor: challenge.bgLight,
                    color: '#0F172A',
                    borderRight: `4px solid ${challenge.color}`,
                  }}
                >
                  <b className="block text-[11px] font-black mb-0.5" style={{ color: challenge.color }}>
                    التركيز الأساسي:
                  </b>
                  {challenge.focus}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectChallenge(challenge);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSelected
                    ? '✓ تم اختيار هذا التحدي'
                    : `اختيار ${challenge.titleAr}`}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. زر فتح نموذج التسليم إذا اختار تحدياً */}
      {selectedChallenge && (
        <div
          className="p-6 rounded-3xl text-right flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            backgroundColor: selectedChallenge.bgLight,
            border: `2px solid ${selectedChallenge.color}`,
          }}
        >
          <div>
            <span
              className="text-xs font-black uppercase"
              style={{ color: selectedChallenge.color }}
            >
              جاهزون للتسليم؟
            </span>
            <h4 className="text-lg font-black text-gray-900 mt-0.5">
              تسليم مشروع {selectedChallenge.titleAr}
            </h4>
            <p className="text-xs text-gray-600 font-medium mt-1">
              التسليم النهائي متاح حتى الثلاثاء 24 نوفمبر 2026. التسليم يشمل وثيقة PRD والمستودع والرابط الحي.
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-black text-white shadow-lg hover:opacity-95 transition-all shrink-0 flex items-center gap-2"
            style={{ backgroundColor: selectedChallenge.color }}
          >
            <Send size={16} />
            <span>{genderVocab.submit(isFemale)} مشروع التحدي الآن</span>
          </button>
        </div>
      )}

      {/* 5. عرض متطلبات التسليم بطريقة جميلة (سلايدات 12 إلى 15) */}
      <div
        className="card-3d-tactile p-6 sm:p-8 bg-white rounded-3xl border-2 border-gray-900"
        style={{ borderBottom: '6px solid #0F172A' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">
              دليل متطلبات التسليم والمعايير الرسمية (Delivery Requirements)
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              مراجعة شاملة لجميع متطلبات الاعتماد لضمان حصول مشروعكم على التقييم الكامل ودخوله المعرض العام ✨
            </p>
          </div>

          {/* تبويبات المتطلبات */}
          <div className="flex flex-wrap items-center bg-gray-100 p-1.5 rounded-2xl">
            {[
              { id: 'prd', label: '1. وثيقة PRD', icon: FileText },
              { id: 'github_deploy', label: '2. GitHub والنشر', icon: GitBranch },
              { id: 'quality_ai', label: '3. الجودة والـ AI', icon: Bot },
              { id: 'tools', label: 'التقنيات المقترحة', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveReqTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    activeReqTab === tab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* محتوى تبويب وثيقة PRD (سلايد 13) */}
        {activeReqTab === 'prd' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs font-bold text-blue-900 leading-relaxed">
              تُعد وثيقة متطلبات المنتج (PRD) داخل GitHub بصيغة Markdown (ملف PRD.md) أو أداة توثيق مناسبة، وتتضمن 12 عنصراً مقسمة كالتالي:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* قسم التعريف بالمشروع */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span className="text-xs font-black text-blue-700 block mb-3">
                  التعريف بالمشروع
                </span>
                <ul className="space-y-2 text-xs font-bold text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                      1
                    </span>
                    <span>رقم التحدي المختار</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                      2
                    </span>
                    <span>اسم المشروع</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                      3
                    </span>
                    <span>نبذة عن المشروع وهدفه</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                      4
                    </span>
                    <span>المشكلة والفئة المستهدفة</span>
                  </li>
                </ul>
              </div>

              {/* قسم الفريق والمنتج */}
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100">
                <span className="text-xs font-black text-red-700 block mb-3">
                  الفريق والمنتج
                </span>
                <ul className="space-y-2 text-xs font-bold text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                      5
                    </span>
                    <span>أعضاء الفريق وأدوارهم</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                      6
                    </span>
                    <span>الخصائص الأساسية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                      7
                    </span>
                    <span>سير العمل من البداية للإتمام</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                      8
                    </span>
                    <span>التقنيات والأدوات المستخدمة</span>
                  </li>
                </ul>
              </div>

              {/* قسم الأدوات والروابط */}
              <div className="p-4 rounded-2xl bg-green-50/50 border border-green-100">
                <span className="text-xs font-black text-green-700 block mb-3">
                  الأدوات والروابط
                </span>
                <ul className="space-y-2 text-xs font-bold text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-black">
                      9
                    </span>
                    <span>قواعد البيانات والخدمات الخارجية وسببها</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-black">
                      10
                    </span>
                    <span>أدوات الذكاء الاصطناعي ودور كل منها</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-black">
                      11
                    </span>
                    <span>رابط مستودع GitHub</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-black">
                      12
                    </span>
                    <span>رابط المشروع المنشور Live Demo</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* محتوى تبويب GitHub والنشر (سلايد 14) */}
        {activeReqTab === 'github_deploy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch size={20} className="text-slate-900" />
                <h4 className="text-sm font-black text-slate-900">
                  مستودع GitHub عام (Public Repo)
                </h4>
              </div>
              <ul className="space-y-2 text-xs font-medium text-slate-700 leading-relaxed list-disc list-inside">
                <li>اسم واضح ومعبّر عن المشروع.</li>
                <li>ملف README.md منظم: الفكرة، الهدف، التقنيات، طريقة التشغيل محلياً.</li>
                <li>ذكر أسماء أعضاء الفريق وأدوارهم بوضوح.</li>
                <li>ملفات منظمة وأسماء مجلدات واضحة وهيكل برمجي سليم.</li>
                <li>توثيق مراحل التطوير عبر Git commits واضحة ومنتظمة.</li>
                <li className="text-red-700 font-bold">
                  ⚠️ تنبيه أمني: يمنع رفع كلمات المرور أو مفاتيح API السرية أو البيانات الخاصة.
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={20} className="text-blue-700" />
                <h4 className="text-sm font-black text-blue-900">
                  النشر السحابي المباشر (Deployment)
                </h4>
              </div>
              <ul className="space-y-2 text-xs font-medium text-blue-950 leading-relaxed list-disc list-inside">
                <li>النشر على Vercel أو Netlify أو منصة مناسبة.</li>
                <li>رابط مباشر يعمل بكفاءة ومدرج في README و PRD.</li>
                <li>الوظائف الأساسية للمشروع قابلة للتجربة من قبل أي زائر.</li>
                <li>الخدمات وقواعد البيانات المرتبطة تعمل بشكل كامل دون أخطاء.</li>
              </ul>
            </div>
          </div>
        )}

        {/* محتوى تبويب جودة التنفيذ والذكاء الاصطناعي (سلايد 15) */}
        {activeReqTab === 'quality_ai' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
              <h4 className="text-sm font-black text-amber-950 mb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-700" />
                <span>معايير جودة التنفيذ</span>
              </h4>
              <ul className="space-y-2 text-xs font-medium text-amber-900 leading-relaxed list-disc list-inside">
                <li>مشروع ويب تطبيقي حقيقي قابل للاستخدام وليس مجرد تصميم ثابت.</li>
                <li>وظائف أساسية مكتملة وقابلة للتجربة.</li>
                <li>واجهة متجاوبة تماماً مع الشاشات المختلفة (جوال / أجهزة لوحية / حاسب).</li>
                <li>كود منظم، مقروء، وسهل الفهم والصيانة.</li>
                <li>مساهمات أعضاء الفريق واضحة في سجل الـ Commits.</li>
                <li>تجربة مستخدم مناسبة للهدف ومريحة.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200">
              <h4 className="text-sm font-black text-purple-950 mb-3 flex items-center gap-2">
                <Bot size={18} className="text-purple-700" />
                <span>سياسة توظيف الذكاء الاصطناعي</span>
              </h4>
              <ul className="space-y-2 text-xs font-medium text-purple-900 leading-relaxed list-disc list-inside">
                <li>ذكر المنصات المستخدمة ودور كل منها: بحث، تخطيط، مراجعة، أو مساعدة برمجية.</li>
                <li>الالتزام بسياسة التحدي بشأن الاستخدام المسموح وأخلاقيات التوليد.</li>
                <li>عدم تقديم مخرجات الأدوات كعمل شخصي كامل دون توضيح الشفافية.</li>
                <li>الهدف هو تعزيز الإنتاجية مع فهم الكود المكتوب بالكامل.</li>
              </ul>
            </div>
          </div>
        )}

        {/* محتوى تبويب الأدوات والتقنيات المقترحة (سلايد 12) */}
        {activeReqTab === 'tools' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-center">
                <span className="text-[11px] font-black text-green-700 block mb-1">
                  إدارة الكود
                </span>
                <span className="text-xs font-black text-gray-900">
                  Git & GitHub
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-center">
                <span className="text-[11px] font-black text-red-700 block mb-1">
                  تطوير الويب
                </span>
                <span className="text-xs font-black text-gray-900">
                  React, JS, HTML, CSS
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-[11px] font-black text-blue-700 block mb-1">
                  تصميم الواجهات
                </span>
                <span className="text-xs font-black text-gray-900">
                  Figma & FigJam
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-[11px] font-black text-blue-700 block mb-1">
                  قواعد البيانات
                </span>
                <span className="text-xs font-black text-gray-900">
                  Supabase / Firebase
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[11px] font-black text-amber-700 block mb-1">
                  النشر والاستضافة
                </span>
                <span className="text-xs font-black text-gray-900">
                  Vercel أو Netlify
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium text-center">
              * الأدوات مقترحة ولا يُشترط استخدامها كلها، والاختيار حسب طبيعة فكرة المشروع.
            </p>
          </div>
        )}
      </div>

      {/* 6. نافذة تسليم مشروع التحدي التخصصي المنبثقة */}
      <AnimatePresence>
        {showSubmitModal && selectedChallenge && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !isSubmitting && setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="card-3d-tactile bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-right relative"
              style={{
                borderRadius: '32px',
                border: `3px solid ${selectedChallenge.color}`,
                borderBottom: `8px solid ${selectedChallenge.color}`,
              }}
            >
              <div className="mb-5">
                <span
                  className="text-xs font-black block mb-1"
                  style={{ color: selectedChallenge.color }}
                >
                  تسليم المشروع النهائي · {selectedChallenge.titleAr}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  تسليم التحدي التخصصي ({selectedChallenge.titleEn})
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  يرجى التأكد من استيفاء شروط PRD ومستودع GitHub ورابط التجربة المباشرة Live Demo.
                </p>
              </div>

              {feedbackMsg && (
                <div
                  className={`p-4 rounded-2xl text-xs font-bold mb-4 leading-relaxed ${
                    feedbackMsg.includes('بنجاح')
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {feedbackMsg}
                </div>
              )}

              <form onSubmit={handleSubmitSpecializedProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5">
                    اسم المشروع والمنتج *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="مثال: منصة طويق للخدمات السحابية"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5">
                    رابط وثيقة متطلبات المنتج (PRD) (ملف GitHub أو Notion) *
                  </label>
                  <input
                    type="url"
                    required
                    value={prdUrl}
                    onChange={(e) => setPrdUrl(e.target.value)}
                    placeholder="https://github.com/team/repo/blob/main/PRD.md"
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5">
                    رابط مستودع GitHub العام (Public Repo) *
                  </label>
                  <input
                    type="url"
                    required
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5">
                    رابط النسخة المنشورة Live Demo (Vercel / Netlify) *
                  </label>
                  <input
                    type="url"
                    required
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://project-demo.vercel.app"
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5">
                    أسماء أعضاء الفريق وملاحظات التقديم (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={teamMembersNote}
                    onChange={(e) => setTeamMembersNote(e.target.value)}
                    placeholder="اكتبوا أسماء أعضاء الفريق أو أي ملاحظات توجيهية للقائدة..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setShowSubmitModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !projectTitle.trim() ||
                      !repoUrl.trim() ||
                      !liveUrl.trim()
                    }
                    className="px-6 py-2.5 rounded-xl text-xs font-black text-white hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
                    style={{ backgroundColor: selectedChallenge.color }}
                  >
                    {isSubmitting ? (
                      <span>جارٍ التسليم...</span>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>تأكيد تسليم المشروع النهائي</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
