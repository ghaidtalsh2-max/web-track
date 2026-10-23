import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { store, CURRENT_MISSION } from './services/store';
import { UserProfile, NavTab } from './types';
import { EntrySequence } from './components/intro/EntrySequence';
import { LoginCard } from './components/auth/LoginCard';
import { MandatoryBioModal } from './components/auth/MandatoryBioModal';
import { PostLoginNotifications } from './components/notifications/PostLoginNotifications';
import { Navbar } from './components/layout/Navbar';
import { MemberHome } from './components/home/MemberHome';
import { EducationalJourney } from './components/journey/EducationalJourney';
import { CustomizeModal } from './components/settings/CustomizeModal';
import { InquiriesModal } from './components/inquiries/InquiriesModal';
import { Footer } from './components/layout/Footer';
import { PinwheelFlower } from './components/brand/PinwheelFlower';
import { AsteriskStar } from './components/brand/AsteriskStar';
import { WebLab } from './components/lab/WebLab';
import { CommunityView } from './components/community/CommunityView';
import { ShowcaseView } from './components/showcase/ShowcaseView';
import { ProfileView } from './components/profile/ProfileView';
import { ChallengesView } from './components/challenges/ChallengesView';
import { LeaderDashboard } from './components/leader/LeaderDashboard';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    store.getCurrentUser()
  );

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('auth') === 'login' || urlParams.get('logout') === 'true') {
        store.logout();
        return false;
      }
    }
    return store.isLoggedIn();
  });

  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('skip_intro') === 'true') return false;
      if (urlParams.get('intro') === 'true') return true;
      if (!store.hasSeenIntroThisSession()) return true;
    }
    return false;
  });

  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab') as NavTab;
      if (tab) return tab;
    }
    return 'home';
  });

  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('settings') === 'true') return true;
    }
    return false;
  });

  const [showInquiriesModal, setShowInquiriesModal] = useState(false);

  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('notif') === 'true') return true;
    }
    return false;
  });

  // اشتراك في تحديثات Store المركزي
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const user = store.getCurrentUser();
      const loggedInState = store.isLoggedIn();
      setCurrentUser(user);
      setIsLoggedIn(loggedInState);
      if (user && (user.role === 'track_leader' || user.role === 'supervisor')) {
        setCurrentTab((prev) => (prev === 'home' ? 'overview' : prev));
      }
    });
    return unsubscribe;
  }, []);

  // تطبيق الإعدادات الفورية على DOM
  useEffect(() => {
    if (!currentUser) return;
    const settings = currentUser.settings;
    if (!settings) return;

    document.documentElement.style.setProperty('--base-font-size', `${settings.fontSize || 17}px`);
    document.documentElement.setAttribute('data-theme', settings.theme || 'light');
    document.documentElement.setAttribute('data-eye-comfort', settings.eyeComfort ? 'true' : 'false');
    document.documentElement.setAttribute('data-reduced-motion', settings.reducedMotion ? 'true' : 'false');
    document.documentElement.setAttribute('data-high-contrast', settings.highContrast ? 'true' : 'false');
  }, [currentUser]);

  const handleIntroComplete = () => {
    store.setIntroSeenThisSession();
    setShowIntro(false);
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleLoginSuccess = (userId: string) => {
    store.login(userId);
    const user = store.getCurrentUser();
    setCurrentUser(user);
    setIsLoggedIn(true);
    if (user && (user.role === 'track_leader' || user.role === 'supervisor')) {
      setCurrentTab('overview');
    } else {
      setCurrentTab('home');
    }
  };

  const handleBioSaved = () => {
    setCurrentUser(store.getCurrentUser());
  };

  // 1. الافتتاحية الترحيبية عند طلبها أو عند الزيارة الأولى
  if (showIntro) {
    return <EntrySequence onComplete={handleIntroComplete} />;
  }

  // 2. شاشة تسجيل الدخول المعتمدة عند عدم تسجيل الدخول
  if (!isLoggedIn || !currentUser) {
    return <LoginCard onLoginSuccess={handleLoginSuccess} />;
  }

  const unreadCount = store.getUnreadCount(currentUser.id);
  const notifications = store.getNotifications(currentUser.id);

  // 3. شاشة النبذة الإلزامية عند أول دخول للمستخدم (onboarded_at === null)
  const isPendingOnboarding = !currentUser.onboarded_at;
  if (isPendingOnboarding) {
    return (
      <MandatoryBioModal
        currentUser={currentUser}
        onBioSaved={handleBioSaved}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-right relative" dir="rtl">
      {/* نافذة التنبيهات المعتمدة (تظهر عند النقر على زر تنبيهات ٣) */}
      {showNotificationsModal && (
        <PostLoginNotifications
          currentUser={currentUser}
          notifications={notifications}
          onClose={(targetTab) => {
            setShowNotificationsModal(false);
            if (targetTab) setCurrentTab(targetTab);
          }}
        />
      )}

      {/* لوحة تخصيص تجربتي كـ Popover أنيق تحت الترس */}
      <CustomizeModal
        currentUser={currentUser}
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* نافذة اكتب لنا */}
      <InquiriesModal
        currentUser={currentUser}
        isOpen={showInquiriesModal}
        onClose={() => setShowInquiriesModal(false)}
      />

      {/* الشريط العلوي المعتمد */}
      <Navbar
        currentUser={currentUser}
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        unreadNotificationsCount={unreadCount}
      />

      {/* المحتوى الرئيسي للتبويب النشط مع حركة التلاشي 0.2 ث والتتابع */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
            transition={{ duration: 0.25 }}
          >
            {/* التبويب 1: الرئيسية (أو نظرة عامة للقادة والمشرفين) */}
            {currentTab === 'home' && (
              currentUser.role === 'track_leader' || currentUser.role === 'supervisor' ? (
                <LeaderDashboard
                  currentUser={currentUser}
                  currentTab="overview"
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              ) : (
                <MemberHome
                  currentUser={currentUser}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onOpenInquiryModal={() => setShowInquiriesModal(true)}
                />
              )
            )}

            {/* التبويب 2: الرحلة التعليمية */}
            {currentTab === 'journey' && (
              <EducationalJourney currentUser={currentUser} />
            )}

            {/* التبويب 3: التحديات والمشاريع */}
            {currentTab === 'challenges' && (
              <ChallengesView currentUser={currentUser} />
            )}

            {/* التبويب 4: المختبر (صفحة 8 بالمرجع) */}
            {currentTab === 'lab' && (
              <WebLab currentUser={currentUser} />
            )}

            {/* التبويب 5: المعرض (صفحة 10 بالمرجع) */}
            {currentTab === 'showcase' && (
              <ShowcaseView currentUser={currentUser} />
            )}

            {/* التبويب 6: المجتمع (صفحة 4 بالمرجع) */}
            {currentTab === 'community' && (
              <CommunityView currentUser={currentUser} />
            )}

            {/* التبويب 7: الملف الشخصي والإنجازات (صفحة 11 بالمرجع) */}
            {currentTab === 'profile' && (
              <ProfileView currentUser={currentUser} />
            )}

            {/* تبويبات لوحة قيادة مسار الويب للقادة (صفحة 12 بالمرجع) */}
            {(currentTab === 'overview' ||
              currentTab === 'members' ||
              currentTab === 'content' ||
              currentTab === 'submissions' ||
              currentTab === 'polls_mgmt' ||
              currentTab === 'points_mgmt' ||
              currentTab === 'evaluations') && (
              <LeaderDashboard
                currentUser={currentUser}
                currentTab={currentTab}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* التذييل الرسمي المعتمد */}
      <Footer />
    </div>
  );
};

export default App;
