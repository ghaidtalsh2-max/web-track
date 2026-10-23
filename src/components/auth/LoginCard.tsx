import React, { useState } from 'react';
import { PinwheelFlower } from '../brand/PinwheelFlower';
import { store } from '../../services/store';
import { verifyCredentials } from '../../services/accounts';
import { Shield, Sparkles, User, KeyRound, Check } from 'lucide-react';

interface LoginCardProps {
  onLoginSuccess: (userId: string) => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('ghaidaa.lead');
  const [password, setPassword] = useState('Taif2026');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = (targetUser: string, targetPass: string) => {
    setErrorMessage('');
    setIsLoading(true);

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

    setErrorMessage('بيانات الدخول غير صحيحة، أو الحساب غير مسجل ضمن المسار.');
    setIsLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('الرجاء إدخال اسم المستخدم');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('الرجاء إدخال كلمة المرور');
      return;
    }
    performLogin(username, password);
  };

  const quickLoginAs = (userKey: string) => {
    setUsername(userKey);
    setPassword('Taif2026');
    performLogin(userKey, 'Taif2026');
  };

  return (
    <div className="login-screen-wrapper">
      {/* 1. أقراص الوردة الرسمية بالزوايا */}
      <div className="login-disc-yellow">
        <PinwheelFlower variant="disc" color="yellow" size={190} animate={true} />
      </div>

      <div className="login-disc-red">
        <PinwheelFlower variant="disc" color="red" size={140} animate={true} />
      </div>

      <div className="login-disc-green">
        <PinwheelFlower variant="disc" color="green" size={140} animate={true} />
      </div>

      {/* 2. بطاقة تسجيل الدخول المركزية المعتمدة */}
      <div className="login-card" style={{ maxWidth: '440px' }}>
        <h1 className="login-title">سجّل دخولك</h1>
        <p className="login-subtitle">منصة مسار تصميم وتطوير الويب 2026</p>

        {/* أزرار الدخول السريع الفوري بنقرة واحدة */}
        <div className="mb-6 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-right">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
            <KeyRound size={13} className="text-[#4285F4]" />
            <span>تسجيل سريع بنقرة واحدة (تجربة فورية):</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => quickLoginAs('ghaidaa.lead')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 transition-all cursor-pointer border border-blue-200"
            >
              🛡️ القائدة غيداء
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('retal.lead')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 transition-all cursor-pointer border border-blue-200"
            >
              🛡️ القائدة ريتال
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('rana.super')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all cursor-pointer border border-amber-200"
            >
              🌟 المستشارة رنا فيض
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('atheer.super')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 transition-all cursor-pointer border border-purple-200"
            >
              👑 المشرفة أثير
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('amer.super')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 transition-all cursor-pointer border border-purple-200"
            >
              👑 المشرف عامر
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('noura.web26')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-all cursor-pointer border border-emerald-200"
            >
              🚀 العضو نورة
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-right">
          {/* حقل اسم المستخدم */}
          <div>
            <label className="block text-xs font-black text-gray-900 mb-1.5">
              اسم المستخدم
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="مثال: ghaidaa.lead أو noura.web26"
              className="input-clean w-full"
              style={{
                borderRadius: '16px',
                border: '2px solid #D0D5DD',
                padding: '12px 16px',
                fontSize: '0.95rem',
              }}
              required
            />
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <label className="block text-xs font-black text-gray-900 mb-1.5">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-clean w-full"
              style={{
                borderRadius: '16px',
                border: '2px solid #D0D5DD',
                padding: '12px 16px',
                fontSize: '0.95rem',
              }}
              required
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          {/* زر الدخول ثلاثي الأبعاد */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-3d btn-3d-blue w-full py-3.5 text-base font-black cursor-pointer mt-1"
          >
            {isLoading ? 'جارٍ التحقق...' : 'دخول للمنصة 🚀'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs font-bold text-gray-500">
            كلمة المرور الافتراضية للاختبار: <span className="font-mono text-gray-800 font-black">Taif2026</span>
          </p>
        </div>
      </div>
    </div>
  );
};
