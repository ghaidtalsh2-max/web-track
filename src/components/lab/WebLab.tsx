import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  Plus,
  Award,
  BookOpen,
  Settings,
  Lightbulb,
  Send,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, LabChallenge } from '../../types';
import { store } from '../../services/store';

interface WebLabProps {
  currentUser: UserProfile;
}

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <title>مختبر الويب</title>
  </head>
  <body>
    <!-- ابدأ كتابة كودك هنا 🚀 -->
    <div class="card">
      <h1>Hello Taif</h1>
      <button id="actionBtn">انقر للتفاعل</button>
    </div>
  </body>
</html>`;

const DEFAULT_CSS = `/* تنسيقات CSS الأساسية */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 24px;
  font-family: system-ui, -apple-system, sans-serif;
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #F8FAFC;
}

.card {
  background: #FFFFFF;
  padding: 32px;
  border-radius: 20px;
  border: 2px solid #0F1729;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

button {
  background-color: #4285F4;
  color: #FFFFFF;
  border: 2px solid #0F1729;
  padding: 10px 20px;
  border-radius: 9999px;
  font-weight: bold;
  cursor: pointer;
}`;

const DEFAULT_JS = `// البرمجة التفاعلية JavaScript
console.log("مختبر مسار الويب جاهز للتنفيذ 🚀");
`;

export const WebLab: React.FC<WebLabProps> = ({ currentUser }) => {
  const isLeader = currentUser.role === 'track_leader' || currentUser.role === 'supervisor';

  const [activeChallenge, setActiveChallenge] = useState<LabChallenge>(() => store.getActiveLabChallenge());
  const [labChallenges, setLabChallenges] = useState<LabChallenge[]>(() => store.getLabChallenges());
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [modalTab, setModalTab] = useState<'browse' | 'create'>('browse');

  // نافذة عرض الحل المشروط ببيان السبب
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [solutionReason, setSolutionReason] = useState<string>('');
  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);
  const [solutionTab, setSolutionTab] = useState<'html' | 'css' | 'js'>('html');
  const [solutionCopied, setSolutionCopied] = useState(false);

  // نافذة تسليم التحدي للقائدة
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitToast, setSubmitToast] = useState('');

  // حالة نموذج إنشاء تحدٍ جديد للقادة
  const [customTitle, setCustomTitle] = useState('');
  const [customLevel, setCustomLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [customPoints, setCustomPoints] = useState(25);
  const [customInstruction, setCustomInstruction] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customHtml, setCustomHtml] = useState('<!-- كود البداية للتحدي -->\n<div class="custom-box">\n  <h2>تحدي جديد</h2>\n</div>');
  const [customCss, setCustomCss] = useState('/* نسّق العناصر هنا */\n.custom-box {\n  padding: 20px;\n  text-align: center;\n}');
  const [customJs, setCustomJs] = useState('// البرمجة التفاعلية\nconsole.log("Lab challenge started");');
  const [customSuccessMsg, setCustomSuccessMsg] = useState('');

  // نصوص الأكواد محملة من التحدي النشط
  const [htmlCode, setHtmlCode] = useState(() => store.getActiveLabChallenge().defaultHtml);
  const [cssCode, setCssCode] = useState(() => store.getActiveLabChallenge().defaultCss);
  const [jsCode, setJsCode] = useState(() => store.getActiveLabChallenge().defaultJs);
  const [activeEditorTab, setActiveEditorTab] = useState<'html' | 'css' | 'js'>('html');
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [layoutMode, setLayoutMode] = useState<'side' | 'stack'>('side');
  const [devicePreviewMode, setDevicePreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // اشتراك في تحديثات Store المركزي لتحديث التحدي فور تغييره
  useEffect(() => {
    const unsub = store.subscribe(() => {
      const active = store.getActiveLabChallenge();
      setActiveChallenge(active);
      setLabChallenges(store.getLabChallenges());
    });
    return unsub;
  }, []);

  const loadChallenge = (ch: LabChallenge) => {
    setActiveChallenge(ch);
    setHtmlCode(ch.defaultHtml);
    setCssCode(ch.defaultCss);
    setJsCode(ch.defaultJs);
    setChallengeCompleted(false);
    setIframeKey((prev) => prev + 1);
  };

  const handleSetActive = (ch: LabChallenge) => {
    store.setActiveLabChallenge(ch.id);
    loadChallenge(ch);
    setShowChallengeModal(false);
    if (currentUser.settings?.celebrations) {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#EA4335', '#34A853', '#F9AB00'],
      });
    }
  };

  const handleCreateCustom = () => {
    if (!customTitle.trim() || !customInstruction.trim()) return;
    const newCh = store.addCustomLabChallenge({
      title: customTitle.trim(),
      description: customDesc.trim() || customInstruction.trim(),
      instruction: customInstruction.trim(),
      points: customPoints,
      level: customLevel,
      levelLabel: customLevel === 'beginner' ? 'المستوى 1 (مبتدئ)' : customLevel === 'intermediate' ? 'المستوى 2 (متوسط)' : 'المستوى 3 (متقدم)',
      badgeColor: customLevel === 'beginner' ? '#4285F4' : customLevel === 'intermediate' ? '#34A853' : '#F9AB00',
      defaultHtml: customHtml,
      defaultCss: customCss,
      defaultJs: customJs,
    });
    loadChallenge(newCh);
    setCustomSuccessMsg('تم حفظ واعتماد التحدي بنجاح ✓');
    setTimeout(() => {
      setShowChallengeModal(false);
      setCustomTitle('');
      setCustomInstruction('');
      setCustomDesc('');
      setCustomSuccessMsg('');
      setModalTab('browse');
    }, 1200);
  };

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
  };

  const resetCode = () => {
    setHtmlCode(activeChallenge.defaultHtml);
    setCssCode(activeChallenge.defaultCss);
    setJsCode(activeChallenge.defaultJs);
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
    <>
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

          {/* زر عرض الحل النموذجي المشروط ببيان السبب */}
          <button
            onClick={() => {
              setShowSolutionModal(true);
              setIsSolutionRevealed(false);
              setSolutionReason('');
            }}
            className="btn-3d btn-3d-yellow px-4 py-2 text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="طلب استعراض الحل النموذجي"
          >
            <Lightbulb size={14} className="text-amber-800" />
            <span>عرض الحل 💡</span>
          </button>

          {/* زر تغيير تحدي المختبر مخصص للقادة فقط */}
          {isLeader && (
            <button
              onClick={() => setShowChallengeModal(true)}
              className="btn-3d btn-3d-white px-4 py-2 text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="تغيير التحدي النشط للمسار"
            >
              <Settings size={14} />
              <span>تغيير التحدي ⚙️</span>
            </button>
          )}

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
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-black border-2 border-[#0F1729]"
            style={{
              backgroundColor: `${activeChallenge.badgeColor}18`,
              color: activeChallenge.badgeColor,
              boxShadow: '0 3px 0 0 #0F1729',
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-base font-black text-gray-900">
                {activeChallenge.title}
              </span>
              <span
                className="text-[11px] font-black px-2.5 py-0.5 rounded-full border border-[#0F1729]"
                style={{
                  backgroundColor: `${activeChallenge.badgeColor}22`,
                  color: '#0F1729',
                }}
              >
                {activeChallenge.levelLabel}
              </span>
            </div>
            <span className="text-xs text-gray-600 font-medium block">
              {activeChallenge.instruction}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          {isLeader && (
            <button
              onClick={() => setShowChallengeModal(true)}
              className="btn-3d btn-3d-white px-3.5 py-2 text-xs font-black cursor-pointer flex items-center gap-1.5"
              title="تغيير التحدي الحالي لمسار الويب"
            >
              <Settings size={13} />
              <span>تغيير التحدي ⚙️</span>
            </button>
          )}

          {/* زر تسليم التحدي بدلاً من زر المكافأة التلقائي */}
          {hasSubmitted ? (
            <span className="btn-3d btn-3d-green text-xs font-black flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 size={15} />
              <span>تم تسليم التحدي (بانتظار مراجعة القائدة) ✓</span>
            </span>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn-3d btn-3d-yellow px-5 py-2.5 text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="تسليم كود التحدي لقائدة المسار لرصد النقاط"
            >
              <Send size={14} />
              <span>تسليم التحدي للقائدة 🚀</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>

    {/* نافذة منبثقة تفاعلية لتغيير تحدي المختبر واختيار أو إنشاء تحديات جديدة */}
    <AnimatePresence>
      {showChallengeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl text-right overflow-y-auto my-auto"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #0F1729',
              maxHeight: '84vh',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* رأس النافذة */}
            <div
              className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3 sticky top-0 z-10"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
                <span>{isLeader ? 'إدارة وتغيير تحدي مختبر الويب 🧪' : 'تحديات مختبر الويب 🎯'}</span>
              </h3>
              <button
                onClick={() => setShowChallengeModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 font-medium mb-4">
              {isLeader
                ? 'يمكنك اعتماد أي تحدٍ للمسار ليعمل تلقائياً لدى جميع الأعضاء، أو إنشاء تحدٍ مخصص بكود جديد.'
                : 'تصفح تحديات المختبر واختر أي تحدٍ لتحميل كوده وتجربته مباشرة في المحرر.'}
            </p>

            {/* تبويبات القائد: التحديات المعتمدة / إنشاء تحدٍ جديد */}
            {isLeader && (
              <div className="flex items-center border-b border-gray-200 mb-5 gap-2">
                <button
                  onClick={() => setModalTab('browse')}
                  className={`pb-2.5 px-4 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    modalTab === 'browse'
                      ? 'border-[#4285F4] text-[#4285F4]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <BookOpen size={14} />
                  <span>التحديات المتاحة ({labChallenges.length})</span>
                </button>
                <button
                  onClick={() => setModalTab('create')}
                  className={`pb-2.5 px-4 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    modalTab === 'create'
                      ? 'border-[#34A853] text-[#34A853]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Plus size={14} />
                  <span>+ إنشاء تحدٍ جديد مخصص</span>
                </button>
              </div>
            )}

            {/* محتوى التبويبات */}
            <div>
                {modalTab === 'browse' ? (
                  <div className="space-y-4">
                    {labChallenges.map((ch) => {
                      const isActive = ch.id === activeChallenge.id;
                      return (
                        <div
                          key={ch.id}
                          className="p-4 sm:p-5 rounded-2xl transition-all"
                          style={{
                            backgroundColor: isActive ? '#F0FDF4' : '#F8FAFC',
                            border: isActive ? '2px solid #10B981' : '1.5px solid #E2E8F0',
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border border-[#0F1729]"
                                style={{
                                  backgroundColor: `${ch.badgeColor}20`,
                                  color: ch.badgeColor,
                                }}
                              >
                                <Sparkles size={16} />
                              </span>
                              <div>
                                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                  <span>{ch.title}</span>
                                  {isActive && (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                                      ✓ النشط للمسار حالياً
                                    </span>
                                  )}
                                </h3>
                                <span className="text-xs text-gray-500 font-medium">
                                  {ch.description}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className="text-[11px] font-black px-2.5 py-0.5 rounded-full border border-[#0F1729]"
                                style={{
                                  backgroundColor: `${ch.badgeColor}15`,
                                  color: '#0F1729',
                                }}
                              >
                                {ch.levelLabel}
                              </span>
                              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                +{ch.points} نقطة
                              </span>
                            </div>
                          </div>

                          {/* التعليمات والمطلوب */}
                          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 font-medium mb-3">
                            <span className="font-black text-gray-900 ml-1">🎯 المطلوب:</span>
                            {ch.instruction}
                          </div>

                          {/* أزرار الإجراءات */}
                          <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-gray-100">
                            {isLeader && (
                              isActive ? (
                                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-xl border border-emerald-300 flex items-center gap-1.5">
                                  <CheckCircle2 size={13} />
                                  <span>معتمد كتحدي نشط للجميع ✓</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleSetActive(ch)}
                                  className="btn-3d btn-3d-green text-xs font-black cursor-pointer px-3.5 py-1.5 flex items-center gap-1.5"
                                  title="اعتماد هذا التحدي ليكون هو التحدي النشط في مختبر جميع الأعضاء"
                                >
                                  <Sparkles size={13} />
                                  <span>اعتماد كتحدي نشط للمسار 🚀</span>
                                </button>
                              )
                            )}

                            <button
                              onClick={() => {
                                loadChallenge(ch);
                                setShowChallengeModal(false);
                              }}
                              className="btn-3d btn-3d-white text-xs font-black cursor-pointer px-3.5 py-1.5 flex items-center gap-1.5"
                              title="تحميل كود هذا التحدي في المحرر للتجربة فوراً"
                            >
                              <FileCode size={13} />
                              <span>تحميل الكود في المحرر 💻</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* نموذج إنشاء تحدٍ جديد للقادة */
                  <div className="space-y-4">
                    {customSuccessMsg && (
                      <div className="p-3 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-emerald-800 font-black text-center text-xs animate-bounce">
                        {customSuccessMsg}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1.5">
                        عنوان التحدي البرمجي <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="مثال: بناء زر ثلاثي الأبعاد مع تأثير النبض Pulse"
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#0F1729] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-gray-700 mb-1.5">
                          المستوى المستهدف
                        </label>
                        <select
                          value={customLevel}
                          onChange={(e) => setCustomLevel(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#0F1729] text-xs font-black focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        >
                          <option value="beginner">المستوى 1 (مبتدئ)</option>
                          <option value="intermediate">المستوى 2 (متوسط)</option>
                          <option value="advanced">المستوى 3 (متقدم)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-700 mb-1.5">
                          النقاط المستحقة عند الإكمال
                        </label>
                        <input
                          type="number"
                          value={customPoints}
                          onChange={(e) => setCustomPoints(Number(e.target.value) || 10)}
                          min={5}
                          max={100}
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#0F1729] text-xs font-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1.5">
                        المطلوب من العضو (التعليمات) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={customInstruction}
                        onChange={(e) => setCustomInstruction(e.target.value)}
                        placeholder="مثال: أضف أنيميشن CSS باستخدام @keyframes pulse ليعمل التوهج عند تمرير الفأرة..."
                        rows={2}
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-[#0F1729] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    {/* محرر الأكواد المبدئية */}
                    <div className="space-y-3 pt-2 border-t border-gray-200">
                      <div>
                        <label className="block text-xs font-black text-gray-700 mb-1">
                          كود HTML الأولي:
                        </label>
                        <textarea
                          value={customHtml}
                          onChange={(e) => setCustomHtml(e.target.value)}
                          rows={3}
                          className="w-full font-mono text-[11px] p-2.5 rounded-xl border-2 border-[#0F1729] bg-gray-50 focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-700 mb-1">
                          كود CSS الأولي:
                        </label>
                        <textarea
                          value={customCss}
                          onChange={(e) => setCustomCss(e.target.value)}
                          rows={3}
                          className="w-full font-mono text-[11px] p-2.5 rounded-xl border-2 border-[#0F1729] bg-gray-50 focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-700 mb-1">
                          كود JavaScript الأولي:
                        </label>
                        <textarea
                          value={customJs}
                          onChange={(e) => setCustomJs(e.target.value)}
                          rows={3}
                          className="w-full font-mono text-[11px] p-2.5 rounded-xl border-2 border-[#0F1729] bg-gray-50 focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <button
                        onClick={handleCreateCustom}
                        disabled={!customTitle.trim() || !customInstruction.trim()}
                        className="btn-3d btn-3d-green w-full py-3 text-xs font-black cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles size={16} />
                        <span>حفظ واعتماد التحدي في المختبر لجميع أعضاء المسار 🚀</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. نافذة عرض الحل المشروطة ببيان السبب */}
      <AnimatePresence>
        {showSolutionModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-right overflow-y-auto my-auto"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #0F1729',
                maxHeight: '85vh',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                    💡
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    الحل النموذجي · {activeChallenge.title}
                  </h3>
                </div>
                <button
                  onClick={() => setShowSolutionModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer border-none bg-transparent"
                >
                  <X size={18} />
                </button>
              </div>

              {!isSolutionRevealed ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-right">
                    <span className="text-xs font-black text-amber-900 block mb-1">
                      قبل استعراض الحل:
                    </span>
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      التفكير والمحاولة المستقلة هي جوهر التعلم الحقيقي في مسار الويب. نود معرفة السبب الذي جعلك تبحث عن الحل اليوم لمساعدتك بشكل أفضل:
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-800 block mb-2.5">
                      ما هو السبب الذي جعلك تبحث عن الحل؟ *
                    </label>

                    <div className="space-y-2">
                      {[
                        'حاولت عدة محاولات وواجهت صعوبة في منطق البرمجة',
                        'أريد المقارنة مع الكود المعياري الأفضل (Best Practice)',
                        'أرغب في استكشاف أسلوب برمجي بديل لاختصار وتنسيق الكود',
                        'أواجه ضيق في الوقت وأود دراسة الحل وتطبيقه لاحقاً',
                      ].map((reasonText) => (
                        <label
                          key={reasonText}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                            solutionReason === reasonText
                              ? 'border-[#4285F4] bg-blue-50/50 text-blue-950 font-bold'
                              : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="solutionReason"
                            value={reasonText}
                            checked={solutionReason === reasonText}
                            onChange={() => setSolutionReason(reasonText)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs leading-normal">{reasonText}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSolutionModal(false)}
                      className="px-4 py-2 rounded-2xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 border-none cursor-pointer"
                    >
                      إلغاء والعودة للمحاولة
                    </button>
                    <button
                      type="button"
                      disabled={!solutionReason}
                      onClick={() => setIsSolutionRevealed(true)}
                      className="btn-3d btn-3d-yellow px-5 py-2.5 text-xs font-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      تأكيد واستعراض الحل النموذجي 🔍
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>تم فتح الحل النموذجي! تمعّن في طريقة كتابة الكود وبنائه.</span>
                  </div>

                  {/* ألسنة الملفات في الحل */}
                  <div className="flex items-center gap-1.5 border-b border-gray-200 pb-2">
                    <button
                      onClick={() => setSolutionTab('html')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer border-none ${
                        solutionTab === 'html'
                          ? 'bg-[#EA4335] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      HTML الحل
                    </button>
                    <button
                      onClick={() => setSolutionTab('css')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer border-none ${
                        solutionTab === 'css'
                          ? 'bg-[#4285F4] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      CSS الحل
                    </button>
                    <button
                      onClick={() => setSolutionTab('js')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer border-none ${
                        solutionTab === 'js'
                          ? 'bg-[#F9AB00] text-gray-950'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      JS الحل
                    </button>
                  </div>

                  {/* صندوق الكود النموذجي */}
                  <div className="p-4 rounded-2xl bg-[#0D1117] text-left border border-[#30363D] overflow-x-auto max-h-60" dir="ltr">
                    <pre className="text-xs font-mono text-gray-200 whitespace-pre">
                      {solutionTab === 'html'
                        ? activeChallenge.solutionHtml || activeChallenge.defaultHtml
                        : solutionTab === 'css'
                        ? activeChallenge.solutionCss || activeChallenge.defaultCss
                        : activeChallenge.solutionJs || activeChallenge.defaultJs}
                    </pre>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetText =
                          solutionTab === 'html'
                            ? activeChallenge.solutionHtml || activeChallenge.defaultHtml
                            : solutionTab === 'css'
                            ? activeChallenge.solutionCss || activeChallenge.defaultCss
                            : activeChallenge.solutionJs || activeChallenge.defaultJs;
                        navigator.clipboard?.writeText(targetText);
                        setSolutionCopied(true);
                        setTimeout(() => setSolutionCopied(false), 2000);
                      }}
                      className="px-4 py-2 rounded-2xl text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 border-none cursor-pointer flex items-center gap-1.5"
                    >
                      {solutionCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      <span>{solutionCopied ? 'تم النسخ ✓' : 'نسخ كود التبويب'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (activeChallenge.solutionHtml) setHtmlCode(activeChallenge.solutionHtml);
                          if (activeChallenge.solutionCss) setCssCode(activeChallenge.solutionCss);
                          if (activeChallenge.solutionJs) setJsCode(activeChallenge.solutionJs);
                          setIframeKey((prev) => prev + 1);
                          setShowSolutionModal(false);
                        }}
                        className="btn-3d btn-3d-green px-4 py-2 text-xs font-black cursor-pointer"
                      >
                        تطبيق الحل بالكامل في المحرر 🚀
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. نافذة تسليم التحدي لقائدة المسار */}
      <AnimatePresence>
        {showSubmitModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl text-right overflow-y-auto my-auto"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #0F1729',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#4285F4] flex items-center justify-center font-black">
                    <Send size={16} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    تسليم كود التحدي للقائدة 🚀
                  </h3>
                </div>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer border-none bg-transparent"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-500 block mb-0.5">
                    التحدي المراد تسليمه:
                  </span>
                  <div className="text-sm font-black text-gray-900">
                    {activeChallenge.title} ({activeChallenge.levelLabel})
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    عدد الأسطر المكتوبة: <strong>{lineCount}</strong> سطراً
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-800 block mb-1.5">
                    ملاحظات أو تعليق موجه للقائدة (اختياري)
                  </label>
                  <textarea
                    rows={3}
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="اكتب أي ملاحظة أو صعوبة واجهتها أثناء كتابة الكود..."
                    className="w-full p-3 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-center gap-2">
                  <HelpCircle size={16} className="text-blue-600 shrink-0" />
                  <span>سيتم إرسال كودك بالكامل للقائدة لمراجعته واعتماد النقاط المستحقة لك في حسابك.</span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-2xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 border-none cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={async () => {
                      setIsSubmitting(true);
                      await store.submitLabChallenge(
                        currentUser.id,
                        activeChallenge.id,
                        htmlCode,
                        cssCode,
                        jsCode,
                        submissionNotes
                      );
                      setIsSubmitting(false);
                      setHasSubmitted(true);
                      setShowSubmitModal(false);
                      if (currentUser.settings?.celebrations) {
                        confetti({
                          particleCount: 80,
                          spread: 70,
                          origin: { y: 0.6 },
                          colors: ['#4285F4', '#34A853', '#F9AB00', '#EA4335'],
                        });
                      }
                    }}
                    className="btn-3d btn-3d-green px-5 py-2.5 text-xs font-black cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>{isSubmitting ? 'جارٍ التسليم...' : 'تأكيد التسليم الرسمي للقائدة ✓'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
