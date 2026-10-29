import React from 'react';
import { GDGLogo } from '../brand/GDGLogo';

export const Footer: React.FC = () => {
  return (
    <footer
      className="mt-20 transition-colors text-right"
      style={{
        backgroundColor: 'var(--bg-card)',
      }}
    >
      {/* الفاصل بين الصفحة والتذييل: خطوط ألوان رفيعة لهوية Google */}
      <div className="w-full flex flex-col" style={{ gap: '2px' }} aria-hidden="true">
        <div style={{ height: '2px', backgroundColor: '#4285F4', width: '100%' }} />
        <div style={{ height: '2px', backgroundColor: '#EA4335', width: '100%' }} />
        <div style={{ height: '2px', backgroundColor: '#FBBC04', width: '100%' }} />
        <div style={{ height: '2px', backgroundColor: '#34A853', width: '100%' }} />
      </div>

      <div className="container pt-12 pb-10">
        <div className="footer-grid mb-10">
          {/* العمود الأول (اليمين): الإشراف */}
          <div className="footer-col-right flex flex-col gap-3">
            <h4
              className="text-base font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              الإشراف
            </h4>
            <div className="flex flex-col gap-2.5 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4285F4', flexShrink: 0, display: 'inline-block' }} />
                <span>أثير العتيبي — <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>قائدة المجالات</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EA4335', flexShrink: 0, display: 'inline-block' }} />
                <span>عامر الحارثي — <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>نائب قائدة المجالات</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9C27B0', flexShrink: 0, display: 'inline-block' }} />
                <span>رنا أمين فيض — <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>نائبة قادة النادي والمستشارة</span></span>
              </div>
            </div>
          </div>

          {/* العمود الثاني (الوسط): قادة المسار */}
          <div className="footer-col-center flex flex-col gap-3">
            <h4
              className="text-base font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              قادة المسار
            </h4>
            <div className="flex flex-col gap-2.5 text-sm font-semibold items-center" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34A853', flexShrink: 0, display: 'inline-block' }} />
                <span>غيداء تركي الشريف — <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>قائدة المسار</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FBBC04', flexShrink: 0, display: 'inline-block' }} />
                <span>ريتال القثامي — <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>قائدة المسار</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4285F4', flexShrink: 0, display: 'inline-block' }} />
                <span>سلمان الغامدي — <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>نائب القادة</span></span>
              </div>
            </div>
          </div>

          {/* العمود الثالث (اليسار): الشعار والوصف الرسمي المتناسق */}
          <div className="footer-col-left flex flex-col gap-3">
            <div className="flex items-center">
              <GDGLogo variant="full" size="md" />
            </div>
            <p
              className="text-sm font-medium leading-relaxed"
              style={{
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.75',
              }}
            >
              منصة تفاعلية مخصصة لتسهيل التفاعل والتواصل<br />
              بين أعضاء المسار وقادتهم — نادي الطلبة المطورين.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: 'rgba(66, 133, 244, 0.1)',
                  color: '#4285F4',
                }}
              >
                #خلّك_قوقلي
              </span>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: 'rgba(52, 168, 83, 0.1)',
                  color: '#34A853',
                }}
              >
                مسار الويب 2026
              </span>
            </div>
          </div>
        </div>

        {/* سطر الحقوق السفلي بدون رموز الألوان وبفواصل دقيقة */}
        <div
          className="footer-bottom-row pt-6 border-t text-xs font-medium"
          style={{
            borderColor: 'var(--border-light)',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © 2026 نادي قوقل للطلبة المطورين — جامعة الطائف. جميع الحقوق محفوظة.
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Google Developer Groups on Campus — Taif University
          </div>
        </div>
      </div>
    </footer>
  );
};
