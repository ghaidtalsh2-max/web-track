// =============================================================================
// GDG on Campus — Taif University (Web Track Platform 2026)
// Dynamic Arabic Gender Inflection Utility (التأنيث والتذكير التفاعلي)
// =============================================================================

export interface UserGenderAware {
  gender?: 'female' | 'male';
  fullName?: string;
  name?: string;
  username?: string;
  email?: string;
}

const MALE_FIRST_NAMES = [
  'سلمان',
  'فيصل',
  'عبدالعزيز',
  'عبد العزيز',
  'عامر',
  'ثامر',
  'ثانر',
  'رياد',
  'أحمد',
  'احمد',
  'سلطان',
  'محمد',
  'طارق',
  'خالد',
  'فهد',
  'عبدالله',
  'عبد الله',
  'سعود',
  'علي',
  'عمر',
  'يوسف',
  'إبراهيم',
  'ابراهيم',
  'بدر',
  'نايف',
];

const MALE_USERNAMES = [
  'salman',
  'faisal',
  'abdulaziz',
  'amer',
  'thamer',
  'riyad',
  'ahmed',
  'khaled',
  'sultan',
  'fahad',
  'abdullah',
  'saud',
  'ali',
  'omar',
];

/**
 * يتحقق بدقة مما إذا كان الحساب يخص أنثى أو ذكراً:
 * 1. يعتمد على حقل gender الصريح إن وجد ('female' | 'male')
 * 2. يفحص الاسم الكامل تلقائياً لمطابقة الأسماء المذكرة المعتمدة (عبدالعزيز، سلمان، فيصل، عامر، ثامر، إلخ)
 * 3. يفحص اسم المستخدم لمعالجة الحسابات الإنجليزية
 * 4. الافتراضي female نظراً لغالبية المسار من الطالبات
 */
export function isFemaleUser(user?: UserGenderAware | null): boolean {
  if (!user) return true;
  if (user.gender === 'male') return false;
  if (user.gender === 'female') return true;

  const rawFull = `${user.fullName || ''} ${user.name || ''}`.trim();
  if (rawFull) {
    if (MALE_FIRST_NAMES.some((m) => rawFull.includes(m))) {
      return false;
    }
  }

  const rawUser = `${user.username || ''} ${user.email || ''}`.toLowerCase();
  if (rawUser) {
    if (MALE_USERNAMES.some((u) => rawUser.includes(u))) {
      return false;
    }
  }

  return true;
}

/**
 * دالة مساعدة عامة لإرجاع النص المؤنث أو المذكر حسب جنس المستخدم
 */
export function gText(
  userOrIsFemale: UserGenderAware | boolean | undefined | null,
  femaleText: string,
  maleText: string
): string {
  const isF =
    typeof userOrIsFemale === 'boolean'
      ? userOrIsFemale
      : isFemaleUser(userOrIsFemale);
  return isF ? femaleText : maleText;
}

/**
 * معجم الكلمات والعبارات الشائعة للتأنيث والتذكير التفاعلي
 */
export const genderVocab = {
  // فعل الأمر
  submit: (isF: boolean) => (isF ? 'سلّمي' : 'سلّم'),
  participate: (isF: boolean) => (isF ? 'شاركي' : 'شارك'),
  register: (isF: boolean) => (isF ? 'سجّلي' : 'سجّل'),
  share: (isF: boolean) => (isF ? 'شاركينا' : 'شاركنا'),
  explore: (isF: boolean) => (isF ? 'استكشفي' : 'استكشف'),
  continueWork: (isF: boolean) => (isF ? 'واصلي' : 'واصل'),
  verify: (isF: boolean) => (isF ? 'تحققي' : 'تحقق'),
  choose: (isF: boolean) => (isF ? 'اختاري' : 'اختار'),

  // الفعل الماضي
  submitted: (isF: boolean) => (isF ? 'سلّمتِ' : 'سلّمتَ'),
  completed: (isF: boolean) => (isF ? 'أكملتِ' : 'أكملتَ'),
  achieved: (isF: boolean) => (isF ? 'حققتِ' : 'حققتَ'),
  joined: (isF: boolean) => (isF ? 'انضممتِ' : 'انضممتَ'),

  // الصفات والأسماء
  interested: (isF: boolean) => (isF ? 'مهتمة' : 'مهتم'),
  member: (isF: boolean) => (isF ? 'عضوة' : 'عضو'),
  developer: (isF: boolean) => (isF ? 'مطوّرة' : 'مطوّر'),
  champion: (isF: boolean) => (isF ? 'بطلة' : 'بطل'),
  creative: (isF: boolean) => (isF ? 'مبدعة' : 'مبدع'),
  ready: (isF: boolean) => (isF ? 'مستعدة' : 'مستعد'),
  active: (isF: boolean) => (isF ? 'نشطة' : 'نشط'),
  leader: (isF: boolean) => (isF ? 'قائدة' : 'قائد'),
  supervisor: (isF: boolean) => (isF ? 'مشرفة' : 'مشرف'),

  // الضمائر والنداء
  youPronoun: (isF: boolean) => (isF ? 'أنتِ' : 'أنتَ'),
  yourActivity: (isF: boolean) => (isF ? 'تفاعلكِ' : 'تفاعلكَ'),
  yourSubmission: (isF: boolean) => (isF ? 'تسليمكِ' : 'تسليمكَ'),
  yourProject: (isF: boolean) => (isF ? 'مشروعكِ' : 'مشروعكَ'),
  yourProfile: (isF: boolean) => (isF ? 'ملفكِ' : 'ملفكَ'),
  welcome: (isF: boolean) => (isF ? 'أهلاً بكِ' : 'أهلاً بكَ'),
  withYou: (isF: boolean) => (isF ? 'معكِ' : 'معكَ'),
  toYou: (isF: boolean) => (isF ? 'إليكِ' : 'إليكَ'),
};
