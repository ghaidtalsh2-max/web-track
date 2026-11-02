import React from 'react';
import { GDGLogo } from '../brand/GDGLogo';

export const Footer: React.FC = () => {
  return (
    <footer
      className="mt-28 sm:mt-36 transition-colors text-right"
      style={{
        backgroundColor: 'var(--bg-card)',
      }}
    >
      {/* الفاصل بين الصفحة والتذييل: خطوط ألوان رفيعة لهوية Google */}
      <div className="w-full flex flex-col" style={{ gap: '2px' }} aria-hidden="true">
        <div style={{ height: '2.5px', backgroundColor: '#4285F4', width: '100%' }} />
        <div style={{ height: '2.5px', backgroundColor: '#EA4335', width: '100%' }} />
        <div style={{ height: '2.5px', backgroundColor: '#FBBC04', width: '100%' }} />
        <div style={{ height: '2.5px', backgroundColor: '#34A853', width: '100%' }} />
      </div>

      {/* مسافة واسعة ومريحة لنزول محتوى التذييل بعد الخطوط الملونة */}
      <div className="container pt-20 pb-12 sm:pt-24 sm:pb-14">
        <div className="footer-grid mb-12">
          {/* العمود الأول (اليمين): قادة النادي */}
          <div className="footer-col-leads flex flex-col gap-3">
            <h4
              className="text-base font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              قادة النادي :
            </h4>
            <div className="flex flex-col gap-2.5 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4285F4', flexShrink: 0, display: 'inline-block' }} />
                <span>وجد العتيبي</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EA4335', flexShrink: 0, display: 'inline-block' }} />
                <span>ثامر الشنبري</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9C27B0', flexShrink: 0, display: 'inline-block' }} />
                <span>رنا أمين (نائبة ومستشارة القادة)</span>
              </div>
            </div>
          </div>

          {/* العمود الثاني: قادة المجالات */}
          <div className="footer-col-right flex flex-col gap-3">
            <h4
              className="text-base font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              قادة المجالات :
            </h4>
            <div className="flex flex-col gap-2.5 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4285F4', flexShrink: 0, display: 'inline-block' }} />
                <span>أثير العتيبي</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EA4335', flexShrink: 0, display: 'inline-block' }} />
                <span>عامر الحارثي (نائب القائدة)</span>
              </div>
            </div>
          </div>

          {/* العمود الثالث: قادة المجال */}
          <div className="footer-col-center flex flex-col gap-3">
            <h4
              className="text-base font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              قادة المجال :
            </h4>
            <div className="flex flex-col gap-2.5 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34A853', flexShrink: 0, display: 'inline-block' }} />
                <span className="font-bold">غيداء الشريف</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FBBC04', flexShrink: 0, display: 'inline-block' }} />
                <span>ريتال القثامي</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4285F4', flexShrink: 0, display: 'inline-block' }} />
                <span>سلمان الغامدي (نائب القادة)</span>
              </div>
            </div>
          </div>

          {/* العمود الرابع (اليسار): الشعار المصغر والوصف مع مسافة جمالية مريحة بعد الخطوط الملونة */}
          <div className="footer-col-left flex flex-col gap-3 pt-6 sm:pt-7">
            <div className="flex items-center">
              <GDGLogo variant="full" size="sm" />
            </div>
            <p
              className="text-xs sm:text-sm font-medium leading-relaxed"
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
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                style={{
                  backgroundColor: 'rgba(66, 133, 244, 0.1)',
                  color: '#4285F4',
                }}
              >
                #خلّك_قوقلي
              </span>
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold"
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

        {/* سطر الحقوق السفلي في خط واحد يمين ويسار بدون إيموجي */}
        <div
          className="pt-6 border-t text-xs font-medium flex flex-col sm:flex-row items-center justify-between gap-3 text-right"
          style={{
            borderColor: 'var(--border-light)',
            color: 'var(--text-muted)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-right">
            <span>© 2026 نادي قوقل للطلبة المطورين — جامعة الطائف. جميع الحقوق محفوظة.</span>
            <span className="hidden sm:inline" style={{ opacity: 0.4 }}>•</span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)', opacity: 0.85 }}>
              Google Developer Groups on Campus — Taif University
            </span>
          </div>

          <div style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
            تم الإنشاء بواسطة : غيداء
          </div>
        </div>
      </div>
    </footer>
  );
};
