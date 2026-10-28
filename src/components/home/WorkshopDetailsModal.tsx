import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Workshop } from '../../types';
import { X, Calendar, ExternalLink, CheckCircle2, ListChecks, Layers, Image as ImageIcon } from 'lucide-react';

interface WorkshopDetailsModalProps {
  workshop: Workshop | null;
  isOpen: boolean;
  onClose: () => void;
  onStartTask?: (taskTitle: string) => void;
}

export const WorkshopDetailsModal: React.FC<WorkshopDetailsModalProps> = ({
  workshop,
  isOpen,
  onClose,
  onStartTask,
}) => {
  if (!isOpen || !workshop) return null;

  const hasRegistration = Boolean(workshop.registrationUrl && workshop.registrationUrl.trim().length > 0);

  const defaultTopics =
    workshop.topics && workshop.topics.length > 0
      ? workshop.topics
      : [
          'فهم معمارية الصندوق والـ Box Model وتوزيع العناصر بدقة',
          'التحكم بالمحاور والاتجاهات عبر Flexbox (justify-content & align-items)',
          'بناء الشبكات المتجاوبة ثنائية الأبعاد عبر CSS Grid (grid-template-columns)',
        ];

  const defaultTasks =
    workshop.tasks && workshop.tasks.length > 0
      ? workshop.tasks
      : [
          'تاسك 1: تصميم شريط ملاحة متجاوب باستخدام Flexbox',
          'تاسك 2: بناء شبكة بطاقات معارض مشاريع ثلاثية الأعمدة بـ CSS Grid',
          'تاسك 3: تحدي دمج Grid و Flexbox في صفحة هبوط متكاملة',
        ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
        }}
        onClick={onClose}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-label="تفاصيل ورشة العمل"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 card-3d-tactile text-right relative overflow-hidden"
          style={{
            border: '2.5px solid #0F1729',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.3), 0 8px 0 0 #0F1729',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* شريط الإغلاق العلوي */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#34A853' }}
              />
              <span className="text-xs font-black text-gray-500">
                ورشة عمل تطبيقية · مسار الويب
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer border-none"
              aria-label="إغلاق النافذة"
            >
              <X size={18} />
            </button>
          </div>

          {/* البانر أو أيقونة الورشة */}
          <div className="mb-6 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            {workshop.imageUrl ? (
              <img
                src={workshop.imageUrl}
                alt={workshop.title}
                className="w-full h-48 sm:h-56 object-cover"
                onError={(e) => {
                  // Fallback to default icon container if image fails to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                className="w-full h-36 flex flex-col items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #E6F4EA 0%, #CEEAD6 100%)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: '#34A853' }}
                >
                  <Layers size={28} />
                </div>
                <span className="text-xs font-black text-green-900">
                  ورشة عمل تفاعلية رسمية
                </span>
              </div>
            )}
          </div>

          {/* عنوان الورشة وتوقيتها */}
          <div className="mb-6">
            <h2
              className="text-2xl sm:text-3xl font-black text-gray-950 mb-2 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {workshop.title}
            </h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600">
              <Calendar size={16} className="text-[#34A853] shrink-0" />
              <span>{workshop.scheduledAt}</span>
            </div>
          </div>

          {/* الوصف الكامل للورشة */}
          <div className="mb-6">
            <h3 className="text-sm font-black text-gray-900 mb-2">عن الورشة</h3>
            <p className="text-sm font-medium text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {workshop.description ||
                'ورشة عمل تطبيقية مكثفة يتعلم خلالها المطورون كيفية بناء وتصميم واجهات ويب عصرية متجاوبة ومتوافقة مع شاشات الجوال والحاسوب، مع كتابة الكود مباشرة والتطبيق العملي خطوة بخطوة.'}
            </p>
          </div>

          {/* محاور الورشة */}
          <div className="mb-6">
            <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
              <ListChecks size={18} className="text-[#4285F4]" />
              <span>محاور الورشة</span>
            </h3>
            <div className="space-y-2">
              {defaultTopics.map((topic, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-gray-800"
                >
                  <CheckCircle2 size={16} className="text-[#34A853] shrink-0 mt-0.5" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* التاسكات الثلاثة المرتبطة بالورشة */}
          <div className="mb-8">
            <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
              <Layers size={18} className="text-[#F9AB00]" />
              <span>التاسكات والتطبيقات العملية (٣ مهام)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {defaultTasks.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between hover:border-blue-400 transition-colors"
                >
                  <div className="text-xs font-black text-gray-900 mb-2 leading-snug">
                    {t}
                  </div>
                  <span className="text-[11px] font-bold text-[#4285F4]">
                    +25 نقطة عند الإنجاز
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* شريط الإجراءات: زر التسجيل والحضور وزر الإغلاق */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
            {hasRegistration ? (
              <a
                href={workshop.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d btn-3d-green py-3 px-6 text-sm font-black flex items-center justify-center gap-2 flex-1"
              >
                <span>رابط التسجيل والحضور</span>
                <ExternalLink size={16} />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="py-3 px-6 rounded-2xl text-sm font-bold bg-gray-100 text-gray-400 cursor-not-allowed flex-1 text-center border-none"
              >
                رابط التسجيل والحضور (قريبًا)
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-6 rounded-2xl text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors border-none cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
