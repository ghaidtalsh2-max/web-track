import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile, UserSettings } from '../../types';
import { store } from '../../services/store';
import { X } from 'lucide-react';

interface CustomizeModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  currentUser,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const settings: UserSettings = currentUser.settings || {
    fontSize: 17,
    theme: 'light',
    language: 'ar',
    reducedMotion: false,
    eyeComfort: false,
    celebrations: true,
    highContrast: false,
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    store.updateUserSettings(currentUser.id, { [key]: value });

    if (key === 'fontSize') {
      document.documentElement.style.setProperty('--base-font-size', `${value}px`);
    } else if (key === 'theme') {
      document.documentElement.setAttribute('data-theme', value as string);
    } else if (key === 'eyeComfort') {
      document.documentElement.setAttribute('data-eye-comfort', value ? 'true' : 'false');
    } else if (key === 'reducedMotion') {
      document.documentElement.setAttribute('data-reduced-motion', value ? 'true' : 'false');
    } else if (key === 'highContrast') {
      document.documentElement.setAttribute('data-high-contrast', value ? 'true' : 'false');
    }
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.min(22, Math.max(14, settings.fontSize + delta));
    updateSetting('fontSize', newSize);
  };

  return (
    <>
      {/* خلفية شفافة غير معتمة لإغلاق النافذة عند النقر خارجها كما في صفحة 5 */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* لوحة تخصيص تجربتي كـ Popover أنيق مثبت تحت ترس التخصيص */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -6 }}
        transition={{ duration: 0.18 }}
        className="customize-popover-card"
        role="dialog"
        aria-modal="true"
        aria-label="تخصيص تجربتي"
      >
        {/* رأس البطاقة: تخصيص تجربتي مطابق لصفحة 5 */}
        <div className="mb-5 text-right">
          <h2 className="text-2xl font-black text-gray-900">
            تخصيص تجربتي
          </h2>
        </div>

        <div className="flex flex-col text-right">
          {/* 1. حجم الخط */}
          <div className="flex flex-col gap-2 pb-3.5 border-b border-gray-100">
            <div className="text-sm font-bold text-gray-900">
              حجم الخط
            </div>
            <div className="flex items-center gap-3" dir="rtl">
              <span className="text-xs font-bold text-gray-600">-A</span>
              <input
                type="range"
                min="14"
                max="22"
                step="1"
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', parseInt(e.target.value, 10))}
                className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                style={{ direction: 'rtl' }}
              />
              <span className="text-sm font-bold text-gray-900">+A</span>
            </div>
          </div>

          {/* 2. المظهر (فاتح ☼ · داكن ☾ · تلقائي) */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="text-sm font-bold text-gray-900">
              المظهر
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600" dir="rtl">
              <button
                type="button"
                onClick={() => updateSetting('theme', 'light')}
                className="cursor-pointer border-none bg-transparent hover:text-blue-600"
                style={{ color: settings.theme === 'light' ? '#4285F4' : '#64748B', fontWeight: settings.theme === 'light' ? 900 : 700 }}
              >
                فاتح ☼
              </button>
              <span className="text-gray-300">·</span>
              <button
                type="button"
                onClick={() => updateSetting('theme', 'dark')}
                className="cursor-pointer border-none bg-transparent hover:text-blue-600"
                style={{ color: settings.theme === 'dark' ? '#4285F4' : '#64748B', fontWeight: settings.theme === 'dark' ? 900 : 700 }}
              >
                داكن ☾
              </button>
              <span className="text-gray-300">·</span>
              <button
                type="button"
                onClick={() => updateSetting('theme', 'auto')}
                className="cursor-pointer border-none bg-transparent hover:text-blue-600"
                style={{ color: settings.theme === 'auto' ? '#4285F4' : '#64748B', fontWeight: settings.theme === 'auto' ? 900 : 700 }}
              >
                تلقائي
              </button>
            </div>
          </div>

          {/* 3. اللغة (عربي · English) */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="text-sm font-bold text-gray-900">
              اللغة
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600" dir="rtl">
              <button
                type="button"
                onClick={() => updateSetting('language', 'ar')}
                className="cursor-pointer border-none bg-transparent hover:text-blue-600"
                style={{ color: settings.language === 'ar' ? '#4285F4' : '#64748B', fontWeight: settings.language === 'ar' ? 900 : 700 }}
              >
                عربي
              </button>
              <span className="text-gray-300">·</span>
              <button
                type="button"
                onClick={() => updateSetting('language', 'en')}
                className="cursor-pointer border-none bg-transparent hover:text-blue-600"
                style={{ color: settings.language === 'en' ? '#4285F4' : '#64748B', fontWeight: settings.language === 'en' ? 900 : 700 }}
              >
                English
              </button>
            </div>
          </div>

          {/* 4. تقليل الحركة */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="text-sm font-bold text-gray-900">
              تقليل الحركة
            </div>
            <button
              type="button"
              onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
              className={`toggle-pill ${settings.reducedMotion ? 'toggle-pill-on' : 'toggle-pill-off'}`}
            >
              {settings.reducedMotion ? 'تشغيل' : 'إيقاف'}
            </button>
          </div>

          {/* 5. وضع راحة العين */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="text-sm font-bold text-gray-900">
              وضع راحة العين
            </div>
            <button
              type="button"
              onClick={() => updateSetting('eyeComfort', !settings.eyeComfort)}
              className={`toggle-pill ${settings.eyeComfort ? 'toggle-pill-on' : 'toggle-pill-off'}`}
            >
              {settings.eyeComfort ? 'تشغيل' : 'إيقاف'}
            </button>
          </div>

          {/* 6. الاحتفالات والأصوات */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="text-sm font-bold text-gray-900">
              الاحتفالات والأصوات
            </div>
            <button
              type="button"
              onClick={() => updateSetting('celebrations', !settings.celebrations)}
              className={`toggle-pill ${settings.celebrations ? 'toggle-pill-on' : 'toggle-pill-off'}`}
            >
              {settings.celebrations ? 'تشغيل' : 'إيقاف'}
            </button>
          </div>

          {/* 7. تباين عالٍ */}
          <div className="flex items-center justify-between py-3">
            <div className="text-sm font-bold text-gray-900">
              تباين عالٍ
            </div>
            <button
              type="button"
              onClick={() => updateSetting('highContrast', !settings.highContrast)}
              className={`toggle-pill ${settings.highContrast ? 'toggle-pill-on' : 'toggle-pill-off'}`}
            >
              {settings.highContrast ? 'تشغيل' : 'إيقاف'}
            </button>
          </div>
        </div>

        {/* سطر الملاحظة المعتمدة بأسفل البطاقة */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 font-medium">
            إعداداتك تنحفظ بحسابك على كل أجهزتك.
          </p>
        </div>
      </motion.div>
    </>
  );
};
