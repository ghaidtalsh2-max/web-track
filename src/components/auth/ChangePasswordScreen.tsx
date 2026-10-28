import React, { useState } from 'react';
import { PinwheelFlower } from '../brand/PinwheelFlower';
import { ColorLines } from '../brand/ColorLines';
import { store } from '../../services/store';
import { Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';

interface ChangePasswordScreenProps {
  fullName: string;
}

/**
 * شاشة إجبارية عند أول دخول (user_metadata.must_change_password === true).
 * تُعرض قبل أي شيء آخر في التطبيق ولا يمكن تجاوزها من الواجهة.
 */
export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ fullName }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 10) {
      setError('كلمة المرور يجب ألا تقل عن 10 أحرف.');
      return;
    }
    if (!/[A-Za-z\u0600-\u06FF]/.test(password) || !/[0-9]/.test(password)) {
      setError('يجب أن تحتوي كلمة المرور على حروف وأرقام.');
      return;
    }
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }
    setLoading(true);
    try {
      await store.changePassword(password);
    } catch (err: any) {
      setError(err?.message || 'تعذّر تغيير كلمة المرور.');
      setLoading(false);
    }
  };

  return (
    <div
      className="login-screen-wrapper relative overflow-hidden flex items-center justify-center min-h-screen px-4"
      dir="rtl"
    >
      <div className="login-disc-yellow pointer-events-none opacity-80">
        <PinwheelFlower variant="disc" color="yellow" size={200} animate={true} />
      </div>
      <div className="login-disc-red pointer-events-none opacity-80">
        <PinwheelFlower variant="disc" color="red" size={150} animate={true} />
      </div>
      <div className="login-disc-green pointer-events-none opacity-80">
        <PinwheelFlower variant="disc" color="green" size={150} animate={true} />
      </div>

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
        <div className="mb-6 flex justify-center">
          <ColorLines height={4} width="120px" rounded={true} />
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#4285F4] text-xs font-black mb-3">
            <ShieldCheck size={14} />
            <span>تأمين الحساب</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-black text-gray-950 mb-1.5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            تغيير كلمة المرور
          </h1>
          <p className="text-sm font-bold text-gray-500">
            أهلاً {fullName.split(' ')[0]}، هذه كلمة مرور مؤقتة. اختر كلمة مرور جديدة خاصة بك للمتابعة.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-start gap-2.5"
          >
            <AlertCircle size={17} className="shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4 text-right">
          <div>
            <label className="block text-xs font-black text-gray-800 mb-1.5" htmlFor="new-password">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                id="new-password"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full text-right bg-gray-50/70 focus:bg-white text-gray-900 transition-all font-medium"
                style={{
                  borderRadius: '16px',
                  border: '2px solid #E2E8F0',
                  padding: '12px 42px 12px 42px',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none p-1"
                aria-label={show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-800 mb-1.5" htmlFor="confirm-password">
              تأكيد كلمة المرور
            </label>
            <input
              id="confirm-password"
              type={show ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="w-full text-right bg-gray-50/70 focus:bg-white text-gray-900 transition-all font-medium"
              style={{
                borderRadius: '16px',
                border: '2px solid #E2E8F0',
                padding: '12px 16px',
                fontSize: '0.95rem',
                outline: 'none',
              }}
              required
            />
          </div>

          <p className="text-[11px] font-bold text-gray-400 leading-relaxed">
            10 أحرف على الأقل، وتحتوي على حروف وأرقام.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="btn-3d btn-3d-blue w-full py-3.5 text-base font-black cursor-pointer mt-1 flex items-center justify-center gap-2"
          >
            {loading ? 'جارٍ الحفظ...' : 'حفظ والمتابعة'}
          </button>

          <button
            type="button"
            onClick={() => store.logout()}
            className="text-xs font-bold text-gray-500 hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            تسجيل الخروج
          </button>
        </form>
      </div>
    </div>
  );
};
