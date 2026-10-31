import React, { useState } from 'react';
import { UserProfile, Course, CourseSource } from '../../types';
import { store } from '../../services/store';

interface LeaderLearningSourcesViewProps {
  currentUser: UserProfile;
}

export interface ContentCourseItem {
  id: string;
  title: string;
  symbol: string;
  color: string;
  category: 'languages' | 'frameworks' | 'other';
  levelTag: string;
  isPublished: boolean;
  sources: {
    id: string;
    platform: 'satr' | 'youtube' | 'site' | 'book';
    title: string;
    url: string;
    outcome?: string;
  }[];
}

const DEFAULT_COURSES: ContentCourseItem[] = [
  {
    id: 'c-html',
    title: 'HTML',
    symbol: 'H',
    color: '#EA4335',
    category: 'languages',
    levelTag: 'أساسي للجميع',
    isPublished: true,
    sources: [
      {
        id: 's-html-1',
        platform: 'satr',
        title: 'دورة HTML',
        url: 'satr.tuwaiq.edu.sa/course/html-basics',
        outcome: 'بناء الهيكل الدلالي لصفحات الويب وعناصر النماذج والوسائط',
      },
      {
        id: 's-html-2',
        platform: 'youtube',
        title: 'شرح HTML كامل',
        url: 'youtube.com/watch?v=html-full-course',
        outcome: 'تطبيقات عملية على وسوم HTML5 الحديثة وتهيئة الموقع لمحركات البحث',
      },
    ],
  },
  {
    id: 'c-css',
    title: 'CSS',
    symbol: 'C',
    color: '#4285F4',
    category: 'languages',
    levelTag: 'أساسي للجميع',
    isPublished: true,
    sources: [
      {
        id: 's-css-1',
        platform: 'satr',
        title: 'دورة CSS',
        url: 'satr.tuwaiq.edu.sa/course/css-styling',
        outcome: 'تصميم الواجهات المتقدمة وتنسيق العناصر بنظام Flexbox و Grid',
      },
    ],
  },
  {
    id: 'c-js',
    title: 'JavaScript',
    symbol: 'JS',
    color: '#F9AB00',
    category: 'languages',
    levelTag: 'أساسي للجميع',
    isPublished: true,
    sources: [
      {
        id: 's-js-1',
        platform: 'satr',
        title: 'دورة JavaScript الحديثة',
        url: 'satr.tuwaiq.edu.sa/course/javascript-es6',
        outcome: 'البرمجة التفاعلية والتعامل مع DOM ومفاهيم الـ Async و Fetch',
      },
      {
        id: 's-js-2',
        platform: 'youtube',
        title: 'تطبيقات عملية بلغة JS',
        url: 'youtube.com/watch?v=js-projects-arabic',
        outcome: 'بناء 5 مشاريع تفاعلية حقيقية من الصفر',
      },
    ],
  },
  {
    id: 'c-ts',
    title: 'TypeScript',
    symbol: 'TS',
    color: '#4285F4',
    category: 'languages',
    levelTag: 'موصى به',
    isPublished: true,
    sources: [
      {
        id: 's-ts-1',
        platform: 'site',
        title: 'دليل TypeScript الرسمي',
        url: 'typescriptlang.org/docs/handbook',
        outcome: 'كتابة شيفرة آمنة ومنيعة من أخطاء الأنواع أثناء التطوير',
      },
    ],
  },
  {
    id: 'c-react',
    title: 'React',
    symbol: 'R',
    color: '#4285F4',
    category: 'frameworks',
    levelTag: 'أساسي للجميع',
    isPublished: true,
    sources: [
      {
        id: 's-react-1',
        platform: 'satr',
        title: 'مدخل إلى React 18',
        url: 'satr.tuwaiq.edu.sa/course/react-essentials',
        outcome: 'المكونات، الـ Hooks، وإدارة الحالة وتدفق البيانات',
      },
      {
        id: 's-react-2',
        platform: 'youtube',
        title: 'مشروع متكامل بـ React',
        url: 'youtube.com/watch?v=react-full-project',
        outcome: 'بناء لوحة تحكم تفاعلية مع استهلاك APIs حقيقية',
      },
    ],
  },
  {
    id: 'c-next',
    title: 'Next.js',
    symbol: 'N',
    color: '#0F172A',
    category: 'frameworks',
    levelTag: 'متقدم',
    isPublished: true,
    sources: [
      {
        id: 's-next-1',
        platform: 'site',
        title: 'Next.js App Router Learn',
        url: 'nextjs.org/learn/dashboard-app',
        outcome: 'الرندرة على السيرفر (SSR) و Server Components وأحدث معايير الويب',
      },
    ],
  },
  {
    id: 'c-tailwind',
    title: 'Tailwind CSS',
    symbol: 'TW',
    color: '#34A853',
    category: 'frameworks',
    levelTag: 'اختياري ومفضل',
    isPublished: true,
    sources: [
      {
        id: 's-tw-1',
        platform: 'youtube',
        title: 'دورة Tailwind CSS الشاملة',
        url: 'youtube.com/watch?v=tailwind-arabic',
        outcome: 'سرعة بناء الواجهات العصرية مع التخصيص الكامل والأنماط الداكنة',
      },
    ],
  },
  {
    id: 'c-node',
    title: 'Node.js & Express',
    symbol: 'ND',
    color: '#34A853',
    category: 'frameworks',
    levelTag: 'متقدم',
    isPublished: true,
    sources: [
      {
        id: 's-node-1',
        platform: 'satr',
        title: 'بناء واجهات API بـ Node.js',
        url: 'satr.tuwaiq.edu.sa/course/nodejs-backend',
        outcome: 'تصميم RESTful APIs وربطها بقواعد البيانات والمصادقة',
      },
    ],
  },
  {
    id: 'c-git',
    title: 'Git & GitHub',
    symbol: 'G',
    color: '#EA4335',
    category: 'other',
    levelTag: 'أساسي للجميع',
    isPublished: true,
    sources: [
      {
        id: 's-git-1',
        platform: 'satr',
        title: 'إدارة النسخ والمشاريع بـ Git',
        url: 'satr.tuwaiq.edu.sa/course/git-github',
        outcome: 'إدارة الفروع (Branches) وحل التعارضات والعمل الجماعي',
      },
      {
        id: 's-git-2',
        platform: 'site',
        title: 'GitHub Skills التفاعلي',
        url: 'skills.github.com',
        outcome: 'رفع الملفات وإطلاق المشاريع عبر GitHub Pages و Pull Requests',
      },
    ],
  },
];

export const LeaderLearningSourcesView: React.FC<LeaderLearningSourcesViewProps> = ({ currentUser }) => {
  const canManageContent = store.canManageContent();
  const [courses, setCourses] = useState<ContentCourseItem[]>(() => {
    const saved = localStorage.getItem('web_track_content_courses_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_COURSES;
      }
    }
    return DEFAULT_COURSES;
  });

  const saveCourses = (next: ContentCourseItem[]) => {
    setCourses(next);
    localStorage.setItem('web_track_content_courses_v1', JSON.stringify(next));
  };

  // تصفية الفئات: الكل، لغات، أطر، أخرى
  const [activeCategory, setActiveCategory] = useState<'all' | 'languages' | 'frameworks' | 'other'>('all');

  const countLanguages = courses.filter((c) => c.category === 'languages').length;
  const countFrameworks = courses.filter((c) => c.category === 'frameworks').length;
  const countOther = courses.filter((c) => c.category === 'other').length;
  const countAll = courses.length;

  const filteredCourses = courses.filter((c) => {
    if (activeCategory === 'languages') return c.category === 'languages';
    if (activeCategory === 'frameworks') return c.category === 'frameworks';
    if (activeCategory === 'other') return c.category === 'other';
    return true;
  });

  // حالة نموذج إضافة/تعديل مصدر
  const [formTargetCourseId, setFormTargetCourseId] = useState<string | null>('c-css');
  const [formSourceId, setFormSourceId] = useState<string | null>(null); // null = new, string = edit
  const [formPlatform, setFormPlatform] = useState<'satr' | 'youtube' | 'site' | 'book'>('youtube');
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formOutcome, setFormOutcome] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const targetCourse = courses.find((c) => c.id === formTargetCourseId);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenAddSource = (courseId: string) => {
    setFormTargetCourseId(courseId);
    setFormSourceId(null);
    setFormPlatform('satr');
    setFormTitle('');
    setFormUrl('');
    setFormOutcome('');
    // التمرير إلى النموذج
    setTimeout(() => {
      document.getElementById('source-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleOpenEditSource = (courseId: string, s: ContentCourseItem['sources'][0]) => {
    setFormTargetCourseId(courseId);
    setFormSourceId(s.id);
    setFormPlatform(s.platform);
    setFormTitle(s.title);
    setFormUrl(s.url);
    setFormOutcome(s.outcome || '');
    setTimeout(() => {
      document.getElementById('source-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleDeleteSource = (courseId: string, sourceId: string) => {
    if (!window.confirm('هل أنتِ متأكدة من رغبتك في حذف هذا المصدر التعليمي؟')) return;
    const updated = courses.map((c) => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        sources: c.sources.filter((s) => s.id !== sourceId),
      };
    });
    saveCourses(updated);
    showToast('تم حذف المصدر التعليمي بنجاح.');
  };

  const handleMoveSource = (courseId: string, sourceIdx: number, direction: 'up' | 'down') => {
    const updated = courses.map((c) => {
      if (c.id !== courseId) return c;
      const newSources = [...c.sources];
      const targetIdx = direction === 'up' ? sourceIdx - 1 : sourceIdx + 1;
      if (targetIdx < 0 || targetIdx >= newSources.length) return c;
      const temp = newSources[sourceIdx];
      newSources[sourceIdx] = newSources[targetIdx];
      newSources[targetIdx] = temp;
      return { ...c, sources: newSources };
    });
    saveCourses(updated);
  };

  const handleSaveSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTargetCourseId) return;
    if (!formTitle.trim()) {
      alert('يرجى إدخال عنوان المصدر.');
      return;
    }

    const updated = courses.map((c) => {
      if (c.id !== formTargetCourseId) return c;
      if (formSourceId) {
        // Edit existing
        return {
          ...c,
          sources: c.sources.map((s) =>
            s.id === formSourceId
              ? {
                  ...s,
                  platform: formPlatform,
                  title: formTitle.trim(),
                  url: formUrl.trim(),
                  outcome: formOutcome.trim(),
                }
              : s
          ),
        };
      } else {
        // Add new
        const newSource = {
          id: `s-${Date.now()}`,
          platform: formPlatform,
          title: formTitle.trim(),
          url: formUrl.trim(),
          outcome: formOutcome.trim(),
        };
        return {
          ...c,
          sources: [...c.sources, newSource],
        };
      }
    });

    saveCourses(updated);
    showToast(formSourceId ? 'تم تحديث بيانات المصدر التعليمي.' : 'تمت إضافة المصدر التعليمي الجديد للكورس.');
    setFormSourceId(null);
    setFormTitle('');
    setFormUrl('');
    setFormOutcome('');
  };

  // نافذة كورس جديد
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSymbol, setNewCourseSymbol] = useState('');
  const [newCourseColor, setNewCourseColor] = useState('#4285F4');
  const [newCourseCategory, setNewCourseCategory] = useState<'languages' | 'frameworks' | 'other'>('frameworks');
  const [newCourseLevelTag, setNewCourseLevelTag] = useState('أساسي للجميع');

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) {
      alert('يرجى كتابة اسم الكورس.');
      return;
    }
    const newCourse: ContentCourseItem = {
      id: `c-${Date.now()}`,
      title: newCourseTitle.trim(),
      symbol: newCourseSymbol.trim() || newCourseTitle.trim().charAt(0).toUpperCase(),
      color: newCourseColor,
      category: newCourseCategory,
      levelTag: newCourseLevelTag,
      isPublished: true,
      sources: [],
    };
    const updated = [newCourse, ...courses];
    saveCourses(updated);
    setIsNewCourseModalOpen(false);
    setNewCourseTitle('');
    setNewCourseSymbol('');
    showToast(`تمت إضافة كورس "${newCourse.title}" بنجاح.`);
  };

  const handleDownloadLearningGuide = () => {
    const guideContent = `دليل التعلم المعتمد — مسار تصميم وتطوير الويب
جامعة الطائف — نادي قوقل للطلبة المطورين (GDSC)

1. اللغات الأساسية:
- HTML5: بناء الهيكل ودلالة العناصر
- CSS3: التنسيق، Flexbox، CSS Grid والتجاوب
- JavaScript (ES6+): المفاهيم المتقدمة ومعالجة الأحداث والـ DOM
- TypeScript: كتابة شيفرات احترافية خالية من أخطاء الأنواع

2. أطر العمل والمكتبات:
- React 18: المكونات و Hooks وإدارة الحالة
- Next.js: أحدث معايير الويب والرندرة الفائقة
- Tailwind CSS: تسريع بناء الواجهات الاحترافية
- Node.js & Express: ربط الخوادم وقواعد البيانات

3. أدوات التطوير المشتركة:
- Git & GitHub: إدارة النسخ والعمل الجماعي البرمجي
- نشر واستضافة المشاريع عبر Vercel و GitHub Pages

مع تحيات قيادة مسار الويب ✨`;

    const blob = new Blob([guideContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'دليل_تعلم_مسار_الويب_المعتمد.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('تم تحميل دليل التعلم المعتمد لمسار الويب بنجاح.');
  };

  const getPlatformBadge = (platform: ContentCourseItem['sources'][0]['platform']) => {
    switch (platform) {
      case 'satr':
        return { label: 'سطر', bg: '#E8F0FE', color: '#1A73E8' };
      case 'youtube':
        return { label: 'يوتيوب', bg: '#FDE7E5', color: '#C5221F' };
      case 'site':
        return { label: 'موقع', bg: '#E6F4EA', color: '#137333' };
      case 'book':
        return { label: 'كتاب', bg: '#FFF1CC', color: '#B06000' };
      default:
        return { label: 'رابط', bg: '#F1F3F4', color: '#3C4043' };
    }
  };

  return (
    <div className="w-full text-right" style={{ color: '#0F172A', fontFamily: `'IBM Plex Sans Arabic', Arimo, sans-serif` }}>
      {/* Toast الإشعار */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: '#0F172A',
            color: '#fff',
            padding: '14px 24px',
            borderRadius: '99px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '15px',
            fontWeight: 700,
          }}
        >
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* الترويسة الرئيسية مطابقة للبروتوتايب */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: '48px', lineHeight: 1.1, fontWeight: 800, margin: 0, color: '#0F172A' }}>
            مصادر التعلم
          </h1>
          <p style={{ fontSize: '18px', marginTop: '6px', color: '#3c4452', fontWeight: 600 }}>
            لكل كورس مصدر أو أكثر: سطر، يوتيوب، أو غيرها.
          </p>
        </div>

        {/* أزرار الإجراءات العلوية */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleDownloadLearningGuide}
            className="b"
            style={{
              background: '#F1F3F4',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12M7 10l5 5 5-5M4 21h16"></path>
            </svg>
            دليل التعلم PDF
          </button>

          {canManageContent ? (
            <button
              type="button"
              onClick={() => setIsNewCourseModalOpen(true)}
              className="b"
              style={{
                background: '#F9AB00',
                color: '#0F172A',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              كورس جديد
            </button>
          ) : store.isSupervisorOnly() ? (
            <button
              type="button"
              onClick={async () => {
                await store.requestSupervisorPermission(currentUser.fullName, 'تعديل أو إضافة كورسات المحتوى');
                alert('تم إرسال طلب الصلاحية إلى القائدة غيداء بنجاح ✨');
              }}
              className="b"
              style={{
                background: '#EEF2FF',
                color: '#4338CA',
                border: '1.5px solid #C7D2FE',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              طلب إذن تعديل المحتوى من غيداء 📩
            </button>
          ) : null}
        </div>
      </div>

      {/* أزرار التبويبات الفئوية (tabs-proto) */}
      <div className="mb-6">
        <div className="tabs-proto">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={activeCategory === 'all' ? 'on' : ''}
          >
            الكل {countAll}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('languages')}
            className={activeCategory === 'languages' ? 'on' : ''}
          >
            لغات {countLanguages}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('frameworks')}
            className={activeCategory === 'frameworks' ? 'on' : ''}
          >
            أطر {countFrameworks}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('other')}
            className={activeCategory === 'other' ? 'on' : ''}
          >
            أخرى {countOther}
          </button>
        </div>
      </div>

      {/* شبكة بطاقات الكورسات (flex: 1; min-width: 560px;) */}
      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
        {filteredCourses.map((c) => {
          const categoryName = c.category === 'languages' ? 'لغات' : c.category === 'frameworks' ? 'أطر' : 'أخرى';

          return (
            <div
              key={c.id}
              className="k"
              style={{
                flex: 1,
                minWidth: 'min(100%, 560px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '24px',
              }}
            >
              {/* ترويسة بطاقة الكورس */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: c.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Arimo',
                    fontWeight: 700,
                    fontSize: '22px',
                    color: c.color === '#0F172A' ? '#fff' : '#0F172A',
                    flex: 'none',
                  }}
                >
                  {c.symbol}
                </div>

                <div style={{ flex: 1 }}>
                  <b style={{ fontFamily: 'Arimo', fontSize: '26px', color: '#0F172A', display: 'block' }}>
                    {c.title}
                  </b>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span className="t-proto" style={{ background: '#F1F3F4', color: '#0F172A' }}>
                      {categoryName}
                    </span>
                    <span className="t-proto" style={{ background: '#E6F4EA', color: '#137333' }}>
                      {c.levelTag}
                    </span>
                  </div>
                </div>

                {/* حالة النشر */}
                <span
                  className="t-proto"
                  onClick={() => {
                    const updated = courses.map((x) => (x.id === c.id ? { ...x, isPublished: !x.isPublished } : x));
                    saveCourses(updated);
                    showToast(c.isPublished ? `تم تحويل ${c.title} لمسودة` : `تم نشر ${c.title} للجميع`);
                  }}
                  style={{
                    background: c.isPublished ? '#E6F4EA' : '#F1F3F4',
                    color: c.isPublished ? '#137333' : '#5F6368',
                    cursor: 'pointer',
                  }}
                  title="اضغط للتبديل بين منشور ومسودة"
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: c.isPublished ? '#34A853' : '#9AA0A6',
                      marginInlineEnd: '6px',
                    }}
                  />
                  {c.isPublished ? 'منشور' : 'مسودة'}
                </span>
              </div>

              {/* صفوف المصادر التابعة للكورس */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                {c.sources.length === 0 ? (
                  <div style={{ padding: '16px', background: '#F7F7F4', borderRadius: '16px', textAlign: 'center', color: '#5f6673', fontSize: '15px' }}>
                    لم تتم إضافة مصادر لهذا الكورس بعد. يظهر للعضو «قريباً».
                  </div>
                ) : (
                  c.sources.map((s, idx) => {
                    const badge = getPlatformBadge(s.platform);
                    const cleanUrl = s.url.replace(/^https?:\/\//, '').replace(/\/$/, '');

                    return (
                      <div
                        key={s.id}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '12px 14px',
                          borderRadius: '16px',
                          background: '#F7F7F4',
                        }}
                      >
                        {/* مقبض السحب وتعديل الترتيب */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', color: '#9AA0A6' }}>
                          <button
                            type="button"
                            onClick={() => handleMoveSource(c.id, idx, 'up')}
                            disabled={idx === 0}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                            title="تحريك لأعلى"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                          </button>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="9" cy="6" r="1"></circle>
                            <circle cx="15" cy="6" r="1"></circle>
                            <circle cx="9" cy="12" r="1"></circle>
                            <circle cx="15" cy="12" r="1"></circle>
                            <circle cx="9" cy="18" r="1"></circle>
                            <circle cx="15" cy="18" r="1"></circle>
                          </svg>
                          <button
                            type="button"
                            onClick={() => handleMoveSource(c.id, idx, 'down')}
                            disabled={idx === c.sources.length - 1}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: idx === c.sources.length - 1 ? 'default' : 'pointer', opacity: idx === c.sources.length - 1 ? 0.3 : 1 }}
                            title="تحريك لأسفل"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                          </button>
                        </div>

                        {/* وسم المنصة */}
                        <span className="t-proto" style={{ background: badge.bg, color: badge.color, flex: 'none' }}>
                          {badge.label}
                        </span>

                        {/* تفاصيل المصدر والرابط */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <b style={{ fontSize: '17px', color: '#0F172A', display: 'block' }} className="truncate">
                            {s.title}
                          </b>
                          <a
                            href={s.url.startsWith('http') ? s.url : `https://${s.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '14px', color: '#5f6673', fontFamily: 'Arimo', display: 'block', textDecoration: 'none' }}
                            className="truncate hover:underline"
                            title={s.url}
                          >
                            {cleanUrl || 'بدون رابط (يظهر للعضو قريباً)'}
                          </a>
                        </div>

                        {canManageContent && (
                          <>
                            {/* زر تعديل */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditSource(c.id, s)}
                              className="b"
                              style={{
                                background: '#fff',
                                border: '2px solid #c9ced3',
                                padding: '6px 14px',
                                minHeight: '40px',
                                fontSize: '15px',
                                cursor: 'pointer',
                                color: '#0F172A',
                              }}
                            >
                              تعديل
                            </button>

                            {/* زر حذف */}
                            <button
                              type="button"
                              onClick={() => handleDeleteSource(c.id, s.id)}
                              className="b"
                              style={{
                                background: '#fff',
                                border: '2px solid #c9ced3',
                                padding: '6px 14px',
                                minHeight: '40px',
                                fontSize: '15px',
                                color: '#C5221F',
                                cursor: 'pointer',
                              }}
                            >
                              حذف
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* زر إضافة مصدر إلى هذا الكورس */}
              {canManageContent && (
                <button
                  type="button"
                  onClick={() => handleOpenAddSource(c.id)}
                  className="b"
                  style={{
                    background: '#fff',
                    border: '2px dashed #9AA0A6',
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: '#0F172A',
                    cursor: 'pointer',
                    width: '100%',
                    marginTop: 'auto',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  إضافة مصدر تعلم
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* نموذج إضافة / تعديل مصدر (المطابق تماماً للبروتوتايب) */}
      {targetCourse && (
        <div
          id="source-form-card"
          className="k"
          style={{
            marginTop: '24px',
            borderColor: '#4285F4',
            borderWidth: '3px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b style={{ fontSize: '22px', color: '#0F172A' }}>
              {formSourceId ? `تعديل مصدر في ${targetCourse.title}` : `إضافة مصدر إلى ${targetCourse.title}`}
            </b>
            <span className="t-proto" style={{ background: '#E8F0FE', color: '#1A73E8' }}>
              نموذج
            </span>
          </div>

          <form onSubmit={handleSaveSource}>
            {/* الصف الأول: أزرار المنصة + العنوان + الرابط */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mt-4">
              <div className="tabs-proto" style={{ flex: 'none' }}>
                <button
                  type="button"
                  onClick={() => setFormPlatform('satr')}
                  className={formPlatform === 'satr' ? 'on' : ''}
                >
                  سطر
                </button>
                <button
                  type="button"
                  onClick={() => setFormPlatform('youtube')}
                  className={formPlatform === 'youtube' ? 'on' : ''}
                >
                  يوتيوب
                </button>
                <button
                  type="button"
                  onClick={() => setFormPlatform('site')}
                  className={formPlatform === 'site' ? 'on' : ''}
                >
                  موقع
                </button>
                <button
                  type="button"
                  onClick={() => setFormPlatform('book')}
                  className={formPlatform === 'book' ? 'on' : ''}
                >
                  كتاب
                </button>
              </div>

              <input
                type="text"
                aria-label="العنوان"
                placeholder="عنوان المصدر (مثال: دورة التطبيقات العملية)"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  border: '2px solid #c9ced3',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />

              <input
                type="text"
                aria-label="الرابط"
                placeholder="https://…"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                style={{
                  flex: 2,
                  minWidth: '260px',
                  border: '2px solid #c9ced3',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  fontSize: '16px',
                  fontFamily: 'Arimo',
                  outline: 'none',
                  direction: 'ltr',
                  textAlign: 'right',
                }}
              />
            </div>

            {/* الصف الثاني: المخرجات + أزرار الحفظ والإلغاء */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mt-3">
              <input
                type="text"
                aria-label="المخرجات"
                placeholder="المخرجات: وش يتعلم العضو من هذا المصدر؟"
                value={formOutcome}
                onChange={(e) => setFormOutcome(e.target.value)}
                style={{
                  flex: 1,
                  border: '2px solid #c9ced3',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />

              <button
                type="submit"
                className="b"
                style={{
                  background: '#4285F4',
                  color: '#ffffff',
                  minHeight: '48px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {formSourceId ? 'تحديث المصدر' : 'حفظ المصدر'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormSourceId(null);
                  setFormTitle('');
                  setFormUrl('');
                  setFormOutcome('');
                }}
                className="b"
                style={{
                  background: '#F1F3F4',
                  color: '#0F172A',
                  minHeight: '48px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* الملاحظة السفلية المعتمدة */}
      <p style={{ marginTop: '16px', fontSize: '15px', color: '#5f6673', fontWeight: 500 }}>
        روابط وأسماء تجريبية. الأسهم بالجهة اليمنى تغيّر ترتيب المصادر، ومصدر بدون رابط يظهر للعضو «قريبًا».
      </p>

      {/* نافذة إنشاء كورس جديد */}
      {isNewCourseModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setIsNewCourseModalOpen(false)}
        >
          <div
            className="k"
            style={{
              maxWidth: '560px',
              width: '100%',
              background: '#fff',
              padding: '32px',
              border: '2px solid #0F172A',
              borderRadius: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                إضافة كورس جديد للمسار
              </h2>
              <button
                type="button"
                onClick={() => setIsNewCourseModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#0F172A' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                  اسم الكورس / التقنية:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Next.js 14 أو Figma للويب"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  style={{ width: '100%', border: '2px solid #c9ced3', borderRadius: '12px', padding: '10px 14px', fontSize: '16px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                    الرمز المختصر للأيقونة:
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="مثال: N أو FG"
                    value={newCourseSymbol}
                    onChange={(e) => setNewCourseSymbol(e.target.value)}
                    style={{ width: '100%', border: '2px solid #c9ced3', borderRadius: '12px', padding: '10px 14px', fontSize: '16px', fontFamily: 'Arimo', textTransform: 'uppercase' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                    لون خلفية الأيقونة:
                  </label>
                  <select
                    value={newCourseColor}
                    onChange={(e) => setNewCourseColor(e.target.value)}
                    style={{ width: '100%', border: '2px solid #c9ced3', borderRadius: '12px', padding: '10px 14px', fontSize: '15px' }}
                  >
                    <option value="#4285F4">أزرق Google (#4285F4)</option>
                    <option value="#EA4335">أحمر Google (#EA4335)</option>
                    <option value="#F9AB00">أصفر Google (#F9AB00)</option>
                    <option value="#34A853">أخضر Google (#34A853)</option>
                    <option value="#0F172A">كحلي داكن (#0F172A)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                    التصنيف:
                  </label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value as any)}
                    style={{ width: '100%', border: '2px solid #c9ced3', borderRadius: '12px', padding: '10px 14px', fontSize: '15px' }}
                  >
                    <option value="languages">لغات برمجة</option>
                    <option value="frameworks">أطر ومكتبات</option>
                    <option value="other">أدوات وتقنيات أخرى</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                    وسم المستوى:
                  </label>
                  <select
                    value={newCourseLevelTag}
                    onChange={(e) => setNewCourseLevelTag(e.target.value)}
                    style={{ width: '100%', border: '2px solid #c9ced3', borderRadius: '12px', padding: '10px 14px', fontSize: '15px' }}
                  >
                    <option value="أساسي للجميع">أساسي للجميع</option>
                    <option value="متقدم">متقدم</option>
                    <option value="اختياري ومفضل">اختياري ومفضل</option>
                    <option value="موصى به">موصى به</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="submit"
                  className="b"
                  style={{ flex: 1, background: '#F9AB00', color: '#0F172A', cursor: 'pointer', fontWeight: 700 }}
                >
                  إضافة الكورس
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewCourseModalOpen(false)}
                  className="b"
                  style={{ background: '#F1F3F4', color: '#0F172A', cursor: 'pointer', fontWeight: 700 }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
