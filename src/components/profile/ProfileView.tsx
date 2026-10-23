import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../../types';
import { store } from '../../services/store';
import { Award, Shield, Search, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProfileViewProps {
  currentUser: UserProfile;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser }) => {
  const [allMembers] = useState<UserProfile[]>(() => store.getAllMembers());
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredMembers = allMembers.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.major?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || m.webLevel === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-8 sm:py-12 text-right"
    >
      {/* 1. بطاقة الهوية الأساسية للعضو مطابقة لصفحة 11 بالمرجع */}
      <div
        className="p-6 sm:p-8 rounded-3xl card-navy mb-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #0F1729',
        }}
      >
        <div className="flex items-center gap-5">
          {/* دائرة الحرف الأول الزرقاء المطابقة لصفحة 11 */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-md flex-shrink-0"
            style={{ backgroundColor: '#4285F4' }}
          >
            {currentUser.avatarLetter}
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-1">
              {currentUser.fullName}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge-pill bg-blue-50 text-blue-700 text-xs font-bold">
                المستوى {currentUser.levelNumber} · معتمد
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {currentUser.major} · {currentUser.academicYear}
              </span>
            </div>
          </div>
        </div>

        {/* عداد النقاط الأخضر الكبير المطابق لصفحة 11 */}
        <div className="flex flex-col items-center sm:items-end">
          <div className="text-4xl sm:text-5xl font-black text-[#34A853] tracking-tight">
            {currentUser.points}
          </div>
          <span className="text-xs font-bold text-gray-500">
            نقطة إنجاز
          </span>
        </div>
      </div>

      {/* 2. قسم المهارات والإنجازات المطابق لصفحة 11 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* صندوق المهارات بالأشرطة الملونة */}
        <div
          className="p-6 sm:p-8 rounded-3xl card-navy flex flex-col justify-between"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #0F1729',
          }}
        >
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-[#4285F4]" />
              <span>المهارات</span>
            </h2>

            <div className="flex flex-col gap-5">
              {/* HTML */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-1.5">
                  <span>HTML</span>
                  <span className="text-green-600">100% · معتمد</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#34A853] rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              {/* CSS */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-1.5">
                  <span>CSS</span>
                  <span className="text-blue-600">75% · قيد الإنجاز</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4285F4] rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              {/* JavaScript */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-1.5">
                  <span>JavaScript</span>
                  <span className="text-amber-600">40% · قادم</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F9AB00] rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 font-medium mt-6 pt-3 border-t border-gray-100">
            تُضاف المهارة لملفك تلقائيًا فور اكتمال الدورة واعتماد المشروع من قادة المسار.
          </p>
        </div>

        {/* صندوق الإنجازات والأوسمة */}
        <div
          className="p-6 sm:p-8 rounded-3xl card-navy flex flex-col justify-between"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #0F1729',
          }}
        >
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Award size={20} className="text-[#F9AB00]" />
              <span>الإنجازات</span>
            </h2>

            <div className="flex flex-wrap gap-2.5">
              <span className="px-4 py-2 rounded-2xl text-xs font-black bg-[#F9AB00] text-gray-950 flex items-center gap-1.5 shadow-xs">
                <Sparkles size={14} />
                <span>رائدة الويب</span>
              </span>

              <span className="px-4 py-2 rounded-2xl text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span>أول مشروع</span>
              </span>

              <span className="px-4 py-2 rounded-2xl text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                مكتملة المرحلة 01
              </span>
            </div>
          </div>

          {/* سطر الخصوصية المطابق لصفحة 11 بالمرجع */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
            معلومات الدخول والتواصل الخاصة لا تظهر لبقية الأعضاء.
          </div>
        </div>
      </div>

      {/* 3. دليل استكشاف أعضاء المسار بروح المجتمع */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-black text-gray-900">
            استكشاف أعضاء مسار الويب
          </h2>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم أو التخصص..."
                className="w-full pl-3 pr-9 py-2 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
              />
              <Search size={14} className="absolute right-3 top-2.5 text-gray-400" />
            </div>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none"
            >
              <option value="all">كل المستويات</option>
              <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدم</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMembers.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-white border border-gray-200 flex items-center gap-3 text-right"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                style={{ backgroundColor: m.badgeColor || '#4285F4' }}
              >
                {m.avatarLetter}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-gray-900 truncate">
                  {m.fullName}
                </div>
                <div className="text-[11px] text-gray-500 truncate">
                  {m.webLevelTitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
