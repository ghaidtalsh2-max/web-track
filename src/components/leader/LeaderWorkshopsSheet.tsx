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
      {/* الترويسة الرئيسية مع شريط التبديل بين الخطة والشيت */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-black mb-1 border border-blue-200 shadow-2xs">
            <span>نوفمبر 2026</span>
            <span>·</span>
            <span>8 ورش معتمدة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950">
            خطة الورش وشيت التحضير الميداني 📋
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mt-0.5">
            جدولة المحاور والمقدمين، اعتماد ونشر الورش للأعضاء، وتحضير الحضور ورصد التسليمات كالشيت
          </p>
        </div>

        {/* أزرار التبديل الفرعية */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-gray-100 border border-gray-200">
          <button
            type="button"
            onClick={() => setActiveSubTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border-none ${
              activeSubTab === 'schedule'
                ? 'bg-[#0F1729] text-white shadow-xs'
                : 'bg-transparent text-gray-600 hover:text-gray-950'
            }`}
          >
            خطة الورش الـ 8 (المسودة) 📅
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('sheet')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border-none ${
              activeSubTab === 'sheet'
                ? 'bg-[#0F1729] text-white shadow-xs'
                : 'bg-transparent text-gray-600 hover:text-gray-950'
            }`}
          >
            شيت التحضير والتسليمات 📋
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
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 flex items-center justify-between gap-3 text-xs font-bold text-amber-950">
            <div className="flex items-center gap-2">
              <span className="text-base">🔒</span>
              <span>
                <strong>مسودة مجدولة لحسابات الإدارة فقط:</strong> الورش لا تظهر في حسابات الأعضاء حتى تقومي بالنقر على زر «اعتماد ونشر للأعضاء 🚀».
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {adminWorkshops.map((ws) => (
              <div
                key={ws.id}
                className={`p-6 rounded-3xl border-2 transition-all bg-white relative flex flex-col justify-between ${
                  ws.isPublished ? 'border-emerald-500 shadow-xs' : 'border-[#0F1729]'
                }`}
                style={{
                  borderRadius: '24px',
                  boxShadow: '0 4px 0 0 #0F1729',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-200">
                      الورشة {ws.orderNumber}
                    </span>

                    {ws.isPublished ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                        <Check size={12} />
                        <span>منشورة ومعتمدة للأعضاء ✓</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-300">
                        مسودة مجدولة (إدارة فقط) ⏳
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-gray-950 mb-1">
                    {ws.titleAr} <span className="text-sm font-bold text-gray-500">| {ws.titleEn}</span>
                  </h3>

                  <div className="text-xs font-bold text-gray-600 mb-3 flex items-center gap-3">
                    <span>📅 {ws.dateStr}</span>
                    <span>•</span>
                    <span>🎤 المقدّم: <strong>{ws.presenter}</strong></span>
                  </div>

                  {/* المحاور الرئيسية الأربعة */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 mb-3.5">
                    <span className="text-[11px] font-black text-gray-700 block mb-1.5">
                      المحاور الرئيسية الأربعة:
                    </span>
                    <ul className="space-y-1 text-xs text-gray-600 list-disc list-inside">
                      {ws.pillars.map((pil, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {pil}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* المهمة والتاسك */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 mb-4">
                    <span className="text-[11px] font-black text-amber-900 block mb-1">
                      {ws.taskNumber} — {ws.taskTitle}
                    </span>
                    <p className="text-xs text-amber-950 font-medium leading-relaxed">
                      {ws.taskDescription}
                    </p>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(ws)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-black bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors border border-gray-300 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Edit3 size={13} />
                    <span>تعديل الرابط والبوستر والتاسك</span>
                  </button>

                  {!ws.isPublished && (
                    <button
                      type="button"
                      onClick={() => handlePublish(ws)}
                      className="py-2 px-4 rounded-xl text-xs font-black bg-[#34A853] hover:bg-green-700 text-white transition-colors border-none cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>اعتماد ونشر للأعضاء 🚀</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. قسم شيت التحضير والتسليمات الميداني */}
      {activeSubTab === 'sheet' && (
        <div className="space-y-5">
          {/* أدوات الشيت: اختيار الورشة + البحث + تحضير الكل */}
          <div className="p-5 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
              <label className="text-xs font-black text-gray-800 shrink-0">
                اختيار الورشة المراد تحضيرها:
              </label>
              <select
                value={selectedWorkshopId}
                onChange={(e) => setSelectedWorkshopId(e.target.value)}
                className="px-4 py-2 rounded-2xl bg-gray-50 border border-gray-300 text-xs sm:text-sm font-black text-gray-900 focus:outline-none shadow-xs cursor-pointer flex-1"
              >
                {adminWorkshops.map((w) => (
                  <option key={w.id} value={w.id}>
                    الورشة {w.orderNumber}: {w.titleAr} ({w.dateStr}) — {w.presenter}
                  </option>
                ))}
              </select>
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
              <strong>الورشة المحددة:</strong> {selectedWorkshop.titleAr} | {selectedWorkshop.presenter} ({selectedWorkshop.dateStr})
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
                    <th className="py-3 px-4 text-center">تحضير الحضور (+20 نقطة)</th>
                    <th className="py-3 px-4">تسليم المهمة ({selectedWorkshop.taskNumber})</th>
                    <th className="py-3 px-4 text-center">النقاط الكلية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  {regularMembers.map((m, idx) => {
                    const isAttended = !!attendanceMap[m.id]?.attended;
                    const submissions = store.getSubmissions();
                    const sub = submissions.find(
                      (s) =>
                        (s.profile_id === m.id || s.userId === m.id) &&
                        (s.workshop_id === selectedWorkshop.id || s.taskTitle?.includes(selectedWorkshop.taskNumber))
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

                        {/* زر التحضير التفاعلي */}
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
