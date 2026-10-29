import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, NavTab } from '../../types';
import { store } from '../../services/store';
import { Settings, LogOut } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

interface NavbarProps {
  currentUser: UserProfile;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onOpenSettings,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const isLeader = currentUser.role === 'track_leader';
  const isSupervisor = currentUser.role === 'supervisor';

  // تبويبات الأعضاء المعتمدة
  const memberTabs: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'journey', label: 'الرحلة' },
    { id: 'challenges', label: 'التحديات' },
    { id: 'lab', label: 'المختبر' },
    { id: 'showcase', label: 'المعرض' },
    { id: 'community', label: 'المجتمع' },
  ];

  // تبويبات القادة المعتمدة (تشمل المعرض والمختبر)
  const leaderTabs: { id: NavTab; label: string }[] = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'members', label: 'الأعضاء' },
    { id: 'content', label: 'المحتوى' },
    { id: 'submissions', label: 'التسليمات' },
    { id: 'polls_mgmt', label: 'الاستبيانات' },
    { id: 'points_mgmt', label: 'النقاط' },
    { id: 'showcase', label: 'المعرض' },
    { id: 'lab', label: 'المختبر' },
  ];

  // تبويبات المشرفين المعتمدة (تشمل المعرض والمختبر)
  const supervisorTabs: { id: NavTab; label: string }[] = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'members', label: 'الأعضاء' },
    { id: 'content', label: 'المحتوى' },
    { id: 'showcase', label: 'المعرض' },
    { id: 'lab', label: 'المختبر' },
    { id: 'evaluations', label: 'تقييم الأداء القيادي' },
  ];

  // تحديد التبويبات بحسب دور المستخدم المعتمد في profiles.role فقط
  const activeTabs = isSupervisor
    ? supervisorTabs
    : isLeader
    ? leaderTabs
    : memberTabs;

  const handleLogout = () => {
    store.logout();
    setShowAccountDropdown(false);
  };

  return (
    <header
      className="sticky top-0 z-40 w-full transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        paddingTop: '20px',
        paddingBottom: '16px',
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* 1. التبويبات بحاوية دائرية Pill Navigation رمادية واحدة ومطابقة لصفحة 3 */}
          <div className="flex items-center gap-3 flex-wrap">
            <nav className="nav-pill-container" aria-label="شريط التبويبات الرئيسي">
              {activeTabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`nav-pill-tab ${isActive ? 'active' : ''}`}
                    aria-selected={isActive}
                  >
                    {/* النقطة الصفراء المميزة للتبويب النشط */}
                    {isActive && (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#F9AB00',
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 2. أدوات الرأس على اليسار: ترس التخصيص + زر تنبيهات ٣ + الحساب وتسجيل الخروج */}
          <div className="flex items-center gap-3 mr-auto">
            {/* زر التنبيهات الأحمر المطابق للمرجع: تنبيهات ٣ كحبة دائرية حمراء */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="btn-pill"
              style={{
                backgroundColor: '#EA4335',
                color: '#FFFFFF',
                padding: '8px 20px',
                fontSize: '0.9rem',
                borderRadius: '9999px',
                border: 'none',
                boxShadow: '0 2px 6px rgba(234, 67, 53, 0.25)',
              }}
              aria-label="عرض التنبيهات"
            >
              <span>تنبيهات ٣</span>
            </button>

            {/* زر ترس التخصيص الدائري المعتمد والمريح */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all shadow-xs cursor-pointer border border-gray-300 active:scale-90 group"
              style={{
                borderRadius: '50%',
              }}
              title="تخصيص تجربتي"
              aria-label="تخصيص تجربتي"
            >
              <Settings size={18} className="text-gray-700 group-hover:rotate-45 transition-transform duration-300" />
            </button>

            {/* صورة وحساب المستخدم مع قائمة منسدلة للخروج فقط */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full overflow-hidden flex items-center justify-center transition-transform active:scale-95 cursor-pointer p-0 bg-transparent border-none"
                style={{ borderRadius: '50%', aspectRatio: '1 / 1' }}
                aria-label="الملف الشخصي"
              >
                <UserAvatar
                  letter={currentUser.avatarLetter}
                  name={currentUser.fullName}
                  avatarUrl={currentUser.avatarUrl}
                  color={currentUser.badgeColor}
                  size="sm"
                  showBadge={false}
                  role={currentUser.role}
                />
              </button>

              {showAccountDropdown && (
                <div
                  className="absolute left-0 top-12 w-64 p-4 card-navy shadow-2xl z-50 text-right bg-white"
                  style={{
                    borderRadius: '24px',
                    border: '2.5px solid #0F1729',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 6px 0 0 #0F1729',
                  }}
                >
                  <div className="pb-2.5 mb-2.5 border-b border-gray-100">
                    <div className="text-sm font-black text-gray-900">
                      {currentUser.fullName}
                    </div>
                    <div className="text-xs text-blue-600 font-bold mt-0.5">
                      {currentUser.roleTitle}
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium mt-1">
                      @{currentUser.username} · {currentUser.major}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 pb-2 mb-2 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('profile' as NavTab);
                        setShowAccountDropdown(false);
                      }}
                      className="w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      الملف الشخصي والإنجازات
                    </button>

                    <a
                      href="/?intro=true"
                      className="w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      إعادة مشاهدة الافتتاحية ✨
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <span>تسجيل الخروج</span>
                    <LogOut size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
