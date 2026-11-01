import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Plus, X, FolderCode, Trash2, Sparkles, Send, Layers } from 'lucide-react';
import { UserProfile, ShowcaseSlot } from '../../types';
import { store } from '../../services/store';
import confetti from 'canvas-confetti';

interface ShowcaseViewProps {
  currentUser: UserProfile;
}

interface ShowcaseCardItem {
  id: string;
  slotId?: string;
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

const GDG_COLORS = [
  { name: 'أخضر GDG', value: '#34A853' },
  { name: 'أزرق GDG', value: '#4285F4' },
  { name: 'أصفر GDG', value: '#F9AB00' },
  { name: 'أحمر GDG', value: '#EA4335' },
];

// زهرة قوقل الهندسية المعتمدة في التصميم الأصلي
const GooglePinwheelIcon: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg
    viewBox="-50 -50 100 100"
    aria-hidden="true"
    style={{
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
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
);

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ currentUser }) => {
  // صلاحية إنشاء الخانات مخصصة حصرياً للقادة
  const isLeader =
    currentUser.role === 'track_leader' ||
    currentUser.role === 'co_leader' ||
    currentUser.role === 'supervisor';

  const [projects, setProjects] = useState<ShowcaseCardItem[]>(() => store.getShowcaseProjects());
  const [slots, setSlots] = useState<ShowcaseSlot[]>(() => store.getShowcaseSlots());
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'in_review'>('all');

  // مزامنة حية
  useEffect(() => {
    const unsub = store.subscribe(() => {
      setProjects(store.getShowcaseProjects());
      setSlots(store.getShowcaseSlots());
    });
    return unsub;
  }, []);

  // نافذة إنشاء خانة جديدة (خاصة بالقائد 👑)
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [slotTitle, setSlotTitle] = useState('');
  const [slotDesc, setSlotDesc] = useState('');
  const [slotStage, setSlotStage] = useState('المرحلة 01');
  const [slotCategory, setSlotCategory] = useState<'workshop' | 'general'>('workshop');
  const [slotColor, setSlotColor] = useState(GDG_COLORS[0].value);
  const [isSavingSlot, setIsSavingSlot] = useState(false);
  const [slotSuccessMsg, setSlotSuccessMsg] = useState('');

  // نافذة إضافة عمل للخانة (يستخدمها الأعضاء لتسليم مشاريعهم 🚀)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<ShowcaseSlot | null>(null);
  const [memberProjTitle, setMemberProjTitle] = useState('');
  const [memberGithub, setMemberGithub] = useState('');
  const [memberLive, setMemberLive] = useState('');
  const [memberNotes, setMemberNotes] = useState('');
  const [isSubmittingProj, setIsSubmittingProj] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  // فتح نافذة إنشاء خانة للقائد
  const openCreateSlotModal = (cat: 'workshop' | 'general' = 'workshop') => {
    if (!isLeader) return;
    setSlotCategory(cat);
    setSlotTitle('');
    setSlotDesc('');
    setSlotStage('المرحلة 01');
    setSlotColor(GDG_COLORS[slots.length % GDG_COLORS.length].value);
    setIsSlotModalOpen(true);
  };

  // فتح نافذة تسليم العمل للعضو داخل خانة معينة
  const openMemberSubmitModal = (slot?: ShowcaseSlot) => {
    setActiveSlot(slot || null);
    setMemberProjTitle('');
    setMemberGithub('');
    setMemberLive('');
    setMemberNotes('');
    setIsSubmitModalOpen(true);
  };

  // معالجة حفظ الخانة من قبل القائد
  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTitle.trim()) return;

    setIsSavingSlot(true);
    store.addShowcaseSlot({
      title: slotTitle.trim(),
      description: slotDesc.trim(),
      stageName: slotStage,
      category: slotCategory,
      color: slotColor,
      createdBy: currentUser.id,
      createdByName: currentUser.fullName,
    });

    setSlots(store.getShowcaseSlots());

    if (currentUser.settings?.celebrations) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }

    setSlotSuccessMsg('تم إنشاء الخانة بنجاح في المعرض! ✨ أصبح بإمكان الأعضاء إضافة مشاريعهم فيها.');
    setTimeout(() => {
      setIsSavingSlot(false);
      setIsSlotModalOpen(false);
      setSlotSuccessMsg('');
    }, 1200);
  };

  // معالجة تسليم المشروع من قبل العضو في الخانة
  const handleMemberSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberProjTitle.trim() || !memberGithub.trim()) return;

    setIsSubmittingProj(true);
    const assignedColor = activeSlot?.color || GDG_COLORS[projects.length % GDG_COLORS.length].value;

    store.submitProjectToSlot({
      slotId: activeSlot?.id,
      slotTitle: activeSlot?.title || 'مشروع تطبيقي',
      title: memberProjTitle.trim(),
      githubUrl: memberGithub.trim(),
      liveUrl: memberLive.trim() || undefined,
      notes: memberNotes.trim() || undefined,
      memberId: currentUser.id,
      memberName: currentUser.fullName,
      stageName: currentUser.webLevelTitle?.split(':')[1] || activeSlot?.stageName || 'المرحلة 02',
      color: assignedColor,
    });

    setProjects(store.getShowcaseProjects());

    if (currentUser.settings?.celebrations) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }

    setSubmitSuccessMsg('تم تسليم مشروعك بنجاح ونشره في الخانة! 🎉');
    setTimeout(() => {
      setIsSubmittingProj(false);
      setIsSubmitModalOpen(false);
      setSubmitSuccessMsg('');
      setActiveSlot(null);
    }, 1200);
  };

  // حذف خانة (للقادة فقط)
  const handleDeleteSlot = (slotId: string, slotName: string) => {
    if (!isLeader) return;
    if (window.confirm(`هل أنت متأكد من حذف خانة "${slotName}"؟`)) {
      store.deleteShowcaseSlot(slotId);
      setSlots(store.getShowcaseSlots());
    }
  };

  // استبعاد الكويزات من المعرض تماماً والتأكد من وجود روابط حقيقية فقط
  const validProjects = projects.filter((p) => {
    const t = (p.title || '').toLowerCase();
    if (t.includes('كويز') || t.includes('quiz') || p.id?.includes('quiz')) return false;
    const gh = (p.githubUrl || '').trim();
    const lv = (p.liveUrl || '').trim();
    const isRealGh = gh.startsWith('http') && gh !== 'https://github.com' && !gh.includes('quiz') && !gh.includes('gdg-taif.dev');
    const isRealLv = lv.startsWith('http') && !lv.includes('quiz') && !lv.includes('gdg-taif.dev');
    return isRealGh || isRealLv;
  });

  const workshopSlots = slots.filter((s) => s.category === 'workshop');
  const generalSlots = slots.filter((s) => s.category === 'general');

  // بطاقات الحجز الافتراضية الأربعة المعتمدة عند عدم وجود خانات
  const defaultPinwheelCards = [
    { color: '#34A853' },
    { color: '#4285F4' },
    { color: '#F9AB00' },
    { color: '#EA4335' },
  ];

  return (
    <div className="container py-8 sm:py-10 text-right" dir="rtl" style={{ maxWidth: '1440px' }}>
      {/* 1. السطر العلوي: شعار المسار وزر القائد لإنشاء الخانة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }} className="flex-wrap gap-4">
        <b style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#4285F4' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#EA4335' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#F9AB00' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#34A853' }} />
          <span>مسار الويب</span>
        </b>

        {/* زر إنشاء الخانة خاص بالقادة فقط */}
        {isLeader && (
          <button
            type="button"
            onClick={() => openCreateSlotModal('workshop')}
            className="b-proto y"
            style={{ padding: '8px 24px', minHeight: '44px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} />
            <span>+ إنشاء خانة جديدة للمعرض</span>
          </button>
        )}
      </div>

      {/* 2. عنوان المعرض الرئيسي */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '48px', lineHeight: 1.15, fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>
          معرض أعمال ومشاريع المسار 🚀
        </h1>
        <p style={{ fontSize: '18px', color: '#5f6673', margin: 0, fontWeight: 500 }}>
          تطبيقات الورش والمهام البرمجية والمشاريع المعتمدة لأعضاء ومطوري مسار الويب.
        </p>
      </div>

      {/* ================= القسم الأول: تطبيقات الورش والتاسكات البرمجية (شريط أفقي) ================= */}
      <section style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              تطبيقات الورش والتاسكات البرمجية 💻
            </h2>
            <p style={{ fontSize: '15px', color: '#5f6673', margin: '4px 0 0' }}>
              الخانات البرمجية المحددة من القادة، مع تسليمات ومشاريع الأعضاء المعتمدة.
            </p>
          </div>

          {isLeader && (
            <button
              type="button"
              onClick={() => openCreateSlotModal('workshop')}
              className="b-proto"
              style={{
                padding: '6px 18px',
                fontSize: '14px',
                minHeight: '38px',
                background: '#ffffff',
                border: '2px solid #0F172A',
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={15} />
              <span>+ إنشاء خانة ورشة / تاسك</span>
            </button>
          )}
        </div>

        {/* شريط السحب الأفقي للورش والتاسكات */}
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
          {workshopSlots.length > 0 ? (
            workshopSlots.map((slot) => {
              // المشاريع المسلمة في هذه الخانة
              const slotProjects = validProjects.filter(
                (p) => p.slotId === slot.id || p.workshopTaskName === slot.title
              );

              return (
                <div
                  key={slot.id}
                  className="k"
                  style={{
                    flex: '0 0 350px',
                    minWidth: '330px',
                    maxWidth: '370px',
                    padding: 0,
                    overflow: 'hidden',
                    borderRadius: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    scrollSnapAlign: 'start',
                    background: '#fff',
                    position: 'relative',
                  }}
                >
                  {/* الغلاف العلوي مع زهرة قوقل البيضاء وشارة الورشة */}
                  <div
                    style={{
                      height: '130px',
                      backgroundColor: slot.color || '#4285F4',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <GooglePinwheelIcon size={90} />

                    <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '6px', alignItems: 'center' }}>
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
                        {slot.stageName || 'المرحلة 01'}
                      </span>
                    </div>

                    {/* زر حذف الخانة خاص بالقائد */}
                    {isLeader && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSlot(slot.id, slot.title)}
                        title="حذف هذه الخانة"
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '12px',
                          background: 'rgba(0,0,0,0.4)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* تفاصيل الخانة */}
                  <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <b style={{ fontSize: '19px', color: '#0F172A', display: 'block', lineHeight: 1.3, marginBottom: '6px' }}>
                        {slot.title}
                      </b>
                      {slot.description && (
                        <p style={{ margin: '0 0 14px', fontSize: '14px', color: '#5f6673', lineHeight: 1.5 }}>
                          {slot.description}
                        </p>
                      )}
                    </div>

                    {/* قائمة المشاريع المسلمة داخل هذه الخانة */}
                    <div style={{ borderTop: '1px solid #F1F3F4', paddingTop: '14px', marginTop: '8px' }}>
                      {slotProjects.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#137333' }}>
                            المشاريع المسلمة ({slotProjects.length}):
                          </span>
                          {slotProjects.slice(0, 3).map((p) => (
                            <div
                              key={p.id}
                              style={{
                                background: '#F8F9FA',
                                borderRadius: '16px',
                                padding: '10px 14px',
                                border: '1px solid #E8EAED',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{p.title}</span>
                                <span style={{ fontSize: '12px', color: '#5f6673' }}>{p.memberName}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                <a
                                  href={p.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="b-proto"
                                  style={{
                                    background: '#E8EAED',
                                    color: '#0F172A',
                                    padding: '3px 12px',
                                    fontSize: '12px',
                                    minHeight: '28px',
                                    textDecoration: 'none',
                                  }}
                                >
                                  GitHub
                                </a>
                                {p.liveUrl && (
                                  <a
                                    href={p.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="b-proto"
                                    style={{
                                      background: '#E8F0FE',
                                      color: '#1A73E8',
                                      padding: '3px 10px',
                                      fontSize: '12px',
                                      minHeight: '28px',
                                      textDecoration: 'none',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                  >
                                    <span>معاينة</span>
                                    <ExternalLink size={11} />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '14px', color: '#5f6673', fontWeight: 600, margin: '0 0 14px' }}>
                          بانتظار مشاريع المطورين المهرة ✨
                        </p>
                      )}

                      {/* زر تسليم العمل: متاح للأعضاء لإضافة مشاريعهم داخل هذه الخانة */}
                      <button
                        type="button"
                        onClick={() => openMemberSubmitModal(slot)}
                        className="b-proto"
                        style={{
                          width: '100%',
                          background: '#E8F0FE',
                          color: '#1A73E8',
                          border: '1.5px solid #1A73E8',
                          padding: '8px 16px',
                          fontSize: '14px',
                          minHeight: '38px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <Plus size={15} />
                        <span>+ أضف عملك في هذه الخانة</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* بطاقات الحجز الهندسية الأربعة عند عدم وجود خانات بعد */
            defaultPinwheelCards.map((card, idx) => (
              <div
                key={idx}
                className="k"
                style={{
                  flex: '0 0 340px',
                  minWidth: '320px',
                  maxWidth: '360px',
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  scrollSnapAlign: 'start',
                  background: '#fff',
                }}
              >
                <div
                  style={{
                    height: '130px',
                    backgroundColor: card.color,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <GooglePinwheelIcon size={90} />
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <b style={{ fontSize: '20px', color: '#0F172A', display: 'block', lineHeight: 1.4, marginBottom: '8px' }}>
                      بانتظار مشاريع المطورين المبهرة
                    </b>
                    <p style={{ margin: 0, fontSize: '14px', color: '#5f6673', lineHeight: 1.5 }}>
                      {isLeader
                        ? 'أنشئ خانة جديدة الآن ليتمكن الأعضاء من تسليم أعمالهم فيها.'
                        : 'سيتم افتتاح الخانات والتاسكات قريباً من قبل قادة المسار.'}
                    </p>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                    {isLeader ? (
                      <button
                        type="button"
                        onClick={() => openCreateSlotModal('workshop')}
                        className="b-proto y"
                        style={{ width: '100%', padding: '8px 16px', fontSize: '14px', minHeight: '38px' }}
                      >
                        <Plus size={15} />
                        <span>+ إنشاء خانة للورشة</span>
                      </button>
                    ) : (
                      <span
                        className="b-proto"
                        style={{
                          background: '#E8EAED',
                          color: '#0F172A',
                          padding: '8px 24px',
                          fontSize: '14px',
                          minHeight: '38px',
                          display: 'inline-block',
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        GitHub
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ================= القسم الثاني: المعرض العام لجميع المشاريع ================= */}
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

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="tabs-proto">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'on' : ''}
              >
                الكل ({validProjects.length})
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

            {/* زر تسليم مشروع عام متاح للأعضاء */}
            <button
              type="button"
              onClick={() => openMemberSubmitModal()}
              className="b-proto"
              style={{
                background: '#0F172A',
                color: '#ffffff',
                padding: '8px 20px',
                fontSize: '15px',
                minHeight: '42px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} />
              <span>+ إضافة مشروع للمعرض العام</span>
            </button>
          </div>
        </div>

        {/* شبكة المشاريع المسلمة في المعرض العام */}
        {validProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validProjects
              .filter((p) => statusFilter === 'all' || p.status === statusFilter)
              .map((p, idx) => {
                const bannerBg = p.color || GDG_COLORS[idx % GDG_COLORS.length].value;

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
                      <GooglePinwheelIcon size={90} />

                      <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '6px' }}>
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
                          {p.workshopTaskName || p.category || 'تطبيق عملي'}
                        </span>
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
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
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
          /* حالة الانتظار بالمعرض العام */
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
            <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
              بانتظار مشاريع المطورين المبهرة
            </h3>
            <p style={{ fontSize: '16px', color: '#5f6673', maxWidth: '520px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              ستظهر هنا مشاريع وأعمال أعضاء المسار المعتمدة فور تسليمها وروابطها البرمجية الحية.
            </p>
            <button
              type="button"
              onClick={() => openMemberSubmitModal()}
              className="b-proto y"
              style={{ padding: '10px 28px', fontSize: '16px' }}
            >
              <Plus size={16} />
              <span>+ أضف مشروعك للمعرض الآن</span>
            </button>
          </div>
        )}
      </section>

      {/* ================= نافذة 1: إنشاء خانة جديدة في المعرض (خاص بالقادة 👑) ================= */}
      <AnimatePresence>
        {isSlotModalOpen && isLeader && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsSlotModalOpen(false)}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={24} color="#4285F4" />
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    إنشاء خانة جديدة في المعرض (خاص بالقادة 👑)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(false)}
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

              {slotSuccessMsg ? (
                <div style={{ padding: '20px', borderRadius: '16px', background: '#E6F4EA', color: '#137333', fontWeight: 700, textAlign: 'center' }}>
                  {slotSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleCreateSlot} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      مكان الخانة في المعرض
                    </label>
                    <div className="tabs-proto" style={{ width: '100%', display: 'flex' }}>
                      <button
                        type="button"
                        onClick={() => setSlotCategory('workshop')}
                        className={slotCategory === 'workshop' ? 'on' : ''}
                        style={{ flex: 1, textAlign: 'center' }}
                      >
                        معرض الورش والتاسكات
                      </button>
                      <button
                        type="button"
                        onClick={() => setSlotCategory('general')}
                        className={slotCategory === 'general' ? 'on' : ''}
                        style={{ flex: 1, textAlign: 'center' }}
                      >
                        المعرض العام
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      عنوان الخانة أو الورشة *
                    </label>
                    <input
                      type="text"
                      required
                      value={slotTitle}
                      onChange={(e) => setSlotTitle(e.target.value)}
                      placeholder="مثال: ورشة 01: بناء الهيكل وتأسيس الويب بالـ HTML"
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
                      المطلوب البرمجي وتوجيهات التطبيق للأعضاء
                    </label>
                    <textarea
                      rows={3}
                      value={slotDesc}
                      onChange={(e) => setSlotDesc(e.target.value)}
                      placeholder="اكتب فكرة التطبيق المطلوب من الأعضاء برمجته ورفعه على GitHub..."
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        borderRadius: '20px',
                        border: '2px solid #9AA0A6',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'none',
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                        المرحلة المستهدفة
                      </label>
                      <select
                        value={slotStage}
                        onChange={(e) => setSlotStage(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          borderRadius: '99px',
                          border: '2px solid #9AA0A6',
                          fontSize: '14px',
                          outline: 'none',
                          background: '#fff',
                        }}
                      >
                        <option value="المرحلة 01">المرحلة 01</option>
                        <option value="المرحلة 02">المرحلة 02</option>
                        <option value="المرحلة 03">المرحلة 03</option>
                        <option value="مسار عام">مسار عام</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                        لون الغلاف
                      </label>
                      <div style={{ display: 'flex', gap: '8px', paddingTop: '6px' }}>
                        {GDG_COLORS.map((c) => (
                          <button
                            type="button"
                            key={c.value}
                            onClick={() => setSlotColor(c.value)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: c.value,
                              border: slotColor === c.value ? '3px solid #0F172A' : 'none',
                              cursor: 'pointer',
                              transform: slotColor === c.value ? 'scale(1.15)' : 'none',
                            }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSlot}
                    className="b-proto y"
                    style={{ width: '100%', marginTop: '10px', fontSize: '16px' }}
                  >
                    {isSavingSlot ? 'جارٍ إنشاء الخانة...' : 'إنشاء الخانة في المعرض ✨'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= نافذة 2: تسليم العمل في الخانة (يستخدمها الأعضاء 🚀) ================= */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsSubmitModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="k w-full max-w-lg text-right"
              style={{ padding: '32px', backgroundColor: '#ffffff', borderRadius: '28px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                    تسليم عملك في المعرض 🚀
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#5f6673' }}>
                    الخانة: <b>{activeSlot ? activeSlot.title : 'المعرض العام للمسار'}</b>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
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

              {submitSuccessMsg ? (
                <div style={{ padding: '20px', borderRadius: '16px', background: '#E6F4EA', color: '#137333', fontWeight: 700, textAlign: 'center' }}>
                  {submitSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleMemberSubmitProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#5f6673', marginBottom: '4px' }}>
                      اسم المطور صاحب التسليم
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.fullName}
                      style={{
                        width: '100%',
                        padding: '10px 18px',
                        borderRadius: '99px',
                        border: '1.5px solid #E8EAED',
                        fontSize: '15px',
                        background: '#F8F9FA',
                        color: '#0F172A',
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      عنوان المشروع / التطبيق *
                    </label>
                    <input
                      type="text"
                      required
                      value={memberProjTitle}
                      onChange={(e) => setMemberProjTitle(e.target.value)}
                      placeholder="مثال: تطبيق صفحة هبوط شخصية متجاوبة"
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
                      value={memberGithub}
                      onChange={(e) => setMemberGithub(e.target.value)}
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
                      رابط المعاينة الحية (اختياري لكن مفضل)
                    </label>
                    <input
                      type="url"
                      value={memberLive}
                      onChange={(e) => setMemberLive(e.target.value)}
                      placeholder="https://my-app.vercel.app"
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
                      ملاحظات أو نبذة عن تطبيقك (اختياري)
                    </label>
                    <input
                      type="text"
                      value={memberNotes}
                      onChange={(e) => setMemberNotes(e.target.value)}
                      placeholder="اكتب ملاحظة أو مميزات مشروعك..."
                      style={{
                        width: '100%',
                        padding: '10px 18px',
                        borderRadius: '99px',
                        border: '2px solid #9AA0A6',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingProj}
                    className="b-proto y"
                    style={{ width: '100%', marginTop: '6px', fontSize: '16px' }}
                  >
                    {isSubmittingProj ? 'جارٍ التسليم...' : 'تسليم العمل في المعرض 🚀'}
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
