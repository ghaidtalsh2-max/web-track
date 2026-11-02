import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ExternalLink, Calendar, CheckCircle2, FileText, Code2, Award } from 'lucide-react';
import { BroadcastAnnouncement } from '../../types';
import confetti from 'canvas-confetti';

interface BroadcastAnnouncementModalProps {
  announcement: BroadcastAnnouncement;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const BroadcastAnnouncementModal: React.FC<BroadcastAnnouncementModalProps> = ({
  announcement,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#4285F4', '#EA4335', '#FBBC04', '#34A853'],
    });
  }, [announcement.id]);

  const getIcon = () => {
    switch (announcement.type) {
      case 'workshop':
        return <Calendar className="w-8 h-8 text-[#4285F4]" />;
      case 'task':
        return <Code2 className="w-8 h-8 text-[#34A853]" />;
      case 'resource':
        return <FileText className="w-8 h-8 text-[#EA4335]" />;
      default:
        return <Sparkles className="w-8 h-8 text-[#FBBC04]" />;
    }
  };

  const getBadgeColor = () => {
    switch (announcement.type) {
      case 'workshop':
        return { bg: '#E8F0FE', text: '#1A73E8', border: '#D2E3FC' };
      case 'task':
        return { bg: '#E6F4EA', text: '#137333', border: '#CEEAD6' };
      case 'resource':
        return { bg: '#FCE8E6', text: '#C5221F', border: '#FAD2CF' };
      default:
        return { bg: '#FEF7E0', text: '#B06000', border: '#FEEFC3' };
    }
  };

  const badgeStyle = getBadgeColor();

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
        dir="rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-100 text-right p-6 sm:p-8"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #FAFAFA 100%)',
          }}
        >
          {/* خط الألوان العلوي لهوية Google */}
          <div className="absolute top-0 left-0 right-0 flex h-1.5" aria-hidden="true">
            <div className="flex-1 bg-[#4285F4]" />
            <div className="flex-1 bg-[#EA4335]" />
            <div className="flex-1 bg-[#FBBC04]" />
            <div className="flex-1 bg-[#34A853]" />
          </div>

          {/* زر الإغلاق */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 left-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer border-none"
            aria-label="إغلاق التنبيه"
          >
            <X size={18} />
          </button>

          {/* رأس البطاقة والشارة */}
          <div className="flex items-center gap-3.5 mb-5 mt-2">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: badgeStyle.bg, border: `1.5px solid ${badgeStyle.border}` }}
            >
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: badgeStyle.bg,
                    color: badgeStyle.text,
                    border: `1px solid ${badgeStyle.border}`,
                  }}
                >
                  {announcement.badge || 'إعلان مسار الويب 📢'}
                </span>
                <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  لكل الحسابات (أعضاء وقادة) ✨
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 m-0 leading-tight">
                {announcement.title}
              </h2>
            </div>
          </div>

          {/* محتوى الإعلان */}
          <div className="bg-gray-50/80 rounded-2xl p-4 sm:p-5 border border-gray-200/70 mb-6 space-y-2">
            {announcement.subtitle && (
              <h3 className="text-base font-extrabold text-gray-900 m-0 leading-relaxed">
                {announcement.subtitle}
              </h3>
            )}
            <p className="text-sm font-medium text-gray-600 m-0 leading-relaxed whitespace-pre-line">
              {announcement.description}
            </p>
          </div>

          {/* الأزرار التفاعلية */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onNavigate(announcement.targetTab || 'home');
                onClose();
              }}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-black text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer border-none"
            >
              <span>استكشف المحتوى الآن</span>
              <ExternalLink size={16} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer border-none"
            >
              حسناً، فهمت ✓
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
