import React, { useState } from 'react';
import { PinwheelFlower } from '../brand/PinwheelFlower';
import { ColorLines } from '../brand/ColorLines';
import { store } from '../../services/store';
import { verifyCredentials } from '../../services/accounts';
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, HelpCircle } from 'lucide-react';

interface LoginCardProps {
  onLoginSuccess: (userId: string) => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const performLogin = (targetUser: string, targetPass: string) => {
    setErrorMessage('');
    setIsLoading(true);

    // التحقق من صحة بيانات الدخول
    setTimeout(() => {
      const matchedUsername = verifyCredentials(targetUser, targetPass);

      if (matchedUsername) {
        const members = store.getMembers();
        const user = members.find(
          (m) => m.username.toLowerCase() === matchedUsername.toLowerCase()
        );

        if (user) {
          store.login(user.id);
          onLoginSuccess(user.id);
          return;
        }
      }

      setErrorMessage('اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التحقق من البيانات والمحاولة مجدداً.');
      setIsLoading(false);
    }, 400);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('يرجى إدخال اسم المستخدم');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('يرجى إدخال كلمة المرور');
      return;
    }
    performLogin(username, password);
  };

  return (
    <div className="login-screen-wrapper relative overflow-hidden flex items-center justify-center min-h-screen px-4" dir="rtl">
      {/* 1. أقراص الوردة الرسمية بالزوايا بتدرج وأناقة هوية قوقل */}
      <div className="login-disc-yellow pointer-events-none opacity-80">
        <PinwheelFlower variant="disc" color="yellow" size={200} animate={true} />
      </div>

      <div className="login-disc-red pointer-events-none opacity-80">
        <PinwheelFlower variant="disc" color="red" size={150} animate={true} />
      </div>

      <div className="login-disc-green pointer-events-none opacity-80">
        <PinwheelFlower variant="disc" color="green" size={150} animate={true} />
      </div>

      {/* 2. بطاقة تسجيل الدخول المركزية المعتمدة */}
      <div
        className="login-card w-full relative z-10 card-3d-tactile"
        style={{
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          padding: '36px 32px',
          boxShadow: '0 20px 50px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        }}
      >
        {/* الخطوط الأربعة الرسمية لهوية قوقل */}
        <div className="mb-6 flex justify-center">
          <ColorLines height={4} width="120px" rounded={true} />
        </div>

        {/* رأس البطاقة */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#4285F4] text-xs font-black mb-3">
            <span>Google Developer Groups on Campus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>
            تسجيل الدخول
          </h1>
          <p className="text-sm font-bold text-gray-500">
            منصة مسار تصميم وتطوير الويب — جامعة الطائف
          </p>
        </div>

        {/* رسالة الخطأ الرسمية */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle size={17} className="shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-right">
          {/* حقل اسم المستخدم */}
          <div>
            <label className="block text-xs font-black text-gray-800 mb-1.5">
              اسم المستخدم
            </label>
            <div className="relative">
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <User size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="اسم المستخدم (مثل: ghaidaa.lead)"
                className="w-full text-right bg-gray-50/70 hover:bg-gray-50 focus:bg-white text-gray-900 transition-all font-medium"
                style={{
                  borderRadius: '16px',
                  border: '2px solid #E2E8F0',
                  padding: '12px 42px 12px 16px',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black text-gray-800">
                كلمة المرور
              </label>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-xs font-bold text-[#4285F4] hover:underline cursor-pointer bg-transparent border-none p-0 flex items-center gap-1"
              >
                <HelpCircle size={13} />
                <span>مساعدة الدخول</span>
              </button>
            </div>
            <div className="relative">
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-right bg-gray-50/70 hover:bg-gray-50 focus:bg-white text-gray-900 transition-all font-medium"
                style={{
                  borderRadius: '16px',
                  border: '2px solid #E2E8F0',
                  padding: '12px 42px 12px 42px',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-none p-1"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* خيار تذكر الدخول */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-[#4285F4] focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <span>تذكّر تسجيل دخولي في هذا المتصفح</span>
            </label>
          </div>

          {/* زر تسجيل الدخول ثلاثي الأبعاد المعتمد */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-3d btn-3d-blue w-full py-3.5 text-base font-black cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>جارٍ التحقق...</span>
              </>
            ) : (
              <>
                <span>تسجيل الدخول للمنصة</span>
                <ArrowLeft size={17} />
              </>
            )}
          </button>
        </form>

        {/* تذييل البطاقة المعتمد */}
        <div className="text-center mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400">
            نادي قوقل للطلبة المطورين · جامعة الطائف 2026
          </p>
        </div>
      </div>

      {/* نافذة مساعدة الدخول */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-dark animate-fadeIn"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 card-3d-tactile text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-[#4285F4] mb-3 font-black text-base">
              <HelpCircle size={20} />
              <h3>بيانات ومساعدة الدخول للمسار</h3>
            </div>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              حسابات المنصة مخصصة لأعضاء وقادة مسار الويب المسجلين لدى نادي قوقل للطلبة المطورين بجامعة الطائف.
            </p>
            <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-100 mb-5 text-xs text-blue-900 leading-relaxed font-bold">
              💡 إذا نسيت كلمة المرور الخاصة بحسابك، يرجى التواصل مباشرة مع قادة المسار عبر قنوات التواصل المعتمدة (ديسكورد / تليجرام).
            </div>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="btn-3d btn-3d-blue w-full py-2.5 text-sm font-black cursor-pointer"
            >
              فهمت، حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
