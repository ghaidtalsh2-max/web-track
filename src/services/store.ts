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
} from '../types';
import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

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
};

// مجموعات التحديات والخيارات المعتمدة (المعمارية الرسمية للقسم 3)
export const INITIAL_CHALLENGE_GROUPS: ChallengeGroup[] = [
  {
    id: 'grp-flexbox-grid',
    title: 'تحدي ورشة Flexbox و CSS Grid التطبيقي',
    workshopId: 'ws-grid-flexbox',
    workshopTitle: 'تطبيق Flexbox و Grid عملياً في تصميم صفحات الويب',
    category: 'workshop',
    dueDate: 'الخميس القادم · ١١:٥٩ مساءً',
    mode: 'choice',
    options: [
      {
        id: 'opt-grid-store',
        groupId: 'grp-flexbox-grid',
        name: 'الخيار أ: بناء شبكة منتجات متجر متجاوبة (Product Grid)',
        description: 'تصميم واجهة متجر تفاعلية تعرض بطاقات منتجات تتكيف تلقائياً مع حجم الشاشة.',
        requirements: 'استخدام CSS Grid لتوزيع المنتجات (minmax & auto-fit)، وFlexbox داخل كل بطاقة لتنسيق السعر والعنوان، وزر شراء بتأثير تفاعلي.',
        points: 50,
      },
      {
        id: 'opt-dashboard-widgets',
        groupId: 'grp-flexbox-grid',
        name: 'الخيار ب: بناء لوحة إحصائيات تحكم (Dashboard Widgets)',
        description: 'تصميم لوحة مؤشرات رقمية تحتوي ٤ ودجات ملونة بنظام البطاقات ثلاثية الأبعاد.',
        requirements: 'توزيع البطاقات بنظام CSS Grid متناسق، استخدام ألوان الهوية الأربعة، خط Arimo للأرقام، وتأثير رفع لطيف عند المرور.',
        points: 60,
      },
    ],
  },
  {
    id: 'grp-side-button',
    title: 'تحدي جانبي: زر الويب الساحر (CSS Micro-interactions)',
    category: 'side_fun',
    dueDate: 'الأحد القادم · ٨:٠٠ مساءً',
    mode: 'mandatory',
    options: [
      {
        id: 'opt-magic-button',
        groupId: 'grp-side-button',
        name: 'زر تفاعلي يطلق حركة مبهجة',
        description: 'بناء زر أنيق بالهوية الرقمية يتفاعل بحركات ناعمة عند النقر والتحويم.',
        requirements: 'تأثيرات Hover بنسبة تحول translateY(-4px)، إطار داكن 2px، وظل ثلاثي الأبعاد مع إطلاق تأثير بالضغط.',
        points: 35,
      },
    ],
  },
];


// الورش الرسمية المعتمدة (فارغة افتراضياً حتى يضيفها القادة)
export const INITIAL_WORKSHOPS: Workshop[] = [];

// التنبيهات الأولية (مطابقة لصفحة 9 في المرجع)
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'member-noura',
    type: 'points',
    title: 'نقاط جديدة',
    description: 'قبلنا تسليمك: صفحتك الأولى',
    badgeText: '30+',
    pointsAmount: 30,
    targetTab: 'home',
    createdAt: 'منذ ساعتين',
    read: true,
  },
  {
    id: 'notif-2',
    userId: 'member-noura',
    type: 'workshop',
    title: 'ورشة جديدة',
    description: 'Grid و Flexbox · الأحد ٨ مساءً',
    badgeText: '◆',
    targetTab: 'home',
    createdAt: 'منذ يوم',
    read: true,
  },
  {
    id: 'notif-3',
    userId: 'member-noura',
    type: 'task',
    title: 'مهمة جديدة',
    description: 'تحدي: زر يتفاعل · آخر موعد الخميس',
    badgeText: '!',
    targetTab: 'home',
    createdAt: 'منذ يومين',
    read: true,
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

    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    }
    const rawPolls = localStorage.getItem(STORAGE_KEYS.POLLS);
    if (!rawPolls || rawPolls.includes('poll-1') || rawPolls.includes('Flexbox')) {
      localStorage.setItem(STORAGE_KEYS.POLLS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VOTES)) {
      localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WORKSHOPS)) {
      localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(INITIAL_WORKSHOPS));
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
    const u = username.trim().toLowerCase().replace(/\s+/g, '');
    return u.includes('@') ? u : `${u}@${AUTH_EMAIL_DOMAIN}`;
  }

  private initAuth() {
    if (this.authInitStarted) return;
    this.authInitStarted = true;

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
    return this.profile?.role === 'track_leader' || this.profile?.role === 'supervisor';
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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
    const role: UserProfile['role'] =
      p.role === 'track_leader' || p.role === 'supervisor' ? p.role : 'member';
    const settings: UserSettings = { ...DEFAULT_SETTINGS, ...(p.settings || {}) };
    const phone = p.phone || p.settings?.phone || '';
    const avatarUrl = p.avatar_url || p.settings?.avatarUrl || '';
    return {
      id: p.id,
      fullName: p.full_name || 'عضو مسار',
      username: p.username || '',
      gender: p.gender || 'female',
      role,
      roleTitle: p.role_title || 'عضو مسار الويب 🚀',
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

    const mappedMembers: UserProfile[] = (profilesRes.data || []).map((r: any) => {
      const m = this.mapProfile(r);
      const userSkills = skillsByProfile.get(r.id) || [];
      m.detailedSkills = userSkills;
      m.skills = userSkills.map((s) => s.name);
      return m;
    });

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
    this.inquiries = (inqRes.data || []).map((r: any) => ({
      id: r.id,
      userId: r.profile_id,
      userName: r.user_name,
      userAvatar: (r.user_name || 'م').charAt(0),
      title: r.title,
      details: r.details,
      status: r.status,
      responseText: r.response_text || undefined,
      respondedBy: r.answered_by || undefined,
      respondedAt: r.answered_at ? new Date(r.answered_at).toLocaleDateString('ar-SA') : undefined,
      createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString('ar-SA') : '',
    }));
    this.pointsLedger = ((ledgerRes as any)?.data || []).map((l: any) => ({
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

    const proofLabel =
      proofType === 'quiz'
        ? 'طلب كويز'
        : proofType === 'app_link'
        ? 'رابط تطبيق عملي'
        : 'رابط Git للمشروع';

    this.addInquiry({
      id: `skill-proof-${Date.now()}`,
      userId,
      userName: target.fullName,
      subject: `تسليم إثبات مهارة: ${skillName}`,
      message: `العضو ${target.fullName} قدم إثبات لاعتماد المهارة (${proofLabel}): ${proofValue}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

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

    this.patchMember(userId, {
      detailedSkills: updated,
      skills: Array.from(new Set([...(target.skills || []), skillName])),
      points: (target.points || 0) + 25,
    });

    try {
      await this.addPointsLedgerEntry(userId, 25, `اجتياز كويز اعتماد مهارة ${skillName} (${score}/4)`);
    } catch (e) {
      console.warn('Could not record in points_ledger:', e);
    }

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

  // --- User Badges & Achievements ---
  public getUserBadges(userId: string): BadgeItem[] {
    const member = this.members.find((m) => m.id === userId);
    if (!member) return [];

    const badges: BadgeItem[] = [];
    const stats = this.getUserStats(userId);

    if (member.bio && member.bio.length >= 20) {
      badges.push({
        id: 'badge-first-step',
        name: 'الخطوة الأولى',
        description: 'إكمال التسجيل وتعيين النبذة التعريفية في المسار',
        iconName: 'Sparkles',
        category: 'milestone',
        reason: 'إعداد الملف الشخصي والنبذة التعريفية بنجاح ✨',
        awardedAt: member.onboarded_at || 'معتمد',
      });
    }

    if (member.points >= 50 || stats.challengesCompleted >= 1) {
      badges.push({
        id: 'badge-html-hero',
        name: 'بطل الويب التأسيسي',
        description: 'إتقان أساسيات HTML5 وبناء أول هيكل ويب نظيف',
        iconName: 'FileCode2',
        category: 'challenge',
        reason: 'إنجاز أول تحدي في مسار تطوير الويب 🚀',
      });
    }

    if (stats.projectsCompleted >= 1) {
      badges.push({
        id: 'badge-first-project',
        name: 'أول مشروع معتمد',
        description: 'تسليم أول مشروع تطبيقي واعتماده رسمياً من قادة المسار',
        iconName: 'CheckCircle2',
        category: 'milestone',
        reason: 'اعتماد رابط المشروع البرمجي من قيادة المسار 🎯',
      });
    }

    if (member.points >= 200) {
      badges.push({
        id: 'badge-css-artist',
        name: 'مهندس الواجهات',
        description: 'تصميم واجهة متناسقة بهوية قوقل وتطبيق CSS الحديث',
        iconName: 'Palette',
        category: 'challenge',
        reason: 'الوصول إلى 200 نقطة إنجاز في بناء وتنسيق الواجهات 🎨',
      });
    }

    if (stats.initiativesCount >= 1) {
      badges.push({
        id: 'badge-community-star',
        name: 'نجم المجتمع',
        description: 'التفاعل المستمر في استبيانات ومبادرات المسار',
        iconName: 'HeartHandshake',
        category: 'community',
        reason: 'المشاركة الفعالة في مبادرات ونقاشات المسار 🤝',
      });
    }

    if (member.role === 'track_leader' || member.role === 'supervisor' || member.points >= 500) {
      badges.push({
        id: 'badge-leader-pioneer',
        name: member.gender === 'female' ? 'رائدة الويب' : 'رائد الويب',
        description: 'القيادة التقنية والمساهمة الفاعلة في توجيه أعضاء المسار',
        iconName: 'Crown',
        category: 'leadership',
        reason: 'التميز القيادي والإشرافي في مجتمع مطوري قوقل 👑',
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

    const memberOfTheMonth = sortedByMonth.length > 0 ? sortedByMonth[0] : null;

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
  public async awardPoints(userId: string, amount: number, reason?: string, awardedBy?: string): Promise<boolean> {
    // 1. الكتابة المباشرة إلى جدول points_ledger الفعلي في Supabase أولاً
    // approved_by مفتاح أجنبي إلى profiles.id → نستخدم معرّف المستخدم الحالي دائماً
    const approverId = this.getCurrentUser()?.id;
    if (!approverId) throw new Error('يجب تسجيل الدخول لمنح النقاط.');
    const { error } = await supabase.from('points_ledger').insert({
      profile_id: userId,
      points_amount: amount,
      reason: reason || 'مكافأة مسار الويب',
      // (profile_id, activity_key) فريد؛ المفتاح اليدوي يجب أن يكون فريداً لكل منحة
      activity_key: `manual-${Date.now()}-${userId.slice(0, 8)}-${Math.random().toString(36).slice(2, 7)}`,
      approved_by: approverId,
    });

    if (error) {
      console.error('Supabase awardPoints error:', error);
      throw new Error(`فشل قيد النقاط في قاعدة البيانات (points_ledger): ${error.message}`);
    }

    // 2. إعادة تحميل الأرقام الفعلية من Supabase (المصدر الوحيد للحقيقة)
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
    titleOrObj: string | { title: string; details: string; userId?: string; userName?: string; userAvatar?: string },
    detailsArg?: string
  ): Promise<Inquiry> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('يجب تسجيل الدخول لإرسال استفسار.');
    let title = '';
    let details = '';
    // الاستفسار يُنسب دائماً للمستخدم المسجّل (لا يمكن تمرير هوية أخرى)
    const profileId = user.id;
    const userName = user.fullName;
    const userAvatar = user.avatarLetter;

    if (typeof titleOrObj === 'object') {
      title = titleOrObj.title || '';
      details = titleOrObj.details || '';
    } else {
      title = titleOrObj || '';
      details = detailsArg || '';
    }

    const inqId = `inq-${Date.now()}`;

    // 1. الكتابة المباشرة إلى جدول inquiries الفعلي في Supabase أولاً
    const { error } = await supabase.from('inquiries').insert({
      id: inqId,
      profile_id: profileId,
      user_name: userName,
      title: title.trim(),
      details: details.trim(),
      status: 'new',
    });

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
      status: 'new',
      createdAt: 'الآن',
    };

    this.inquiries = [newInquiry, ...this.inquiries];
    this.notify();
    return newInquiry;
  }

  public async answerInquiry(inquiryId: string, answerText: string, answeredBy: string): Promise<boolean> {
    const now = new Date().toISOString();

    // 1. التحديث المباشر في جدول inquiries الفعلي في Supabase (عمود response_text)
    const { error } = await supabase
      .from('inquiries')
      .update({
        status: 'answered',
        response_text: answerText.trim(),
        answered_by: answeredBy,
        answered_at: now,
      })
      .eq('id', inquiryId);

    if (error) {
      console.error('Supabase answerInquiry error:', error);
      throw new Error(`فشل حفظ الرد في قاعدة البيانات (inquiries): ${error.message}`);
    }

    // 2. تحديث الكاش المحلي بعد التأكيد
    this.inquiries = this.inquiries.map((inq) => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status: 'answered' as const,
          responseText: answerText.trim(),
          respondedBy: answeredBy,
          respondedAt: 'الآن',
        };
      }
      return inq;
    });

    this.notify();
    return true;
  }

  // --- Polls (polls, poll_options, poll_responses in Supabase) ---
  public getPoll(): Poll | null {
    const list = this.getPolls();
    return list.length > 0 ? list[0] : null;
  }

  public getPolls(): Poll[] {
    const raw = localStorage.getItem(STORAGE_KEYS.POLLS);
    if (!raw) return [INITIAL_POLL];
    try {
      const list = JSON.parse(raw);
      const filtered = Array.isArray(list) ? list.filter((p: Poll) => p.id !== 'poll-1') : [];
      return filtered.length > 0 ? filtered : [INITIAL_POLL];
    } catch {
      return [INITIAL_POLL];
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

      // 1. الأحد (index 0): ورشة العمل الرئيسية
      if (index === 0 && workshops.length > 0) {
        activities.push({
          id: workshops[0].id,
          type: 'workshop',
          title: workshops[0].title,
          time: '٨:٠٠ مساءً',
          color: '#34A853', // أخضر للورشة
        });
      }

      // ورش إضافية مجدولة بحسب اليوم
      workshops.slice(1).forEach((w) => {
        if (w.scheduledAt.includes(d.full)) {
          activities.push({
            id: w.id,
            type: 'workshop',
            title: w.title,
            time: 'مساءً',
            color: '#34A853',
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
    return this.tasks;
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
    const { error } = await supabase
      .from('submissions')
      .update({ status: 'approved', points_awarded: points })
      .eq('id', submissionId);
    if (error) {
      throw new Error(`فشل اعتماد التسليم في قاعدة البيانات: ${error.message}`);
    }
    await this.awardPoints(profileId, points, reason);
  }

  public getRealStats() {
    const members = this.getMembers().filter((m) => m.role === 'member');
    const submissions = this.getSubmissions();
    const pendingSubmissions = submissions.filter((s) => s.status === 'in_review');
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
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGE_GROUPS);
    return raw ? JSON.parse(raw) : INITIAL_CHALLENGE_GROUPS;
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

    // 1. الكتابة المباشرة إلى جدول submissions الفعلي في Supabase أولاً
    const { error } = await supabase.from('submissions').insert({
      id: `sub-${Date.now()}`,
      profile_id: memberId,
      task_id: groupId,
      repo_url: repoUrl,
      live_url: liveUrl || null,
      status: 'pending',
    });

    if (error) {
      console.error('Supabase submitMemberChallenge error:', error);
      throw new Error(`فشل تسليم التحدي في قاعدة البيانات (submissions): ${error.message} (كود: ${error.code})`);
    }

    // 2. تحديث الكاش المحلي فقط بعد تأكيد نجاح العملية في Supabase
    choices[targetIdx] = {
      ...choices[targetIdx],
      submitted: true,
      repoUrl,
      liveUrl,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.CHALLENGE_CHOICES, JSON.stringify(choices));
    this.notify();
    return true;
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

  public resetIntro() {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEYS.INTRO_SEEN);
    this.notify();
  }
}

export const store = new StoreManager();

