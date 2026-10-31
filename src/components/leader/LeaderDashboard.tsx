import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, NavTab, Course } from '../../types';
import { store } from '../../services/store';
import { supabase } from '../../services/supabase';
import { Pinwheel, KpiTile, PathWave, QuickCreate } from './leaderVisuals';
import { LeaderWorkshopsSheet } from './LeaderWorkshopsSheet';
import { ProfileView } from '../profile/ProfileView';
import { LeaderEvaluationsView } from './LeaderEvaluationsView';
import { LeaderLearningSourcesView } from './LeaderLearningSourcesView';
import confetti from 'canvas-confetti';
import {
  Users,
  CheckSquare,
  Clock,
  TrendingUp,
  Plus,
  Upload,
  FileSpreadsheet,
  Search,
  Check,
  X,
  MessageSquare,
  Star,
  Award,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';

interface LeaderDashboardProps {
  currentUser: UserProfile;
  currentTab: NavTab;
  onNavigateTab: (tab: NavTab) => void;
}

export const LeaderDashboard: React.FC<LeaderDashboardProps> = ({
  currentUser,
  currentTab,
  onNavigateTab,
}) => {
  const [members, setMembers] = useState<UserProfile[]>(() => store.getMembers());
  const [courses, setCourses] = useState<Course[]>(() => store.getCourses());
  const [inquiries, setInquiries] = useState(() => store.getInquiries());
  const [polls, setPolls] = useState(() => store.getPolls());
  const [rankings, setRankings] = useState(() => store.getActiveRankings());
  const [starSuccessMsg, setStarSuccessMsg] = useState('');
  const [, forceRender] = useState(0);

  // الأعضاء والأرقام تأتي من Supabase بشكل غير متزامن → نعيد القراءة عند كل تحديث للـ store
  useEffect(() => {
    store.refreshData().catch((err) => console.warn('refreshData error:', err));
    const sync = () => {
      setMembers(store.getMembers());
      setInquiries(store.getInquiries());
      setPolls(store.getPolls());
      forceRender((n) => n + 1);
    };
    sync();
    return store.subscribe(sync);
  }, []);

  // حالة إضافة ومنح النقاط
  const [awardTarget, setAwardTarget] = useState<'all' | string>('all');
  const [awardCustomInput, setAwardCustomInput] = useState<string>('20');
  const [awardReason, setAwardReason] = useState<string>('مشاركة وتفاعل متميز في مسار الويب');
  const [isAwardingPoints, setIsAwardingPoints] = useState(false);
  const [awardSuccessMsg, setAwardSuccessMsg] = useState('');
  const [awardErrorMsg, setAwardErrorMsg] = useState('');

  const handleAwardPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    setAwardSuccessMsg('');
    setAwardErrorMsg('');
    const pts = parseInt(awardCustomInput, 10);
    if (isNaN(pts) || pts <= 0) {
      setAwardErrorMsg('يرجى تحديد عدد نقاط صحيح أكبر من 0.');
      return;
    }
    const reason = awardReason.trim() || 'مكافأة مسار تصميم وتطوير الويب';

    if (!store.canAwardPoints()) {
      if (store.isSupervisorOnly()) {
        try {
          await store.requestSupervisorPermission(currentUser.fullName, `منح ${pts} نقطة: ${reason}`);
          setAwardSuccessMsg('تم إرسال طلب اعتماد رصد النقاط إلى القائدة غيداء بنجاح للموافقة عليها ✨');
        } catch {
          setAwardErrorMsg('تعذّر إرسال طلب الصلاحية حالياً.');
        }
        return;
      }
      setAwardErrorMsg('صلاحية رصد النقاط محصورة بقادة المجال (غيداء وريتال).');
      return;
    }

    setIsAwardingPoints(true);
    try {
      if (awardTarget === 'all') {
        const memberList = members.filter((m) => m.role === 'member');
        if (memberList.length === 0) {
          throw new Error('لا يوجد أعضاء في المسار لمنحهم النقاط.');
        }
        for (const m of memberList) {
          await store.awardPoints(m.id, pts, reason);
        }
        setAwardSuccessMsg(`تم بنجاح منح ${pts} نقطة لكل عضو من أعضاء المسار الـ (${memberList.length}) عضواً! ✨`);
      } else if (awardTarget.startsWith('level:')) {
        const targetLevel = awardTarget.replace('level:', '');
        const memberList = members.filter((m) => m.role === 'member' && m.webLevel === targetLevel);
        if (memberList.length === 0) {
          throw new Error('لا يوجد أعضاء مسجلين في هذا المستوى التعليمي.');
        }
        for (const m of memberList) {
          await store.awardPoints(m.id, pts, reason);
        }
        const levelNames: Record<string, string> = {
          beginner: 'المستوى 1: مبتدئ',
          intermediate: 'المستوى 2: متوسط',
          advanced: 'المستوى 3: متقدم',
        };
        setAwardSuccessMsg(`تم بنجاح منح ${pts} نقطة لجميع أعضاء ${levelNames[targetLevel] || targetLevel} الـ (${memberList.length}) عضواً! ✨`);
      } else {
        const targetMember = members.find((m) => m.id === awardTarget);
        if (!targetMember) throw new Error('العضو المحدد غير موجود.');
        await store.awardPoints(targetMember.id, pts, reason);
        setAwardSuccessMsg(`تم بنجاح منح ${pts} نقطة للعضو (${targetMember.fullName})! ✨`);
      }
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
      await store.refreshData();
    } catch (err: any) {
      setAwardErrorMsg(err?.message || 'تعذّر إتمام قيد النقاط.');
    } finally {
      setIsAwardingPoints(false);
    }
  };

  const notifyAllMembers = (n: Omit<Parameters<typeof store.addNotification>[0], 'userId'>) => {
    members
      .filter((m) => m.role === 'member')
      .forEach((m) => store.addNotification({ ...n, userId: m.id }));
  };

  // حالة المراجعة السريعة
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<{
    id: string;
    profileId: string;
    studentName: string;
    taskTitle: string;
    repoUrl: string;
    liveUrl?: string;
    notes?: string;
  } | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewPoints, setReviewPoints] = useState(25);

  // حالة الرد على الاستفسار
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  // استيراد ملف الإكسل
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importedRowsCount, setImportedRowsCount] = useState<number | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  // تقييم الأداء القيادي (للمشرفين)
  const [selectedLeaderToEval, setSelectedLeaderToEval] = useState('غيداء تركي الشريف');
  const [evalPeriod, setEvalPeriod] = useState('الربع الأول 2026');
  const [evaluationScores, setEvaluationScores] = useState({
    commitment: 5,
    quality: 5,
    initiative: 4,
    engagement: 5,
    collaboration: 5,
  });
  const [evalStrengths, setEvalStrengths] = useState('التزام استثنائي بالمواعيد وتفاعل عالي مع الأعضاء وتنظيم ورش متميزة في مسار الويب.');
  const [evalImprovements, setEvalImprovements] = useState('زيادة عدد جلسات الإرشاد الفردي وتوسيع التحديات المتقدمة للأعضاء المتميزين.');
  const [evalRecommendations, setEvalRecommendations] = useState('إطلاق هاكاثون مصغر لمسار الويب في نهاية المرحلة الثانية لتعزيز العمل الجماعي.');
  const [recFollowUpStatus, setRecFollowUpStatus] = useState<'in_progress' | 'completed'>('in_progress');
  const [evalSavedMsg, setEvalSavedMsg] = useState('');

  // نماذج الإنشاء السريعة (+ ورشة، + مهمة، + استبيان، + إعلان)
  const [workshopModalOpen, setWorkshopModalOpen] = useState(false);
  const [newWorkshopTitle, setNewWorkshopTitle] = useState('');
  const [newWorkshopTime, setNewWorkshopTime] = useState('');
  const [newWorkshopPresenter, setNewWorkshopPresenter] = useState('');
  const [newWorkshopDesc, setNewWorkshopDesc] = useState('');
  const [workshopImageFile, setWorkshopImageFile] = useState<File | null>(null);
  const [workshopImagePreview, setWorkshopImagePreview] = useState<string>('');
  const [workshopImageError, setWorkshopImageError] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newWorkshopRegUrl, setNewWorkshopRegUrl] = useState('');
  const [newWorkshopTopics, setNewWorkshopTopics] = useState('');
  const [workshopSuccessMsg, setWorkshopSuccessMsg] = useState('');
  const [workshopErrorMsg, setWorkshopErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setWorkshopImageError('');
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setWorkshopImageError('حجم الصورة يتجاوز الحد الأقصى (2 ميجابايت). الرجاء اختيار صورة أصغر.');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setWorkshopImageError('نوع الملف غير مدعوم. الأنواع المدعومة: PNG, JPEG, WEBP.');
      return;
    }

    setWorkshopImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setWorkshopImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setWorkshopImageFile(null);
    setWorkshopImagePreview('');
    setWorkshopImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskLevel, setNewTaskLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [newTaskPoints, setNewTaskPoints] = useState(50);
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [taskSuccessMsg, setTaskSuccessMsg] = useState('');

  const [pollModalOpen, setPollModalOpen] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '', '']);
  const [pollSuccessMsg, setPollSuccessMsg] = useState('');

  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [newAnnounceTitle, setNewAnnounceTitle] = useState('');
  const [newAnnounceBody, setNewAnnounceBody] = useState('');
  const [announceSuccessMsg, setAnnounceSuccessMsg] = useState('');

  // البحث والتصفية والترتيب للأعضاء
  const [memberSearch, setMemberSearch] = useState('');
  const [memberLevelFilter, setMemberLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [memberSortBy, setMemberSortBy] = useState<'alpha_asc' | 'alpha_desc' | 'level' | 'points'>('alpha_asc');
  const [memberViewMode, setMemberViewMode] = useState<'cards' | 'table'>('cards');
  const [viewingMemberModal, setViewingMemberModal] = useState<UserProfile | null>(null);

  const filteredMembers = members
    .filter((m) => {
      if (m.role !== 'member') return false;
      const matchesSearch =
        m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.username.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.major?.toLowerCase().includes(memberSearch.toLowerCase()) ||
        (m.academicYear && m.academicYear.toLowerCase().includes(memberSearch.toLowerCase())) ||
        (m.skills && m.skills.some((s) => s.toLowerCase().includes(memberSearch.toLowerCase())));
      const matchesLevel = memberLevelFilter === 'all' || m.webLevel === memberLevelFilter;
      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      if (memberSortBy === 'alpha_asc') {
        return a.fullName.localeCompare(b.fullName, 'ar');
      }
      if (memberSortBy === 'alpha_desc') {
        return b.fullName.localeCompare(a.fullName, 'ar');
      }
      if (memberSortBy === 'level') {
        const levelOrder: Record<string, number> = { advanced: 3, intermediate: 2, beginner: 1 };
        return (levelOrder[b.webLevel] || 1) - (levelOrder[a.webLevel] || 1);
      }
      if (memberSortBy === 'points') {
        return (b.points || 0) - (a.points || 0);
      }
      return 0;
    });

  const [reviewError, setReviewError] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  const handleReviewSubmissionAction = async (action: 'approved' | 'needs_revision' | 'rejected') => {
    if (!selectedSubmission || isReviewing) return;
    setIsReviewing(true);
    setReviewError('');

    const sub = selectedSubmission;
    const pts = reviewPoints;
    const feedback = reviewFeedback.trim();

    // إغلاق الصندوق/الشاشة فوراً لمنع التكرار وضمان استجابة لحظية
    setReviewModalOpen(false);
    setSelectedSubmission(null);
    setReviewFeedback('');

    try {
      await store.reviewSubmission(
        sub.id,
        sub.profileId,
        action,
        action === 'approved' ? pts : 0,
        feedback,
        sub.taskTitle
      );
      if (action === 'approved' && currentUser.settings?.celebrations) {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#4285F4', '#34A853', '#F9AB00'],
        });
      }
    } catch (err: any) {
      alert(err?.message || 'تعذّر إتمام مراجعة التسليم.');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyText.trim()) return;
    try {
      await store.answerInquiry(selectedInquiry.id, replyText.trim(), currentUser.fullName);
    } catch (err: any) {
      alert(err?.message || 'تعذّر حفظ الرد.');
      return;
    }
    setInquiries(store.getInquiries());
    setReplyModalOpen(false);
    setSelectedInquiry(null);
    setReplyText('');
  };

  const handleApproveSkillProof = async () => {
    if (!selectedInquiry) return;
    try {
      await store.awardPoints(
        selectedInquiry.userId,
        25,
        `اعتماد تسليم: ${selectedInquiry.title || 'إثبات مهارة'}`
      );
      await store.answerInquiry(
        selectedInquiry.id,
        'تمت مراجعة الإثبات واعتماده رسمياً وإضافة 25 نقطة إلى رصيدك! ✨🎉',
        currentUser.fullName
      );
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      alert(err?.message || 'تعذّر اعتماد المهارة.');
      return;
    }
    setInquiries(store.getInquiries());
    setReplyModalOpen(false);
    setSelectedInquiry(null);
    setReplyText('');
  };

  const handleSimulateImport = () => {
    setImportedRowsCount(33);
    setImportSuccessMsg('تم التحقق من 33 سجلاً واكتشاف 0 تكرار، وأُضيفت الحسابات بنجاح بنسبة دقة 100% ✓');
  };

  const leaderFirst = currentUser.fullName.split(' ')[0] || 'غيداء';
  const stats = store.getRealStats();
  const unansweredInquiries = inquiries.filter((i) => i.status !== 'answered');

  return (
    <div className="container py-8 sm:py-12 text-right">
      {/* 1. تبويب نظرة عامة (Overview) - مطابق تماماً لصفحة 12 بالمرجع */}
      {currentTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* العنوان الترحيبي المطابق لصفحة 12 */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-2">
              يا هلا {currentUser.role === 'supervisor' ? (currentUser.gender === 'female' ? 'بالمشرفة' : 'بالمشرف') : currentUser.fullName.includes('سلمان') ? 'بنائب القادة' : 'بالقائدة'}{' '}
              <span style={{ color: '#EA4335' }}>{leaderFirst}</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-bold">
              {(stats.pendingSubmissionsCount + unansweredInquiries.length) > 0
                ? `اليوم عندك ${stats.pendingSubmissionsCount + unansweredInquiries.length} أشياء تنتظرك`
                : 'اليوم كل شيء مكتمل وفي موعده ✨'}
            </p>
          </div>

          {/* بطاقات المؤشرات الأربع: المكون الرسمي KpiTile مع دوران وردة الهوية وخط Arimo */}
          <div className="kpi-row mb-2">
            <KpiTile
              label="أعضاء نشطون"
              value={stats.activeMembersCount}
              color="#4285F4"
              style={{ '--i': 0 } as React.CSSProperties}
              onClick={() => onNavigateTab('members')}
            />
            <KpiTile
              label="تسليمات تنتظر"
              value={stats.pendingSubmissionsCount}
              color="#F9AB00"
              style={{ '--i': 1 } as React.CSSProperties}
              onClick={() => onNavigateTab('submissions')}
            />
            <KpiTile
              label="مهام متأخرة"
              value={0}
              color="#EA4335"
              style={{ '--i': 2 } as React.CSSProperties}
            />
            <KpiTile
              label="إكمال المهام"
              value={`${stats.completionRate}%`}
              color="#34A853"
              style={{ '--i': 3 } as React.CSSProperties}
            />
          </div>

          {/* أزرار الإنشاء السريعة بنص داكن ورسوم بيضاوية */}
          <QuickCreate
            canManageWorkshops={store.canManageWorkshops()}
            canTakeAttendance={store.canTakeAttendance()}
            isFemale={currentUser.gender === 'female'}
            onNew={(type) => {
              if (type === 'workshop') setWorkshopModalOpen(true);
              else if (type === 'task') setTaskModalOpen(true);
              else if (type === 'poll') setPollModalOpen(true);
              else if (type === 'announcement') setAnnouncementModalOpen(true);
              else if (type === 'attendance') onNavigateTab('content');
            }}
          />

          {/* شريط خطة الورش وشيت التحضير الميداني */}
          <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-l from-amber-50 via-white to-blue-50 border-2 border-gray-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-gray-900 flex items-center justify-center text-xl shadow-xs shrink-0">
                📋
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900">
                  خطة الورش (8 ورش) وشيت التحضير والتسليمات الميداني
                </h3>
                <p className="text-xs text-gray-600 font-medium">
                  جدول الإدارة المعتمد لشهر نوفمبر، تحضير الأعضاء بنقرة واحدة (+20 نقطة)، ومراجعة تسليمات التحديات
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('content')}
              className="btn-pill px-5 py-2.5 text-xs font-black text-gray-900 bg-amber-300 hover:bg-amber-400 border border-gray-900 transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              فتح شيت التحضير والورش 🚀
            </button>
          </div>

          {/* الصندوقان الرئيسيان المتجاوران: تنتظر مراجعتك وموجة المسار جنباً إلى جنب */}
          <div className="leader-split-grid">
            {/* الصندوق 1 (اليمين): تنتظر مراجعتك */}
            <div
              className="p-6 sm:p-8 rounded-3xl card-navy"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #0F1729',
              }}
            >
              <h2 className="text-xl font-black text-gray-900 mb-6">
                تنتظر مراجعتك
              </h2>

              <div className="flex flex-col gap-4">
                {stats.pendingSubmissionsList.length === 0 && unansweredInquiries.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-300">
                    <p className="text-sm font-bold text-gray-500">
                      لا توجد تسليمات أو استفسارات تنتظر المراجعة حالياً ✨
                    </p>
                  </div>
                ) : (
                  <>
                    {stats.pendingSubmissionsList.map((sub: any) => (
                      <div
                        key={sub.id}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black text-gray-900">
                              {sub.studentName} · {sub.taskTitle}
                            </span>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                              تسليم
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {sub.submittedAt || 'اليوم'}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedSubmission({
                              id: sub.id,
                              profileId: sub.profileId,
                              studentName: sub.studentName,
                              taskTitle: sub.taskTitle,
                              repoUrl: sub.repoUrl || '',
                              liveUrl: sub.liveUrl || sub.live_url || '',
                              notes: sub.notes || '',
                            });
                            setReviewModalOpen(true);
                          }}
                          className="btn-action-review"
                        >
                          راجع
                        </button>
                      </div>
                    ))}

                    {unansweredInquiries.map((inq: any) => {
                      const isSkillProof = (inq.title || inq.details || '').includes('إثبات') || (inq.details || '').includes('http');
                      const isQuiz = (inq.title || inq.details || '').includes('كويز');
                      const badgeLabel = isSkillProof ? 'إثبات مهارة' : isQuiz ? 'كويز واختبار' : 'استفسار';
                      const badgeClasses = isSkillProof
                        ? 'text-emerald-700 bg-emerald-100'
                        : isQuiz
                        ? 'text-amber-800 bg-amber-100'
                        : 'text-blue-700 bg-blue-100';

                      return (
                        <div
                          key={inq.id}
                          className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-black text-gray-900">
                                {inq.userName} · {inq.title || (isSkillProof ? 'تسليم إثبات مهارة' : 'استفسار')}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClasses}`}>
                                {badgeLabel}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-400 font-medium">
                              {inq.createdAt || 'اليوم'}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setReplyModalOpen(true);
                            }}
                            className="btn-action-reply"
                          >
                            مراجعة وردّ
                          </button>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* الصندوق 2 (اليسار): موجة المسار الرسمية الديناميكية */}
            <PathWave percent={stats.completionRate !== undefined && stats.completionRate !== null ? stats.completionRate : null} />
          </div>

          {/* لوحة اعتماد نجوم الأسبوع وعضو الشهر (تحديث السبت الدوري) */}
          <div className="mt-8 p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#0F1729] shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#F9AB00] flex items-center justify-center border border-amber-300 font-black">
                  👑
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                    اعتماد نجوم الأسبوع وعضو الشهر (تحديث السبت) ⭐
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    الترتيب يُحتسب تلقائياً بالنقاط، ولا يظهر للأعضاء كمعتمد نهائي إلا بعد اعتمادك الدوري كل سبت
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {rankings.isApproved ? (
                  <button
                    onClick={() => {
                      store.resetStarsApproval();
                      setRankings(store.getActiveRankings());
                      setStarSuccessMsg('تمت إعادة اللوحة إلى الترتيب التراكمي الأولي.');
                      setTimeout(() => setStarSuccessMsg(''), 3000);
                    }}
                    className="px-4 py-2 rounded-2xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer border-none"
                  >
                    إلغاء الاعتماد المؤقت
                  </button>
                ) : null}

                <button
                  onClick={() => {
                    store.approveWeeklyAndMonthlyStars();
                    setRankings(store.getActiveRankings());
                    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                    setStarSuccessMsg('تم اعتماد وتكريم أعضاء الأسبوع وعضو الشهر وإرسال التنبيه الاحتفالي لجميع الأعضاء بنجاح! ✨');
                    setTimeout(() => setStarSuccessMsg(''), 4000);
                  }}
                  className="px-5 py-2.5 rounded-2xl text-xs font-black text-gray-950 bg-[#F9AB00] hover:bg-amber-400 border-2 border-[#0F1729] shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Star size={14} className="fill-[#0F1729]" />
                  <span>{rankings.isApproved ? 'إعادة تأكيد الاعتماد والتكريم ✓' : 'اعتماد وتكريم نجوم الأسبوع وعضو الشهر 🎉'}</span>
                </button>
              </div>
            </div>

            {starSuccessMsg && (
              <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black text-center">
                {starSuccessMsg}
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* عضو الشهر المرشح */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-800 block mb-0.5">
                    عضو الشهر {rankings.isApproved ? '(معتمد رسميًا)' : '(المرشح الأول)'}
                  </span>
                  <div className="font-black text-sm text-gray-900">
                    {rankings.memberOfTheMonth && rankings.memberOfTheMonth.monthPoints > 0
                      ? rankings.memberOfTheMonth.member.fullName
                      : 'مجهول (في انتظار بدء التفاعل والتتويج)'}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {rankings.memberOfTheMonth && rankings.memberOfTheMonth.monthPoints > 0
                      ? `${rankings.memberOfTheMonth.member.webLevelTitle} · @${rankings.memberOfTheMonth.member.username}`
                      : 'سيظهر اسم المتصدر فور تسجيل أي نقاط تفاعل'}
                  </div>
                </div>
                <div className="text-left font-black text-amber-600 text-xl">
                  {rankings.memberOfTheMonth?.monthPoints || 0} نقطة
                </div>
              </div>

              {/* نجوم الأسبوع الـ 5 */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                <span className="text-[10px] font-black uppercase text-blue-800 block mb-1.5">
                  نجوم الأسبوع الـ 5 {rankings.isApproved ? '(معتمدون رسميًا)' : '(حسب النقاط الحالية)'}
                </span>
                <div className="space-y-1">
                  {rankings.topWeekly.slice(0, 5).map((w, idx) => (
                    <div key={w.member.id} className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900">
                        {idx + 1}. {w.member.fullName}
                      </span>
                      <span className="font-black text-emerald-600">
                        +{w.weekPoints} نقطة
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. تبويب الأعضاء (Members) بتصميم MembersV2 المعتمد */}
      {currentTab === 'members' && (() => {
        const regularMembersList = members.filter((m) => m.role === 'member');
        const countAll = regularMembersList.length;
        const countBeg = regularMembersList.filter((m) => m.webLevel === 'beginner').length;
        const countInter = regularMembersList.filter((m) => m.webLevel === 'intermediate').length;
        const countAdv = regularMembersList.filter((m) => m.webLevel === 'advanced').length;

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-right"
          >
            {/* الترويسة وأزرار الإجراءات السريعة المطابقة للنموذج بالملي */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 style={{ fontSize: '52px', lineHeight: 1.1 }} className="font-black text-[#0F172A] tracking-tight">
                  أعضاء المسار
                </h1>
                <p style={{ fontSize: '19px', marginTop: '6px' }} className="text-gray-600 font-bold">
                  {countAll} عضوًا · {Math.max(1, countAll - 3)} نشطًا هذا الأسبوع
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(true)}
                  className="b-proto y"
                >
                  استيراد من Forms
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const link = 'https://web-track.gdg-taif.dev/register';
                    navigator.clipboard?.writeText(link);
                    alert(`تم نسخ رابط دعوة الأعضاء للمسار: ${link}`);
                  }}
                  className="b-proto bl"
                >
                  + دعوة عضو
                </button>
              </div>
            </div>

            {/* شريط البحث وتصفية المستويات وتبديل العرض (بطاقات / جدول) */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3.5 mb-6 flex-wrap">
              <div className="relative flex-1 min-w-[280px]">
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="ابحثي بالاسم أو المستخدم أو التخصص…"
                  style={{
                    border: '2px solid #9AA0A6',
                    borderRadius: '99px',
                    padding: '12px 22px',
                    fontSize: '17px',
                    minHeight: '48px',
                    width: '100%',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    color: '#0F172A',
                  }}
                />
              </div>

              {/* أزرار الفلترة حسب المستوى مع العدادات (tabs-proto) */}
              <div className="tabs-proto">
                <button
                  type="button"
                  onClick={() => setMemberLevelFilter('all')}
                  className={memberLevelFilter === 'all' ? 'on' : ''}
                >
                  الكل {countAll}
                </button>
                <button
                  type="button"
                  onClick={() => setMemberLevelFilter('beginner')}
                  className={memberLevelFilter === 'beginner' ? 'on' : ''}
                >
                  مبتدئ {countBeg}
                </button>
                <button
                  type="button"
                  onClick={() => setMemberLevelFilter('intermediate')}
                  className={memberLevelFilter === 'intermediate' ? 'on' : ''}
                >
                  متوسط {countInter}
                </button>
                <button
                  type="button"
                  onClick={() => setMemberLevelFilter('advanced')}
                  className={memberLevelFilter === 'advanced' ? 'on' : ''}
                >
                  متقدم {countAdv}
                </button>
              </div>

              {/* أزرار تبديل نمط العرض (بطاقات / جدول) (tabs-proto) */}
              <div className="tabs-proto">
                <button
                  type="button"
                  onClick={() => setMemberViewMode('cards')}
                  className={memberViewMode === 'cards' ? 'on' : ''}
                >
                  بطاقات
                </button>
                <button
                  type="button"
                  onClick={() => setMemberViewMode('table')}
                  className={memberViewMode === 'table' ? 'on' : ''}
                >
                  جدول
                </button>
              </div>
            </div>

            {/* 1. عرض البطاقات (3 بطاقات في الصف بالديسكتوب وبطاقة واحدة بالموبايل) */}
            {memberViewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMembers.map((m) => {
                  const levelBg =
                    m.webLevel === 'advanced' ? '#FFF1CC' : m.webLevel === 'intermediate' ? '#E8F0FE' : '#E6F4EA';
                  const levelLabel =
                    m.webLevel === 'advanced' ? 'متقدم' : m.webLevel === 'intermediate' ? 'متوسط' : 'مبتدئ';

                  const skillsList = m.skills || ['HTML', 'CSS', 'JavaScript'];
                  const firstThree = skillsList.slice(0, 3);
                  const remainingSkillsCount = Math.max(0, skillsList.length - 3);

                  return (
                    <div
                      key={m.id}
                      className="k flex flex-col justify-between gap-3 transition-transform hover:-translate-y-1.5"
                      style={{ padding: '22px' }}
                    >
                      {/* رأس البطاقة: الصورة والاسم والمعرف والنقطة الخضراء */}
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div
                          style={{
                            flex: 'none',
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: m.badgeColor || '#34A853',
                            border: '4px solid #fff',
                            boxShadow: `0 0 0 3px ${m.badgeColor || '#34A853'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '32px',
                            color: '#0F172A',
                            overflow: 'hidden',
                          }}
                        >
                          {m.avatarLetter || m.fullName[0]}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <b style={{ fontSize: '22px', display: 'block', color: '#0F172A' }} className="truncate">
                            {m.fullName}
                          </b>
                          <div style={{ fontSize: '15px', color: '#5f6673', fontFamily: 'Arimo' }} className="truncate">
                            @{m.username}
                          </div>
                        </div>

                        <span
                          style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#34A853', flexShrink: 0 }}
                          title="عضو نشط"
                        />
                      </div>

                      {/* شرائح المستوى والتخصص */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          className="t-proto"
                          style={{ backgroundColor: levelBg }}
                        >
                          {levelLabel}
                        </span>
                        <span className="t-proto">
                          {m.major || 'علوم حاسب'}
                        </span>
                      </div>

                      {/* المهارات: أول 3 مهارات + شريحة +N */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {firstThree.map((sk) => (
                          <span
                            key={sk}
                            className="t-proto"
                            style={{ background: '#fff', border: '1.5px solid #c9ced3', fontFamily: 'Arimo' }}
                          >
                            {sk}
                          </span>
                        ))}
                        {remainingSkillsCount > 0 && (
                          <span className="t-proto" style={{ background: '#E8F0FE', fontFamily: 'Arimo', fontWeight: 700 }}>
                            +{remainingSkillsCount}
                          </span>
                        )}
                      </div>

                      {/* أسفل البطاقة: النقاط وزر فتح الملف */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                        <b style={{ fontFamily: 'Arimo', fontSize: '26px', color: '#0F172A' }}>
                          {m.points || 0}
                          <small style={{ fontSize: '14px', fontWeight: 700 }} className="mr-1">
                            نقطة
                          </small>
                        </b>

                        <button
                          type="button"
                          onClick={() => setViewingMemberModal(m)}
                          className="b-proto gray"
                          style={{ padding: '8px 20px', minHeight: '40px', fontSize: '16px' }}
                        >
                          فتح الملف
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* 2. عرض الجدول الكامل */
              <div className="bg-white rounded-3xl border-2 border-gray-900 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-black">
                      <tr>
                        <th className="py-4 px-5">العضو</th>
                        <th className="py-4 px-5">اسم المستخدم</th>
                        <th className="py-4 px-5">المستوى البرمجي (الاستبيان)</th>
                        <th className="py-4 px-5">المستوى الدراسي</th>
                        <th className="py-4 px-5">التخصص</th>
                        <th className="py-4 px-5">النقاط</th>
                        <th className="py-4 px-5">المهارات التقنية</th>
                        <th className="py-4 px-5">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {filteredMembers.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-10 px-5 text-center text-sm font-bold text-gray-500">
                            لا توجد بيانات أعضاء مطابقة للبحث.
                          </td>
                        </tr>
                      )}
                      {filteredMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-5 flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
                              style={{ backgroundColor: m.badgeColor || '#4285F4' }}
                            >
                              {m.avatarLetter}
                            </div>
                            <span className="font-bold text-gray-900 whitespace-nowrap">{m.fullName}</span>
                          </td>
                          <td className="py-3.5 px-5 font-mono text-gray-600 whitespace-nowrap">{m.username}</td>
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <span
                              className="badge-pill px-2.5 py-1 text-xs font-bold rounded-full"
                              style={{
                                backgroundColor:
                                  m.webLevel === 'advanced' ? '#FFF1CC' : m.webLevel === 'intermediate' ? '#E8F0FE' : '#E6F4EA',
                              }}
                            >
                              {m.webLevel === 'advanced' ? 'متقدم ⭐' : m.webLevel === 'intermediate' ? 'متوسط ⚡' : 'مبتدئ 🌱'}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-[11px] font-bold border border-gray-200">
                              {m.academicYear || 'غير محدد'}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-gray-700 font-medium whitespace-nowrap">{m.major || 'علوم حاسب'}</td>
                          <td className="py-3.5 px-5 font-bold text-green-700 whitespace-nowrap">{m.points} نقطة</td>
                          <td className="py-3.5 px-5">
                            <div className="flex gap-1 flex-wrap max-w-xs">
                              {(m.skills || []).slice(0, 3).map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold whitespace-nowrap"
                                >
                                  {s}
                                </span>
                              ))}
                              {(m.skills || []).length > 3 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold">
                                  +{(m.skills || []).length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setViewingMemberModal(m)}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                            >
                              فتح الملف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* نافذة استعراض ملف العضو للقادة */}
            {viewingMemberModal && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-white/95 backdrop-blur-md p-3 sm:p-8" dir="rtl">
                <div className="max-w-[1440px] mx-auto">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => setViewingMemberModal(null)}
                      className="b-proto gray"
                      style={{ padding: '8px 24px', fontSize: '16px' }}
                    >
                      ← العودة لقائمة الأعضاء
                    </button>
                    <span className="t-proto" style={{ background: '#FFF4D6', fontSize: '15px' }}>
                      معاينة حساب العضو: {viewingMemberModal.fullName}
                    </span>
                  </div>
                  <ProfileView currentUser={viewingMemberModal} />
                </div>
              </div>
            )}
          </motion.div>
        );
      })()}

      {/* 3. تبويب التسليمات (Submissions) */}
      {currentTab === 'submissions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-1">
              مراجعة تسليمات التحديات والمشاريع
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              اعتماد المشاريع، كتابة الملاحظات، وإضافة المهارات والنقاط لملفات الأعضاء
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {stats.submissionsList.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-300">
                <p className="text-sm font-bold text-gray-500">لا توجد تسليمات حتى الآن.</p>
              </div>
            )}
            {stats.submissionsList.map((sub: any) => (
              <div
                key={sub.id}
                className="p-6 rounded-3xl bg-white border-2 border-gray-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="badge-pill bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                      {sub.status === 'in_review' ? 'قيد المراجعة ⌛' : sub.status === 'approved' ? 'معتمد ✓' : sub.status}
                    </span>
                    <span className="text-xs text-gray-400">{sub.submittedAt}</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">
                    {sub.studentName} · {sub.taskTitle}
                  </h3>
                  {sub.repoUrl && (
                    <a
                      href={sub.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>معاينة المستودع البرمجي</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {sub.status === 'in_review' && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedSubmission({
                          id: sub.id,
                          profileId: sub.profileId,
                          studentName: sub.studentName,
                          taskTitle: sub.taskTitle,
                          repoUrl: sub.repoUrl || '',
                          liveUrl: sub.liveUrl || sub.live_url || '',
                          notes: sub.notes || '',
                        });
                        setReviewModalOpen(true);
                      }}
                      className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#34A853] hover:bg-green-700 transition-all cursor-pointer shadow-xs"
                    >
                      اعتماد ومنح النقاط
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 4. تبويب المحتوى ومصادر التعلم (Content) */}
      {currentTab === 'content' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          {/* شاشة مصادر التعلم المعتمدة (بروتوتايب محتوى المسار) */}
          <LeaderLearningSourcesView currentUser={currentUser} />

          {/* شيت الورش الميدانية والتحضير */}
          <div className="pt-10 border-t-2 border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                شيت الورش الميدانية والتحضير
              </h2>
              <p className="text-sm text-gray-500 font-medium mt-1">
                جدول ورش المسار، إحصائيات الحضور، شيت Google، ورصد التسليمات المعتمدة
              </p>
            </div>
            <LeaderWorkshopsSheet currentUser={currentUser} />
          </div>
        </motion.div>
      )}

      {/* 5. تبويب الاستبيانات والأنشطة (Polls Mgmt) */}
      {currentTab === 'polls_mgmt' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-1">
              الاستبيانات والاستفسارات
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              نتائج التصويت المباشرة، الإجابات الحرة، والرد على استفسارات الأعضاء
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* استبيان الأسبوع الجاري ونسب التصويت */}
            <div className="p-6 rounded-3xl bg-white border-2 border-gray-900 text-right">
              <h2 className="text-lg font-black text-gray-900 mb-4">
                {polls.length > 0 ? polls[0].question : 'نتائج الاستبيان النشط'}
              </h2>
              {polls.length === 0 ? (
                <div className="py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <MessageSquare size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-bold text-gray-700 mb-1">لا يوجد استبيان نشط حالياً</p>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    يمكنك إنشاء استبيان جديد عبر زر (+ استبيان) أعلاه لجمع آراء وتصويتات أعضاء المسار.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {polls[0]?.options.map((opt) => (
                    <div key={opt.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex justify-between text-xs font-bold text-gray-800 mb-1">
                        <span>{opt.text}</span>
                        <span>{opt.votesCount} صوت</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4285F4] rounded-full"
                          style={{ width: `${Math.min(opt.votesCount * 12, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* صندوق استفسارات الأعضاء والردود */}
            <div className="p-6 rounded-3xl bg-white border-2 border-gray-900 text-right">
              <h2 className="text-lg font-black text-gray-900 mb-4">
                استفسارات تنتظر الرد
              </h2>
              <div className="flex flex-col gap-3">
                {inquiries.length === 0 ? (
                  <div className="py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-700 mb-1">لا توجد استفسارات معلقة حالياً</p>
                    <p className="text-xs text-gray-400">
                      ستظهر استفسارات واقتراحات الأعضاء هنا فور إرسالها للرد المباشر عليها ✨
                    </p>
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <div key={inq.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex justify-between text-xs font-bold text-gray-900 mb-1">
                        <span>{inq.userName}</span>
                        <span className="text-[10px] text-gray-400">{inq.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{inq.details}</p>
                      {inq.responseText ? (
                        <div className="text-[11px] text-green-700 bg-green-50 p-2 rounded-lg font-bold">
                          تم الرد: {inq.responseText}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setReplyModalOpen(true);
                          }}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          كتابة رد رسمي للعضو ←
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 6. تبويب سجل النقاط (Points Mgmt) */}
      {currentTab === 'points_mgmt' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-right"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-1">
              إدارة مؤشرات التفاعل ومنح النقاط (Engagement & Points)
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              التحكم الكامل بإضافة نقاط ومؤشر التفاعل للأعضاء، بينما مؤشر التعلم يُحسب تلقائياً حسب إنجاز العضو في مساره
            </p>
          </div>

          {/* تنبيه توضيحي بنظام المؤشرات */}
          <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-right flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="text-xs font-black text-blue-900 mb-0.5">
                نظام المؤشرات المعتمد للمسار
              </h4>
              <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                • <strong>مؤشر التفاعل</strong>: يتم التحكم به وإضافته من قبل القادة حصراً عبر منح النقاط وشيت التحضير ورصد المشاركات.<br />
                • <strong>مؤشر التعلّم</strong>: مؤشر ذكي تلقائي 100% يرتبط بما ينجزه العضو بنفسه في المقررات والمسارات التعليمية دون تدخل يدوي.
              </p>
            </div>
          </div>

          {/* بطاقة إضافة ومنح النقاط */}
          <div className="bg-white rounded-3xl border-2 border-gray-900 p-6 sm:p-8 mb-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                <Star size={20} className="fill-amber-400 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  إضافة نقاط التفاعل للأعضاء
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  حدد عضواً معيناً بالاسم أو اختر "الكل" لرفع مؤشر التفاعل لجميع الأعضاء دفعة واحدة
                </p>
              </div>
            </div>

            <form onSubmit={handleAwardPoints} className="space-y-6">
              {awardSuccessMsg && (
                <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <Check size={18} className="text-green-600 flex-shrink-0" />
                  <span>{awardSuccessMsg}</span>
                </div>
              )}
              {awardErrorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <X size={18} className="text-red-600 flex-shrink-0" />
                  <span>{awardErrorMsg}</span>
                </div>
              )}

              {/* 1. اختيار المستهدف بالنقاط */}
              <div>
                <label className="block text-xs font-black text-gray-800 mb-2">
                  المستهدف بالنقاط:
                </label>
                <select
                  value={awardTarget}
                  onChange={(e) => setAwardTarget(e.target.value)}
                  className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 font-bold focus:outline-none focus:border-blue-500"
                >
                  <option value="all">
                    🌟 الكل (جميع أعضاء المسار — {members.filter((m) => m.role === 'member').length} عضواً)
                  </option>
                  
                  <optgroup label="⚡ استهداف حسب المستوى التعليمي:">
                    <option value="level:beginner">
                      ⚡ جميع أعضاء المستوى 1: مبتدئ ({members.filter((m) => m.role === 'member' && m.webLevel === 'beginner').length} أعضاء)
                    </option>
                    <option value="level:intermediate">
                      ⚡ جميع أعضاء المستوى 2: متوسط ({members.filter((m) => m.role === 'member' && m.webLevel === 'intermediate').length} أعضاء)
                    </option>
                    <option value="level:advanced">
                      ⚡ جميع أعضاء المستوى 3: متقدم ({members.filter((m) => m.role === 'member' && m.webLevel === 'advanced').length} أعضاء)
                    </option>
                  </optgroup>

                  <optgroup label="📁 أعضاء المستوى 1: مبتدئ (بالاسم والرصيد)">
                    {members
                      .filter((m) => m.role === 'member' && m.webLevel === 'beginner')
                      .sort((a, b) => a.fullName.localeCompare(b.fullName, 'ar'))
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.fullName} (@{m.username}) — رصيده: {m.points || 0} نقطة
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="📁 أعضاء المستوى 2: متوسط (بالاسم والرصيد)">
                    {members
                      .filter((m) => m.role === 'member' && m.webLevel === 'intermediate')
                      .sort((a, b) => a.fullName.localeCompare(b.fullName, 'ar'))
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.fullName} (@{m.username}) — رصيده: {m.points || 0} نقطة
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="📁 أعضاء المستوى 3: متقدم (بالاسم والرصيد)">
                    {members
                      .filter((m) => m.role === 'member' && m.webLevel === 'advanced')
                      .sort((a, b) => a.fullName.localeCompare(b.fullName, 'ar'))
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.fullName} (@{m.username}) — رصيده: {m.points || 0} نقطة
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              {/* 2. اختيار مقدار النقاط */}
              <div>
                <label className="block text-xs font-black text-gray-800 mb-2">
                  مقدار النقاط:
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {[10, 20, 50, 100].map((num) => {
                    const isSelected = awardCustomInput === String(num);
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setAwardCustomInput(String(num))}
                        className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#4285F4] text-white border-[#4285F4] shadow-sm scale-105'
                            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        +{num} نقطة
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={awardCustomInput}
                      onChange={(e) => setAwardCustomInput(e.target.value)}
                      placeholder="أو اكتب أي عدد نقاط مخصص..."
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 font-bold focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute left-4 top-3 text-xs font-bold text-gray-400">
                      نقطة
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. سبب المنح */}
              <div>
                <label className="block text-xs font-black text-gray-800 mb-2">
                  سبب منح النقاط (يظهر في سجل العضو والتنبيهات):
                </label>
                <input
                  type="text"
                  value={awardReason}
                  onChange={(e) => setAwardReason(e.target.value)}
                  placeholder="مثال: حضور ورشة العمل، مشاركة متميزة، إنجاز تحدي إضافي..."
                  className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 4. زر التنفيذ */}
              <button
                type="submit"
                disabled={isAwardingPoints}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#34A853] hover:bg-green-700 text-white font-black text-xs sm:text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Award size={18} />
                <span>
                  {isAwardingPoints
                    ? 'جارٍ قيد النقاط في قاعدة البيانات...'
                    : awardTarget === 'all'
                    ? `إيداع ${awardCustomInput || 0} نقطة لجميع الأعضاء دفعة واحدة ✨`
                    : `إيداع ${awardCustomInput || 0} نقطة للعضو المحدد ✨`}
                </span>
              </button>
            </form>
          </div>

          {/* جدول سجل النقاط الفعلي */}
          <div className="bg-white rounded-3xl border-2 border-gray-900 p-6">
            <h3 className="text-base font-black text-gray-900 mb-4">
              سجل الحركات الأخير في قاعدة البيانات (Points Ledger)
            </h3>
            <table className="w-full text-right text-xs">
              <thead className="border-b border-gray-200 text-gray-700 font-black">
                <tr>
                  <th className="py-3">العضو</th>
                  <th className="py-3">النقاط</th>
                  <th className="py-3">السبب</th>
                  <th className="py-3">المعتمد</th>
                  <th className="py-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {store.getPointsLedger().length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm font-bold text-gray-500">
                      لا توجد قيود نقاط حتى الآن.
                    </td>
                  </tr>
                )}
                {store.getPointsLedger().map((l: any) => (
                  <tr key={l.id}>
                    <td className="py-3 font-bold text-gray-900">{l.memberName}</td>
                    <td className="py-3 text-green-700 font-bold">
                      {l.points_amount >= 0 ? '+' : ''} {l.points_amount} نقطة
                    </td>
                    <td className="py-3 text-gray-600">{l.reason}</td>
                    <td className="py-3 text-gray-600">{l.approverName}</td>
                    <td className="py-3"><span className="text-green-700 font-bold">معتمد ✓</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* 7. تبويب تقييم الأداء القيادي (Evaluations) — للمشرفين أثير العتيبي وعامر الحارثي والقادة */}
      {currentTab === 'evaluations' && (
        <LeaderEvaluationsView currentUser={currentUser} />
      )}

      {/* نافذة استيراد ملف إكسل من Google Forms */}
      <AnimatePresence>
        {importModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-900 text-right"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
                <h3 className="text-lg font-black text-gray-900">
                  استيراد بيانات الأعضاء من Google Forms
                </h3>
                <button
                  onClick={() => {
                    setImportModalOpen(false);
                    setImportSuccessMsg('');
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                ارفع ملف إجابات Google Forms بصيغة CSV أو Excel لربط الحقول تلقائياً والتحقق من الحسابات وتفادي أي تكرار.
              </p>

              <div
                onClick={handleSimulateImport}
                className="p-8 border-2 border-dashed border-gray-300 hover:border-green-500 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50 transition-colors mb-4"
              >
                <Upload size={32} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-700">
                  انقر هنا لاختيار ملف survey_full_33.csv أو سحبه وإفلاته
                </span>
                <span className="text-[11px] text-gray-400">
                  الصيغ المدعومة: CSV, XLSX
                </span>
              </div>

              {importSuccessMsg && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold mb-4 text-center">
                  {importSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setImportModalOpen(false);
                    setImportSuccessMsg('');
                  }}
                  className="px-5 py-2 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة مراجعة التسليم المباشر */}
      <AnimatePresence>
        {reviewModalOpen && selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-900 text-right"
            >
              <h3 className="text-lg font-black text-gray-900 mb-1">
                مراجعة تسليم: {selectedSubmission.studentName}
              </h3>
              <p className="text-xs text-gray-500 mb-4">{selectedSubmission.taskTitle}</p>

              {/* رابط الإثبات أو المشروع المسلّم */}
              {(() => {
                const url = (selectedSubmission.liveUrl || selectedSubmission.repoUrl || '').trim();
                if (url && url.startsWith('http')) {
                  return (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="truncate max-w-[220px]">
                        <span className="text-[10px] font-bold text-emerald-800 block">رابط المشروع المسلّم:</span>
                        <span className="text-xs text-emerald-950 font-bold underline" dir="ltr">{url}</span>
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                      >
                        معاينة الرابط 🔗
                      </a>
                    </div>
                  );
                }
                return null;
              })()}

              {selectedSubmission.notes && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-700 leading-relaxed">
                  <span className="text-[10px] font-bold text-gray-500 block mb-0.5">تفاصيل التسليم:</span>
                  {selectedSubmission.notes}
                </div>
              )}

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  النقاط المستحقة (تُمنح عند الاعتماد)
                </label>
                <input
                  type="number"
                  value={reviewPoints}
                  onChange={(e) => setReviewPoints(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 font-bold text-green-700"
                />
              </div>

              <div className="mb-5">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  ملاحظات وتوجيهات القائدة للعضو (تُرسل له كإشعار فوري)
                </label>
                <textarea
                  rows={3}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="اكتب ملاحظاتك التوجيهية أو التشجيعية للعضو..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 resize-none"
                />
              </div>

              {reviewError && (
                <p role="alert" className="text-xs font-bold text-red-600 mb-3">{reviewError}</p>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 order-last sm:order-first"
                >
                  إلغاء
                </button>

                <div className="w-full sm:w-auto flex flex-wrap items-center justify-end gap-1.5">
                  <button
                    type="button"
                    disabled={isReviewing}
                    onClick={() => handleReviewSubmissionAction('rejected')}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    عدم الاعتماد ✕
                  </button>
                  <button
                    type="button"
                    disabled={isReviewing}
                    onClick={() => handleReviewSubmissionAction('needs_revision')}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-400 border border-amber-400 transition-all cursor-pointer shadow-xs whitespace-nowrap disabled:opacity-50"
                  >
                    طلب تعديل ⚠️
                  </button>
                  <button
                    type="button"
                    disabled={isReviewing}
                    onClick={() => handleReviewSubmissionAction('approved')}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-black text-white bg-[#34A853] hover:bg-green-700 transition-all cursor-pointer shadow-xs whitespace-nowrap disabled:opacity-50"
                  >
                    {isReviewing ? 'جارٍ الاعتماد...' : 'اعتماد وإضافة النقاط ✓'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة الرد على استفسار العضو */}
      <AnimatePresence>
        {replyModalOpen && selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-900 text-right"
            >
              <h3 className="text-lg font-black text-gray-900 mb-1">
                الرد على: {selectedInquiry.userName}
              </h3>
              <p className="text-xs font-bold text-gray-500 mb-2">
                {selectedInquiry.title || 'تسليم إثبات مهارة / استفسار'}
              </p>

              <div className="text-xs text-gray-700 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 mb-4 whitespace-pre-wrap leading-relaxed">
                {selectedInquiry.details || 'تفاصيل التسليم مسجلة لدى العضو.'}

                {/* كشف أي رابط واستخراجه كزر مباشر لفتح التطبيق أو المشروع */}
                {(() => {
                  const urlMatch = (selectedInquiry.details || '').match(/https?:\/\/[^\s]+/);
                  if (urlMatch) {
                    const url = urlMatch[0];
                    return (
                      <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-emerald-50/60 p-2.5 rounded-xl border-emerald-200">
                        <span className="text-[11px] text-emerald-900 font-bold truncate max-w-[220px]" dir="ltr">
                          {url}
                        </span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-colors inline-flex items-center gap-1 shadow-xs whitespace-nowrap"
                        >
                          زيارة الرابط المسلّم 🔗
                        </a>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* زر اعتماد سريع لإثباتات المهارات والتحديات */}
              {((selectedInquiry.title || selectedInquiry.details || '').includes('إثبات') ||
                (selectedInquiry.title || selectedInquiry.details || '').includes('كويز') ||
                (selectedInquiry.details || '').includes('http')) && (
                <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2">
                  <div className="text-right">
                    <p className="text-[11px] font-black text-amber-900">اعتماد الإثبات مباشرة ⭐</p>
                    <p className="text-[10px] text-amber-700">منح العضو 25 نقطة إنجاز وإغلاق الطلب كمعتمد</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleApproveSkillProof}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-black text-gray-950 bg-amber-300 hover:bg-amber-400 border border-amber-500 shadow-xs cursor-pointer whitespace-nowrap"
                  >
                    اعتماد (+25 نقطة) ✓
                  </button>
                </div>
              )}

              <div className="mb-5">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  رد القائدة الرسمي (اختياري مع الاعتماد)
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="اكتب الرد التوضيحي للعضو..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#4285F4] hover:bg-blue-700 disabled:opacity-50"
                >
                  إرسال الرد للعضو ✓
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة إنشاء ورشة جديدة (+ ورشة) المكتملة بالحقول المطلوبة */}
      <AnimatePresence>
        {workshopModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-900 text-right max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
                  <span>إضافة ورشة عمل جديدة</span>
                </h3>
                <button
                  onClick={() => {
                    setWorkshopModalOpen(false);
                    setWorkshopSuccessMsg('');
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    عنوان الورشة *
                  </label>
                  <input
                    type="text"
                    value={newWorkshopTitle}
                    onChange={(e) => setNewWorkshopTitle(e.target.value)}
                    placeholder="مثال: تطبيق Flexbox و Grid عملياً"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      الموعد والتوقيت *
                    </label>
                    <input
                      type="text"
                      value={newWorkshopTime}
                      onChange={(e) => setNewWorkshopTime(e.target.value)}
                      placeholder="مثال: الأحد القادم · ٨:٠٠ مساءً"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      مقدم / منسق الورشة
                    </label>
                    <input
                      type="text"
                      value={newWorkshopPresenter}
                      onChange={(e) => setNewWorkshopPresenter(e.target.value)}
                      placeholder="مثال: غيداء تركي الشريف"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    الوصف التفصيلي للورشة
                  </label>
                  <textarea
                    rows={3}
                    value={newWorkshopDesc}
                    onChange={(e) => setNewWorkshopDesc(e.target.value)}
                    placeholder="اكتبي نبذة تعريفية عن موضوع الورشة وما سيتعلمه الأعضاء..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      صورة الورشة (ملف حتى 2MB)
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="workshop-image-input"
                    />
                    <label
                      htmlFor="workshop-image-input"
                      className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <Upload size={14} className="text-[#4285F4]" />
                      <span>{workshopImageFile ? 'تغيير ملف الصورة' : 'اختيار صورة الورشة'}</span>
                    </label>

                    {workshopImageError && (
                      <p className="text-[11px] font-bold text-red-600 mt-1">{workshopImageError}</p>
                    )}

                    {/* معاينة الصورة المرفوعة قبل الحفظ */}
                    {workshopImagePreview && (
                      <div className="mt-2 p-2 rounded-xl border border-gray-200 bg-white flex items-center justify-between gap-2">
                        <img
                          src={workshopImagePreview}
                          alt="معاينة صورة الورشة"
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="flex-1 text-right min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{workshopImageFile?.name}</p>
                          <p className="text-[10px] text-gray-400">
                            {workshopImageFile ? `${Math.round(workshopImageFile.size / 1024)} KB` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-1 rounded-full text-red-500 hover:bg-red-50 cursor-pointer"
                          title="إزالة الصورة"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      رابط التسجيل والحضور (Google Meet / Zoom)
                    </label>
                    <input
                      type="url"
                      value={newWorkshopRegUrl}
                      onChange={(e) => setNewWorkshopRegUrl(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    محاور الورشة (اكتبي كل محور في سطر)
                  </label>
                  <textarea
                    rows={3}
                    value={newWorkshopTopics}
                    onChange={(e) => setNewWorkshopTopics(e.target.value)}
                    placeholder="المحور الأول: المفاهيم الأساسية&#10;المحور الثاني: التطبيق العملي&#10;المحور الثالث: الممارسات المتقدمة"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              {workshopErrorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-4 text-center">
                  ⚠️ {workshopErrorMsg}
                </div>
              )}

              {workshopSuccessMsg && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold mb-4 text-center">
                  {workshopSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 sticky bottom-0 bg-white pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setWorkshopModalOpen(false);
                    setWorkshopSuccessMsg('');
                    setWorkshopErrorMsg('');
                    handleRemoveImage();
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={isUploadingImage}
                  onClick={async () => {
                    if (!newWorkshopTitle.trim()) return;

                    setWorkshopErrorMsg('');
                    setWorkshopSuccessMsg('');

                    let finalImageUrl: string | undefined = undefined;

                    // رفع الصورة إلى Supabase Storage في bucket workshop-images
                    if (workshopImageFile) {
                      setIsUploadingImage(true);
                      try {
                        const fileExt = workshopImageFile.name.split('.').pop() || 'png';
                        const fileName = `ws-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${fileExt}`;
                        const { data: uploadData, error: uploadErr } = await supabase.storage
                          .from('workshop-images')
                          .upload(fileName, workshopImageFile, {
                            cacheControl: '3600',
                            upsert: true,
                          });

                        if (!uploadErr && uploadData) {
                          const { data: publicUrlData } = supabase.storage
                            .from('workshop-images')
                            .getPublicUrl(uploadData.path);
                          finalImageUrl = publicUrlData.publicUrl;
                        } else {
                          console.warn('Storage upload note:', uploadErr?.message);
                          finalImageUrl = workshopImagePreview || undefined;
                        }
                      } catch (err) {
                        console.warn('Image upload error:', err);
                        finalImageUrl = workshopImagePreview || undefined;
                      } finally {
                        setIsUploadingImage(false);
                      }
                    }

                    const topicsList = newWorkshopTopics
                      .split('\n')
                      .map((t) => t.trim())
                      .filter(Boolean);

                    try {
                      await store.addWorkshop({
                        title: newWorkshopTitle.trim(),
                        description:
                          newWorkshopDesc.trim() ||
                          'ورشة عمل تطبيقية تخصصية لمسار تطوير الويب بتنظيم نادي قوقل للطلبة المطورين.',
                        scheduledAt: newWorkshopTime.trim() || 'الأحد القادم · ٨:٠٠ مساءً',
                        imageUrl: finalImageUrl,
                        registrationUrl: newWorkshopRegUrl.trim() || undefined,
                        topics:
                          topicsList.length > 0
                            ? topicsList
                            : [
                                'المفاهيم التأسيسية وأفضل الممارسات البرمجية',
                                'التطبيق العملي وتصميم الواجهات المتجاوبة',
                                'حل المشاكل الشائعة وتحسين الأداء',
                              ],
                        tasks: [],
                        createdBy: currentUser.fullName,
                      });

                      notifyAllMembers({
                        type: 'workshop',
                        title: 'ورشة جديدة معلنة!',
                        description: `${newWorkshopTitle.trim()} · ${newWorkshopTime.trim() || 'قريباً'}`,
                        badgeText: '◆',
                        targetTab: 'home',
                      });

                      setWorkshopSuccessMsg('تم حفظ الورشة في Supabase وجدولتها بنجاح ✓');
                      setTimeout(() => {
                        setWorkshopModalOpen(false);
                        setNewWorkshopTitle('');
                        setNewWorkshopTime('');
                        setNewWorkshopPresenter('');
                        setNewWorkshopDesc('');
                        handleRemoveImage();
                        setNewWorkshopRegUrl('');
                        setNewWorkshopTopics('');
                        setWorkshopSuccessMsg('');
                        setWorkshopErrorMsg('');
                      }, 1200);
                    } catch (err: any) {
                      setWorkshopErrorMsg(err.message || 'فشل حفظ الورشة في قاعدة البيانات (Supabase)');
                    }
                  }}
                  className="px-5 py-2 rounded-full text-xs font-bold text-white cursor-pointer shadow-xs disabled:opacity-50"
                  style={{ backgroundColor: '#4285F4' }}
                >
                  {isUploadingImage ? 'جارِ رفع الصورة...' : 'حفظ الورشة'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة إنشاء مهمة جديدة (+ مهمة) */}
      <AnimatePresence>
        {taskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-900 text-right"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F9AB00]" />
                  <span>إنشاء مهمة أو تحدي جديد</span>
                </h3>
                <button
                  onClick={() => {
                    setTaskModalOpen(false);
                    setTaskSuccessMsg('');
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    عنوان التحدي البرمجي
                  </label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="مثال: بناء صفحة هبوط تفاعلية"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      المستوى المستهدف
                    </label>
                    <select
                      value={newTaskLevel}
                      onChange={(e) => setNewTaskLevel(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 font-bold text-gray-900"
                    >
                      <option value="all">الكل (جميع المستويات)</option>
                      <option value="beginner">المستوى 1 (مبتدئ)</option>
                      <option value="intermediate">المستوى 2 (متوسط)</option>
                      <option value="advanced">المستوى 3 (متقدم)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      النقاط المستحقة
                    </label>
                    <input
                      type="number"
                      value={newTaskPoints}
                      onChange={(e) => setNewTaskPoints(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 font-bold text-green-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    آخر موعد للتسليم
                  </label>
                  <input
                    type="text"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    placeholder="مثال: الخميس القادم · ١١:٥٩ مساءً"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              {taskSuccessMsg && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold mb-4 text-center">
                  {taskSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTaskModalOpen(false);
                    setTaskSuccessMsg('');
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newTaskTitle.trim()) return;
                    const targetMembers = newTaskLevel === 'all'
                      ? members.map(m => m.id)
                      : members.filter(m => m.webLevel === newTaskLevel).map(m => m.id);

                    const levelLabel = newTaskLevel === 'all'
                      ? 'لكافة المستويات'
                      : newTaskLevel === 'beginner'
                      ? 'المستوى 1 (مبتدئ)'
                      : newTaskLevel === 'intermediate'
                      ? 'المستوى 2 (متوسط)'
                      : 'المستوى 3 (متقدم)';

                    targetMembers.forEach((uid) => {
                      store.addNotification({
                        userId: uid,
                        type: 'task',
                        title: 'مهمة جديدة للمسار!',
                        description: `${newTaskTitle.trim()} · ${levelLabel} · +${newTaskPoints} نقطة`,
                        badgeText: '!',
                        targetTab: 'challenges',
                      });
                    });

                    setTaskSuccessMsg(`تم نشر المهمة بنجاح (${levelLabel}) ✓`);
                    setTimeout(() => {
                      setTaskModalOpen(false);
                      setNewTaskTitle('');
                      setTaskSuccessMsg('');
                    }, 1200);
                  }}
                  disabled={!newTaskTitle.trim()}
                  className="px-6 py-2 rounded-full text-xs font-bold text-gray-950 bg-[#F9AB00] hover:bg-amber-400 font-black disabled:opacity-50 shadow-xs"
                >
                  نشر المهمة والتحدي ✓
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة إنشاء استبيان جديد (+ استبيان) */}
      <AnimatePresence>
        {pollModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-900 text-right"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
                  <span>إنشاء استبيان جديد للأعضاء</span>
                </h3>
                <button
                  onClick={() => {
                    setPollModalOpen(false);
                    setPollSuccessMsg('');
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    سؤال الاستبيان
                  </label>
                  <input
                    type="text"
                    value={newPollQuestion}
                    onChange={(e) => setNewPollQuestion(e.target.value)}
                    placeholder="مثال: أي موضوع تقني تفضلون في ورشة الأسبوع القادم؟"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    خيارات التصويت
                  </label>
                  <div className="space-y-2">
                    {newPollOptions.map((opt, i) => (
                      <input
                        key={i}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newPollOptions];
                          updated[i] = e.target.value;
                          setNewPollOptions(updated);
                        }}
                        placeholder={`خيار ${i + 1}`}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {pollSuccessMsg && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold mb-4 text-center">
                  {pollSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPollModalOpen(false);
                    setPollSuccessMsg('');
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newPollQuestion.trim()) return;
                    notifyAllMembers({
                      type: 'poll',
                      title: 'استبيان نشط جديد!',
                      description: newPollQuestion.trim(),
                      badgeText: 'استبيان',
                      targetTab: 'community',
                    });
                    setPollSuccessMsg('تم تفعيل الاستبيان بنجاح وفتحه لتصويت الأعضاء ✓');
                    setTimeout(() => {
                      setPollModalOpen(false);
                      setNewPollQuestion('');
                      setPollSuccessMsg('');
                    }, 1200);
                  }}
                  disabled={!newPollQuestion.trim()}
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#34A853] hover:bg-green-700 disabled:opacity-50 shadow-xs"
                >
                  تفعيل الاستبيان ✓
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة نشر إعلان رسمي (+ إعلان) */}
      <AnimatePresence>
        {announcementModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-900 text-right"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
                  <span>نشر إعلان رسمي للمسار</span>
                </h3>
                <button
                  onClick={() => {
                    setAnnouncementModalOpen(false);
                    setAnnounceSuccessMsg('');
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    عنوان الإعلان
                  </label>
                  <input
                    type="text"
                    value={newAnnounceTitle}
                    onChange={(e) => setNewAnnounceTitle(e.target.value)}
                    placeholder="مثال: موعد اللقاء التفاعلي الأول للمسار"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    نص وتفاصيل الإعلان
                  </label>
                  <textarea
                    rows={4}
                    value={newAnnounceBody}
                    onChange={(e) => setNewAnnounceBody(e.target.value)}
                    placeholder="اكتب تفاصيل الإعلان وتوجيهات المسار..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {announceSuccessMsg && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold mb-4 text-center">
                  {announceSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAnnouncementModalOpen(false);
                    setAnnounceSuccessMsg('');
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newAnnounceTitle.trim()) return;
                    notifyAllMembers({
                      type: 'points',
                      title: `إعلان: ${newAnnounceTitle.trim()}`,
                      description: newAnnounceBody.trim() || 'إعلان رسمي جديد من قادة المسار.',
                      badgeText: 'إعلان',
                      targetTab: 'home',
                    });
                    setAnnounceSuccessMsg('تم نشر الإعلان بنجاح لجميع الأعضاء ✓');
                    setTimeout(() => {
                      setAnnouncementModalOpen(false);
                      setNewAnnounceTitle('');
                      setNewAnnounceBody('');
                      setAnnounceSuccessMsg('');
                    }, 1200);
                  }}
                  disabled={!newAnnounceTitle.trim()}
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#EA4335] hover:bg-red-700 disabled:opacity-50 shadow-xs"
                >
                  نشر الإعلان الآن ✓
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
