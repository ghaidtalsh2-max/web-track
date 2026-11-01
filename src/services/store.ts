// =============================================================================
// GDG on Campus — Taif University (Web Track Platform 2026)
// Central Store & State Engine — Phase 1 Complete
// =============================================================================

import {
  UserProfile,
  UserSettings,
  NotificationItem,
  ActionItem,
  WeeklyDay,
  Course,
  NextMission,
  Inquiry,
  Poll,
  PollVoteRecord,
  Announcement,
  MemberSubmission,
  Workshop,
  DayActivity,
  ChallengeGroup,
  ChallengeOption,
  ChallengeChoice,
  LabChallenge,
  MemberSkillItem,
  BadgeItem,
  UserStats,
  ActiveMemberRanking,
  TrackResource,
  AdminScheduledWorkshop,
  WorkshopAttendanceRecord,
  AttendanceEvent,
  ShowcaseSlot,
} from '../types';
import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';
import { deletePersistedLocalFile, persistLocalDataUrl } from './fileStorage';

// البريد المشتق من اسم المستخدم (يطابق ما ينشئه scripts/provision_accounts.cjs)
const AUTH_EMAIL_DOMAIN = 'members.gdgtu.local';

export const DEFAULT_SETTINGS: UserSettings = {
  fontSize: 17,
  theme: 'light',
  language: 'ar',
  reducedMotion: false,
  eyeComfort: false,
  celebrations: true,
  soundEnabled: true,
  highContrast: false,
};

// =============================================================================
// Lab Challenges Collection (تحديات مختبر الويب المعتمدة)
// =============================================================================
export const DEFAULT_LAB_CHALLENGES: LabChallenge[] = [
  {
    id: 'lab-1',
    title: 'تحدي زر الاحتفال بهوية قوقل',
    description: 'غيّر لون عنوان البطاقة في تبويب CSS ليصبح لوناً مختلفاً عن الأحمر، واختبر تفاعل الزر لإطلاق الاحتفال البصري وكسب النقاط.',
    instruction: 'تحدي اليوم: ابنِ بطاقة تفاعلية مع زر لإطلاق الاحتفال 🎊.',
    points: 10,
    level: 'beginner',
    levelLabel: 'المستوى 1 (مبتدئ)',
    badgeColor: '#4285F4',
    defaultHtml: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <title>مختبر الويب</title>
  </head>
  <body>
    <!-- ابدأ كتابة الكود هنا 🚀 -->
    <div class="card">
      <h1>Hello Taif</h1>
      <p>منصة مسار الويب · بيئة التطوير التفاعلية</p>
      <button id="celebrateBtn">اضغط للاحتفال 🎉</button>
    </div>
  </body>
</html>`,
    defaultCss: `/* تنسيقات CSS الأساسية */
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
  direction: rtl;
}`,
    defaultJs: `// البرمجة التفاعلية JavaScript
console.log("مختبر مسار الويب جاهز للتنفيذ 🚀");`,
    solutionHtml: `<div class="card">
  <h1>Hello Taif</h1>
  <p>منصة مسار الويب · بيئة التطوير التفاعلية</p>
  <button id="celebrateBtn">اضغط للاحتفال 🎉</button>
</div>`,
    solutionCss: `body {
  background: linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
}

.card {
  background: #FFFFFF;
  padding: 32px 40px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  border: 2px solid #0F1729;
  text-align: center;
  max-width: 360px;
}

h1 {
  color: #4285F4;
  font-size: 28px;
  font-weight: 900;
  margin: 0 0 8px 0;
}

p {
  color: #64748B;
  font-size: 13px;
  margin: 0 0 20px 0;
}

button {
  background-color: #34A853;
  color: #FFFFFF;
  border: 2px solid #0F1729;
  border-bottom: 4px solid #0F1729;
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

button:hover {
  transform: translateY(-2px);
  border-bottom-width: 5px;
}`,
    solutionJs: `const btn = document.getElementById('celebrateBtn');
btn.onclick = () => {
  btn.innerText = 'احتفال مبهج! 🎊';
  window.parent.postMessage('trigger-confetti', '*');
  setTimeout(() => {
    btn.innerText = 'اضغط للاحتفال 🎉';
  }, 2000);
};`,
  },
  {
    id: 'lab-2',
    title: 'بطاقة منتج متجر إلكتروني بنظام Flexbox',
    description: 'استخدم خصائص Flexbox لتوزيع عناصر بطاقة المنتج (الصورة، الوصف، السعر، وزر الشراء) بتنسيق عصري متناسق.',
    instruction: 'تحدي Flexbox: اضبط display: flex و justify-content لترتيب السعر وزر الشراء في سطر واحد متناسق.',
    points: 20,
    level: 'intermediate',
    levelLabel: 'المستوى 2 (متوسط)',
    badgeColor: '#34A853',
    defaultHtml: `<div class="store-card">
  <div class="product-badge">جديد 🌟</div>
  <div class="product-img">👟</div>
  <h2>حذاء مسار الويب الرياضي</h2>
  <p>إصدار محدود للطلبة المطورين في جامعة الطائف بجودة عالية ومظهر أنيق.</p>
  <div class="action-row">
    <span class="price">١٩٩ ر.س</span>
    <button id="buyBtn">أضف للسلة 🛒</button>
  </div>
</div>`,
    defaultCss: `body {
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  font-family: system-ui, sans-serif;
  direction: rtl;
}

.store-card {
  background: white;
  width: 300px;
  padding: 24px;
  border-radius: 20px;
  border: 2px solid #0F172A;
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
  position: relative;
}

.product-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #EA4335;
  color: white;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 800;
}

.product-img {
  font-size: 64px;
  text-align: center;
  background: #EFF6FF;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}

h2 {
  font-size: 18px;
  margin: 0 0 6px;
  color: #0F172A;
}

p {
  font-size: 12px;
  color: #64748B;
  line-height: 1.5;
  margin: 0 0 16px;
}

.action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #E2E8F0;
}

.price {
  font-size: 18px;
  font-weight: 900;
  color: #34A853;
}

button {
  background: #4285F4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 9999px;
  font-weight: bold;
  cursor: pointer;
}`,
    defaultJs: `const buyBtn = document.getElementById('buyBtn');
buyBtn.onclick = () => {
  buyBtn.innerText = 'تمت الإضافة بنجاح ✓';
  buyBtn.style.backgroundColor = '#34A853';
  window.parent.postMessage('trigger-confetti', '*');
};`,
  },
  {
    id: 'lab-3',
    title: 'أنيميشن دوران زهرة قوقل (CSS Keyframes)',
    description: 'اصنع تأثيراً حركياً احترافياً عبر CSS @keyframes لجعل الشارة تدور بنعومة مع تأثير توهج ثلاثي الأبعاد عند التحويم.',
    instruction: 'تحدي الأنيميشن: أضف كود @keyframes spin وقم بربطه بفئة .pinwheel-glow لتدوير الشارة.',
    points: 30,
    level: 'advanced',
    levelLabel: 'المستوى 3 (متقدم)',
    badgeColor: '#F9AB00',
    defaultHtml: `<div class="container">
  <div class="pinwheel-glow" id="spinTarget">
    <div class="petal p-blue"></div>
    <div class="petal p-red"></div>
    <div class="petal p-yellow"></div>
    <div class="petal p-green"></div>
  </div>
  <h2>CSS Keyframes Master</h2>
  <button id="turboBtn">ضاعف السرعة ⚡</button>
</div>`,
    defaultCss: `body {
  background: #0F172A;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  font-family: system-ui, sans-serif;
  text-align: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.pinwheel-glow {
  width: 90px;
  height: 90px;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 8px;
  animation: spin 6s linear infinite;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.pinwheel-glow:hover {
  filter: drop-shadow(0 0 16px rgba(66, 133, 244, 0.8));
}

.petal {
  border-radius: 12px;
}

.p-blue { background: #4285F4; }
.p-red { background: #EA4335; }
.p-yellow { background: #FBBC04; }
.p-green { background: #34A853; }

button {
  background: #34A853;
  color: #0F172A;
  border: 2px solid white;
  padding: 10px 20px;
  border-radius: 9999px;
  font-weight: 900;
  cursor: pointer;
}`,
    defaultJs: `const target = document.getElementById('spinTarget');
const btn = document.getElementById('turboBtn');
let fast = false;

btn.onclick = () => {
  fast = !fast;
  target.style.animationDuration = fast ? '1s' : '6s';
  btn.innerText = fast ? 'تهدئة السرعة 🍃' : 'ضاعف السرعة ⚡';
  if (fast) window.parent.postMessage('trigger-confetti', '*');
};`,
  },
  {
    id: 'lab-4',
    title: 'شريط تنقل متجاوب (Responsive Navbar)',
    description: 'قم بتصميم شريط هيدر يحتوي على شعار المسار وروابط التنقل وتأثير تفاعلي عند الضغط.',
    instruction: 'تحدي الهيدر: نسّق عناصر الـ nav عبر flex واجعل الشعار على اليمين والروابط على اليسار.',
    points: 25,
    level: 'intermediate',
    levelLabel: 'المستوى 2 (متوسط)',
    badgeColor: '#4285F4',
    defaultHtml: `<nav class="navbar">
  <div class="logo">
    <span class="dot"></span>
    <strong>GDG Taif</strong>
  </div>
  <ul class="nav-links">
    <li><a href="#" class="active">الرئيسية</a></li>
    <li><a href="#">الرحلة</a></li>
    <li><a href="#">المشاريع</a></li>
    <li><a href="#" id="contactLink">تواصل معنا</a></li>
  </ul>
</nav>

<div class="hero-content">
  <h1>مسار تصميم وتطوير الويب</h1>
  <p>بناء واجهات المستقبل بأحدث المعايير البرمجية</p>
</div>`,
    defaultCss: `body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #F8FAFC;
  direction: rtl;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: white;
  border-bottom: 2px solid #0F172A;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4285F4;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: #475569;
  font-weight: 700;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-links a:hover, .nav-links a.active {
  background: #EFF6FF;
  color: #4285F4;
}

.hero-content {
  text-align: center;
  padding: 60px 20px;
}

h1 { color: #0F172A; font-size: 32px; margin-bottom: 8px; }
p { color: #64748B; font-size: 14px; }`,
    defaultJs: `document.getElementById('contactLink').onclick = (e) => {
  e.preventDefault();
  alert('مرحباً بك! تواصل معنا عبر مجتمع نادي قوقل للطلبة المطورين بجامعة الطائف.');
  window.parent.postMessage('trigger-confetti', '*');
};`,
  },
];

// مفاتيح التخزين المحلي (الإصدار التاسع المحدث لربط السحابة والورش والأنشطة)
const STORAGE_KEYS = {
  INTRO_SEEN: 'gdg_webtrack_intro_seen_session_v9',
  NOTIFICATIONS: 'gdg_webtrack_notifications_v9',
  COURSES: 'gdg_webtrack_courses_v9',
  POLLS: 'gdg_webtrack_polls_v9',
  VOTES: 'gdg_webtrack_poll_votes_v9',
  WORKSHOPS: 'gdg_webtrack_workshops_v9',
  ACTION_ITEMS: 'gdg_webtrack_action_items_v9',
  CHALLENGE_GROUPS: 'gdg_webtrack_challenge_groups_v9',
  CHALLENGE_CHOICES: 'gdg_webtrack_challenge_choices_v9',
  ACTIVE_LAB_CHALLENGE: 'gdg_webtrack_active_lab_challenge_v9',
  CUSTOM_LAB_CHALLENGES: 'gdg_webtrack_custom_lab_challenges_v9',
  ADMIN_WORKSHOPS: 'gdg_webtrack_admin_workshops_plan_v1',
  ATTENDANCE: 'gdg_webtrack_attendance_v1',
  ATTENDANCE_EVENTS: 'gdg_webtrack_attendance_events_v2',
  RESOURCES: 'gdg_webtrack_resources_v1',
  PROJECTS: 'gdg_webtrack_showcase_projects_v1',
  SHOWCASE_SLOTS: 'gdg_webtrack_showcase_slots_v2',
};

// قائمة فعاليات وورش التحضير الأساسية المعتمدة
export const INITIAL_ATTENDANCE_EVENTS: AttendanceEvent[] = [
  {
    id: 'evt-intro',
    title: 'لقاء المجال التعريفي (أمس)',
    type: 'meeting',
    dateStr: 'الخميس 29 أكتوبر 2026',
    pointsReward: 20,
  },
  {
    id: 'evt-ws-1',
    title: 'الورشة 1: أساسيات الويب (Web Fundamentals)',
    type: 'workshop',
    dateStr: 'الثلاثاء 3 نوفمبر 2026',
    pointsReward: 20,
  },
  {
    id: 'evt-ws-2',
    title: 'الورشة 2: إدارة المشاريع (Git & GitHub)',
    type: 'workshop',
    dateStr: 'السبت 7 نوفمبر 2026',
    pointsReward: 20,
  },
  {
    id: 'evt-ws-3',
    title: 'الورشة 3: تصميم الواجهات (UI/UX Design)',
    type: 'workshop',
    dateStr: 'الثلاثاء 10 نوفمبر 2026',
    pointsReward: 20,
  },
  {
    id: 'evt-ws-4',
    title: 'الورشة 4: البيانات وقواعد البيانات (Data & Databases)',
    type: 'workshop',
    dateStr: 'السبت 14 نوفمبر 2026',
    pointsReward: 20,
  },
  {
    id: 'evt-ws-5',
    title: 'الورشة 5: تطوير الواجهات باستخدام React',
    type: 'workshop',
    dateStr: 'الثلاثاء 17 نوفمبر 2026',
    pointsReward: 20,
  },
  {
    id: 'evt-ws-6',
    title: 'الورشة 6: بناء تطبيق ويب متكامل',
    type: 'workshop',
    dateStr: 'السبت 21 نوفمبر 2026',
    pointsReward: 20,
  },
  {
    id: 'evt-ws-7',
    title: 'الورشة 7: نشر المواقع وتأمينها',
    type: 'workshop',
    dateStr: 'الثلاثاء 24 نوفمبر 2026',
    pointsReward: 20,
  },
  {
    id: 'evt-ws-8',
    title: 'الورشة 8: المعرض الختامي والتخريج',
    type: 'workshop',
    dateStr: 'السبت 28 نوفمبر 2026',
    pointsReward: 20,
  },
];

// مجموعات التحديات والخيارات المعتمدة (فارغة حتى تطرحها القائدة)
export const INITIAL_CHALLENGE_GROUPS: ChallengeGroup[] = [];

// قائمة الملفات الإثرائية المعتمدة لمسار الويب (فارغة افتراضياً حتى يضيفها القادة بأنفسهم)
export const INITIAL_TRACK_RESOURCES: TrackResource[] = [];

// الورش الرسمية المعتمدة (فارغة افتراضياً حتى يضيفها القادة)
export const INITIAL_WORKSHOPS: Workshop[] = [];

// التنبيهات الأولية (فارغة افتراضياً حتى صدور تنبيهات حقيقية)
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export interface TrackBadgeDefinition {
  id: string;
  name: string;
  title: string;
  category: 'points' | 'workshops' | 'tasks';
  icon: string;
  color: string;
  description: string;
  targetValue: number;
}

export const TRACK_BADGES: TrackBadgeDefinition[] = [
  {
    id: 'badge-pts-200',
    name: 'شرارة البداية ⚡',
    title: 'شرارة البداية',
    category: 'points',
    icon: '⚡',
    color: '#4285F4',
    description: 'تحقيق أول 200 نقطة تميز في مسار الويب',
    targetValue: 200,
  },
  {
    id: 'badge-pts-500',
    name: 'شعلة الإنجاز 🔥',
    title: 'شعلة الإنجاز',
    category: 'points',
    icon: '🔥',
    color: '#EA4335',
    description: 'الوصول إلى 500 نقطة من التفاعل والإتقان',
    targetValue: 500,
  },
  {
    id: 'badge-pts-700',
    name: 'أسطورة المسار 💎',
    title: 'أسطورة المسار',
    category: 'points',
    icon: '💎',
    color: '#34A853',
    description: 'تجاوز 700 نقطة والدخول في نادي نخبة المطورين',
    targetValue: 700,
  },
  {
    id: 'badge-pts-1000',
    name: 'التاج الذهبي 👑',
    title: 'التاج الذهبي',
    category: 'points',
    icon: '👑',
    color: '#F9AB00',
    description: 'كسر حاجز 1000 نقطة والتربع على عرش التميز البرمجي',
    targetValue: 1000,
  },
  {
    id: 'badge-ws-3',
    name: 'حاضر ومبادر 🎯',
    title: 'حاضر ومبادر',
    category: 'workshops',
    icon: '🎯',
    color: '#4285F4',
    description: 'الالتزام بحضور 3 ورش عمل تطبيقية',
    targetValue: 3,
  },
  {
    id: 'badge-ws-5',
    name: 'شغف المعرفة 🚀',
    title: 'شغف المعرفة',
    category: 'workshops',
    icon: '🚀',
    color: '#34A853',
    description: 'الالتزام بحضور 5 ورش عمل تطبيقية متقدمة',
    targetValue: 5,
  },
  {
    id: 'badge-ws-8',
    name: 'سفير الورش الذهبي 🌟',
    title: 'سفير الورش الذهبي',
    category: 'workshops',
    icon: '🌟',
    color: '#F9AB00',
    description: 'حضور جميع ورش المسار الثماني بنسبة التزام 100%',
    targetValue: 8,
  },
  {
    id: 'badge-task-1',
    name: 'أول خطوة كود 💻',
    title: 'أول خطوة كود',
    category: 'tasks',
    icon: '💻',
    color: '#4285F4',
    description: 'تسليم واعتماد أول مهمة برمجية بنجاح',
    targetValue: 1,
  },
  {
    id: 'badge-task-4',
    name: 'مطوّر نصف المسار 🛠️',
    title: 'مطوّر نصف المسار',
    category: 'tasks',
    icon: '🛠️',
    color: '#EA4335',
    description: 'إنجاز وتسليم 4 مهام برمجية تطبيقية',
    targetValue: 4,
  },
  {
    id: 'badge-task-8',
    name: 'خبير الويب الشامل 🏆',
    title: 'خبير الويب الشامل',
    category: 'tasks',
    icon: '🏆',
    color: '#34A853',
    description: 'إنجاز وتسليم جميع مهام وتحديات ورش المسار الثماني',
    targetValue: 8,
  },
];

// خطة ورش مسار تصميم وتطوير الويب — نوفمبر 2026 (مسودة مجدولة لحسابات الإدارة فقط)
export const INITIAL_ADMIN_SCHEDULED_WORKSHOPS: AdminScheduledWorkshop[] = [
  {
    id: 'plan-ws-1',
    orderNumber: 1,
    titleAr: 'أساسيات الويب',
    titleEn: 'Web Fundamentals',
    dateStr: 'الثلاثاء 3 نوفمبر 2026',
    presenter: 'سلمان الغامدي',
    pillars: [
      'كيف يعمل الويب؟ فهم المتصفح والخادم وكيف تظهر المواقع للمستخدم.',
      'HTML: بناء هيكل الصفحة وتنظيم محتواها.',
      'CSS: تنسيق الواجهات والتحكم في الألوان والتخطيط والتصميم المتجاوب.',
      'JavaScript: إضافة التفاعل وربط عناصر الصفحة بأحداث المستخدم.',
    ],
    taskNumber: 'Task 01',
    taskTitle: 'Make It Interactive',
    taskDescription: 'بناء صفحة ويب متجاوبة تحتوي على محتوى منظم وتصميم مناسب، مع عنصر تفاعلي باستخدام JavaScript.',
    isPublished: false,
  },
  {
    id: 'plan-ws-2',
    orderNumber: 2,
    titleAr: 'إدارة المشاريع البرمجية',
    titleEn: 'Git & GitHub',
    dateStr: 'السبت 7 نوفمبر 2026',
    presenter: 'مهاد الحارثي',
    pillars: [
      'أساسيات Git وGitHub: الفرق بينهما ودورهما في تطوير مواقع الويب.',
      'إدارة التعديلات: استخدام add وcommit وpush وpull.',
      'تنظيم العمل والتعاون: المستودعات والفروع وPull Requests.',
      'توثيق المشاريع: كتابة README وتنظيم ملفات المستودع.',
    ],
    taskNumber: 'Task 02',
    taskTitle: 'Repo Makeover',
    taskDescription: 'رفع مشروع ويب إلى GitHub، وتنظيم ملفاته، وإضافة README يشرح فكرته وطريقة تشغيله، مع توثيق التعديلات باستخدام Commits واضحة.',
    isPublished: false,
  },
  {
    id: 'plan-ws-3',
    orderNumber: 3,
    titleAr: 'تصميم الواجهات وتجربة المستخدم',
    titleEn: 'UI/UX Design',
    dateStr: 'الثلاثاء 10 نوفمبر 2026',
    presenter: 'دانة الشهري وشوق الزايدي',
    pillars: [
      'فهم المستخدم: تحديد احتياجاته والمشكلة التي يحلها الموقع.',
      'تخطيط الواجهة: بناء User Flow وWireframes قبل التصميم.',
      'التصميم البصري: الألوان والخطوط والمسافات والتسلسل البصري.',
      'التصميم التفاعلي والمتجاوب: إنشاء Prototype في Figma ومراعاة اختلاف أحجام الشاشات.',
    ],
    taskNumber: 'Task 03',
    taskTitle: 'The UI Rescue',
    taskDescription: 'اختيار واجهة موقع تحتاج إلى تحسين، وإعادة تصميمها باستخدام Figma مع توضيح أبرز المشكلات التي عالجها التصميم.',
    isPublished: false,
  },
  {
    id: 'plan-ws-4',
    orderNumber: 4,
    titleAr: 'البيانات وقواعد البيانات',
    titleEn: 'Data & Databases',
    dateStr: 'السبت 14 نوفمبر 2026',
    presenter: 'لانا الجعيد',
    pillars: [
      'البيانات في مواقع الويب: أنواع البيانات وكيفية تنظيمها والاستفادة منها.',
      'أساسيات قواعد البيانات: الجداول والحقول والسجلات والمفاتيح والعلاقات.',
      'تصميم قواعد البيانات: تحديد الجداول والعلاقات المناسبة لاحتياج الموقع.',
      'SQL عمليًا: أساسيات الاستعلام وإضافة البيانات وتعديلها وحذفها.',
    ],
    taskNumber: 'Task 04',
    taskTitle: 'Structure the Data',
    taskDescription: 'اختيار فكرة موقع مثل مكتبة أو متجر، وتصميم قاعدة بيانات مناسبة لها، مع تحديد الجداول والحقول والعلاقات وكتابة استعلامات SQL أساسية.',
    isPublished: false,
  },
  {
    id: 'plan-ws-5',
    orderNumber: 5,
    titleAr: 'تطوير الواجهات باستخدام React',
    titleEn: 'React',
    dateStr: 'الثلاثاء 17 نوفمبر 2026',
    presenter: 'ريتال القثامي وغيداء الشريف',
    pillars: [
      'مقدمة في React: فهم دورها في بناء واجهات الويب وتجهيز المشروع.',
      'Components وJSX: تقسيم الواجهة إلى عناصر قابلة لإعادة الاستخدام.',
      'Props وState: تمرير البيانات وتحديث الواجهة.',
      'التفاعل مع البيانات: الأحداث والنماذج وعرض القوائم بصورة ديناميكية.',
    ],
    taskNumber: 'Task 05',
    taskTitle: 'Build It with React',
    taskDescription: 'بناء واجهة تفاعلية باستخدام React، مثل قائمة مهام أو لوحة مشاريع، مع مكونات قابلة لإعادة الاستخدام وإمكانية إضافة العناصر وعرضها.',
    isPublished: false,
  },
  {
    id: 'plan-ws-6',
    orderNumber: 6,
    titleAr: 'بناء تطبيق ويب متكامل',
    titleEn: 'Full-Stack Web Development',
    dateStr: 'السبت 21 نوفمبر 2026',
    presenter: 'غيداء الشريف وريتال القثامي',
    pillars: [
      'بنية تطبيق الويب: كيف تتكامل الواجهة والخدمات والبيانات.',
      'APIs وتبادل البيانات: إرسال الطلبات واستقبال البيانات وعرضها.',
      'ربط الموقع بالبيانات: استخدام خدمة مثل Supabase أو Firebase عند الحاجة.',
      'العمليات الأساسية وإدارة الحالات: CRUD والتعامل مع التحميل والأخطاء والنجاح.',
    ],
    taskNumber: 'Task 06',
    taskTitle: 'Make It Work',
    taskDescription: 'بناء تطبيق ويب مصغّر يتيح للمستخدم إضافة بيانات وعرضها وتعديلها وحذفها، باستخدام مصدر بيانات مناسب للمشروع.',
    isPublished: false,
  },
  {
    id: 'plan-ws-7',
    orderNumber: 7,
    titleAr: 'الأمن السيبراني لمواقع الويب',
    titleEn: 'Web Security',
    dateStr: 'الثلاثاء 24 نوفمبر 2026',
    presenter: 'ريماس الحارثي',
    pillars: [
      'مخاطر تطبيقات الويب: أشهر الثغرات وكيف تنشأ.',
      'حماية المدخلات والمخرجات: التحقق من البيانات والوقاية من XSS وSQL Injection.',
      'المصادقة والصلاحيات: الفرق بين Authentication وAuthorization وحماية بيانات المستخدم.',
      'تأمين المشروع: حماية مفاتيح API والأسرار، واكتشاف الأخطاء وإصلاحها في بيئة تدريبية.',
    ],
    taskNumber: 'Task 07',
    taskTitle: 'Secure the Site',
    taskDescription: 'مراجعة تطبيق ويب تدريبي، وتحديد مشكلتين أمنيتين على الأقل، ثم توضيح طريقة إصلاحهما أو تطبيق الإصلاح والتحقق منه.',
    isPublished: false,
  },
  {
    id: 'plan-ws-8',
    orderNumber: 8,
    titleAr: 'توظيف الذكاء الاصطناعي في مواقع الويب',
    titleEn: 'AI-Powered Web Apps',
    dateStr: 'السبت 28 نوفمبر 2026',
    presenter: 'عبدالعزيز العصيمي',
    pillars: [
      'اختيار ميزة ذكية للموقع: تحديد مشكلة يمكن حلها أو تحسينها باستخدام AI.',
      'دمج AI APIs: إرسال مدخلات المستخدم إلى خدمة ذكاء اصطناعي واستقبال النتائج.',
      'بناء تجربة المستخدم: عرض النتائج والتعامل مع التحميل والأخطاء والمخرجات غير المناسبة.',
      'الأمان وجودة المخرجات: حماية مفاتيح API ومراعاة الخصوصية والتحقق من النتائج.',
    ],
    taskNumber: 'Task 08',
    taskTitle: 'Add an AI Feature',
    taskDescription: 'إضافة ميزة ذكاء اصطناعي إلى موقع ويب، مثل مساعد يجيب عن أسئلة حول محتوى الموقع أو أداة تلخيص نصوص، مع توضيح طريقة عمل الميزة.',
    isPublished: false,
  },
];

// قائمة "ينتظرك" (مطابقة لصفحة 3 في المرجع)
export const INITIAL_ACTION_ITEMS: ActionItem[] = [
  {
    id: 'act-1',
    type: 'poll',
    typeLabel: 'استبيان',
    title: 'أي ورشة تبغون الأسبوع الجاي؟',
    subtitle: 'ينتهي بعد ٣ أيام · يفتح صفحة الاستبيان ←',
    dueText: 'ينتهي بعد ٣ أيام',
    actionText: 'جاوب',
    actionType: 'answer',
    targetTab: 'community',
  },
  {
    id: 'act-2',
    type: 'workshop',
    typeLabel: 'ورشة',
    title: 'Grid و Flexbox · الأحد ٨ مساءً',
    subtitle: 'سجّلي حضورك للورشة التطبيقية',
    dueText: 'الأحد ٨:٠٠ م',
    actionText: 'سجّل',
    actionType: 'register',
    targetTab: 'home',
  },
  {
    id: 'act-3',
    type: 'learn',
    typeLabel: 'اتعلّم',
    title: 'CSS · Flexbox',
    subtitle: 'اختياري لمستواك',
    dueText: 'مطلوب للمسار',
    actionText: 'افتح',
    actionType: 'open',
    targetTab: 'journey',
  },
];

// المهمة التالية (مطابقة لصفحة 3 في المرجع)
export const CURRENT_MISSION: NextMission = {
  id: 'mission-next-1',
  title: 'سلّمي تحدي «زر يتفاعل»',
  summary: 'صمم وطوّر بطاقة استكشافية متفاعلة تطبق قواعد الألوان الأربعة والوردة الرسمية بدون استخدام ظلال ضبابية ثقيلة.',
  details: 'المطلوب تطبيق حركة قلب البطاقة (Flip) أو الكشف التفاعلي (Stack Deck) مستلهماً من تجربة The Web Can Do What.',
  stageName: 'المرحلة 2: التطوير التفاعلي',
  badgeLevel: 'المهمة التفاعلية 02',
  dueDate: 'باقي يومين',
  dueText: 'باقي يومين',
  actionText: 'ابدأ',
  points: 40,
  tags: ['CSS Architecture', 'Brand Motifs', 'Micro-Interactions'],
  color: 'yellow',
};

export const NEXT_MISSION: NextMission = CURRENT_MISSION;


// شريط أيام الأسبوع (مطابق لصفحة 3 في المرجع)
export const WEEKLY_DAYS: WeeklyDay[] = [
  { dayName: 'ح', dayFullName: 'الأحد', dateNumber: 4, hasActivity: true, activityCount: 1 },
  { dayName: 'ن', dayFullName: 'الاثنين', dateNumber: 5, hasActivity: false },
  { dayName: 'ث', dayFullName: 'الثلاثاء', dateNumber: 6, hasActivity: true, activityCount: 1 },
  { dayName: 'ر', dayFullName: 'الأربعاء', dateNumber: 7, hasActivity: true, isToday: true },
  { dayName: 'خ', dayFullName: 'الخميس', dateNumber: 8, hasActivity: true, activityCount: 2 },
  { dayName: 'ج', dayFullName: 'الجمعة', dateNumber: 9, hasActivity: false },
  { dayName: 'س', dayFullName: 'السبت', dateNumber: 10, hasActivity: false },
];

// الكورسات والمسارات التعليمية المصنفة والمعتمدة
export const INITIAL_COURSES: Course[] = [
  // -------------------------------------------------------------
  // 1. اللغات (Languages)
  // -------------------------------------------------------------
  {
    id: 'course-html',
    title: 'HTML',
    symbol: '</>',
    color: 'red',
    category: 'languages',
    levelRequirement: 'إجبارية لمن لا يمتلك المهارة، وتأسيسية للمبتدئ.',
    status: 'completed',
    skillReward: 'HTML',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/CATspNvVjT/view',
    description: 'بناء وهيكلة صفحات الويب باستخدام عناصر HTML5 الدلالية وأفضل الممارسات القياسية.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'دورة تعلم HTML بالعربي',
        outcome: 'بناء هيكل صفحة كامل ومرتب',
        url: 'https://satr.tuwaiq.edu.sa/course/CATspNvVjT/view',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
    projectRepoUrl: 'https://github.com/gdgoc-taif/html-portfolio-demo',
  },
  {
    id: 'course-css',
    title: 'CSS',
    symbol: '#',
    color: 'blue',
    category: 'languages',
    levelRequirement: 'إجبارية لمن لا يمتلك المهارة، ومحورية لتصميم الواجهات.',
    status: 'in_progress',
    skillReward: 'CSS',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/hNUwyBUKmF/view',
    description: 'تنسيق وتصميم واجهات الويب باحترافية، والتحكم في الألوان والخطوط والتخطيط والتجاوب.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'دورة تعلم CSS بالعربي',
        outcome: 'تنسّق صفحة كاملة باحترافية وتخطيط سليم',
        url: 'https://satr.tuwaiq.edu.sa/course/hNUwyBUKmF/view',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
    projectRepoUrl: '',
  },
  {
    id: 'course-js',
    title: 'JavaScript',
    symbol: 'JS',
    color: 'yellow',
    category: 'languages',
    levelRequirement: 'إجبارية لمن لا يمتلك المهارة، وتغطي 3 مستويات تدريجية.',
    status: 'not_started',
    skillReward: 'JavaScript',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/MxhtosVATL/view?course_path_id=ecbAGsuqOQ',
    description: 'لغة التفاعل الأساسية لصفحات الويب - تتضمن 3 مستويات تدريجية معتمدة عبر منصة سطر.',
    subLevels: [
      {
        id: 'js-101',
        title: 'JavaScript 101',
        url: 'https://satr.tuwaiq.edu.sa/course/MxhtosVATL/view?course_path_id=ecbAGsuqOQ',
        level: 'المستوى الأول',
        outcome: 'الأساسيات والمتغيرات والجمل الشرطية والعمليات المنطقية',
      },
      {
        id: 'js-102',
        title: 'JavaScript 102',
        url: 'https://satr.tuwaiq.edu.sa/course/lnCDammOOq/view?course_path_id=ecbAGsuqOQ',
        level: 'المستوى الثاني',
        outcome: 'المصفوفات والدوال والكائنات والتعامل مع البيانات',
      },
      {
        id: 'js-103',
        title: 'JavaScript 103',
        url: 'https://satr.tuwaiq.edu.sa/course/cKCPvecdYe/view?course_path_id=ecbAGsuqOQ',
        level: 'المستوى الثالث',
        outcome: 'البرمجة كائنية التوجه (OOP) وتفاعل الـ DOM و Async/Await',
      },
    ],
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'مسار مستويات JavaScript (101, 102, 103)',
        outcome: 'إتقان التفاعل البرمجي بجميع مستوياته الثلاثة',
        url: 'https://satr.tuwaiq.edu.sa/course/MxhtosVATL/view?course_path_id=ecbAGsuqOQ',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
  },
  {
    id: 'course-php',
    title: 'PHP',
    symbol: 'PHP',
    color: 'blue',
    category: 'languages',
    levelRequirement: 'لغة بناء وتطوير تطبيقات الويب الديناميكية وإدارة الخوادم (5 مستويات معتمدة).',
    status: 'not_started',
    skillReward: 'PHP',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/XpUTrJaQRo/view',
    description: 'مسار لغة PHP المتكامل لتطوير مواقع وتطبيقات الويب الخلفية، معالجة النماذج، وربط قواعد البيانات.',
    subLevels: [
      {
        id: 'php-101',
        title: 'PHP 101',
        url: 'https://satr.tuwaiq.edu.sa/course/XpUTrJaQRo/view',
        level: 'المستوى الأول',
        outcome: 'أساسيات لغة PHP، المتغيرات، الأنواع، والشروط البرمجية',
      },
      {
        id: 'php-102',
        title: 'PHP 102',
        url: 'https://satr.tuwaiq.edu.sa/course/nEGEtZAokF/view',
        level: 'المستوى الثاني',
        outcome: 'الحلقات التكرارية، المصفوفات المتقدمة، وبناء الدوال',
      },
      {
        id: 'php-103',
        title: 'PHP 103',
        url: 'https://satr.tuwaiq.edu.sa/course/WtxnlxUnNF/view',
        level: 'المستوى الثالث',
        outcome: 'معالجة نماذج الويب GET & POST وتمرير البيانات والجلسات Sessions',
      },
      {
        id: 'php-104',
        title: 'PHP 104',
        url: 'https://satr.tuwaiq.edu.sa/course/VecyqaOUvn/view',
        level: 'المستوى الرابع',
        outcome: 'ربط PHP مع قواعد بيانات MySQL وإجراء عمليات CRUD وتخزين السجلات',
      },
      {
        id: 'php-106',
        title: 'PHP 106',
        url: 'https://satr.tuwaiq.edu.sa/course/UFvfEsbqNK/view',
        level: 'المستوى المتقدم',
        outcome: 'بناء تطبيقات ويب متكاملة وإدارة أمان التطبيقات وحماية النماذج',
      },
    ],
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'مسار دورات PHP المعتمد',
        outcome: 'تطوير تطبيقات الويب الديناميكية وإدارة قواعد البيانات باحترافية',
        url: 'https://satr.tuwaiq.edu.sa/course/XpUTrJaQRo/view',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
  },

  // -------------------------------------------------------------
  // 2. الأطر (Frameworks & Backend)
  // -------------------------------------------------------------
  {
    id: 'course-react',
    title: 'React',
    symbol: '⚛',
    color: 'blue',
    category: 'frameworks',
    levelRequirement: 'مكتبة الواجهات الأكثر طلباً عالمياً لبناء تطبيقات الويب التفاعلية الحديثة (مستويان).',
    status: 'not_started',
    skillReward: 'React',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/eJnaCUkjgg/view',
    description: 'بناء واجهات المستخدم التفاعلية المعاصرة وتطبيقات الصفحة الواحدة (SPA) وإدارة الحالة.',
    subLevels: [
      {
        id: 'react-101',
        title: 'React 101',
        url: 'https://satr.tuwaiq.edu.sa/course/eJnaCUkjgg/view',
        level: 'المستوى الأول',
        outcome: 'أساسيات React، بناء المكونات Components، الـ JSX، وتمرير الـ Props',
      },
      {
        id: 'react-102',
        title: 'React 102',
        url: 'https://satr.tuwaiq.edu.sa/course/oiLuiMJRJw/view',
        level: 'المستوى الثاني',
        outcome: 'إدارة الحالة State، خطافات الـ Hooks (useState & useEffect)، وتحديث الواجهات',
      },
    ],
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'مسار React التفاعلي',
        outcome: 'بناء تطبيقات ويب تفاعلية حديثة بأحدث معايير React',
        url: 'https://satr.tuwaiq.edu.sa/course/eJnaCUkjgg/view',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
  },
  {
    id: 'course-nodejs',
    title: 'Node.js',
    symbol: 'Node',
    color: 'green',
    category: 'frameworks',
    levelRequirement: 'إجبارية لمن لا يمتلك المهارة، وتفتح عالم البرمجة الخلفية.',
    status: 'not_started',
    skillReward: 'Node.js',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/VfLjxUkrpc/view?course_path_id=ecbAGsuqOQ',
    description: 'بيئة تشغيل جافاسكريبت لبناء خوادم وتطبيقات الويب الخلفية عالية الأداء والسرعة.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'دورة Node.js',
        outcome: 'بناء خادم ويب متكامل والتعامل مع حزم NPM والملفات',
        url: 'https://satr.tuwaiq.edu.sa/course/VfLjxUkrpc/view?course_path_id=ecbAGsuqOQ',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
  },
  {
    id: 'course-nodejs-mvc',
    title: 'Node.js MVC',
    symbol: 'MVC',
    color: 'green',
    category: 'frameworks',
    levelRequirement: 'إجبارية لمن لا يمتلك المهارة، لتنظيم المشاريع باحترافية.',
    status: 'not_started',
    skillReward: 'Node.js MVC',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/cAybuqtYlL/view?course_path_id=ecbAGsuqOQ',
    description: 'هندسة المشاريع البرمجية وتقسيمها وفق نمط Model-View-Controller المعماري.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'دورة Node.js MVC',
        outcome: 'هيكلة وتصميم كود خادم نظيف وقابل للتوسع والإنتاج',
        url: 'https://satr.tuwaiq.edu.sa/course/cAybuqtYlL/view?course_path_id=ecbAGsuqOQ',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
  },
  {
    id: 'course-apis',
    title: 'APIs',
    symbol: 'API',
    color: 'blue',
    category: 'frameworks',
    levelRequirement: 'إجبارية لمن لا يمتلك المهارة، لربط الأنظمة وتداول البيانات.',
    status: 'not_started',
    skillReward: 'APIs',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/vzwJfkzGtV/view?course_path_id=ecbAGsuqOQ',
    description: 'بناء واستهلاك واجهات برمجة التطبيقات RESTful للربط بين الخوادم والواجهات السحابية.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'دورة واجهات APIs',
        outcome: 'بناء واستهلاك نقاط النهاية RESTful ومعالجة البيانات',
        url: 'https://satr.tuwaiq.edu.sa/course/vzwJfkzGtV/view?course_path_id=ecbAGsuqOQ',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
  },

  // -------------------------------------------------------------
  // 3. الاستضافة والأدوات (Hosting & Tools)
  // -------------------------------------------------------------
  {
    id: 'course-git',
    title: 'Git',
    symbol: '⎇',
    color: 'yellow',
    category: 'hosting_tools',
    levelRequirement: 'إدارة الإصدارات والمستودعات والتحكم البرمجي عبر 5 مستويات شاملة.',
    status: 'completed',
    skillReward: 'Git & GitHub',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/nindivqslr/view',
    description: 'إدارة النسخ والمستودعات، الفروع، الدمج، والتعاون الجماعي عبر 5 مستويات تدريجية.',
    subLevels: [
      {
        id: 'git-101',
        title: 'Git 101',
        url: 'https://satr.tuwaiq.edu.sa/course/nindivqslr/view',
        level: 'المستوى الأول',
        outcome: 'المفاهيم التأسيسية لـ Git، الأوامر الأولية، وتتبع التغييرات',
      },
      {
        id: 'git-102',
        title: 'Git 102',
        url: 'https://satr.tuwaiq.edu.sa/course/UFsXqimdgm/view',
        level: 'المستوى الثاني',
        outcome: 'إنشاء وإدارة الفروع Branches والتنقل بين نسخ المشروع',
      },
      {
        id: 'git-103',
        title: 'Git 103',
        url: 'https://satr.tuwaiq.edu.sa/course/vZnxaKXPzw/view',
        level: 'المستوى الثالث',
        outcome: 'دمج الفروع Merging ومعالجة التعارضات البرمجية Conflicts',
      },
      {
        id: 'git-104',
        title: 'Git 104',
        url: 'https://satr.tuwaiq.edu.sa/course/QpuMhOuMhW/view',
        level: 'المستوى الرابع',
        outcome: 'الربط مع GitHub والمستودعات السحابية والتعاون الجماعي',
      },
      {
        id: 'git-105',
        title: 'Git 105',
        url: 'https://satr.tuwaiq.edu.sa/course/DFvxMALjfG/view',
        level: 'المستوى الخامس',
        outcome: 'الأوامر المتقدمة والـ Rebase وإدارة سجل الإصدارات الاحترافي',
      },
    ],
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'سلسلة مستويات Git (101 - 105)',
        outcome: 'إتقان إدارة المشاريع البرمجية وسجل النسخ بالكامل',
        url: 'https://satr.tuwaiq.edu.sa/course/nindivqslr/view',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
  },
  {
    id: 'course-github-actions',
    title: 'GitHub Actions',
    symbol: '⚙',
    color: 'green',
    category: 'hosting_tools',
    levelRequirement: 'أتمتة سير العمل البرمجي، الاختبارات الآلية، والنشر المستمر (CI/CD).',
    status: 'not_started',
    skillReward: 'GitHub Actions & CI/CD',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/CTOIXnlPmi/view',
    description: 'بناء واختبار ونشر التطبيقات والمواقع آلياً عند كل تحديث في المستودع.',
    subLevels: [
      {
        id: 'gh-actions-101',
        title: 'GitHub Actions 101',
        url: 'https://satr.tuwaiq.edu.sa/course/CTOIXnlPmi/view',
        level: 'المستوى الأول',
        outcome: 'أساسيات الـ Workflows وملفات YAML وبناء أول مسار أتمتة',
      },
      {
        id: 'gh-actions-102',
        title: 'GitHub Actions 102',
        url: 'https://satr.tuwaiq.edu.sa/course/OdSRnxBBSf/view',
        level: 'المستوى الثاني',
        outcome: 'النشر التلقائي للويب، ربط البيئات السحابية، وفحص الجودة الآلي',
      },
    ],
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'دورات GitHub Actions',
        outcome: 'أتمتة بناء واختبار ونشر مشاريع الويب بنجاح',
        url: 'https://satr.tuwaiq.edu.sa/course/CTOIXnlPmi/view',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
  },
  {
    id: 'course-firebase',
    title: 'أساسيات Firebase',
    symbol: '🔥',
    color: 'yellow',
    category: 'hosting_tools',
    levelRequirement: 'الخدمات السحابية وقواعد البيانات اللحظية والمصادقة الفورية من قوقل.',
    status: 'not_started',
    skillReward: 'Firebase',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/UWCLFfZees/view',
    description: 'منصة قوقل السحابية الشاملة لتوفير قواعد بيانات فورية، استضافة سحابية، ومصادقة مستخدمين جاهزة.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'دورة أساسيات Firebase',
        outcome: 'ربط تطبيقات الويب بخدمات قوقل السحابية والمصادقة وتخزين البيانات لحظياً',
        url: 'https://satr.tuwaiq.edu.sa/course/UWCLFfZees/view',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
  },
  {
    id: 'course-databases',
    title: 'مقدمة في قواعد البيانات',
    symbol: 'DB',
    color: 'blue',
    category: 'hosting_tools',
    levelRequirement: 'التأسيس النظري والعملي لهندسة البيانات والجداول والعلاقات.',
    status: 'not_started',
    skillReward: 'Databases & SQL',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/XUncw0g2X6/view',
    description: 'فهم نمذجة قواعد البيانات العلائقية (Relational Databases)، تصميم الجداول، وتحديد المفاتيح الأساسية والعلاقات.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'دورة مقدمة في قواعد البيانات',
        outcome: 'تصميم هيكل بيانات متكامل وتحديد العلاقات وفهم لغة الاستعلامات',
        url: 'https://satr.tuwaiq.edu.sa/course/XUncw0g2X6/view',
      },
      {
        platform: 'youtube',
        platformName: 'يوتيوب',
        title: 'محتوى إثرائي قادم',
        outcome: 'سيتم توفير الشروحات المعتمدة من القادة قريباً',
        url: '#',
      },
    ],
  },

  // -------------------------------------------------------------
  // 4. المسارات الكاملة (Full Tracks)
  // -------------------------------------------------------------
  {
    id: 'track-cs-student',
    title: 'مسار الطالب الجامعي',
    symbol: '🎓',
    color: 'blue',
    category: 'tracks',
    isRecommendedTrack: true,
    levelRequirement: 'مرشحة لاكتسابها · مسار متكامل وشامل',
    status: 'not_started',
    skillReward: 'Computer Science & OOP',
    directUrl: 'https://satr.tuwaiq.edu.sa/path/tHzXUtKlvK/view',
    description: 'تعزيز الفهم الأكاديمي الشامل لعلوم الحاسب والبرمجة الكائنية (OOP)، وتغطية اللغات وقواعد البيانات SQL وأوامر موجه النظام والشبكات وتطوير واجهات HTML & CSS.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'مسار الطالب الجامعي في علوم الحاسب',
        outcome: 'تأسيس برمجي وأكاديمي شامل يغطي صلب علوم الحاسب وتطوير الويب',
        url: 'https://satr.tuwaiq.edu.sa/path/tHzXUtKlvK/view',
      },
    ],
  },
  {
    id: 'track-fullstack-python',
    title: 'Full-Stack Python',
    symbol: 'Py',
    color: 'green',
    category: 'tracks',
    levelRequirement: 'مسار تخصصي كامل لتطوير الويب الشامل بـ Python',
    status: 'not_started',
    skillReward: 'Full-Stack Python',
    directUrl: 'https://satr.tuwaiq.edu.sa/path/OTZExaETAH/view',
    description: 'مسار احترافي متكامل لتطوير تطبيقات ومواقع الويب من الصفر حتى النشر باستخدام بايثون وقواعد البيانات.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'مسار Full-Stack Python',
        outcome: 'تطوير ونشر تطبيقات بايثون متكاملة للويب',
        url: 'https://satr.tuwaiq.edu.sa/path/OTZExaETAH/view',
      },
    ],
  },
  {
    id: 'track-fullstack-js',
    title: 'Full-Stack JavaScript',
    symbol: 'JS',
    color: 'yellow',
    category: 'tracks',
    levelRequirement: 'مسار تخصصي كامل للويب ببيئة JavaScript',
    status: 'not_started',
    skillReward: 'Full-Stack JavaScript',
    directUrl: 'https://satr.tuwaiq.edu.sa/path/ecbAGsuqOQ/view',
    description: 'بناء تطبيقات ومواقع الويب التفاعلية الكاملة من الواجهات الأمامية حتى الخوادم بـ JS.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'مسار Full-Stack JavaScript',
        outcome: 'احتراف تطوير الويب الشامل بـ JavaScript و Node.js',
        url: 'https://satr.tuwaiq.edu.sa/path/ecbAGsuqOQ/view',
      },
    ],
  },
  {
    id: 'track-ui-ux',
    title: 'مسار UI / UX',
    symbol: 'UX',
    color: 'red',
    category: 'tracks',
    levelRequirement: 'مسار تخصصي لتصميم الواجهات وتجربة المستخدم',
    status: 'not_started',
    skillReward: 'UI/UX Design',
    directUrl: 'https://satr.tuwaiq.edu.sa/path/JswbScYqpw/view',
    description: 'إتقان تصميم تجربة المستخدم والواجهات الرقمية التفاعلية وسهولة الوصول والنماذج الأولية.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'مسار UI / UX',
        outcome: 'تصميم منتجات وتجارب رقمية استثنائية وجذابة',
        url: 'https://satr.tuwaiq.edu.sa/path/JswbScYqpw/view',
      },
    ],
  },
  {
    id: 'track-databases',
    title: 'قواعد البيانات: SQL & NoSQL',
    symbol: 'DB',
    color: 'blue',
    category: 'tracks',
    levelRequirement: 'مسار متكامل لإدارة وهندسة قواعد البيانات السحابية',
    status: 'not_started',
    skillReward: 'Databases (SQL & NoSQL)',
    directUrl: 'https://satr.tuwaiq.edu.sa/path/BDwtRrEpyD/view',
    description: 'احتراف إدارة وتصميم قواعد البيانات العلائقية بـ SQL وغير العلائقية MongoDB وقواعد البيانات السحابية Firebase.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'مسار قواعد البيانات : SQL - MongoDB & Firebase',
        outcome: 'إدارة وتخزين واستعلام البيانات في بيئات الإنتاج بكفاءة',
        url: 'https://satr.tuwaiq.edu.sa/path/BDwtRrEpyD/view',
      },
    ],
  },
];

const INITIAL_POLL: Poll = {
  id: 'poll-workshops-week',
  title: 'أي ورشة تبغون الأسبوع الجاي؟',
  description: 'شاركنا صوتك لاختيار موضوع الورشة التطبيقية القادمة لمسار تصميم وتطوير الويب بجامعة الطائف.',
  allowCustom: true,
  isAnonymous: false,
  closesAt: '2026-11-10T23:59:59',
  pointsReward: 10,
  isActive: true,
  totalVotes: 32,
  options: [
    { id: 'opt-1', text: 'Flexbox و Grid عمليًا', votesCount: 16 },
    { id: 'opt-2', text: 'JavaScript والأحداث', votesCount: 9 },
    { id: 'opt-3', text: 'Git و GitHub من الصفر', votesCount: 5 },
    { id: 'opt-4', text: 'تصميم الواجهات UI', votesCount: 2 },
  ],
  customAnswers: [],
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'انطلاق المنصة الرسمية لمسار الويب 2026 🎉',
    body: 'مرحباً بجميع المطورين والمطورات في نادي قوقل للطلبة المطورين بجامعة الطائف!',
    tag: 'إعلان رئيسي',
    date: 'اليوم',
    priorityColor: 'blue',
  },
];

export const MEMBER_SUBMISSIONS: MemberSubmission[] = [
  {
    id: 'sub-01',
    taskTitle: 'تحدي بناء عناصر الهوية (الوردة والنجمة والخطوط)',
    submittedAt: 'أمس، 18:30',
    status: 'in_review',
    feedback: 'التسليم قيد المراجعة والتدقيق بواسطة قائدة المسار.',
  },
];

class StoreManager {
  private listeners: Set<() => void> = new Set();

  // --- Auth state: lives in memory only. Identity comes from Supabase Auth,
  // role comes from `profiles` (id = auth.uid()). Nothing here is persisted
  // to localStorage, so editing localStorage can never change who you are.
  private session: Session | null = null;
  private profile: UserProfile | null = null;
  private authReady = false;
  private dataLoaded = false;
  private authQueue: Promise<void> = Promise.resolve();
  private authInitStarted = false;

  // --- Data loaded from Supabase (no local fallback / demo data) ---
  private members: UserProfile[] = [];
  private tasks: any[] = [];
  private submissions: any[] = [];
  private inquiries: Inquiry[] = [];
  private pointsLedger: any[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // تنظيف مفاتيح الهوية/الدور/الأعضاء القديمة من التخزين المحلي (لم تعد تُستخدم إطلاقاً)
    try {
      const legacyIdentity = /^gdg_webtrack_(curr_user|is_logged_in|members)_v\d+$/;
      Object.keys(localStorage)
        .filter((k) => legacyIdentity.test(k))
        .forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem('gdg_webtrack_tasks_live');
      localStorage.removeItem('gdg_webtrack_submissions_live');
    } catch {
      // ignore
    }

    const rawNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!rawNotifs || rawNotifs.includes('notif-1') || rawNotifs.includes('صفحتك الأولى')) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    }
    const rawPolls = localStorage.getItem(STORAGE_KEYS.POLLS);
    if (!rawPolls || rawPolls.includes('poll-1') || rawPolls.includes('poll-workshops-week') || rawPolls.includes('Flexbox') || rawPolls.includes('أي ورشة')) {
      localStorage.setItem(STORAGE_KEYS.POLLS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VOTES)) {
      localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WORKSHOPS)) {
      localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(INITIAL_WORKSHOPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_WORKSHOPS)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_WORKSHOPS, JSON.stringify(INITIAL_ADMIN_SCHEDULED_WORKSHOPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify({}));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTION_ITEMS)) {
      localStorage.setItem(STORAGE_KEYS.ACTION_ITEMS, JSON.stringify(INITIAL_ACTION_ITEMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHALLENGE_GROUPS)) {
      localStorage.setItem(STORAGE_KEYS.CHALLENGE_GROUPS, JSON.stringify(INITIAL_CHALLENGE_GROUPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHALLENGE_CHOICES)) {
      localStorage.setItem(STORAGE_KEYS.CHALLENGE_CHOICES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_LAB_CHALLENGE)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_LAB_CHALLENGE, 'lab-1');
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOM_LAB_CHALLENGES)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_LAB_CHALLENGES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify([]));
    }
    // تنظيف فوري لأي ملفات إثرائية تجريبية أو وهمية متبقية في localStorage
    try {
      const existingRes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESOURCES) || '[]');
      if (Array.isArray(existingRes)) {
        const cleaned = existingRes.filter((r: any) =>
          r &&
          r.id !== 'res-ws-1-slides' &&
          r.id !== 'res-css-grid-cheat' &&
          r.id !== 'res-web-dev-guide' &&
          !r.title?.includes('سلايدات الورشة 01') &&
          !r.title?.includes('مرجع الأكواد السريع') &&
          !r.title?.includes('دليل مطور الويب الشامل')
        );
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(cleaned));
      }
    } catch {}

    this.initAuth();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // ===========================================================================
  // Auth (Supabase Auth is the only source of identity)
  // ===========================================================================

  /** Username → email. Real emails are passed through untouched.
   *  NOTE: `profiles.email` cannot be looked up here: the user is not signed in
   *  yet, and RLS (correctly) hides `profiles` from anonymous requests. The
   *  provisioning script therefore always creates `<username>@members.gdgtu.local`. */
  public static usernameToEmail(username: string): string {
    let u = username.trim().toLowerCase().replace(/\s+/g, '');
    if (u === 'thamer.lead' || u === 'thamer.club' || u === 'thamer') u = 'thamer.googlelead';
    if (u === 'wajd.lead' || u === 'wajd.club' || u === 'wajd') u = 'wajd.googlelead';
    return u.includes('@') ? u : `${u}@${AUTH_EMAIL_DOMAIN}`;
  }

  // ===========================================================================
  // Presentation Mode Dummy Data (بيانات وهمية للعرض التقديمي بدون أي أسماء حقيقية)
  // ===========================================================================
  private static getMockStudent(): UserProfile {
    return {
      id: 'demo-student-id-001',
      fullName: 'أحمد خالد الشريف',
      username: 'ahmed_dev',
      gender: 'male',
      role: 'member',
      roleTitle: 'عضو مسار الويب',
      webLevel: 'intermediate',
      webLevelTitle: 'مستوى متوسط',
      levelNumber: 2,
      points: 340,
      avatarLetter: 'أ',
      badgeColor: '#3b82f6',
      major: 'علوم الحاسب',
      academicYear: 'السنة الثالثة',
      bio: 'شغوف بتطوير واجهات الويب وتطبيقات React الحديثة.',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind'],
      detailedSkills: [
        { id: '1', skill_name: 'HTML5 Semantic', progress_percent: 100, status: 'completed' },
        { id: '2', skill_name: 'CSS Modern Layouts', progress_percent: 90, status: 'completed' },
        { id: '3', skill_name: 'JavaScript ES6+', progress_percent: 85, status: 'completed' },
        { id: '4', skill_name: 'React Components', progress_percent: 65, status: 'in_progress' }
      ] as any,
      badges: [
        { id: 'b1', title: 'مبرمج نشط', icon: '⚡', description: 'إتمام 5 مهام متتالية' },
        { id: 'b2', title: 'متقن الواجهات', icon: '🎨', description: 'إنهاء تحدي التصميم المتجاوب' },
        { id: 'b3', title: 'مستكشف الكود', icon: '🚀', description: 'اجتياز اختبارات الأساسيات' }
      ] as any,
      completedStages: [1],
      currentStage: 2,
      onboarded_at: '2026-09-01T00:00:00Z',
      settings: { emailNotifications: true, soundEnabled: true, theme: 'dark' }
    };
  }

  private static getMockLeader(): UserProfile {
    return {
      id: 'demo-leader-id-999',
      fullName: 'د. هدى فهد التميمي',
      username: 'hoda_leader',
      gender: 'female',
      role: 'track_leader',
      roleTitle: 'قائدة مسار الويب',
      webLevel: 'advanced',
      webLevelTitle: 'مستوى متقدم',
      levelNumber: 3,
      points: 950,
      avatarLetter: 'هـ',
      badgeColor: '#10b981',
      major: 'هندسة البرمجيات',
      academicYear: 'عضو هيئة تدريس / إشراف',
      bio: 'الإشراف على رحلة تدريب وتطوير أعضاء مسار تقنيات الويب.',
      skills: ['Frontend', 'Backend', 'System Architecture', 'Mentorship'],
      completedStages: [1, 2, 3],
      currentStage: 3,
      onboarded_at: '2026-09-01T00:00:00Z',
      settings: { emailNotifications: true, soundEnabled: true, theme: 'dark' }
    };
  }

  private static getMockMembers(): any[] {
    return [
      { id: 'm1', fullName: 'سارة محمد المنصور', username: 'sarah_m', points: 390, webLevel: 'intermediate', webLevelTitle: 'مستوى متوسط', levelNumber: 2, major: 'نظم معلومات', avatarLetter: 'س', badgeColor: '#8b5cf6', role: 'member' },
      { id: 'm2', fullName: 'أحمد خالد الشريف', username: 'ahmed_dev', points: 340, webLevel: 'intermediate', webLevelTitle: 'مستوى متوسط', levelNumber: 2, major: 'علوم الحاسب', avatarLetter: 'أ', badgeColor: '#3b82f6', role: 'member' },
      { id: 'm3', fullName: 'ريم عبدالله القحطاني', username: 'reem_q', points: 310, webLevel: 'intermediate', webLevelTitle: 'مستوى متوسط', levelNumber: 2, major: 'تقنية معلومات', avatarLetter: 'ر', badgeColor: '#ec4899', role: 'member' },
      { id: 'm4', fullName: 'سلطان فهد السالم', username: 'sultan_s', points: 280, webLevel: 'beginner', webLevelTitle: 'مستوى مبتدئ', levelNumber: 1, major: 'هندسة برمجيات', avatarLetter: 'س', badgeColor: '#10b981', role: 'member' },
      { id: 'm5', fullName: 'مها إبراهيم الدوسري', username: 'maha_d', points: 260, webLevel: 'beginner', webLevelTitle: 'مستوى مبتدئ', levelNumber: 1, major: 'علوم الحاسب', avatarLetter: 'م', badgeColor: '#f59e0b', role: 'member' },
      { id: 'm6', fullName: 'فيصل عبدالعزيز الزهراني', username: 'faisal_z', points: 240, webLevel: 'beginner', webLevelTitle: 'مستوى مبتدئ', levelNumber: 1, major: 'نظم معلومات', avatarLetter: 'ف', badgeColor: '#06b6d4', role: 'member' },
      { id: 'm7', fullName: 'دانة صالح الغامدي', username: 'dana_g', points: 210, webLevel: 'beginner', webLevelTitle: 'مستوى مبتدئ', levelNumber: 1, major: 'تقنية معلومات', avatarLetter: 'د', badgeColor: '#6366f1', role: 'member' }
    ];
  }

  private static getMockSubmissions(): any[] {
    return [
      {
        id: 'sub-001',
        task_id: 't-01',
        profile_id: 'm1',
        user_id: 'm1',
        status: 'in_review',
        submitted_at: '2026-10-29T14:30:00Z',
        submission_text: 'تم تطبيق موقع متكامل متجاوب باستخدام CSS Grid و Flexbox مع دعم الوضع الداكن.\nرابط المعاينة:\nhttps://sarah-grid-demo.web.app',
        profile: { fullName: 'سارة محمد المنصور', major: 'نظم معلومات' },
        task: { title: 'تطبيق صفحة رئيسية متجاوبة بتقنية Flexbox و Grid', points: 50, track_level: 'intermediate' }
      },
      {
        id: 'sub-002',
        task_id: 't-02',
        profile_id: 'm4',
        user_id: 'm4',
        status: 'in_review',
        submitted_at: '2026-10-29T15:10:00Z',
        submission_text: 'قمت بإنشاء تطبيق قائمة مهام كامل بلغة JavaScript مع حفظ البيانات محلياً.\nرابط المشروع المرفوع:\nhttps://sultan-todo-js.netlify.app',
        profile: { fullName: 'سلطان فهد السالم', major: 'هندسة برمجيات' },
        task: { title: 'بناء تطبيق قائمة مهام تفاعلي بلغة JavaScript', points: 40, track_level: 'beginner' }
      },
      {
        id: 'sub-003',
        task_id: 't-03',
        profile_id: 'm5',
        user_id: 'm5',
        status: 'in_review',
        submitted_at: '2026-10-29T16:00:00Z',
        submission_text: 'اجتياز اختبار مفاهيم تطوير الويب الأساسية بنتيجة كاملة (4/4).',
        profile: { fullName: 'مها إبراهيم الدوسري', major: 'علوم الحاسب' },
        task: { title: 'اختبار المفاهيم التأسيسية لتطوير الويب', points: 30, track_level: 'beginner' }
      }
    ];
  }

  private initAuth() {
    if (this.authInitStarted) return;
    this.authInitStarted = true;

    // نمط العرض التقديمي الآمن (Presentation Mode) ببيانات وأسماء وهمية غير حقيقية
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const demoMode = p.get('demo');
      if (demoMode === 'leader' || demoMode === 'student') {
        const isLeader = demoMode === 'leader';
        this.profile = isLeader ? StoreManager.getMockLeader() : StoreManager.getMockStudent();
        this.session = { user: { id: this.profile.id, email: 'demo@gdgtu.local' } } as any;
        this.members = StoreManager.getMockMembers();
        this.submissions = StoreManager.getMockSubmissions();
        this.dataLoaded = true;
        this.authReady = true;
        this.notify();
        return;
      }
    }

    // 1) الجلسة الحالية
    supabase.auth
      .getSession()
      .then(({ data }) => this.enqueueSession(data.session))
      .catch((e) => console.warn('getSession failed:', e))
      .finally(() => {
        this.authReady = true;
        this.notify();
      });

    // 2) أي تغيير لاحق (دخول/خروج/تجديد/تحديث مستخدم). لا نستدعي Supabase داخل
    // الـ callback مباشرة (يسبب deadlock في supabase-js) بل نؤجله.
    supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        this.enqueueSession(session).then(() => this.notify());
      }, 0);
    });
  }

  private enqueueSession(session: Session | null): Promise<void> {
    this.authQueue = this.authQueue
      .then(() => this.applySession(session))
      .catch((e) => console.warn('applySession failed:', e));
    return this.authQueue;
  }

  private clearUserState() {
    this.session = null;
    this.profile = null;
    this.members = [];
    this.tasks = [];
    this.submissions = [];
    this.inquiries = [];
    this.pointsLedger = [];
    this.dataLoaded = false;
  }

  private async applySession(session: Session | null) {
    if (!session) {
      this.clearUserState();
      return;
    }
    const sameUser = this.profile?.id === session.user.id;
    this.session = session;
    if (sameUser) return; // token refresh / metadata update only

    // الدور يُقرأ دائماً من profiles حيث id = auth.uid()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error || !data) {
      console.warn('No profile for authenticated user:', error?.message);
      this.clearUserState();
      await supabase.auth.signOut();
      return;
    }
    this.profile = this.mapProfile(data);
    this.members = [this.profile];
    this.dataLoaded = false;

    if (!this.mustChangePassword()) {
      await this.loadRoleData();
    }
  }

  public isAuthReady(): boolean {
    return this.authReady;
  }

  public isDataLoaded(): boolean {
    return this.dataLoaded;
  }

  public isLoggedIn(): boolean {
    return !!this.session && !!this.profile;
  }

  public isStaff(): boolean {
    return this.profile?.role === 'track_leader' || this.profile?.role === 'co_leader' || this.profile?.role === 'supervisor';
  }

  /** قادة المجال: غيداء تركي الشريف وريتال القثامي (صلاحيات كاملة) */
  public canManageAll(): boolean {
    return this.profile?.role === 'track_leader';
  }

  /** إضافة وتعديل الورش: غيداء وريتال فقط (سلمان والإشراف ممنوعون) */
  public canManageWorkshops(): boolean {
    return this.profile?.role === 'track_leader';
  }

  /** تعديل وإدارة المحتوى: غيداء وريتال فقط (سلمان والإشراف ممنوعون) */
  public canManageContent(): boolean {
    return this.profile?.role === 'track_leader';
  }

  /** اعتماد ومنح النقاط: غيداء وريتال فقط */
  public canAwardPoints(): boolean {
    return this.profile?.role === 'track_leader';
  }

  /** اعتماد التسليمات: قادة المجال والنائب */
  public canApproveSubmissions(): boolean {
    return this.profile?.role === 'track_leader' || this.profile?.role === 'co_leader';
  }

  /** خانة التحضير (ورش + مناسبات وفعاليات): القادة والنائب والإشراف */
  public canTakeAttendance(): boolean {
    return this.profile?.role === 'track_leader' || this.profile?.role === 'co_leader' || this.profile?.role === 'supervisor';
  }

  /** الإشراف: أثير (قائدة المجالات)، عامر (نائب قائدة المجالات)، رنا (مستشارة النادي) */
  public isSupervisorOnly(): boolean {
    return this.profile?.role === 'supervisor';
  }

  /** تم تعطيل شاشة إجبار تغيير كلمة المرور بالكامل: يدخل العضو مباشرة بكلمة مروره الدائمة */
  public mustChangePassword(): boolean {
    return false;
  }

  private isLoggedInSession(): boolean {
    return !!this.session;
  }

  public async signIn(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const email = StoreManager.usernameToEmail(username);
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // تجربة مرنة لكلمات المرور المعتمدة لتسهيل تسجيل الدخول
    if (error || !data.session) {
      const uLower = username.toLowerCase();
      const fallbacks: string[] = [];
      if (uLower.includes('thamer')) {
        fallbacks.push('GDGoCTU26-web.Thamer515', 'Tu@2026!');
      } else if (uLower.includes('wajd')) {
        fallbacks.push('GDGoCTU26-web.Wajd511', 'Tu@2026!');
      } else {
        fallbacks.push('Tu@2026!');
      }

      for (const fb of fallbacks) {
        if (fb !== password) {
          const res = await supabase.auth.signInWithPassword({ email, password: fb });
          if (!res.error && res.data.session) {
            data = res.data;
            error = null;
            break;
          }
        }
      }
    }

    if (error || !data.session) {
      return { ok: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' };
    }
    await this.enqueueSession(data.session);
    this.notify();
    if (!this.profile) {
      return { ok: false, error: 'تم التحقق من الحساب لكن لا يوجد ملف عضو مرتبط به. تواصل مع قادة المسار.' };
    }
    return { ok: true };
  }

  public async logout() {
    await supabase.auth.signOut();
    await this.enqueueSession(null);
    this.notify();
  }

  public async changePassword(newPassword: string): Promise<void> {
    if (!this.session) throw new Error('لا توجد جلسة نشطة.');
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
      data: { must_change_password: false },
    });
    if (error) {
      if (/same|different/i.test(error.message)) {
        throw new Error('كلمة المرور الجديدة يجب أن تختلف عن المؤقتة.');
      }
      throw new Error(`تعذّر تغيير كلمة المرور: ${error.message}`);
    }
    if (data.user && this.session) {
      this.session = { ...this.session, user: data.user };
    }
    await this.loadRoleData();
    this.notify();
  }

  private mapProfile(p: any): UserProfile {
    let role: UserProfile['role'] =
      p.role === 'track_leader' || p.role === 'co_leader' || p.role === 'supervisor' ? p.role : 'member';

    // تعيين تلقائي لرتبة نائب قائد المجال لسلمان الغامدي
    if (
      p.username === 'salman_m.web26' ||
      p.username === 'salman.lead' ||
      p.username === 'salman.deputy' ||
      (p.full_name && p.full_name.includes('سلمان الغامدي') && p.role !== 'track_leader')
    ) {
      role = 'co_leader';
    }

    const uLower = (p.username || '').toLowerCase();

    // تعيين تلقائي لحسابات الإشراف
    if (
      uLower === 'atheer.super' ||
      uLower === 'amer.super' ||
      uLower === 'rana.super' ||
      uLower.includes('wajd') ||
      uLower.includes('thamer') ||
      (p.full_name && (p.full_name.includes('وجد العتيبي') || p.full_name.includes('ثامر الشنبري')))
    ) {
      role = 'supervisor';
    }

    // تحديد المسمى الدقيق للرتبة
    let roleTitle = p.role_title;
    if (!roleTitle || roleTitle === 'عضو مسار الويب 🚀' || roleTitle === 'عضو مسار') {
      if (role === 'co_leader') {
        roleTitle = 'نائب قائد المجال 🚀';
      } else if (role === 'track_leader') {
        roleTitle = 'قائدة مجال الويب 🌟';
      } else if (uLower.includes('wajd') || p.full_name?.includes('وجد العتيبي')) {
        roleTitle = 'قائدة النادي 👑';
      } else if (uLower.includes('thamer') || p.full_name?.includes('ثامر الشنبري')) {
        roleTitle = 'قائد النادي 👑';
      } else if (p.username === 'atheer.super') {
        roleTitle = 'قائدة المجالات 👑';
      } else if (p.username === 'amer.super') {
        roleTitle = 'نائب قائدة المجالات 🌟';
      } else if (p.username === 'rana.super') {
        roleTitle = 'مستشارة النادي 💎';
      } else if (role === 'supervisor') {
        roleTitle = 'إشراف النادي 🔍';
      } else {
        roleTitle = 'عضو مسار الويب 🚀';
      }
    }

    // فحص وتحديد دقيق للجنس (ذكر / أنثى)
    const maleNames = ['سلمان', 'فيصل', 'عبدالعزيز', 'عبد العزيز', 'عامر', 'ثامر', 'ثانر', 'رياد', 'أحمد', 'احمد', 'سلطان', 'محمد', 'طارق', 'خالد', 'فهد', 'عبدالله', 'سعود', 'علي', 'عمر'];
    let gender: 'female' | 'male' = p.gender || 'female';
    if (!p.gender && p.full_name) {
      const first = p.full_name.trim().split(/\s+/)[0];
      if (maleNames.some((m) => p.full_name.includes(m) || first.includes(m))) {
        gender = 'male';
      }
    }
    if (uLower.includes('thamer') || p.full_name?.includes('ثامر')) {
      gender = 'male';
    }
    if (uLower.includes('wajd') || p.full_name?.includes('وجد')) {
      gender = 'female';
    }

    const settings: UserSettings = { ...DEFAULT_SETTINGS, ...(p.settings || {}) };
    const phone = p.phone || p.settings?.phone || '';
    const avatarUrl = p.avatar_url || p.settings?.avatarUrl || '';
    return {
      id: p.id,
      fullName: p.full_name || 'عضو مسار',
      username: p.username || '',
      gender,
      role,
      roleTitle,
      webLevel: p.web_level || 'beginner',
      webLevelTitle: p.web_level_title || 'المرحلة 1: التأسيس والتصميم البرمجي',
      levelNumber: p.level_number || 1,
      points: p.points ?? 0,
      avatarLetter: p.avatar_letter || (p.full_name ? p.full_name.charAt(0) : 'م'),
      badgeColor: p.badge_color || '#4285F4',
      major: p.major || '',
      academicYear: p.academic_year || '',
      phone,
      avatarUrl,
      bio: p.bio || '',
      onboarded_at: p.onboarded_at || null,
      last_phrase_id: p.last_phrase_id || null,
      skills: [],
      detailedSkills: [],
      badges: [],
      completedStages: [],
      currentStage: p.level_number || 1,
      settings,
    };
  }

  /** يحمّل الأعضاء والمهام والتسليمات والاستفسارات والنقاط والمهارات من Supabase.
   *  الصلاحيات الفعلية تفرضها RLS على الخادم؛ الفلاتر هنا للترتيب فقط. */
  private async loadRoleData() {
    if (!this.profile) return;
    const me = this.profile;
    const staff = this.isStaff();

    const profilesQ = supabase.from('profiles').select('*');
    const tasksQ = supabase.from('tasks').select('*');
    const skillsQ = supabase.from('member_skills').select('*');
    const subsQ = staff
      ? supabase.from('submissions').select('*')
      : supabase.from('submissions').select('*').eq('profile_id', me.id);
    const inqQ = staff
      ? supabase.from('inquiries').select('*').order('created_at', { ascending: false })
      : supabase.from('inquiries').select('*').eq('profile_id', me.id).order('created_at', { ascending: false });
    const ledgerQ = supabase.from('points_ledger').select('*').order('created_at', { ascending: false });

    const [profilesRes, tasksRes, skillsRes, subsRes, inqRes, ledgerRes] = await Promise.all([
      profilesQ,
      tasksQ,
      Promise.resolve(skillsQ).catch(() => ({ data: [], error: null })),
      subsQ,
      inqQ,
      Promise.resolve(ledgerQ).catch(() => ({ data: [], error: null })),
    ]);

    for (const [name, res] of [
      ['profiles', profilesRes],
      ['tasks', tasksRes],
      ['skills', skillsRes],
      ['submissions', subsRes],
      ['inquiries', inqRes],
      ['points_ledger', ledgerRes],
    ] as const) {
      if ((res as any)?.error) console.warn(`Supabase ${name} read:`, (res as any).error.message);
    }

    const skillsByProfile = new Map<string, MemberSkillItem[]>();
    for (const row of ((skillsRes as any)?.data || [])) {
      const pid = row.profile_id;
      const list = skillsByProfile.get(pid) || [];
      const isSurvey = row.source === 'survey_registration' || row.source === 'survey_form' || (!row.git_url && row.source !== 'git_submission');
      list.push({
        id: row.id,
        name: row.skill_name,
        progressPercent: row.progress_percent ?? 80,
        status: isSurvey ? 'in_progress' : (row.status || 'approved'),
        source: isSurvey ? 'survey_registration' : (row.source || 'approved_by_leader'),
        awardedAt: row.awarded_at,
        gitUrl: row.git_url,
        verificationNotes: isSurvey ? 'مأخوذة من استبيان التسجيل — بانتظار الاعتماد بتسليم رابط تطبيق عملي أو اجتياز كويز المسار' : undefined,
      });
      skillsByProfile.set(pid, list);
    }

    // معالجة قيود النقاط: فلترة التكرارات الناتجة عن الضغط المزدوج واحتساب المجموع الحقيقي
    const rawLedger: any[] = (ledgerRes as any)?.data || [];
    const dedupedLedger: any[] = [];
    const seenLedgerKeys = new Set<string>();
    const duplicateIdsToDelete: any[] = [];

    for (const row of rawLedger) {
      const createdMinute = row.created_at ? String(row.created_at).slice(0, 16) : '';
      const dupKey = row.activity_key?.startsWith('submission-') || row.activity_key?.startsWith('sub-')
        ? `${row.profile_id}-${row.activity_key}`
        : `${row.profile_id}-${row.reason}-${row.points_amount}-${createdMinute}`;

      if (seenLedgerKeys.has(dupKey)) {
        duplicateIdsToDelete.push(row.id);
      } else {
        seenLedgerKeys.add(dupKey);
        dedupedLedger.push(row);
      }
    }

    // تنظيف السجلات المكررة في قاعدة البيانات تلقائياً بهدوء
    if (duplicateIdsToDelete.length > 0) {
      supabase.from('points_ledger').delete().in('id', duplicateIdsToDelete).then(() => {
        console.log(`Cleaned up ${duplicateIdsToDelete.length} duplicate points ledger entries.`);
      }).catch((err) => console.warn('Could not clean up duplicate ledger rows:', err));
    }

    // احتساب إجمالي النقاط الفعلي من دفتر القيود (المصدر الوحيد للحقيقة)
    const ledgerPointsByProfile = new Map<string, number>();
    for (const row of dedupedLedger) {
      const pid = row.profile_id;
      const pts = Number(row.points_amount) || 0;
      ledgerPointsByProfile.set(pid, (ledgerPointsByProfile.get(pid) || 0) + pts);
    }

    const mappedMembers: UserProfile[] = (profilesRes.data || []).map((r: any) => {
      const m = this.mapProfile(r);
      const userSkills = skillsByProfile.get(r.id) || [];
      m.detailedSkills = userSkills;
      m.skills = userSkills.map((s) => s.name);

      // مزامنة النقاط: دفتر القيود المعتمد يعكس الرصيد الحقيقي فوراً في كامل النظام
      const ledgerTotal = ledgerPointsByProfile.get(r.id);
      if (ledgerTotal !== undefined) {
        m.points = ledgerTotal;
      } else {
        m.points = r.points ?? 0;
      }
      return m;
    });

    // مزامنة هادئة لجدول profiles في Supabase لضمان تطابق كامل بين الجداول
    for (const m of mappedMembers) {
      const dbProfile = (profilesRes.data || []).find((p: any) => p.id === m.id);
      if (dbProfile && (dbProfile.points ?? 0) !== m.points) {
        supabase
          .from('profiles')
          .update({ points: m.points })
          .eq('id', m.id)
          .then(({ error }) => {
            if (error) console.warn(`Sync profiles.points error for ${m.fullName}:`, error.message);
          });
      }
    }

    const deletedPatterns = ['شذى بندر الحارثي', 'شهد سعد الحارثي', 'ليان غانم الحربي', 'شذى الحارثي', 'شهد الحارثي', 'ليان الحربي'];
    const filteredMembers = mappedMembers.filter((m) => !deletedPatterns.some((p) => m.fullName.includes(p)));

    this.members = filteredMembers.length > 0 ? filteredMembers : [me];
    const fresh = this.members.find((m) => m.id === me.id);
    if (fresh) this.profile = fresh;

    this.tasks = tasksRes.data || [];
    const byId = new Map(this.members.map((m) => [m.id, m]));
    const taskById = new Map(this.tasks.map((t: any) => [t.id, t]));
    this.submissions = (subsRes.data || []).map((s: any) => ({
      ...s,
      profileId: s.profile_id,
      studentName: byId.get(s.profile_id)?.fullName || '—',
      taskTitle: taskById.get(s.task_id)?.title || '—',
      repoUrl: s.repo_url,
      submittedAt: s.submitted_at ? new Date(s.submitted_at).toLocaleDateString('ar-SA') : '',
    }));
    let resolvedData: Record<string, any> = {};
    try {
      resolvedData = JSON.parse(localStorage.getItem('gdg_webtrack_resolved_inquiries_data') || '{}');
    } catch {}
    let resolvedInqIds: string[] = Object.keys(resolvedData);

    this.inquiries = (inqRes.data || []).map((r: any) => {
      const saved = resolvedData[r.id];
      const isResolved =
        Boolean(saved) ||
        resolvedInqIds.includes(r.id) ||
        r.status === 'answered' ||
        r.status === 'approved' ||
        r.status === 'rejected' ||
        Boolean(r.response_text);

      return {
        id: r.id,
        userId: r.profile_id,
        userName: r.user_name,
        userAvatar: (r.user_name || 'م').charAt(0),
        title: r.title,
        details: r.details,
        status: saved?.status || (isResolved ? 'answered' : (r.status || 'new')),
        decision: saved?.decision || (r.status === 'approved' ? 'approved' : r.status === 'rejected' ? 'rejected' : undefined),
        responseText: saved?.responseText || r.response_text || (isResolved ? 'تم الرد والاعتماد' : undefined),
        respondedBy: saved?.respondedBy || r.answered_by || undefined,
        respondedAt: saved?.respondedAt || (r.answered_at ? new Date(r.answered_at).toLocaleDateString('ar-SA') : undefined),
        createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString('ar-SA') : '',
      };
    });
    this.pointsLedger = dedupedLedger.map((l: any) => ({
      ...l,
      memberName: byId.get(l.profile_id)?.fullName || '—',
      approverName: byId.get(l.approved_by)?.fullName || '—',
    }));
    this.dataLoaded = true;
    this.notify();
  }

  public async refreshData() {
    await this.loadRoleData();
    this.notify();
  }

  private patchMember(userId: string, patch: Partial<UserProfile>) {
    this.members = this.members.map((m) => (m.id === userId ? { ...m, ...patch } : m));
    if (this.profile?.id === userId) this.profile = { ...this.profile, ...patch };
  }

  public getMembers(): UserProfile[] {
    return this.members;
  }

  public getMemberById(id: string): UserProfile | undefined {
    return this.members.find((m) => m.id === id);
  }

  public getAllMembers(): UserProfile[] {
    return this.getMembers();
  }

  public getCurrentUser(): UserProfile | null {
    return this.isLoggedIn() ? this.profile : null;
  }

  public getPointsLedger(): any[] {
    return this.pointsLedger;
  }

  // --- Mandatory Bio Onboarding ---
  public async saveUserBio(userId: string, bioText: string): Promise<boolean> {
    const trimmed = bioText.trim();
    if (trimmed.length < 50) {
      throw new Error('النبذة التعريفية يجب ألا تقل عن 50 حرفاً.');
    }
    const now = new Date().toISOString();

    // 1. الكتابة المباشرة إلى Supabase أولاً كـ Single Source of Truth
    const { error } = await supabase
      .from('profiles')
      .update({
        bio: trimmed,
        onboarded_at: now,
      })
      .eq('id', userId);

    if (error) {
      console.error('Supabase saveUserBio error:', error);
      throw new Error(`فشل حفظ النبذة في قاعدة البيانات (Supabase): ${error.message}`);
    }

    // 2. تحديث الحالة في الذاكرة فقط بعد تأكيد نجاح العملية في Supabase
    this.patchMember(userId, { bio: trimmed, onboarded_at: now });
    this.notify();
    return true;
  }

  // --- User Settings (JSONB) ---
  public updateUserSettings(userId: string, newSettings: Partial<UserSettings>) {
    const target = this.getMembers().find((m) => m.id === userId);
    const updatedSettings: UserSettings | undefined = target
      ? { ...target.settings, ...newSettings }
      : undefined;
    if (updatedSettings) this.patchMember(userId, { settings: updatedSettings });
    this.notify();

    if (updatedSettings) {
      supabase
        .from('profiles')
        .update({
          settings: updatedSettings,
        })
        .eq('id', userId)
        .then((res) => {
          if (res.error) {
            console.warn('Settings update sync to Supabase:', res.error.message);
          }
        })
        .catch(() => {});
    }
  }

  // --- Last Welcome Phrase ID (Anti-Repetition) ---
  public updateUserLastPhrase(userId: string, phraseId: string) {
    this.patchMember(userId, { last_phrase_id: phraseId });
    this.notify();

    supabase
      .from('profiles')
      .update({
        last_phrase_id: phraseId,
      })
      .eq('id', userId)
      .then(() => {})
      .catch(() => {});
  }

  // --- Profile Updates (Personal Info & Bio & Phone & Avatar) ---
  public async updateUserProfile(
    userId: string,
    updates: {
      bio?: string;
      phone?: string;
      avatarUrl?: string;
      avatarLetter?: string;
      major?: string;
      academicYear?: string;
    }
  ): Promise<boolean> {
    const target = this.getMembers().find((m) => m.id === userId);
    if (!target) return false;

    const mergedSettings: UserSettings = {
      ...target.settings,
      ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
      ...(updates.avatarUrl !== undefined ? { avatarUrl: updates.avatarUrl } : {}),
    };

    const patch: Partial<UserProfile> = {
      ...(updates.bio !== undefined ? { bio: updates.bio } : {}),
      ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
      ...(updates.avatarUrl !== undefined ? { avatarUrl: updates.avatarUrl } : {}),
      ...(updates.avatarLetter !== undefined ? { avatarLetter: updates.avatarLetter } : {}),
      ...(updates.major !== undefined ? { major: updates.major } : {}),
      ...(updates.academicYear !== undefined ? { academicYear: updates.academicYear } : {}),
      settings: mergedSettings,
    };

    this.patchMember(userId, patch);
    if (this.profile && this.profile.id === userId) {
      this.profile = { ...this.profile, ...patch };
    }
    this.notify();

    try {
      const payload: any = {
        settings: mergedSettings,
      };
      if (updates.bio !== undefined) payload.bio = updates.bio;
      if (updates.avatarLetter !== undefined) payload.avatar_letter = updates.avatarLetter;
      if (updates.major !== undefined) payload.major = updates.major;
      if (updates.academicYear !== undefined) payload.academic_year = updates.academicYear;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;

      const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
      if (error && error.code === 'PGRST204') {
        delete payload.phone;
        delete payload.avatar_url;
        await supabase.from('profiles').update(payload).eq('id', userId);
      }
      return true;
    } catch (err: any) {
      console.warn('Sync profile update error:', err?.message);
      return true;
    }
  }

  // --- Self-Added Skills Management ---
  public async addSelfSkill(userId: string, skillName: string): Promise<boolean> {
    const trimmed = skillName.trim();
    if (!trimmed) return false;

    const target = this.getMembers().find((m) => m.id === userId);
    if (!target) return false;

    const existing = target.detailedSkills || [];
    if (existing.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }

    const newSkill: MemberSkillItem = {
      name: trimmed,
      progressPercent: 100,
      status: 'approved',
      source: 'self',
      awardedAt: new Date().toISOString(),
    };

    const updated = [...existing, newSkill];
    this.patchMember(userId, {
      detailedSkills: updated,
      skills: updated.map((s) => s.name),
    });
    this.notify();

    try {
      await supabase.from('member_skills').insert({
        profile_id: userId,
        skill_name: trimmed,
        progress_percent: 100,
        status: 'approved',
        source: 'self',
      });
    } catch (e) {}
    return true;
  }

  public async removeSelfSkill(userId: string, skillName: string): Promise<boolean> {
    const target = this.getMembers().find((m) => m.id === userId);
    if (!target) return false;

    const existing = target.detailedSkills || [];
    const updated = existing.filter((s) => s.name !== skillName || s.source !== 'self');

    this.patchMember(userId, {
      detailedSkills: updated,
      skills: updated.map((s) => s.name),
    });
    this.notify();

    try {
      await supabase
        .from('member_skills')
        .delete()
        .eq('profile_id', userId)
        .eq('skill_name', skillName)
        .eq('source', 'self');
    } catch (e) {}
    return true;
  }

  // --- Skill Proof & Verification Submission ---
  // --- Skill Proof & Verification Submission ---
  public async submitSkillProof(
    userId: string,
    skillName: string,
    proofType: 'app_link' | 'quiz' | 'git_url',
    proofValue: string
  ): Promise<boolean> {
    const target = this.getMembers().find((m) => m.id === userId);
    if (!target) return false;

    const existing = target.detailedSkills || [];
    const updated = existing.map((s) => {
      if (s.name.toLowerCase() === skillName.toLowerCase()) {
        return {
          ...s,
          gitUrl: proofType === 'git_url' || proofType === 'app_link' ? proofValue : s.gitUrl,
          verificationNotes:
            proofType === 'quiz'
              ? `طلب كويز لاعتماد المهارة: ${proofValue || 'جاهز للاختبار'}`
              : `رابط إثبات: ${proofValue}`,
          status: 'in_progress' as const,
        };
      }
      return s;
    });

    this.patchMember(userId, {
      detailedSkills: updated,
    });

    // مزامنة حالة المهارة مع قاعدة البيانات member_skills في Supabase
    try {
      const { data: existingSkill } = await supabase
        .from('member_skills')
        .select('id')
        .eq('profile_id', userId)
        .ilike('skill_name', skillName)
        .maybeSingle();

      if (existingSkill?.id) {
        await supabase
          .from('member_skills')
          .update({
            progress_percent: 80,
            status: 'in_progress',
          })
          .eq('id', existingSkill.id);
      } else {
        await supabase
          .from('member_skills')
          .insert({
            profile_id: userId,
            skill_name: skillName,
            progress_percent: 80,
            status: 'in_progress',
            source: 'survey_registration',
          });
      }
    } catch (e) {
      console.warn('member_skills sync warning:', e);
    }

    const proofLabel =
      proofType === 'quiz'
        ? 'طلب كويز'
        : proofType === 'app_link'
        ? 'رابط تطبيق عملي'
        : 'رابط Git للمشروع';

    // تسجيل التسليم كـ Submission رسمي للاعتماد فقط إذا كان تسليماً برابط حقيقي (وليس كويز)
    if (proofType !== 'quiz' && proofValue.startsWith('http')) {
      const taskId = `skill-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      try {
        await supabase.from('tasks').upsert(
          {
            id: taskId,
            title: `تسليم إثبات مهارة: ${skillName}`,
            target_level: 'beginner',
            due_date: new Date().toISOString(),
            points: 25,
            is_active: true,
          },
          { onConflict: 'id' }
        );

        await supabase.from('submissions').upsert(
          {
            id: `sub-skill-${userId}-${taskId}`,
            task_id: taskId,
            profile_id: userId,
            repo_url: proofValue,
            live_url: proofValue,
            notes: `إثبات مهارة (${proofLabel}): ${proofValue}`,
            status: 'in_review',
          },
          { onConflict: 'id' }
        );
      } catch (e) {
        console.warn('Submissions insert warning:', e);
      }
    }

    await this.refreshData();
    this.notify();
    return true;
  }

  public async approveSkillViaQuiz(
    userId: string,
    skillName: string,
    score: number
  ): Promise<boolean> {
    const target = this.getMembers().find((m) => m.id === userId);
    if (!target) return false;

    const existing = target.detailedSkills || [];
    const updated = existing.map((s) => {
      if (s.name.toLowerCase() === skillName.toLowerCase()) {
        return {
          ...s,
          progressPercent: 100,
          status: 'approved' as const,
          verificationNotes: `اجتياز كويز المسار بنجاح بنتيجة (${score}/4) ✓`,
        };
      }
      return s;
    });

    const newPoints = (target.points || 0) + 25;
    this.patchMember(userId, {
      detailedSkills: updated,
      skills: Array.from(new Set([...(target.skills || []), skillName])),
      points: newPoints,
    });

    // 1. تحديث قاعدة بيانات member_skills في Supabase
    try {
      const { data: existingSkill } = await supabase
        .from('member_skills')
        .select('id')
        .eq('profile_id', userId)
        .ilike('skill_name', skillName)
        .maybeSingle();

      if (existingSkill?.id) {
        await supabase
          .from('member_skills')
          .update({
            progress_percent: 100,
            status: 'approved',
            awarded_at: new Date().toISOString(),
            source: 'quiz_pass',
          })
          .eq('id', existingSkill.id);
      } else {
        await supabase
          .from('member_skills')
          .insert({
            profile_id: userId,
            skill_name: skillName,
            progress_percent: 100,
            status: 'approved',
            awarded_at: new Date().toISOString(),
            source: 'quiz_pass',
          });
      }
    } catch (e) {
      console.warn('Could not update member_skills for quiz:', e);
    }

    // 2. تحديث النقاط في Supabase بجدولي profiles و points_ledger
    try {
      await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', userId);

      await supabase.from('points_ledger').insert({
        profile_id: userId,
        points_amount: 25,
        reason: `اجتياز كويز اعتماد مهارة ${skillName} (${score}/4)`,
        activity_key: `quiz-${Date.now()}-${userId.slice(0, 8)}-${Math.random().toString(36).slice(2, 7)}`,
        approved_by: userId,
      });
    } catch (e) {
      console.warn('Could not record quiz points in Supabase:', e);
    }

    // 3. الكويزات معتمدة في بروفايل العضو فقط ونقاطه ولا تُرسل كـ Submission للمعرض
    await this.refreshData();
    this.notify();
    return true;
  }

  // --- User KPI Metrics (Independent Indicators) ---
  public getUserStats(userId: string): UserStats {
    const subs = this.submissions.filter((s: any) => s.profile_id === userId || s.profileId === userId);
    const approvedSubs = subs.filter((s: any) => s.status === 'approved');
    const ledger = this.pointsLedger.filter((l: any) => l.profile_id === userId);

    const workshopsCompleted = ledger.filter((l: any) =>
      (l.reason && (l.reason.includes('ورشة') || l.reason.toLowerCase().includes('workshop'))) ||
      (l.activity_key && l.activity_key.includes('workshop'))
    ).length;

    const challengesCompleted = approvedSubs.length + ledger.filter((l: any) =>
      (l.reason && (l.reason.includes('تحدي') || l.reason.toLowerCase().includes('lab')))
    ).length;

    const projectsCompleted = approvedSubs.filter((s: any) => Boolean(s.repo_url || s.repoUrl)).length;

    const userInquiries = this.inquiries.filter((inq: any) => inq.userId === userId).length;
    const initiativesCount = userInquiries + ledger.filter((l: any) =>
      l.reason && (l.reason.includes('استبيان') || l.reason.includes('مبادرة') || l.reason.includes('مشاركة'))
    ).length;

    return {
      workshopsCompleted,
      challengesCompleted,
      projectsCompleted,
      initiativesCount,
    };
  }

  // --- User Badges & Achievements (الشارات المعتمدة لتحفيز الأعضاء) ---
  public getUserBadges(userId: string): BadgeItem[] {
    const member = this.members.find((m) => m.id === userId);
    if (!member) return [];

    const badges: BadgeItem[] = [];
    const pts = member.points || 0;

    // احتساب حضور الورش
    const attendanceMap = this.getAttendanceMap();
    const attendedWorkshopsCount = Object.values(attendanceMap).filter(
      (a) => a.memberId === userId && a.attended
    ).length;

    // احتساب تسليم المهام المعتمدة
    const submissions = this.getSubmissions();
    const approvedTasksCount = submissions.filter(
      (s) => (s.profile_id === userId || s.userId === userId) && s.status === 'approved'
    ).length;

    // 1. شارات النقاط
    if (pts >= 200) {
      badges.push({
        id: 'badge-pts-200',
        name: 'شرارة البداية ⚡',
        description: 'تحقيق أول 200 نقطة تميز في مسار الويب',
        iconName: 'Zap',
        category: 'points',
        reason: 'تجاوز حاجز 200 نقطة تفاعل بنجاح ⚡',
      });
    }

    if (pts >= 500) {
      badges.push({
        id: 'badge-pts-500',
        name: 'شعلة الإنجاز 🔥',
        description: 'الوصول إلى 500 نقطة من التفاعل والإتقان البرمجي',
        iconName: 'Flame',
        category: 'points',
        reason: 'الوصول إلى 500 نقطة في مسار الويب 🔥',
      });
    }

    if (pts >= 700) {
      badges.push({
        id: 'badge-pts-700',
        name: 'أسطورة المسار 💎',
        description: 'تجاوز 700 نقطة والدخول في نادي نخبة مطوري المسار',
        iconName: 'Diamond',
        category: 'points',
        reason: 'التميز الاستثنائي وتجاوز 700 نقطة 💎',
      });
    }

    if (pts >= 1000) {
      badges.push({
        id: 'badge-pts-1000',
        name: 'التاج الذهبي 👑',
        description: 'كسر حاجز 1000 نقطة والتربع على عرش التميز البرمجي',
        iconName: 'Crown',
        category: 'points',
        reason: 'تحقيق المركز الأسطوري و1000 نقطة 👑',
      });
    }

    // 2. شارات حضور الورش
    if (attendedWorkshopsCount >= 3) {
      badges.push({
        id: 'badge-ws-3',
        name: 'حاضر ومبادر 🎯',
        description: 'الالتزام بحضور 3 ورش عمل تطبيقية في المسار',
        iconName: 'Target',
        category: 'workshops',
        reason: 'حضور والمشاركة في 3 ورش عمل معتمدة 🎯',
      });
    }

    if (attendedWorkshopsCount >= 5) {
      badges.push({
        id: 'badge-ws-5',
        name: 'شغف المعرفة 🚀',
        description: 'الالتزام بحضور 5 ورش عمل تطبيقية متقدمة',
        iconName: 'Rocket',
        category: 'workshops',
        reason: 'المواظبة على حضور 5 ورش عمل تقنية 🚀',
      });
    }

    if (attendedWorkshopsCount >= 8) {
      badges.push({
        id: 'badge-ws-8',
        name: 'سفير الورش الذهبي 🌟',
        description: 'حضور جميع ورش المسار الثماني بنسبة التزام 100%',
        iconName: 'Star',
        category: 'workshops',
        reason: 'نسبة حضور كاملة لجميع ورش المسار الثماني 🌟',
      });
    }

    // 3. شارات تسليم المهام والتاسكات
    if (approvedTasksCount >= 1) {
      badges.push({
        id: 'badge-task-1',
        name: 'أول خطوة كود 💻',
        description: 'تسليم واعتماد أول مهمة برمجية تطبيقية بنجاح',
        iconName: 'Code',
        category: 'tasks',
        reason: 'اعتماد أول تسليم برمجي تطبيقي 💻',
      });
    }

    if (approvedTasksCount >= 4) {
      badges.push({
        id: 'badge-task-4',
        name: 'مطوّر نصف المسار 🛠️',
        description: 'إنجاز وتسليم 4 مهام برمجية تطبيقية معتمدة',
        iconName: 'Wrench',
        category: 'tasks',
        reason: 'إنجاز واعتماد 4 مهام برمجية بنجاح 🛠️',
      });
    }

    if (approvedTasksCount >= 8) {
      badges.push({
        id: 'badge-task-8',
        name: 'خبير الويب الشامل 🏆',
        description: 'إنجاز وتسليم جميع مهام ورش المسار الثماني',
        iconName: 'Trophy',
        category: 'tasks',
        reason: 'إتمام كامل مهام وتحديات خطة ورش المسار 🏆',
      });
    }

    return badges;
  }

  // --- Classera-Style Dynamic Engagement & Leaderboards ---
  public getActiveRankings(): {
    topWeekly: ActiveMemberRanking[];
    memberOfTheMonth: ActiveMemberRanking | null;
    calculationFormula: string;
  } {
    const excludedLeaderNames = ['عامر', 'أثير', 'غيداء', 'ريتال'];
    const pool = this.members.filter((m) => {
      if (m.role === 'track_leader' || m.role === 'supervisor') return false;
      if (excludedLeaderNames.some((name) => m.fullName.includes(name))) return false;
      return true;
    });

    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    const rankings: ActiveMemberRanking[] = pool.map((member) => {
      const stats = this.getUserStats(member.id);
      const userLedger = this.pointsLedger.filter((l: any) => l.profile_id === member.id);

      let weekPoints = 0;
      let monthPoints = 0;

      for (const entry of userLedger) {
        const time = entry.created_at ? new Date(entry.created_at).getTime() : now;
        const amount = Number(entry.points_amount) || 0;
        if (time >= oneWeekAgo) {
          weekPoints += amount;
        }
        if (time >= oneMonthAgo) {
          monthPoints += amount;
        }
      }

      // احتساب النقاط التراكمية الحقيقية فقط (دون مضاعفات وهمية)
      if (weekPoints === 0 && member.points > 0) {
        weekPoints = member.points;
      }
      if (monthPoints === 0 && member.points > 0) {
        monthPoints = member.points;
      }

      return {
        member,
        weekPoints,
        monthPoints,
        weekRank: 0,
        monthRank: 0,
        activityBreakdown: {
          workshops: stats.workshopsCompleted,
          challenges: stats.challengesCompleted,
          projects: stats.projectsCompleted,
          community: stats.initiativesCount,
        },
      };
    });

    const sortedByWeek = [...rankings].sort((a, b) => {
      if (b.weekPoints !== a.weekPoints) return b.weekPoints - a.weekPoints;
      return b.member.points - a.member.points;
    });

    sortedByWeek.forEach((item, index) => {
      item.weekRank = index + 1;
    });

    const topWeekly = sortedByWeek.slice(0, 5);

    const sortedByMonth = [...rankings].sort((a, b) => {
      if (b.monthPoints !== a.monthPoints) return b.monthPoints - a.monthPoints;
      return b.member.points - a.member.points;
    });

    sortedByMonth.forEach((item, index) => {
      item.monthRank = index + 1;
    });

    const hasAnyMonthPoints = sortedByMonth.some((m) => m.monthPoints > 0);
    const memberOfTheMonth = hasAnyMonthPoints ? sortedByMonth[0] : null;

    return {
      topWeekly,
      memberOfTheMonth,
      isApproved: this.isStarsApproved(),
      approvalDate: this.getStarsApprovedDate(),
      calculationFormula:
        'المراكز تُحتسب تلقائياً وفق النقاط الفعلية والتفاعل الحي، ولا تُعتمد نهائياً إلا بموافقة قائدة المسار (التحديث الدوري كل سبت).',
    };
  }

  public isStarsApproved(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('webtrack_stars_approved') === 'true';
  }

  public getStarsApprovedDate(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('webtrack_stars_approved_date');
  }

  public approveWeeklyAndMonthlyStars(): void {
    if (typeof window === 'undefined') return;
    const now = new Date();
    const formatted = now.toLocaleDateString('ar-SA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    localStorage.setItem('webtrack_stars_approved', 'true');
    localStorage.setItem('webtrack_stars_approved_date', formatted);

    // إرسال تنبيه احتفالي لجميع الأعضاء
    this.members
      .filter((m) => m.role === 'member')
      .forEach((m) => {
        this.addNotification({
          userId: m.id,
          type: 'points',
          title: '🎉 لدينا احتفال جديد ولفتة تكريمية لأعضاء رهيبين!',
          body: `تم اعتماد وتكريم أعضاء الأسبوع وعضو الشهر رسمياً ليوم السبت (${formatted}). تفقد لوحة الشرف! 🏆`,
          targetTab: 'home',
        });
      });

    this.notify();
  }

  public resetStarsApproval(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('webtrack_stars_approved');
    localStorage.removeItem('webtrack_stars_approved_date');
    this.notify();
  }

  public async submitLabChallenge(
    userId: string,
    challengeId: string,
    html: string,
    css: string,
    js: string,
    notes?: string
  ): Promise<void> {
    const active = this.getActiveLabChallenge();
    const submissionId = `lab-sub-${Date.now()}`;
    const newSubmission = {
      id: submissionId,
      profile_id: userId,
      profileId: userId,
      task_id: challengeId,
      taskTitle: `مختبر الويب: ${active.title}`,
      repo_url: '',
      live_url: '',
      submitted_at: new Date().toISOString(),
      status: 'in_review',
      code_snippet: JSON.stringify({ html, css, js, notes: notes || '' }),
    };

    try {
      await supabase.from('submissions').insert({
        profile_id: userId,
        status: 'in_review',
        task_id: null,
        repo_url: 'https://weblab.gdgoc-taif.dev',
        live_url: 'https://weblab.gdgoc-taif.dev',
      });
    } catch (e) {
      console.warn('Lab submission supabase note:', e);
    }

    this.submissions.unshift(newSubmission);

    // تنبيه قائدة المسار
    this.members
      .filter((m) => m.role === 'track_leader' || m.role === 'supervisor')
      .forEach((leader) => {
        this.addNotification({
          userId: leader.id,
          type: 'task',
          title: '📥 تسليم جديد في مختبر الويب',
          body: `قام عضو بتسليم حل تحدي "${active.title}" وهو بانتظار مراجعتك ورصد النقاط له.`,
          targetTab: 'submissions',
        });
      });

    this.notify();
  }

  // --- Notifications ---
  public getNotifications(userId?: string): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs: NotificationItem[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    if (!userId) return notifs;
    return notifs.filter((n) => n.userId === userId);
  }

  public getUnreadCount(userId: string): number {
    return this.getNotifications(userId).filter((n) => !n.read).length;
  }

  public markAllNotificationsAsRead(userId: string) {
    const notifs = this.getNotifications().map((n) => {
      if (n.userId === userId) {
        return { ...n, read: true };
      }
      return n;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    this.notify();
  }

  public addNotification(notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) {
    const newNotif: NotificationItem = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: 'الآن',
      read: false,
    };
    const notifs = [newNotif, ...this.getNotifications()];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    this.notify();
  }

  // --- Action Items ("ينتظرك") ---
  public getActionItems(): ActionItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTION_ITEMS);
    return raw ? JSON.parse(raw) : INITIAL_ACTION_ITEMS;
  }

  public completeActionItem(id: string) {
    // marks action as complete or updates list
    this.notify();
  }

  // --- Courses & Educational Journey ---
  public getCourses(): Course[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (!raw) return INITIAL_COURSES;
    try {
      const stored: Course[] = JSON.parse(raw);
      const storedMap = new Map(stored.map((c) => [c.id, c]));
      return INITIAL_COURSES.map((init) => {
        const saved = storedMap.get(init.id);
        if (!saved) return init;
        return {
          ...init,
          status: saved.status || init.status,
          projectRepoUrl: saved.projectRepoUrl || init.projectRepoUrl,
        };
      });
    } catch {
      return INITIAL_COURSES;
    }
  }

  public submitCourseProject(courseId: string, projectUrl: string) {
    const courses = this.getCourses().map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          projectRepoUrl: projectUrl.trim(),
          status: 'in_review' as const,
        };
      }
      return c;
    });
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    this.notify();
  }

  // --- Points Awarding ---
  // --- Points Awarding (points_ledger in Supabase) ---
  public async awardPoints(
    userId: string,
    amount: number,
    reason?: string,
    awardedBy?: string,
    activityKey?: string
  ): Promise<boolean> {
    // 1. التحقق من المستخدم المعتمد
    const approverId = this.getCurrentUser()?.id;
    if (!approverId) throw new Error('يجب تسجيل الدخول لمنح النقاط.');

    // 2. مفتاح فريد لمنع تكرار العملية
    const finalKey = activityKey || `manual-${Date.now()}-${userId.slice(0, 8)}-${Math.random().toString(36).slice(2, 7)}`;

    // فحص محلي سريع لمنع التكرار
    const alreadyLogged = this.pointsLedger.some(
      (l: any) => l.profile_id === userId && (l.activity_key === finalKey || (activityKey && l.activity_key === activityKey))
    );
    if (alreadyLogged) {
      console.warn('Points already logged with activityKey:', finalKey);
      return true;
    }

    // 3. الكتابة إلى points_ledger في Supabase
    const { error } = await supabase.from('points_ledger').insert({
      profile_id: userId,
      points_amount: amount,
      reason: reason || 'مكافأة مسار الويب',
      activity_key: finalKey,
      approved_by: approverId,
    });

    if (error) {
      // إذا كان المفتاح مسجلاً مسبقاً (Unique constraint)، نتجاهل التكرار بنجاح لمنع الازدواجية
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        console.warn('Duplicate activityKey blocked by DB constraint:', finalKey);
        return true;
      }
      console.error('Supabase awardPoints error:', error);
      throw new Error(`فشل قيد النقاط في قاعدة البيانات (points_ledger): ${error.message}`);
    }

    // 4. تحديث الرصيد التراكمي في الذاكرة وفي جدول profiles فوراً
    const currentMember = this.members.find((m) => m.id === userId);
    const updatedPoints = (currentMember?.points || 0) + amount;
    this.patchMember(userId, { points: updatedPoints });

    try {
      await supabase.from('profiles').update({ points: updatedPoints }).eq('id', userId);
    } catch (e) {
      console.warn('Could not update profiles.points:', e);
    }

    // 5. إعادة تحميل الأرقام الفعلية لمزامنة كافة واجهات النظام
    await this.loadRoleData();

    if (reason) {
      this.addNotification({
        userId,
        type: 'points',
        title: 'نقاط جديدة!',
        description: reason,
        badgeText: `+${amount}`,
        pointsAmount: amount,
        targetTab: 'home',
      });
    }

    this.notify();
    return true;
  }

  public async addPoints(userId: string, amount: number, reason?: string) {
    return this.awardPoints(userId, amount, reason);
  }

  // --- Inquiries (inquiries table in Supabase) ---
  public getInquiries(): Inquiry[] {
    return this.inquiries;
  }

  public async addInquiry(
    titleOrObj: string | { title?: string; details?: string; subject?: string; message?: string; userId?: string; userName?: string; userAvatar?: string; targetRecipient?: string },
    detailsArg?: string,
    targetRecipientArg?: string
  ): Promise<Inquiry> {
    const user = this.getCurrentUser();
    let profileId = user?.id || '';
    let userName = user?.fullName || 'عضو مسار';
    let userAvatar = user?.avatarLetter || 'ع';
    let title = '';
    let details = '';
    let targetRecipient = targetRecipientArg || 'all';

    if (typeof titleOrObj === 'object' && titleOrObj !== null) {
      title = (titleOrObj as any).title || (titleOrObj as any).subject || (titleOrObj as any).name || '';
      details = (titleOrObj as any).details || (titleOrObj as any).message || (titleOrObj as any).content || '';
      if ((titleOrObj as any).userId) profileId = (titleOrObj as any).userId;
      if ((titleOrObj as any).userName) userName = (titleOrObj as any).userName;
      if ((titleOrObj as any).userAvatar) userAvatar = (titleOrObj as any).userAvatar;
      if ((titleOrObj as any).targetRecipient) targetRecipient = (titleOrObj as any).targetRecipient;
    } else {
      title = titleOrObj || '';
      details = detailsArg || '';
    }

    if (!title.trim()) {
      title = 'استفسار / تسليم إثبات مهارة';
    }
    if (!details.trim()) {
      details = 'تفاصيل التسليم مسجلة لدى العضو.';
    }

    if (!profileId) {
      throw new Error('يجب تسجيل الدخول لإرسال استفسار.');
    }

    const inqId = `inq-${Date.now()}`;

    // 1. الكتابة المباشرة إلى جدول inquiries الفعلي في Supabase أولاً
    const insertPayload: any = {
      id: inqId,
      profile_id: profileId,
      user_name: userName,
      title: title.trim(),
      details: details.trim(),
      status: 'new',
    };
    const { error } = await supabase.from('inquiries').insert(insertPayload);

    if (error) {
      console.error('Supabase addInquiry error:', error);
      throw new Error(`فشل إرسال الاستفسار إلى قاعدة البيانات (inquiries): ${error.message}`);
    }

    // 2. تحديث الكاش المحلي بعد تأكيد Supabase
    const newInquiry: Inquiry = {
      id: inqId,
      userId: profileId,
      userName,
      userAvatar,
      title: title.trim(),
      details: details.trim(),
      targetRecipient,
      status: 'new',
      createdAt: 'الآن',
    };

    this.inquiries = [newInquiry, ...this.inquiries];
    this.notify();
    return newInquiry;
  }

  /**
   * البت في طلب أو استفسار العضو (موافقة أو رفض) وتفعيل الصلاحيات والنقاط آلياً
   */
  public async resolveInquiry(
    inquiryId: string,
    decision: 'approved' | 'rejected',
    notes: string,
    leaderName: string
  ): Promise<boolean> {
    const now = new Date().toISOString();
    const targetInq = this.inquiries.find((inq) => inq.id === inquiryId);
    const userId = targetInq?.userId || '';
    const responseText =
      notes.trim() ||
      (decision === 'approved'
        ? 'تمت الموافقة والاعتماد بنجاح، وتفعيل الصلاحية/النقاط المطلوبة.'
        : 'نعتذر، لم يتم اعتماد الطلب في الوقت الحالي.');

    // 1. تحديث Supabase inquiries
    try {
      await supabase
        .from('inquiries')
        .update({
          status: 'answered',
          response_text: responseText,
          answered_by: leaderName,
          answered_at: now,
        })
        .eq('id', inquiryId);
    } catch (err) {
      console.error('Supabase resolveInquiry error:', err);
    }

    // 2. تحديث الكاش المحلي
    this.inquiries = this.inquiries.map((inq) => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status: 'answered',
          decision,
          decisionNotes: notes.trim(),
          responseText,
          respondedBy: leaderName,
          respondedAt: 'الآن',
          answered_by: leaderName,
          answered_at: now,
        };
      }
      return inq;
    });

    // 2.1 حفظ كامل تفاصيل الرد والقرار في التخزين المحلي لضمان ظهورها للعضو دائماً
    try {
      const storedData = JSON.parse(localStorage.getItem('gdg_webtrack_resolved_inquiries_data') || '{}');
      storedData[inquiryId] = {
        status: 'answered',
        decision,
        responseText,
        respondedBy: leaderName,
        respondedAt: new Date().toLocaleDateString('ar-SA'),
      };
      localStorage.setItem('gdg_webtrack_resolved_inquiries_data', JSON.stringify(storedData));
    } catch {}

    // 3. في حال الموافقة: تفعيل الصلاحيات والنقاط والمشاريع تلقائياً
    if (decision === 'approved' && targetInq) {
      const inqTitle = targetInq.title || '';
      const inqDetails = targetInq.details || '';
      const isRoleRequest =
        inqTitle.includes('إشراف') ||
        inqTitle.includes('مشرف') ||
        inqTitle.includes('صلاحية') ||
        inqDetails.includes('إشراف') ||
        inqDetails.includes('مشرف') ||
        inqDetails.includes('صلاحية') ||
        (targetInq.userName || '').includes('عامر');

      // تفعيل صلاحية الإشراف إذا كان طلب إشراف
      if (isRoleRequest && userId) {
        try {
          await this.patchMember(userId, { role: 'supervisor' });
        } catch (e) {
          console.warn('patchMember supervisor error:', e);
        }
      }

      // اعتماد التسليمات أو إثباتات المهارة وإضافة النقاط
      const isProofOrTask =
        inqTitle.includes('إثبات') ||
        inqTitle.includes('تحدي') ||
        inqTitle.includes('مهمة') ||
        inqTitle.includes('كويز') ||
        inqTitle.includes('تسليم') ||
        inqDetails.includes('http');

      if (isProofOrTask && userId) {
        try {
          await this.awardPoints(userId, 25, `اعتماد طلب: ${inqTitle || 'تسليم إثبات'}`);
        } catch (e) {
          console.warn('awardPoints error:', e);
        }

        // تحديث حالة التسليم المطابق في التسليمات
        this.submissions = this.submissions.map((sub: any) => {
          if (sub.profile_id === userId || sub.profileId === userId || sub.user_id === userId) {
            return { ...sub, status: 'approved' };
          }
          return sub;
        });
      }
    }

    // 4. إشعار فوري وتنبيه للمُرسل يظهر في شريط الإشعارات والجرس
    let targetRecipientId = userId;
    if (!targetRecipientId && targetInq?.userName) {
      const found = this.members.find(
        (m) =>
          m.fullName.toLowerCase().includes(targetInq.userName.toLowerCase()) ||
          targetInq.userName.toLowerCase().includes(m.fullName.toLowerCase())
      );
      if (found) targetRecipientId = found.id;
    }

    if (targetRecipientId) {
      try {
        this.addNotification({
          userId: targetRecipientId,
          title: decision === 'approved' ? 'تهانينا! تمت الموافقة على طلبك ✅' : 'تحديث بشأن طلبك 📋',
          message: `رد القيادة (${leaderName}): ${responseText}`,
          type: decision === 'approved' ? 'success' : 'info',
        });
      } catch {}
    }

    this.notify();
    return true;
  }

  public async answerInquiry(inquiryId: string, answerText: string, answeredBy: string): Promise<boolean> {
    return this.resolveInquiry(inquiryId, 'approved', answerText, answeredBy);
  }

  // --- Polls (polls, poll_options, poll_responses in Supabase) ---
  public getPoll(): Poll | null {
    const list = this.getPolls();
    return list.length > 0 ? list[0] : null;
  }

  public getPolls(): Poll[] {
    const raw = localStorage.getItem(STORAGE_KEYS.POLLS);
    if (!raw) return [];
    try {
      const list = JSON.parse(raw);
      const filtered = Array.isArray(list)
        ? list.filter((p: Poll) => p.id !== 'poll-1' && p.id !== 'poll-workshops-week' && !p.id?.includes('week') && !p.title?.includes('أي ورشة'))
        : [];
      return filtered;
    } catch {
      return [];
    }
  }

  public getUserVote(pollId: string, userId: string): PollVoteRecord | null {
    const raw = localStorage.getItem(STORAGE_KEYS.VOTES);
    const votes: PollVoteRecord[] = raw ? JSON.parse(raw) : [];
    return votes.find((v) => v.pollId === pollId && v.userId === userId) || null;
  }

  public hasUserVoted(pollId: string, userId: string): boolean {
    return !!this.getUserVote(pollId, userId);
  }

  public async votePoll(
    pollId: string,
    optionId?: string,
    customText?: string
  ): Promise<{ success: boolean; pointsAwarded: boolean }> {
    return this.submitVote(pollId, optionId, customText);
  }

  public async submitVote(
    pollId: string,
    optionId?: string,
    customText?: string
  ): Promise<{ success: boolean; pointsAwarded: boolean }> {
    const user = this.getCurrentUser();
    if (!user) throw new Error("يجب تسجيل الدخول للتصويت.");
    const poll = this.getPoll();

    // 1. الكتابة المباشرة إلى جدول poll_responses الفعلي في Supabase أولاً
    const { error } = await supabase.from('poll_responses').insert({
      poll_id: pollId,
      profile_id: user.id,
      option_id: optionId || null,
      custom_text: customText?.trim() || null,
    });

    if (error) {
      console.error('Supabase submitVote error:', error);
      throw new Error(`فشل تسجيل التصويت في قاعدة البيانات (poll_responses): ${error.message}`);
    }

    // 2. منح النقاط وتحديث الكاش المحلي فقط بعد تأكيد نجاح الإدراج في Supabase
    let pointsAwarded = false;
    try {
      await this.awardPoints(user.id, poll.pointsReward, 'مشاركتك في استبيان الورشة القادمة');
      pointsAwarded = true;
    } catch {
      // Points ledger failure should not invalidate the vote itself
    }

    const rawVotes = localStorage.getItem(STORAGE_KEYS.VOTES);
    const votes: PollVoteRecord[] = rawVotes ? JSON.parse(rawVotes) : [];

    const newRecord: PollVoteRecord = {
      pollId,
      userId: user.id,
      optionId,
      customText: customText?.trim(),
      votedAt: 'الآن',
      awardedPoints: pointsAwarded,
    };

    votes.push(newRecord);
    if (optionId) {
      poll.options = poll.options.map((opt) =>
        opt.id === optionId ? { ...opt, votesCount: opt.votesCount + 1 } : opt
      );
    } else if (customText) {
      poll.customAnswers.unshift({
        userId: user.id,
        userName: user.fullName,
        text: customText.trim(),
        votedAt: 'الآن',
      });
    }
    poll.totalVotes += 1;

    localStorage.setItem(STORAGE_KEYS.POLLS, JSON.stringify([poll]));
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
    this.notify();
    return { success: true, pointsAwarded };
  }

  // --- Cinematic Entry Intro ---
  public hasSeenIntroThisSession(): boolean {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem(STORAGE_KEYS.INTRO_SEEN) === 'true';
  }

  public setIntroSeenThisSession() {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(STORAGE_KEYS.INTRO_SEEN, 'true');
  }

  // --- Workshops Management ---
  public getWorkshops(): Workshop[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKSHOPS);
    if (!raw) return INITIAL_WORKSHOPS;
    try {
      const parsed: Workshop[] = JSON.parse(raw);
      return parsed.filter((w) => w.id !== 'ws-grid-flexbox');
    } catch {
      return INITIAL_WORKSHOPS;
    }
  }

  public async addWorkshop(
    workshopData: Omit<Workshop, 'id' | 'createdAt'>
  ): Promise<Workshop> {
    const newWs: Workshop = {
      ...workshopData,
      id: `ws-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // 1. الكتابة المباشرة إلى جدول workshops في Supabase أولاً كـ Single Source of Truth
    const { error } = await supabase.from('workshops').insert({
      id: newWs.id,
      title: newWs.title,
      speaker_name: newWs.speaker || 'غير محدد',
      date: newWs.scheduledAt || '',
      time: '19:00',
      location: 'Google Meet',
      description: newWs.description || '',
      registration_link: newWs.registrationUrl || '',
      meeting_link: newWs.meetingUrl || '',
      image_url: newWs.imageUrl || null,
      is_past: false,
      created_by: newWs.createdBy || this.getCurrentUser()?.id || null,
    });

    if (error) {
      console.error('Supabase addWorkshop error:', error);
      throw new Error(`فشل حفظ الورشة في قاعدة البيانات (Supabase workshops): ${error.message} (كود: ${error.code})`);
    }

    // 2. تحديث الكاش المحلي فقط بعد تأكيد نجاح العملية في Supabase
    const current = this.getWorkshops();
    const updated = [newWs, ...current];
    localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(updated));

    // تحديث قائمة "ينتظرك" تلقائياً بالورشة الجديدة
    const actions = this.getActionItems();
    const existingWsIdx = actions.findIndex((a) => a.type === 'workshop');
    const newActionItem: ActionItem = {
      id: `act-${newWs.id}`,
      type: 'workshop',
      typeLabel: 'ورشة',
      title: `${newWs.title} · ${newWs.scheduledAt}`,
      subtitle: newWs.description ? newWs.description.slice(0, 45) + '...' : 'سجّل حضورك',
      dueText: newWs.scheduledAt,
      actionText: 'سجّل',
      actionType: 'register',
      targetTab: 'home',
    };

    if (existingWsIdx >= 0) {
      actions[existingWsIdx] = newActionItem;
    } else {
      actions.unshift(newActionItem);
    }
    localStorage.setItem(STORAGE_KEYS.ACTION_ITEMS, JSON.stringify(actions));

    this.notify();
    return newWs;
  }

  // --- Dynamic Week Days (شريط الأسبوع في الرئيسية) ---
  public getWeeklyDays(): WeeklyDay[] {
    const today = new Date();
    // بداية الأسبوع الجامعي في المملكة (الأحد = 0)
    const currentDayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDayOfWeek);
    sunday.setHours(0, 0, 0, 0);

    const arabicDays: { name: string; full: string }[] = [
      { name: 'ح', full: 'الأحد' },
      { name: 'ن', full: 'الاثنين' },
      { name: 'ث', full: 'الثلاثاء' },
      { name: 'ر', full: 'الأربعاء' },
      { name: 'خ', full: 'الخميس' },
      { name: 'ج', full: 'الجمعة' },
      { name: 'س', full: 'السبت' },
    ];

    const workshops = this.getWorkshops();
    const tasks = this.getTasks();
    const poll = this.getPoll();

    return arabicDays.map((d, index) => {
      const dayDate = new Date(sunday);
      dayDate.setDate(sunday.getDate() + index);

      const isToday =
        dayDate.getDate() === today.getDate() &&
        dayDate.getMonth() === today.getMonth() &&
        dayDate.getFullYear() === today.getFullYear();

      const activities: DayActivity[] = [];

      // 1. ورش العمل: ربط الورشة باليوم المجدول فيه (مثل الثلاثاء أو الأحد أو أي يوم آخر)
      workshops.forEach((w, wIdx) => {
        const text = `${w.scheduledAt || ''} ${w.title || ''} ${w.description || ''}`;
        const hasExplicitDay = arabicDays.some((ad) => text.includes(ad.full));

        let matches = false;
        if (hasExplicitDay) {
          matches = text.includes(d.full);
        } else if (wIdx === 0 && index === 0) {
          // إذا لم يُذكر أي يوم صراحة في نص الورشة الأولى فقط، توضع افتراضياً يوم الأحد
          matches = true;
        }

        if (matches) {
          activities.push({
            id: w.id,
            type: 'workshop',
            title: w.title,
            time: w.scheduledAt || 'مساءً',
            color: '#34A853', // أخضر الورشة
          });
        }
      });

      // 2. الأربعاء (index 3): استبيان الورشة القادمة
      if (index === 3 && poll) {
        activities.push({
          id: poll.id,
          type: 'poll',
          title: poll.title,
          time: 'طوال اليوم',
          color: '#4285F4', // أزرق للاستبيان
        });
      }

      // 3. الخميس (index 4): موعد تسليم التاسك والتحدي
      if (index === 4 && tasks.length > 0) {
        activities.push({
          id: tasks[0].id,
          type: 'task',
          title: tasks[0].title,
          time: 'آخر موعد ١١:٥٩ م',
          color: '#F9AB00', // أصفر للتاسك
        });
      }

      return {
        date: dayDate.toISOString().split('T')[0],
        dayName: d.name,
        dayFullName: d.full,
        dateNumber: dayDate.getDate(),
        isToday,
        activities,
      };
    });
  }

  // --- Supabase-backed data & stats (no demo fallbacks: empty = empty state) ---
  public getTasks(): any[] {
    return (this.tasks || []).filter(
      (t) =>
        t.is_demo !== true &&
        !t.id?.includes('interactive-btn') &&
        !t.id?.includes('css-card') &&
        !t.title?.includes('زر يتفاعل')
    );
  }

  public getSubmissions(): any[] {
    return this.submissions;
  }

  /** اعتماد تسليم: يحدّث حالته ثم يقيّد النقاط في points_ledger. يتطلب صلاحية قائد/مشرف (RLS). */
  public async approveSubmission(
    submissionId: string,
    profileId: string,
    points: number,
    reason: string
  ): Promise<void> {
    await this.reviewSubmission(submissionId, profileId, 'approved', points, reason, reason);
  }

  /** مراجعة شاملة للتسليم: اعتماد، أو طلب تعديل، أو عدم اعتماد مع كتابة ملاحظة وإرسال إشعار فوري للعضو */
  public async reviewSubmission(
    submissionId: string,
    profileId: string,
    action: 'approved' | 'needs_revision' | 'rejected',
    points: number,
    feedback: string,
    taskTitle: string
  ): Promise<void> {
    // التحقق من حالة التسليم السابقة لمنع اعتماد نفس التسليم مرتين
    const existingSub = this.submissions.find((s) => s.id === submissionId);
    if (existingSub && existingSub.status === 'approved' && action === 'approved') {
      console.warn('Submission already approved, aborting duplicate award:', submissionId);
      return;
    }

    const statusMap: Record<string, string> = {
      approved: 'approved',
      needs_revision: 'needs_revision',
      rejected: 'draft',
    };
    const newStatus = statusMap[action] || 'in_review';

    // تحديث الحالة محلياً فوراً لتختفي من قائمة التسليمات المعلقة وتزول الشاشة فوراً دون انتظار
    this.submissions = this.submissions.map((s) =>
      s.id === submissionId
        ? { ...s, status: newStatus, points_awarded: action === 'approved' ? points : 0, notes: feedback || null }
        : s
    );
    this.notify();

    const { error } = await supabase
      .from('submissions')
      .update({
        status: newStatus,
        points_awarded: action === 'approved' ? points : 0,
        notes: feedback || null,
      })
      .eq('id', submissionId);

    if (error) {
      throw new Error(`فشل تحديث حالة التسليم في قاعدة البيانات: ${error.message}`);
    }

    if (action === 'approved') {
      if (points > 0) {
        // مفتاح غير مكرر يضمن عدم قيد النقاط لنفس التسليم إطلاقاً مهما حدث
        await this.awardPoints(
          profileId,
          points,
          `اعتماد تسليم: ${taskTitle}`,
          undefined,
          `submission-${submissionId}`
        );
      }

      // اعتماد المهارة في جدول member_skills إذا كان التسليم إثبات مهارة
      const skillName = taskTitle.replace(/^.*مهارة:\s*/, '').trim();
      if (skillName && skillName !== taskTitle) {
        try {
          await supabase
            .from('member_skills')
            .update({
              status: 'approved',
              progress_percent: 100,
              awarded_at: new Date().toISOString(),
            })
            .eq('profile_id', profileId)
            .ilike('skill_name', skillName);
        } catch (e) {
          console.warn('member_skills update warning:', e);
        }
      }

      this.addNotification({
        userId: profileId,
        type: 'points',
        title: 'تم اعتماد تسليمك! 🎉',
        description: feedback
          ? `${feedback} (+${points} نقطة)`
          : `تم اعتماد ${taskTitle} وإضافة ${points} نقطة إلى رصيدك!`,
        pointsAmount: points,
        badgeText: `+${points}`,
        targetTab: 'profile',
      });
    } else if (action === 'needs_revision') {
      this.addNotification({
        userId: profileId,
        type: 'task',
        title: 'مطلوب تعديل على التسليم 📝',
        description:
          feedback ||
          `توجد ملاحظات توجيهية من القائدة على تسليم ${taskTitle}، يرجى مراجعتها وتعديل الرابط المطلوب.`,
        targetTab: 'challenges',
      });
    } else if (action === 'rejected') {
      this.addNotification({
        userId: profileId,
        type: 'task',
        title: 'تنبيه بخصوص التسليم ✕',
        description:
          feedback ||
          `لم يتم اعتماد تسليم ${taskTitle}. يرجى مراجعة الشروط والمحاولة مجدداً.`,
        targetTab: 'challenges',
      });
    }

    await this.refreshData();
    this.notify();
  }

  public getRealStats() {
    if (typeof window !== 'undefined' && window.location.search.includes('demo=')) {
      const mockSubs = this.submissions.length > 0 ? this.submissions : StoreManager.getMockSubmissions();
      return {
        activeMembersCount: 28,
        pendingSubmissionsCount: mockSubs.filter((s: any) => s.status === 'in_review').length,
        activeTasksCount: 6,
        completionRate: 88,
        submissionsList: mockSubs,
        pendingSubmissionsList: mockSubs.filter((s: any) => s.status === 'in_review'),
      };
    }
    const members = this.getMembers().filter((m) => m.role === 'member');
    const submissions = this.getSubmissions().filter((s) => {
      const t = (s.taskTitle || s.task?.title || s.notes || '').toLowerCase();
      if (t.includes('كويز') || t.includes('quiz') || s.id?.includes('quiz') || (s.repo_url && s.repo_url.includes('quiz')) || (s.repoUrl && s.repoUrl.includes('quiz'))) return false;
      const hasLink =
        (s.repoUrl && s.repoUrl.startsWith('http') && !s.repoUrl.includes('quiz') && s.repoUrl !== 'https://github.com') ||
        (s.live_url && s.live_url.startsWith('http') && !s.live_url.includes('quiz'));
      return Boolean(hasLink);
    });
    const pendingSubmissions = submissions.filter((s) => s.status === 'in_review' || s.status === 'pending');
    const tasks = this.getTasks().filter((t) => t.is_active !== false);
    const approvedSubmissions = submissions.filter((s) => s.status === 'approved');

    const completionRate =
      submissions.length > 0
        ? Math.round((approvedSubmissions.length / submissions.length) * 100)
        : 0;

    return {
      activeMembersCount: members.length,
      pendingSubmissionsCount: pendingSubmissions.length,
      activeTasksCount: tasks.length,
      completionRate,
      submissionsList: submissions,
      pendingSubmissionsList: pendingSubmissions,
    };
  }

  // --- Challenge Groups & Multi-Option Tasks (Architecture Section 3) ---
  public getChallengeGroups(): ChallengeGroup[] {
    if (typeof window !== 'undefined' && window.location.search.includes('demo=')) {
      return [
        {
          id: 'grp-demo-01',
          title: 'تحدي تصميم الواجهات المتجاوبة (Responsive Design)',
          workshopTitle: 'ورشة أساسيات التصميم الحديث والشبكات',
          category: 'workshop',
          dueDate: '2026-11-15',
          mode: 'choice',
          options: [
            {
              id: 'opt-01',
              groupId: 'grp-demo-01',
              name: 'بناء صفحة هبوط تفاعلية لمنتج تقني',
              description: 'تصميم واجهة مستخدم متكاملة متوافقة مع جميع أحجام الشاشات باستخدام CSS Grid و Flexbox.',
              requirements: 'استخدام وسائط الاستعلام Media Queries وتنسيقات الألوان المتناسقة مع دعم الوضع الداكن.',
              points: 50
            },
            {
              id: 'opt-02',
              groupId: 'grp-demo-01',
              name: 'تصميم لوحة معلومات وإحصائيات (Dashboard)',
              description: 'بناء واجهة لوحة تحكم تعرض بطاقات إحصائية وجداول بيانات متجاوبة.',
              requirements: 'هيكلة عناصر البطاقات بسلاسة والتأكد من توافق القوائم الجانبية على الهواتف الذكية.',
              points: 60
            }
          ]
        },
        {
          id: 'grp-demo-02',
          title: 'تحدي تطبيقات JavaScript التفاعلية',
          category: 'side_learn',
          dueDate: '2026-11-20',
          mode: 'mandatory',
          options: [
            {
              id: 'opt-03',
              groupId: 'grp-demo-02',
              name: 'بناء تطبيق قائمة مهام مع التخزين المحلي (LocalStorage)',
              description: 'تطبيق متكامل يسمح بإضافة المهام وحذفها وتعليمها كمكتملة مع بقاء البيانات بعد التحديث.',
              requirements: 'استخدام مفاهيم DOM Manipulation و الأحداث Event Listeners وكتابة كود نظيف مقسم لدوال.',
              points: 40
            }
          ]
        },
        {
          id: 'grp-demo-03',
          title: 'تحدي الألعاب والرسوم التفاعلية (Fun Coding)',
          category: 'side_fun',
          dueDate: '2026-11-25',
          mode: 'choice',
          options: [
            {
              id: 'opt-04',
              groupId: 'grp-demo-03',
              name: 'لعبة اختبار الذاكرة بالألوان (Memory Game)',
              description: 'تطبيق لعبة خفيفة لاختبار سرعة البديهة والذاكرة باستخدام الرسوم المتحركة في CSS.',
              requirements: 'تأثيرات حركية سلسة Keyframe Animations ومؤقت زمني لحساب النقاط.',
              points: 45
            }
          ]
        }
      ];
    }
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGE_GROUPS);
    if (!raw) return [];
    try {
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return [];
      return list.filter(
        (g: ChallengeGroup) =>
          g.id !== 'grp-flexbox-grid' &&
          g.id !== 'grp-side-button' &&
          !g.title?.includes('Flexbox') &&
          !g.title?.includes('شبكة منتجات')
      );
    } catch {
      return [];
    }
  }

  // --- Resources & Enrichment Library (ملفات المسار والملفات الإثرائية المعتمدة) ---
  public getResources(): TrackResource[] {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.RESOURCES) : null;
    let list: TrackResource[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mockResourceIds = ['res-ws-1-slides', 'res-css-grid-cheat', 'res-web-dev-guide'];
          const mockTitles = ['سلايدات الورشة 01', 'مرجع الأكواد السريع', 'دليل مطور الويب الشامل'];
          let needsSanitization = false;
          list = parsed
            .filter((r: any) => {
              if (!r) return false;
              if (mockResourceIds.includes(r.id)) return false;
              if (mockTitles.some((t) => (r.title || '').includes(t))) return false;
              return true;
            })
            .map((r: any) => {
              let url = r.fileUrl || '';
              // إذا كان الملف يحتوي على DataURL قديم متضخم في localStorage، نرحله إلى IndexedDB وننظف localStorage
              if (url.startsWith('data:') || (r.fileData && r.fileData.startsWith('data:'))) {
                const data = r.fileData || url;
                if (typeof window !== 'undefined') {
                  persistLocalDataUrl(r.id, data, r.fileName, r.fileSize).catch(() => {});
                }
                url = `local://${r.id}`;
                needsSanitization = true;
              }
              return {
                ...r,
                fileUrl: url.replace(/^https?:\/\/blob:/i, 'blob:'),
                fileData: undefined,
              };
            });

          // تحرير مساحة localStorage فوراً إذا وُجدت بيانات Base64 متضخمة
          if (needsSanitization && typeof window !== 'undefined') {
            try {
              localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(list));
            } catch {}
          }
        }
      } catch {}
    }
    return list;
  }

  public addResource(resData: Partial<TrackResource> & Omit<TrackResource, 'uploadedAt'>): TrackResource {
    const assignedId = resData.id || `res-${Date.now()}`;
    let cleanUrl = (resData.fileUrl || '').replace(/^https?:\/\/blob:/i, 'blob:');
    if (cleanUrl.startsWith('data:')) {
      cleanUrl = `local://${assignedId}`;
    }

    const newRes: TrackResource = {
      id: assignedId,
      uploadedAt: new Date().toISOString().split('T')[0],
      title: resData.title || 'ملف إثرائي',
      description: resData.description || 'ملف إثرائي لمسار الويب',
      category: resData.category || 'slides',
      fileUrl: cleanUrl,
      fileType: resData.fileType || 'pdf',
      fileSize: resData.fileSize || '١٫٠ MB',
      fileName: resData.fileName,
      fileData: resData.fileData, // في الذاكرة الحالية للمعروضات الفورية
      workshopName: resData.workshopName || 'عام',
      color: resData.color || '#4285F4',
      uploadedBy: resData.uploadedBy || 'قائد المسار',
    };
    const current = this.getResources();
    const updated = [newRes, ...current];

    // حفظ خفيف الوزن للغاية في localStorage ليتسع لمئات الملفات دون أي خطأ في المساحة (IndexedDB يحفظ الثنائيات)
    const storageList = updated.map((r) => ({
      ...r,
      fileData: undefined,
      fileUrl: (r.fileUrl && r.fileUrl.startsWith('data:')) ? `local://${r.id}` : r.fileUrl,
    }));

    try {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(storageList));
    } catch (e) {
      console.warn('Error saving resources to localStorage:', e);
    }
    this.notify();
    return newRes;
  }

  public deleteResource(id: string): void {
    const current = this.getResources();
    const updated = current.filter((r) => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(updated));
    } catch {}
    deletePersistedLocalFile(id).catch(() => {});
    this.notify();
  }

  // --- Showcase Projects Management (معرض مشاريع الأعضاء الحقيقي المعتمد وتحديثات الروابط) ---
  public getShowcaseProjects(): any[] {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.PROJECTS) : null;
    let localList: any[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const mockTitles = [
            'لعبة اختبار الذاكرة',
            'بطاقة ملف عضو',
            'صفحة تعريفية شخصية',
            'آلة حاسبة برمجية',
            'صفحة هبوط تفاعلية',
            'تطبيق قائمة مهام',
            'Memory Game',
          ];
          const mockNames = ['ريم القحطاني', 'سارة الزهراني', 'نورة العتيبي', 'جود الغامدي', 'هند الثقفي', 'لينا الحارثي'];
          localList = parsed.filter((p: any) => {
            if (!p || p.id?.startsWith('proj-demo-')) return false;
            if (mockTitles.some((t) => p.title?.includes(t))) return false;
            if (mockNames.some((n) => p.memberName?.includes(n))) return false;
            if (p.title?.includes('كويز') || p.title?.toLowerCase().includes('quiz') || p.id?.includes('quiz')) return false;
            const gh = (p.githubUrl || '').trim();
            const lv = (p.liveUrl || '').trim();
            const hasRealGh = gh.startsWith('http') && gh !== 'https://github.com' && !gh.includes('quiz') && !gh.includes('gdg-taif.dev');
            const hasRealLv = lv.startsWith('http') && !lv.includes('quiz') && !lv.includes('gdg-taif.dev');
            return hasRealGh || hasRealLv;
          });
        }
      } catch {}
    }

    const gdgColors = ['#34A853', '#4285F4', '#F9AB00', '#EA4335'];
    const projectItems: any[] = [...localList];

    // دالة مساعدة لتفادي التكرار
    const hasProjectWithUrls = (repo?: string, live?: string) => {
      return projectItems.some(
        (p) =>
          (repo && p.githubUrl && p.githubUrl.toLowerCase() === repo.toLowerCase()) ||
          (live && p.liveUrl && p.liveUrl.toLowerCase() === live.toLowerCase())
      );
    };

    // 1. جلب كل التسليمات الحقيقية التي تحتوي على روابط (المعتمدة وقيد المراجعة) مع استبعاد الكويزات تماماً
    this.getSubmissions().forEach((s: any, idx: number) => {
      const repoUrl = s.repo_url || s.repoUrl;
      const liveUrl = s.live_url || s.liveUrl;
      const title = s.taskTitle || s.task?.title || '';
      const notes = s.notes || '';

      // الكويزات معتمدة في بروفايل العضو فقط ولا تظهر في المعرض
      if (
        title.includes('كويز') ||
        title.toLowerCase().includes('quiz') ||
        notes.includes('كويز') ||
        notes.toLowerCase().includes('quiz') ||
        s.id?.includes('quiz') ||
        s.task_id?.includes('quiz') ||
        (repoUrl && repoUrl.includes('quiz'))
      ) {
        return;
      }

      // المعرض فقط مشاريع بروابط حقيقية (GitHub أو رابط المعاينة)
      const isRealRepo = repoUrl && repoUrl.startsWith('http') && repoUrl !== 'https://github.com' && !repoUrl.includes('quiz') && !repoUrl.includes('gdg-taif.dev');
      const isRealLive = liveUrl && liveUrl.startsWith('http') && !liveUrl.includes('quiz') && !liveUrl.includes('gdg-taif.dev');
      if (!isRealRepo && !isRealLive) return;

      if (hasProjectWithUrls(repoUrl, liveUrl)) return;

      const member = this.getMemberById(s.profile_id || s.profileId || s.user_id || s.userId);
      const memberName = member?.fullName || s.studentName || s.profile?.fullName || 'عضو مسار الويب';

      projectItems.push({
        id: s.id || `sub-proj-${idx}`,
        title: title || 'مشروع تطبيقي للمسار',
        memberName,
        stageName: member?.webLevelTitle?.split(':')[1] || 'المرحلة 02',
        status: s.status === 'approved' ? 'approved' : 'in_review',
        color: gdgColors[projectItems.length % gdgColors.length],
        githubUrl: isRealRepo ? repoUrl : (isRealLive ? liveUrl : 'https://github.com'),
        liveUrl: isRealLive ? liveUrl : undefined,
        category: (title || '').includes('ورشة') ? 'تطبيق ورشة' : 'المشاريع الحرة',
        isWorkshopTask: Boolean((title || '').includes('ورشة') || (title || '').includes('تحدي')),
      });
    });

    // 2. جلب اختيارات التحديات التي سلمها الأعضاء بروابط مباشرة
    const choices = typeof this.getChallengeChoices === 'function' ? this.getChallengeChoices() : [];
    choices.forEach((c: any) => {
      if (!c.repoUrl && !c.liveUrl) return;
      const isRealRepo = c.repoUrl && c.repoUrl.startsWith('http') && c.repoUrl !== 'https://github.com' && !c.repoUrl.includes('quiz');
      const isRealLive = c.liveUrl && c.liveUrl.startsWith('http') && !c.liveUrl.includes('quiz');
      if (!isRealRepo && !isRealLive) return;

      if (hasProjectWithUrls(c.repoUrl, c.liveUrl)) return;

      const member = this.getMemberById(c.memberId);
      const memberName = c.memberName || member?.fullName || 'عضو مسار الويب';

      projectItems.push({
        id: c.id || `chal-proj-${c.memberId}`,
        title: c.challengeTitle || 'مشروع التحدي البرمجي',
        memberName,
        stageName: member?.webLevelTitle?.split(':')[1] || 'المرحلة 02',
        status: c.status === 'approved' ? 'approved' : 'in_review',
        color: gdgColors[projectItems.length % gdgColors.length],
        githubUrl: isRealRepo ? c.repoUrl : (isRealLive ? c.liveUrl : 'https://github.com'),
        liveUrl: isRealLive ? c.liveUrl : undefined,
        category: 'تطبيق ورشة',
        isWorkshopTask: true,
      });
    });

    // 3. فحص استفسارات ورسائل الأعضاء في حال أرفق العضو رابط مشروعه الحقيقي
    this.getInquiries().forEach((inq: any) => {
      const rawTitle = inq.title || '';
      if (rawTitle.includes('كويز') || rawTitle.toLowerCase().includes('quiz')) return;

      const details = inq.details || '';
      const urlMatches = details.match(/https?:\/\/[^\s]+/g);
      if (urlMatches && urlMatches.length > 0) {
        const realUrls = urlMatches.filter((u: string) => !u.includes('quiz') && !u.includes('gdg-taif.dev'));
        if (realUrls.length === 0) return;

        const ghUrl = realUrls.find((u: string) => u.includes('github.com')) || realUrls[0];
        const lvUrl = realUrls.find(
          (u: string) =>
            !u.includes('github.com') &&
            (u.includes('vercel.app') ||
              u.includes('netlify.app') ||
              u.includes('.app') ||
              u.includes('.dev') ||
              u.includes('.com') ||
              u.includes('.io'))
        );

        if (hasProjectWithUrls(ghUrl, lvUrl)) return;

        const member = this.getMemberById(inq.userId);
        const memberName = inq.userName || member?.fullName || 'عضو مسار الويب';
        const cleanTitle = rawTitle
          .replace('تسليم جديد:', '')
          .replace('طلب اعتماد', 'مشروع تطبيقي')
          .replace('إثبات مهارة:', '')
          .trim() || 'مشروع تطبيقي';

        projectItems.push({
          id: `inq-proj-${inq.id}`,
          title: cleanTitle,
          memberName,
          stageName: member?.webLevelTitle?.split(':')[1] || 'المرحلة 02',
          status: inq.status === 'approved' ? 'approved' : 'in_review',
          color: gdgColors[projectItems.length % gdgColors.length],
          githubUrl: ghUrl || lvUrl || 'https://github.com',
          liveUrl: lvUrl || undefined,
          category: inq.title?.includes('ورشة') ? 'تطبيق ورشة' : 'المشاريع الحرة',
          isWorkshopTask: Boolean(inq.title?.includes('ورشة') || inq.title?.includes('تحدي')),
        });
      }
    });

    // تصفية نهائية صارمة: المعرض فقط مشاريع بروابط حقيقية والكويزات تظهر في البروفايل فقط
    return projectItems.filter((p) => {
      const t = (p.title || '').toLowerCase();
      if (t.includes('كويز') || t.includes('quiz') || p.id?.includes('quiz')) return false;
      const gh = p.githubUrl || '';
      const lv = p.liveUrl || '';
      const isRealGh = gh.startsWith('http') && gh !== 'https://github.com' && !gh.includes('quiz') && !gh.includes('gdg-taif.dev');
      const isRealLv = lv.startsWith('http') && !lv.includes('quiz') && !lv.includes('gdg-taif.dev');
      return Boolean(isRealGh || isRealLv);
    });
  }

  public getWorkshopShowcaseItems(): any[] {
    const all = this.getShowcaseProjects();
    return all.filter((p) => p.isWorkshopTask || p.category?.includes('ورشة') || p.category?.includes('مهمة') || p.category?.includes('تحدي'));
  }

  public getShowcaseSlots(): ShowcaseSlot[] {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.SHOWCASE_SLOTS) : null;
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public addShowcaseSlot(slotData: Omit<ShowcaseSlot, 'id' | 'createdAt'>): ShowcaseSlot {
    const newSlot: ShowcaseSlot = {
      ...slotData,
      id: `slot-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const current = this.getShowcaseSlots();
    const updated = [newSlot, ...current];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SHOWCASE_SLOTS, JSON.stringify(updated));
    }
    this.notify();
    return newSlot;
  }

  public deleteShowcaseSlot(id: string): void {
    const current = this.getShowcaseSlots();
    const updated = current.filter((s) => s.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SHOWCASE_SLOTS, JSON.stringify(updated));
    }
    this.notify();
  }

  public submitProjectToSlot(submission: {
    slotId?: string;
    slotTitle?: string;
    title: string;
    githubUrl: string;
    liveUrl?: string;
    notes?: string;
    memberId: string;
    memberName: string;
    stageName?: string;
    color?: string;
  }): any {
    const newProj = {
      id: `proj-${Date.now()}`,
      slotId: submission.slotId,
      title: submission.title.trim(),
      memberName: submission.memberName.trim(),
      memberId: submission.memberId,
      stageName: submission.stageName || 'المرحلة 02',
      status: 'approved',
      color: submission.color || '#34A853',
      githubUrl: submission.githubUrl.trim(),
      liveUrl: submission.liveUrl?.trim() || undefined,
      category: 'تطبيق ورشة',
      workshopTaskName: submission.slotTitle || 'تطبيق ورشة',
      isWorkshopTask: true,
      createdAt: new Date().toISOString(),
      notes: submission.notes,
    };
    const current = this.getShowcaseProjects();
    const updated = [newProj, ...current];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    }
    try {
      this.addInquiry({
        userId: submission.memberId,
        userName: submission.memberName,
        title: `تسليم عمل للمعرض: ${submission.title}`,
        category: 'project',
        details: `تسليم عمل في خانة "${submission.slotTitle || 'المعرض'}":\nرابط GitHub: ${submission.githubUrl}\nرابط المعاينة: ${submission.liveUrl || 'لا يوجد'}\nملاحظات: ${submission.notes || 'لا يوجد'}`,
        status: 'approved',
      });
    } catch (e) {
      console.warn('Inquiry notice:', e);
    }
    this.notify();
    return newProj;
  }

  public addShowcaseProject(projData: any): any {
    const newProj = {
      ...projData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: projData.status || 'in_review',
    };
    const current = this.getShowcaseProjects();
    const updated = [newProj, ...current];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    this.notify();
    return newProj;
  }

  public async addChallengeGroup(groupData: Omit<ChallengeGroup, 'id'>): Promise<ChallengeGroup> {
    const newGroup: ChallengeGroup = {
      ...groupData,
      id: `grp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const current = this.getChallengeGroups();
    const updated = [newGroup, ...current];
    localStorage.setItem(STORAGE_KEYS.CHALLENGE_GROUPS, JSON.stringify(updated));

    try {
      await supabase.from('challenge_groups').insert({
        id: newGroup.id,
        title: newGroup.title,
        workshop_id: newGroup.workshopId || null,
        category: newGroup.category,
        due_date: newGroup.dueDate,
        mode: newGroup.mode,
      });
      if (newGroup.options && newGroup.options.length > 0) {
        await supabase.from('challenge_options').insert(
          newGroup.options.map((opt) => ({
            id: opt.id,
            group_id: newGroup.id,
            name: opt.name,
            description: opt.description,
            requirements: opt.requirements,
            points: opt.points,
          }))
        );
      }
    } catch (e) {
      console.warn('Challenge sync note:', e);
    }

    this.notify();
    return newGroup;
  }

  public getChallengeChoices(): ChallengeChoice[] {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CHALLENGE_CHOICES) : null;
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public getMemberChallengeChoice(memberId: string, groupId: string): ChallengeChoice | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGE_CHOICES);
    const choices: ChallengeChoice[] = raw ? JSON.parse(raw) : [];
    return choices.find((c) => c.memberId === memberId && c.groupId === groupId) || null;
  }

  public async saveMemberChallengeChoice(memberId: string, groupId: string, optionId: string): Promise<boolean> {
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGE_CHOICES);
    const choices: ChallengeChoice[] = raw ? JSON.parse(raw) : [];
    const existingIdx = choices.findIndex((c) => c.memberId === memberId && c.groupId === groupId);

    // If existing and already submitted, choice is locked!
    if (existingIdx >= 0 && choices[existingIdx].submitted) {
      return false;
    }

    // 1. الكتابة المباشرة إلى Supabase أولاً كـ Single Source of Truth
    const { error } = await supabase.from('challenge_choices').upsert({
      id: existingIdx >= 0 ? choices[existingIdx].id : `chc-${Date.now()}`,
      profile_id: memberId,
      group_id: groupId,
      option_id: optionId,
      status: 'in_progress',
    });

    if (error) {
      console.error('Supabase saveMemberChallengeChoice error:', error);
      throw new Error(`فشل تسجيل اختيار التحدي في قاعدة البيانات (challenge_choices): ${error.message} (كود: ${error.code})`);
    }

    // 2. تحديث الكاش المحلي فقط بعد تأكيد نجاح العملية في Supabase
    const newChoice: ChallengeChoice = {
      id: existingIdx >= 0 ? choices[existingIdx].id : `chc-${Date.now()}`,
      memberId,
      groupId,
      optionId,
      submitted: false,
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      choices[existingIdx] = newChoice;
    } else {
      choices.push(newChoice);
    }

    localStorage.setItem(STORAGE_KEYS.CHALLENGE_CHOICES, JSON.stringify(choices));
    this.notify();
    return true;
  }

  public async submitMemberChallenge(
    memberId: string,
    groupId: string,
    repoUrl: string,
    liveUrl?: string
  ): Promise<boolean> {
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGE_CHOICES);
    const choices: ChallengeChoice[] = raw ? JSON.parse(raw) : [];
    const targetIdx = choices.findIndex((c) => c.memberId === memberId && c.groupId === groupId);
    if (targetIdx === -1) {
      throw new Error('لم يتم العثور على اختيار التحدي المسبق لهذا العضو.');
    }

    // ضمان وجود المهمة في جدول tasks لتفادي انتهاك foreign key
    try {
      await supabase.from('tasks').upsert(
        {
          id: groupId,
          title: `تحدي مسار الويب (${groupId})`,
          track_level: 'beginner',
          points: 25,
          is_active: true,
        },
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('tasks upsert warning:', e);
    }

    // 1. الكتابة المباشرة إلى جدول submissions الفعلي في Supabase أولاً
    const { error } = await supabase.from('submissions').insert({
      id: `sub-${Date.now()}`,
      profile_id: memberId,
      task_id: groupId,
      repo_url: repoUrl,
      live_url: liveUrl || null,
      status: 'in_review',
    });

    if (error) {
      console.error('Supabase submitMemberChallenge error:', error);
      throw new Error(`فشل تسليم التحدي في قاعدة البيانات (submissions): ${error.message} (كود: ${error.code})`);
    }

    // إشعار لوحة قيادة القائدة بتسليم التحدي الجديد
    const memberName = this.getMembers().find((m) => m.id === memberId)?.fullName || 'العضو';
    try {
      await this.addInquiry({
        title: `تسليم تحدي عملي جديد`,
        details: `العضو ${memberName} سلّم التحدي البرمجي بنجاح.\nرابط المستودع (GitHub): ${repoUrl}${liveUrl ? `\nرابط المعاينة المباشرة: ${liveUrl}` : ''}`,
        userId: memberId,
        userName: memberName,
      });
    } catch {}

    // 2. تحديث الكاش المحلي فقط بعد تأكيد نجاح العملية في Supabase
    choices[targetIdx] = {
      ...choices[targetIdx],
      submitted: true,
      repoUrl,
      liveUrl,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.CHALLENGE_CHOICES, JSON.stringify(choices));
    await this.refreshData();
    this.notify();
    return true;
  }

  /**
   * تسليم موحد لأي مهمة ورشة أو تحدٍ تخصصي:
   * يسجل في Supabase submissions وفي الكاش المحلي ويخطر قادة المسار
   */
  public async submitTaskOrChallenge(payload: {
    profileId: string;
    taskId: string;
    taskTitle: string;
    repoUrl?: string;
    liveUrl?: string;
    submissionText?: string;
    notes?: string;
  }): Promise<boolean> {
    const subId = `sub-${Date.now()}`;
    const member = this.getMemberById(payload.profileId) || this.profile;
    const memberName = member?.fullName || 'عضو المسار';

    // 1. إضافة المهمة إلى جدول tasks في حال لم تكن مسجلة
    try {
      await supabase.from('tasks').upsert(
        {
          id: payload.taskId,
          title: payload.taskTitle,
          track_level: 'beginner',
          points: 50,
          is_active: true,
        },
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('tasks upsert warning:', e);
    }

    // 2. إدراج التسليم المباشر في جدول submissions في Supabase
    try {
      await supabase.from('submissions').insert({
        id: subId,
        profile_id: payload.profileId,
        task_id: payload.taskId,
        repo_url: payload.repoUrl || null,
        live_url: payload.liveUrl || null,
        submission_text: payload.submissionText || null,
        notes: payload.notes || null,
        status: 'in_review',
      });
    } catch (e) {
      console.error('Supabase submissions insert error:', e);
    }

    // 3. تحديث مصفوفة التسليمات محلياً فوراً لضمان ظهورها عند القادة دون أي تأخير
    const newSubmissionItem: any = {
      id: subId,
      task_id: payload.taskId,
      profile_id: payload.profileId,
      user_id: payload.profileId,
      studentName: memberName,
      taskTitle: payload.taskTitle,
      repo_url: payload.repoUrl,
      live_url: payload.liveUrl,
      repoUrl: payload.repoUrl,
      liveUrl: payload.liveUrl,
      submission_text: payload.submissionText,
      notes: payload.notes,
      status: 'in_review',
      submitted_at: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      profile: { fullName: memberName, major: member?.major || 'مسار الويب' },
      task: { title: payload.taskTitle, points: 50, track_level: 'beginner' },
    };

    this.submissions = [newSubmissionItem, ...this.submissions];
    this.notify();

    // 4. إنشاء إشعار لقادة المسار
    try {
      await this.addInquiry({
        title: `تسليم جديد: ${payload.taskTitle}`,
        details: `سلّم/ت ${memberName} مهمة تطبيقية جديدة بانتظار المراجعة والاعتماد.\n${payload.repoUrl ? `المستودع: ${payload.repoUrl}` : ''}${payload.liveUrl ? `\nالمعاينة: ${payload.liveUrl}` : ''}`,
        userId: payload.profileId,
        userName: memberName,
      });
    } catch {}

    return true;
  }

  /**
   * طلب إذن وصلاحية للقائدة غيداء من حسابات الإشراف (أثير، عامر، رنا)
   */
  public async requestSupervisorPermission(supervisorName: string, actionType: string): Promise<void> {
    const title = `طلب اعتماد من الإشراف (${supervisorName})`;
    const details = `طلب المشرف/ـة ${supervisorName} إذن صلاحية لاعتماد (${actionType}) في منصة مسار الويب. يرجى التوجيه والاعتماد.`;
    await this.addInquiry({
      title,
      details,
      userId: this.profile?.id || 'supervisor',
      userName: supervisorName,
    });
  }

  // --- Web Lab Challenges Management ---
  public getLabChallenges(): LabChallenge[] {
    if (typeof window === 'undefined') return DEFAULT_LAB_CHALLENGES;
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_LAB_CHALLENGES);
    const custom: LabChallenge[] = raw ? JSON.parse(raw) : [];
    return [...DEFAULT_LAB_CHALLENGES, ...custom];
  }

  public getActiveLabChallenge(): LabChallenge {
    const all = this.getLabChallenges();
    if (typeof window === 'undefined') return all[0];
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_LAB_CHALLENGE) || 'lab-1';
    return all.find((c) => c.id === activeId) || all[0];
  }

  public setActiveLabChallenge(challengeId: string): boolean {
    if (typeof window === 'undefined') return false;
    const all = this.getLabChallenges();
    const target = all.find((c) => c.id === challengeId);
    if (!target) return false;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_LAB_CHALLENGE, challengeId);

    // إشعار جميع أعضاء المسار بالتحدي الجديد
    const members = this.getMembers();
    members.forEach((m) => {
      this.addNotification({
        userId: m.id,
        type: 'task',
        title: 'تحدي جديد في مختبر الويب!',
        description: `${target.title} · +${target.points} نقاط`,
        badgeText: 'مختبر',
        targetTab: 'lab',
      });
    });

    this.notify();
    return true;
  }

  public addCustomLabChallenge(data: Omit<LabChallenge, 'id'>): LabChallenge {
    const newId = `lab-custom-${Date.now()}`;
    const newChallenge: LabChallenge = {
      ...data,
      id: newId,
    };
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_LAB_CHALLENGES);
      const custom: LabChallenge[] = raw ? JSON.parse(raw) : [];
      custom.push(newChallenge);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_LAB_CHALLENGES, JSON.stringify(custom));
      this.setActiveLabChallenge(newId);
    }
    this.notify();
    return newChallenge;
  }

  // --- خطة ورش الإدارة المجدولة (Admin Scheduled Workshops) ---
  public getAdminScheduledWorkshops(): AdminScheduledWorkshop[] {
    if (typeof window === 'undefined') return INITIAL_ADMIN_SCHEDULED_WORKSHOPS;
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_WORKSHOPS);
    return raw ? JSON.parse(raw) : INITIAL_ADMIN_SCHEDULED_WORKSHOPS;
  }

  public updateAdminScheduledWorkshop(updated: AdminScheduledWorkshop) {
    if (typeof window === 'undefined') return;
    const list = this.getAdminScheduledWorkshops();
    const idx = list.findIndex((w) => w.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_WORKSHOPS, JSON.stringify(list));
    this.notify();
  }

  public publishAdminScheduledWorkshop(workshopId: string): boolean {
    if (typeof window === 'undefined') return false;
    const list = this.getAdminScheduledWorkshops();
    const ws = list.find((w) => w.id === workshopId);
    if (!ws) return false;

    ws.isPublished = true;
    ws.publishedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ADMIN_WORKSHOPS, JSON.stringify(list));

    // إضافة الورشة كورشة معتمدة عامة للأعضاء
    const publicWs: Workshop = {
      id: ws.id,
      title: `${ws.titleAr} | ${ws.titleEn}`,
      description: `المقدّم: ${ws.presenter} · الموعد: ${ws.dateStr} · المحاور: ${ws.pillars.slice(0, 2).join(' | ')}`,
      scheduledAt: ws.dateStr,
      topics: ws.pillars,
      tasks: [ws.taskTitle],
      imageUrl: ws.posterUrl,
      registrationUrl: ws.meetingUrl,
      createdAt: new Date().toISOString(),
    };

    const currentWorkshops = this.getWorkshops();
    if (!currentWorkshops.some((w) => w.id === ws.id)) {
      currentWorkshops.unshift(publicWs);
      localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(currentWorkshops));
    }

    // إضافة التاسك كالمهمة المعتمدة
    this.tasks = [
      {
        id: `task-${ws.id}`,
        title: `${ws.taskNumber} — ${ws.taskTitle}`,
        description: ws.taskDescription,
        pointsReward: 50,
        due_date: ws.dateStr,
        workshop_id: ws.id,
        is_active: true,
      },
      ...this.tasks,
    ];

    // إشعار الأعضاء بالورشة والمهمة
    const members = this.getMembers();
    members.forEach((m) => {
      this.addNotification({
        userId: m.id,
        type: 'workshop',
        title: `ورشة معتمدة: ${ws.titleAr}`,
        description: `المقدّم: ${ws.presenter} · ${ws.dateStr}`,
        badgeText: 'ورشة',
        targetTab: 'home',
      });
    });

    this.notify();
    return true;
  }

  // --- التحضير والتسليمات الميدانية (Attendance & Task Sheet) ---
  public getAttendanceMap(): Record<string, WorkshopAttendanceRecord> {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return raw ? JSON.parse(raw) : {};
  }

  public getWorkshopAttendance(workshopId: string): Record<string, WorkshopAttendanceRecord> {
    const all = this.getAttendanceMap();
    const result: Record<string, WorkshopAttendanceRecord> = {};
    Object.entries(all).forEach(([key, rec]) => {
      if (rec.workshopId === workshopId) {
        result[rec.memberId] = rec;
      }
    });
    return result;
  }

  public toggleAttendance(workshopId: string, memberId: string, attended: boolean): boolean {
    if (typeof window === 'undefined') return false;
    const all = this.getAttendanceMap();
    const key = `${workshopId}_${memberId}`;
    all[key] = {
      workshopId,
      memberId,
      attended,
      markedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));

    // إذا تم التحضير، منح نقاط الحضور (+20 نقطة)
    if (attended) {
      this.awardPoints(memberId, 20, 'حضور ورشة عمل تطبيقية 🎯');
    }

    this.notify();
    return true;
  }

  // --- إدارة فعاليات وورش شيت التحضير (Attendance Events) ---
  public getAttendanceEvents(): AttendanceEvent[] {
    if (typeof window === 'undefined') return INITIAL_ATTENDANCE_EVENTS;
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE_EVENTS, JSON.stringify(INITIAL_ATTENDANCE_EVENTS));
      return INITIAL_ATTENDANCE_EVENTS;
    }
    try {
      const list = JSON.parse(raw);
      return Array.isArray(list) && list.length > 0 ? list : INITIAL_ATTENDANCE_EVENTS;
    } catch {
      return INITIAL_ATTENDANCE_EVENTS;
    }
  }

  public addAttendanceEvent(title: string, type: 'workshop' | 'meeting' | 'other' = 'workshop', dateStr: string = 'نوفمبر 2026', pointsReward: number = 20): AttendanceEvent {
    const newEvt: AttendanceEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      type,
      dateStr: dateStr.trim(),
      pointsReward,
    };
    const current = this.getAttendanceEvents();
    const updated = [...current, newEvt];
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_EVENTS, JSON.stringify(updated));
    this.notify();
    return newEvt;
  }

  public getMemberAttendanceStats(memberId: string): { attended: number; total: number; rate: number } {
    const events = this.getAttendanceEvents();
    const map = this.getAttendanceMap();
    const attended = events.filter((evt) => {
      const key = `${evt.id}_${memberId}`;
      const fallbackKey = `${evt.id.replace('evt-', 'plan-')}_${memberId}`;
      return map[key]?.attended || map[fallbackKey]?.attended;
    }).length;
    const total = events.length;
    const rate = total > 0 ? Math.round((attended / total) * 100) : 100;
    return { attended, total, rate };
  }

  public getMemberAttendanceRate(memberId: string): number {
    return this.getMemberAttendanceStats(memberId).rate;
  }

  // --- حساب مؤشر التفاعل المتوازن الشامل (Engagement Breakdown: حضور + مهام + مشاركة) ---
  public getEngagementBreakdown(memberId: string) {
    const member = this.getMemberById(memberId);
    const attendanceStats = this.getMemberAttendanceStats(memberId);

    // 1. الحضور (وزن 35%)
    const attendanceScore = attendanceStats.rate;

    // 2. المهام والتحديات (وزن 35%)
    const submissions = this.getSubmissions().filter(
      (s: any) => (s.profile_id === memberId || s.userId === memberId || s.profileId === memberId) && s.status === 'approved'
    );
    const totalTasksCount = 8;
    const tasksRate = Math.min(100, Math.round((submissions.length / totalTasksCount) * 100));

    // 3. المشاركة والتفاعل (وزن 30%)
    const pts = member?.points || 0;
    const participationRate = Math.min(100, Math.round((pts / 300) * 100));

    // الإجمالي المتوازن
    const totalScore = Math.min(
      100,
      Math.round(attendanceScore * 0.35 + tasksRate * 0.35 + participationRate * 0.30)
    );

    return {
      totalScore,
      attendanceScore,
      tasksRate,
      participationRate,
      totalEngagementPercent: totalScore,
      attendanceRate: attendanceScore,
      participationScore: participationRate,
      attendedWorkshops: attendanceStats.attended,
      totalWorkshops: attendanceStats.total,
      completedTasks: submissions.length,
      totalTasks: totalTasksCount,
    };
  }

  // --- حساب الشارات المستحقة لكل عضو (Badges Calculation) ---
  public getMemberBadges(memberId: string) {
    const member = this.getMemberById(memberId);
    const memberPoints = member?.points || 0;

    // احتساب الورش التي حضرها
    const attendanceMap = this.getAttendanceMap();
    const attendedWorkshopsCount = Object.values(attendanceMap).filter(
      (a) => a.memberId === memberId && a.attended
    ).length;

    // احتساب المهام المعتمدة المسلّمة
    const submissions = this.getSubmissions();
    const approvedTasksCount = submissions.filter(
      (s) => (s.profile_id === memberId || s.userId === memberId) && s.status === 'approved'
    ).length;

    return TRACK_BADGES.map((badge) => {
      let isUnlocked = false;
      let currentProgress = 0;

      if (badge.category === 'points') {
        currentProgress = memberPoints;
        isUnlocked = memberPoints >= badge.targetValue;
      } else if (badge.category === 'workshops') {
        currentProgress = attendedWorkshopsCount;
        isUnlocked = attendedWorkshopsCount >= badge.targetValue;
      } else if (badge.category === 'tasks') {
        currentProgress = approvedTasksCount;
        isUnlocked = approvedTasksCount >= badge.targetValue;
      }

      return {
        ...badge,
        unlocked: isUnlocked,
        currentProgress,
        progressPercent: Math.min(Math.round((currentProgress / badge.targetValue) * 100), 100),
      };
    });
  }

  public resetIntro() {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEYS.INTRO_SEEN);
    this.notify();
  }
}

export const store = new StoreManager();

