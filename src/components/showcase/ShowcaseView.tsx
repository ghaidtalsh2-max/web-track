import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Plus, X } from 'lucide-react';
import { UserProfile } from '../../types';
import { store } from '../../services/store';
import { isFemaleUser, gText } from '../../utils/gender';
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
  isWorkshopTask?: boolean;
}

const GDG_COLORS = ['#F9AB00', '#4285F4', '#34A853', '#EA4335'];

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ currentUser }) => {
  const isFemale = isFemaleUser(currentUser);
  const [projects, setProjects] = useState<ShowcaseCardItem[]>(() => store.getShowcaseProjects());
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'in_review'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'workshop' | 'free'>('all');

  // نافذة إضافة مشروع جديد
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projGithub, setProjGithub] = useState('');
  const [projLive, setProjLive] = useState('');
  const [projCategory, setProjCategory] = useState<'free' | 'workshop'>('free');
  const [projStage, setProjStage] = useState('المرحلة 02');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
      status: currentUser.role === 'track_leader' || currentUser.role === 'co_leader' ? 'approved' : 'in_review',
      color,
      githubUrl: projGithub.trim(),
      liveUrl: projLive.trim() || undefined,
      category: projCategory === 'workshop' ? 'تطبيق ورشة' : 'المشاريع الحرة',
      isWorkshopTask: projCategory === 'workshop',
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

    setSuccessMsg(gText(isFemale, 'تم إضافة مشروعكِ بنجاح لمعرض المسار! ✨', 'تم إضافة مشروعكَ بنجاح لمعرض المسار! ✨'));
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
    const matchesType =
      typeFilter === 'all'
        ? true
        : typeFilter === 'workshop'
        ? p.isWorkshopTask || p.category?.includes('ورشة')
        : !p.isWorkshopTask && !p.category?.includes('ورشة');
    return matchesStatus && matchesType;
  });

  return (
    <div className="container py-8 sm:py-10 text-right" dir="rtl" style={{ maxWidth: '1440px' }}>
      {/* 1. السطر العلوي: علامة مسار الويب ونقاط قوقل + زر الإضافة وشارة البيانات التجريبية */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }} className="flex-wrap gap-4">
        <b style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#4285F4' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#EA4335' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#F9AB00' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#34A853' }} />
          <span>مسار الويب</span>
        </b>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="t-proto" style={{ background: '#FFF4D6' }}>
            بيانات تجريبية
          </span>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="b-proto y"
            style={{ padding: '8px 24px', minHeight: '44px', fontSize: '16px' }}
          >
            <Plus size={16} />
            <span>{gText(isFemale, '+ أضيفي مشروعكِ', '+ أضف مشروعكَ')}</span>
          </button>
        </div>
      </div>

      {/* 2. عنوان المعرض الرئيسي والنبذة */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '56px', lineHeight: 1.1, fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>
          معرض المشاريع
        </h1>
        <p style={{ fontSize: '19px', color: '#5f6673', margin: 0, fontWeight: 500 }}>
          إبداعات وتطبيقات أعضاء مسار الويب في الورش والمهام البرمجية والمشاريع الحرة.
        </p>
      </div>

      {/* 3. شريط الفلاتر الأنيق والمرتب (بدون أي حوسة) */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
        {/* تصنيف النوع: الكل / تطبيقات الورش / المشاريع الحرة */}
        <div className="tabs-proto">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={typeFilter === 'all' ? 'on' : ''}
          >
            الكل ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('workshop')}
            className={typeFilter === 'workshop' ? 'on' : ''}
          >
            تطبيقات الورش ({projects.filter((p) => p.isWorkshopTask || p.category?.includes('ورشة')).length})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('free')}
            className={typeFilter === 'free' ? 'on' : ''}
          >
            المشاريع الحرة ({projects.filter((p) => !p.isWorkshopTask && !p.category?.includes('ورشة')).length})
          </button>
        </div>

        {/* فلاتر الحالة: الكل / مقبولة / قيد المراجعة */}
        <div className="tabs-proto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={statusFilter === 'all' ? 'on' : ''}
          >
            جميع الحالات
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('approved')}
            className={statusFilter === 'approved' ? 'on' : ''}
          >
            مقبولة
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('in_review')}
            className={statusFilter === 'in_review' ? 'on' : ''}
          >
            قيد المراجعة
          </button>
        </div>
      </div>

      {/* 4. شبكة البطاقات الثلاثية المرتبة والمطابقة للنموذج media_1793352523107.html بالملي */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p, idx) => {
          const bannerBg = p.color || GDG_COLORS[idx % GDG_COLORS.length];
          const isWorkshop = p.isWorkshopTask || p.category?.includes('ورشة');

          return (
            <div
              key={p.id}
              className="k"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderRadius: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* الجزء العلوي الملون 130px مع زهرة قوقل الهندسية البيضاء */}
              <div
                style={{
                  height: '130px',
                  backgroundColor: bannerBg,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* زهرة قوقل الهندسية SVG الدائرية */}
                <svg
                  viewBox="-50 -50 100 100"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    width: '90px',
                    height: '90px',
                    left: '20px',
                    top: '20px',
                    opacity: 0.95,
                  }}
                >
                  <g fill="#ffffff">
                    <path d="M0 0L0 -46A46 46 0 0 1 46 0Q20 -26 0 0Z" />
                    <path transform="rotate(90)" d="M0 0L0 -46A46 46 0 0 1 46 0Q20 -26 0 0Z" />
                    <path transform="rotate(180)" d="M0 0L0 -46A46 46 0 0 1 46 0Q20 -26 0 0Z" />
                    <path transform="rotate(270)" d="M0 0L0 -46A46 46 0 0 1 46 0Q20 -26 0 0Z" />
                  </g>
                </svg>

                {/* شارة نوع المشروع أو حالة المراجعة على زاوية الغلاف */}
                <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '6px' }}>
                  {isWorkshop && (
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '99px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: '#ffffff',
                        color: '#0F172A',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}
                    >
                      تطبيق ورشة
                    </span>
                  )}
                  {p.status === 'in_review' && (
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '99px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: '#FFF4D6',
                        color: '#0F172A',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}
                    >
                      قيد المراجعة ⏳
                    </span>
                  )}
                </div>
              </div>

              {/* الجزء السفلي: تفاصيل المشروع وصاحب العمل والأزرار */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <b style={{ fontSize: '22px', color: '#0F172A', display: 'block', lineHeight: 1.3, marginBottom: '6px' }}>
                    {p.title}
                  </b>
                  <p style={{ margin: '0 0 16px', fontSize: '15px', color: '#5f6673', fontWeight: 600 }}>
                    {p.memberName} · {p.stageName || 'المرحلة 02'}
                  </p>
                </div>

                {/* أزرار الإجراءات: زر GitHub وزر المعاينة */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
                  <a
                    href={p.githubUrl?.startsWith('http') ? p.githubUrl : `https://${p.githubUrl || 'github.com'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="b-proto"
                    style={{
                      background: '#E8EAED',
                      color: '#0F172A',
                      padding: '8px 24px',
                      fontSize: '16px',
                      minHeight: '42px',
                      textDecoration: 'none',
                    }}
                  >
                    GitHub
                  </a>

                  {p.liveUrl && (
                    <a
                      href={p.liveUrl.startsWith('http') ? p.liveUrl : `https://${p.liveUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="b-proto"
                      style={{
                        background: '#E8F0FE',
                        color: '#4285F4',
                        padding: '8px 18px',
                        fontSize: '14px',
                        minHeight: '42px',
                        textDecoration: 'none',
                        border: '1.5px solid #4285F4',
                      }}
                    >
                      <span>معاينة حية</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. نافذة إضافة مشروع جديد للمعرض */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="k w-full max-w-lg text-right"
              style={{ padding: '32px', backgroundColor: '#ffffff', borderRadius: '28px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  إضافة مشروع إلى المعرض
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    background: '#F1F3F4',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {successMsg ? (
                <div style={{ padding: '20px', borderRadius: '16px', background: '#E6F4EA', color: '#137333', fontWeight: 700, textAlign: 'center' }}>
                  {successMsg}
                </div>
              ) : (
                <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      عنوان المشروع *
                    </label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="مثال: تطبيق متجر إلكتروني متجاوب"
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        borderRadius: '99px',
                        border: '2px solid #9AA0A6',
                        fontSize: '15px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      نوع المشروع
                    </label>
                    <div className="tabs-proto" style={{ width: '100%', display: 'flex' }}>
                      <button
                        type="button"
                        onClick={() => setProjCategory('free')}
                        className={projCategory === 'free' ? 'on' : ''}
                        style={{ flex: 1, textAlign: 'center' }}
                      >
                        مشروع حر
                      </button>
                      <button
                        type="button"
                        onClick={() => setProjCategory('workshop')}
                        className={projCategory === 'workshop' ? 'on' : ''}
                        style={{ flex: 1, textAlign: 'center' }}
                      >
                        تطبيق ورشة
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      رابط مستودع GitHub *
                    </label>
                    <input
                      type="url"
                      required
                      value={projGithub}
                      onChange={(e) => setProjGithub(e.target.value)}
                      placeholder="https://github.com/username/project"
                      dir="ltr"
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        borderRadius: '99px',
                        border: '2px solid #9AA0A6',
                        fontSize: '15px',
                        outline: 'none',
                        textAlign: 'left',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      رابط المعاينة الحية (اختياري)
                    </label>
                    <input
                      type="url"
                      value={projLive}
                      onChange={(e) => setProjLive(e.target.value)}
                      placeholder="https://my-project.vercel.app"
                      dir="ltr"
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        borderRadius: '99px',
                        border: '2px solid #9AA0A6',
                        fontSize: '15px',
                        outline: 'none',
                        textAlign: 'left',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="b-proto y"
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {isSubmitting ? 'جارٍ الإضافة...' : 'نشر المشروع في المعرض 🚀'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
