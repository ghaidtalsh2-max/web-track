import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Plus, X, FolderCode, Trash2, Sparkles, Send, Layers, Paperclip, Check, FileText } from 'lucide-react';
import { UserProfile, ShowcaseSlot } from '../../types';
import { store } from '../../services/store';
import { persistLocalFile } from '../../services/fileStorage';
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
  fileAttachment?: {
    name: string;
    size: string;
    dataUrl?: string;
  };
}

const GDG_COLORS = [
  { name: 'أزرق GDG', value: '#4285F4' },
  { name: 'أحمر GDG', value: '#EA4335' },
  { name: 'أصفر GDG', value: '#F9AB00' },
  { name: 'أخضر GDG', value: '#34A853' },
];

// زهرة قوقل الهندسية المعتمدة
const GooglePinwheelIcon: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg
    viewBox="-50 -50 100 100"
    aria-hidden="true"
    style={{
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      left: '16px',
      top: '16px',
      opacity: 0.95,
      pointerEvents: 'none',
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
  // صلاحية إدارة الخانات للقادة والمشرفين
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

  // نافذة تسليم مشروع (يستخدمها الأعضاء والقادة 🚀)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string>('slot-workshop-tasks');
  const [memberProjTitle, setMemberProjTitle] = useState('');
  const [memberGithub, setMemberGithub] = useState('');
  const [memberLive, setMemberLive] = useState('');
  const [memberNotes, setMemberNotes] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedFileName, setAttachedFileName] = useState('');
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
    if (slot) {
      setActiveSlotId(slot.id);
    } else if (slots.length > 0) {
      setActiveSlotId(slots[0].id);
    } else {
      setActiveSlotId('general');
    }
    setMemberProjTitle('');
    setMemberGithub('');
    setMemberLive('');
    setMemberNotes('');
    setAttachedFile(null);
    setAttachedFileName('');
    setIsSubmitModalOpen(true);
  };

  // معالجة حفظ الخانة من قبل القائد
  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTitle.trim()) return;

    setIsSavingSlot(true);
    const newSlot = store.addShowcaseSlot({
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

    setSlotSuccessMsg('تم إنشاء الخانة بنجاح في المعرض! ✨ أصبح بإمكان الأعضاء اختيارها وتسليم مشاريعهم فيها.');
    setTimeout(() => {
      setIsSavingSlot(false);
      setIsSlotModalOpen(false);
      setSlotSuccessMsg('');
    }, 1200);
  };

  // معالجة تسليم المشروع من قبل العضو
  const handleMemberSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberProjTitle.trim() || !memberGithub.trim()) return;

    setIsSubmittingProj(true);
    const targetSlot = slots.find((s) => s.id === activeSlotId);
    const assignedColor = targetSlot?.color || GDG_COLORS[projects.length % GDG_COLORS.length].value;

    let fileAttachmentInfo: any = undefined;
    if (attachedFile) {
      try {
        const fileId = `proj-file-${Date.now()}`;
        const saved = await persistLocalFile(fileId, attachedFile);
        fileAttachmentInfo = {
          name: saved.fileName,
          size: saved.fileSize,
          dataUrl: saved.dataUrl,
        };
      } catch (err) {
        console.warn('File attach warning:', err);
      }
    }

    store.submitProjectToSlot({
      slotId: targetSlot?.id || (activeSlotId !== 'general' ? activeSlotId : undefined),
      slotTitle: targetSlot?.title || 'المعرض العام',
      title: memberProjTitle.trim(),
      githubUrl: memberGithub.trim(),
      liveUrl: memberLive.trim() || undefined,
      notes: memberNotes.trim() || undefined,
      memberId: currentUser.id,
      memberName: currentUser.fullName,
      stageName: currentUser.webLevelTitle?.split(':')[1] || targetSlot?.stageName || 'المرحلة 01',
      color: assignedColor,
    });

    setProjects(store.getShowcaseProjects());

    if (currentUser.settings?.celebrations) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }

    setSubmitSuccessMsg('تم تسليم مشروعك بنجاح ونشره في الخانة المحددة! 🎉');
    setTimeout(() => {
      setIsSubmittingProj(false);
      setIsSubmitModalOpen(false);
      setSubmitSuccessMsg('');
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

  // تنقية المشاريع الصالحة
  const validProjects = projects.filter((p) => {
    const t = (p.title || '').toLowerCase();
    if (t.includes('كويز') || t.includes('quiz') || p.id?.includes('quiz')) return false;
    const gh = (p.githubUrl || '').trim();
    const lv = (p.liveUrl || '').trim();
    const isRealGh = gh.startsWith('http') && gh !== 'https://github.com' && !gh.includes('quiz') && !gh.includes('gdg-taif.dev');
    const isRealLv = lv.startsWith('http') && !lv.includes('quiz') && !lv.includes('gdg-taif.dev');
    return isRealGh || isRealLv;
  });

  return (
    <div className="container py-8 sm:py-10 text-right" dir="rtl" style={{ maxWidth: '1440px' }}>
      {/* 1. السطر العلوي: شعار المسار وزر إنشاء خانة جديدة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }} className="flex-wrap gap-4">
        <b style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#4285F4' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#EA4335' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#F9AB00' }} />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#34A853' }} />
          <span>مسار الويب</span>
        </b>

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
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '46px', lineHeight: 1.15, fontWeight: 900, color: '#0F172A', margin: '0 0 10px' }}>
          معرض أعمال ومشاريع المسار 🚀
        </h1>
        <p style={{ fontSize: '18px', color: '#5f6673', margin: 0, fontWeight: 500 }}>
          تطبيقات الورش والمهام البرمجية والمشاريع المعتمدة لأعضاء ومطوري مسار الويب.
        </p>
      </div>

      {/* ================= 3. أقسام الخانات والتاسكات (عنوان كل خانة وتحته الأيقونات التي تنسحب) ================= */}
      <div className="space-y-12 mb-16">
        {slots.map((slot) => {
          // جلب المشاريع المسلمة في هذه الخانة بالاسم أو بالمعرف
          const slotProjects = validProjects.filter(
            (p) =>
              p.slotId === slot.id ||
              p.workshopTaskName === slot.title ||
              (slot.title.includes('ورش') && p.isWorkshopTask) ||
              (slot.title.includes('فضاء') && (p.title.includes('فضاء') || p.workshopTaskName?.includes('فضاء'))) ||
              (slot.title.includes('قوقل') && (p.title.includes('قوقل') || p.workshopTaskName?.includes('قوقل') || p.title.toLowerCase().includes('google')))
          );

          return (
            <section key={slot.id} className="space-y-4">
              {/* شريط عنوان الخانة مع زر إضافة العمل وزر الحذف للقائد */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: slot.color || '#4285F4',
                      }}
                    />
                    <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {slot.title}
                    </h2>
                    <span
                      style={{
                        backgroundColor: '#F1F3F4',
                        color: '#475569',
                        padding: '2px 10px',
                        borderRadius: '99px',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      {slotProjects.length} {slotProjects.length === 1 ? 'مشروع معروض' : 'مشاريع معروضة'}
                    </span>
                  </div>
                  {slot.description && (
                    <p style={{ fontSize: '14px', color: '#5f6673', margin: '4px 0 0' }}>
                      {slot.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => openMemberSubmitModal(slot)}
                    className="b-proto"
                    style={{
                      padding: '6px 18px',
                      fontSize: '13px',
                      minHeight: '36px',
                      background: '#ffffff',
                      border: '2px solid #0F172A',
                      color: '#0F172A',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Plus size={14} />
                    <span>+ أضف عملك في هذه الخانة</span>
                  </button>

                  {isLeader && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(slot.id, slot.title)}
                      title="حذف هذه الخانة"
                      style={{
                        background: '#FEE2E2',
                        color: '#DC2626',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* شريط الأيقونات والبطاقات الأفقي القابل للسحب (لو 5 عرضوا يطلعون 5 أيقونات تنسحب) */}
              <div
                style={{
                  display: 'flex',
                  gap: '18px',
                  overflowX: 'auto',
                  paddingBottom: '16px',
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                }}
                className="scrollbar-thin"
              >
                {slotProjects.length > 0 ? (
                  slotProjects.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="k"
                      style={{
                        flex: '0 0 310px',
                        minWidth: '290px',
                        maxWidth: '330px',
                        padding: 0,
                        overflow: 'hidden',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        scrollSnapAlign: 'start',
                        background: '#ffffff',
                        border: '2px solid #E2E8F0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      }}
                    >
                      {/* الغلاف العلوي مع زهرة قوقل وشارة المطور */}
                      <div
                        style={{
                          height: '110px',
                          backgroundColor: slot.color || GDG_COLORS[idx % GDG_COLORS.length].value,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <GooglePinwheelIcon size={75} />
                        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                          <span
                            style={{
                              padding: '3px 10px',
                              borderRadius: '99px',
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: '#ffffff',
                              color: '#0F172A',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            }}
                          >
                            مشروع معتمد ✓
                          </span>
                        </div>
                      </div>

                      {/* تفاصيل المشروع وروابطه */}
                      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                        <div>
                          <b style={{ fontSize: '18px', color: '#0F172A', display: 'block', lineHeight: 1.35, marginBottom: '6px' }}>
                            {p.title}
                          </b>
                          <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                            المطور: <strong>{p.memberName}</strong>
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                          <a
                            href={p.githubUrl?.startsWith('http') ? p.githubUrl : `https://${p.githubUrl || 'github.com'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="b-proto"
                            style={{
                              flex: 1,
                              background: '#F1F5F9',
                              color: '#0F172A',
                              padding: '6px 12px',
                              fontSize: '13px',
                              minHeight: '34px',
                              textDecoration: 'none',
                              textAlign: 'center',
                              fontWeight: 700,
                              borderRadius: '12px',
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
                                flex: 1,
                                background: '#E8F0FE',
                                color: '#1A73E8',
                                padding: '6px 12px',
                                fontSize: '13px',
                                minHeight: '34px',
                                textDecoration: 'none',
                                textAlign: 'center',
                                fontWeight: 700,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                              }}
                            >
                              <span>معاينة</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  /* بطاقة الانتظار الأنيقة عند عدم وجود تسليمات بعد في هذه الخانة */
                  <div
                    className="k"
                    style={{
                      flex: '0 0 310px',
                      minWidth: '290px',
                      maxWidth: '330px',
                      padding: 0,
                      overflow: 'hidden',
                      borderRadius: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      scrollSnapAlign: 'start',
                      background: '#ffffff',
                      border: '2px dashed #CBD5E1',
                    }}
                  >
                    <div
                      style={{
                        height: '110px',
                        backgroundColor: slot.color || '#4285F4',
                        opacity: 0.85,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <GooglePinwheelIcon size={75} />
                    </div>

                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <b style={{ fontSize: '17px', color: '#0F172A', display: 'block', lineHeight: 1.35, marginBottom: '6px' }}>
                          بانتظار مشاريع المطورين المبدعين ✨
                        </b>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                          كن أول من يسلم مشروعه في خانة «{slot.title}» ليعرض في هذا الشريط!
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => openMemberSubmitModal(slot)}
                        className="b-proto"
                        style={{
                          marginTop: '16px',
                          width: '100%',
                          background: '#E8F0FE',
                          color: '#1A73E8',
                          padding: '6px 14px',
                          fontSize: '13px',
                          minHeight: '34px',
                          fontWeight: 700,
                          borderRadius: '12px',
                          border: '1.5px solid #1A73E8',
                        }}
                      >
                        + تسليم عملك هنا الآن
                      </button>
                    </div>
                  </div>
                )}

                {/* بطاقة إضافية في نهاية الشريط لإتاحة التسليم السريع */}
                {slotProjects.length > 0 && (
                  <div
                    onClick={() => openMemberSubmitModal(slot)}
                    style={{
                      flex: '0 0 160px',
                      minWidth: '150px',
                      borderRadius: '24px',
                      border: '2px dashed #94A3B8',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '20px',
                      cursor: 'pointer',
                      backgroundColor: '#F8FAFC',
                      scrollSnapAlign: 'start',
                    }}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0F172A',
                      }}
                    >
                      <Plus size={20} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
                      أضف مشروعك هنا
                    </span>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* ================= 4. المعرض العام لجميع المشاريع (يبقى مثل ما هو) ================= */}
      <section style={{ borderTop: '2px solid #E2E8F0', paddingTop: '40px' }}>
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
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
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
                          {p.memberName}
                          {isLeader && p.stageName ? ` · ${p.stageName}` : ''}
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
            <FolderCode size={40} className="text-gray-400 mx-auto mb-3" />
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
              لا توجد مشاريع مسلّمة في هذا القسم بعد
            </h3>
            <p style={{ fontSize: '15px', color: '#5f6673', margin: '0 0 16px' }}>
              شاركونا إبداعاتكم البرمجية وتطبيقاتكم ليتم اعتمادها ونشرها في المعرض.
            </p>
            <button
              type="button"
              onClick={() => openMemberSubmitModal()}
              className="b-proto y"
              style={{ padding: '8px 24px', fontSize: '15px' }}
            >
              + إضافة مشروع جديد للمعرض
            </button>
          </div>
        )}
      </section>

      {/* ================= نافذة 1: إنشاء خانة جديدة في المعرض (خاص بالقادة 👑) ================= */}
      <AnimatePresence>
        {isSlotModalOpen && (
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
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  إنشاء خانة جديدة في المعرض 👑
                </h3>
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
                      عنوان الخانة أو المهمة *
                    </label>
                    <input
                      type="text"
                      required
                      value={slotTitle}
                      onChange={(e) => setSlotTitle(e.target.value)}
                      placeholder="مثال: مشاركات معرض الـفضاء / AR&VR أو مهمة تسجيل الدخول بحساب قوقل"
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
                      وصف وتفاصيل المهمة (اختياري)
                    </label>
                    <textarea
                      rows={3}
                      value={slotDesc}
                      onChange={(e) => setSlotDesc(e.target.value)}
                      placeholder="اكتب نبذة أو الشروط والمعايير المطلوبة لتسليمات الأعضاء في هذه الخانة..."
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

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      لون هوية الخانة
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {GDG_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setSlotColor(c.value)}
                          style={{
                            flex: 1,
                            height: '42px',
                            backgroundColor: c.value,
                            borderRadius: '12px',
                            border: slotColor === c.value ? '3px solid #0F172A' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}
                        >
                          {slotColor === c.value ? '✓' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSlot}
                    className="b-proto y"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      marginTop: '8px',
                    }}
                  >
                    {isSavingSlot ? 'جارٍ إنشاء الخانة...' : 'إنشاء الخانة في المعرض ✨'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= نافذة 2: تسليم العمل في الخانة واختيارها بحرية (يستخدمها الأعضاء 🚀) ================= */}
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
              className="k w-full max-w-lg text-right max-h-[90vh] overflow-y-auto"
              style={{ padding: '32px', backgroundColor: '#ffffff', borderRadius: '28px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                    تسليم عملك في المعرض 🚀
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#5f6673' }}>
                    حدّد الخانة أو المعرض المستهدف لتسليم مشروعك وعرضه فوراً.
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
                  {/* اختيار الخانة المستهدفة من القائمة المنسدلة */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                      اختيار الخانة أو المعرض المستهدف للتسليم *
                    </label>
                    <select
                      value={activeSlotId}
                      onChange={(e) => setActiveSlotId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        borderRadius: '16px',
                        border: '2px solid #4285F4',
                        fontSize: '15px',
                        fontWeight: 700,
                        backgroundColor: '#F8FAFC',
                        color: '#0F172A',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {slots.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                      <option value="general">المعرض العام لجميع المشاريع</option>
                    </select>
                  </div>

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
                      رابط المعاينة الحية (Live Demo) - اختياري لكن مفضل
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

                  {/* خانة إرفاق ملف تطبيقي (PDF, ZIP, صور) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      خانة إرفاق ملف تطبيقي (ملف مضغوط ZIP أو PDF أو صورة للتطبيق) - اختياري
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 18px',
                        borderRadius: '16px',
                        border: '2px dashed #94A3B8',
                        background: '#F8FAFC',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0F172A',
                      }}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <Paperclip size={16} className="text-blue-600" />
                      <span>{attachedFileName ? `تم اختيار: ${attachedFileName}` : 'انقر لإرفاق ملف من جهازك'}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAttachedFile(file);
                            setAttachedFileName(file.name);
                          }
                        }}
                      />
                    </label>
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
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      marginTop: '8px',
                    }}
                  >
                    {isSubmittingProj ? 'جارٍ تسليم المشروع...' : 'تسليم المشروع ونشره في المعرض ✨'}
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
