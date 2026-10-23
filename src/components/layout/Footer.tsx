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
        <div className="footer-grid mb-10 text-right">
          {/* العمود الأول (اليمين): الإشراف لوحدهم */}
          <div className="flex flex-col gap-3">
            <h4
              className="text-base font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              الإشراف
            </h4>
            <div className="flex flex-col gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] flex-shrink-0" />
                <span>أثير العتيبي — <span className="text-xs" style={{ color: 'var(--text-muted)' }}>قائدة المجالات</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335] flex-shrink-0" />
                <span>عامر الحارثي — <span className="text-xs" style={{ color: 'var(--text-muted)' }}>نائب قائدة المجالات</span></span>
              </div>
            </div>
          </div>

          {/* العمود الثاني (الوسط): قادة المسار لوحدهم */}
          <div className="flex flex-col gap-3">
            <h4
              className="text-base font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              قادة المسار
            </h4>
            <div className="flex flex-col gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] flex-shrink-0" />
                <span>غيداء تركي الشريف</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] flex-shrink-0" />
                <span>ريتال القثامي</span>
              </div>
            </div>
          </div>

          {/* العمود الثالث (اليسار): الشعار والوصف الرسمي */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <GDGLogo variant="full" size="md" />
            </div>
            <p
              className="text-sm font-medium leading-relaxed max-w-md"
              style={{ color: 'var(--text-secondary)' }}
            >
              منصة تفاعلية مخصصة لتسهيل التفاعل والتواصل بين أعضاء المسار وقادتهم.
            </p>
            <div className="mt-1">
              <span
                className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: 'rgba(66, 133, 244, 0.1)',
                  color: '#4285F4',
                }}
              >
                #خلّك_قوقلي
              </span>
            </div>
          </div>
        </div>

        {/* سطر الحقوق السفلي بدون رموز الألوان وبفواصل دقيقة */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium"
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
