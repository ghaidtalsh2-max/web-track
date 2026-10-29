import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { PinwheelFlower } from '../brand/PinwheelFlower';

interface ShowcaseViewProps {
  currentUser: UserProfile;
}

interface ShowcaseCardItem {
  id: string;
  title: string;
  memberName: string;
  stageName: string;
  status: 'approved' | 'in_review';
  color: string;
  githubUrl: string;
  category: 'workshop' | 'general';
}

const DEMO_PROJECTS: ShowcaseCardItem[] = [
  // مهمات الورش التطبيقية
  {
    id: 'ws-proj-1',
    title: 'بطاقة ملف عضو',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: '#34A853', // أخضر
    githubUrl: 'https://github.com',
    category: 'workshop',
  },
  {
    id: 'ws-proj-2',
    title: 'صفحة تعريفية شخصية',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: '#4285F4', // أزرق
    githubUrl: 'https://github.com',
    category: 'workshop',
  },
  {
    id: 'ws-proj-3',
    title: 'صفحة هبوط لورشة',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'in_review',
    color: '#F9AB00', // أصفر
    githubUrl: 'https://github.com',
    category: 'workshop',
  },
  // المعرض العام لمشاريع الأعضاء
  {
    id: 'gen-proj-1',
    title: 'لعبة ذاكرة',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: '#34A853', // أخضر
    githubUrl: 'https://github.com',
    category: 'general',
  },
  {
    id: 'gen-proj-2',
    title: 'حاسبة بسيطة',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: '#F9AB00', // أصفر
    githubUrl: 'https://github.com',
    category: 'general',
  },
  {
    id: 'gen-proj-3',
    title: 'قائمة مهام تفاعلية',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'in_review',
    color: '#EA4335', // أحمر
    githubUrl: 'https://github.com',
    category: 'general',
  },
];

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ currentUser }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'in_review'>('all');

  const filterProjects = (list: ShowcaseCardItem[]) => {
    if (statusFilter === 'all') return list;
    return list.filter((p) => p.status === statusFilter);
  };

  const workshopProjects = filterProjects(DEMO_PROJECTS.filter((p) => p.category === 'workshop'));
  const generalProjects = filterProjects(DEMO_PROJECTS.filter((p) => p.category === 'general'));

  const renderCard = (p: ShowcaseCardItem) => (
    <div
      key={p.id}
      className="card-3d-tactile rounded-3xl overflow-hidden bg-white border-2 border-[#0F1729] flex flex-col transition-all hover:-translate-y-1"
      style={{
        borderRadius: '26px',
        boxShadow: '0 6px 0 0 #0F1729',
      }}
    >
      {/* الجزء العلوي الملون مع زهرة قوقل البيضاء في المنتصف */}
      <div
        className="h-36 sm:h-44 w-full flex items-center justify-center relative p-4"
        style={{
          backgroundColor: p.color,
        }}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
          <PinwheelFlower size={42} color="blue" />
        </div>

        {p.status === 'in_review' && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-white/90 text-gray-900 border border-gray-300">
            قيد المراجعة ⏳
          </span>
        )}
      </div>

      {/* الجزء السفلي الأبيض مع العنوان واسم العضو وزر GitHub */}
      <div className="p-5 sm:p-6 flex flex-col items-center text-center justify-between flex-1 gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-gray-950 mb-1">
            {p.title}
          </h3>
          <p className="text-xs font-bold text-gray-500">
            {p.memberName} · {p.stageName}
          </p>
        </div>

        <a
          href={p.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 rounded-full text-xs font-black text-gray-950 bg-white border-2 border-[#0F1729] hover:bg-gray-100 transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer no-underline active:scale-95"
        >
          <span>GitHub</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container py-8 sm:py-12 text-right"
      dir="rtl"
    >
      {/* ترويسة معرض المشاريع المطابقة تماماً لنموذج كود المعرض المرفق */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs font-bold text-gray-500">مسار الويب</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
            <span className="w-2 h-2 rounded-full bg-[#F9AB00]" />
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight mb-5">
          معرض المشاريع
        </h1>

        {/* فلاتر الحالة: الكل · مقبولة · قيد المراجعة */}
        <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-gray-100 border border-gray-200">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'approved', label: 'مقبولة' },
            { id: 'in_review', label: 'قيد المراجعة' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id as any)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border-none ${
                statusFilter === f.id
                  ? 'bg-[#0F1729] text-white shadow-xs'
                  : 'bg-transparent text-gray-600 hover:text-gray-950'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* القسم الأول: مهمات وتحديات الورش التطبيقية (مهمات الورش) */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black mb-1 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
              <span>مهمات وتحديات تابعة للورش</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950">
              مهمات الورش التطبيقية
            </h2>
          </div>
          <span className="text-xs font-bold text-gray-500">
            {workshopProjects.length} مهمة معتمدة
          </span>
        </div>

        {workshopProjects.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-xs text-gray-500 font-bold">
            لا توجد مهمات ورش تطابق الفلتر المختار
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {workshopProjects.map(renderCard)}
          </div>
        )}
      </div>

      {/* القسم الثاني: المعرض العام لمشاريع الأعضاء */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-950 text-xs font-black mb-1 border border-blue-300">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span>المشاريع الشاملة والابتكارية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950">
              المعرض العام لمشاريع الأعضاء
            </h2>
          </div>
          <span className="text-xs font-bold text-gray-500">
            {generalProjects.length} مشروع معتمد
          </span>
        </div>

        {generalProjects.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-xs text-gray-500 font-bold">
            لا توجد مشاريع عامة تطابق الفلتر المختار
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {generalProjects.map(renderCard)}
          </div>
        )}
      </div>
    </motion.div>
  );
};
