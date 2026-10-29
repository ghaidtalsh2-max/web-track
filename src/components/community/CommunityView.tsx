import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, Poll } from '../../types';
import { store } from '../../services/store';
import confetti from 'canvas-confetti';
import { Check, Send, ThumbsUp, MessageSquare } from 'lucide-react';

interface CommunityViewProps {
  currentUser: UserProfile;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ currentUser }) => {
  const [polls, setPolls] = useState<Poll[]>(() => store.getPolls());
  const activePoll = polls[0] || store.getPoll();

  const hasVoted = store.hasUserVoted(activePoll?.id || '', currentUser.id);

  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);
  const [pollSuccessMsg, setPollSuccessMsg] = useState(hasVoted ? 'تم تسجيل تصويتك مسبقاً ✓' : '');

  // نموذج استفسار أو اقتراح ورشة (الصندوق الأيسر)
  const [inquiryType, setInquiryType] = useState<'inquiry' | 'suggestion'>('inquiry');
  const [inquiryText, setInquiryText] = useState('');
  const [inquirySuccessMsg, setInquirySuccessMsg] = useState('');
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);

  const handleVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePoll || hasVoted) return;
    if (!selectedOptionId && !customText.trim()) return;

    setIsVoting(true);
    store.votePoll(
      activePoll.id,
      currentUser.id,
      selectedOptionId || undefined,
      customText.trim() || undefined
    );
    setPolls(store.getPolls());

    if (currentUser.settings?.celebrations) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#34A853', '#F9AB00'],
      });
    }

    setTimeout(() => {
      setIsVoting(false);
      setPollSuccessMsg('تم تسجيل صوتك بنجاح ونقاط المشاركة (+15 نقطة) ✓');
    }, 400);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;

    setIsSendingInquiry(true);
    store.addInquiry({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userAvatar: currentUser.avatarLetter,
      title: inquiryType === 'inquiry' ? 'استفسار من العضو' : 'اقتراح ورشة عمل جديدة',
      details: inquiryText.trim(),
    });

    setTimeout(() => {
      setIsSendingInquiry(false);
      setInquiryText('');
      setInquirySuccessMsg('وصلت رسالتك للقائدتين وستصلك الملاحظة قريباً ✓');
    }, 450);
  };

  const totalVotes = activePoll ? activePoll.totalVotes || 1 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-8 sm:py-12 text-right"
    >
      {/* عنوان الصفحة المطابق لصفحة 4 بالمرجع */}
      <div className="mb-8 text-right">
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-2">
          صوتك يفرق معانا ويهمنا
        </h1>
        <div className="w-24 h-1.5 bg-[#EA4335] rounded-full mb-3" />
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          شارك برأيك في استبيانات المسار، واقترح ورشات العمل، وتواصل مباشرة مع القادة.
        </p>
      </div>

      {/* الصندوقان الرئيسيان المتوازيان جنب بعض تماماً المطابقان لصفحة 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* الصندوق الأيمن: الاستبيان التفاعلي */}
        <div
          className="p-6 sm:p-8 rounded-3xl card-navy flex flex-col justify-between h-full"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #0F1729',
          }}
        >
          <div>
            {!activePoll ? (
              <div className="py-12 px-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <MessageSquare size={26} />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">
                  لا يوجد استبيان نشط حالياً
                </h2>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                  سيقوم قادة المسار بنشر استبيانات دورية لأخذ آرائكم وتفضيلاتكم في الورش والتحديات القادمة. ترقبوها هنا قريباً! ✨
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400">
                    استبيان · ينتهي بعد ٣ أيام
                  </span>
                  <span className="badge-pill bg-blue-50 text-blue-700 text-xs font-bold">
                    استبيان نشط
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">
                  {activePoll.title}
                </h2>
              </>
            )}

            {/* خيارات الاستبيان الأربعة + خيار غير ذلك بكتابة حرة */}
            {activePoll && (
            <form onSubmit={handleVote} className="flex flex-col gap-3.5 mb-6">
              {activePoll?.options.map((opt) => {
                const percent = Math.round((opt.votesCount / totalVotes) * 100);
                const isSelected = selectedOptionId === opt.id;

                return (
                  <label
                    key={opt.id}
                    className="p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer"
                    style={{
                      borderColor: isSelected ? '#4285F4' : '#E2E8F0',
                      backgroundColor: isSelected ? '#EEF4FD' : '#FFFFFF',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pollOption"
                        disabled={hasVoted}
                        checked={isSelected}
                        onChange={() => {
                          setSelectedOptionId(opt.id);
                          setCustomText('');
                        }}
                        className="accent-blue-600 cursor-pointer"
                      />
                      <span className="text-sm font-bold text-gray-900">
                        {opt.text}
                      </span>
                    </div>

                    {hasVoted && (
                      <span className="text-xs font-bold text-blue-700 font-mono">
                        {percent}%
                      </span>
                    )}
                  </label>
                );
              })}

              {/* خيار غير ذلك مع حقل كتابة حرة مطابق لصفحة 4 */}
              <div
                className="p-3.5 rounded-2xl border transition-all flex flex-col gap-2"
                style={{
                  borderColor: customText ? '#4285F4' : '#E2E8F0',
                  backgroundColor: customText ? '#EEF4FD' : '#FFFFFF',
                }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pollOption"
                    disabled={hasVoted}
                    checked={!selectedOptionId && !!customText}
                    onChange={() => setSelectedOptionId('')}
                    className="accent-blue-600"
                  />
                  <span className="text-sm font-bold text-gray-900">غير ذلك:</span>
                </div>

                <input
                  type="text"
                  disabled={hasVoted}
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    setSelectedOptionId('');
                  }}
                  placeholder="اكتب رأيك هنا..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* زر صوّت الأزرق المطابق لصفحة 4 */}
              <div className="mt-2">
                <button
                  type="submit"
                  disabled={hasVoted || isVoting || (!selectedOptionId && !customText.trim())}
                  className="w-full sm:w-auto px-8 py-3 rounded-full text-xs font-bold text-white bg-[#4285F4] hover:bg-[#3367D6] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md cursor-pointer active:scale-95"
                >
                  {isVoting ? 'جارِ التصويت...' : hasVoted ? 'تم التصويت ✓' : 'صوّت'}
                </button>
              </div>
            </form>
            )}
          </div>

          {pollSuccessMsg && (
            <div className="p-3 rounded-xl bg-green-50 text-green-700 text-xs font-bold border border-green-200 text-center">
              {pollSuccessMsg}
            </div>
          )}
        </div>

        {/* الصندوق الأيسر: استفسار أو اقتراح ورشة */}
        <div
          className="p-6 sm:p-8 rounded-3xl card-navy flex flex-col justify-between"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #0F1729',
          }}
        >
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">
              عندك استفسار أو اقتراح؟
            </h2>

            {/* مفتاح الاختيار بين استفسار أو اقتراح ورشة */}
            <div className="flex items-center gap-6 mb-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-800">
                <input
                  type="radio"
                  name="inquiryType"
                  checked={inquiryType === 'inquiry'}
                  onChange={() => setInquiryType('inquiry')}
                  className="accent-blue-600"
                />
                <span>استفسار</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-800">
                <input
                  type="radio"
                  name="inquiryType"
                  checked={inquiryType === 'suggestion'}
                  onChange={() => setInquiryType('suggestion')}
                  className="accent-blue-600"
                />
                <span>اقتراح ورشة</span>
              </label>
            </div>

            {/* مساحة الكتابة الحرة المطابقة لصفحة 4 */}
            <form onSubmit={handleSendInquiry} className="flex flex-col gap-4">
              <textarea
                rows={5}
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder="اكتب هنا..."
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-yellow-500 resize-none font-medium"
                required
              />

              {/* زر أرسل الأصفر المطابق لصفحة 4 */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSendingInquiry || !inquiryText.trim()}
                  className="px-8 py-3 rounded-full text-xs font-bold text-gray-950 bg-[#F9AB00] hover:bg-[#E59D00] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md cursor-pointer active:scale-95"
                >
                  {isSendingInquiry ? 'جارِ الإرسال...' : 'أرسل'}
                </button>
              </div>
            </form>
          </div>

          {inquirySuccessMsg && (
            <div className="mt-4 p-3 rounded-xl bg-green-50 text-green-700 text-xs font-bold border border-green-200 text-center">
              {inquirySuccessMsg}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
