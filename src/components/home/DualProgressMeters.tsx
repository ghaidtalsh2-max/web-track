import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen } from 'lucide-react';

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
  // حساب عدد البتلات والأذرع المضاءة (من إجمالي 8)
  const litPetals = Math.max(1, Math.min(8, Math.round((engagementPercent / 100) * 8)));
  const litStars = Math.max(1, Math.min(8, Math.round((learningPercent / 100) * 8)));

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs relative overflow-hidden">
      {/* شريط ألوان الهوية العلوي */}
      <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853]" />

      {/* الرأس: المستوى والنقاط */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold text-gray-500 block mb-0.5">
            المستوى {levelNumber} · {levelTitle}
          </span>
          <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
            مؤشرات الأداء والإنجاز
          </h3>
        </div>

        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {points} نقطة
        </span>
      </div>

      {/* المؤشران الإبداعيان جنباً إلى جنب بتصميم متناسق وجذاب */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* 1. مؤشر التفاعل: شكل وردة قوقل الإبداعية (Flower Meter) */}
        <div
          className="p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-between text-center relative transition-all"
          style={{
            backgroundColor: '#FEF7E0', // خلفية بلون التفاعل الكهرماني
            border: '2px solid #F9AB00',
          }}
        >
          <div className="flex items-center gap-1 text-[11px] font-black text-amber-950 mb-1">
            <Zap size={13} className="text-[#F9AB00] fill-[#F9AB00]" />
            <span>مؤشر التفاعل</span>
          </div>

          {/* وردة متكاملة البتلات بهوية قوقل */}
          <div className="relative w-24 h-24 my-2 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-sm">
              <defs>
                <linearGradient id="flowerLitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F9AB00" />
                  <stop offset="100%" stopColor="#EA4335" />
                </linearGradient>
              </defs>

              {/* 8 بتلات متناسقة وناعمة تشكل زهرة قوقل */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const isLit = i < litPetals;
                return (
                  <g key={angle} transform={`rotate(${angle} 50 50)`}>
                    <path
                      d="M 50 12 C 58 12, 60 28, 50 40 C 40 28, 42 12, 50 12 Z"
                      fill={isLit ? 'url(#flowerLitGrad)' : '#FDE68A'}
                      opacity={isLit ? 1 : 0.45}
                      stroke={isLit ? '#D97706' : '#F59E0B'}
                      strokeWidth="1.2"
                    />
                  </g>
                );
              })}

              {/* دائرة القلب المركزية */}
              <circle
                cx="50"
                cy="50"
                r="18"
                fill="#FFFFFF"
                stroke="#0F1729"
                strokeWidth="2.5"
              />
            </svg>

            {/* النسبة المئوية في مركز الوردة */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-black text-gray-950 leading-none">
                {engagementPercent}%
              </span>
            </div>
          </div>

          <span className="text-[10px] text-amber-900 font-bold mt-1">
            النشاط والمشاركات
          </span>
        </div>

        {/* 2. مؤشر التعلّم: شكل نجمة قوقل الإبداعية (Asterisk / Star Meter) */}
        <div
          className="p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-between text-center relative transition-all"
          style={{
            backgroundColor: '#E8F0FE', // خلفية بلون التعلم الأزرق
            border: '2px solid #4285F4',
          }}
        >
          <div className="flex items-center gap-1 text-[11px] font-black text-blue-950 mb-1">
            <BookOpen size={13} className="text-[#4285F4]" />
            <span>مؤشر التعلّم</span>
          </div>

          {/* نجمة قوقل الهندسية المتوهجة */}
          <div className="relative w-24 h-24 my-2 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-sm">
              <defs>
                <linearGradient id="starLitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4285F4" />
                  <stop offset="100%" stopColor="#34A853" />
                </linearGradient>
              </defs>

              {/* 8 أذرع أستركس ناعمة مدورة الأطراف */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const isLit = i < litStars;
                return (
                  <g key={angle} transform={`rotate(${angle} 50 50)`}>
                    <rect
                      x="46"
                      y="10"
                      width="8"
                      height="30"
                      rx="4"
                      fill={isLit ? 'url(#starLitGrad)' : '#BAE6FD'}
                      opacity={isLit ? 1 : 0.45}
                      stroke={isLit ? '#2563EB' : '#93C5FD'}
                      strokeWidth="1.2"
                    />
                  </g>
                );
              })}

              {/* دائرة القلب المركزية */}
              <circle
                cx="50"
                cy="50"
                r="18"
                fill="#FFFFFF"
                stroke="#0F1729"
                strokeWidth="2.5"
              />
            </svg>

            {/* النسبة المئوية في مركز النجمة */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-black text-gray-950 leading-none">
                {learningPercent}%
              </span>
            </div>
          </div>

          <span className="text-[10px] text-blue-950 font-bold mt-1">
            إتقان مسار الويب
          </span>
        </div>
      </div>
    </div>
  );
};
