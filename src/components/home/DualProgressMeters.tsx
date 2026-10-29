import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, BookOpen } from 'lucide-react';

interface DualProgressMetersProps {
  engagementPercent: number; // 0 - 100
  learningPercent: number; // 0 - 100
  points: number;
  levelNumber: number;
  levelTitle: string;
}

export const DualProgressMeters: React.FC<DualProgressMetersProps> = ({
  engagementPercent,
  learningPercent,
  points,
  levelNumber,
  levelTitle,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs relative overflow-hidden">
      {/* شريط هوية قوقل العلوي */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853]" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-bold text-gray-500 block mb-0.5">
            المستوى {levelNumber} · {levelTitle}
          </span>
          <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
            مؤشرات الأداء والإنجاز
          </h3>
        </div>

        <div className="text-left">
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            {points} نقطة
          </span>
        </div>
      </div>

      {/* المؤشران الإبداعيان جنباً إلى جنب */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* 1. مؤشر التفاعل (شكل الوردة الإبداعية Flower Meter) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/50 border-2 border-amber-300 flex flex-col items-center justify-between text-center relative group">
          <div className="flex items-center gap-1 text-[11px] font-black text-amber-900 mb-2">
            <Zap size={13} className="text-[#F9AB00] fill-[#F9AB00]" />
            <span>مؤشر التفاعل</span>
          </div>

          {/* SVG وردة التفاعل الإبداعية التفاعلية */}
          <div className="relative w-24 h-24 my-1 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transition-transform group-hover:scale-105 duration-300"
            >
              <defs>
                <linearGradient id="flowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F9AB00" />
                  <stop offset="100%" stopColor="#EA4335" />
                </linearGradient>
              </defs>

              {/* بتلات الوردة الثمانية بتنسيق دائري محيطي */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
                const isLit = idx < Math.ceil((engagementPercent / 100) * 8);
                return (
                  <motion.ellipse
                    key={angle}
                    cx="50"
                    cy="23"
                    rx="10"
                    ry="17"
                    transform={`rotate(${angle} 50 50)`}
                    fill={isLit ? 'url(#flowerGrad)' : '#E2E8F0'}
                    stroke="#0F1729"
                    strokeWidth="1.5"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                  />
                );
              })}

              {/* قلب الوردة الأوسط الدائري مع حدود سميكة */}
              <circle
                cx="50"
                cy="50"
                r="19"
                fill="#FFFFFF"
                stroke="#0F1729"
                strokeWidth="2.5"
              />
            </svg>

            {/* النسبة المئوية في قلب الوردة */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs sm:text-sm font-black text-gray-950 leading-none">
                {engagementPercent}%
              </span>
            </div>
          </div>

          <span className="text-[10px] text-amber-800 font-bold mt-1">
            النشاط والمشاركات
          </span>
        </div>

        {/* 2. مؤشر التعلّم (شكل النجمة الإبداعية Star Meter) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border-2 border-blue-300 flex flex-col items-center justify-between text-center relative group">
          <div className="flex items-center gap-1 text-[11px] font-black text-blue-900 mb-2">
            <BookOpen size={13} className="text-[#4285F4]" />
            <span>مؤشر التعلّم</span>
          </div>

          {/* SVG نجمة التعلم الإبداعية التفاعلية */}
          <div className="relative w-24 h-24 my-1 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transition-transform group-hover:scale-105 duration-300"
            >
              <defs>
                <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4285F4" />
                  <stop offset="100%" stopColor="#34A853" />
                </linearGradient>
              </defs>

              {/* أذرع النجمة الهندسية (8-point faceted star) */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
                const isLit = idx < Math.ceil((learningPercent / 100) * 8);
                return (
                  <motion.polygon
                    key={angle}
                    points="50,14 55,36 50,42 45,36"
                    transform={`rotate(${angle} 50 50)`}
                    fill={isLit ? 'url(#starGrad)' : '#E2E8F0'}
                    stroke="#0F1729"
                    strokeWidth="1.5"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                  />
                );
              })}

              {/* قلب النجمة الدائري الأوسط */}
              <circle
                cx="50"
                cy="50"
                r="19"
                fill="#FFFFFF"
                stroke="#0F1729"
                strokeWidth="2.5"
              />
            </svg>

            {/* النسبة المئوية في قلب النجمة */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs sm:text-sm font-black text-gray-950 leading-none">
                {learningPercent}%
              </span>
            </div>
          </div>

          <span className="text-[10px] text-blue-800 font-bold mt-1">
            إتقان مسار الويب
          </span>
        </div>
      </div>
    </div>
  );
};
