import React, { useEffect } from 'react';
import { UserProfile, NotificationItem, NavTab } from '../../types';
import { store } from '../../services/store';
import confetti from 'canvas-confetti';

interface PostLoginNotificationsProps {
  currentUser: UserProfile;
  notifications: NotificationItem[];
  onClose: (targetTab?: NavTab) => void;
}

export const PostLoginNotifications: React.FC<PostLoginNotificationsProps> = ({
  currentUser,
  notifications,
  onClose,
}) => {
  useEffect(() => {
    if (currentUser.settings?.celebrations && !currentUser.settings?.reducedMotion) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.4 },
        colors: ['#4285F4', '#EA4335', '#34A853', '#F9AB00'],
      });
    }
  }, [currentUser]);

  const handleDismiss = () => {
    store.markAllNotificationsAsRead(currentUser.id);
    onClose();
  };

  const handleItemClick = (notif: NotificationItem) => {
    store.markAllNotificationsAsRead(currentUser.id);
    onClose(notif.targetTab || 'home');
  };

  const firstName = currentUser.fullName.split(' ')[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
      style={{ backgroundColor: 'rgba(15, 23, 41, 0.4)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="التنبيهات الجديدة"
    >
      {/* جسيمات الكونفيتي الملونة بألوان الهوية تطفو في الخلفية (مطابقة لصفحة 9) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/5 w-3.5 h-3.5 rounded-full bg-red-500 opacity-90 float-gentle" />
        <div
          className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-green-500 opacity-90 float-gentle"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-blue-500 opacity-90 float-gentle"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-1/5 right-1/3 w-3.5 h-3.5 rounded-sm bg-yellow-500 opacity-90 float-gentle rotate-12"
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className="absolute bottom-1/3 right-1/5 w-4 h-4 rounded-full bg-red-500 opacity-90 float-gentle"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 left-12 w-3.5 h-3.5 rounded-full bg-green-500 opacity-90 float-gentle"
          style={{ animationDelay: '2.5s' }}
        />
      </div>

      {/* بطاقة التنبيهات المركزية المطابقة لصفحة 9 */}
      <div className="notifications-modal-card">
        {/* رأس البطاقة: عنوان وصلك جديد يا نورة على اليمين وشارة ٣ جديدة على اليسار */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            وصلك جديد يا {firstName}
          </h1>

          <span
            className="px-3.5 py-1 rounded-full text-xs font-black"
            style={{
              backgroundColor: '#F9AB00',
              color: '#0F1729',
            }}
          >
            ٣ جديدة
          </span>
        </div>

        {/* عناصر التنبيهات الثلاثة المعتمدة المطابقة لصفحة 9 */}
        <div className="flex flex-col mb-6">
          {/* العنصر 1: نقاط جديدة (+30 بالأخضر) */}
          <div
            onClick={() => handleItemClick(notifications[0] || { targetTab: 'home' } as any)}
            className="py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 text-right"
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#34A853',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.85rem',
                flexShrink: 0,
              }}
            >
              +30
            </div>

            <div className="flex-1 text-right">
              <div className="text-base font-bold text-gray-900">
                نقاط جديدة
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                قبلنا تسليمك: صفحتك الأولى
              </div>
            </div>
          </div>

          {/* العنصر 2: ورشة جديدة (◆ بالأزرق) */}
          <div
            onClick={() => handleItemClick(notifications[1] || { targetTab: 'community' } as any)}
            className="py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 text-right"
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#4285F4',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem',
                flexShrink: 0,
              }}
            >
              ◆
            </div>

            <div className="flex-1 text-right">
              <div className="text-base font-bold text-gray-900">
                ورشة جديدة
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Grid و Flexbox · الأحد ٨ مساءً
              </div>
            </div>
          </div>

          {/* العنصر 3: مهمة جديدة (! بالأصفر) */}
          <div
            onClick={() => handleItemClick(notifications[2] || { targetTab: 'home' } as any)}
            className="py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors text-right"
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#F9AB00',
                color: '#0F1729',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem',
                flexShrink: 0,
              }}
            >
              !
            </div>

            <div className="flex-1 text-right">
              <div className="text-base font-bold text-gray-900">
                مهمة جديدة
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                تحدي: زر يتفاعل · آخر موعد الخميس
              </div>
            </div>
          </div>
        </div>

        {/* زر يلا نبدأ المعتمد الكامل */}
        <button
          onClick={handleDismiss}
          className="w-full py-3.5 px-6 rounded-2xl font-black text-base text-white transition-all hover:bg-gray-800 active:scale-98 cursor-pointer"
          style={{
            backgroundColor: '#0F1729',
            border: 'none',
          }}
        >
          يلا نبدأ
        </button>
      </div>
    </div>
  );
};
