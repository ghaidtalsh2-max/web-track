import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Plus, Check, X, Sparkles, Github, Layers } from 'lucide-react';
import { UserProfile } from '../../types';
import { PinwheelFlower } from '../brand/PinwheelFlower';
import { store } from '../../services/store';
import confetti from 'canvas-confetti';

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
  liveUrl?: string;
  category: string;
}

const GDG_COLORS = ['#34A853', '#4285F4', '#F9AB00', '#EA4335'];

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ currentUser }) => {
  const [projects, setProjects] = useState<ShowcaseCardItem[]>(() => store.getShowcaseProjects());
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'in_review'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // نافذة إضافة مشروع جديد
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projGithub, setProjGithub] = useState('');
  const [projLive, setProjLive] = useState('');
  const [projCategory, setProjCategory] = useState('مشروع مسار الويب');
  const [projStage, setProjStage] = useState('المرحلة 01');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const workshops = store.getWorkshops();
  const tasks = store.getTasks();

  const categoryOptions = [
    { id: 'all', label: 'جميع الأعمال والورش' },
    { id: 'مشروع مسار الويب', label: 'مشروع مسار الويب' },
    ...workshops.map((w) => ({ id: w.title, label: `ورشة: ${w.title}` })),
    ...tasks.map((t) => ({ id: t.title, label: `مهمة: ${t.title}` })),
  ];

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projGithub.trim()) return;

    setIsSubmitting(true);
    const color = GDG_COLORS[projects.length % GDG_COLORS.length];

    const newProject: ShowcaseCardItem = {
      id: `proj-${Date.now()}`,
      title: projTitle.trim(),
      memberName: currentUser.fullName,
      stageName: projStage,
      status: currentUser.role === 'track_leader' || currentUser.role === 'supervisor' ? 'approved' : 'in_review',
      color,
      githubUrl: projGithub.trim(),
      liveUrl: projLive.trim() || undefined,
      category: projCategory,
    };

    store.addShowcaseProject(newProject);
    setProjects(store.getShowcaseProjects());

    if (currentUser.settings?.celebrations) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    setSuccessMsg('تم إضافة مشروعك بنجاح لمعرض المسار! ✨');
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setSuccessMsg('');
      setProjTitle('');
      setProjGithub('');
      setProjLive('');
    }, 1200);
  };

  const filteredProjects = projects.filter((p) => {
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
      {/* ترويسة معرض المشاريع المطابقة تماماً لصفحة 8 بالمرجع المعتمد */}
      <div className="flex flex-col items-center justify-center text-center mb-10 max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-3 px-2">
          {/* زر إضافة مشروع بارز */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn-pill px-5 py-2 text-xs font-black text-white bg-[#0F1729] hover:bg-gray-800 transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5 border-none"
          >
            <Plus size={15} />
            <span>+ أضف مشروعك للمعرض</span>
          </button>

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

        {/* فلاتر الحالة المعتمدة في صفحة 8: الكل · مقبولة · قيد المراجعة */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
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
          {categoryOptions.length > 2 && (
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
          )}
        </div>
      </div>

      {/* شبكة بطاقات المعرض المكونة من 3 أعمدة مطابقة تماماً لشكل صفحة 8 */}
      <div className="max-w-5xl mx-auto">
        {filteredProjects.length === 0 ? (
          <div className="p-12 sm:p-16 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xs">
              🖼️
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              معرض المشاريع بانتظار إبداعاتكم البرمجية ✨
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-md mx-auto mb-6">
              لا توجد مشاريع مضافة حالياً. شاركونا مشاريعكم وأعمالكم المتميزة في المسار ليتم عرضها في المعرض الرسمي للأعضاء!
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="btn-pill px-6 py-2.5 text-xs font-black text-white bg-[#0F1729] hover:bg-gray-800 transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <Plus size={16} />
              <span>+ أضف مشروعك الآن</span>
            </button>
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
                {/* الجزء العلوي الملون مع زهرة قوقل البيضاء في المنتصف تماماً كما في صفحة 8 */}
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

                  <div className="flex items-center gap-2">
                    <a
                      href={p.githubUrl.startsWith('http') ? p.githubUrl : `https://${p.githubUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-1.5 rounded-full text-xs font-black text-gray-950 bg-white border-2 border-[#0F1729] hover:bg-gray-100 transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer no-underline active:scale-95"
                    >
                      <span>GitHub</span>
                      <ExternalLink size={11} />
                    </a>

                    {p.liveUrl && (
                      <a
                        href={p.liveUrl.startsWith('http') ? p.liveUrl : `https://${p.liveUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-full text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all inline-flex items-center gap-1 no-underline"
                        title="معاينة حية للمشروع"
                      >
                        <span>معاينة</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* نافذة إضافة مشروع جديد للمعرض */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#0F1729] shadow-2xl text-right"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 border border-gray-900 flex items-center justify-center text-xl shadow-xs">
                    🚀
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      إضافة مشروع إلى معرض المسار
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      اعرض مهاراتك البرمجية وكودك على زملاء وقادة المسار
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer border-none"
                >
                  <X size={18} />
                </button>
              </div>

              {successMsg ? (
                <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 font-bold text-sm">
                  {successMsg}
                </div>
              ) : (
                <form onSubmit={handleAddProject} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      عنوان المشروع <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="مثال: تطبيق متجر إلكتروني متجاوب"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      رابط مستودع GitHub <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={projGithub}
                      onChange={(e) => setProjGithub(e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 ltr text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      رابط المعاينة الحية (Live Demo) — اختياري
                    </label>
                    <input
                      type="url"
                      value={projLive}
                      onChange={(e) => setProjLive(e.target.value)}
                      placeholder="https://my-app.vercel.app"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 ltr text-left"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        المرحلة البرمجية
                      </label>
                      <select
                        value={projStage}
                        onChange={(e) => setProjStage(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-800"
                      >
                        <option value="المرحلة 01">المرحلة 01 · الأساسيات</option>
                        <option value="المرحلة 02">المرحلة 02 · التصميم والتفاعل</option>
                        <option value="المرحلة 03">المرحلة 03 · التطبيقات الشاملة</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        التصنيف التابع
                      </label>
                      <input
                        type="text"
                        value={projCategory}
                        onChange={(e) => setProjCategory(e.target.value)}
                        placeholder="مشروع مسار الويب"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="btn-pill px-5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border-none cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !projTitle.trim() || !projGithub.trim()}
                      className="btn-pill px-7 py-2 text-xs font-black text-white bg-[#0F1729] hover:bg-gray-800 disabled:opacity-50 border-none cursor-pointer shadow-md"
                    >
                      {isSubmitting ? 'جاري الحفظ...' : 'حفظ ونشر في المعرض 🚀'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
