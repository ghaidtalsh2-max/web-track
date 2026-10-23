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
} from '../types';

export const DEFAULT_SETTINGS: UserSettings = {
  fontSize: 17,
  theme: 'light',
  language: 'ar',
  reducedMotion: false,
  eyeComfort: false,
  celebrations: true,
  highContrast: false,
};

// ملفات الأعضاء والقادة المعتمدين بالهوية الرسمية
export const CLUB_PROFILES: UserProfile[] = [
  // 1. نورة العتيبي (عضو مسار الويب الأساسي - مكتمل النبذة للدخول المباشر)
  {
    id: 'member-noura',
    fullName: 'نورة العتيبي',
    username: 'noura.web26',
    gender: 'female',
    role: 'member',
    roleTitle: 'عضو مسار الويب 🚀',
    webLevel: 'intermediate',
    webLevelTitle: 'المرحلة 2: التطوير التفاعلي',
    levelNumber: 2,
    points: 350,
    avatarLetter: 'ن',
    badgeColor: '#4285F4',
    major: 'علوم حاسب',
    academicYear: 'السنة الثالثة',
    bio: 'طالبة علوم حاسب بجامعة الطائف، شغوفة بتصميم وتطوير واجهات وتجارب الويب الحديثة التفاعلية.',
    onboarded_at: '2026-10-20T10:00:00Z',
    skills: ['HTML', 'CSS'],
    completedStages: [1],
    currentStage: 2,
    settings: { ...DEFAULT_SETTINGS },
  },
  // حساب لتجربة شاشة النبذة الإلزامية عند الرغبة
  {
    id: 'member-new',
    fullName: 'سارة الزهراني',
    username: 'sara.new',
    gender: 'female',
    role: 'member',
    roleTitle: 'عضو جديد (تجربة أول دخول) 🚀',
    webLevel: 'beginner',
    webLevelTitle: 'المرحلة 1: التأسيس والتصميم البرمجي',
    levelNumber: 1,
    points: 50,
    avatarLetter: 'س',
    badgeColor: '#34A853',
    major: 'نظم معلومات',
    academicYear: 'السنة الأولى',
    bio: '',
    onboarded_at: null, // null يعني يفتح شاشة النبذة الإلزامية لاختبارها
    skills: [],
    completedStages: [],
    currentStage: 1,
    settings: { ...DEFAULT_SETTINGS },
  },

  // 2. غيداء تركي الشريف (قائدة مسار الويب)
  {
    id: 'leader-ghaidaa',
    fullName: 'غيداء تركي الشريف',
    username: 'ghaidaa.lead',
    gender: 'female',
    role: 'track_leader',
    roleTitle: 'قائدة مسار الويب 🛡️',
    webLevel: 'track_leader',
    webLevelTitle: 'قيادة وإدارة مسار الويب',
    levelNumber: 3,
    points: 1250,
    avatarLetter: 'غ',
    badgeColor: '#4285F4',
    major: 'علوم حاسب',
    academicYear: 'السنة الرابعة',
    bio: 'قائدة مسار تصميم وتطوير الويب بنادي قوقل للطلبة المطورين بجامعة الطائف.',
    onboarded_at: '2026-09-01T10:00:00Z',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Design Systems', 'Leadership'],
    completedStages: [1, 2, 3],
    currentStage: 3,
    settings: { ...DEFAULT_SETTINGS },
  },
  // 3. ريتال القثامي (قائدة مسار الويب)
  {
    id: 'leader-retal',
    fullName: 'ريتال القثامي',
    username: 'retal.lead',
    gender: 'female',
    role: 'track_leader',
    roleTitle: 'قائدة مسار الويب 🛡️',
    webLevel: 'track_leader',
    webLevelTitle: 'قيادة وإدارة مسار الويب',
    levelNumber: 3,
    points: 1250,
    avatarLetter: 'ر',
    badgeColor: '#34A853',
    major: 'تقنية معلومات',
    academicYear: 'السنة الرابعة',
    bio: 'قائدة مسار تصميم وتطوير الويب وشغوفة بتطوير البرمجيات والواجهات السحابية.',
    onboarded_at: '2026-09-01T10:00:00Z',
    skills: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Supabase', 'Leadership'],
    completedStages: [1, 2, 3],
    currentStage: 3,
    settings: { ...DEFAULT_SETTINGS },
  },
  // 4. دانا الحارثي (عضو مكتمل النبذة - مبتدئة)
  {
    id: 'member-dana',
    fullName: 'دانا الحارثي',
    username: 'dana.web26',
    gender: 'female',
    role: 'member',
    roleTitle: 'عضو مسار الويب 🚀',
    webLevel: 'beginner',
    webLevelTitle: 'المرحلة 1: التأسيس والتصميم البرمجي',
    levelNumber: 1,
    points: 165,
    avatarLetter: 'د',
    badgeColor: '#F9AB00',
    major: 'تقنية معلومات',
    academicYear: 'السنة الثانية',
    bio: 'طالبة تقنية معلومات شغوفة بتعلم بناء واجهات الويب التفاعلية الحديثة واستكشاف تقنيات قوقل.',
    onboarded_at: '2026-10-01T10:00:00Z',
    skills: ['HTML'],
    completedStages: [],
    currentStage: 1,
    settings: { ...DEFAULT_SETTINGS },
  },
  // 5. أحمد الغامدي (عضو مذكر لتجربة صيغة المذكر)
  {
    id: 'member-ahmed',
    fullName: 'أحمد الغامدي',
    username: 'ahmed.web26',
    gender: 'male',
    role: 'member',
    roleTitle: 'عضو مسار الويب 🚀',
    webLevel: 'intermediate',
    webLevelTitle: 'المرحلة 2: التطوير التفاعلي',
    levelNumber: 2,
    points: 280,
    avatarLetter: 'أ',
    badgeColor: '#EA4335',
    major: 'هندسة حاسب',
    academicYear: 'السنة الثالثة',
    bio: 'مهتم بتطوير الواجهات الأمامية والأنظمة التفاعلية وبناء حلول ويب عملية وجميلة.',
    onboarded_at: '2026-10-02T10:00:00Z',
    skills: ['HTML', 'CSS', 'JavaScript'],
    completedStages: [1],
    currentStage: 2,
    settings: { ...DEFAULT_SETTINGS },
  },
  // 6. أثير العتيبي (مشرفة - قائدة المجالات)
  {
    id: 'supervisor-atheer',
    fullName: 'أثير العتيبي',
    username: 'atheer.super',
    gender: 'female',
    role: 'supervisor',
    roleTitle: 'قائدة المجالات 🌟',
    webLevel: 'advanced',
    webLevelTitle: 'قيادة المجالات والإشراف',
    levelNumber: 3,
    points: 980,
    avatarLetter: 'أ',
    badgeColor: '#EA4335',
    major: 'هندسة حاسب',
    academicYear: 'السنة الرابعة',
    bio: 'إشراف عام ومتابعة مسارات النادي وتطوير أداء الفرق.',
    onboarded_at: '2026-09-01T10:00:00Z',
    skills: ['Web', 'Strategy', 'Project Management'],
    completedStages: [1, 2, 3],
    currentStage: 3,
    settings: { ...DEFAULT_SETTINGS },
  },
  // 7. عامر الحارثي (مشرف - نائب قائدة المجالات)
  {
    id: 'supervisor-amer',
    fullName: 'عامر الحارثي',
    username: 'amer.super',
    gender: 'male',
    role: 'supervisor',
    roleTitle: 'نائب قائدة المجالات 🌟',
    webLevel: 'advanced',
    webLevelTitle: 'إشراف ومتابعة مسارات النادي',
    levelNumber: 3,
    points: 950,
    avatarLetter: 'ع',
    badgeColor: '#4285F4',
    major: 'علوم حاسب',
    academicYear: 'السنة الرابعة',
    bio: 'نائب قائدة المجالات بنادي الطلبة المطورين بجامعة الطائف ومتابع جودة المخرجات.',
    onboarded_at: '2026-09-01T10:00:00Z',
    skills: ['Web Development', 'Systems', 'Leadership'],
    completedStages: [1, 2, 3],
    currentStage: 3,
    settings: { ...DEFAULT_SETTINGS },
  },
  // 8. رنا أمين فيض (مستشارة النادي ونائبة القادة)
  {
    id: 'supervisor-rana',
    fullName: 'رنا أمين فيض',
    username: 'rana.super',
    gender: 'female',
    role: 'supervisor',
    roleTitle: 'مستشارة النادي ونائبة القادة 🌟',
    webLevel: 'advanced',
    webLevelTitle: 'استشارة النادي ونيابة القيادة والإشراف',
    levelNumber: 3,
    points: 960,
    avatarLetter: 'ر',
    badgeColor: '#34A853',
    major: 'تقنية معلومات',
    academicYear: 'السنة الرابعة (المستوى السابع)',
    bio: 'مستشارة النادي ونائبة القادة بنادي قوقل للطلبة المطورين بجامعة الطائف، متابعة جودة المخرجات وتطوير المسارات بالتعاون مع عامر وأثير وغيداء وريتال.',
    onboarded_at: '2026-10-23T02:27:34Z',
    skills: ['Web Development', 'Systems', 'Leadership', 'Strategy', 'Quality Assurance'],
    completedStages: [1, 2, 3],
    currentStage: 3,
    settings: { ...DEFAULT_SETTINGS },
  },
  // 9. رنا أمين فيض (عضو مسار الويب)
  {
    id: 'member-rana',
    fullName: 'رنا أمين فيض',
    username: 'rana.web26',
    gender: 'female',
    role: 'member',
    roleTitle: 'عضو مسار الويب 🚀',
    webLevel: 'intermediate',
    webLevelTitle: 'المرحلة 2: التطوير التفاعلي',
    levelNumber: 2,
    points: 250,
    avatarLetter: 'ر',
    badgeColor: '#34A853',
    major: 'تقنية معلومات',
    academicYear: 'السنة الرابعة (المستوى السابع)',
    bio: 'طالبة تقنية معلومات، مهتمة بتطوير واجهات وتطبيقات الويب وربط الواجهات وتجربة المستخدم.',
    onboarded_at: '2026-10-23T02:27:34Z',
    skills: ['HTML', 'CSS', 'JavaScript'],
    completedStages: [1],
    currentStage: 2,
    settings: { ...DEFAULT_SETTINGS },
  },
];

// مفاتيح التخزين المحلي (الإصدار الثامن المحدث لضمان عدم حجب الشاشة بالنبذة)
const STORAGE_KEYS = {
  CURRENT_USER_ID: 'gdg_webtrack_curr_user_v8',
  IS_LOGGED_IN: 'gdg_webtrack_is_logged_in_v8',
  MEMBERS: 'gdg_webtrack_members_v8',
  INTRO_SEEN: 'gdg_webtrack_intro_seen_session_v8',
  NOTIFICATIONS: 'gdg_webtrack_notifications_v8',
  COURSES: 'gdg_webtrack_courses_v9',
  INQUIRIES: 'gdg_webtrack_inquiries_v8',
  POLLS: 'gdg_webtrack_polls_v8',
  VOTES: 'gdg_webtrack_poll_votes_v8',
};

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
    targetTab: 'community',
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
    targetTab: 'community',
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

  // -------------------------------------------------------------
  // 2. الأطر (Frameworks & Backend)
  // -------------------------------------------------------------
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
    title: 'أساسيات Git',
    symbol: '⎇',
    color: 'yellow',
    category: 'hosting_tools',
    levelRequirement: 'إجبارية لمن لا يمتلك المهارة، وهي الأداة الأولى لكل مطور.',
    status: 'completed',
    skillReward: 'Git & GitHub',
    directUrl: 'https://satr.tuwaiq.edu.sa/course/ZlKLfufzmW/view?course_path_id=ecbAGsuqOQ',
    description: 'التحكم في الإصدارات، حفظ تاريخ المشروع، إدارة الفروع، ورفع ومشاركة الأكواد.',
    sources: [
      {
        platform: 'satr',
        platformName: 'منصة سطر',
        title: 'دورة أساسيات Git',
        outcome: 'إدارة المستودعات والفروع والعمل عبر واجهة الأوامر',
        url: 'https://satr.tuwaiq.edu.sa/course/ZlKLfufzmW/view?course_path_id=ecbAGsuqOQ',
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

// الاستبيانات والاستفسارات
const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    userId: 'member-dana',
    userName: 'دانا الحارثي',
    userAvatar: 'د',
    title: 'استفسار حول استخدام خط thmanyah sans في المشاريع',
    details: 'هل نلتزم بتضمين ملف الخط محلياً عبر @font-face في جميع تسليمات الويب، أم نستخدم CDN بديل في التمارين السريعة؟',
    status: 'answered',
    responseText: 'أهلاً يا دانا! في المشاريع الرسمية المعتمدة نعتمد @font-face المحلي لضمان استقرار الهوية بدون اعتماد خارجي، وفي التمارين السريعة يتاح استخدام IBM Plex Sans Arabic كبديل مؤقت.',
    respondedBy: 'غيداء تركي الشريف (قائدة المسار)',
    respondedAt: 'منذ ساعتين',
    createdAt: 'اليوم، 14:30',
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

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // تنظيف أي إصدارات قديمة من التخزين المحلي كانت تحتوي على بيانات معلقة
    try {
      const keysToPurge = Object.keys(localStorage).filter(
        (k) => k.startsWith('gdg_webtrack_') && !k.endsWith('_v8')
      );
      keysToPurge.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }

    // تهيئة مصفوفة الأعضاء مع التأكد التام من اكتمال نبذة نورة
    let membersToStore = CLUB_PROFILES;
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        membersToStore = parsed.map((u: UserProfile) => {
          if (u.id === 'member-noura' && !u.onboarded_at) {
            return {
              ...u,
              bio: 'طالبة علوم حاسب بجامعة الطائف، شغوفة بتصميم وتطوير واجهات وتجارب الويب الحديثة التفاعلية.',
              onboarded_at: '2026-10-20T10:00:00Z',
            };
          }
          return u;
        });
      } catch {
        membersToStore = CLUB_PROFILES;
      }
    }

    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(membersToStore));

    const isLogged = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    const currId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!isLogged || !currId) {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }

    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POLLS)) {
      localStorage.setItem(STORAGE_KEYS.POLLS, JSON.stringify([INITIAL_POLL]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VOTES)) {
      localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify([]));
    }
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

  // --- Auth & Members ---
  public isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    const isLogged = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    const currId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!isLogged || !currId) {
      return false;
    }
    const members = this.getMembers();
    const exists = members.some((m) => m.id === currId);
    if (!exists) {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      return false;
    }
    return true;
  }

  public login(userId: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    this.notify();
  }

  public logout() {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    this.notify();
  }

  public getMembers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return raw ? JSON.parse(raw) : CLUB_PROFILES;
  }

  public getCurrentUser(): UserProfile | null {
    if (!this.isLoggedIn()) return null;
    const currId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!currId) return null;
    const members = this.getMembers();
    return members.find((m) => m.id === currId) || null;
  }

  public setCurrentUser(userId: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    this.notify();
  }

  // --- Mandatory Bio Onboarding ---
  public saveUserBio(userId: string, bioText: string): boolean {
    if (bioText.trim().length < 50) return false;

    const members = this.getMembers().map((m) => {
      if (m.id === userId) {
        return {
          ...m,
          bio: bioText.trim(),
          onboarded_at: new Date().toISOString(),
        };
      }
      return m;
    });

    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    this.notify();
    return true;
  }

  // --- User Settings (JSONB) ---
  public updateUserSettings(userId: string, newSettings: Partial<UserSettings>) {
    const members = this.getMembers().map((m) => {
      if (m.id === userId) {
        const updated = {
          ...m,
          settings: {
            ...m.settings,
            ...newSettings,
          },
        };
        return updated;
      }
      return m;
    });

    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
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
    return INITIAL_ACTION_ITEMS;
  }

  public completeActionItem(id: string) {
    // marks action as complete or updates list
    this.notify();
  }

  // --- Courses & Educational Journey ---
  public getCourses(): Course[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    return raw ? JSON.parse(raw) : INITIAL_COURSES;
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
  public awardPoints(userId: string, amount: number, reason?: string) {
    const members = this.getMembers().map((m) => {
      if (m.id === userId) {
        return { ...m, points: m.points + amount };
      }
      return m;
    });

    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));

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
  }

  // --- Inquiries ---
  public getInquiries(): Inquiry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    return raw ? JSON.parse(raw) : INITIAL_INQUIRIES;
  }

  public addInquiry(title: string, details: string): Inquiry {
    const user = this.getCurrentUser() || this.getMembers()[0];
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userAvatar: user.avatarLetter,
      title: title.trim(),
      details: details.trim(),
      status: 'new',
      createdAt: 'الآن',
    };

    const inquiries = [newInquiry, ...this.getInquiries()];
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    this.notify();
    return newInquiry;
  }

  // --- Polls ---
  public getPoll(): Poll {
    const raw = localStorage.getItem(STORAGE_KEYS.POLLS);
    const polls: Poll[] = raw ? JSON.parse(raw) : [INITIAL_POLL];
    return polls[0];
  }

  public getUserVote(pollId: string, userId: string): PollVoteRecord | null {
    const raw = localStorage.getItem(STORAGE_KEYS.VOTES);
    const votes: PollVoteRecord[] = raw ? JSON.parse(raw) : [];
    return votes.find((v) => v.pollId === pollId && v.userId === userId) || null;
  }

  public submitVote(
    pollId: string,
    optionId?: string,
    customText?: string
  ): { success: boolean; pointsAwarded: boolean } {
    const user = this.getCurrentUser() || this.getMembers()[0];
    const poll = this.getPoll();
    const rawVotes = localStorage.getItem(STORAGE_KEYS.VOTES);
    const votes: PollVoteRecord[] = rawVotes ? JSON.parse(rawVotes) : [];

    const existingIndex = votes.findIndex(
      (v) => v.pollId === pollId && v.userId === user.id
    );

    let pointsAwarded = false;
    const alreadyAwarded = existingIndex >= 0 ? votes[existingIndex].awardedPoints : false;

    if (!alreadyAwarded) {
      this.awardPoints(user.id, poll.pointsReward, 'مشاركتك في استبيان الورشة القادمة');
      pointsAwarded = true;
    }

    const newRecord: PollVoteRecord = {
      pollId,
      userId: user.id,
      optionId,
      customText: customText?.trim(),
      votedAt: 'الآن',
      awardedPoints: true,
    };

    if (existingIndex >= 0) {
      votes[existingIndex] = newRecord;
    } else {
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
    }

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

  public resetIntro() {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEYS.INTRO_SEEN);
    this.notify();
  }
}

export const store = new StoreManager();

