import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Columns,
  Rows,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  RefreshCw,
  Code2,
  FileCode,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../../types';
import { store } from '../../services/store';

interface WebLabProps {
  currentUser: UserProfile;
}

const DEFAULT_HTML = `<!-- مرحباً بك في مختبر الويب 🚀 -->
<div class="card">
  <h1>Hello Taif</h1>
  <p>منصة مسار الويب · بيئة التطوير التفاعلية</p>
  <button id="celebrateBtn">اضغط للاحتفال 🎉</button>
</div>`;

const DEFAULT_CSS = `/* نسّق صفحتك وألوان الهوية */
body {
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
  color: #EA4335; /* غير اللون هنا لإكمال التحدي */
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
  background-color: #4285F4;
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
}

button:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}`;

const DEFAULT_JS = `// التفاعل البرمجي
const btn = document.getElementById('celebrateBtn');
btn.onclick = () => {
  btn.innerText = 'احتفال مبهج! 🎊';
  window.parent.postMessage('trigger-confetti', '*');
  setTimeout(() => {
    btn.innerText = 'اضغط للاحتفال 🎉';
  }, 2000);
};`;

export const WebLab: React.FC<WebLabProps> = ({ currentUser }) => {
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [jsCode, setJsCode] = useState(DEFAULT_JS);
  const [activeEditorTab, setActiveEditorTab] = useState<'html' | 'css' | 'js'>('html');
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [layoutMode, setLayoutMode] = useState<'side' | 'stack'>('side');
  const [devicePreviewMode, setDevicePreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // تحديث محتوى الـ iframe المعزول
  const runCode = () => {
    if (!iframeRef.current) return;
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 300);

    const sourceDoc = `
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <meta charset="utf-8">
          <style>
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;

    iframeRef.current.srcdoc = sourceDoc;

    // التحقق من إكمال تحدي اليوم
    if (cssCode.includes('color:') && !cssCode.includes('#EA4335') && !challengeCompleted) {
      setChallengeCompleted(true);
      store.addPoints(currentUser.id, 10, 'إكمال تحدي اليوم في مختبر الويب');
      if (currentUser.settings?.celebrations) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4285F4', '#EA4335', '#34A853', '#F9AB00'],
        });
      }
    }
  };

  const resetCode = () => {
    setHtmlCode(DEFAULT_HTML);
    setCssCode(DEFAULT_CSS);
    setJsCode(DEFAULT_JS);
    setIframeKey((prev) => prev + 1);
  };

  const copyCurrentCode = () => {
    const currentCode =
      activeEditorTab === 'html'
        ? htmlCode
        : activeEditorTab === 'css'
        ? cssCode
        : jsCode;
    navigator.clipboard?.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // استماع لرسالة trigger-confetti من داخل iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'trigger-confetti' && currentUser.settings?.celebrations) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#4285F4', '#34A853', '#F9AB00', '#EA4335'],
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentUser]);

  useEffect(() => {
    runCode();
  }, [iframeKey]);

  const activeCode =
    activeEditorTab === 'html'
      ? htmlCode
      : activeEditorTab === 'css'
      ? cssCode
      : jsCode;

  const lineCount = activeCode.split('\n').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container py-8 sm:py-12 text-right"
    >
      {/* رأس صفحة المختبر مع أدوات التحكم الحيوية */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse" />
            <span className="text-xs font-bold text-gray-500">مسار الويب · بيئة معزولة حية</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            مختبر الويب
          </h1>
        </div>

        {/* أزرار التحكم الحيوية ثلاثية الأبعاد */}
        <div className="flex flex-wrap items-center gap-3">
          {/* محول طريقة العرض: جنباً إلى جنب أو تحت بعض */}
          <div className="flex items-center bg-gray-100 p-1 rounded-2xl border-2 border-[#0F1729]">
            <button
              onClick={() => setLayoutMode('side')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                layoutMode === 'side'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-black'
              }`}
              title="عرض جنباً إلى جنب"
            >
              <Columns size={13} />
              <span>جنباً إلى جنب</span>
            </button>
            <button
              onClick={() => setLayoutMode('stack')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                layoutMode === 'stack'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-black'
              }`}
              title="عرض رأسي (تحت بعض)"
            >
              <Rows size={13} />
              <span>تحت بعض</span>
            </button>
          </div>

          {/* زر إعادة تعيين */}
          <button
            onClick={resetCode}
            className="btn-3d btn-3d-gray px-4 py-2 text-xs font-black cursor-pointer"
            title="استعادة الكود الأصلي"
          >
            <RotateCcw size={14} />
            <span>إعادة تعيين</span>
          </button>

          {/* زر التشغيل الحيوي */}
          <button
            onClick={runCode}
            className="btn-3d btn-3d-green px-6 py-2 text-xs font-black cursor-pointer shadow-md"
            title="تشغيل وتحديث المعاينة"
          >
            <Play size={14} fill="white" />
            <span>شغّل الكود</span>
          </button>
        </div>
      </div>

      {/* منطقة محرر الكود والمعاينة الحية جنباً إلى جنب */}
      <div
        className={layoutMode === 'side' ? 'weblab-split-layout' : 'flex flex-col gap-6 mb-6'}
        style={
          layoutMode === 'side'
            ? {
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: '24px',
                marginBottom: '24px',
                alignItems: 'stretch',
                width: '100%',
              }
            : undefined
        }
      >
        {/* =================================================================== */}
        {/* 1. محرر الكود والتيرمينال الحيوي الفخم (VS Code / Terminal Style)   */}
        {/* =================================================================== */}
        <div
          className="ide-terminal-window flex flex-col"
          style={{
            minHeight: '520px',
            height: '100%',
            minWidth: 0,
            width: '100%',
            backgroundColor: '#0D1117',
          }}
        >
          {/* شريط أدوات النافذة البرمجية مع نقاط نظام ماك وألسنة الملفات */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-[#21262D]"
            style={{ backgroundColor: '#161B22' }}
          >
            {/* ألسنة الملفات الثلاثة (HTML / CSS / JS) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveEditorTab('html')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeEditorTab === 'html'
                    ? 'bg-[#EA4335] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white hover:bg-[#21262D]'
                }`}
              >
                <FileCode size={13} />
                <span>index.html</span>
              </button>

              <button
                onClick={() => setActiveEditorTab('css')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeEditorTab === 'css'
                    ? 'bg-[#4285F4] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white hover:bg-[#21262D]'
                }`}
              >
                <Code2 size={13} />
                <span>style.css</span>
              </button>

              <button
                onClick={() => setActiveEditorTab('js')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeEditorTab === 'js'
                    ? 'bg-[#F9AB00] text-gray-950 font-black shadow-xs'
                    : 'text-gray-400 hover:text-white hover:bg-[#21262D]'
                }`}
              >
                <Terminal size={13} />
                <span>app.js</span>
              </button>
            </div>

            {/* أدوات المحرر الجانبية: نسخ الكود ونقاط ماك */}
            <div className="flex items-center gap-3">
              <button
                onClick={copyCurrentCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold text-gray-400 hover:text-white hover:bg-[#21262D] transition-all cursor-pointer"
                title="نسخ الكود الحالي"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-green-400" />
                    <span className="text-green-400">تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>نسخ</span>
                  </>
                )}
              </button>

              {/* نقاط ماك الثلاثية */}
              <div className="flex items-center gap-1.5 mr-1" dir="ltr">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block" />
              </div>
            </div>
          </div>

          {/* مساحة تحرير الكود مع أرقام الأسطر واللون الحيوي الكامل */}
          <div className="flex-1 flex overflow-hidden" dir="ltr">
            {/* عمود أرقام الأسطر */}
            <div className="ide-line-numbers hidden sm:block">
              {Array.from({ length: Math.max(lineCount, 16) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* حقل إدخال الكود الحيوي الملون المباشر */}
            <div className="flex-1 relative flex flex-col p-0">
              {activeEditorTab === 'html' && (
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="ide-code-textarea w-full flex-1"
                  style={{
                    backgroundColor: '#0D1117',
                    color: '#7EE787',
                    caretColor: '#58A6FF',
                    minHeight: '400px',
                  }}
                  dir="ltr"
                  spellCheck={false}
                  placeholder="<!-- اكتب كود HTML هنا -->"
                />
              )}
              {activeEditorTab === 'css' && (
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="ide-code-textarea w-full flex-1"
                  style={{
                    backgroundColor: '#0D1117',
                    color: '#79C0FF',
                    caretColor: '#58A6FF',
                    minHeight: '400px',
                  }}
                  dir="ltr"
                  spellCheck={false}
                  placeholder="/* اكتب كود CSS هنا */"
                />
              )}
              {activeEditorTab === 'js' && (
                <textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  className="ide-code-textarea w-full flex-1"
                  style={{
                    backgroundColor: '#0D1117',
                    color: '#FFA657',
                    caretColor: '#58A6FF',
                    minHeight: '400px',
                  }}
                  dir="ltr"
                  spellCheck={false}
                  placeholder="// اكتب كود JavaScript هنا"
                />
              )}
            </div>
          </div>

          {/* شريط الحالة السفلي للمحرر كأنه VS Code حقيقي */}
          <div
            className="flex items-center justify-between px-4 py-2 text-[11px] font-mono border-t border-[#21262D]"
            style={{ backgroundColor: '#161B22', color: '#8B949E' }}
            dir="ltr"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-green-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live Engine Ready
              </span>
              <span>UTF-8</span>
              <span>Tab Size: 2</span>
            </div>

            <div className="flex items-center gap-3">
              <span>Lines: {lineCount}</span>
              <span className="text-[#58A6FF] font-bold">
                {activeEditorTab === 'html' ? 'HTML5' : activeEditorTab === 'css' ? 'CSS3' : 'ES6+'}
              </span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. نافذة المعاينة الحية المباشرة المنظمة والفخمة (Browser Mockup)  */}
        {/* =================================================================== */}
        <div
          className="ide-preview-window flex flex-col"
          style={{
            minHeight: '520px',
            height: '100%',
            minWidth: 0,
            width: '100%',
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* شريط متصفح حديث يحاكي Safari / Chrome */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b-2 border-[#0F1729]"
            dir="ltr"
          >
            {/* نقاط نافذة المتصفح */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400 border border-red-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-400 border border-green-500 inline-block" />
            </div>

            {/* شريط العنوان التفاعلي للمتصفح */}
            <div className="flex-1 max-w-sm mx-3 flex items-center justify-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-gray-300 shadow-2xs text-[11px] font-mono text-gray-700">
              <Lock size={11} className="text-green-600" />
              <span className="truncate">https://weblab.gdgoc-taif.dev/live-sandbox</span>
              <button
                onClick={runCode}
                className={`p-0.5 hover:text-black transition-all cursor-pointer ${
                  isRefreshing ? 'animate-spin text-blue-600' : ''
                }`}
                title="إعادة تحميل المعاينة"
              >
                <RefreshCw size={11} />
              </button>
            </div>

            {/* محول مقاس الشاشة: كمبيوتر / تابلت / جوال */}
            <div className="flex items-center bg-gray-200 p-0.5 rounded-lg border border-gray-300">
              <button
                onClick={() => setDevicePreviewMode('desktop')}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  devicePreviewMode === 'desktop' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500'
                }`}
                title="عرض شاشة كمبيوتر"
              >
                <Monitor size={13} />
              </button>
              <button
                onClick={() => setDevicePreviewMode('tablet')}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  devicePreviewMode === 'tablet' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500'
                }`}
                title="عرض شاشة لوحي (Tablet)"
              >
                <Tablet size={13} />
              </button>
              <button
                onClick={() => setDevicePreviewMode('mobile')}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  devicePreviewMode === 'mobile' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-500'
                }`}
                title="عرض شاشة جوال (Mobile)"
              >
                <Smartphone size={13} />
              </button>
            </div>
          </div>

          {/* مساحة المعاينة الحية الحقيقية المعزولة داخل المتصفح */}
          <div
            className="flex-1 p-3 flex items-center justify-center overflow-auto"
            style={{
              backgroundColor: '#F1F5F9',
              backgroundImage:
                'radial-gradient(#CBD5E1 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            <div
              className="h-full flex flex-col transition-all duration-300 rounded-2xl overflow-hidden shadow-md border-2 border-[#0F1729]"
              style={{
                width:
                  devicePreviewMode === 'mobile'
                    ? '360px'
                    : devicePreviewMode === 'tablet'
                    ? '560px'
                    : '100%',
                backgroundColor: '#FFFFFF',
              }}
            >
              <iframe
                ref={iframeRef}
                key={iframeKey}
                title="Web Lab Isolated Sandbox Live Preview"
                sandbox="allow-scripts"
                className="w-full h-full min-h-[380px] border-none"
              />
            </div>
          </div>

          {/* شريط سفلي للمعاينة */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs font-bold text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>معاينة حية فورية ومباشرة</span>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">
              Viewport: {devicePreviewMode === 'mobile' ? '360px (Mobile)' : devicePreviewMode === 'tablet' ? '560px (Tablet)' : '100% (Responsive)'}
            </span>
          </div>
        </div>
      </div>

      {/* شريط تحدي اليوم المعتمد ثلاثي الأبعاد */}
      <div
        className="card-3d-tactile p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#0F1729',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 font-black border-2 border-[#0F1729]"
            style={{ boxShadow: '0 3px 0 0 #0F1729' }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <span className="text-base font-black text-gray-900 block mb-0.5">
              تحدي اليوم: غيّر لون العنوان واجعل الزر يطلق احتفالًا.
            </span>
            <span className="text-xs text-gray-600 font-medium">
              غيّر كود اللون في تبويب CSS ثم اضغط «شغّل الكود» لاختبار المعاينة التفاعلية وكسب النقاط.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {challengeCompleted ? (
            <span className="btn-3d btn-3d-green text-xs font-black">
              <CheckCircle2 size={16} />
              <span>أحسنت! أُضيفت 10 نقاط لحسابك</span>
            </span>
          ) : (
            <span className="btn-3d btn-3d-yellow text-xs font-black">
              + 10 نقاط مكافأة
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
