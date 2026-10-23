/* ==========================================================================
   منصة مجال تصميم وتطوير الويب — نادي قوقل للطلبة المطورين بجامعة الطائف (2026)
   Advanced Interaction Engine & State Controller
   ========================================================================== */

// -----------------------------------------------------------------------------
// 1. حالة الجلسة والأدوار (Current Session & Permissions State)
// -----------------------------------------------------------------------------
let currentUserSession = {
  name: 'غيداء تركي الشريف',
  username: 'Ghaidaa_Lead.web26',
  role: 'leader', // 'leader' | 'supervisor' | 'member'
  status: 'قائدة ومؤسسة المسار 🛡️',
  level: 'track_leader',
  avatarLetter: 'غ'
};

let isPlatformAdminMode = false;
let currentActiveCardIndex = 1;
let currentIdeTab = 'html';
let currentMemberFilter = 'all';
let currentMemberSearchQuery = '';
let selectedModalMemberId = null;

// Dynamic Changing Words Rotator State
const ROTATING_WORDS = [
  'مبدع 🚀',
  'شغوف ✨',
  'متحدٍ 🎯',
  'مبتكر 💡',
  'صانع للمستقبل 🌐'
];
let currentRotatorIndex = 0;
let rotatorInterval = null;

// Audit Trail & Rewards State
let auditLogs = [
  { id: 1, action: 'اعتماد مسار متقدم', target: 'دانه عبدالله الشهري', points: 100, timestamp: 'اليوم، 04:30 م', actor: 'غيداء تركي الشريف' },
  { id: 2, action: 'اعتماد تحدي HTML5', target: 'فيصل خالد الغامدي', points: 100, timestamp: 'اليوم، 02:15 م', actor: 'ريتال القثامي' },
  { id: 3, action: 'منح شارة التميز البرمجي', target: 'بشرى محمد العتيبي', points: 50, timestamp: 'أمس، 08:20 م', actor: 'غيداء تركي الشريف' }
];

let customRewards = [
  { id: 'rew-1', name: 'مكافأة التحدي المفاجئ', type: 'points', value: '100 نقطة', reason: 'سرعة الإنجاز والابتكار' },
  { id: 'rew-2', name: 'شارة التميز في جافاسكريبت', type: 'badge', value: 'لقب وشارة فخرية', reason: 'حل التحدي البرمجي بامتياز' },
  { id: 'rew-3', name: 'أسبقية حجز الورش التخصصية', type: 'privilege', value: 'امتياز مقعد أولوية', reason: 'التفاعل الأسبوعي المستمر' }
];

// Deduplication store for granted rewards
let grantedRewardsSet = new Set(['rew-1_3', 'rew-2_4']); // rewardId_memberId

// -----------------------------------------------------------------------------
// 2. التهيئة عند تحميل الصفحة (Initialization on DOMContentLoaded)
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initConfettiCanvas();
  initMembersData();
  startWordRotator();
  loadCodeTemplate('google_card');
  runLiveCode();
  renderRewardsCheckboxes();
  renderAuditLogs();

  // Keyboard shortcut to skip intro (Esc)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const splash = document.getElementById('splashOverlay');
      if (splash && splash.style.display !== 'none') {
        transitionToAuth();
      }
    }
  });
});

// -----------------------------------------------------------------------------
// 3. التحكم في شاشة البداية — تجربة Google Chrome (Card Stack Controller)
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// محرك الافتتاحية السينمائية الشاملة — Fullscreen Cinematic Opening Engine
// -----------------------------------------------------------------------------
let introTimer = null;

function initCinematicIntro() {
  const intro = document.getElementById('cinematicIntroStage');
  if (!intro) return;

  // Auto transition to platform after scene 3 (approx 6.8 seconds)
  introTimer = setTimeout(() => {
    skipCinematicIntro();
  }, 6800);

  // Esc key skips intro immediately
  window.addEventListener('keydown', handleIntroEscKey);
}

function handleIntroEscKey(e) {
  if (e.key === 'Escape') {
    const intro = document.getElementById('cinematicIntroStage');
    if (intro && !intro.classList.contains('fade-out')) {
      skipCinematicIntro();
    }
  }
}

function skipCinematicIntro() {
  if (introTimer) clearTimeout(introTimer);
  const intro = document.getElementById('cinematicIntroStage');
  if (intro) {
    intro.classList.add('fade-out');
    setTimeout(() => {
      intro.style.display = 'none';
      enterPlatformImmediately();
    }, 550);
  } else {
    enterPlatformImmediately();
  }
}

function replayCinematicIntro() {
  const intro = document.getElementById('cinematicIntroStage');
  if (intro) {
    intro.style.display = 'flex';
    intro.classList.remove('fade-out');
    // Re-trigger CSS animations by cloneNode or class reset
    const canvas = document.getElementById('cinematicCanvasCore');
    if (canvas) {
      canvas.style.animation = 'none';
      canvas.offsetHeight; /* trigger reflow */
      canvas.style.animation = '';
    }
    initCinematicIntro();
  }
}
function transitionToAuth() {
  const intro = document.getElementById('cinematicIntroStage');
  const auth = document.getElementById('authOverlay');
  if (intro) {
    intro.classList.add('fade-out');
    setTimeout(() => {
      intro.style.display = 'none';
      if (auth) {
        auth.style.display = 'flex';
        auth.classList.add('active');
      }
    }, 400);
  } else if (auth) {
    auth.style.display = 'flex';
    auth.classList.add('active');
  }
}

// -----------------------------------------------------------------------------
// 4. محرك العبارات المتغيرة (Dynamic Rotating Words Engine)
// -----------------------------------------------------------------------------
function startWordRotator() {
  if (rotatorInterval) clearInterval(rotatorInterval);
  const wordEl = document.getElementById('rotatorChangingWord');
  if (!wordEl) return;

  rotatorInterval = setInterval(() => {
    currentRotatorIndex = (currentRotatorIndex + 1) % ROTATING_WORDS.length;
    wordEl.style.opacity = '0';
    wordEl.style.transform = 'translateY(8px)';

    setTimeout(() => {
      wordEl.innerText = ROTATING_WORDS[currentRotatorIndex];
      wordEl.style.opacity = '1';
      wordEl.style.transform = 'translateY(0)';
    }, 280);
  }, 2600);
}

// -----------------------------------------------------------------------------
// 5. تسجيل الدخول والأدوار (Authentication, Presets & Permissions)
// -----------------------------------------------------------------------------
function switchAuthTab(mode) {
  dismissAuthError();
  const btnAct = document.getElementById('tabBtnActivate');
  const btnLog = document.getElementById('tabBtnLogin');
  const formAct = document.getElementById('formActivation');
  const formLog = document.getElementById('formLogin');

  if (mode === 'activate') {
    btnAct.classList.add('active');
    btnLog.classList.remove('active');
    formAct.style.display = 'block';
    formLog.style.display = 'none';
  } else {
    btnLog.classList.add('active');
    btnAct.classList.remove('active');
    formLog.style.display = 'block';
    formAct.style.display = 'none';
  }
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

function updatePasswordStrength(val) {
  const m1 = document.getElementById('meterSeg1');
  const m2 = document.getElementById('meterSeg2');
  const m3 = document.getElementById('meterSeg3');
  const text = document.getElementById('passwordStrengthText');
  if (!m1 || !text) return;

  m1.className = 'meter-segment';
  m2.className = 'meter-segment';
  m3.className = 'meter-segment';

  if (!val || val.length < 5) {
    text.innerText = 'كلمة مرور ضعيفة';
  } else if (val.length < 10) {
    m1.className = 'meter-segment active-medium';
    m2.className = 'meter-segment active-medium';
    text.innerText = 'متوسطة الأمان';
  } else {
    m1.className = 'meter-segment active-strong';
    m2.className = 'meter-segment active-strong';
    m3.className = 'meter-segment active-strong';
    text.innerText = 'قوية ومطابقة للمعايير 🛡️';
  }
}

function dismissAuthError() {
  const banner = document.getElementById('authErrorBanner');
  if (banner) banner.style.display = 'none';
}

function autoFillAuth(preset) {
  dismissAuthError();

  const presetButtons = document.querySelectorAll('.quick-fill-btn');
  presetButtons.forEach(b => b.classList.remove('active'));

  const clickedBtn = document.getElementById(
    preset === 'leader_ghaidaa' ? 'btnPresetLeaderGhaidaa' :
    preset === 'leader_retal' ? 'btnPresetLeaderRetal' :
    preset === 'supervisor_atheer' ? 'btnPresetSupervisorAtheer' :
    preset === 'supervisor_amer' ? 'btnPresetSupervisorAmer' :
    preset === 'student_dana' ? 'btnPresetStudentDana' :
    preset === 'student_bushra' ? 'btnPresetStudentBushra' :
    preset === 'student_rimas' ? 'btnPresetStudentRimas' : ''
  );
  if (clickedBtn) clickedBtn.classList.add('active');

  if (preset === 'leader_ghaidaa') {
    switchAuthTab('login');
    document.getElementById('inputLoginEmail').value = 'Ghaidaa_Lead.web26';
    document.getElementById('inputLoginPassword').value = 'GDSoC-WebTrackAdmin002';
    currentUserSession = {
      name: 'غيداء تركي الشريف',
      username: 'Ghaidaa_Lead.web26',
      role: 'leader',
      status: 'قائدة ومؤسسة المسار 🛡️',
      level: 'track_leader',
      avatarLetter: 'غ'
    };
  } else if (preset === 'leader_retal') {
    switchAuthTab('login');
    document.getElementById('inputLoginEmail').value = 'Retal_Lead.web26';
    document.getElementById('inputLoginPassword').value = 'GDSoC-WebTrackAdmin151';
    currentUserSession = {
      name: 'ريتال القثامي',
      username: 'Retal_Lead.web26',
      role: 'leader',
      status: 'قائدة ومراجعة المسار 🛡️',
      level: 'track_leader',
      avatarLetter: 'ر'
    };
  } else if (preset === 'supervisor_atheer') {
    switchAuthTab('login');
    document.getElementById('inputLoginEmail').value = 'Atheer_Super.web26';
    document.getElementById('inputLoginPassword').value = 'GDSoC-WebTrackSuper789';
    currentUserSession = {
      name: 'أثير العتيبي',
      username: 'Atheer_Super.web26',
      role: 'supervisor',
      status: 'قائدة المجالات • إشراف عام 🌟',
      level: 'supervisor',
      avatarLetter: 'أ'
    };
  } else if (preset === 'supervisor_amer') {
    switchAuthTab('login');
    document.getElementById('inputLoginEmail').value = 'Amer_Super.web26';
    document.getElementById('inputLoginPassword').value = 'GDSoC-WebTrackSuper456';
    currentUserSession = {
      name: 'عامر الحارثي',
      username: 'Amer_Super.web26',
      role: 'supervisor',
      status: 'نائب قائد المجالات • إشراف عام 🌟',
      level: 'supervisor',
      avatarLetter: 'ع'
    };
  } else if (preset === 'student_dana') {
    switchAuthTab('activate');
    const inputCode = document.getElementById('inputInviteCode');
    inputCode.value = 'GDG-TU-2026-1003';
    handleInviteCodeInput('GDG-TU-2026-1003');
    document.getElementById('inputActivateEmail').value = 'Dana_M.web26';
    document.getElementById('inputActivatePassword').value = 'GDSoC-WebTrack173';
    updatePasswordStrength('GDSoC-WebTrack173');
    currentUserSession = {
      name: 'دانه عبدالله الشهري',
      username: 'Dana_M.web26',
      role: 'member',
      status: 'مسار متقدم ✔',
      level: 'advanced',
      avatarLetter: 'د'
    };
  } else if (preset === 'student_bushra') {
    switchAuthTab('activate');
    const inputCode = document.getElementById('inputInviteCode');
    inputCode.value = 'GDG-TU-2026-1010';
    handleInviteCodeInput('GDG-TU-2026-1010');
    document.getElementById('inputActivateEmail').value = 'Bushra_M.web26';
    document.getElementById('inputActivatePassword').value = 'GDSoC-WebTrack856';
    updatePasswordStrength('GDSoC-WebTrack856');
    currentUserSession = {
      name: 'بشرى محمد العتيبي',
      username: 'Bushra_M.web26',
      role: 'member',
      status: 'مسار متوسط ✔',
      level: 'intermediate',
      avatarLetter: 'ب'
    };
  } else if (preset === 'student_rimas') {
    switchAuthTab('activate');
    const inputCode = document.getElementById('inputInviteCode');
    inputCode.value = 'GDG-TU-2026-1001';
    handleInviteCodeInput('GDG-TU-2026-1001');
    document.getElementById('inputActivateEmail').value = 'Rimas_M.web26';
    document.getElementById('inputActivatePassword').value = 'GDSoC-WebTrack390';
    updatePasswordStrength('GDSoC-WebTrack390');
    currentUserSession = {
      name: 'ريماس محمد الحارثي',
      username: 'Rimas_M.web26',
      role: 'member',
      status: 'مسار مبتدئ ✔',
      level: 'beginner',
      avatarLetter: 'ر'
    };
  }
}

function handleInviteCodeInput(val) {
  const badge = document.getElementById('inviteCodeStatusBadge');
  const icon = document.getElementById('codeValidIcon');
  if (!badge) return;

  const code = (val || '').trim().toUpperCase();
  const matched = (typeof membersState !== 'undefined' ? membersState : []).find(m => m.inviteToken === code);

  if (matched) {
    badge.innerText = `✔ معتمد: ${matched.fullName} (${matched.calculatedLevel === 'advanced' ? 'متقدم' : matched.calculatedLevel === 'intermediate' ? 'متوسط' : 'مبتدئ'})`;
    badge.style.background = '#DCFCE7';
    badge.style.color = '#15803D';
    if (icon) icon.innerText = '✅';
  } else {
    badge.innerText = 'صيغة الرمز: GDG-TU-2026-XXXX';
    badge.style.background = '#F1F5F9';
    badge.style.color = '#475569';
    if (icon) icon.innerText = '🎟️';
  }
}

function handleActivationSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btnSubmitActivation');
  const codeVal = document.getElementById('inputInviteCode')?.value.trim().toUpperCase();
  const matched = (typeof membersState !== 'undefined' ? membersState : []).find(m => m.inviteToken === codeVal);

  if (matched) {
    currentUserSession = {
      name: matched.fullName,
      username: matched.username,
      role: 'member',
      status: `مسار ${matched.calculatedLevel === 'advanced' ? 'متقدم' : matched.calculatedLevel === 'intermediate' ? 'متوسط' : 'مبتدئ'} ✔`,
      level: matched.calculatedLevel,
      avatarLetter: matched.fullName.charAt(0)
    };
  }

  btn.disabled = true;
  btn.innerText = 'جاري التفعيل والتحقق...';

  setTimeout(() => {
    btn.innerText = 'تم تفعيل الحساب بنجاح! 🎉';
    btn.style.background = '#34A853';
    setTimeout(transitionToWelcome, 450);
  }, 650);
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btnSubmitLogin');
  const inputVal = (document.getElementById('inputLoginEmail')?.value || '').trim();

  if (inputVal === 'Retal_Lead.web26' || inputVal.toLowerCase().includes('retal')) {
    currentUserSession = {
      name: 'ريتال القثامي',
      username: 'Retal_Lead.web26',
      role: 'leader',
      status: 'قائدة ومراجعة المسار 🛡️',
      level: 'track_leader',
      avatarLetter: 'ر'
    };
  } else if (inputVal === 'Ghaidaa_Lead.web26' || inputVal.toLowerCase().includes('ghaidaa') || inputVal.toLowerCase().includes('leader')) {
    currentUserSession = {
      name: 'غيداء تركي الشريف',
      username: 'Ghaidaa_Lead.web26',
      role: 'leader',
      status: 'قائدة ومؤسسة المسار 🛡️',
      level: 'track_leader',
      avatarLetter: 'غ'
    };
  } else if (inputVal === 'Atheer_Super.web26' || inputVal.toLowerCase().includes('atheer')) {
    currentUserSession = {
      name: 'أثير العتيبي',
      username: 'Atheer_Super.web26',
      role: 'supervisor',
      status: 'قائدة المجالات • إشراف عام 🌟',
      level: 'supervisor',
      avatarLetter: 'أ'
    };
  } else if (inputVal === 'Amer_Super.web26' || inputVal.toLowerCase().includes('amer')) {
    currentUserSession = {
      name: 'عامر الحارثي',
      username: 'Amer_Super.web26',
      role: 'supervisor',
      status: 'نائب قائد المجالات • إشراف عام 🌟',
      level: 'supervisor',
      avatarLetter: 'ع'
    };
  } else {
    const member = (typeof membersState !== 'undefined' ? membersState : []).find(m => 
      (m.username && m.username.toLowerCase() === inputVal.toLowerCase()) ||
      (m.phone && m.phone.includes(inputVal)) ||
      (m.fullName && inputVal.includes(m.fullName))
    );
    if (member) {
      currentUserSession = {
        name: member.fullName,
        username: member.username,
        role: 'member',
        status: `مسار ${member.calculatedLevel === 'advanced' ? 'متقدم' : member.calculatedLevel === 'intermediate' ? 'متوسط' : 'مبتدئ'} ✔`,
        level: member.calculatedLevel,
        avatarLetter: member.fullName.charAt(0)
      };
    }
  }

  btn.disabled = true;
  btn.innerText = 'جاري تسجيل الدخول...';

  setTimeout(() => {
    btn.innerText = 'تم الدخول بنجاح! 🎉';
    btn.style.background = '#34A853';
    setTimeout(transitionToWelcome, 450);
  }, 650);
}

// -----------------------------------------------------------------------------
// 6. شاشة الترحيب الشخصية والولوج للمنصة
// -----------------------------------------------------------------------------
function transitionToWelcome() {
  const auth = document.getElementById('authOverlay');
  const welcome = document.getElementById('welcomeOverlay');
  if (auth) {
    auth.classList.remove('active');
    auth.style.display = 'none';
  }

  if (welcome) {
    welcome.style.display = 'flex';
    welcome.classList.add('active');

    document.getElementById('welcomeAvatarChar').innerText = currentUserSession.avatarLetter || 'غ';
    document.getElementById('welcomePersonalizedName').innerText = `حي الله المطوّرة القوقلية، ${currentUserSession.name}!`;
    document.getElementById('welcomeGreetingRoleBadge').innerText = currentUserSession.status;

    // Trigger celebration confetti
    triggerCelebrationConfetti();

    // Auto-enter after 2.8 seconds
    setTimeout(enterPlatformImmediately, 2800);
  }
}

function enterPlatformImmediately() {
  const welcome = document.getElementById('welcomeOverlay');
  const shell = document.getElementById('platformShell');

  if (welcome) {
    welcome.classList.remove('active');
    welcome.style.display = 'none';
  }

  if (shell) {
    shell.classList.add('visible');
    syncUserNavbarData();

    if (currentUserSession.role === 'supervisor') {
      showPlatformPage('supervision');
    } else if (currentUserSession.role === 'leader') {
      showPlatformPage('leader');
    } else {
      showPlatformPage('home');
    }
  }
}

function quickEnterPlatformAs(preset = 'leader_ghaidaa') {
  autoFillAuth(preset);
  const splash = document.getElementById('splashOverlay');
  const auth = document.getElementById('authOverlay');
  const welcome = document.getElementById('welcomeOverlay');
  if (splash) { splash.style.display = 'none'; splash.classList.add('fade-out'); }
  if (auth) { auth.style.display = 'none'; auth.classList.remove('active'); }
  if (welcome) { welcome.style.display = 'none'; welcome.classList.remove('active'); }
  enterPlatformImmediately();
}

function syncUserNavbarData() {
  const navName = document.getElementById('navMemberName');
  const navStatus = document.getElementById('navMemberStatus');
  const navAvatar = document.getElementById('navAvatarLetter');
  const heroHeading = document.getElementById('heroMainHeading');
  const adminToggle = document.getElementById('adminTogglePill');
  const navTabLeader = document.getElementById('navTabLeader');
  const navTabSupervision = document.getElementById('navTabSupervision');

  if (navName) navName.innerText = currentUserSession.name;
  if (navStatus) navStatus.innerText = currentUserSession.status;
  if (navAvatar) navAvatar.innerText = currentUserSession.avatarLetter;

  const capAvatar = document.getElementById('capsuleAvatar');
  const capName = document.getElementById('capsuleName');
  const capRole = document.getElementById('capsuleRole');
  if (capAvatar) capAvatar.innerText = currentUserSession.avatarLetter;
  if (capName) capName.innerText = currentUserSession.name;
  if (capRole) capRole.innerText = currentUserSession.status;

  if (heroHeading) {
    heroHeading.innerText = `أهلاً بكِ ${currentUserSession.name.split(' ')[0]} في مسار تصميم وتطوير الويب`;
  }

  // Role permissions enforcement in UI
  if (currentUserSession.role === 'supervisor') {
    if (adminToggle) {
      adminToggle.style.display = 'inline-flex';
      adminToggle.style.background = '#FEF2F2';
      adminToggle.style.borderColor = '#FCA5A5';
      document.getElementById('roleTextDesc').innerText = 'لوحة الإشراف (Supervision)';
    }
    if (navTabLeader) navTabLeader.style.display = 'none';
    if (navTabSupervision) navTabSupervision.style.display = 'inline-flex';
  } else if (currentUserSession.role === 'leader') {
    if (adminToggle) {
      adminToggle.style.display = 'inline-flex';
      document.getElementById('roleTextDesc').innerText = 'لوحة القادة (Leader)';
    }
    if (navTabLeader) navTabLeader.style.display = 'inline-flex';
    if (navTabSupervision) navTabSupervision.style.display = 'none';
  } else {
    // Regular Member
    if (adminToggle) adminToggle.style.display = 'none';
    if (navTabLeader) navTabLeader.style.display = 'none';
    if (navTabSupervision) navTabSupervision.style.display = 'none';
  }

  // Update Profile page details
  const profName = document.getElementById('profFullName');
  const profAvatar = document.getElementById('profAvatarChar');
  const profLevel = document.getElementById('profLevelBadge');
  if (profName) profName.innerText = currentUserSession.name;
  if (profAvatar) profAvatar.innerText = currentUserSession.avatarLetter;
  if (profLevel) profLevel.innerText = currentUserSession.status;
}

// -----------------------------------------------------------------------------
// 7. التنقل بين أقسام المنصة (Tab Switching Controller)
// -----------------------------------------------------------------------------
function showPlatformPage(pageId) {
  const allPages = document.querySelectorAll('.app-page-view');
  allPages.forEach(p => p.classList.remove('active'));

  const target = document.getElementById(`view-${pageId}`);
  if (target) {
    target.classList.add('active');
  }

  const tabs = document.querySelectorAll('.creative-tab-btn');
  tabs.forEach(t => {
    if (t.getAttribute('data-tab') === pageId) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function togglePlatformAdmin() {
  if (currentUserSession.role === 'supervisor') {
    showPlatformPage('supervision');
  } else {
    if (!isPlatformAdminMode) {
      isPlatformAdminMode = true;
      document.getElementById('roleTextDesc').innerText = 'بوابة الأعضاء (Student)';
      showPlatformPage('leader');
    } else {
      isPlatformAdminMode = false;
      document.getElementById('roleTextDesc').innerText = 'لوحة القادة (Admin)';
      showPlatformPage('home');
    }
  }
}

// -----------------------------------------------------------------------------
// 8. إدارة الأعضاء والترتيب الأبجدي الافتراضي (Members & Arabic Sorting)
// -----------------------------------------------------------------------------
let membersState = [];

function initMembersData() {
  const saved = localStorage.getItem('gdg_tu_members_state_v4');
  if (saved) {
    try {
      membersState = JSON.parse(saved);
    } catch(e) {
      membersState = [...(typeof GDG_MEMBERS !== 'undefined' ? GDG_MEMBERS : [])];
    }
  } else {
    membersState = [...(typeof GDG_MEMBERS !== 'undefined' ? GDG_MEMBERS : [])];
  }

  // Default Sort: Arabic Alphabetical Order (أ - ي)
  sortMembersAlphabetically(false);
}

function sortMembersAlphabetically(shouldRender = true) {
  membersState.sort((a, b) => a.fullName.localeCompare(b.fullName, 'ar'));
  if (shouldRender) renderMembersTable();
}

function setMemberFilter(level, btn) {
  currentMemberFilter = level;
  const chips = document.querySelectorAll('.filter-chip-btn');
  chips.forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMembersTable();
}

function handleMemberSearch(query) {
  currentMemberSearchQuery = (query || '').trim().toLowerCase();
  renderMembersTable();
}

function renderMembersTable() {
  const tbody = document.getElementById('membersTableBody');
  if (!tbody) return;

  const filtered = membersState.filter(m => {
    const matchesLevel = currentMemberFilter === 'all' || m.calculatedLevel === currentMemberFilter;
    const matchesSearch = !currentMemberSearchQuery ||
      m.fullName.toLowerCase().includes(currentMemberSearchQuery) ||
      (m.username && m.username.toLowerCase().includes(currentMemberSearchQuery)) ||
      (m.phone && m.phone.includes(currentMemberSearchQuery));
    return matchesLevel && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:32px; color:var(--text-muted);">
          🔍 لا توجد نتائج مطابقة لمعايير البحث والتصفية المحددة.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((m, index) => {
    const isApproved = m.levelStatus === 'approved';
    const lvlText = m.calculatedLevel === 'advanced' ? 'متقدم' : m.calculatedLevel === 'intermediate' ? 'متوسط' : 'مبتدئ';
    const lvlClass = m.calculatedLevel === 'advanced' ? 'level-advanced' : m.calculatedLevel === 'intermediate' ? 'level-intermediate' : 'level-beginner';

    return `
      <tr class="${isApproved ? '' : 'row-pending'}">
        <td style="font-weight:800; color:var(--text-muted); text-align:center;">${index + 1}</td>
        <td>
          <div class="member-name-main" style="cursor:pointer;" onclick="openMemberDetailModal(${m.id})">
            ${m.fullName}
          </div>
          <div class="member-sub-info">
            ${m.major} • المستوى ${m.academicYear} • جوال: ${m.phone}
          </div>
        </td>
        <td>
          <span class="username-chip">${m.username || 'لم يُنشأ'}</span>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="level-badge-custom ${lvlClass}">${lvlText}</span>
            <select class="level-select-inline" onchange="changeMemberLevelDirect(${m.id}, this.value)">
              <option value="beginner" ${m.calculatedLevel === 'beginner' ? 'selected' : ''}>مبتدئ</option>
              <option value="intermediate" ${m.calculatedLevel === 'intermediate' ? 'selected' : ''}>متوسط</option>
              <option value="advanced" ${m.calculatedLevel === 'advanced' ? 'selected' : ''}>متقدم</option>
            </select>
          </div>
        </td>
        <td>
          <div class="token-copy-cell">
            <span class="token-val" id="tok-${m.id}">${m.inviteToken}</span>
            <button type="button" class="btn-copy-token" onclick="copyTokenToClipboard('${m.inviteToken}', this)">نسخ</button>
          </div>
        </td>
        <td>
          <div class="action-cell-btns">
            <button class="btn-status-toggle ${isApproved ? 'btn-approved' : 'btn-pending'}" onclick="toggleMemberApproval(${m.id})">
              ${isApproved ? 'معتمد رسمياً ✔' : 'اعتماد المستوى'}
            </button>
            <button class="btn-view-details" onclick="openMemberDetailModal(${m.id})">
              التفاصيل 📄
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function changeMemberLevelDirect(memberId, newLevel) {
  const m = membersState.find(x => x.id === memberId);
  if (m) {
    m.calculatedLevel = newLevel;
    saveMembersState();
    renderMembersTable();
    logAuditEvent(`تعديل مستوى العضو إلى ${newLevel}`, m.fullName, 0);
  }
}

function toggleMemberApproval(memberId) {
  const m = membersState.find(x => x.id === memberId);
  if (m) {
    m.levelStatus = m.levelStatus === 'approved' ? 'pending' : 'approved';
    saveMembersState();
    renderMembersTable();
    if (m.levelStatus === 'approved') {
      triggerCelebrationConfetti();
      logAuditEvent('اعتماد المستوى الرسمي', m.fullName, 50);
    }
  }
}

function approveAllPending() {
  membersState.forEach(m => m.levelStatus = 'approved');
  saveMembersState();
  renderMembersTable();
  triggerCelebrationConfetti();
  alert('✔ تم اعتماد جميع مستويات الأعضاء الـ 30 دفعة واحدة بنجاح!');
  logAuditEvent('اعتماد كافة المستويات للأعضاء', '30 عضواً', 1500);
}

function saveMembersState() {
  localStorage.setItem('gdg_tu_members_state_v4', JSON.stringify(membersState));
}

function copyTokenToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.innerText;
    btn.innerText = 'تم!';
    btn.style.background = '#34A853';
    btn.style.color = '#FFFFFF';
    setTimeout(() => {
      btn.innerText = orig;
      btn.style.background = '';
      btn.style.color = '';
    }, 1400);
  });
}

// -----------------------------------------------------------------------------
// 9. تفاصيل استبيان العضو (Member Details Modal)
// -----------------------------------------------------------------------------
function openMemberDetailModal(memberId) {
  selectedModalMemberId = memberId;
  const m = membersState.find(x => x.id === memberId);
  if (!m) return;

  const backdrop = document.getElementById('memberDetailModalBackdrop');
  document.getElementById('modalMemberName').innerText = m.fullName;
  document.getElementById('modalMemberMeta').innerText = `${m.major} • السنة ${m.academicYear} • هاتف: ${m.phone}`;

  const grid = document.getElementById('modalMemberDetailGrid');
  grid.innerHTML = `
    <div class="detail-field-box">
      <div class="f-title">اسم المستخدم المعتمد</div>
      <div class="f-content"><code style="color:#1a73e8;">${m.username}</code></div>
    </div>
    <div class="detail-field-box">
      <div class="f-title">رمز التفعيل السري</div>
      <div class="f-content"><code style="color:#EA4335;">${m.inviteToken}</code></div>
    </div>
    <div class="detail-field-box full-width">
      <div class="f-title">الخبرة البرمجية السابقة</div>
      <div class="f-content">${m.programmingExp || 'غير محدد'}</div>
    </div>
    <div class="detail-field-box full-width">
      <div class="f-title">التقنيات والأدوات المستخدمة</div>
      <div class="f-content">
        ${(m.toolsUsed || []).map(t => `<span class="tech-tag-badge">${t}</span>`).join('') || 'لا توجد'}
      </div>
    </div>
    <div class="detail-field-box full-width">
      <div class="f-title">ما تود تحقيقه من المسار</div>
      <div class="f-content">${m.trackGoals || 'تطوير المهارات البرمجية وبناء مشاريع حقيقية.'}</div>
    </div>
  `;

  if (backdrop) backdrop.classList.add('show');
}

function closeMemberDetailModal() {
  const backdrop = document.getElementById('memberDetailModalBackdrop');
  if (backdrop) backdrop.classList.remove('show');
}

function approveCurrentModalMember() {
  if (selectedModalMemberId) {
    toggleMemberApproval(selectedModalMemberId);
    closeMemberDetailModal();
  }
}

// -----------------------------------------------------------------------------
// 10. تصدير رموز الدعوة للواتساب (Export Tokens Dialog)
// -----------------------------------------------------------------------------
function openExportTokensModal() {
  const backdrop = document.getElementById('exportTokensModalBackdrop');
  const textarea = document.getElementById('exportTokensTextarea');

  let text = `🌟 قائمة بيانات دخول أعضاء مسار تصميم وتطوير الويب 2026
`;
  text += `نادي قوقل للطلبة المطورين — جامعة الطائف (GDG on Campus TU)
`;
  text += `إشراف القائدتين: غيداء تركي الشريف (Ghaidaa_Lead.web26) & ريتال القثامي (Retal_Lead.web26)
`;
  text += `=============================================================

`;

  membersState.forEach((m, idx) => {
    const lvl = m.calculatedLevel === 'advanced' ? 'متقدم' : m.calculatedLevel === 'intermediate' ? 'متوسط' : 'مبتدئ';
    text += `[${idx + 1}] ${m.fullName} | مسار: ${lvl}
`;
    text += `   • اسم المستخدم (Username): ${m.username}
`;
    text += `   • كلمة المرور (Password):  ${m.password}
`;
    text += `   • رمز التفعيل لمرة واحدة:  ${m.inviteToken}
`;
    text += `   ----------------------------------------------------------
`;
  });

  text += `
طريقة الدخول:
1. فتح رابط المنصة.
2. استخدام رمز التفعيل للدخول المباشر.`;

  if (textarea) textarea.value = text;
  if (backdrop) backdrop.classList.add('show');
}

function closeExportTokensModal() {
  const backdrop = document.getElementById('exportTokensModalBackdrop');
  if (backdrop) backdrop.classList.remove('show');
}

function copyAllTokensToClipboard() {
  const textarea = document.getElementById('exportTokensTextarea');
  const msg = document.getElementById('copyTokensSuccessMsg');
  if (!textarea) return;

  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    if (msg) msg.innerText = '✔ تم نسخ القائمة كاملة إلى الحافظة بنجاح!';
    setTimeout(() => { if (msg) msg.innerText = ''; }, 3000);
  });
}

// -----------------------------------------------------------------------------
// 11. التبويبات الفرعية للوحة القادة (Leader Sub-tabs)
// -----------------------------------------------------------------------------
function switchLeaderSubTab(subTab) {
  const tabs = ['members', 'reviews', 'rewards', 'audit'];
  tabs.forEach(t => {
    const btn = document.getElementById(`lSubTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const view = document.getElementById(`lSubView${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) btn.classList.toggle('active', t === subTab);
    if (view) view.style.display = t === subTab ? 'block' : 'none';
  });
}

// -----------------------------------------------------------------------------
// 12. إدارة المكافآت المرنة (Flexible Rewards Management)
// -----------------------------------------------------------------------------
function renderRewardsCheckboxes() {
  const container = document.getElementById('rewardsMemberCheckboxList');
  if (!container) return;

  container.innerHTML = membersState.map(m => `
    <label style="display:flex; align-items:center; gap:8px; padding:6px; cursor:pointer; font-size:0.86rem; border-bottom:1px solid #F1F5F9;">
      <input type="checkbox" class="reward-member-checkbox" value="${m.id}">
      <span>${m.fullName}</span>
      <span style="font-size:0.75rem; color:#64748B;">(${m.calculatedLevel})</span>
    </label>
  `).join('');
}

function selectAllRewardMembers() {
  const boxes = document.querySelectorAll('.reward-member-checkbox');
  const allChecked = Array.from(boxes).every(b => b.checked);
  boxes.forEach(b => b.checked = !allChecked);
}

function createNewRewardDefinition() {
  const name = document.getElementById('newRewardName')?.value.trim();
  const type = document.getElementById('newRewardType')?.value;
  const value = document.getElementById('newRewardValue')?.value.trim();
  const reason = document.getElementById('newRewardReason')?.value.trim();

  if (!name || !value) {
    alert('يرجى كتابة اسم المكافأة وقيمتها أولاً.');
    return;
  }

  const newRew = {
    id: 'rew-' + Date.now(),
    name,
    type,
    value,
    reason: reason || 'مكافأة تفوق وإنجاز'
  };

  customRewards.push(newRew);

  // Update select dropdown
  const select = document.getElementById('grantSelectReward');
  if (select) {
    const opt = document.createElement('option');
    opt.value = newRew.id;
    opt.innerText = `${newRew.name} (${newRew.value})`;
    select.appendChild(opt);
    select.value = newRew.id;
  }

  alert(`✔ تم حفظ تعريف المكافأة: "${name}" بنجاح!`);
  logAuditEvent(`إنشاء تعريف مكافأة جديدة: ${name}`, 'النظام العام', 0);
}

function grantRewardToSelected() {
  const rewardId = document.getElementById('grantSelectReward')?.value;
  const reward = customRewards.find(r => r.id === rewardId) || customRewards[0];

  const checkedBoxes = Array.from(document.querySelectorAll('.reward-member-checkbox:checked'));
  if (checkedBoxes.length === 0) {
    alert('يرجى تحديد عضو واحد على الأقل لمنح المكافأة.');
    return;
  }

  let grantedCount = 0;
  let duplicateCount = 0;

  checkedBoxes.forEach(b => {
    const memberId = parseInt(b.value);
    const dedupeKey = `${reward.id}_${memberId}`;
    const member = membersState.find(m => m.id === memberId);

    if (grantedRewardsSet.has(dedupeKey)) {
      duplicateCount++;
    } else {
      grantedRewardsSet.add(dedupeKey);
      grantedCount++;
      logAuditEvent(`منح مكافأة: ${reward.name}`, member ? member.fullName : 'عضو', reward.type === 'points' ? 100 : 50);
    }
  });

  triggerCelebrationConfetti();
  alert(`🎉 تم منح المكافأة لـ (${grantedCount}) عضو بنجاح!${duplicateCount > 0 ? ` (تم تخطي ${duplicateCount} لحصولهم عليها مسبقاً لمنع التكرار)` : ''}`);
}

function logAuditEvent(action, target, points) {
  const newLog = {
    id: auditLogs.length + 1,
    action,
    target,
    points,
    timestamp: 'الآن',
    actor: currentUserSession.name
  };
  auditLogs.unshift(newLog);
  renderAuditLogs();
}

function renderAuditLogs() {
  const container = document.getElementById('leaderAuditLogContainer');
  if (!container) return;

  container.innerHTML = auditLogs.map(l => `
    <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <strong style="color:#0F172A;">${l.action}</strong> ➔ <span style="color:#1a73e8; font-weight:700;">${l.target}</span>
        <div style="font-size:0.75rem; color:#64748B; margin-top:2px;">بواسطة: ${l.actor} • ${l.timestamp}</div>
      </div>
      ${l.points > 0 ? `<span style="background:#DCFCE7; color:#15803D; padding:3px 10px; border-radius:9999px; font-weight:900; font-size:0.8rem;">+${l.points} نقطة</span>` : ''}
    </div>
  `).join('');
}

// -----------------------------------------------------------------------------
// 13. مراجعة تسليمات التحديات (Challenge Submissions & Grading)
// -----------------------------------------------------------------------------
function openChallengeSubmitModal(title) {
  const backdrop = document.getElementById('challengeSubmitModalBackdrop');
  const titleEl = document.getElementById('submitModalChallengeTitle');
  if (titleEl) titleEl.innerText = title;
  if (backdrop) backdrop.classList.add('show');
}

function closeChallengeSubmitModal() {
  const backdrop = document.getElementById('challengeSubmitModalBackdrop');
  if (backdrop) backdrop.classList.remove('show');
}

function handleChallengeSubmission(e) {
  e.preventDefault();
  closeChallengeSubmitModal();
  triggerCelebrationConfetti();
  alert('✔ تم تسليم عملك بنجاح! سيتم مراجعته واعتماد نقاطك رسمياً من قيادة المسار.');
  logAuditEvent('تسليم تحدي برمجي', currentUserSession.name, 0);
}

function approveSubmission(studentName, points) {
  triggerCelebrationConfetti();
  alert(`✔ تم اعتماد تسليم ${studentName} ومنح +${points} نقطة بنجاح!`);
  logAuditEvent('اعتماد تسليم تحدي عملي', studentName, points);
}

function requestRevision(studentName) {
  const reason = prompt(`يرجى كتابة ملاحظات التعديل لـ ${studentName}:`, 'يرجى مراجعة تناسق الـ Grid في شاشات الموبايل.');
  if (reason) {
    alert(`✔ تم إرسال طلب التعديل لـ ${studentName} مع الملاحظات!`);
    logAuditEvent(`طلب تعديلات: ${reason}`, studentName, 0);
  }
}

// -----------------------------------------------------------------------------
// 14. مختبر الويب الحي (Live Web Lab Code Runner)
// -----------------------------------------------------------------------------
const CODE_TEMPLATES = {
  google_card: {
    html: `<div class="g-card">
  <div class="dots"><span class="d b"></span><span class="d r"></span><span class="d y"></span><span class="d g"></span></div>
  <h2>GDG on Campus TU</h2>
  <p>مجال تصميم وتطوير الويب 2026</p>
  <button id="btnClick">تفاعل معي 🚀</button>
</div>`,
    css: `body { font-family: 'Cairo', sans-serif; background: #F8FAFC; display:flex; justify-content:center; align-items:center; min-height:90vh; margin:0; }
.g-card { background:#FFFFFF; border:1px solid #E2E8F0; border-radius:24px; padding:28px; text-align:center; box-shadow: 0 10px 25px rgba(0,0,0,0.06); max-width:320px; }
.dots { display:flex; justify-content:center; gap:6px; margin-bottom:12px; }
.d { width:10px; height:10px; border-radius:50%; }
.d.b { background:#4285F4; } .d.r { background:#EA4335; } .d.y { background:#FBBC04; } .d.g { background:#34A853; }
h2 { margin:0 0 6px 0; color:#0F172A; }
p { color:#64748B; font-size:0.9rem; }
button { background:#1a73e8; color:#fff; border:none; padding:10px 20px; border-radius:9999px; font-weight:800; cursor:pointer; margin-top:14px; transition:0.2s; }
button:hover { transform:scale(1.05); }`,
    js: `document.getElementById('btnClick').addEventListener('click', () => {
  alert('مرحباً بك في مختبر الويب التفاعلي! 🎉');
  console.log('User clicked the interactive Google Card button!');
});`
  },
  kinetic_shapes: {
    html: `<div class="stage">
  <div class="circle"></div>
  <div class="square"></div>
</div>`,
    css: `body { background:#0F172A; display:flex; justify-content:center; align-items:center; min-height:90vh; margin:0; }
.stage { display:flex; gap:20px; }
.circle { width:60px; height:60px; border-radius:50%; background:#FBBC04; animation: bounce 1.2s infinite alternate; }
.square { width:60px; height:60px; border-radius:12px; background:#4285F4; animation: spin 3s infinite linear; }
@keyframes bounce { to { transform: translateY(-30px); } }
@keyframes spin { to { transform: rotate(360deg); } }`,
    js: `console.log('Kinetic animation loaded successfully!');`
  },
  js_counter: {
    html: `<div class="counter-box">
  <h1 id="count">0</h1>
  <button id="inc">+ زيادة</button>
  <button id="dec">- نقصان</button>
</div>`,
    css: `body { font-family:sans-serif; text-align:center; padding:40px; }
.counter-box { background:#E8F0FE; padding:30px; border-radius:20px; display:inline-block; }
button { padding:8px 16px; margin:4px; font-size:1rem; cursor:pointer; }`,
    js: `let c = 0;
document.getElementById('inc').onclick = () => { c++; document.getElementById('count').innerText = c; console.log('Count:', c); };
document.getElementById('dec').onclick = () => { c--; document.getElementById('count').innerText = c; console.log('Count:', c); };`
  }
};

function switchIdeTab(tab) {
  currentIdeTab = tab;
  ['html', 'css', 'js'].forEach(t => {
    const btn = document.getElementById(`tab${t.charAt(0).toUpperCase() + t.slice(1)}Btn`);
    const area = document.getElementById(`codeEditor${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) btn.classList.toggle('active', t === tab);
    if (area) area.style.display = t === tab ? 'block' : 'none';
  });
}

function loadCodeTemplate(key) {
  const tmpl = CODE_TEMPLATES[key] || CODE_TEMPLATES['google_card'];
  const edH = document.getElementById('codeEditorHtml');
  const edC = document.getElementById('codeEditorCss');
  const edJ = document.getElementById('codeEditorJs');
  if (edH) edH.value = tmpl.html;
  if (edC) edC.value = tmpl.css;
  if (edJ) edJ.value = tmpl.js;
  runLiveCode();
}

function runLiveCode() {
  const html = document.getElementById('codeEditorHtml')?.value || '';
  const css = document.getElementById('codeEditorCss')?.value || '';
  const js = document.getElementById('codeEditorJs')?.value || '';
  const iframe = document.getElementById('weblabPreviewIframe');
  const consoleEl = document.getElementById('weblabConsoleLog');

  if (!iframe) return;

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>
        window.onerror = function(msg) { parent.postMessage({ type: 'log', msg: 'Error: ' + msg }, '*'); };
        const origLog = console.log;
        console.log = function(...args) {
          origLog.apply(console, args);
          parent.postMessage({ type: 'log', msg: args.join(' ') }, '*');
        };
      </script>
      <script>${js}</script>
    </body>
    </html>
  `);
  doc.close();

  if (consoleEl) consoleEl.innerText = 'تم تحديث الكود بنجاح.';
}

window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'log') {
    const cEl = document.getElementById('weblabConsoleLog');
    if (cEl) cEl.innerText = e.data.msg;
  }
});

// -----------------------------------------------------------------------------
// 15. الألعاب التفاعلية (CSS Fixer & Bug Hunter)
// -----------------------------------------------------------------------------
function checkCssFixer(choice) {
  const target = document.getElementById('cssFixerTargetBox');
  const stage = document.getElementById('cssFixerStage');
  const feedback = document.getElementById('cssFixerFeedback');

  if (choice === 'correct') {
    if (stage) {
      stage.style.display = 'flex';
      stage.style.justifyContent = 'center';
      stage.style.alignItems = 'center';
    }
    if (feedback) {
      feedback.style.color = '#15803D';
      feedback.innerText = '✔ إجابة عبقرية! تم تمركز العنصر في المنتصف بدقة بفضل Flexbox (+50 نقطة ⭐)';
    }
    triggerCelebrationConfetti();
  } else {
    if (feedback) {
      feedback.style.color = '#DC2626';
      feedback.innerText = '❌ إجابة غير دقيقة؛ جربي الخيار B لتوسيط العنصر عمودياً وأفقياً.';
    }
  }
}

function checkBugHunter(lineNum) {
  const fb = document.getElementById('bugHunterFeedback');
  if (lineNum === 3) {
    if (fb) {
      fb.style.color = '#15803D';
      fb.innerText = '🎯 صيد ممتاز! الخطأ في السطر 3: استخدام (=) إسناد بدل (===) مقارنة منطقية (+50 نقطة ⭐)';
    }
    triggerCelebrationConfetti();
  } else {
    if (fb) {
      fb.style.color = '#DC2626';
      fb.innerText = `السطر ${lineNum} صحيح برمجياً؛ ركزي على الشرط داخل الـ if statement!`;
    }
  }
}

// -----------------------------------------------------------------------------
// 16. حفظ النبذة الشخصية للملف
// -----------------------------------------------------------------------------
function saveProfileBio() {
  const bio = document.getElementById('profBioInput')?.value.trim();
  if (bio) {
    alert('✔ تم حفظ نبذتك الشخصية بنجاح!');
  }
}

// -----------------------------------------------------------------------------
// 17. محرك الاحتفال والكونفيتي (Celebration Confetti Engine)
// -----------------------------------------------------------------------------
let confettiParticles = [];
let confettiCtx = null;

function initConfettiCanvas() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  confettiCtx = canvas.getContext('2d');
  resizeConfettiCanvas();
  window.addEventListener('resize', resizeConfettiCanvas);
}

function resizeConfettiCanvas() {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}

function triggerCelebrationConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas || !confettiCtx) return;

  const colors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853'];
  for (let i = 0; i < 90; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14 - 3,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015
    });
  }

  requestAnimationFrame(updateConfetti);
}

function updateConfetti() {
  if (!confettiCtx) return;
  const canvas = document.getElementById('confettiCanvas');
  confettiCtx.clearRect(0, 0, canvas.width, canvas.height);

  confettiParticles.forEach((p, idx) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25; // gravity
    p.alpha -= p.decay;

    confettiCtx.globalAlpha = Math.max(0, p.alpha);
    confettiCtx.fillStyle = p.color;
    confettiCtx.beginPath();
    confettiCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    confettiCtx.fill();

    if (p.alpha <= 0) {
      confettiParticles.splice(idx, 1);
    }
  });

  if (confettiParticles.length > 0) {
    requestAnimationFrame(updateConfetti);
  } else {
    confettiCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
