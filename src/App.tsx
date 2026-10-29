import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { store, CURRENT_MISSION } from './services/store';
import { UserProfile, NavTab } from './types';
import { EntrySequence } from './components/intro/EntrySequence';
import { LoginCard } from './components/auth/LoginCard';
import { MandatoryBioModal } from './components/auth/MandatoryBioModal';
import { ChangePasswordScreen } from './components/auth/ChangePasswordScreen';
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
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { WelcomeCelebrationModal } from './components/notifications/WelcomeCelebrationModal';
import { selectWelcomePhrase } from './services/welcomePhrases';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    store.getCurrentUser()
  );

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => store.isLoggedIn());
  const [authReady, setAuthReady] = useState<boolean>(() => store.isAuthReady());
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(() =>
    store.mustChangePassword()
  );

  // ?auth=login أو ?logout=true → تسجيل خروج حقيقي من Supabase
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'login' || urlParams.get('logout') === 'true') {
      store.logout();
    }
  }, []);

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
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomePhraseText, setWelcomePhraseText] = useState('');
  const [showStarsCelebrationAlert, setShowStarsCelebrationAlert] = useState(false);
  const welcomeShownRef = React.useRef(false);

  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('notif') === 'true') return true;
    }
    return false;
  });

  // اشتراك في تحديثات Store المركزي (الهوية تأتي من Supabase Auth فقط)
  useEffect(() => {
    const sync = () => {
      const user = store.getCurrentUser();
      setCurrentUser(user);
      setIsLoggedIn(store.isLoggedIn());
      setAuthReady(store.isAuthReady());
      setMustChangePassword(store.mustChangePassword());
      if (user && (user.role === 'track_leader' || user.role === 'supervisor')) {
        setCurrentTab((prev) => (prev === 'home' ? 'overview' : prev));
      }
    };
    const unsubscribe = store.subscribe(sync);
    sync();
    return unsubscribe;
  }, []);

  // تطبيق الإعدادات الفورية على DOM
  useEffect(() => {
    const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('web_track_theme') : null;
    const savedSize = typeof localStorage !== 'undefined' ? localStorage.getItem('web_track_font_size') : null;
    const savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('web_track_lang') : null;

    const theme = savedTheme || currentUser?.settings?.theme || 'light';
    const size = savedSize ? parseInt(savedSize, 10) : (currentUser?.settings?.fontSize || 16);
    const lang = savedLang || currentUser?.settings?.language || 'ar';

    document.documentElement.style.setProperty('--base-font-size', `${size}px`);
    document.documentElement.style.fontSize = `${size}px`;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [currentUser]);

  // تفعيل الترحيب الاحتفالي في كل مرة يفتح فيها العضو المنصة
  useEffect(() => {
    if (currentUser && currentUser.onboarded_at && !store.mustChangePassword() && !welcomeShownRef.current) {
      welcomeShownRef.current = true;
      const phrase = selectWelcomePhrase(currentUser);
      setWelcomePhraseText(phrase.text);
      setShowWelcomeModal(true);
      store.updateUserLastPhrase(currentUser.id, phrase.phraseId);

      // تنبيه عند اعتماد وإعلان نجوم الأسبوع أو عضو الشهر
      if (store.isStarsApproved() && typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('stars_alert_dismissed')) {
        setTimeout(() => {
          setShowStarsCelebrationAlert(true);
        }, 3200);
      }
    }
  }, [currentUser]);

  const handleIntroComplete = () => {
    store.setIntroSeenThisSession();
    setShowIntro(false);
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleLoginSuccess = (_userId: string) => {
    const user = store.getCurrentUser();
    setCurrentUser(user);
    setIsLoggedIn(true);

    if (user && user.onboarded_at && !store.mustChangePassword()) {
      welcomeShownRef.current = true;
      const phrase = selectWelcomePhrase(user);
      setWelcomePhraseText(phrase.text);
      setShowWelcomeModal(true);
      store.updateUserLastPhrase(user.id, phrase.phraseId);

      if (store.isStarsApproved() && typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('stars_alert_dismissed')) {
        setTimeout(() => {
          setShowStarsCelebrationAlert(true);
        }, 3200);
      }
    }

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

  // 2. انتظار استعادة الجلسة من Supabase قبل أي قرار (يمنع وميض شاشة الدخول)
  if (!authReady) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-gray-500 font-bold"
        dir="rtl"
        role="status"
      >
        جارٍ التحقق من الجلسة...
      </div>
    );
  }

  // 3. شاشة تسجيل الدخول المعتمدة عند عدم وجود جلسة Supabase
  if (!isLoggedIn || !currentUser) {
    return <LoginCard onLoginSuccess={handleLoginSuccess} />;
  }

  // 4. تغيير كلمة المرور الإجباري عند أول دخول — قبل أي شيء آخر
  if (mustChangePassword) {
    return <ChangePasswordScreen fullName={currentUser.fullName} />;
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
      {/* نافذة الترحيب والاحتفال بالدخول للمستخدم العائد */}
      {showWelcomeModal && currentUser && (
        <WelcomeCelebrationModal
          currentUser={currentUser}
          phraseText={welcomePhraseText}
          onComplete={() => setShowWelcomeModal(false)}
        />
      )}
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

      {/* نافذة تنبيه الاحتفال بإعلان نجوم الأسبوع وعضو الشهر المعتمدين */}
      {showStarsCelebrationAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => {
            setShowStarsCelebrationAlert(false);
            if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('stars_alert_dismissed', 'true');
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#0F1729] shadow-2xl text-center relative card-3d-tactile"
            dir="rtl"
          >
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm border border-amber-200">
              🏆
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 mb-2">
              لديناااا احتفال جديد ولفتة تكريمية لأعضاء رهيبين! 🎉✨
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-6">
              تم اعتماد وإعلان قائمة <strong>أعضاء الأسبوع الـ 5 الأكثر تفاعلاً</strong> و<strong>عضو الشهر المتميز</strong> رسميًا في لوحة الشرف! تفضل بالاطلاع على إنجازات زملائك والاحتفاء بهم.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowStarsCelebrationAlert(false);
                  if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('stars_alert_dismissed', 'true');
                  setCurrentTab('home');
                  setTimeout(() => {
                    const el = document.getElementById('leaderboard-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className="w-full py-3 rounded-2xl text-xs sm:text-sm font-black text-white bg-[#4285F4] hover:bg-blue-600 transition-all border-none cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>مشاهدة لوحة الشرف والمكرمين 🌟</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowStarsCelebrationAlert(false);
                  if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('stars_alert_dismissed', 'true');
                }}
                className="w-full py-2.5 rounded-2xl text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors border-none cursor-pointer"
              >
                إغلاق التنبيه
              </button>
            </div>
          </motion.div>
        </div>
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
        <ErrorBoundary fallbackTitle="عذراً، حدث خطأ أثناء تحميل هذا القسم">
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
        </ErrorBoundary>
      </main>

      {/* التذييل الرسمي المعتمد */}
      <Footer />
    </div>
  );
};

export default App;
