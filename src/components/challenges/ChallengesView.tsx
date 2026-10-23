import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../../types';
import { store, CURRENT_MISSION } from '../../services/store';
import confetti from 'canvas-confetti';
import { Send, Clock, CheckCircle2, AlertCircle, FileCode2, ExternalLink } from 'lucide-react';

interface ChallengesViewProps {
  currentUser: UserProfile;
}

interface UserSubmissionItem {
  id: string;
  taskTitle: string;
  repoUrl: string;
  liveUrl?: string;
  submittedAt: string;
  status: 'in_review' | 'approved' | 'revision_requested';
  leaderFeedback?: string;
  awardedPoints?: number;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ currentUser }) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/noura/interactive-button-challenge');
  const [liveUrl, setLiveUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [submissions, setSubmissions] = useState<UserSubmissionItem[]>([
    {
      id: 'sub-1',
      taskTitle: 'تحدي: زر يتفاعل',
      repoUrl: 'https://github.com/noura/interactive-button-challenge',
      liveUrl: 'https://noura.github.io/interactive-button',
      submittedAt: 'اليوم، قبل ساعتين',
      status: 'in_review',
      leaderFeedback: 'جارِ مراجعة الأكواد والتأكد من تطبيق تأثيرات الـ Hover و Transition.',
      awardedPoints: 50,
    },
    {
      id: 'sub-2',
      taskTitle: 'مشروع: صفحة تعريفية شخصية (HTML & CSS)',
      repoUrl: 'https://github.com/noura/portfolio-v1',
      submittedAt: 'الأسبوع الماضي',
      status: 'approved',
      leaderFeedback: 'تنظيم ممتاز للعناصر واستخدام صحيح لـ Flexbox و semantic HTML. بارك الله في جهودك!',
      awardedPoints: 100,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsSubmitting(true);

    const newSub: UserSubmissionItem = {
      id: `sub-${Date.now()}`,
      taskTitle: CURRENT_MISSION.title,
      repoUrl: repoUrl.trim(),
      liveUrl: liveUrl.trim() || undefined,
      submittedAt: 'الآن',
      status: 'in_review',
      leaderFeedback: 'تم استلام تسليمك وسيتم مراجعته من قبل القائدتين غيداء وريتال قريباً.',
      awardedPoints: CURRENT_MISSION.points,
    };

    if (currentUser.settings?.celebrations) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#34A853', '#F9AB00'],
      });
    }

    setTimeout(() => {
      setSubmissions([newSub, ...submissions]);
      setIsSubmitting(false);
      setSuccessMsg('تم رفع تسليمك بنجاح وسجّل في سجل المراجعات ✓');
      setNotes('');
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-8 sm:py-12 text-right"
    >
      {/* رأس الصفحة */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-2">
          التحديات والمهام
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          تطبيقات عملية مكثفة لصقل مهاراتك وبناء مشاريع حقيقية معتمدة
        </p>
      </div>

      {/* بطاقة التحدي الحالي باللون الأصفر الرسمي */}
      <div
        className="p-6 sm:p-8 rounded-3xl card-navy mb-8 text-right"
        style={{
          backgroundColor: '#F9AB00',
          border: '2px solid #0F1729',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-gray-900 bg-white/40 px-3 py-1 rounded-full">
            المهمة النشطة · {CURRENT_MISSION.dueText}
          </span>
          <span className="text-xs font-black text-gray-950 bg-white px-3 py-1 rounded-full shadow-xs">
            + {CURRENT_MISSION.points} نقطة
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-gray-950 mb-3">
          {CURRENT_MISSION.title}
        </h2>

        <p className="text-sm sm:text-base text-gray-900 font-medium max-w-2xl mb-6 leading-relaxed">
          {CURRENT_MISSION.summary}
        </p>

        {/* نموذج رفع التسليم المباشر */}
        <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-gray-900 flex flex-col gap-4">
          <h3 className="text-base font-black text-gray-900">
            تسليم مخرجات التحدي
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                رابط مستودع GitHub (إلزامي)
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 font-mono text-left focus:outline-none focus:border-blue-500"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                رابط المعاينة الحية Live Demo (اختياري)
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://username.github.io/project"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 font-mono text-left focus:outline-none focus:border-blue-500"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              ملاحظات أو أسئلة للقائدتين أثناء المراجعة
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتبي أي توضيحات إضافية حول التحدي..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 resize-none font-medium"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-gray-500 font-medium">
              تُراجع التسليمات وتُعتمد النقاط والمهارات خلال 48 ساعة.
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !repoUrl.trim()}
              className="px-8 py-3 rounded-full text-xs font-bold text-white bg-[#0F1729] hover:bg-gray-800 disabled:opacity-50 transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2"
            >
              {isSubmitting ? 'جارِ التسليم...' : (
                <>
                  <Send size={13} />
                  <span>تسليم المهمة للمراجعة</span>
                </>
              )}
            </button>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-green-50 text-green-700 text-xs font-bold border border-green-200 text-center">
              {successMsg}
            </div>
          )}
        </form>
      </div>

      {/* سجل تسليمات العضو وحالات المراجعة */}
      <div>
        <h2 className="text-xl font-black text-gray-900 mb-4">
          سجل تسليماتك السابقة والمراجعات
        </h2>

        <div className="flex flex-col gap-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-right"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span
                    className={`badge-pill text-xs font-bold ${
                      sub.status === 'approved'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : sub.status === 'revision_requested'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {sub.status === 'approved'
                      ? 'مقبول ومعتمد ✓'
                      : sub.status === 'revision_requested'
                      ? 'يحتاج تعديل ↺'
                      : 'قيد المراجعة ⌛'}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {sub.submittedAt}
                  </span>
                </div>

                <h3 className="text-base font-black text-gray-900 mb-2">
                  {sub.taskTitle}
                </h3>

                {sub.leaderFeedback && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 max-w-xl leading-relaxed">
                    <span className="font-bold text-gray-800">ملاحظة القائدة: </span>
                    {sub.leaderFeedback}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <a
                  href={sub.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <FileCode2 size={14} />
                  <span>مستودع الكود</span>
                </a>

                {sub.liveUrl && (
                  <a
                    href={sub.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#4285F4] hover:bg-[#3367D6] transition-colors inline-flex items-center gap-1.5"
                  >
                    <ExternalLink size={14} />
                    <span>المعاينة</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
