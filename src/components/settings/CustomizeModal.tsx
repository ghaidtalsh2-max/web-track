import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile, UserSettings } from '../../types';
import { store } from '../../services/store';

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
    fontSize: 16,
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
      const px = `${value}px`;
      document.documentElement.style.setProperty('--base-font-size', px);
      document.documentElement.style.fontSize = px;
      try {
        localStorage.setItem('web_track_font_size', String(value));
      } catch {}
    } else if (key === 'theme') {
      document.documentElement.setAttribute('data-theme', value as string);
      try {
        localStorage.setItem('web_track_theme', value as string);
      } catch {}
    } else if (key === 'language') {
      const lang = value as string;
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      try {
        localStorage.setItem('web_track_lang', lang);
      } catch {}
    }
  };

  return (
    <>
      {/* خلفية شفافة لإغلاق النافذة عند النقر خارجها */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* لوحة تخصيص تجربتي كـ Popover أنيق تحت ترس التخصيص */}
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
        {/* رأس البطاقة */}
        <div className="mb-5 text-right">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            تخصيص تجربتي
          </h2>
        </div>

        <div className="flex flex-col text-right">
          {/* 1. حجم الخط */}
          <div className="flex flex-col gap-2 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">حجم الخط</span>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {settings.fontSize}px
              </span>
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

          {/* 2. المظهر (فاتح / داكن) */}
          <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
            <div className="text-sm font-bold text-gray-900">
              المظهر
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold" dir="rtl">
              <button
                type="button"
                onClick={() => updateSetting('theme', 'light')}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-[#0F1729] text-white border-[#0F1729] font-black'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                فاتح ☼
              </button>
              <button
                type="button"
                onClick={() => updateSetting('theme', 'dark')}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-[#0F1729] text-white border-[#0F1729] font-black'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                داكن ☾
              </button>
            </div>
          </div>

          {/* 3. اللغة (عربي / English) */}
          <div className="flex items-center justify-between pt-3.5 pb-2">
            <div className="text-sm font-bold text-gray-900">
              اللغة
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => updateSetting('language', 'ar')}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  settings.language === 'ar'
                    ? 'bg-[#0F1729] text-white border-[#0F1729] font-black'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => updateSetting('language', 'en')}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  settings.language === 'en'
                    ? 'bg-[#0F1729] text-white border-[#0F1729] font-black'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
