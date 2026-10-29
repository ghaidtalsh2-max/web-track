import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, FolderCode } from 'lucide-react';
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
  color: string;
  githubUrl: string;
  category: 'workshop' | 'general';
}

const APPROVED_PROJECTS: ShowcaseCardItem[] = [
  // مهمات الورش التطبيقية المعتمدة
  {
    id: 'ws-proj-1',
    title: 'بطاقة ملف عضو تفاعلية',
    memberName: 'أعضاء المسار المعتمدون',
    stageName: 'ورشة الويب',
    color: '#34A853', // أخضر
    githubUrl: 'https://github.com',
    category: 'workshop',
  },
  {
    id: 'ws-proj-2',
    title: 'صفحة تعريفية شخصية',
    memberName: 'أعضاء المسار المعتمدون',
    stageName: 'ورشة الويب',
    color: '#4285F4', // أزرق
    githubUrl: 'https://github.com',
    category: 'workshop',
  },
  // المعرض العام لمشاريع الأعضاء المعتمدة
  {
    id: 'gen-proj-1',
    title: 'لعبة ذاكرة تفاعلية',
    memberName: 'أعضاء المسار المعتمدون',
    stageName: 'مشروع المسار',
    color: '#34A853', // أخضر
    githubUrl: 'https://github.com',
    category: 'general',
  },
  {
    id: 'gen-proj-2',
    title: 'حاسبة تقنية حديثة',
    memberName: 'أعضاء المسار المعتمدون',
    stageName: 'مشروع المسار',
    color: '#F9AB00', // أصفر
    githubUrl: 'https://github.com',
    category: 'general',
  },
];

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ currentUser }) => {
  const workshopProjects = APPROVED_PROJECTS.filter((p) => p.category === 'workshop');
  const generalProjects = APPROVED_PROJECTS.filter((p) => p.category === 'general');

  const renderCard = (p: ShowcaseCardItem) => (
    <div
      key={p.id}
      className="card-3d-tactile rounded-3xl overflow-hidden bg-white border-2 border-[#0F1729] flex flex-col transition-all hover:-translate-y-1"
      style={{
        borderRadius: '24px',
        boxShadow: '0 4px 0 0 #0F1729',
      }}
    >
      {/* الجزء العلوي الملون بحجم صغير وأنيق مع زهرة أو أيقونة برمجية */}
      <div
        className="h-24 sm:h-28 w-full flex items-center justify-center relative p-3"
        style={{
          backgroundColor: p.color,
        }}
      >
        <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-xs flex items-center justify-center shadow-xs border border-white/40">
          <PinwheelFlower size={28} color="blue" />
        </div>
      </div>

      {/* الجزء السفلي مع العنوان واسم العضو وزر GitHub */}
      <div className="p-4 sm:p-5 flex flex-col items-center text-center justify-between flex-1 gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-black text-gray-950 mb-1">
            {p.title}
          </h3>
          <p className="text-xs font-bold text-gray-500">
            {p.memberName}
          </p>
        </div>

        <a
          href={p.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 rounded-full text-xs font-black text-gray-950 bg-white border-2 border-[#0F1729] hover:bg-gray-100 transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer no-underline active:scale-95"
        >
          <span>GitHub</span>
          <ExternalLink size={11} />
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
      {/* ترويسة معرض المشاريع */}
      <div className="flex flex-col items-center justify-center text-center mb-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs font-bold text-gray-500">مسار الويب</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
            <span className="w-2 h-2 rounded-full bg-[#F9AB00]" />
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight mb-2">
          معرض المشاريع
        </h1>
        <p className="text-xs sm:text-sm font-bold text-gray-500">
          منصة استعراض التطبيقات والأعمال المعتمدة لمطوري ومطورات مسار الويب ✨
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* القسم الأول: مهمات وتحديات الورش التطبيقية */}
        <div>
          <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-gray-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black mb-1 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                <span>مهمات الورش المعتمدة</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950">
                مهمات الورش التطبيقية
              </h2>
            </div>
            <span className="text-xs font-bold text-gray-500">
              {workshopProjects.length} مهمة معروضة
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {workshopProjects.map(renderCard)}
            {/* بطاقة شاغرة لمشروع قادم */}
            <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[190px]">
              <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                <FolderCode size={20} />
              </div>
              <div className="text-xs font-bold text-gray-500">
                أيقونة شاغرة لمهمة ورشة قادمة
              </div>
            </div>
          </div>
        </div>

        {/* القسم الثاني: المعرض العام لمشاريع الأعضاء */}
        <div>
          <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-gray-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-950 text-xs font-black mb-1 border border-blue-300">
                <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                <span>المشاريع البرمجية الشاملة</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950">
                المعرض العام لمشاريع الأعضاء
              </h2>
            </div>
            <span className="text-xs font-bold text-gray-500">
              {generalProjects.length} مشروع معروض
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {generalProjects.map(renderCard)}
            {/* بطاقة شاغرة لمشروع قادم */}
            <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[190px]">
              <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                <Sparkles size={20} />
              </div>
              <div className="text-xs font-bold text-gray-500">
                أيقونة شاغرة لمشروع قادم
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
