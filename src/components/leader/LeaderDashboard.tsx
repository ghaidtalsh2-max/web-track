import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, NavTab, Course } from '../../types';
import { store } from '../../services/store';
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
  const [members, setMembers] = useState<UserProfile[]>(() => store.getAllMembers());
  const [courses, setCourses] = useState<Course[]>(() => store.getCourses());
  const [inquiries, setInquiries] = useState(() => store.getInquiries());
  const [polls, setPolls] = useState(() => store.getPolls());

  // حالة المراجعة السريعة
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<{
    id: string;
    studentName: string;
    taskTitle: string;
    repoUrl: string;
  } | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewPoints, setReviewPoints] = useState(50);

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
  const [workshopSuccessMsg, setWorkshopSuccessMsg] = useState('');

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskLevel, setNewTaskLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
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

  // البحث والتصفية للأعضاء
  const [memberSearch, setMemberSearch] = useState('');
  const [memberLevelFilter, setMemberLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.username.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.major?.toLowerCase().includes(memberSearch.toLowerCase());
    const matchesLevel = memberLevelFilter === 'all' || m.webLevel === memberLevelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleApproveSubmission = () => {
    if (!selectedSubmission) return;
    store.addPoints('member-noura', reviewPoints, `اعتماد تسليم: ${selectedSubmission.taskTitle}`);
    if (currentUser.settings?.celebrations) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#4285F4', '#34A853', '#F9AB00'],
      });
    }
    setReviewModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleSendReply = () => {
    if (!selectedInquiry || !replyText.trim()) return;
    store.answerInquiry(selectedInquiry.id, replyText.trim(), currentUser.fullName);
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
              يا هلا بالقائدة {leaderFirst}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-bold">
              اليوم عندك ٣ أشياء تنتظرك
            </p>
          </div>

          {/* بطاقات المؤشرات الأربع بألوان الهوية الرسمية المطابقة لصفحة 12 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* 1. أعضاء نشطون (أزرق #4285F4) */}
            <div
              className="p-6 rounded-3xl text-right flex flex-col justify-between shadow-md"
              style={{
                backgroundColor: '#4285F4',
                color: '#FFFFFF',
                minHeight: '140px',
              }}
            >
              <div className="text-xs sm:text-sm font-bold opacity-90">
                أعضاء نشطون
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-left">
                48
              </div>
            </div>

            {/* 2. تسليمات تنتظر (أصفر #F9AB00) */}
            <div
              className="p-6 rounded-3xl text-right flex flex-col justify-between shadow-md"
              style={{
                backgroundColor: '#F9AB00',
                color: '#1A1A1A',
                minHeight: '140px',
              }}
            >
              <div className="text-xs sm:text-sm font-black">
                تسليمات تنتظر
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-left">
                12
              </div>
            </div>

            {/* 3. مهام متأخرة (أحمر #EA4335) */}
            <div
              className="p-6 rounded-3xl text-right flex flex-col justify-between shadow-md"
              style={{
                backgroundColor: '#EA4335',
                color: '#FFFFFF',
                minHeight: '140px',
              }}
            >
              <div className="text-xs sm:text-sm font-bold opacity-90">
                مهام متأخرة
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-left">
                5
              </div>
            </div>

            {/* 4. إكمال المهام (أخضر #34A853) */}
            <div
              className="p-6 rounded-3xl text-right flex flex-col justify-between shadow-md"
              style={{
                backgroundColor: '#34A853',
                color: '#FFFFFF',
                minHeight: '140px',
              }}
            >
              <div className="text-xs sm:text-sm font-bold opacity-90">
                إكمال المهام
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-left">
                72%
              </div>
            </div>
          </div>

          {/* أزرار الإنشاء السريعة المطابقة لصفحة 12 */}
          <div className="flex items-center gap-3 flex-wrap mb-10">
            <span className="text-xs font-black text-gray-800">
              أنشئي:
            </span>
            <button
              onClick={() => setWorkshopModalOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#4285F4] hover:bg-blue-600 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              + ورشة
            </button>
            <button
              onClick={() => setTaskModalOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#F9AB00] text-gray-950 font-black hover:bg-amber-400 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              + مهمة
            </button>
            <button
              onClick={() => setPollModalOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#34A853] hover:bg-green-600 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              + استبيان
            </button>
            <button
              onClick={() => setAnnouncementModalOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#EA4335] hover:bg-red-600 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              + إعلان
            </button>
          </div>

          {/* الصندوقان الرئيسيان المتجاوران: تنتظر مراجعتك وموجة المسار المطابقة لصفحة 12 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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
                {/* العنصر 1: نورة · صفحة تعريفية (تسليم قبل ساعتين) */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-gray-900">
                        نورة · صفحة تعريفية
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        تسليم
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      قبل ساعتين
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSubmission({
                        id: 'sub-1',
                        studentName: 'نورة العتيبي',
                        taskTitle: 'صفحة تعريفية شخصية (HTML & CSS)',
                        repoUrl: 'https://github.com/gdgoc-taif/html-portfolio-demo',
                      });
                      setReviewModalOpen(true);
                    }}
                    className="px-5 py-2 rounded-full text-xs font-black bg-[#F9AB00] hover:bg-amber-400 text-gray-950 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    راجع
                  </button>
                </div>

                {/* العنصر 2: [اسم] · متى موعد الورشة؟ (استفسار قبل يوم) */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-gray-900">
                        دانا · متى موعد الورشة القادمة؟
                      </span>
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                        استفسار
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      قبل يوم
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedInquiry(inquiries[0]);
                      setReplyModalOpen(true);
                    }}
                    className="px-5 py-2 rounded-full text-xs font-bold bg-[#EA4335] hover:bg-red-600 text-white transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    ردّ
                  </button>
                </div>
              </div>
            </div>

            {/* الصندوق 2 (اليسار): موجة المسار المطابقة لصفحة 12 */}
            <div
              className="p-6 sm:p-8 rounded-3xl card-navy flex flex-col justify-between overflow-hidden relative"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #0F1729',
                minHeight: '260px',
              }}
            >
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">
                  موجة المسار
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  المسار كله ماشي بخير هذا الأسبوع
                </p>
              </div>

              {/* موجة الـ SVG الملونة بألوان الهوية بأسفل الصندوق */}
              <div className="mt-8 -mx-8 -mb-8 overflow-hidden">
                <svg
                  viewBox="0 0 500 120"
                  preserveAspectRatio="none"
                  className="w-full h-28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0,60 C120,30 200,90 320,50 C400,20 460,70 500,45 L500,120 L0,120 Z"
                    fill="#34A853"
                    opacity="0.85"
                  />
                  <path
                    d="M0,80 C140,55 240,105 350,65 C430,35 480,85 500,60 L500,120 L0,120 Z"
                    fill="#4285F4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. تبويب الأعضاء (Members) مع أداة استيراد Excel من Google Forms */}
      {currentTab === 'members' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-1">
                إدارة الأعضاء والحسابات
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                إجمالي {members.length} عضواً معتمداً في مسار تصميم وتطوير الويب
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setImportModalOpen(true)}
                className="btn-pill px-5 py-2.5 text-xs font-bold text-white bg-[#34A853] hover:bg-green-700 transition-all cursor-pointer shadow-sm flex items-center gap-2"
              >
                <FileSpreadsheet size={16} />
                <span>استيراد ملف Forms (Excel/CSV)</span>
              </button>
            </div>
          </div>

          {/* فلاتر البحث والترتيب */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="ابحث بالاسم، اسم المستخدم، أو التخصص..."
                className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 shadow-xs"
              />
              <Search size={16} className="absolute right-3 top-3 text-gray-400" />
            </div>

            <select
              value={memberLevelFilter}
              onChange={(e) => setMemberLevelFilter(e.target.value as any)}
              className="px-4 py-2.5 text-xs rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none shadow-xs"
            >
              <option value="all">جميع المستويات</option>
              <option value="beginner">المستوى 1: مبتدئ</option>
              <option value="intermediate">المستوى 2: متوسط</option>
              <option value="advanced">المستوى 3: متقدم</option>
            </select>
          </div>

          {/* جدول الأعضاء */}
          <div className="bg-white rounded-3xl border-2 border-gray-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-black">
                  <tr>
                    <th className="py-4 px-5">العضو</th>
                    <th className="py-4 px-5">اسم المستخدم</th>
                    <th className="py-4 px-5">المستوى</th>
                    <th className="py-4 px-5">التخصص</th>
                    <th className="py-4 px-5">النقاط</th>
                    <th className="py-4 px-5">المهارات</th>
                    <th className="py-4 px-5">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-5 flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs"
                          style={{ backgroundColor: m.badgeColor || '#4285F4' }}
                        >
                          {m.avatarLetter}
                        </div>
                        <span className="font-bold text-gray-900">{m.fullName}</span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-gray-600">{m.username}</td>
                      <td className="py-3.5 px-5">
                        <span className="badge-pill bg-blue-50 text-blue-700 text-[11px] font-bold">
                          المستوى {m.levelNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-gray-600">{m.major || 'علوم حاسب'}</td>
                      <td className="py-3.5 px-5 font-bold text-green-700">{m.points} نقطة</td>
                      <td className="py-3.5 px-5">
                        <div className="flex gap-1 flex-wrap">
                          {m.skills?.slice(0, 3).map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                          نشط ✓
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

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
            <div className="p-6 rounded-3xl bg-white border-2 border-gray-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="badge-pill bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                    قيد المراجعة ⌛
                  </span>
                  <span className="text-xs text-gray-400">اليوم، قبل ساعتين</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  نورة العتيبي · تحدي «زر يتفاعل»
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  تم تسليم مستودع GitHub ومعاينة التفاعل الحركي وتطبيق تأثيرات Hover.
                </p>
                <a
                  href="https://github.com/gdgoc-taif/html-portfolio-demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <span>معاينة المستودع البرمجي</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedSubmission({
                      id: 'sub-1',
                      studentName: 'نورة العتيبي',
                      taskTitle: 'تحدي زر يتفاعل',
                      repoUrl: 'https://github.com/gdgoc-taif/html-portfolio-demo',
                    });
                    setReviewModalOpen(true);
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#34A853] hover:bg-green-700 transition-all cursor-pointer shadow-xs"
                >
                  اعتماد ومنح النقاط
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. تبويب المحتوى والرحلة (Content) */}
      {currentTab === 'content' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-1">
                إدارة المحتوى والمسارات التعليمية
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                تعديل روابط منصة سطر، روابط يوتيوب، المخرجات، وشروط الإكمال
              </p>
            </div>

            <button
              onClick={() => {
                alert('دليل التعلم المعتمد لمسار الويب (PDF) جاهز للتحميل والمشاركة مع الأعضاء.');
              }}
              className="btn-pill px-5 py-2.5 text-xs font-bold text-white bg-[#0F1729] hover:bg-gray-800 transition-all cursor-pointer shadow-xs"
            >
              تحميل ملف دليل التعلم PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-white border border-gray-200 text-right">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-gray-900">{c.title}</span>
                  <span className="badge-pill bg-gray-100 text-gray-700 text-[10px]">{c.category}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{c.description}</p>
                <div className="text-[11px] text-blue-600 truncate mb-1">
                  سطر: {c.directUrl || c.sources[0]?.url}
                </div>
              </div>
            ))}
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
                نتائج استبيان ورشة الأسبوع القادم
              </h2>
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
            </div>

            {/* صندوق استفسارات الأعضاء والردود */}
            <div className="p-6 rounded-3xl bg-white border-2 border-gray-900 text-right">
              <h2 className="text-lg font-black text-gray-900 mb-4">
                استفسارات تنتظر الرد
              </h2>
              <div className="flex flex-col gap-3">
                {inquiries.map((inq) => (
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
                ))}
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
        >
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-1">
              سجل النقاط وقواعد التحفيز (Points Ledger)
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              تدقيق ومتابعة جميع النقاط الممنوحة ومنع التكرار
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-gray-900 p-6">
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
                <tr>
                  <td className="py-3 font-bold text-gray-900">نورة العتيبي</td>
                  <td className="py-3 text-green-700 font-bold">+ 30 نقطة</td>
                  <td className="py-3 text-gray-600">تسليم مشروع: صفحتك الأولى</td>
                  <td className="py-3 text-gray-600">غيداء تركي الشريف</td>
                  <td className="py-3"><span className="text-green-700 font-bold">معتمد ✓</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-gray-900">أحمد الغامدي</td>
                  <td className="py-3 text-green-700 font-bold">+ 50 نقطة</td>
                  <td className="py-3 text-gray-600">تسليم تحدي: بطاقة CSS التفاعلية</td>
                  <td className="py-3 text-gray-600">ريتال القثامي</td>
                  <td className="py-3"><span className="text-green-700 font-bold">معتمد ✓</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* 7. تبويب تقييم الأداء القيادي (Evaluations) — للمشرفين أثير العتيبي وعامر الحارثي والقادة */}
      {currentTab === 'evaluations' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-right"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
                <span className="text-xs font-bold text-gray-500">
                  الإشراف والمتابعة القيادية · خاص بالقادة والمشرفين
                </span>
                <span className="badge-pill bg-red-50 text-red-700 text-[11px] font-bold border border-red-200">
                  محمي بـ RLS 🔒
                </span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-1">
                تقييم الأداء القيادي لمسار الويب
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                المشرفان: أثير العتيبي وعامر الحارثي — قادة المسار: غيداء تركي الشريف وريتال القثامي
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3.5 py-1.5 rounded-full">
                المقيّم الحالي: {currentUser.fullName} ({currentUser.roleTitle})
              </span>
            </div>
          </div>

          {/* محددات التقييم: اختيار القائد والفترة */}
          <div className="bg-white rounded-3xl border-2 border-gray-900 p-6 mb-8 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  القائد المستهدف بالتقييم
                </label>
                <select
                  value={selectedLeaderToEval}
                  onChange={(e) => setSelectedLeaderToEval(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 font-bold text-gray-900 focus:outline-none"
                >
                  <option value="غيداء تركي الشريف">غيداء تركي الشريف (قائدة مسار الويب)</option>
                  <option value="ريتال القثامي">ريتال القثامي (قائدة مسار الويب)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  الفترة الزمنية للتقييم
                </label>
                <select
                  value={evalPeriod}
                  onChange={(e) => setEvalPeriod(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 font-bold text-gray-900 focus:outline-none"
                >
                  <option value="الربع الأول 2026">الربع الأول 2026 (مرحلة التأسيس وتفعيل المسار)</option>
                  <option value="الربع الثاني 2026">الربع الثاني 2026 (مرحلة التطوير التفاعلي)</option>
                  <option value="تقييم منتصف المسار">تقييم منتصف المسار الشامل</option>
                </select>
              </div>
            </div>
          </div>

          {/* المعايير الخمسة بمقياس 1 إلى 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-3xl border-2 border-gray-900 p-6 sm:p-8">
              <h2 className="text-lg font-black text-gray-900 mb-6">
                معايير التقييم القيادي الخمسة (مقياس 1 - 5)
              </h2>

              <div className="flex flex-col gap-5">
                {[
                  { key: 'commitment', title: '1. الالتزام والمواظبة', desc: 'الالتزام بمواعيد الورش والاجتماعات ومتابعة مهام المسار' },
                  { key: 'quality', title: '2. جودة العمل والمخرجات', desc: 'دقة المحتوى التعليمي، معايير المراجعة، والتنظيم البرمجي' },
                  { key: 'initiative', title: '3. المبادرة والابتكار', desc: 'ابتكار أفكار جديدة للمسار، تحديات تفاعلية، وتحسين تجربة العضو' },
                  { key: 'engagement', title: '4. التفاعل مع الأعضاء والتحفيز', desc: 'سرعة الرد على الاستفسارات، الدعم الفني، وتقديم التغذية الراجعة' },
                  { key: 'collaboration', title: '5. التعاون وروح الفريق', desc: 'التنسيق بين القائدتين ومع قيادة المجالات وإدارة النادي' },
                ].map((crit) => {
                  const score = (evaluationScores as any)[crit.key];
                  return (
                    <div key={crit.key} className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <div className="font-bold text-xs text-gray-900">{crit.title}</div>
                          <div className="text-[11px] text-gray-500">{crit.desc}</div>
                        </div>

                        {/* أزرار المقياس من 1 إلى 5 */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() =>
                                setEvaluationScores((prev) => ({ ...prev, [crit.key]: val }))
                              }
                              className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                score === val
                                  ? 'bg-[#4285F4] text-white shadow-xs scale-105'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* بطاقة المعدل العام والنتيجة */}
            <div className="bg-white rounded-3xl border-2 border-gray-900 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900 mb-2">
                  المعدل التراكمي للتقييم
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  محسوب آلياً بناءً على المعايير الخمسة
                </p>

                {(() => {
                  const avg = (
                    (evaluationScores.commitment +
                      evaluationScores.quality +
                      evaluationScores.initiative +
                      evaluationScores.engagement +
                      evaluationScores.collaboration) /
                    5
                  ).toFixed(1);
                  return (
                    <div className="text-center p-6 rounded-2xl bg-blue-50 border border-blue-200 mb-6">
                      <div className="text-5xl font-black text-[#4285F4] mb-2">{avg}</div>
                      <div className="text-xs font-bold text-gray-700">من أصل 5.0 نقاط</div>
                      <div className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-black bg-[#34A853] text-white">
                        {Number(avg) >= 4.5 ? 'أداء استثنائي متميز ⭐' : 'أداء جيد جداً ومستقر ✓'}
                      </div>
                    </div>
                  );
                })()}

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 leading-relaxed">
                  🔒 <strong>ملاحظة خصوصية:</strong> نتائج التقييم القيادي لا تظهر في واجهات الأعضاء، وتخضع لسياسات أمان Row-Level Security لقادة النادي والمشرفين فقط.
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-700 mb-2">
                  حالة متابعة التوصيات:
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRecFollowUpStatus('in_progress')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      recFollowUpStatus === 'in_progress'
                        ? 'bg-[#F9AB00] text-gray-950 font-black shadow-xs'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    قيد المتابعة ⌛
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecFollowUpStatus('completed')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      recFollowUpStatus === 'completed'
                        ? 'bg-[#34A853] text-white font-bold shadow-xs'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    مكتملة ومعتمدة ✓
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* نصوص نقاط القوة وفرص التحسين والتوصيات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 1. نقاط القوة */}
            <div className="bg-white rounded-3xl border-2 border-gray-900 p-6">
              <label className="text-xs font-black text-gray-900 block mb-2">
                🌟 نقاط القوة والإشادة
              </label>
              <textarea
                rows={4}
                value={evalStrengths}
                onChange={(e) => setEvalStrengths(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none resize-none leading-relaxed"
                placeholder="اكتب نقاط القوة القيادية..."
              />
            </div>

            {/* 2. فرص التحسين */}
            <div className="bg-white rounded-3xl border-2 border-gray-900 p-6">
              <label className="text-xs font-black text-gray-900 block mb-2">
                📈 فرص التحسين والتطوير
              </label>
              <textarea
                rows={4}
                value={evalImprovements}
                onChange={(e) => setEvalImprovements(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none resize-none leading-relaxed"
                placeholder="اكتب مجالات التطوير المقترحة..."
              />
            </div>

            {/* 3. الملاحظات والتوصيات */}
            <div className="bg-white rounded-3xl border-2 border-gray-900 p-6">
              <label className="text-xs font-black text-gray-900 block mb-2">
                📝 التوصيات العامة وخطة المتابعة
              </label>
              <textarea
                rows={4}
                value={evalRecommendations}
                onChange={(e) => setEvalRecommendations(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none resize-none leading-relaxed"
                placeholder="اكتب التوصيات العملية القادمة..."
              />
            </div>
          </div>

          {/* زر حفظ التقييم القيادي */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-3xl border-2 border-gray-900 p-6 mb-8">
            <div>
              <div className="text-sm font-black text-gray-900 mb-0.5">
                حفظ وتوثيق هذا التقييم في سجل audit_log التاريخي
              </div>
              <div className="text-xs text-gray-500">
                يتم تثبيت التقييم بتوقيع رقمي للمشرف المقيّم ولا يمكن حذفه إلا بسجل تعديل موثق.
              </div>
            </div>

            <button
              onClick={() => {
                setEvalSavedMsg(`تم حفظ تقييم «${selectedLeaderToEval}» بنجاح وتوثيقه في السجل التاريخي ✓`);
                if (currentUser.settings?.celebrations) {
                  confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: ['#4285F4', '#34A853', '#F9AB00'],
                  });
                }
              }}
              className="px-6 py-3 rounded-full text-xs font-bold text-white bg-[#34A853] hover:bg-green-700 transition-all cursor-pointer shadow-xs active:scale-95 flex-shrink-0"
            >
              حفظ وتوثيق التقييم القيادي ✓
            </button>
          </div>

          {evalSavedMsg && (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold mb-8 text-center">
              {evalSavedMsg}
            </div>
          )}

          {/* السجل التاريخي والمقارنة بين الفترات */}
          <div className="bg-white rounded-3xl border-2 border-gray-900 p-6 sm:p-8">
            <h2 className="text-lg font-black text-gray-900 mb-2">
              السجل التاريخي للتقييمات القيادية ومقارنة الفترات
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              سجل تدقيق غير قابل للتعديل العشوائي لمتابعة نمو الأداء القيادي عبر الفترات
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-black">
                  <tr>
                    <th className="py-3 px-4">الفترة</th>
                    <th className="py-3 px-4">القائد</th>
                    <th className="py-3 px-4">المقيّم</th>
                    <th className="py-3 px-4">المعدل</th>
                    <th className="py-3 px-4">المقارنة</th>
                    <th className="py-3 px-4">حالة التوصيات</th>
                    <th className="py-3 px-4">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  <tr>
                    <td className="py-3 px-4 font-bold">الربع الأول 2026</td>
                    <td className="py-3 px-4">غيداء تركي الشريف</td>
                    <td className="py-3 px-4">أثير العتيبي</td>
                    <td className="py-3 px-4 font-black text-[#4285F4]">4.8 / 5.0</td>
                    <td className="py-3 px-4 font-bold text-green-700">+6.7% نمو ↗</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                        مكتملة ✓
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">2026-10-15</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold">الربع الأول 2026</td>
                    <td className="py-3 px-4">ريتال القثامي</td>
                    <td className="py-3 px-4">عامر الحارثي</td>
                    <td className="py-3 px-4 font-black text-[#4285F4]">4.9 / 5.0</td>
                    <td className="py-3 px-4 font-bold text-green-700">+8.2% نمو ↗</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                        مكتملة ✓
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">2026-10-15</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold">الربع الرابع 2025</td>
                    <td className="py-3 px-4">غيداء تركي الشريف</td>
                    <td className="py-3 px-4">أثير العتيبي</td>
                    <td className="py-3 px-4 font-black text-gray-700">4.5 / 5.0</td>
                    <td className="py-3 px-4 text-gray-400">خط الأساس</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        أرشيف
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">2025-12-28</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
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

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  النقاط المستحقة للمشروع
                </label>
                <input
                  type="number"
                  value={reviewPoints}
                  onChange={(e) => setReviewPoints(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 font-bold text-green-700"
                />
              </div>

              <div className="mb-6">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  ملاحظات القائدة للعضو
                </label>
                <textarea
                  rows={3}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="اكتب ملاحظة تشجيعية وتوجيهات برمجية..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleApproveSubmission}
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#34A853] hover:bg-green-700"
                >
                  اعتماد التسليم وتحديث الملف ✓
                </button>
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
                الرد على استفسار: {selectedInquiry.userName}
              </h3>
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 mb-4">
                {selectedInquiry.details}
              </p>

              <div className="mb-6">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  رد القائدة الرسمي
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="اكتب الرد التوضيحي للعضو..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700"
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

      {/* نافذة إنشاء ورشة جديدة (+ ورشة) */}
      <AnimatePresence>
        {workshopModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-900 text-right"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
                  <span>إضافة ورشة عمل جديدة</span>
                </h3>
                <button
                  onClick={() => {
                    setWorkshopModalOpen(false);
                    setWorkshopSuccessMsg('');
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    عنوان الورشة
                  </label>
                  <input
                    type="text"
                    value={newWorkshopTitle}
                    onChange={(e) => setNewWorkshopTitle(e.target.value)}
                    placeholder="مثال: تطبيق Flexbox و Grid عملياً"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    الموعد والتوقيت
                  </label>
                  <input
                    type="text"
                    value={newWorkshopTime}
                    onChange={(e) => setNewWorkshopTime(e.target.value)}
                    placeholder="مثال: الأحد القادم · ٨:٠٠ مساءً"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
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

              {workshopSuccessMsg && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold mb-4 text-center">
                  {workshopSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWorkshopModalOpen(false);
                    setWorkshopSuccessMsg('');
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newWorkshopTitle.trim()) return;
                    store.addNotification({
                      userId: 'member-noura',
                      type: 'workshop',
                      title: 'ورشة جديدة معلنة!',
                      description: `${newWorkshopTitle.trim()} · ${newWorkshopTime.trim() || 'قريباً'}`,
                      badgeText: '◆',
                      targetTab: 'community',
                    });
                    setWorkshopSuccessMsg('تم جدولة الورشة بنجاح وإرسال التنبيه للأعضاء ✓');
                    setTimeout(() => {
                      setWorkshopModalOpen(false);
                      setNewWorkshopTitle('');
                      setNewWorkshopTime('');
                      setNewWorkshopPresenter('');
                      setWorkshopSuccessMsg('');
                    }, 1200);
                  }}
                  disabled={!newWorkshopTitle.trim()}
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#4285F4] hover:bg-blue-700 disabled:opacity-50 shadow-xs"
                >
                  اعتماد وجدولة الورشة ✓
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
                    store.addNotification({
                      userId: 'member-noura',
                      type: 'task',
                      title: 'مهمة جديدة للمسار!',
                      description: `${newTaskTitle.trim()} · +${newTaskPoints} نقطة`,
                      badgeText: '!',
                      targetTab: 'challenges',
                    });
                    setTaskSuccessMsg('تم نشر المهمة وإضافتها لقائمة مهام المسار ✓');
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
                    store.addNotification({
                      userId: 'member-noura',
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
                    store.addNotification({
                      userId: 'member-noura',
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
