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
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(
    () => adminWorkshops[0]?.id || 'plan-ws-1'
  );

  const [editingWorkshop, setEditingWorkshop] = useState<AdminScheduledWorkshop | null>(null);
  const [editPresenter, setEditPresenter] = useState('');
  const [editMeetingUrl, setEditMeetingUrl] = useState('');
  const [editPosterUrl, setEditPosterUrl] = useState('');
  const [editTaskDesc, setEditTaskDesc] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchMember, setSearchMember] = useState('');

  // اشتراك في store
  useEffect(() => {
    const unsub = store.subscribe(() => {
      setAdminWorkshops(store.getAdminScheduledWorkshops());
      setMembers(store.getMembers());
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
    };

    store.updateAdminScheduledWorkshop(updated);
    setEditingWorkshop(null);
    setSuccessMsg(`تم تحديث تفاصيل ورشة «${updated.titleAr}» بنجاح ✓`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // تبديل حالة التحضير لعضو
  const handleToggleAttendance = (memberId: string, currentStatus: boolean) => {
    store.toggleAttendance(selectedWorkshopId, memberId, !currentStatus);
  };

  // تحضير جميع الأعضاء دفعة واحدة
  const handleMarkAllAttended = () => {
    const regularMembers = members.filter((m) => m.role === 'member');
    regularMembers.forEach((m) => {
      store.toggleAttendance(selectedWorkshopId, m.id, true);
    });
    setSuccessMsg(`تم تحضير جميع الأعضاء (${regularMembers.length} عضو) ورصد نقاط الحضور بنجاح ✓`);
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
                <option value="orientation-session">لقاء تدشين المسار (أمس) — اللقاء التعريفي</option>
                {adminWorkshops.map((w) => (
                  <option key={w.id} value={w.id}>
                    الورشة {w.orderNumber}: {w.titleAr} ({w.dateStr}) — {w.presenter}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  const title = prompt('أدخلي اسم الحدث أو الورشة الجديدة:');
                  if (!title) return;
                  const dateStr = prompt('أدخلي تاريخ أو وقت الحدث:', 'الأسبوع القادم') || 'مجدول';
                  const newId = `custom-event-${Date.now()}`;
                  store.addAttendanceEvent({
                    id: newId,
                    title,
                    type: 'workshop',
                    dateStr,
                  });
                  setSelectedWorkshopId(newId);
                  alert(`تمت إضافة الحدث: "${title}" إلى قائمة التحضير بنجاح!`);
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

              <button
                type="button"
                onClick={handleMarkAllAttended}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#4285F4] hover:bg-blue-600 transition-colors border-none cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
              >
                <Check size={13} />
                <span>تحضير جميع الأعضاء ✓</span>
              </button>
            </div>
          </div>

          {/* شريط الإحصائية للورشة المحددة */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs font-bold text-blue-950">
            <span>
              <strong>الحدث المحدد:</strong> {selectedWorkshop?.titleAr || 'لقاء المجال'} ({selectedWorkshop?.dateStr || 'أمس'})
            </span>
            <span className="bg-white px-3 py-1 rounded-full border border-blue-300 text-blue-900 font-black">
              نسبة الحضور: {attendedCount} من {regularMembers.length} عضو ({Math.round((attendedCount / (regularMembers.length || 1)) * 100)}%)
            </span>
          </div>

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
                                {sub.status === 'approved' ? 'معتمد (+50)' : 'قيد المراجعة'}
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
                <label className="block text-xs font-black text-gray-700 mb-1">
                  رابط بوستر الورشة (صورة البوستر):
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/poster.jpg"
                  value={editPosterUrl}
                  onChange={(e) => setEditPosterUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none text-left"
                  dir="ltr"
                />
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
                  حفظ التعديلات ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
