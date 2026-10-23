import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Filter, Plus, Check, X, Sparkles, FolderGit2 } from 'lucide-react';
import { UserProfile } from '../../types';
import { PinwheelFlower } from '../brand/PinwheelFlower';
import confetti from 'canvas-confetti';

interface ShowcaseViewProps {
  currentUser: UserProfile;
}

interface ShowcaseProject {
  id: string;
  title: string;
  memberName: string;
  stageName: string;
  status: 'approved' | 'in_review';
  color: 'yellow' | 'blue' | 'green' | 'red';
  githubUrl: string;
  liveUrl?: string;
  description?: string;
}

const INITIAL_SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'proj-1',
    title: 'صفحة تعريفية شخصية (Portfolio)',
    memberName: 'نورة العتيبي',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: 'yellow',
    githubUrl: 'https://github.com/gdgoc-taif/personal-portfolio',
    liveUrl: 'https://gdgoc-taif.github.io/personal-portfolio',
    description: 'واجهة تعريفية متكاملة بتصميم عصري ومتجاوب مع جميع الشاشات مدعومة بـ CSS Grid و Flexbox.',
  },
  {
    id: 'proj-2',
    title: 'بطاقة ملف عضو تفاعلية',
    memberName: 'دانا الحارثي',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: 'blue',
    githubUrl: 'https://github.com/gdgoc-taif/member-card-ui',
    liveUrl: 'https://gdgoc-taif.github.io/member-card-ui',
    description: 'بطاقة رقمية تفاعلية لعرض إنجازات ومهارات العضو مع تأثيرات ثلاثية الأبعاد.',
  },
  {
    id: 'proj-3',
    title: 'لعبة ذاكرة البطاقات البرمجية',
    memberName: 'أحمد الغامدي',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: 'green',
    githubUrl: 'https://github.com/gdgoc-taif/memory-game-js',
    liveUrl: 'https://gdgoc-taif.github.io/memory-game-js',
    description: 'تطبيق تفاعلي بلغة JavaScript لاختبار الذاكرة ومطابقة مصطلحات الويب مع حساب النقاط.',
  },
  {
    id: 'proj-4',
    title: 'قائمة مهام تفاعلية (Todo Web App)',
    memberName: 'سارة الزهراني',
    stageName: 'المرحلة 02',
    status: 'in_review',
    color: 'red',
    githubUrl: 'https://github.com/gdgoc-taif/task-manager-app',
    liveUrl: 'https://gdgoc-taif.github.io/task-manager-app',
    description: 'تطبيق إدارة مهام بخصائص الحفظ المحلي LocalStorage وتصنيف الأولويات.',
  },
  {
    id: 'proj-5',
    title: 'صفحة هبوط لورشة تقنية',
    memberName: 'ريان الثبيتي',
    stageName: 'المرحلة 02',
    status: 'approved',
    color: 'blue',
    githubUrl: 'https://github.com/gdgoc-taif/workshop-landing',
    liveUrl: 'https://gdgoc-taif.github.io/workshop-landing',
    description: 'صفحة تسجيل في ورش مسار الويب مع عداد تنازلي واستمارة تفاعلية.',
  },
  {
    id: 'proj-6',
    title: 'حاسبة ويب تفاعلية',
    memberName: 'لمى القرشي',
    stageName: 'المرحلة 02',
    status: 'in_review',
    color: 'yellow',
    githubUrl: 'https://github.com/gdgoc-taif/web-calculator',
    liveUrl: 'https://gdgoc-taif.github.io/web-calculator',
    description: 'حاسبة متطورة تدعم العمليات الحسابية المتقدمة والتاريخ الحسابي.',
  },
];

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ currentUser }) => {
  const [projects, setProjects] = useState<ShowcaseProject[]>(INITIAL_SHOWCASE_PROJECTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'approved' | 'in_review'>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGithub, setNewGithub] = useState('');
  const [newLive, setNewLive] = useState('');

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'approved') return p.status === 'approved';
    if (activeFilter === 'in_review') return p.status === 'in_review';
    return true;
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newGithub.trim()) return;

    const newProj: ShowcaseProject = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      memberName: currentUser.fullName,
      stageName: 'المرحلة 02',
      status: currentUser.role === 'track_leader' || currentUser.role === 'supervisor' ? 'approved' : 'in_review',
      color: 'blue',
      githubUrl: newGithub.trim(),
      liveUrl: newLive.trim() || undefined,
      description: 'مشروع مميز تم تسليمه عبر مسار الويب التفاعلي.',
    };

    setProjects([newProj, ...projects]);
    setNewTitle('');
    setNewGithub('');
    setNewLive('');
    setAddModalOpen(false);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#4285F4', '#34A853', '#F9AB00', '#EA4335'],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container py-8 sm:py-12 text-right"
    >
      {/* رأس الصفحة مع شارة المسار والتحكم ثلاثي الأبعاد */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4] animate-pulse" />
            <span className="text-xs font-bold text-gray-500">مسار الويب · إنتاج ومشاريع الأعضاء</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            معرض المشاريع
          </h1>
        </div>

        {/* أزرار التصفية وإضافة مشروع جديد */}
        <div className="flex flex-wrap items-center gap-3">
          {/* أزرار التصفية الثلاثية الأبعاد */}
          <div className="flex items-center bg-gray-100 p-1 rounded-2xl border-2 border-[#0F1729]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              الكل ({projects.length})
            </button>
            <button
              onClick={() => setActiveFilter('approved')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeFilter === 'approved'
                  ? 'bg-[#34A853] text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              مقبولة ✓
            </button>
            <button
              onClick={() => setActiveFilter('in_review')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeFilter === 'in_review'
                  ? 'bg-[#F9AB00] text-gray-950 font-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              قيد المراجعة ⏳
            </button>
          </div>

          {/* زر إضافة مشروع جديد ثلاثي الأبعاد */}
          <button
            onClick={() => setAddModalOpen(true)}
            className="btn-3d btn-3d-blue px-4 py-2 text-xs font-black cursor-pointer shadow-md"
          >
            <Plus size={14} />
            <span>أضف مشروعك</span>
          </button>
        </div>
      </div>

      {/* شبكة بطاقات المشاريع ثلاثية الأبعاد */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => {
          const headerBg =
            p.color === 'yellow'
              ? '#F9AB00'
              : p.color === 'blue'
              ? '#4285F4'
              : p.color === 'green'
              ? '#34A853'
              : '#EA4335';

          return (
            <div
              key={p.id}
              className="card-3d-tactile overflow-hidden flex flex-col justify-between"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '26px',
              }}
            >
              {/* الرأس الملون مع وردة الهوية المطابقة لصفحة 10 */}
              <div
                className="h-32 flex items-center justify-center relative overflow-hidden border-b-2 border-[#0F1729]"
                style={{ backgroundColor: headerBg }}
              >
                <div className="scale-125 opacity-90 drop-shadow-md">
                  <PinwheelFlower color="multi" size={64} animate={false} />
                </div>

                {/* شارة حالة المراجعة */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-black border-2 border-[#0F1729] shadow-xs ${
                      p.status === 'approved'
                        ? 'bg-white text-green-700'
                        : 'bg-white text-amber-800'
                    }`}
                  >
                    {p.status === 'approved' ? 'معتمد ✓' : 'قيد المراجعة ⏳'}
                  </span>
                </div>
              </div>

              {/* جسم البطاقة */}
              <div className="p-5 text-right flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-gray-900 mb-1 leading-snug">
                    {p.title}
                  </h3>
                  <div className="text-xs text-gray-500 font-bold mb-3">
                    {p.memberName} · <span className="text-blue-600">{p.stageName}</span>
                  </div>
                  {p.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      {p.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d btn-3d-gray px-3 py-1.5 text-xs font-black inline-flex items-center gap-1.5"
                  >
                    <FolderGit2 size={13} />
                    <span>كود GitHub</span>
                  </a>

                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-3d btn-3d-blue px-3 py-1.5 text-xs font-black inline-flex items-center gap-1.5"
                    >
                      <span>معاينة حية</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* نافذة إضافة مشروع منبثقة مع تعتيم كامل وبروز 3D */}
      <AnimatePresence>
        {addModalOpen && (
          <div
            className="modal-backdrop-dark"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(10, 15, 29, 0.82)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setAddModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="modal-3d-card w-full max-w-lg p-6 sm:p-8 text-right"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2.5px solid #0F1729',
                borderRadius: '32px',
                boxShadow: '0 30px 70px -10px rgba(0, 0, 0, 0.5), 0 8px 0 0 #0F1729',
              }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black border-2 border-[#0F1729]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">
                      إضافة مشروع إلى المعرض
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      شارك عملك البرمجي مع أعضاء وقادة المسار
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAddModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all cursor-pointer border border-gray-200"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddProject} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-900 mb-1.5">
                    عنوان المشروع
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: موقع تعريفي بتصميم متجاوب"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-white border-2 border-[#0F1729] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-900 mb-1.5">
                    رابط مستودع GitHub
                  </label>
                  <input
                    type="url"
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-white border-2 border-[#0F1729] font-mono text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="ltr"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-900 mb-1.5">
                    رابط المعاينة الحية (اختياري)
                  </label>
                  <input
                    type="url"
                    value={newLive}
                    onChange={(e) => setNewLive(e.target.value)}
                    placeholder="https://username.github.io/project"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-white border-2 border-[#0F1729] font-mono text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="ltr"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="btn-3d btn-3d-gray px-5 py-2 text-xs font-black"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn-3d btn-3d-blue px-6 py-2 text-xs font-black"
                  >
                    نشر في المعرض 🚀
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
