import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Plus, X, Laptop, Rocket, Zap, Sparkles, FolderCode } from 'lucide-react';
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
  workshopTaskName?: string;
  isWorkshopTask?: boolean;
}

const GDG_COLORS = ['#4285F4', '#EA4335', '#34A853', '#F9AB00'];

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ currentUser }) => {
  const isFemale = isFemaleUser(currentUser);
  const [projects, setProjects] = useState<ShowcaseCardItem[]>(() => store.getShowcaseProjects());
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'in_review'>('all');

  // نافذة إضافة مشروع جديد
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projGithub, setProjGithub] = useState('');
  const [projLive, setProjLive] = useState('');
  const [projCategory, setProjCategory] = useState<'workshop' | 'free'>('workshop');
  const [workshopName, setWorkshopName] = useState('ورشة 01: بناء الهيكل بالـ HTML');
  const [customTaskName, setCustomTaskName] = useState('');
  const [projStage, setProjStage] = useState('المرحلة 02');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const openAddModal = (category: 'workshop' | 'free') => {
    setProjCategory(category);
    setIsAddModalOpen(true);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projGithub.trim()) return;

    setIsSubmitting(true);
    const color = GDG_COLORS[projects.length % GDG_COLORS.length];

    const finalWorkshopName =
      projCategory === 'workshop'
        ? (customTaskName.trim() || workshopName)
        : undefined;

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
      workshopTaskName: finalWorkshopName,
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

    setSuccessMsg(gText(isFemale, 'تمت إضافة عملكِ بنجاح إلى المعرض! ✨', 'تمت إضافة عملكَ بنجاح إلى المعرض! ✨'));
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setSuccessMsg('');
      setProjTitle('');
      setProjGithub('');
      setProjLive('');
      setCustomTaskName('');
    }, 1200);
  };

  // تقسيم المشاريع إلى: أعمال الورش والتاسكات، والمعرض العام
  const workshopProjects = projects.filter(
    (p) => p.isWorkshopTask || p.category?.includes('ورشة') || p.category?.includes('تاسك')
  );

  const generalProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesStatus;
  });

  return (
    <div className="container py-8 sm:py-10 text-right" dir="rtl" style={{ maxWidth: '1440px' }}>
      {/* 1. السطر العلوي: علامة مسار الويب ونقاط قوقل + زر الإضافة الرئيسي */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }} className="flex-wrap gap-4">
        <b style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#4285F4' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#EA4335' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#F9AB00' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#34A853' }} />
          <span>مسار الويب</span>
        </b>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => openAddModal('workshop')}
            className="b-proto y"
            style={{ padding: '8px 24px', minHeight: '44px', fontSize: '16px' }}
          >
            <Plus size={16} />
            <span>{gText(isFemale, '+ أضيفي عملكِ للمعرض', '+ أضف عملكَ للمعرض')}</span>
          </button>
        </div>
      </div>

      {/* 2. عنوان المعرض الرئيسي والنبذة */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '48px', sm: '56px', lineHeight: 1.15, fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>
          معرض أعمال ومشاريع المسار 🚀
        </h1>
        <p style={{ fontSize: '18px', color: '#5f6673', margin: 0, fontWeight: 500 }}>
          تطبيقات الورش والمهام البرمجية والمشاريع المعتمدة لأعضاء ومطوري مسار الويب.
        </p>
      </div>

      {/* ================= القسم الأول: تطبيقات الورش والتاسكات (سحب أفقي ↔) ================= */}
      <section style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                تطبيقات الورش والتاسكات البرمجية 💻
              </h2>
              <span className="t-proto" style={{ background: '#E8F0FE', color: '#1A73E8', fontWeight: 700 }}>
                سحب أفقي ↔
              </span>
            </div>
            <p style={{ fontSize: '15px', color: '#5f6673', margin: '4px 0 0' }}>
              أعمال وتطبيقات المطورين المعتمدة لكل ورشة وتاسك عملي يقرره القادة.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openAddModal('workshop')}
            className="b-proto"
            style={{
              padding: '6px 18px',
              fontSize: '14px',
              minHeight: '38px',
              background: '#ffffff',
              border: '2px solid #0F172A',
              color: '#0F172A',
            }}
          >
            <Plus size={15} />
            <span>+ إضافة عمل لورشة / تاسك</span>
          </button>
        </div>

        {/* الحاوية الأفقية للسحب (Horizontal Scroll Track) */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            paddingBottom: '16px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          className="scrollbar-thin"
        >
          {workshopProjects.length > 0 ? (
            workshopProjects.map((p, idx) => {
              const bannerBg = p.color || GDG_COLORS[idx % GDG_COLORS.length];
              return (
                <div
                  key={p.id}
                  className="k"
                  style={{
                    flex: '0 0 340px',
                    minWidth: '320px',
                    maxWidth: '360px',
                    padding: 0,
                    overflow: 'hidden',
                    borderRadius: '26px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    scrollSnapAlign: 'start',
                    background: '#fff',
                  }}
                >
                  {/* الغلاف العلوي الملون 120px مع زهرة قوقل */}
                  <div
                    style={{
                      height: '120px',
                      backgroundColor: bannerBg,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <svg
                      viewBox="-50 -50 100 100"
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        width: '80px',
                        height: '80px',
                        left: '16px',
                        top: '16px',
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

                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
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
                        {p.workshopTaskName || 'تطبيق ورشة'}
                      </span>
                    </div>
                  </div>

                  {/* تفاصيل المشروع */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <b style={{ fontSize: '20px', color: '#0F172A', display: 'block', lineHeight: 1.3, marginBottom: '6px' }}>
                        {p.title}
                      </b>
                      <p style={{ margin: '0 0 14px', fontSize: '14px', color: '#5f6673', fontWeight: 600 }}>
                        {p.memberName} · {p.stageName || 'المرحلة 02'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto', paddingTop: '6px' }}>
                      <a
                        href={p.githubUrl?.startsWith('http') ? p.githubUrl : `https://${p.githubUrl || 'github.com'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="b-proto"
                        style={{
                          background: '#E8EAED',
                          color: '#0F172A',
                          padding: '6px 18px',
                          fontSize: '14px',
                          minHeight: '38px',
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
                            padding: '6px 14px',
                            fontSize: '13px',
                            minHeight: '38px',
                            textDecoration: 'none',
                            border: '1.5px solid #4285F4',
                          }}
                        >
                          <span>معاينة حية</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* الخانات الشاغرة بأيقونات فقط بانتظار تسليمات المطورين والورش */
            <>
              {/* خانة 1: بانتظار تطبيق الورشة الأولى */}
              <div
                className="k"
                style={{
                  flex: '0 0 320px',
                  minWidth: '300px',
                  maxWidth: '340px',
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#F8FAFC',
                  border: '2px dashed #9AA0A6',
                }}
              >
                <div style={{ height: '110px', backgroundColor: '#E8F0FE', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4285F4' }}>
                    <Laptop size={28} />
                  </div>
                </div>
                <div style={{ padding: '24px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <b style={{ fontSize: '18px', color: '#0F172A' }}>بانتظار تطبيق الورشة 💻</b>
                  <p style={{ margin: 0, fontSize: '14px', color: '#5f6673', fontWeight: 500 }}>
                    خانة شاغرة لمطوري المسار تُرصد فور اعتماد تسليم الورشة
                  </p>
                  <div style={{ marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => openAddModal('workshop')}
                      className="b-proto"
                      style={{ padding: '6px 16px', fontSize: '13px', minHeight: '36px', background: '#E8EAED', color: '#5f6673', cursor: 'pointer' }}
                    >
                      + بانتظار الإضافة
                    </button>
                  </div>
                </div>
              </div>

              {/* خانة 2: بانتظار تسليم التاسك البرمجي */}
              <div
                className="k"
                style={{
                  flex: '0 0 320px',
                  minWidth: '300px',
                  maxWidth: '340px',
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#F8FAFC',
                  border: '2px dashed #9AA0A6',
                }}
              >
                <div style={{ height: '110px', backgroundColor: '#E6F4EA', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34A853' }}>
                    <Rocket size={28} />
                  </div>
                </div>
                <div style={{ padding: '24px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <b style={{ fontSize: '18px', color: '#0F172A' }}>بانتظار تسليم التاسك 🚀</b>
                  <p style={{ margin: 0, fontSize: '14px', color: '#5f6673', fontWeight: 500 }}>
                    خانة شاغرة للمهام المعتمدة تظهر فور تسليم الكود ورابط المشروع
                  </p>
                  <div style={{ marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => openAddModal('workshop')}
                      className="b-proto"
                      style={{ padding: '6px 16px', fontSize: '13px', minHeight: '36px', background: '#E8EAED', color: '#5f6673', cursor: 'pointer' }}
                    >
                      + بانتظار الإضافة
                    </button>
                  </div>
                </div>
              </div>

              {/* خانة 3: بانتظار المشاريع القادمة */}
              <div
                className="k"
                style={{
                  flex: '0 0 320px',
                  minWidth: '300px',
                  maxWidth: '340px',
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#F8FAFC',
                  border: '2px dashed #9AA0A6',
                }}
              >
                <div style={{ height: '110px', backgroundColor: '#FFF4D6', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F9AB00' }}>
                    <Zap size={28} />
                  </div>
                </div>
                <div style={{ padding: '24px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <b style={{ fontSize: '18px', color: '#0F172A' }}>بانتظار المشاريع القادمة ⚡</b>
                  <p style={{ margin: 0, fontSize: '14px', color: '#5f6673', fontWeight: 500 }}>
                    خانة شاغرة للورش القادمة وتحديات تطوير الويب التفاعلية
                  </p>
                  <div style={{ marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => openAddModal('workshop')}
                      className="b-proto"
                      style={{ padding: '6px 16px', fontSize: '13px', minHeight: '36px', background: '#E8EAED', color: '#5f6673', cursor: 'pointer' }}
                    >
                      + بانتظار الإضافة
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================= القسم الثاني: المعرض العام للمشاريع ================= */}
      <section style={{ borderTop: '2px solid #E8EAED', paddingTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
              المعرض العام لجميع المشاريع 🌐
            </h2>
            <p style={{ fontSize: '16px', color: '#5f6673', margin: 0 }}>
              كافة المشاريع والتطبيقات البرمجية المعتمدة لأعضاء المسار.
            </p>
          </div>

          {/* فلاتر الحالة والأزرار */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="tabs-proto">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'on' : ''}
              >
                الكل ({projects.length})
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

            <button
              type="button"
              onClick={() => openAddModal('free')}
              className="b-proto"
              style={{
                background: '#0F172A',
                color: '#ffffff',
                padding: '8px 20px',
                fontSize: '15px',
                minHeight: '42px',
              }}
            >
              <Plus size={16} />
              <span>+ إضافة مشروع عام</span>
            </button>
          </div>
        </div>

        {/* شبكة المشاريع أو الحالة الفارغة النظيفة */}
        {generalProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generalProjects.map((p, idx) => {
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
                    background: '#fff',
                  }}
                >
                  <div
                    style={{
                      height: '130px',
                      backgroundColor: bannerBg,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
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

                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <b style={{ fontSize: '22px', color: '#0F172A', display: 'block', lineHeight: 1.3, marginBottom: '6px' }}>
                        {p.title}
                      </b>
                      <p style={{ margin: '0 0 16px', fontSize: '15px', color: '#5f6673', fontWeight: 600 }}>
                        {p.memberName} · {p.stageName || 'المرحلة 02'}
                      </p>
                    </div>

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
        ) : (
          /* حالة فارغة راقية للمعرض العام بأيقونات فقط وبدون أي أسماء أو أعمال وهمية */
          <div
            className="k text-center py-16 px-6"
            style={{
              backgroundColor: '#fff',
              border: '2px dashed #9AA0A6',
              borderRadius: '28px',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#E8F0FE',
                color: '#1A73E8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <FolderCode size={36} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
              بانتظار إضافة المشاريع المعتمدة أو تسليمات المطورين 🚀
            </h3>
            <p style={{ fontSize: '16px', color: '#5f6673', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              ستظهر هنا مشاريع وتطبيقات أعضاء مسار الويب فور رفعها واعتمادها من قادة المسار.
            </p>
            <button
              type="button"
              onClick={() => openAddModal('free')}
              className="b-proto y"
              style={{ padding: '10px 28px', fontSize: '16px' }}
            >
              <Plus size={16} />
              <span>{gText(isFemale, '+ أضيفي مشروعكِ الآن', '+ أضف مشروعكَ الآن')}</span>
            </button>
          </div>
        )}
      </section>

      {/* ================= نافذة إضافة مشروع أو عمل للمعرض ================= */}
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
                  إضافة عمل إلى المعرض
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
                  {/* تصنيف العمل: ورشة / تاسك محدد أو مشروع عام */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      مكان ظهور العمل في المعرض
                    </label>
                    <div className="tabs-proto" style={{ width: '100%', display: 'flex' }}>
                      <button
                        type="button"
                        onClick={() => setProjCategory('workshop')}
                        className={projCategory === 'workshop' ? 'on' : ''}
                        style={{ flex: 1, textAlign: 'center' }}
                      >
                        معرض الورش والتاسكات (سحب أفقي)
                      </button>
                      <button
                        type="button"
                        onClick={() => setProjCategory('free')}
                        className={projCategory === 'free' ? 'on' : ''}
                        style={{ flex: 1, textAlign: 'center' }}
                      >
                        المعرض العام
                      </button>
                    </div>
                  </div>

                  {/* إذا كان ورشة: تحديد اسم الورشة أو كتابة تاسك مخصص يقرره القائد */}
                  {projCategory === 'workshop' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                        الورشة أو التاسك المقرر
                      </label>
                      <select
                        value={workshopName}
                        onChange={(e) => setWorkshopName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 18px',
                          borderRadius: '99px',
                          border: '2px solid #9AA0A6',
                          fontSize: '15px',
                          outline: 'none',
                          marginBottom: '8px',
                          background: '#fff',
                        }}
                      >
                        <option value="ورشة 01: بناء الهيكل وتأسيس الويب بالـ HTML">ورشة 01: بناء الهيكل وتأسيس الويب بالـ HTML</option>
                        <option value="ورشة 02: تنسيقات CSS3 والتجاوب Modern Layouts">ورشة 02: تنسيقات CSS3 والتجاوب Modern Layouts</option>
                        <option value="ورشة 03: التفاعلية والبرمجة بالـ JavaScript">ورشة 03: التفاعلية والبرمجة بالـ JavaScript</option>
                        <option value="تاسك مخصص يحدده القائد">تاسك مخصص يحدده القائد</option>
                      </select>

                      {workshopName === 'تاسك مخصص يحدده القائد' && (
                        <input
                          type="text"
                          required
                          value={customTaskName}
                          onChange={(e) => setCustomTaskName(e.target.value)}
                          placeholder="اكتب اسم التاسك أو الورشة المقررة..."
                          style={{
                            width: '100%',
                            padding: '10px 18px',
                            borderRadius: '99px',
                            border: '2px solid #4285F4',
                            fontSize: '14px',
                            outline: 'none',
                          }}
                        />
                      )}
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      عنوان المشروع / التطبيق *
                    </label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="مثال: تطبيق صفحة هبوط تفاعلية"
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
                    {isSubmitting ? 'جارٍ الإضافة...' : 'نشر العمل في المعرض 🚀'}
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
