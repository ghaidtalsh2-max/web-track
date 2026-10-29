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
    if (notifications.length > 0 && currentUser.settings?.celebrations && !currentUser.settings?.reducedMotion) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.4 },
        colors: ['#4285F4', '#EA4335', '#34A853', '#F9AB00'],
      });
    }
  }, [currentUser, notifications]);

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
      {/* بطاقة التنبيهات المركزية */}
      <div className="notifications-modal-card">
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {notifications.length > 0 ? `وصلك جديد يا ${firstName}` : `التنبيهات والإشعارات`}
          </h1>

          {notifications.length > 0 ? (
            <span
              className="px-3.5 py-1 rounded-full text-xs font-black"
              style={{
                backgroundColor: '#F9AB00',
                color: '#0F1729',
              }}
            >
              {notifications.length} جديدة
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
              محدّثة
            </span>
          )}
        </div>

        {/* محتوى التنبيهات: إما القائمة الحقيقية أو رسالة نظيفة عند 0 */}
        {notifications.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 font-black text-2xl border border-blue-200">
              🔔
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">
              لا توجد تنبيهات جديدة حالياً ✨
            </h3>
            <p className="text-xs text-gray-500 font-medium max-w-xs leading-relaxed">
              ستصلك هنا إشعارات النقاط والورش والتحديات فور نشرها من قبل قادة المسار.
            </p>
          </div>
        ) : (
          <div className="flex flex-col mb-6 divide-y divide-gray-100 max-h-72 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className="py-3.5 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors text-right"
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: n.type === 'points' ? '#34A853' : n.type === 'workshop' ? '#4285F4' : '#F9AB00',
                    color: n.type === 'task' ? '#0F1729' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  {n.badgeText || (n.type === 'points' ? '+نقط' : n.type === 'workshop' ? '◆' : '!')}
                </div>

                <div className="flex-1 text-right min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">
                    {n.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                    {n.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* زر الإغلاق */}
        <button
          onClick={handleDismiss}
          className="w-full py-3.5 px-6 rounded-2xl font-black text-base text-white transition-all hover:bg-gray-800 active:scale-98 cursor-pointer mt-2"
          style={{
            backgroundColor: '#0F1729',
            border: 'none',
          }}
        >
          {notifications.length > 0 ? 'يلا نبدأ' : 'إغلاق'}
        </button>
      </div>
    </div>
  );
};
