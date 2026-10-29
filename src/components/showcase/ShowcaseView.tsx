import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Filter } from 'lucide-react';
import { UserProfile } from '../../types';
import { PinwheelFlower } from '../brand/PinwheelFlower';
import { store } from '../../services/store';

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
  category: string; // اسم الورشة أو المهمة للتصنيف
}

const DEFAULT_PROJECTS: ShowcaseCardItem[] = [
  {
    id: 'proj-1',
    title: 'لعبة ذاكرة',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: '#34A853', // أخضر
    githubUrl: 'https://github.com',
    category: 'مشروع المسار الشامل',
  },
  {
    id: 'proj-2',
    title: 'بطاقة ملف عضو',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: '#4285F4', // أزرق
    githubUrl: 'https://github.com',
    category: 'ورشة Flexbox و CSS Grid',
  },
  {
    id: 'proj-3',
    title: 'صفحة تعريفية شخصية',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: '#F9AB00', // أصفر
    githubUrl: 'https://github.com',
    category: 'ورشة Flexbox و CSS Grid',
  },
  {
    id: 'proj-4',
    title: 'حاسبة بسيطة',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: '#F9AB00', // أصفر
    githubUrl: 'https://github.com',
    category: 'مشروع المسار الشامل',
  },
  {
    id: 'proj-5',
    title: 'صفحة هبوط لورشة',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'in_review',
    color: '#4285F4', // أزرق
    githubUrl: 'https://github.com',
    category: 'ورشة Flexbox و CSS Grid',
  },
  {
    id: 'proj-6',
    title: 'قائمة مهام',
    memberName: '[اسم العضو]',
    stageName: 'المرحلة 02',
    status: 'in_review',
    color: '#EA4335', // أحمر
    githubUrl: 'https://github.com',
    category: 'مشروع المسار الشامل',
  },
];

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ currentUser }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'in_review'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const workshops = store.getWorkshops();
  const tasks = store.getTasks();

  // تجميع خيارات التصنيف حسب الورش أو المهام المعتمدة
  const categoryOptions = [
    { id: 'all', label: 'جميع الأعمال والورش' },
    ...workshops.map((w) => ({ id: w.title, label: `ورشة: ${w.title}` })),
    ...tasks.map((t) => ({ id: t.title, label: `مهمة: ${t.title}` })),
    { id: 'ورشة Flexbox و CSS Grid', label: 'ورشة Flexbox و CSS Grid' },
    { id: 'مشروع المسار الشامل', label: 'المشاريع الشاملة' },
  ];

  // تصفية المشاريع بحسب الحالة والورشة/المهمة
  const filteredProjects = DEFAULT_PROJECTS.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesStatus && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container py-8 sm:py-12 text-right"
      dir="rtl"
    >
      {/* ترويسة معرض المشاريع المطابقة تماماً لمخطط Claude (صفحة 4 في المرجع) */}
      <div className="flex flex-col items-center justify-center text-center mb-10 max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-3 px-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
            بيانات تجريبية
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">مسار الويب</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
              <span className="w-2 h-2 rounded-full bg-[#F9AB00]" />
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight mb-5">
          معرض المشاريع
        </h1>

        {/* فلاتر الحالة وتصنيف الورش/المهام جنباً إلى جنب */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
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

          {/* قائمة التصنيف حسب الورشة أو المهمة */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 text-xs sm:text-sm font-black rounded-2xl bg-white border border-gray-300 text-gray-800 focus:outline-none shadow-xs cursor-pointer"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* شبكة بطاقات المعرض المكونة من 3 أعمدة متناسقة مطابقة لمخطط Claude */}
      <div className="max-w-5xl mx-auto">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
            <p className="text-sm font-bold text-gray-600 mb-1">
              لا توجد مشاريع مسجلة تحت هذا التصنيف حالياً
            </p>
            <p className="text-xs text-gray-400">
              اختر تصنيفاً آخر أو تابع إنجاز وتسليم مهام المسار لتظهر أعمالك هنا ✨
            </p>
          </div>
        ) : (
          <div className="showcase-cards-grid">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="card-3d-tactile rounded-3xl overflow-hidden bg-white border-2 border-[#0F1729] flex flex-col transition-all hover:-translate-y-1"
                style={{
                  borderRadius: '24px',
                  boxShadow: '0 4px 0 0 #0F1729',
                }}
              >
                {/* الجزء العلوي الملون مع زهرة قوقل البيضاء الرسمية في المنتصف */}
                <div
                  className="h-36 sm:h-40 w-full flex items-center justify-center relative p-4"
                  style={{
                    backgroundColor: p.color,
                  }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/25 backdrop-blur-xs flex items-center justify-center shadow-xs">
                    <PinwheelFlower size={48} color="white" />
                  </div>

                  {p.status === 'in_review' && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-white/95 text-gray-900 border border-gray-300 shadow-2xs">
                      قيد المراجعة ⏳
                    </span>
                  )}
                </div>

                {/* الجزء السفلي الأبيض مع العنوان واسم العضو والمرحلة وزر GitHub */}
                <div className="p-5 sm:p-6 flex flex-col items-center text-center justify-between flex-1 gap-3.5">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-gray-950 mb-1">
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
                    className="px-6 py-1.5 rounded-full text-xs font-black text-gray-950 bg-white border-2 border-[#0F1729] hover:bg-gray-100 transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer no-underline active:scale-95"
                  >
                    <span>GitHub</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
