import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { PinwheelFlower } from '../brand/PinwheelFlower';
import { store } from '../../services/store';
import confetti from 'canvas-confetti';

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

  const charCount = bioText.trim().length;
  const isSatisfied = charCount >= 50;
  const isFemale = currentUser.gender === 'female';
  const firstName = currentUser.fullName.split(' ')[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSatisfied) return;

    setIsSubmitting(true);
    const success = store.saveUserBio(currentUser.id, bioText);

    if (success) {
      if (currentUser.settings?.celebrations) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4285F4', '#EA4335', '#34A853', '#F9AB00'],
        });
      }
      setTimeout(() => {
        setIsSubmitting(false);
        onBioSaved();
      }, 400);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'var(--bg-canvas)' }}
      role="dialog"
      aria-modal="true"
      aria-label="النبذة التعريفية الإلزامية"
    >
      {/* 1. أقراص الوردة الرسمية بالزوايا مطابقة لصفحة 13 */}
      <div
        className="absolute -top-12 -left-12 md:top-8 md:left-12 pointer-events-none float-gentle"
        style={{ zIndex: 1 }}
      >
        <PinwheelFlower variant="disc" color="yellow" size={190} animate={true} />
      </div>

      <div
        className="absolute -bottom-12 -right-8 md:bottom-8 md:right-16 pointer-events-none float-gentle"
        style={{ zIndex: 1, animationDelay: '1.5s' }}
      >
        <PinwheelFlower variant="disc" color="green" size={170} animate={true} />
      </div>

      {/* 2. البطاقة المركزية المعتمدة (صفحة 13) */}
      <div
        className="w-full max-w-2xl relative z-10 p-6 sm:p-10 card-navy text-right"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '32px',
          border: '2px solid #0F1729',
          boxShadow: '0 16px 48px rgba(15, 23, 41, 0.08)',
        }}
      >
        {/* شارة أول دخول بالزاوية */}
        <div className="flex items-center justify-start mb-4">
          <span
            className="px-3.5 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: '#FEF7E0',
              color: '#8A5A00',
            }}
          >
            أول دخول
          </span>
        </div>

        {/* عنوان النبذة */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-1.5">
            قبل نبدأ، {isFemale ? 'عرّفينا' : 'عرّفنا'} بنفسك يا {firstName}
          </h1>
          <p className="text-sm sm:text-base font-medium text-gray-600">
            النبذة مطلوبة لإكمال حسابك، وتظهر في ملفك الشخصي.
          </p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {/* مربع كتابة النبذة */}
          <div>
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              placeholder={isFemale ? 'من أنتِ؟ وش يحمّسك في الويب؟' : 'من أنت؟ وش يحمّسك في الويب؟'}
              rows={4}
              className="w-full p-4 rounded-2xl text-base font-medium leading-relaxed transition-all focus:outline-none text-right resize-none"
              style={{
                border: isSatisfied ? '2px solid #34A853' : '2px solid #EA4335',
                backgroundColor: '#FFFFFF',
                color: '#0F1729',
              }}
              required
            />
            {/* عداد الحروف باللون الأحمر حتى يكتمل إلى 50 حرفًا */}
            <div className="mt-1.5 flex items-center justify-between text-xs font-bold">
              <span style={{ color: isSatisfied ? '#34A853' : '#EA4335' }}>
                {isSatisfied
                  ? `مكتملة · ${charCount} حرفًا`
                  : `مطلوبة · ٥٠ حرفًا على الأقل (${charCount}/50)`}
              </span>
            </div>
          </div>

          {/* من بياناتك المسجلة */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-900 block">
              من بياناتك المسجلة
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                المستوى {currentUser.levelNumber || 2} · {currentUser.webLevelTitle?.split(':')[1] || 'متوسط'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                HTML
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                CSS
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium pt-1">
              لما تكملين كورس ويُعتمد مشروعك، تنضاف المهارة لملفك تلقائيًا.
            </p>
          </div>

          {/* زر المتابعة: رمادي غير مفعّل حتى اكتمال 50 حرفًا، ثم يتحول للكحلي الداكن */}
          <button
            type="submit"
            disabled={!isSatisfied || isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all mt-2"
            style={{
              backgroundColor: isSatisfied ? '#0F1729' : '#E2E8F0',
              color: isSatisfied ? '#FFFFFF' : '#94A3B8',
              cursor: isSatisfied ? 'pointer' : 'not-allowed',
              border: 'none',
            }}
          >
            {isSubmitting
              ? 'جارٍ الحفظ...'
              : isSatisfied
              ? 'أكمل'
              : 'أكمل (بعد كتابة النبذة)'}
          </button>
        </form>
      </div>
    </div>
  );
};
