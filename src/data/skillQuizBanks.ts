export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

// 1. بنك أسئلة Git
export const GIT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'ما الأمر المستخدم لإنشاء فرع (Branch) جديد في Git والانتقال إليه مباشرة بخطوة واحدة؟',
    options: ['git checkout -b feature-name', 'git branch -new feature-name', 'git switch -create-all', 'git init feature-name'],
    correctIndex: 0,
    explanation: 'الأمر git checkout -b (أو git switch -c) ينشئ فرعاً جديداً وينتقل إليه فوراً.',
  },
  {
    id: 2,
    question: 'ما فائدة أمر git stash في بيئة عمل المطورين؟',
    options: [
      'حفظ التغييرات غير المعتمدة مؤقتاً لتنظيف مجلد العمل دون فقدانها',
      'حذف المستودع بالكامل من جهازك نهائياً',
      'رفع التعديلات مباشرة إلى السيرفر دون عمل commit',
      'دمج فرعين متعارضين بالقوة',
    ],
    correctIndex: 0,
    explanation: 'أمر git stash يحفظ التعديلات في الذاكرة المؤقتة للعودة إليها لاحقاً.',
  },
  {
    id: 3,
    question: 'عند حدوث تعارض (Merge Conflict) أثناء دمج الفروع في Git، كيف يتم حله برمجياً؟',
    options: [
      'فتح الملفات المتعارضة وحل الفروقات يدوياً ثم عمل git add و git commit',
      'إعادة تشغيل الجهاز لحل التعارض تلقائياً',
      'حذف مجلد .git والبدء من جديد',
      'استخدام أمر git pull -force لتجاهل التعارض',
    ],
    correctIndex: 0,
    explanation: 'يتم مراجعة علامات التعارض في الكود، اختيار الكود الصحيح، ثم تجهيزه بعمل git add وإنهاء الدمج.',
  },
  {
    id: 4,
    question: 'ما الفرق الأساسي بين git fetch و git pull؟',
    options: [
      'git fetch يجلب التحديثات دون دمجها في فرعك الحالي، بينما git pull يجلبها ويدمجها تلقائياً',
      'git fetch مخصص لحذف الفروع فقط، بينما git pull يرفع الملفات',
      'لا يوجد أي فرق بينهما فهما نفس الأمر تماماً',
      'git fetch يتطلب صلاحيات مدير السيرفر فقط',
    ],
    correctIndex: 0,
    explanation: 'git pull يعادل استدعاء git fetch متبوعاً بـ git merge.',
  },
];

// 2. بنك أسئلة VS Code
export const VSCODE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'ما الاختصار الافتراضي لفتح لوحة الأوامر الرئيسية (Command Palette) في VS Code؟',
    options: ['Ctrl + Shift + P (أو Cmd + Shift + P)', 'Ctrl + Alt + Del', 'Ctrl + N', 'F12'],
    correctIndex: 0,
    explanation: 'اختصار Ctrl/Cmd + Shift + P يفتح Command Palette للوصول لكافة أوامر VS Code.',
  },
  {
    id: 2,
    question: 'كيف يمكنك فتح الطرفية المدمجة (Integrated Terminal) داخل VS Code بسرعة؟',
    options: [
      'بالضغط على Ctrl + ` (رمز التلدة Backtick)',
      'بالضغط على Alt + F4',
      'من خلال فتح موجه الأوامر الخارجي فقط',
      'بالضغط على Shift + Enter',
    ],
    correctIndex: 0,
    explanation: 'مفتاح Ctrl + ` هو الاختصار العالمي لإظهار وإخفاء Terminal المدمج.',
  },
  {
    id: 3,
    question: 'ما الفائدة من ميزة Multi-Cursor (المؤشرات المتعددة) في محرر VS Code، وكيف تفعلها؟',
    options: [
      'الكتابة والتعديل في عدة أسطر وأماكن في نفس الوقت عبر الضغط على Alt/Option والنقر بالفأرة',
      'ترجمة الكود إلى لغة الآلة مباشرة',
      'فحص سرعة اتصال الإنترنت بالمحرر',
      'إغلاق النوافذ الخلفية تلقائياً',
    ],
    correctIndex: 0,
    explanation: 'الضغط على Alt/Option مع النقر يتيح إنشاء مؤشرات متعددة للتعديل المتزامن.',
  },
  {
    id: 4,
    question: 'أين تُحفظ الإعدادات المخصصة للمشروع (Workspace Settings) في VS Code؟',
    options: [
      'داخل مجلد .vscode في ملف settings.json',
      'في سجل النظام Windows Registry فقط',
      'في ملف index.html الرئيسي',
      'داخل ملف package.json تلقائياً',
    ],
    correctIndex: 0,
    explanation: 'إعدادات المشروع تحفظ محلياً في .vscode/settings.json.',
  },
];

// 3. بنك أسئلة CSS و التصميم
export const CSS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'في CSS Flexbox، ما الخاصية المسؤولة عن محاذاة العناصر على المحور الثانوي (Cross Axis)؟',
    options: ['align-items', 'justify-content', 'flex-direction', 'align-self-all'],
    correctIndex: 0,
    explanation: 'align-items تتحكم في المحور الثانوي Cross Axis بينما justify-content تتحكم في Main Axis.',
  },
  {
    id: 2,
    question: 'في CSS Grid، كيف ننشئ شبكة متجاوبة تملأ السطر بأعمدة لا يقل عرضها عن 240px وتتوزع تلقائياً؟',
    options: [
      'grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))',
      'grid-columns: flex-auto(240px, 100%)',
      'grid-template-rows: repeat(auto-fill, 240px)',
      'display: flex-grid(minmax(240px))',
    ],
    correctIndex: 0,
    explanation: 'repeat(auto-fit, minmax(240px, 1fr)) هي الطريقة القياسية لشبكة متجاوبة بدون Media Queries.',
  },
  {
    id: 3,
    question: 'ما الفرق بين position: absolute و position: relative في CSS؟',
    options: [
      'العنصر absolute يتموضع بالنسبة لأقرب عنصر أب يملك position غير static، بينما relative بالنسبة لموقعه الطبيعي',
      'absolute يثبت العنصر عند التمرير، بينما relative يخفيه',
      'لا يوجد أي فرق بينهما',
      'relative لا يقبل خصائص top و left إطلاقاً',
    ],
    correctIndex: 0,
    explanation: 'absolute يخرج من تدفق الصفحة ويتموضع بالنسبة لأقرب أب متموضع.',
  },
  {
    id: 4,
    question: 'كيف يتم تعريف واستخدام متغيرات CSS المتوافقة مع كافة المتصفحات (CSS Custom Properties)؟',
    options: [
      'تعريفها مثل --primary-color: #4285f4 واستدعاؤها عبر var(--primary-color)',
      'تعريفها عبر $primary: #4285f4 واستدعاؤها برمز $',
      'كتابة @variable primary = #4285f4',
      'لا يدعم CSS المتغيرات إلا بمكتبات خارجية',
    ],
    correctIndex: 0,
    explanation: 'تُعرف البادئة بـ -- وتُستدعى بالدالة var().',
  },
];

// 4. بنك أسئلة HTML
export const HTML_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'ما فائدة استخدام العناصر الدلالية (Semantic Tags) مثل <header> و <main> و <article> في HTML5؟',
    options: [
      'تحسين إمكانية الوصول (Accessibility) ومحركات البحث (SEO) وفهم هيكل الصفحة للمتصفحات',
      'تغيير ألوان الخطوط تلقائياً بدون CSS',
      'تسريع تشغيل أكواد JavaScript فقط',
      'حماية الموقع من الاختراقات الأمنية',
    ],
    correctIndex: 0,
    explanation: 'العناصر الدلالية تعطي معنى للهيكل وتفيد القارئات الشاشية ومحركات البحث.',
  },
  {
    id: 2,
    question: 'ما وظيفة السمة alt في وسم الصور <img> ولماذا تعد إلزامية لمعايير الويب القياسية؟',
    options: [
      'توفير وصف نصي بديل في حال تعذر تحميل الصورة، ولقارئات الشاشة لذوي الإعاقة البصرية',
      'تحديد حجم الصورة بالبكسل تلقائياً',
      'تطبيق فلتر ضبابي على الصورة',
      'ربط الصورة برابط خارجي عند النقر',
    ],
    correctIndex: 0,
    explanation: 'alt توفر النص البديل المهم لـ SEO وإمكانية الوصول A11y.',
  },
  {
    id: 3,
    question: 'ما فائدة إضافة الوسم <meta name="viewport" content="width=device-width, initial-scale=1.0"> في <head>؟',
    options: [
      'ضمان تجاوب الصفحة وملاءمة أبعادها مع شاشات الهواتف الذكية والأجهزة المختلفة',
      'منع المستخدم من تكبير الشاشة نهائياً',
      'تحديد لغة البرمجة المستخدمة في السيرفر',
      'تحميل خطوط جوجل تلقائياً',
    ],
    correctIndex: 0,
    explanation: 'وسم viewport يضبط أبعاد العرض لتناسب مقاس كل جهاز.',
  },
  {
    id: 4,
    question: 'في نماذج HTML، ما الفرق بين استخدام method="GET" و method="POST"؟',
    options: [
      'GET يرسل البيانات في رابط الـ URL (مناسب للبحث)، بينما POST يرسلها في جسم الطلب (مناسب للبيانات الحساسة)',
      'GET يحذف البيانات، بينما POST يطبعها',
      'GET يعمل فقط مع الصور، و POST للنصوص',
      'لا يوجد أي فرق تقني بين الطريقتين',
    ],
    correctIndex: 0,
    explanation: 'GET يلحق البيانات بـ Query string بينما POST يرسلها في Body الطلب.',
  },
];

// 5. بنك أسئلة JavaScript
export const JS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'ما الفرق الجوهري بين let و const و var في JavaScript الحديثة (ES6)؟',
    options: [
      'let و const لهما نطاق كتلي (Block Scoped) و const لا تقبل إعادة التعيين، بينما var ذات نطاق دالّي (Function Scoped)',
      'var أسرع في المعالجة من let دائماً',
      'const تسمح بإعادة تعريف نفس المتغير في نفس المكان',
      'لا يوجد فرق في آليات النطاق Hoisting',
    ],
    correctIndex: 0,
    explanation: 'let و const أضيفت لتفادي مشكلات نطاق var و Hoisting.',
  },
  {
    id: 2,
    question: 'عند معالجة حدث إرسال نموذج onsubmit في JS، ما فائدة استدعاء event.preventDefault()؟',
    options: [
      'منع إعادة تحميل الصفحة الافتراضية للتعامل مع البيانات بسلاسة عبر JavaScript',
      'حذف جميع البيانات المدخلة في حقول النموذج',
      'إغلاق نافذة المتصفح فوراً',
      'إرسال البيانات مباشرة إلى السيرفر دون تشفير',
    ],
    correctIndex: 0,
    explanation: 'preventDefault تمنع السلوك الافتراضي للمتصفح مثل إعادة تحميل الصفحة عند الـ Submit.',
  },
  {
    id: 3,
    question: 'ما هو الفرق بين localStorage و sessionStorage في المتصفح؟',
    options: [
      'بيانات localStorage تدوم حتى بعد إغلاق المتصفح، بينما sessionStorage تُمسح بإغلاق التبويب',
      'sessionStorage تخزن بيانات مشفرة تلقائياً فقط',
      'localStorage محدودة بـ 5 بايت فقط',
      'لا يوجد أي فرق في فترة الصلاحية',
    ],
    correctIndex: 0,
    explanation: 'localStorage دائمة بينما sessionStorage تنتهي بانتهاء الجلسة.',
  },
  {
    id: 4,
    question: 'ما الفرق بين المعاملين == و === في المقارنة داخل JavaScript؟',
    options: [
      '=== يتحقق من القيمة ونوع البيانات معاً (Strict)، بينما == يقوم بالتحويل التلقائي للنوع (Type Coercion)',
      '== أدق وأسرع من === في المقارنة',
      '=== يستخدم فقط مع الأرقام السالبة',
      'المعاملان متطابقان تماماً ولا يوجد اختلاف',
    ],
    correctIndex: 0,
    explanation: 'Strict Equality === لا تقوم بتحويل نوع البيانات Coercion وتفحص النوع والقيمة.',
  },
];

// 6. بنك أسئلة React
export const REACT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'في React، ما الهدف الرئيسي من استخدام خطاف useState؟',
    options: [
      'إدارة الحالة المحلية للمكون وإعادة تصيير (Re-render) الواجهة عند تغير القيمة',
      'كتابة استعلامات قاعدة البيانات مباشرة في المتصفح',
      'تنزيل حزم npm تلقائياً',
      'تنسيق ألوان عناصر CSS',
    ],
    correctIndex: 0,
    explanation: 'useState هو الخطاف الأساسي للحفاظ على State وإعادة عرض المكون عند تحديثها.',
  },
  {
    id: 2,
    question: 'متى يتم تنفيذ الدالة داخل خطاف useEffect عندما تكون مصفوفة الاعتماديات فارغة []؟',
    options: [
      'مرة واحدة فقط عند تركيب المكون (Mounting) لأول مرة',
      'مع كل نقرة زر يقوم بها المستخدم',
      'بشكل متكرر كل ثانية بدون توقف',
      'قبل تحميل كود HTML الأولي',
    ],
    correctIndex: 0,
    explanation: 'مصفوفة الاعتماديات الفارغة تعني تشغيل التأثير عند التحميل الأولي فقط.',
  },
  {
    id: 3,
    question: 'لماذا يُشترط تمرير خاصية key فريدة وثابتة عند تصيير القوائم بواسطة دالة .map() في React؟',
    options: [
      'لمساعدة محرك React على تتبع وتحديث العناصر المغيرة بكفاءة في الـ Virtual DOM',
      'لأن المتصفح يرفض عرض النصوص بدون key',
      'لتحديد لون خلفية العنصر تلقائياً',
      'لتشفير بيانات القائمة ضد التجسس',
    ],
    correctIndex: 0,
    explanation: 'key تمكّن خوارزمية Reconciliation من معرفة أي العناصر أضيفت أو حذفت أو عُدلت.',
  },
  {
    id: 4,
    question: 'ما هو الفرق الجوهري بين Props و State في مكونات React؟',
    options: [
      'Props تُمرر من المكون الأب وتعد للقراءة فقط (Read-only)، بينما State تُدار وتُعدل داخل المكون نفسه',
      'State ثابتة ولا تتغير أبداً، بينما Props تتغير تلقائياً',
      'Props تستخدم فقط مع الروابط الخارجية',
      'لا يوجد أي فرق فكلاهما نفس الشيء',
    ],
    correctIndex: 0,
    explanation: 'Props تمثل المعطيات الواردة من الخارج بينما State هي الحالة الداخلية القابلة للتغيير.',
  },
];

// 7. بنك أسئلة UI/UX & Figma
export const FIGMA_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'ما هي ميزة Auto Layout في برنامج Figma، وكيف تفيد مطوري الويب؟',
    options: [
      'محاكاة سلوك Flexbox في الويب لترتيب العناصر تلقائياً وتجاوب الإطارات مع المحتوى',
      'تصدير الكود تلقائياً إلى لغة C++',
      'إزالة الألوان وتحويل التصميم إلى أبيض وأسود',
      'حفظ الملفات على فلاش ميموري خارجي',
    ],
    correctIndex: 0,
    explanation: 'Auto Layout يماثل تماماً نظام CSS Flexbox في الحشو والتباعد واتجاه العناصر.',
  },
  {
    id: 2,
    question: 'ما هو المفهوم الأساسي للـ Design Tokens في هندسة واجهات المستخدم؟',
    options: [
      'متغيرات معيارية موحدة للألوان والخطوط والمسافات يتم مشاركتها بين المصممين والمطورين',
      'عملات رقمية تُدفع للمصممين شهرياً',
      'كلمات سر للدخول على منصة Figma',
      'قوالب جاهزة تُباع على متجر التطبيقات',
    ],
    correctIndex: 0,
    explanation: 'Design Tokens هي حجر الزاوية في نظم التصميم لربط أدوات التصميم بالكود الفعلي.',
  },
  {
    id: 3,
    question: 'وفق معايير إمكانية الوصول للواجهات (WCAG)، ما هو الحد الأدنى المقبول لنسبة تباين النص العادي (Contrast Ratio)؟',
    options: ['4.5:1 للمستوى AA', '1:1 بدون قيود', '100:1 لجميع الخطوط', '2:1 للصور الخلفية'],
    correctIndex: 0,
    explanation: 'معيار WCAG AA يشترط نسبة تباين 4.5:1 على الأقل للنصوص العادية لتسهيل القراءة.',
  },
  {
    id: 4,
    question: 'في Figma، ما الفائدة الأساسية من إنشاء Components و Variants؟',
    options: [
      'إعادة استخدام العناصر التصميمية وتوحيد التعديلات عبر كامل المشروع من مكان واحد',
      'تقليل استهلاك بطارية الجهاز أثناء التصفح',
      'منع أعضاء الفريق من رؤية التصميم',
      'تحويل التصميم إلى فيديو ثلاثي الأبعاد',
    ],
    correctIndex: 0,
    explanation: 'المكونات والمتغيرات تضمن قابلية إعادة الاستخدام والصيانة في نظام التصميم.',
  },
];

// 8. بنك أسئلة الذكاء الاصطناعي و ChatGPT
export const AI_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'في هندسة الأوامر (Prompt Engineering)، ما المقصود بـ System Prompt؟',
    options: [
      'التعليمات التأسيسية التي تحدد هوية النموذج وحدوده ودوره وسياق إجاباته قبل بدء المحادثة',
      'أمر تشغيل نظام الويندوز',
      'كود برمجي لحذف الذاكرة المؤقتة للنموذج',
      'زر الدخول إلى متجر التطبيقات',
    ],
    correctIndex: 0,
    explanation: 'System Prompt يوجه سلوك النموذج ونبرته وقواعده الأساسية في التفاعل.',
  },
  {
    id: 2,
    question: 'ما تأثير رفع قيمة معيار Temperature في نماذج الذكاء الاصطناعي التوليدي؟',
    options: [
      'زيادة تنوع وإبداعية الردود وإمكانية توليد أفكار غير متوقعة، مع تقليل الدقة الحرفية',
      'تبريد المعالج المركزي للكمبيوتر',
      'تسريع سرعة تحميل صفحات الإنترنت',
      'إلزام النموذج بتقديم إجابة واحدة مكررة دائماً',
    ],
    correctIndex: 0,
    explanation: 'Temperature العالية تزيد العشوائية والإبداع، بينما المنخفضة تعطي ردوداً دقيقة وحتمية.',
  },
  {
    id: 3,
    question: 'ما هي تقنية RAG (Retrieval-Augmented Generation) في بناء تطبيقات الذكاء الاصطناعي؟',
    options: [
      'تزويد النموذج ببيانات ومستندات حقيقية مسترجعة من قاعدة بيانات للإجابة بناءً على مصادر موثوقة',
      'تدريب النموذج من الصفر على حواسيب خارقة',
      'تحويل النصوص إلى أصوات بشرية فقط',
      'حجب الردود غير الأخلاقية تلقائياً',
    ],
    correctIndex: 0,
    explanation: 'RAG تجمع بين البحث في مستندات خاصة وتوليد الإجابة الدقيقة عبر النموذج اللغوي.',
  },
  {
    id: 4,
    question: 'ما المقصود بمصطلح الهلوسة (Hallucination) في النماذج اللغوية الكبيرة (LLMs)؟',
    options: [
      'توليد النموذج لمعلومات خاطئة أو غير حقيقية بثقة تامة وكأنها حقائق مؤكدة',
      'توقف النموذج عن العمل بسبب انقطاع الإنترنت',
      'ترجمة النصوص بين اللغات بطريقة حرفية',
      'حذف الملفات الشخصية للمستخدم',
    ],
    correctIndex: 0,
    explanation: 'الهلوسة هي تقديم النموذج لمعلومات غير صحيحة أو مختلقة بسبب نمط التنبؤ اللغوي.',
  },
];

// 9. بنك أسئلة عام للمهارات البرمجية وهندسة الويب
export const GENERAL_DEV_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'ما هو البروتوكول القياسي الآمن لنقل صفحات الويب وتشفير البيانات بين المتصفح والخادم؟',
    options: ['HTTPS (باستخدام شهادات SSL/TLS)', 'FTP غير المشفر', 'HTTP 1.0', 'SMTP'],
    correctIndex: 0,
    explanation: 'HTTPS يضمن تشفير القناة وتأمين بيانات المستخدمين من التجسس.',
  },
  {
    id: 2,
    question: 'ما هو دور ملف package.json في مشاريع Node.js و JavaScript؟',
    options: [
      'توثيق بيانات المشروع، الحزم التابعة (Dependencies)، والأوامر التنفيذية (Scripts)',
      'تخزين كلمات مرور قواعد البيانات بشكل علني',
      'تشغيل المتصفح تلقائياً عند فتح الكمبيوتر',
      'تحديد سرعة معالج الرسوميات GPU',
    ],
    correctIndex: 0,
    explanation: 'package.json هو ملف التعريف المركزي للمشروع وحزمه وأوامر البناء.',
  },
  {
    id: 3,
    question: 'ما هي ميزة API (واجهة برمجة التطبيقات) في تطوير الويب؟',
    options: [
      'تمكين الأنظمة والتطبيقات المختلفة من تبادل البيانات والوظائف بسلاسة وأمان',
      'حفظ صفحات الويب على شكل ملفات PDF',
      'تصميم شعارات المواقع أوتوماتيكياً',
      'زيادة سرعة كتابة الكود على لوحة المفاتيح',
    ],
    correctIndex: 0,
    explanation: 'واجهات API هي الجسر البرمجي الذي يربط بين الخدمات وقواعد البيانات والواجهات.',
  },
  {
    id: 4,
    question: 'ما الفائدة من استخدام نظام التحكم بالإصدارات (Version Control) في العمل الجماعي؟',
    options: [
      'تتبع التعديلات، تسهيل دمج أعمال الفريق، واسترجاع النسخ السابقة عند حدوث أخطاء',
      'تقليل حجم شاشات العرض للأجهزة',
      'إلغاء الحاجة لكتابة كود برمجي',
      'تحميل التحديثات بدون استهلاك مساحة القرص',
    ],
    correctIndex: 0,
    explanation: 'نظم التحكم بالإصدارات مثل Git تحفظ تاريخ المشروع وتمنع تضارب تعديلات المطورين.',
  },
];

/**
 * دالة ذكية لإرجاع بنك الأسئلة المخصص والمطابق تماماً للمهارة المحددة
 */
export function getQuizQuestionsForSkill(skillName: string): QuizQuestion[] {
  const norm = (skillName || '').trim().toLowerCase();

  // 1. مهارات Git و GitHub
  if (norm.includes('git') && !norm.includes('digit')) {
    return GIT_QUIZ_QUESTIONS;
  }

  // 2. مهارات VS Code ومحررات الكود
  if (
    norm.includes('vs') ||
    norm.includes('code') ||
    norm.includes('visual') ||
    norm.includes('studio') ||
    norm.includes('editor')
  ) {
    return VSCODE_QUIZ_QUESTIONS;
  }

  // 3. مهارات CSS و التنسيق
  if (
    norm.includes('css') ||
    norm.includes('flexbox') ||
    norm.includes('grid') ||
    norm.includes('style') ||
    norm.includes('tailwind')
  ) {
    return CSS_QUIZ_QUESTIONS;
  }

  // 4. مهارات HTML
  if (norm.includes('html') || norm.includes('web foundation') || norm.includes('أساسيات')) {
    return HTML_QUIZ_QUESTIONS;
  }

  // 5. مهارات JavaScript
  if (norm.includes('js') || norm.includes('script') || norm.includes('جافا') || norm.includes('javascript')) {
    return JS_QUIZ_QUESTIONS;
  }

  // 6. مهارات React
  if (norm.includes('react') || norm.includes('رياكت') || norm.includes('next') || norm.includes('component')) {
    return REACT_QUIZ_QUESTIONS;
  }

  // 7. مهارات Figma و UI/UX
  if (
    norm.includes('figma') ||
    norm.includes('ui') ||
    norm.includes('ux') ||
    norm.includes('تصميم') ||
    norm.includes('واجهات')
  ) {
    return FIGMA_QUIZ_QUESTIONS;
  }

  // 8. مهارات الذكاء الاصطناعي و ChatGPT
  if (
    norm.includes('chatgpt') ||
    norm.includes('ai') ||
    norm.includes('ذكاء') ||
    norm.includes('gpt') ||
    norm.includes('prompt')
  ) {
    return AI_QUIZ_QUESTIONS;
  }

  // المهارات العامة
  return GENERAL_DEV_QUIZ_QUESTIONS;
}
