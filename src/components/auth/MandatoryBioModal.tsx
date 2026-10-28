import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../../types';
import { store } from '../../services/store';
import { Pinwheel } from '../leader/leaderVisuals';
import confetti from 'canvas-confetti';
import { Sparkles, Check, ArrowLeft, User, Award, BookOpen } from 'lucide-react';

interface MandatoryBioModalProps {
  currentUser: UserProfile;
  onBioSaved: () => void;
}

export const MandatoryBioModal: React.FC<MandatoryBioModalProps> = ({
  currentUser,
  onBioSaved,
}) => {
  const [bioText, setBioText] = useState(currentUser.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const charCount = bioText.trim().length;
  const isSatisfied = charCount >= 50;
  const isFemale = currentUser.gender === 'female';
  const firstName = currentUser.fullName.split(' ')[0];

  // مقترحات الجمل الجاهزة لتسهيل الكتابة
  const suggestionChips = [
    'أحب بناء الواجهات والتصاميم التفاعلية الحديثة.',
    'أتعلم من خلال المشاريع والتطبيق العملي المستمر.',
    'أبغى أتقن JavaScript وأطر الويب المتقدمة.',
    'مهتمة بتجربة المستخدم وسرعة وأداء المواقع.',
  ];

  const handleAddChip = (chip: string) => {
    setBioText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return chip;
      if (trimmed.endsWith('.')) return `${trimmed} ${chip}`;
      return `${trimmed}. ${chip}`;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSatisfied) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await store.saveUserBio(currentUser.id, bioText);

      if (currentUser.settings?.celebrations) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#4285F4', '#EA4335', '#34A853', '#F9AB00'],
        });
      }
      setTimeout(() => {
        setIsSubmitting(false);
        onBioSaved();
      }, 500);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'فشل حفظ النبذة في Supabase');
    }
  };

  // حساب النسبة للعداد الدائري (0 إلى 100%)
  const circleProgress = Math.min(100, Math.round((charCount / 50) * 100));
  const circleRadius = 18;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circumference - (circleProgress / 100) * circumference;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ backgroundColor: '#F7F7F4' }}
      role="dialog"
      aria-modal="true"
      aria-label="النبذة التعريفية الإلزامية"
      dir="rtl"
    >
      {/* عناصر الهوية العائمة بهدوء في الخلفية دون تغطية النص */}
      <div
        className="absolute top-6 right-8 pointer-events-none opacity-20"
        style={{ zIndex: 0 }}
      >
        <Pinwheel color="#4285F4" className="w-48 h-48 animate-spin" />
      </div>

      <div
        className="absolute bottom-8 left-8 pointer-events-none opacity-20"
        style={{ zIndex: 0 }}
      >
        <Pinwheel color="#34A853" className="w-56 h-56 animate-spin" />
      </div>

      <div
        className="absolute top-1/3 left-16 pointer-events-none opacity-15 hidden md:block"
        style={{ zIndex: 0 }}
      >
        <svg viewBox="0 0 100 100" className="w-32 h-32 fill-[#F9AB00] animate-pulse">
          <path d="M50 0 L58 35 L95 25 L68 50 L95 75 L58 65 L50 100 L42 65 L5 75 L32 50 L5 25 L42 35 Z" />
        </svg>
      </div>

      {/* الحاوية المركزية: تخطيط عمودين على الحاسوب */}
      <div className="bio-screen-container">
        {/* العمود الأيمن (النموذج): 7 أعمدة */}
        <div
          className="bio-card-form rise"
          style={{
            '--i': 0,
          } as React.CSSProperties}
        >
          {/* شريط التقدم: خطوة 1 من 1 */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
              <span className="text-xs font-bold text-gray-700">خطوة 1 من 1: ملفك الشخصي</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF7E0] text-[#B06000]">
              أول تسجيل دخول ✨
            </span>
          </div>

          {/* الترحيب الكبير بالاسم وتنسيق الجنس */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] leading-tight mb-2">
              أهلًا يا {firstName}، {isFemale ? 'عرّفينا' : 'عرّفنا'} بنفسك
            </h1>
            <p className="text-sm sm:text-base font-medium text-gray-600">
              نبذتك هي بطاقة تعارفك مع القادة وأعضاء المسار.
              <span className="text-xs text-gray-400 block mt-1 font-bold">💡 تلميح: ٢-٣ جمل تكفي لتجاوز ٥٠ حرفًا.</span>
            </p>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {/* مربع كتابة النبذة */}
            <div className="relative">
              <textarea
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                placeholder={
                  isFemale
                    ? 'اكتبي هنا: من أنتِ؟ وش طموحك وشغفك في بناء واجهات وتطبيقات الويب؟...'
                    : 'اكتب هنا: من أنت؟ وش طموحك وشغفك في بناء واجهات وتطبيقات الويب؟...'
                }
                rows={5}
                className="w-full p-4.5 rounded-2xl text-base font-medium leading-relaxed transition-all focus:outline-none text-right resize-none"
                style={{
                  border: isSatisfied ? '2px solid #34A853' : '2px solid #0F172A',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '17px',
                }}
                required
              />

              {/* العداد الدائري سعة 50 حرفًا في زاوية مربع النص */}
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-xs font-bold text-gray-500">
                  {isSatisfied ? (
                    <span className="text-[#34A853] flex items-center gap-1">
                      <Check size={14} className="stroke-[3]" />
                      <span>اكتملت النبذة بنجاح ({charCount} حرفاً)</span>
                    </span>
                  ) : (
                    <span className="text-[#EA4335]">
                      باقي {50 - charCount} حرفاً للحد الأدنى (٥٠ حرف)
                    </span>
                  )}
                </span>

                {/* العداد الدائري SVG */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0F172A]">{charCount}/50</span>
                  <svg className="w-8 h-8 -rotate-90" viewBox="0 0 44 44">
                    <circle
                      cx="22"
                      cy="22"
                      r={circleRadius}
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="4"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r={circleRadius}
                      fill="none"
                      stroke={isSatisfied ? '#34A853' : '#4285F4'}
                      strokeWidth="4"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* أزرار الاقتراح الجاهزة (Chips) لتسهيل الكتابة عند النقر */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">
                أفكار وجمل جاهزة (انقري لإضافتها لنبذتك):
              </label>
              <div className="flex flex-wrap gap-2">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddChip(chip)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer text-right"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* رسالة الخطأ الصريح عند فشل Supabase */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* زر الإكمال بلون #4285F4 ونص داكن #0F172A وحجم أكبر من 17px */}
            <button
              type="submit"
              disabled={!isSatisfied || isSubmitting}
              className="w-full py-4 rounded-2xl font-black text-center cursor-pointer transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-50 disabled:cursor-not-allowed rise"
              style={{
                backgroundColor: '#4285F4',
                color: '#0F172A',
                fontSize: '18px',
                border: '2px solid #0F172A',
                boxShadow: isSatisfied ? '0 6px 0 #0F172A' : 'none',
                '--i': 2,
              } as React.CSSProperties}
            >
              {isSubmitting ? (
                <span>جارِ الحفظ والانطلاق...</span>
              ) : isSatisfied ? (
                <>
                  <span>إكمال وحفظ ملفي والانطلاق للمسار</span>
                  <ArrowLeft size={20} className="stroke-[3]" />
                </>
              ) : (
                <span>اكتبي ٥٠ حرفاً على الأقل للتفعيل ({charCount}/50)</span>
              )}
            </button>
          </form>
        </div>

        {/* العمود الأيسر (بطاقة المعاينة الحية المحدثة فوراً): 5 أعمدة */}
        <div
          className="bio-card-preview rise"
          style={{
            '--i': 1,
          } as React.CSSProperties}
        >
          {/* عنوان رأس بطاقة المعاينة */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <Sparkles size={16} className="text-[#F9AB00]" />
              <span>معاينة حية لملفك الشخصي</span>
            </h3>
            <span className="text-[11px] font-bold text-gray-400">تتحدث وأنتِ تكتبين</span>
          </div>

          {/* الملف الشخصي الحي */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-md mb-3 border-2 border-[#0F172A]"
              style={{ backgroundColor: currentUser.badgeColor || '#4285F4' }}
            >
              {currentUser.avatarLetter || firstName.charAt(0)}
            </div>

            <h2 className="text-xl font-black text-[#0F172A] mb-1">
              {currentUser.fullName}
            </h2>
            <p className="text-xs font-bold text-gray-400 mb-2" dir="ltr">
              @{currentUser.username}
            </p>

            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-blue-50 text-[#4285F4] border border-blue-200">
              {currentUser.roleTitle}
            </span>
          </div>

          {/* محتوى النبذة الحي */}
          <div className="mb-6">
            <span className="text-xs font-bold text-gray-500 block mb-2">النبذة الشخصية:</span>
            <div
              className="p-4 rounded-2xl bg-[#F7F7F4] border border-gray-200 min-h-[90px] text-right text-sm leading-relaxed"
              style={{ color: bioText.trim() ? '#0F172A' : '#94A3B8' }}
            >
              {bioText.trim()
                ? bioText
                : 'اكتبي نبذتك في النموذج على اليمين وستظهر هنا مباشرة في ملفك الرسمي أمام أعضاء المسار والقادة...'}
            </div>
          </div>

          {/* المستوى والمهارات المسجلة */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-gray-500 block mb-1">المرحلة والمستوى:</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {currentUser.webLevelTitle || 'المرحلة 1: التأسيس والتصميم البرمجي'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-500 block mb-1">المهارات المسجلة:</span>
              <div className="flex flex-wrap gap-1.5">
                {(currentUser.skills && currentUser.skills.length > 0
                  ? currentUser.skills
                  : ['HTML', 'CSS', 'JavaScript']
                ).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
