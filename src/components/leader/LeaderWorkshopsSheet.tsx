import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, AdminScheduledWorkshop } from '../../types';
import { store } from '../../services/store';
import { UserAvatar } from '../common/UserAvatar';
import confetti from 'canvas-confetti';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Edit3,
  ExternalLink,
  Users,
  Clock,
  Sparkles,
  Award,
  Layers,
  ChevronDown,
  Check,
  X,
  Search,
  Trash2,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

interface LeaderWorkshopsSheetProps {
  currentUser: UserProfile;
}

export const LeaderWorkshopsSheet: React.FC<LeaderWorkshopsSheetProps> = ({ currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'sheet'>('schedule');
  const [adminWorkshops, setAdminWorkshops] = useState<AdminScheduledWorkshop[]>(() =>
    store.getAdminScheduledWorkshops()
  );
  const [members, setMembers] = useState<UserProfile[]>(() => store.getMembers());
  const [attendanceEvents, setAttendanceEvents] = useState(() => store.getAttendanceEvents());
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(
    () => adminWorkshops[0]?.id || 'plan-ws-1'
  );

  const [editingWorkshop, setEditingWorkshop] = useState<AdminScheduledWorkshop | null>(null);
  const [editPresenter, setEditPresenter] = useState('');
  const [editMeetingUrl, setEditMeetingUrl] = useState('');
  const [editPosterUrl, setEditPosterUrl] = useState('');
  const [editTaskDesc, setEditTaskDesc] = useState('');
  const [editSubmissionDays, setEditSubmissionDays] = useState<number>(3);
  const [editDeliverySlots, setEditDeliverySlots] = useState<
    Array<{ id: string; dayLabel: string; timeLabel: string; capacity: number; bookedCount?: number }>
  >([]);
  const [newSlotDay, setNewSlotDay] = useState('اليوم 1');
  const [newSlotTime, setNewSlotTime] = useState('04:00 م - 06:00 م');
  const [newSlotCapacity, setNewSlotCapacity] = useState(10);

  // نافذة إضافة حدث أو ورشة جديدة للشيت
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('نوفمبر 2026');
  const [newEventType, setNewEventType] = useState<'workshop' | 'meeting' | 'other'>('workshop');

  const [successMsg, setSuccessMsg] = useState('');
  const [searchMember, setSearchMember] = useState('');
  const [isAttendanceEditMode, setIsAttendanceEditMode] = useState(false);

  // اشتراك في store
  useEffect(() => {
    const unsub = store.subscribe(() => {
      setAdminWorkshops(store.getAdminScheduledWorkshops());
      setMembers(store.getMembers());
      setAttendanceEvents(store.getAttendanceEvents());
    });
    return unsub;
  }, []);

  const selectedWorkshop = adminWorkshops.find((w) => w.id === selectedWorkshopId) || adminWorkshops[0];
  const attendanceMap = store.getWorkshopAttendance(selectedWorkshopId);

  // نشر الورشة واعتمادها للأعضاء
  const handlePublish = (ws: AdminScheduledWorkshop) => {
    const confirmed = window.confirm(
      `هل أنتِ متأكدة من اعتماد ونشر ورشة «${ws.titleAr}» وتاسك «${ws.taskTitle}» للأعضاء ليظهر في الواجهة الرئيسية فوراً؟`
    );
    if (!confirmed) return;

    store.publishAdminScheduledWorkshop(ws.id);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setSuccessMsg(`تم اعتماد ونشر ورشة «${ws.titleAr}» للأعضاء بنجاح! ✨`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // فتح نافذة تعديل بيانات الورشة
  const handleOpenEdit = (ws: AdminScheduledWorkshop) => {
    setEditingWorkshop(ws);
    setEditPresenter(ws.presenter);
    setEditMeetingUrl(ws.meetingUrl || '');
    setEditPosterUrl(ws.posterUrl || '');
    setEditTaskDesc(ws.taskDescription);
    setEditSubmissionDays(ws.submissionDaysCount || 3);
    setEditDeliverySlots(
      ws.deliverySlots && ws.deliverySlots.length > 0
        ? ws.deliverySlots
        : [
            { id: `slot-${ws.id}-1`, dayLabel: `اليوم 1 (${ws.dateStr.split(' ')[0] || 'اليوم'})`, timeLabel: '04:00 م - 06:00 م', capacity: 10, bookedCount: 0 },
            { id: `slot-${ws.id}-2`, dayLabel: `اليوم 1 (${ws.dateStr.split(' ')[0] || 'اليوم'})`, timeLabel: '08:00 م - 10:00 م', capacity: 15, bookedCount: 0 },
            { id: `slot-${ws.id}-3`, dayLabel: `اليوم 2 (اليوم التالي)`, timeLabel: '04:00 م - 06:00 م', capacity: 10, bookedCount: 0 },
            { id: `slot-${ws.id}-4`, dayLabel: `اليوم 2 (اليوم التالي)`, timeLabel: '08:00 م - 10:00 م', capacity: 15, bookedCount: 0 },
          ]
    );
  };

  // حفظ التعديلات على الورشة
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkshop) return;

    const updated: AdminScheduledWorkshop = {
      ...editingWorkshop,
      presenter: editPresenter.trim() || editingWorkshop.presenter,
      meetingUrl: editMeetingUrl.trim() || undefined,
      posterUrl: editPosterUrl.trim() || undefined,
      taskDescription: editTaskDesc.trim() || editingWorkshop.taskDescription,
      submissionDaysCount: editSubmissionDays,
      deliverySlots: editDeliverySlots,
    };

    store.updateAdminScheduledWorkshop(updated);
    setEditingWorkshop(null);
    setSuccessMsg(`تم تحديث تفاصيل ورشة «${updated.titleAr}» ومواعيد التسليم بنجاح ✓`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // تبديل حالة التحضير لعضو ومزامنته مركزياً
  const handleToggleAttendance = async (memberId: string, currentStatus: boolean) => {
    await store.toggleAttendance(selectedWorkshopId, memberId, !currentStatus);
  };

  // تحضير جميع الأعضاء دفعة واحدة
  const handleMarkAllAttended = async () => {
    const regularMembers = members.filter((m) => m.role === 'member');
    for (const m of regularMembers) {
      await store.toggleAttendance(selectedWorkshopId, m.id, true);
    }
    setSuccessMsg(`تم تحضير جميع الأعضاء (${regularMembers.length} عضو) ورصد نقاط الحضور وتثبيتها بنجاح ✓`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const regularMembers = members
    .filter((m) => m.role === 'member')
    .filter(
      (m) =>
        m.fullName.toLowerCase().includes(searchMember.toLowerCase()) ||
        m.username.toLowerCase().includes(searchMember.toLowerCase())
    );

  const attendedCount = Object.values(attendanceMap).filter((a) => a.attended).length;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* ترويسة خطة الورش المطابقة للنموذج بالملي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
            خطة الورش
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-bold mt-1">
            ٨ ورش · نوفمبر ٢٠٢٦ · {adminWorkshops.filter((w) => w.isPublished).length} منشورة
          </p>
        </div>

        {/* أزرار التبديل الفرعية البيضاوية (tabs-proto) */}
        <div className="tabs-proto">
          <button
            type="button"
            onClick={() => setActiveSubTab('schedule')}
            className={activeSubTab === 'schedule' ? 'on' : ''}
          >
            خطة الورش
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('sheet')}
            className={activeSubTab === 'sheet' ? 'on' : ''}
          >
            شيت التحضير
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black text-center shadow-2xs">
          {successMsg}
        </div>
      )}

      {/* 1. قسم خطة الورش الـ 8 (المسودة للإدارة) */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-4">
          <div className="k flex items-center gap-3.5" style={{ background: '#FFF4D6', borderColor: '#F9AB00', padding: '16px 24px', borderRadius: '24px' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-[#0F172A]">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span style={{ fontSize: '17px', fontWeight: 600, color: '#0F172A' }}>
              الورش مسودة لحساب القادة فقط، ولا تظهر للأعضاء إلا بعد «اعتماد ونشر».
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {adminWorkshops.map((ws, idx) => {
              const bgColors = ['#4285F4', '#EA4335', '#34A853', '#F9AB00', '#4285F4', '#EA4335', '#34A853', '#F9AB00'];
              const iconBg = bgColors[idx % bgColors.length];

              return (
                <div
                  key={ws.id}
                  className="k flex gap-5 items-center transition-transform hover:-translate-y-1"
                  style={{ padding: '22px 24px' }}
                >
                  {/* صندوق الأيقونة الأنيق المصغر 72x72px وأيقونة 34x34px */}
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      minWidth: '72px',
                      minHeight: '72px',
                      borderRadius: '18px',
                      backgroundColor: iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0F172A',
                      flexShrink: 0,
                    }}
                  >
                    {idx % 4 === 0 ? (
                      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
                      </svg>
                    ) : idx % 4 === 1 ? (
                      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 3v12" />
                        <circle cx="18" cy="6" r="3" />
                        <circle cx="6" cy="18" r="3" />
                        <path d="M18 9a9 9 0 0 1-9 9" />
                      </svg>
                    ) : idx % 4 === 2 ? (
                      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M9 21V9" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                        <path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0" />
                      </svg>
                    )}
                  </div>

                  {/* تفاصيل الورشة والأزرار */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="t-proto" style={{ background: '#fff', border: '1.5px solid #c9ced3' }}>
                          الورشة {ws.orderNumber}
                        </span>

                        {ws.isPublished ? (
                          <span className="t-proto" style={{ background: '#E6F4EA' }}>
                            <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', background: '#34A853', marginInlineEnd: '6px' }} />
                            <span>منشورة</span>
                          </span>
                        ) : (
                          <span className="t-proto" style={{ background: '#F1F3F4' }}>
                            <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', background: '#9AA0A6', marginInlineEnd: '6px' }} />
                            <span>مسودة</span>
                          </span>
                        )}
                      </div>

                      <b className="font-['Arimo'] text-2xl font-bold text-[#0F172A] block truncate" style={{ fontSize: '24px' }}>
                        {ws.titleEn || ws.titleAr}
                      </b>
                      <span className="text-base text-gray-700 font-bold block mb-2" style={{ fontSize: '17px' }}>
                        {ws.titleAr}
                      </span>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#3c4452] mb-3" style={{ fontSize: '15px' }}>
                        <span className="flex items-center gap-1.5">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          <span>{ws.dateStr}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="9" y="2" width="6" height="12" rx="3" />
                            <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3" />
                          </svg>
                          <span>المقدّم: {ws.presenter}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 mt-auto pt-2">
                      {store.canManageWorkshops() ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(ws)}
                            className="b-proto"
                            style={{ background: '#F1F3F4', padding: '8px 18px', minHeight: '42px', fontSize: '16px' }}
                          >
                            تعديل
                          </button>

                          {!ws.isPublished ? (
                            <button
                              type="button"
                              onClick={() => handlePublish(ws)}
                              className="b-proto"
                              style={{ backgroundColor: iconBg, color: '#fff', padding: '8px 18px', minHeight: '42px', fontSize: '16px' }}
                            >
                              اعتماد ونشر
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                store.updateAdminScheduledWorkshop({ ...ws, isPublished: false });
                                setSuccessMsg(`تمت إعادة ورشة «${ws.titleAr}» إلى مسودة.`);
                                setTimeout(() => setSuccessMsg(''), 3000);
                              }}
                              className="b-proto"
                              style={{ backgroundColor: '#FFF4D6', color: '#0F172A', border: '1.5px solid #F9AB00', padding: '8px 14px', minHeight: '42px', fontSize: '14px' }}
                            >
                              إلغاء النشر
                            </button>
                          )}
                        </>
                      ) : store.isSupervisorOnly() ? (
                        <button
                          type="button"
                          onClick={async () => {
                            await store.requestSupervisorPermission(currentUser.fullName, `نشر أو تعديل ورشة ${ws.titleAr}`);
                            alert('تم إرسال طلب الصلاحية إلى القائدة غيداء بنجاح ✨');
                          }}
                          className="b-proto"
                          style={{ background: '#EEF2FF', color: '#4338CA', border: '1.5px solid #C7D2FE', padding: '8px 14px', minHeight: '42px', fontSize: '13px' }}
                        >
                          طلب إذن اعتماد من غيداء 📩
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. قسم شيت التحضير والتسليمات الميداني */}
      {activeSubTab === 'sheet' && (
        <div className="space-y-5">
          {/* أدوات الشيت: اختيار الورشة/الحدث + إضافة حدث جديد + البحث + تحضير الكل */}
          <div className="p-5 rounded-3xl bg-white border-2 border-[#0F172A] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
              <label className="text-xs font-black text-gray-800 shrink-0">
                اختيار الورشة أو الحدث:
              </label>
              <select
                value={selectedWorkshopId}
                onChange={(e) => setSelectedWorkshopId(e.target.value)}
                className="px-4 py-2 rounded-2xl bg-gray-50 border border-gray-300 text-xs sm:text-sm font-black text-gray-900 focus:outline-none shadow-xs cursor-pointer flex-1"
              >
                <option value="orientation-session">اللقاء التعريفي</option>
                {adminWorkshops.map((w) => (
                  <option key={w.id} value={w.id}>
                    الورشة {w.orderNumber}: {w.titleAr} ({w.dateStr}) — {w.presenter}
                  </option>
                ))}
                {attendanceEvents
                  .filter((evt) => evt.id !== 'evt-intro' && !adminWorkshops.some((w) => w.id === evt.id))
                  .map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.dateStr})
                    </option>
                  ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  setNewEventTitle('');
                  setNewEventDate('نوفمبر 2026');
                  setNewEventType('workshop');
                  setIsAddEventModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shrink-0 cursor-pointer"
              >
                + إضافة حدث/ورشة جديدة
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث عن عضو..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="px-3.5 py-1.5 pr-8 text-xs font-bold rounded-xl border border-gray-300 bg-gray-50 focus:outline-none"
                />
                <Search size={13} className="absolute right-2.5 top-2.5 text-gray-400" />
              </div>

              {isAttendanceEditMode ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMarkAllAttended}
                    className="px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#4285F4] hover:bg-blue-600 transition-colors border-none cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                  >
                    <Check size={13} />
                    <span>تحضير الكل ✓</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAttendanceEditMode(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#0F1729] hover:bg-gray-800 transition-colors border-none cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                  >
                    <span>قفل وحفظ ✓</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAttendanceEditMode(true)}
                  className="px-4 py-2 rounded-xl text-xs font-black text-gray-800 bg-white hover:bg-gray-100 transition-colors border border-gray-300 cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                >
                  <Edit3 size={13} />
                  <span>تعديل كشف التحضير</span>
                </button>
              )}
            </div>
          </div>

          {/* شريط الإحصائية وحالة إنجاز التحضير للورشة المحددة */}
          {(() => {
            let displayTitle = 'اللقاء التعريفي';
            let displayDate = 'الخميس 29 أكتوبر 2026';
            if (selectedWorkshopId === 'orientation-session' || selectedWorkshopId === 'evt-intro') {
              displayTitle = 'اللقاء التعريفي';
              displayDate = 'الخميس 29 أكتوبر 2026';
            } else {
              const ws = adminWorkshops.find((w) => w.id === selectedWorkshopId);
              if (ws) {
                displayTitle = `الورشة ${ws.orderNumber}: ${ws.titleAr}`;
                displayDate = ws.dateStr;
              } else {
                const customEvt = attendanceEvents.find((e) => e.id === selectedWorkshopId);
                if (customEvt) {
                  displayTitle = customEvt.title;
                  displayDate = customEvt.dateStr;
                }
              }
            }

            const attendanceLead =
              Object.values(attendanceMap).find((a) => a.markedBy)?.markedBy || 'ريتال القثامي';
            const isCompleted = attendedCount > 0;

            return isCompleted ? (
              <div className="p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-bold text-emerald-950 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
                    ✓
                  </span>
                  <div>
                    <div className="text-sm font-black text-emerald-900 flex items-center gap-2">
                      <span>تم إنجاز التحضير لهذا الحدث بنجاح</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        كشف معتمد
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 font-medium mt-0.5">
                      الحدث: <strong>{displayTitle}</strong> ({displayDate}) · تم التحضير بواسطة: <strong>{attendanceLead}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="bg-white px-3 py-1.5 rounded-xl border border-emerald-300 text-emerald-900 font-black shadow-2xs">
                    الحاضرون: {attendedCount} من {regularMembers.length} ({Math.round((attendedCount / (regularMembers.length || 1)) * 100)}%)
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsAttendanceEditMode(!isAttendanceEditMode)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border shadow-2xs ${
                      isAttendanceEditMode
                        ? 'bg-[#0F1729] text-white border-transparent hover:bg-gray-800'
                        : 'bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    {isAttendanceEditMode ? 'قفل وحفظ الكشف ✓' : '✏️ تعديل كشف التحضير'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs font-bold text-blue-950">
                <span>
                  <strong>الحدث المحدد:</strong> {displayTitle} ({displayDate})
                </span>
                <span className="bg-white px-3 py-1 rounded-full border border-blue-300 text-blue-900 font-black">
                  لم يتم إجراء التحضير بعد (0 من {regularMembers.length} عضو)
                </span>
              </div>
            );
          })()}

          {/* جدول الشيت الميداني (مثل Google Sheets) */}
          <div className="rounded-3xl border-2 border-[#0F1729] bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-900 text-xs font-black border-b border-gray-300">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">اسم العضو</th>
                    <th className="py-3 px-4">المعرف والمسار</th>
                    <th className="py-3 px-4 text-center">تحضير هذا الحدث</th>
                    <th className="py-3 px-4 text-center">معدل الحضور العام</th>
                    <th className="py-3 px-4">تسليم المهمة ({selectedWorkshop?.taskNumber || 'التاسك'})</th>
                    <th className="py-3 px-4 text-center">النقاط الكلية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  {regularMembers.map((m, idx) => {
                    const isAttended = !!attendanceMap[m.id]?.attended;
                    const attStats = store.getMemberAttendanceStats(m.id);
                    const submissions = store.getSubmissions();
                    const sub = submissions.find(
                      (s) =>
                        (s.profile_id === m.id || s.userId === m.id) &&
                        (s.workshop_id === selectedWorkshop?.id || s.taskTitle?.includes(selectedWorkshop?.taskNumber || ''))
                    );

                    return (
                      <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 text-center font-bold text-gray-400">
                          {idx + 1}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar
                              letter={m.avatarLetter}
                              name={m.fullName}
                              avatarUrl={m.avatarUrl}
                              color={m.badgeColor}
                              size="xs"
                              role={m.role}
                            />
                            <span className="font-black text-gray-950">{m.fullName}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-gray-500 font-medium">
                          <span>{m.username}</span>
                          <span className="text-[10px] text-gray-400 block">{m.major || 'علوم حاسب'}</span>
                        </td>

                        {/* زر التحضير التفاعلي للحدث الحالي */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleAttendance(m.id, isAttended)}
                            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border ${
                              isAttended
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-2xs hover:bg-emerald-200'
                                : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {isAttended ? 'حاضر ✓' : 'غائب ✗'}
                          </button>
                        </td>

                        {/* معدل الحضور العام ونسبة الحضور من الورش */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-black inline-block ${
                              attStats.rate >= 80
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : attStats.rate >= 50
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {attStats.rate}% ({attStats.attended}/{attStats.total})
                          </span>
                        </td>

                        {/* تسليم المهمة */}
                        <td className="py-3 px-4">
                          {sub ? (
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                  sub.status === 'approved'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {sub.status === 'approved' ? 'معتمد (+25)' : 'قيد المراجعة'}
                              </span>
                              {sub.githubUrl && (
                                <a
                                  href={sub.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline inline-flex items-center gap-0.5 text-[11px]"
                                >
                                  <span>GitHub</span>
                                  <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-[11px] font-bold">لم يسلّم بعد</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center font-black text-gray-900">
                          {m.points || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* نافذة مودال لتعديل تفاصيل الورشة والروابط والبوستر */}
      {editingWorkshop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setEditingWorkshop(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-gray-900 text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-black text-gray-900">
                تعديل ورشة «{editingWorkshop.titleAr}» ✏️
              </h3>
              <button
                type="button"
                onClick={() => setEditingWorkshop(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  اسم المقدّم / المقدّمة:
                </label>
                <input
                  type="text"
                  value={editPresenter}
                  onChange={(e) => setEditPresenter(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5">
                  بوستر الورشة (صورة الغلاف):
                </label>

                {/* معاينة الصورة المرفوعة أو الرابط */}
                {editPosterUrl ? (
                  <div className="relative mb-2.5 rounded-2xl overflow-hidden border-2 border-gray-900 group bg-gray-100">
                    <img
                      src={editPosterUrl}
                      alt="بوستر الورشة"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label
                        htmlFor="poster-file-upload-input"
                        className="px-3 py-1.5 rounded-xl bg-white text-gray-900 text-xs font-black cursor-pointer shadow-md hover:bg-gray-100 transition-colors flex items-center gap-1"
                      >
                        <Upload size={13} />
                        <span>تغيير الصورة</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setEditPosterUrl('')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-black cursor-pointer shadow-md hover:bg-rose-700 border-none flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>حذف الصورة</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="poster-file-upload-input"
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-blue-50/60 hover:border-blue-400 cursor-pointer transition-colors mb-2 text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#4285F4] flex items-center justify-center mb-1.5">
                      <Upload size={18} />
                    </div>
                    <span className="text-xs font-black text-gray-800">
                      اضغط لرفع صورة البوستر من جهازك 🖼️
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold mt-0.5">
                      يدعم الصور من الجوال أو الكمبيوتر (PNG, JPG, WebP)
                    </span>
                  </label>
                )}

                <input
                  id="poster-file-upload-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (loadEvt) => {
                        const res = loadEvt.target?.result as string;
                        if (res) setEditPosterUrl(res);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                {/* خيار إضافي: رابط صورة مباشر إذا فضّل المستخدم ذلك */}
                <div className="mt-1">
                  <span className="text-[10px] text-gray-500 font-bold block mb-1">
                    أو الصق رابط صورة خارجي (اختياري):
                  </span>
                  <input
                    type="url"
                    placeholder="https://example.com/poster.jpg"
                    value={editPosterUrl.startsWith('data:') ? '' : editPosterUrl}
                    onChange={(e) => setEditPosterUrl(e.target.value)}
                    className="w-full px-3.5 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  رابط اللقاء المباشر (Google Meet / Zoom):
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xyz"
                  value={editMeetingUrl}
                  onChange={(e) => setEditMeetingUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">
                  وصف وتوجيهات التاسك والتحدي:
                </label>
                <textarea
                  rows={3}
                  value={editTaskDesc}
                  onChange={(e) => setEditTaskDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none leading-relaxed"
                />
              </div>

              {/* تحديد مدة إتاحة التسليم بالأيام */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                <label className="block text-xs font-black text-blue-950">
                  ⏳ كم يوم يكون متاحاً للتسليم؟ (مدة استقبال الحلول)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5, 7].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setEditSubmissionDays(days)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        editSubmissionDays === days
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {days} {days === 1 ? 'يوم' : days === 2 ? 'يومان' : 'أيام'}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={editSubmissionDays}
                    onChange={(e) => setEditSubmissionDays(Number(e.target.value) || 1)}
                    className="w-16 px-2 py-1.5 text-xs font-black border border-gray-300 rounded-xl text-center bg-white"
                  />
                  <span className="text-xs text-gray-600 font-bold">يوم</span>
                </div>
              </div>

              {/* تحديد أوقات وفترات التسليم وسعة كل فترة */}
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-purple-950">
                    📅 فترات ومواعيد التسليم المتاحة وسعة كل موعد
                  </label>
                  <span className="text-[11px] font-bold text-purple-800">
                    ({editDeliverySlots.length} فترات محددة)
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {editDeliverySlots.map((slot, idx) => (
                    <div
                      key={slot.id || idx}
                      className="p-2.5 rounded-xl bg-white border border-purple-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-black text-gray-900">{slot.dayLabel}</span>
                        <span className="text-gray-400">·</span>
                        <span className="font-bold text-purple-700">{slot.timeLabel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900 font-black text-[11px]">
                          السعة: {slot.capacity} أعضاء
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditDeliverySlots((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 border-none bg-transparent cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* إضافة فترة جديدة */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-200">
                  <input
                    type="text"
                    value={newSlotDay}
                    onChange={(e) => setNewSlotDay(e.target.value)}
                    placeholder="اليوم (مثلاً: اليوم 1 أو الثلاثاء)"
                    className="flex-1 min-w-[110px] px-2.5 py-1.5 text-xs rounded-lg border border-purple-300 bg-white"
                  />
                  <input
                    type="text"
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    placeholder="الوقت (مثلاً: 04:00 م - 06:00 م)"
                    className="flex-1 min-w-[130px] px-2.5 py-1.5 text-xs rounded-lg border border-purple-300 bg-white"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newSlotCapacity}
                      onChange={(e) => setNewSlotCapacity(Number(e.target.value) || 1)}
                      className="w-14 px-2 py-1.5 text-xs font-black rounded-lg border border-purple-300 text-center bg-white"
                    />
                    <span className="text-[11px] text-gray-500 font-bold">عضو</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSlotDay.trim() || !newSlotTime.trim()) return;
                      setEditDeliverySlots((prev) => [
                        ...prev,
                        {
                          id: `slot-custom-${Date.now()}`,
                          dayLabel: newSlotDay.trim(),
                          timeLabel: newSlotTime.trim(),
                          capacity: newSlotCapacity,
                          bookedCount: 0,
                        },
                      ]);
                      setNewSlotDay(`اليوم ${editDeliverySlots.length + 2}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-black text-xs border-none cursor-pointer"
                  >
                    + إضافة موعد
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingWorkshop(null)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 border-none cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white bg-[#0F1729] hover:bg-gray-800 border-none cursor-pointer shadow-xs"
                >
                  حفظ التعديلات والمواعيد ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة إضافة حدث أو ورشة جديدة في الشيت */}
      <AnimatePresence>
        {isAddEventModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsAddEventModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-[#0F1729] text-right"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>إضافة حدث أو ورشة جديدة للتحضير 📝</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 border-none bg-transparent cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newEventTitle.trim()) return;
                  const newEvt = store.addAttendanceEvent(
                    newEventTitle.trim(),
                    newEventType,
                    newEventDate.trim() || 'نوفمبر 2026'
                  );
                  setAttendanceEvents(store.getAttendanceEvents());
                  setSelectedWorkshopId(newEvt.id);
                  setIsAddEventModalOpen(false);
                  setSuccessMsg(`تمت إضافة حدث «${newEvt.title}» وظهوره في القائمة بنجاح! ✨`);
                  setTimeout(() => setSuccessMsg(''), 3000);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-black text-gray-800 mb-1">
                    اسم الورشة أو الحدث *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="مثال: ورشة تفاعلية في Tailwind CSS أو جلسة أسئلة وأجوبة"
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-black text-gray-800 mb-1">
                    تاريخ ووقت الحدث
                  </label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="مثال: الخميس 12 نوفمبر 2026 — 08:00 م"
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-black text-gray-800 mb-1">
                    نوع الحدث
                  </label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-gray-900 focus:outline-none bg-gray-50"
                  >
                    <option value="workshop">ورشة عمل تطبيقية (Workshop)</option>
                    <option value="meeting">لقاء عام أو سيشن نقاشي (Meeting)</option>
                    <option value="other">فعالية أو هاكاثون خاص (Other)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddEventModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 border-none cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 border-none cursor-pointer shadow-xs"
                  >
                    إضافة الحدث واختياره فوراً ✓
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
