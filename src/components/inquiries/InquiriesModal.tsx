import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { store } from '../../services/store';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface InquiriesModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const InquiriesModal: React.FC<InquiriesModalProps> = ({
  currentUser,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<'inquiry' | 'suggestion'>('inquiry');
  const [content, setContent] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const titlePrefix = type === 'inquiry' ? 'استفسار من العضو: ' : 'اقتراح ورشة: ';
    store.addInquiry(
      `${titlePrefix} ${content.trim().slice(0, 30)}...`,
      content.trim()
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setContent('');
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="صندوق الاستفسارات واقتراح الورشات"
    >
      <div
        className="w-full max-w-md relative z-10 p-6 sm:p-8 rounded-3xl animate-fade-in-up transition-all text-right"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '2.5px solid #202124',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        }}
      >
        {/* زر الإغلاق ورأس النافذة */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            عندك استفسار أو اقتراح؟
          </h2>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center animate-fade-in-up">
            <div className="flex justify-center mb-3">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              وصلت رسالتك للقائدة بنجاح!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              سيتم الرد عليك في أقرب وقت وإشعارك في التنبيهات.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* خيارات النوع: استفسار / اقتراح ورشة (مطابق لصفحة 4) */}
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  type === 'inquiry'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="inquiry"
                  checked={type === 'inquiry'}
                  onChange={() => setType('inquiry')}
                  className="accent-blue-600"
                />
                <span className="text-sm">استفسار</span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  type === 'suggestion'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="suggestion"
                  checked={type === 'suggestion'}
                  onChange={() => setType('suggestion')}
                  className="accent-blue-600"
                />
                <span className="text-sm">اقتراح ورشة</span>
              </label>
            </div>

            {/* مربع النص (اكتب هنا...) */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب هنا..."
                rows={4}
                className="w-full p-4 rounded-2xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-right resize-none"
                style={{
                  borderColor: 'var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                }}
                required
              />
            </div>

            {/* زر "أرسل" الأصفر (مطابق لصفحة 4) */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-2xl font-bold text-base text-gray-900 transition-all hover:brightness-105 active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              style={{
                backgroundColor: '#F9AB00',
              }}
            >
              <span>أرسل</span>
              <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
