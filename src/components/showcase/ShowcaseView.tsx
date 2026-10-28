import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, FolderGit2, Sparkles, Filter, Check, Clock } from 'lucide-react';
import { UserProfile } from '../../types';

interface ShowcaseViewProps {
  currentUser: UserProfile;
}

interface ShowcaseProject {
  id: string;
  title: string;
  memberName: string;
  stageName: string;
  status: 'approved' | 'in_review';
  color: string;
  githubUrl: string;
  liveUrl?: string;
  description: string;
  taskType: 'workshop' | 'side_fun' | 'side_learn' | 'general';
  taskCategoryLabel: string;
}

const INITIAL_PROJECTS: ShowcaseProject[] = [];

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ currentUser }) => {
  const [activeMainTab, setActiveMainTab] = useState<'general' | 'by_task'>('general');
  const [selectedTaskFilter, setSelectedTaskFilter] = useState<string>('all');
  const [projects, setProjects] = useState<ShowcaseProject[]>(INITIAL_PROJECTS);

  const isLeader = currentUser.role === 'track_leader' || currentUser.role === 'supervisor';

  // تصفية المشاريع: المشاريع المعتمدة تظهر للجميع، ومشاريع قيد المراجعة تظهر لصاحبها أو للقائد فقط
  const visibleProjects = projects.filter((p) => {
    if (isLeader) return true;
    if (p.status === 'approved') return true;
    return p.memberName === currentUser.fullName;
  });

  // تطبيق فلتر التبويب الرئيسي وفلتر الشرائح
  const displayedProjects = visibleProjects.filter((p) => {
    if (activeMainTab === 'general') {
      return true; // المعرض العام يعرض جميع الأعمال
    }
    // تبويب حسب المهمة
    if (selectedTaskFilter === 'all') return true;
    if (selectedTaskFilter === 'workshop') return p.taskType === 'workshop';
    if (selectedTaskFilter === 'side_fun') return p.taskType === 'side_fun';
    if (selectedTaskFilter === 'side_learn') return p.taskType === 'side_learn';
    return true;
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
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4] animate-pulse" />
            <span className="text-xs font-bold text-gray-500">مسار الويب · إنتاج ومشاريع الأعضاء المعتمدة</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            معرض الأعمال والمشاريع
          </h1>
        </div>

        <div className="text-xs font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
          إجمالي المشاريع المعروضة: {displayedProjects.length} مشروع
        </div>
      </div>

      {/* التبويبان الرئيسيان: «المعرض العام» و «حسب المهمة» */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveMainTab('general');
            setSelectedTaskFilter('all');
          }}
          className={`px-6 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer border-2 ${
            activeMainTab === 'general'
              ? 'bg-[#4285F4] text-[#0F172A] border-[#0F172A] shadow-md -translate-y-0.5'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
          }`}
        >
          المعرض العام (كل الأعمال المعتمدة)
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('by_task')}
          className={`px-6 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer border-2 ${
            activeMainTab === 'by_task'
              ? 'bg-[#F9AB00] text-[#0F172A] border-[#0F172A] shadow-md -translate-y-0.5'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
          }`}
        >
          حسب المهمة والورشة
        </button>
      </div>

      {/* شريط الشرائح (Chips) للتصفية عند اختيار تبويب «حسب المهمة» */}
      {activeMainTab === 'by_task' && (
        <div className="flex flex-wrap items-center gap-2 mb-8 p-3 rounded-2xl bg-white border-2 border-[#0F172A] shadow-xs rise">
          <span className="text-xs font-black text-gray-800 ml-2">تصفية حسب:</span>
          {[
            { id: 'all', label: 'جميع المهام' },
            { id: 'workshop', label: 'ورشة Flexbox و CSS Grid' },
            { id: 'side_fun', label: 'تحديات جانبية - متعة' },
            { id: 'side_learn', label: 'تحديات جانبية - تعلّم' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setSelectedTaskFilter(chip.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                selectedTaskFilter === chip.id
                  ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* شبكة بطاقات المشاريع الحقيقية بنظام المعرض الفني */}
      {displayedProjects.length === 0 ? (
        <div className="flex flex-col gap-6">
          <div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-gray-300 shadow-xs">
            <Sparkles size={32} className="mx-auto text-blue-500 mb-2" />
            <h3 className="text-base font-black text-gray-900 mb-1">
              المعرض جاهز لاستقبال أعمال ومشاريع الأعضاء
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              حالياً لا توجد مشاريع منشورة. عند تسليم المهام واعتمادها من قادة المسار، ستظهر المشاريع الحقيقية هنا تلقائياً.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((slot) => (
              <div
                key={slot}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/70 p-6 flex flex-col items-center justify-center min-h-[300px] text-center"
              >
                {/* شريط متصفح مصغر فارغ */}
                <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-gray-100" dir="ltr">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  </div>
                  <span className="text-[10px] text-gray-300 font-mono">project-slot-0{slot}</span>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mb-4">
                  <FolderGit2 size={28} className="text-gray-300" />
                </div>
                <div className="w-24 h-2.5 bg-gray-200 rounded-full mb-2" />
                <div className="w-36 h-2 bg-gray-100 rounded-full mb-6" />
                <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  أيقونة شاغرة لمشروع قادم #{slot}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="showcase-grid">
          {displayedProjects.map((p, idx) => {
            // استخراج الحرف الأول من اسم العضو للأفاتار
            const initials = p.memberName.split(' ').map(n => n[0]).join('').slice(0, 2);
            // تحديد رابط مصغر لشريط المتصفح
            const miniDomain = p.liveUrl 
              ? p.liveUrl.replace('https://', '').replace('.github.io', '')
              : 'project.gdgoc.dev';

            return (
              <div
                key={p.id}
                className="showcase-card"
                style={{
                  '--i': idx,
                } as React.CSSProperties}
              >
                {/* شريط متصفح ماك العصري بأزرار جهة اليسار (Mac LTR Header) */}
                <div className="showcase-browser-bar" dir="ltr">
                  <div className="showcase-browser-dots">
                    <span className="browser-dot red" />
                    <span className="browser-dot yellow" />
                    <span className="browser-dot green" />
                  </div>
                  <div className="showcase-browser-url">
                    {miniDomain}
                  </div>
                  <div className="flex items-center gap-1.5" dir="rtl">
                    {p.status === 'in_review' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                        <Clock size={10} />
                        <span>مراجعة</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Check size={10} />
                        <span>معتمد</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* لوحة المعاينة التفاعلية المصغرة لمخرجات المشروع الفعلي */}
                <div
                  className="showcase-preview-canvas"
                  style={{
                    backgroundColor: `${p.color}14`, // خلفية شفافة من لون الهوية
                  }}
                >
                  {/* محاكاة واجهة متجر Grid */}
                  {p.id === 'proj-1' && (
                    <div className="w-[88%] h-[84%] bg-white rounded-xl border border-slate-300 p-2.5 shadow-sm flex flex-col justify-between" dir="ltr">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                        <span className="text-[11px] font-extrabold text-blue-600">Product Grid Store</span>
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 py-1">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 flex flex-col items-center gap-1">
                            <div className="w-full h-8 bg-blue-50 rounded flex items-center justify-center text-[12px]">🛍️</div>
                            <div className="w-3/4 h-1.5 bg-slate-200 rounded" />
                            <div className="w-1/2 h-1.5 bg-blue-500 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* محاكاة لوحة الإحصائيات Dashboard */}
                  {p.id === 'proj-2' && (
                    <div className="w-[88%] h-[84%] bg-slate-900 rounded-xl border border-slate-700 p-2.5 shadow-sm flex flex-col justify-between text-white" dir="ltr">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <span className="text-[11px] font-extrabold text-amber-400">Analytics Widget</span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">+28%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 py-1">
                        <div className="bg-slate-800/80 rounded-lg p-1.5 border border-slate-700">
                          <div className="text-[9px] text-slate-400">Total Visits</div>
                          <div className="text-xs font-black text-amber-300">14.8K</div>
                        </div>
                        <div className="bg-slate-800/80 rounded-lg p-1.5 border border-slate-700">
                          <div className="text-[9px] text-slate-400">Avg Session</div>
                          <div className="text-xs font-black text-emerald-300">4m 12s</div>
                        </div>
                      </div>
                      <div className="flex items-end gap-1 h-6 pt-1">
                        {[40, 65, 30, 85, 95, 70, 100].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-amber-400 rounded-t"
                            style={{ height: `${h}%`, opacity: 0.7 + (i * 0.05) }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* محاكاة زر Keyframes الساحر */}
                  {p.id === 'proj-3' && (
                    <div className="w-[88%] h-[84%] bg-gradient-to-br from-emerald-950 to-slate-900 rounded-xl border border-emerald-700/60 p-3 shadow-sm flex flex-col items-center justify-center gap-2" dir="ltr">
                      <div className="text-[10px] font-bold text-emerald-300 mb-1">CSS Keyframes Animation</div>
                      <div className="relative group cursor-pointer">
                        <div className="px-5 py-2 rounded-full font-black text-xs bg-emerald-500 text-slate-950 border-2 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.6)] flex items-center gap-2">
                          <Sparkles size={13} className="text-slate-950" />
                          <span>Magic Button ✨</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* محاكاة صفحة Portfolio */}
                  {p.id === 'proj-4' && (
                    <div className="w-[88%] h-[84%] bg-white rounded-xl border border-slate-300 p-2.5 shadow-sm flex flex-col justify-between" dir="ltr">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-red-500 text-white font-black text-[11px] flex items-center justify-center border border-slate-800">
                          س
                        </div>
                        <div>
                          <div className="text-[11px] font-black text-slate-900">Sara Al-Zahrani</div>
                          <div className="text-[9px] text-slate-500">Frontend Developer</div>
                        </div>
                      </div>
                      <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-700">{'<WebTrackShowcase />'}</div>
                      </div>
                      <div className="flex gap-1">
                        <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">HTML5</span>
                        <span className="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">CSS3</span>
                        <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Responsive</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* متن البطاقة: عنوان ووصف وبطاقة العضو وأزرار العمل */}
                <div className="showcase-card-body">
                  <div>
                    {/* وسم فئة المهمة والورشة */}
                    <div className="mb-2">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold"
                        style={{
                          backgroundColor: `${p.color}20`,
                          color: p.color === '#F9AB00' ? '#B45309' : p.color,
                          border: `1.5px solid ${p.color}`,
                        }}
                      >
                        {p.taskCategoryLabel}
                      </span>
                    </div>

                    <h3 className="showcase-card-title">
                      {p.title}
                    </h3>

                    <p className="showcase-card-desc">
                      {p.description}
                    </p>
                  </div>

                  {/* معلومات العضو الصانع */}
                  <div>
                    <div className="showcase-author-row">
                      <div
                        className="showcase-author-avatar"
                        style={{ backgroundColor: p.color }}
                      >
                        {initials}
                      </div>
                      <div className="showcase-author-meta">
                        <span className="showcase-author-name">{p.memberName}</span>
                        <span className="showcase-author-stage">{p.stageName}</span>
                      </div>
                    </div>

                    {/* زرا المعاينة والكود */}
                    <div className="showcase-actions-row">
                      {p.liveUrl ? (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="showcase-btn-demo"
                        >
                          <ExternalLink size={14} />
                          <span>معاينة حية</span>
                        </a>
                      ) : (
                        <span className="showcase-btn-demo" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                          <span>قريباً</span>
                        </span>
                      )}

                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="showcase-btn-code"
                      >
                        <FolderGit2 size={14} />
                        <span>الكود المصدري</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
