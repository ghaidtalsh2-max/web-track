const fs = require('fs');

const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>منصة مجال تصميم وتطوير الويب | GDG on Campus — جامعة الطائف</title>
  
  <!-- Arabic & English Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;600;700&family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600&family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="styles.css?v=chrome_exp_v4">
</head>
<body style="background-color: #FFFFFF;">

  <!-- Confetti Canvas for Celebrations -->
  <canvas id="confettiCanvas"></canvas>

  <!-- ==========================================================================
       1. شاشة البداية — تجربة Google Chrome التفاعلية (The Web Can Do What!?)
       ========================================================================== -->
  <div class="splash-stage-overlay" id="splashOverlay" style="background: radial-gradient(circle at 50% 30%, #1a73e8 0%, #174ea6 70%, #0d3880 100%) !important; color: #FFFFFF;">
    <!-- Top Bar Controls -->
    <div class="splash-top-bar" style="border-bottom: 1px solid rgba(255,255,255,0.15);">
      <button class="splash-skip-btn" onclick="transitionToAuth()" id="skipIntroBtn" title="تخطي المقدمة (مفتاح Esc)" style="background: rgba(255,255,255,0.18); color:#FFFFFF; border: 1px solid rgba(255,255,255,0.3);">
        <span>تخطي للمنصة مباشرة</span>
        <span class="skip-key-hint" style="background: rgba(0,0,0,0.25); color:#FFFFFF;">Esc ✕</span>
      </button>

      <div class="splash-top-identity" style="color: #FFFFFF;">
        <span class="g-dot b"></span>
        <span class="g-dot r"></span>
        <span class="g-dot y"></span>
        <span class="g-dot g"></span>
        <span style="font-weight: 800;">Google Developer Groups on Campus • جامعة الطائف</span>
      </div>
    </div>

    <!-- Floating Geometric Google Shapes & Connecting Lines -->
    <div class="kinetic-shapes-stage" id="kineticShapesStage" style="opacity: 0.85;">
      <div class="k-shape k-yellow-circle" style="background:#FBBC04; width:65px; height:65px; top:12%; left:12%;"></div>
      <div class="k-shape k-green-triangle" style="border-bottom-color:#34A853; top:20%; right:14%;"></div>
      <div class="k-shape k-blue-semicircle" style="background:#4285F4; width:80px; height:40px; bottom:18%; left:10%;"></div>
      <div class="k-shape k-red-ribbon" style="background:#EA4335; width:70px; height:24px; bottom:22%; right:12%;"></div>
      <div class="k-shape k-bracket-left" style="color: rgba(255,255,255,0.4); font-size:4rem; top:35%; left:6%;">&lt;</div>
      <div class="k-shape k-bracket-right" style="color: rgba(255,255,255,0.4); font-size:4rem; top:35%; right:6%;">&gt;</div>
    </div>

    <!-- Interactive Card Deck (The Web Can Be More Than A Landing Page) -->
    <div class="chrome-card-deck-wrapper" id="chromeCardDeck">
      <!-- Card 1 -->
      <div class="chrome-stack-card card-layer-1" id="chromeCard1">
        <div class="chrome-card-header">
          <div class="chrome-window-dots">
            <span class="c-dot r"></span>
            <span class="c-dot y"></span>
            <span class="c-dot g"></span>
          </div>
          <span class="chrome-card-badge">✨ The Web Can Do What!? • 2026</span>
        </div>
        <div class="chrome-card-body">
          <div class="chrome-card-art">
            <svg viewBox="0 0 140 100" fill="none" style="width:100%; height:100%;">
              <rect x="10" y="20" width="45" height="45" rx="12" fill="#FBBC04" transform="rotate(-8 10 20)"/>
              <circle cx="95" cy="45" r="28" fill="#34A853"/>
              <rect x="40" y="35" width="60" height="35" rx="8" fill="#4285F4" transform="rotate(6 40 35)"/>
              <rect x="25" y="65" width="80" height="18" rx="6" fill="#EA4335"/>
            </svg>
          </div>
          <h2 class="chrome-card-title">The Web Can Be More Than A Landing Page</h2>
          <p class="chrome-card-subtitle">الويب مساحة تصنعها بنفسك؛ حيث تتداخل الأشكال وتنبثق الأكواد لتتحول الأفكار إلى واقع رقمي حي.</p>
        </div>
        <div class="chrome-card-actions">
          <button type="button" class="btn-card-explore" onclick="transitionToAuth()">تخطي للدخول مباشرة</button>
          <button type="button" class="btn-card-next" onclick="nextChromeCard()">
            <span>البطاقة التالية</span>
            <span>➔</span>
          </button>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="chrome-stack-card card-layer-2" id="chromeCard2">
        <div class="chrome-card-header">
          <div class="chrome-window-dots">
            <span class="c-dot r"></span>
            <span class="c-dot y"></span>
            <span class="c-dot g"></span>
          </div>
          <span class="chrome-card-badge" style="background:#FEF3C7; color:#B45309;">🌟 مجتمع المطورين القوقليين</span>
        </div>
        <div class="chrome-card-body">
          <div class="chrome-card-art">
            <svg viewBox="0 0 140 100" fill="none" style="width:100%; height:100%;">
              <circle cx="45" cy="40" r="30" fill="#4285F4"/>
              <circle cx="95" cy="50" r="25" fill="#EA4335"/>
              <polygon points="70,15 85,55 55,55" fill="#FBBC04"/>
            </svg>
          </div>
          <h2 class="chrome-card-title">هنا مساحة لكل مبدع، شغوف، ومتحدٍ</h2>
          <p class="chrome-card-subtitle">رحلة تعليمية تفاعلية تعتمد على التطبيق العملي، والمهام الحقيقية، والعمل الجماعي بين أعضاء جامعة الطائف.</p>
        </div>
        <div class="chrome-card-actions">
          <button type="button" class="btn-card-explore" onclick="transitionToAuth()">تخطي للدخول</button>
          <button type="button" class="btn-card-next" onclick="nextChromeCard()">
            <span>البطاقة التالية</span>
            <span>➔</span>
          </button>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="chrome-stack-card card-layer-3" id="chromeCard3">
        <div class="chrome-card-header">
          <div class="chrome-window-dots">
            <span class="c-dot r"></span>
            <span class="c-dot y"></span>
            <span class="c-dot g"></span>
          </div>
          <span class="chrome-card-badge" style="background:#DCFCE7; color:#15803D;">🛡️ اعتماد رسمي وتفاعل حي</span>
        </div>
        <div class="chrome-card-body">
          <div class="chrome-card-art">
            <svg viewBox="0 0 140 100" fill="none" style="width:100%; height:100%;">
              <rect x="25" y="15" width="90" height="70" rx="16" fill="#34A853"/>
              <path d="M50 50 L65 65 L95 35" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="chrome-card-title">تفاعل حقيقي ونظام مكافآت مرن</h2>
          <p class="chrome-card-subtitle">سجل إنجازات يوثق تسليماتك، ومهاراتك المعتمدة، ومشاريعك المميزة بإشراف مباشر من قيادة المسار.</p>
        </div>
        <div class="chrome-card-actions">
          <button type="button" class="btn-card-explore" onclick="prevChromeCard()">رجوع للبطاقة السابقة</button>
          <button type="button" class="btn-card-next" onclick="transitionToAuth()" style="background:#34A853;">
            <span>انطلق نحو المنصة</span>
            <span>🚀</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ==========================================================================
       2. شاشة الدخول والتفعيل — Auth Overlay
       ========================================================================== -->
  <div class="auth-stage-overlay" id="authOverlay">
    <!-- Ambient Floating Shapes -->
    <div class="auth-geometric-backdrop">
      <div class="geo-shape shape-circle-yellow" style="top:8%; right:10%;"></div>
      <div class="geo-shape shape-semicircle-blue" style="bottom:12%; right:8%;"></div>
      <div class="geo-shape shape-triangle-green" style="bottom:10%; left:10%;"></div>
      <div class="geo-shape shape-ribbon-red" style="top:12%; left:8%;"></div>
    </div>

    <!-- Main Auth Experience Card -->
    <div class="auth-card-frame">
      <!-- Left Column: Vision & Identity -->
      <div class="auth-intro-column">
        <div class="auth-identity-header">
          <div class="gdg-logo-icon">
            <span class="bracket-l">&lt;</span>
            <span class="google-dots-pair">
              <span class="g-dot b"></span>
              <span class="g-dot r"></span>
              <span class="g-dot y"></span>
              <span class="g-dot g"></span>
            </span>
            <span class="bracket-r">&gt;</span>
          </div>
          <div class="auth-header-text">
            <h2>مجال تصميم وتطوير الويب</h2>
            <p>GDG on Campus • جامعة الطائف 2026</p>
          </div>
        </div>

        <div class="auth-manifesto-box">
          <h3>«بوابتك لتعلم وتطوير الويب عملياً»</h3>
          <p>
            منصة تجمع بين التعلم، والتطبيق، والتحديات، والمشاريع، والمكافآت. منصة مصممة خصيصاً لأعضاء المسار بإشراف القائدتين غيداء تركي الشريف وريتال القثامي.
          </p>

          <div class="security-badges-list">
            <div class="sec-pill">
              <span class="sec-icon">🔒</span>
              <span>دخول حصري ومحمي برمز الدعوة</span>
            </div>
            <div class="sec-pill">
              <span class="sec-icon">🛡️</span>
              <span>اعتماد رسمي للمستويات والمهارات</span>
            </div>
            <div class="sec-pill">
              <span class="sec-icon">✨</span>
              <span>مختبر أكواد ومشاريع معزول</span>
            </div>
          </div>

          <div style="margin-top:16px; display:flex; flex-direction:column; gap:8px;">
            <button type="button" class="btn-replay-splash-auth" onclick="replayCinematicIntro()" title="إعادة تشغيل تجربة Chrome التفاعلية">
              <span>↺ مشاهدة تجربة البداية (The Web Can Do What!?) مجدداً</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Form -->
      <div class="auth-form-column">
        <!-- Quick Demo Presets Helper -->
        <div class="quick-demo-fill-bar" style="flex-wrap: wrap;">
          <span style="font-size:0.78rem; font-weight:800; color:var(--text-muted); align-self:center;">تعبئة تجريبية سريعة:</span>
          <button type="button" class="quick-fill-btn active" id="btnPresetLeaderGhaidaa" onclick="autoFillAuth('leader_ghaidaa')">👑 غيداء الشريف (قائدة)</button>
          <button type="button" class="quick-fill-btn" id="btnPresetLeaderRetal" onclick="autoFillAuth('leader_retal')">👑 ريتال القثامي (قائدة)</button>
          <button type="button" class="quick-fill-btn" id="btnPresetSupervisorAtheer" onclick="autoFillAuth('supervisor_atheer')">🌟 أثير العتيبي (إشراف)</button>
          <button type="button" class="quick-fill-btn" id="btnPresetSupervisorAmer" onclick="autoFillAuth('supervisor_amer')">🌟 عامر الحارثي (إشراف)</button>
          <button type="button" class="quick-fill-btn" id="btnPresetStudentDana" onclick="autoFillAuth('student_dana')">🎓 دانه الشهري (متقدم)</button>
          <button type="button" class="quick-fill-btn" id="btnPresetStudentBushra" onclick="autoFillAuth('student_bushra')">🎓 بشرى العتيبي (متوسط)</button>
          <button type="button" class="quick-fill-btn" id="btnPresetStudentRimas" onclick="autoFillAuth('student_rimas')">🎓 ريماس الحارثي (مبتدئ)</button>
        </div>

        <!-- Auth Mode Tabs -->
        <div class="auth-tabs-nav">
          <button type="button" class="auth-tab-btn active" id="tabBtnActivate" onclick="switchAuthTab('activate')">
            تفعيل الحساب برمز الدعوة
          </button>
          <button type="button" class="auth-tab-btn" id="tabBtnLogin" onclick="switchAuthTab('login')">
            تسجيل الدخول الدائم
          </button>
        </div>

        <!-- Dynamic Error Banner -->
        <div class="auth-error-banner" id="authErrorBanner" style="display:none;">
          <span class="error-icon">⚠️</span>
          <div class="error-text">
            <strong>عفوًا، تعذر إتمام التفعيل:</strong>
            <p id="authErrorMessage">رمز الدعوة المدخل غير صالح أو تم استخدامه مسبقًا.</p>
          </div>
          <button type="button" class="error-close-btn" onclick="dismissAuthError()">✕</button>
        </div>

        <!-- Form 1: Account Activation -->
        <form id="formActivation" onsubmit="handleActivationSubmit(event)">
          <div class="form-field-group">
            <div class="field-label-row">
              <label class="field-label" for="inputInviteCode">رمز الدعوة السري (Invitation Code):</label>
              <span class="code-status-pill" id="inviteCodeStatusBadge">صيغة الرمز: GDG-TU-2026-XXXX</span>
            </div>
            <div class="input-with-icon">
              <input type="text" class="field-input code-input" id="inputInviteCode" placeholder="GDG-TU-2026-1003" required oninput="handleInviteCodeInput(this.value)">
              <span class="input-suffix-icon" id="codeValidIcon">🎟️</span>
            </div>
            <div class="field-hint">رمز أرسلته قيادة المسار صالح للاستخدام لمرة واحدة فقط لتفعيل حسابك.</div>
          </div>

          <div class="form-field-group">
            <label class="field-label" for="inputActivateEmail">اسم المستخدم أو البريد الإلكتروني:</label>
            <input type="text" class="field-input" id="inputActivateEmail" placeholder="Dana_A.web26" required>
          </div>

          <div class="form-field-group">
            <label class="field-label" for="inputActivatePassword">تعيين كلمة المرور:</label>
            <div class="input-with-icon">
              <input type="password" class="field-input" id="inputActivatePassword" placeholder="GDSoC-WebTrack173" required oninput="updatePasswordStrength(this.value)">
              <button type="button" class="btn-toggle-eye" onclick="togglePasswordVisibility('inputActivatePassword')">👁️</button>
            </div>
            <div class="password-meter-wrap">
              <div class="meter-bar">
                <span class="meter-segment" id="meterSeg1"></span>
                <span class="meter-segment" id="meterSeg2"></span>
                <span class="meter-segment" id="meterSeg3"></span>
              </div>
              <span class="meter-text-desc" id="passwordStrengthText">أدخلي كلمة مرور آمنة</span>
            </div>
          </div>

          <button type="submit" class="btn-primary-submit" id="btnSubmitActivation">
            <span class="submit-btn-text">تفعيل الحساب والانطلاق</span>
            <span class="submit-btn-arrow">←</span>
            <span class="btn-loading-dots" style="display:none;">⏳</span>
          </button>
        </form>

        <!-- Form 2: Regular Login -->
        <form id="formLogin" onsubmit="handleLoginSubmit(event)" style="display:none;">
          <div class="form-field-group">
            <label class="field-label" for="inputLoginEmail">اسم المستخدم (Username):</label>
            <div class="input-with-icon">
              <input type="text" class="field-input" id="inputLoginEmail" placeholder="Ghaidaa_Lead.web26 أو Dana_M.web26" required>
              <span class="input-suffix-icon">👤</span>
            </div>
            <div class="field-hint">للقادة: Ghaidaa_Lead.web26 | للأعضاء: Dana_M.web26 | للإشراف: Atheer_Super.web26</div>
          </div>

          <div class="form-field-group">
            <label class="field-label" for="inputLoginPassword">كلمة المرور (Password):</label>
            <div class="input-with-icon">
              <input type="password" class="field-input" id="inputLoginPassword" placeholder="••••••••••••" required>
              <button type="button" class="btn-toggle-eye" onclick="togglePasswordVisibility('inputLoginPassword')">👁️</button>
            </div>
          </div>

          <button type="submit" class="btn-primary-submit" id="btnSubmitLogin">
            <span class="submit-btn-text">تسجيل الدخول للمنصة</span>
            <span class="submit-btn-arrow">←</span>
            <span class="btn-loading-dots" style="display:none;">⏳</span>
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- ==========================================================================
       3. شاشة الترحيب المؤقتة — Personalized Welcome Interstitial
       ========================================================================== -->
  <div class="welcome-interstitial-stage" id="welcomeOverlay">
    <div class="welcome-center-card">
      <div class="welcome-avatar-holder">
        <span class="welcome-avatar-letter" id="welcomeAvatarChar">غ</span>
        <span class="welcome-status-dot"></span>
      </div>

      <div class="welcome-greeting-pill">
        <span class="g-dot b"></span>
        <span class="g-dot r"></span>
        <span class="g-dot y"></span>
        <span class="g-dot g"></span>
        <span id="welcomeGreetingRoleBadge">تم التوثيق والاعتماد</span>
      </div>

      <h1 class="welcome-personalized-name" id="welcomePersonalizedName">
        حي الله المطوّرة القوقلية، غيداء الشريف!
      </h1>
      
      <p class="welcome-inspiring-quote" id="welcomeInspiringQuote">
        «الويب ليس مجرد أسطر كود؛ بل مساحة تصنعين فيها أفكارك وتلهمين بها مجتمعك.»
      </p>

      <div class="welcome-progress-countdown">
        <div class="welcome-bar-fill" id="welcomeBarFill"></div>
      </div>

      <button class="btn-instant-enter" onclick="enterPlatformImmediately()">
        <span>الدخول للمنصة الآن</span>
        <span>←</span>
      </button>
    </div>
  </div>

  <!-- ==========================================================================
       4. بيئة المنصة الرئيسية — Full Platform Shell
       ========================================================================== -->
  <div class="platform-shell-container" id="platformShell">
    
    <!-- Top Navigation Header with Alec Tear Style Tabs -->
    <header class="main-navbar">
      <div class="nav-brand-group" onclick="showPlatformPage('home')">
        <div class="gdg-logo-icon">
          <span class="bracket-l">&lt;</span>
          <span class="google-dots-pair">
            <span class="g-dot b"></span>
            <span class="g-dot r"></span>
            <span class="g-dot y"></span>
            <span class="g-dot g"></span>
          </span>
          <span class="bracket-r">&gt;</span>
        </div>
        <div class="nav-brand-title">
          <h1>Google Developer Groups on Campus</h1>
          <p>جامعة الطائف • مجال تصميم وتطوير الويب</p>
        </div>
      </div>

      <!-- Creative Navigation Tabs (Alec Tear Inspired) -->
      <nav class="creative-tab-bar" id="mainNavBarTabs">
        <button class="creative-tab-btn active" data-tab="home" onclick="showPlatformPage('home')">
          <span>🏠 الرئيسية</span>
        </button>
        <button class="creative-tab-btn" data-tab="roadmap" onclick="showPlatformPage('roadmap')">
          <span>🗺️ رحلة التعلم</span>
        </button>
        <button class="creative-tab-btn" data-tab="challenges" onclick="showPlatformPage('challenges')">
          <span>🎯 المهام والتحديات</span>
        </button>
        <button class="creative-tab-btn" data-tab="activity" onclick="showPlatformPage('activity')">
          <span>⚡ نشاط الأعضاء</span>
        </button>
        <button class="creative-tab-btn" data-tab="playground" onclick="showPlatformPage('playground')">
          <span>🧪 مختبر الويب</span>
        </button>
        <button class="creative-tab-btn" data-tab="showcase" onclick="showPlatformPage('showcase')">
          <span>🎨 معرض الأعمال</span>
        </button>
        <button class="creative-tab-btn" data-tab="games" onclick="showPlatformPage('games')">
          <span>🎮 ألعاب الويب</span>
        </button>
        <button class="creative-tab-btn" data-tab="profile" onclick="showPlatformPage('profile')">
          <span>👤 ملفي الشخصي</span>
        </button>
        <button class="creative-tab-btn" id="navTabLeader" data-tab="leader" onclick="showPlatformPage('leader')" style="color:var(--g-blue); font-weight:900;">
          <span>🛡️ لوحة القادة</span>
        </button>
        <button class="creative-tab-btn" id="navTabSupervision" data-tab="supervision" onclick="showPlatformPage('supervision')" style="color:#EA4335; font-weight:900; display:none;">
          <span>👁️ لوحة الإشراف</span>
        </button>
      </nav>

      <!-- Right Controls -->
      <div class="nav-user-actions">
        <!-- Role Mode Switcher Pill -->
        <button class="role-switcher-toggle" id="adminTogglePill" onclick="togglePlatformAdmin()">
          <span>🛡️</span>
          <span id="roleTextDesc">لوحة القادة (Admin)</span>
        </button>

        <!-- Member Profile Badge -->
        <div class="user-profile-badge" onclick="showPlatformPage('profile')" title="عرض الملف الشخصي">
          <div class="avatar-circle-sm" id="navAvatarLetter">غ</div>
          <div style="text-align:right;">
            <div style="font-size:0.88rem; font-weight:800; color:var(--text-main);" id="navMemberName">غيداء تركي الشريف</div>
            <div style="font-size:0.72rem; color:var(--g-blue); font-weight:800;" id="navMemberStatus">قائدة ومؤسسة المسار 🛡️</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Viewport Container -->
    <main class="main-view-container">

      <!-- ====================================================================
           1. الصفحة الرئيسية (view-home)
           ==================================================================== -->
      <section class="app-page-view active" id="view-home">
        <!-- Hero Box with Dynamic Rotator -->
        <div class="hero-center-box" style="padding: 40px 24px; position:relative; overflow:hidden;">
          <div class="geo-shape shape-circle-yellow"></div>
          <div class="geo-shape shape-semicircle-blue"></div>
          <div class="geo-shape shape-triangle-green"></div>
          <div class="geo-shape shape-ribbon-red"></div>

          <div class="hero-welcome-badge">
            <span class="g-dot b"></span>
            <span class="g-dot r"></span>
            <span class="g-dot y"></span>
            <span class="g-dot g"></span>
            <span id="heroWelcomeBadgeText">مسار تصميم وتطوير الويب • GDG on Campus TU</span>
          </div>

          <h2 class="hero-bold-headline" id="heroMainHeading">
            أهلاً بكِ في مسار تصميم وتطوير الويب
          </h2>

          <!-- Dynamic Changing Words Widget -->
          <div class="dynamic-rotator-container">
            <span>هنا مساحة لكل</span>
            <span class="rotator-changing-word" id="rotatorChangingWord">مبدع 🚀</span>
          </div>

          <p class="hero-tagline-text">
            نجمع بين التعلم، والتطبيق، والتحديات، والفعاليات، والمكافآت في تجربة رقمية إبداعية تصنع منك مطور ويب متمكن.
          </p>

          <!-- 3 Distinct Progress Indicators (التفاعل، المبادرات، التحديات الأساسية) -->
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; max-width:860px; margin:28px auto 0 auto; text-align:right;">
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:18px; padding:18px; box-shadow:var(--shadow-sm); border-top:4px solid #4285F4;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.82rem; font-weight:800; color:#475569;">1. مؤشر التفاعل</span>
                <span style="font-size:1.2rem;">⚡</span>
              </div>
              <div style="font-size:1.8rem; font-weight:900; color:#0F172A; margin:6px 0;" id="kpiEngagementScore">92%</div>
              <p style="font-size:0.75rem; color:#64748B; margin:0;">يقيس مشاركتك في أنشطة المسار والتسليمات الأسبوعية.</p>
            </div>

            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:18px; padding:18px; box-shadow:var(--shadow-sm); border-top:4px solid #34A853;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.82rem; font-weight:800; color:#475569;">2. مساهمة المبادرات</span>
                <span style="font-size:1.2rem;">🤝</span>
              </div>
              <div style="font-size:1.8rem; font-weight:900; color:#0F172A; margin:6px 0;" id="kpiInitiativesCount">2 مبادرات</div>
              <p style="font-size:0.75rem; color:#64748B; margin:0;">المشاريع الإضافية والتعاون مع فرق المجالات الأخرى.</p>
            </div>

            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:18px; padding:18px; box-shadow:var(--shadow-sm); border-top:4px solid #FBBC04;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.82rem; font-weight:800; color:#475569;">3. التحديات الأساسية</span>
                <span style="font-size:1.2rem;">🏆</span>
              </div>
              <div style="font-size:1.8rem; font-weight:900; color:#0F172A; margin:6px 0;" id="kpiChallengesProgress">3 من 5 منجزة</div>
              <p style="font-size:0.75rem; color:#64748B; margin:0;">التحديات التخصصية الثلاثة + تحدي المجالات + المشروع الفصلي.</p>
            </div>
          </div>
        </div>

        <!-- قسم هذا الأسبوع (This Week Section) -->
        <div style="margin-top:40px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <div>
              <h3 style="font-size:1.5rem; font-weight:900; color:var(--text-main); margin:0;">📅 قسم «هذا الأسبوع» في المسار</h3>
              <p style="color:var(--text-secondary); font-size:0.9rem; margin:4px 0 0 0;">أهم الأنشطة، التحديات المفتوحة، والورش القادمة لهذا الأسبوع</p>
            </div>
            <span class="sec-pill" style="background:#E8F0FE; color:#1a73e8; border-color:#C2E7FF;">الأسبوع الثاني • نشط</span>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
            <!-- بطاقة التحدي النشط -->
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:22px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="background:#FEF3C7; color:#B45309; padding:4px 10px; border-radius:9999px; font-size:0.75rem; font-weight:800;">تحدي نشط الآن 🔥</span>
                <h4 style="font-size:1.15rem; font-weight:900; margin:10px 0 6px 0; color:#0F172A;">تحدي التنسيق المرن بـ Flexbox & Grid</h4>
                <p style="font-size:0.86rem; color:#475569; line-height:1.6; margin:0 0 14px 0;">
                  بناء شريط تنقل وبطاقات متجاوبة مع كافة الشاشات باستخدام تقنيات CSS الحديثة مع دعم الـ RTL.
                </p>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:12px;">
                <span style="font-size:0.82rem; font-weight:800; color:#34A853;">المكافأة: +100 نقطة ⭐</span>
                <button class="btn-card-outline" onclick="openChallengeSubmitModal('تحدي التنسيق المرن بـ Flexbox & Grid')">تسليم العمل 📤</button>
              </div>
            </div>

            <!-- بطاقة الورشة القادمة -->
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:22px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="background:#E0F2FE; color:#0369A1; padding:4px 10px; border-radius:9999px; font-size:0.75rem; font-weight:800;">ورشة عمل تدريبية 💻</span>
                <h4 style="font-size:1.15rem; font-weight:900; margin:10px 0 6px 0; color:#0F172A;">أسرار JavaScript الحديثة والـ DOM</h4>
                <p style="font-size:0.86rem; color:#475569; line-height:1.6; margin:0 0 14px 0;">
                  ورشة تفاعلية مباشرة مع قيادة المسار للتعامل مع الأحداث، وتحديث الصفحة ديناميكياً بدون إعادة التحميل.
                </p>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:12px;">
                <span style="font-size:0.82rem; color:#64748B;">الأربعاء القادم • 7:30 مساءً</span>
                <a href="#" class="btn-primary-google" style="padding:6px 14px; font-size:0.82rem; text-decoration:none;" onclick="alert('تم تأكيد حجز مقعدك بالورشة بنجاح! 🎉'); return false;">حجز مقعد 🎟️</a>
              </div>
            </div>

            <!-- بطاقة مشروع الأسبوع المميز -->
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:22px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="background:#DCFCE7; color:#15803D; padding:4px 10px; border-radius:9999px; font-size:0.75rem; font-weight:800;">مشروع الأسبوع المميز 🏆</span>
                <h4 style="font-size:1.15rem; font-weight:900; margin:10px 0 6px 0; color:#0F172A;">متصفح معالم الطائف السياحية</h4>
                <p style="font-size:0.86rem; color:#475569; line-height:1.6; margin:0 0 14px 0;">
                  تطبيق ويب تفاعلي من إنجاز المطور: <strong>فيصل خالد الغامدي</strong> بتنسيق جذاب وتأثيرات حركية.
                </p>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:12px;">
                <span style="font-size:0.82rem; color:#64748B;">معتمد رسمياً ⭐ 500 نقطة</span>
                <button class="btn-card-outline" onclick="showPlatformPage('showcase')">استعراض المشروع 🎨</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================================================================
           2. رحلة التعلم التفاعلية (view-roadmap)
           ==================================================================== -->
      <section class="app-page-view" id="view-roadmap">
        <div class="roadmap-visual-box">
          <div style="text-align:center; max-width:680px; margin:0 auto 24px auto;">
            <h2 style="font-size:2rem; font-weight:900; color:var(--text-main); margin-bottom:8px;">خريطة الرحلة التعليمية التفاعلية</h2>
            <p style="color:var(--text-secondary); font-size:1rem;">
              محطات تعليمية مترابطة بالعُقد؛ تنتقلين فيها من الأساسيات إلى بناء تطبيقات الويب المتكاملة.
            </p>
          </div>

          <div class="roadmap-nodes-row">
            <div class="node-station-item">
              <div class="node-bubble done">✔</div>
              <div class="node-title-text">1. أساسيات HTML5<br><span style="font-size:0.75rem; color:var(--g-green); font-weight:800;">مكتمل بنجاح</span></div>
            </div>

            <div class="node-station-item">
              <div class="node-bubble current">2</div>
              <div class="node-title-text">2. التنسيق المرن بـ CSS<br><span style="font-size:0.75rem; color:var(--g-blue); font-weight:800;">أنتِ هنا الآن</span></div>
            </div>

            <div class="node-station-item">
              <div class="node-bubble locked">🔒</div>
              <div class="node-title-text">3. جافاسكريبت والتفاعل<br><span style="font-size:0.75rem; color:var(--text-muted); font-weight:800;">المحطة القادمة</span></div>
            </div>

            <div class="node-station-item">
              <div class="node-bubble locked">🌐</div>
              <div class="node-title-text">4. تحدي المجالات المشترك<br><span style="font-size:0.75rem; color:var(--text-muted); font-weight:800;">تكامل المسارات</span></div>
            </div>

            <div class="node-station-item">
              <div class="node-bubble locked">🏆</div>
              <div class="node-title-text">5. المشروع الفصلي<br><span style="font-size:0.75rem; color:var(--text-muted); font-weight:800;">المشروع المتكامل</span></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================================================================
           3. المهام والتحديات والتسليمات (view-challenges)
           ==================================================================== -->
      <section class="app-page-view" id="view-challenges">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <div>
            <h2 style="font-size:1.8rem; font-weight:900; color:#0F172A; margin:0;">🎯 المهام والتحديات البرمجية المعتمدة</h2>
            <p style="color:#64748B; font-size:0.95rem; margin:6px 0 0 0;">أنجزي التحديات العملية وسلّمي أعمالك لتقييمها واعتماد نقاطك رسمياً من قادة المسار.</p>
          </div>
          <button class="btn-primary-google" onclick="openChallengeSubmitModal('تسليم تحدي عام')">تسليم مهمة جديدة 📤</button>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap:20px;" id="challengesListGrid">
          <!-- Challenge 1 -->
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:22px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span class="tech-tag-badge" style="background:#E8F0FE; color:#1a73e8;">تحدي تخصصي (1)</span>
                <span style="font-weight:900; color:#34A853;">+100 نقطة ⭐</span>
              </div>
              <h3 style="font-size:1.2rem; font-weight:900; margin:0 0 8px 0; color:#0F172A;">بناء صفحة هبوط دلالية بـ HTML5</h3>
              <p style="font-size:0.88rem; color:#475569; line-height:1.6; margin:0 0 14px 0;">
                تطبيق دلالات الويب (Semantic Elements) مثل header, nav, main, section مع تحسين محركات البحث SEO وسهولة الوصول Accessibility.
              </p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:14px;">
              <span style="font-size:0.8rem; color:#15803D; font-weight:800;">✔ معتمد ومكتمل</span>
              <button class="btn-card-outline" style="padding:6px 12px; font-size:0.82rem;" onclick="openChallengeSubmitModal('بناء صفحة هبوط دلالية بـ HTML5')">إعادة التسليم</button>
            </div>
          </div>

          <!-- Challenge 2 -->
          <div style="background:#FFFFFF; border:2px solid #1a73e8; border-radius:20px; padding:22px; box-shadow:var(--shadow-md); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span class="tech-tag-badge" style="background:#FEF3C7; color:#B45309;">تحدي تخصصي (2) • نشط الآن</span>
                <span style="font-weight:900; color:#34A853;">+100 نقطة ⭐</span>
              </div>
              <h3 style="font-size:1.2rem; font-weight:900; margin:0 0 8px 0; color:#0F172A;">التنسيق المرن بـ Modern CSS & Grid</h3>
              <p style="font-size:0.88rem; color:#475569; line-height:1.6; margin:0 0 14px 0;">
                بناء معرض صور وبطاقات متجاوبة تدعم العرض في الجوال واللابتوب مع تأثيرات حركية سلسة ودعم اتجاه RTL.
              </p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:14px;">
              <span style="font-size:0.8rem; color:#B45309; font-weight:800;">⏳ بانتظار التسليم</span>
              <button class="btn-primary-google" style="padding:6px 14px; font-size:0.82rem;" onclick="openChallengeSubmitModal('التنسيق المرن بـ Modern CSS & Grid')">تسليم الآن 📤</button>
            </div>
          </div>

          <!-- Challenge 3 -->
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:22px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span class="tech-tag-badge" style="background:#F1F5F9; color:#475569;">تحدي تخصصي (3)</span>
                <span style="font-weight:900; color:#34A853;">+100 نقطة ⭐</span>
              </div>
              <h3 style="font-size:1.2rem; font-weight:900; margin:0 0 8px 0; color:#0F172A;">تطبيق التفاعل وجلب البيانات بـ JS API</h3>
              <p style="font-size:0.88rem; color:#475569; line-height:1.6; margin:0 0 14px 0;">
                الاتصال بـ REST API خارجي، وجلب بيانات ديناميكية وعرضها مع معالجة حالات الخطأ والتحميل.
              </p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:14px;">
              <span style="font-size:0.8rem; color:#64748B;">🔒 يفتح بعد تسليم التحدي 2</span>
              <button class="btn-card-outline" style="padding:6px 12px; font-size:0.82rem;" disabled>مغلق حالياً</button>
            </div>
          </div>

          <!-- Challenge 4 -->
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:22px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span class="tech-tag-badge" style="background:#EDE9FE; color:#6D28D9;">تحدي المجالات (Cross-Domain)</span>
                <span style="font-weight:900; color:#34A853;">+150 نقطة 🌟</span>
              </div>
              <h3 style="font-size:1.2rem; font-weight:900; margin:0 0 8px 0; color:#0F172A;">التكامل بين الويب والذكاء الاصطناعي</h3>
              <p style="font-size:0.88rem; color:#475569; line-height:1.6; margin:0 0 14px 0;">
                ربط واجهة ويب بموديل ذكاء اصطناعي (Gemini API) لمعالجة النصوص أو الصور بالتعاون مع مسار الذكاء الاصطناعي.
              </p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:14px;">
              <span style="font-size:0.8rem; color:#64748B;">تحدي فصلي تعاوني</span>
              <button class="btn-card-outline" style="padding:6px 12px; font-size:0.82rem;" onclick="openChallengeSubmitModal('التكامل بين الويب والذكاء الاصطناعي')">تسليم العمل</button>
            </div>
          </div>

          <!-- Challenge 5 -->
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:22px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span class="tech-tag-badge" style="background:#FEF2F2; color:#DC2626;">المشروع الفصلي الختامي 🏆</span>
                <span style="font-weight:900; color:#34A853;">+300 نقطة 🎖️</span>
              </div>
              <h3 style="font-size:1.2rem; font-weight:900; margin:0 0 8px 0; color:#0F172A;">بناء منصة متكاملة وربطها بقاعدة بيانات</h3>
              <p style="font-size:0.88rem; color:#475569; line-height:1.6; margin:0 0 14px 0;">
                المشروع النهائي المتكامل الذي يبرز مهاراتك في الواجهة الأمامية، وقواعد البيانات، وتجربة المستخدم.
              </p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:14px;">
              <span style="font-size:0.8rem; color:#64748B;">المحطة الختامية للمسار</span>
              <button class="btn-card-outline" style="padding:6px 12px; font-size:0.82rem;" onclick="openChallengeSubmitModal('المشروع الفصلي الختامي')">تفاصيل المشروع</button>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================================================================
           4. نشاط وتفاعل الأعضاء — كلاسيرا ستايل (view-activity)
           ==================================================================== -->
      <section class="app-page-view" id="view-activity">
        <div style="margin-bottom:24px;">
          <h2 style="font-size:1.8rem; font-weight:900; color:#0F172A; margin:0;">⚡ مركز النشاط والتفاعل — نمط كلاسيرا</h2>
          <p style="color:#64748B; font-size:0.95rem; margin:6px 0 0 0;">نظام يوثق حضورك، وتسليماتك المعتمدة، ومهاراتك المكتسبة بنقاط حقيقية وسجل شفاف.</p>
        </div>

        <div class="activity-hero-row">
          <!-- Left: My Activity Stats -->
          <div class="activity-card-primary">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-size:0.82rem; font-weight:800; color:#64748B;">ملفي التفاعلي الحالي</span>
                <h3 style="font-size:1.4rem; font-weight:900; margin:4px 0; color:#0F172A;" id="activityMemberName">غيداء تركي الشريف</h3>
              </div>
              <span class="activity-streak-pill">🔥 12 يوم تفاعل مستمر</span>
            </div>

            <div class="activity-metrics-strip">
              <div class="activity-metric-box">
                <div class="m-num" style="color:#1a73e8;" id="actNumPoints">500</div>
                <div class="m-lbl">إجمالي النقاط</div>
              </div>
              <div class="activity-metric-box">
                <div class="m-num" style="color:#34A853;" id="actNumTasks">4</div>
                <div class="m-lbl">مهام معتمدة</div>
              </div>
              <div class="activity-metric-box">
                <div class="m-num" style="color:#FBBC04;" id="actNumSkills">6</div>
                <div class="m-lbl">مهارات موثقة</div>
              </div>
              <div class="activity-metric-box">
                <div class="m-num" style="color:#EA4335;" id="actNumWorkshops">3</div>
                <div class="m-lbl">ورش ومبادرات</div>
              </div>
            </div>

            <!-- Activity Progress Bar -->
            <div style="margin-top:24px;">
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:800; margin-bottom:8px;">
                <span>معدل النشاط هذا الأسبوع</span>
                <span style="color:#1a73e8;">94% • متميز جداً 🌟</span>
              </div>
              <div style="height:10px; background:#F1F5F9; border-radius:9999px; overflow:hidden;">
                <div style="width:94%; height:100%; background:linear-gradient(90deg, #1a73e8, #34A853); border-radius:9999px;"></div>
              </div>
            </div>
          </div>

          <!-- Right: Weekly Top Active Members -->
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:24px; padding:22px; box-shadow:var(--shadow-sm);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <h3 style="font-size:1.1rem; font-weight:900; margin:0; color:#0F172A;">🏆 الأكثر تفاعلاً هذا الأسبوع</h3>
              <span style="font-size:0.75rem; background:#F1F5F9; color:#64748B; padding:3px 8px; border-radius:9999px;">تحديث مباشر</span>
            </div>

            <div id="weeklyTopActiveList">
              <div class="classera-leader-item">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span class="classera-rank-badge top-1">1</span>
                  <div>
                    <div style="font-weight:800; font-size:0.88rem; color:#0F172A;">دانه عبدالله الشهري</div>
                    <div style="font-size:0.72rem; color:#64748B;">مسار متقدم • 4 تسليمات</div>
                  </div>
                </div>
                <span style="font-weight:900; color:#1a73e8; font-size:0.88rem;">680 نقطة</span>
              </div>

              <div class="classera-leader-item">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span class="classera-rank-badge top-2">2</span>
                  <div>
                    <div style="font-weight:800; font-size:0.88rem; color:#0F172A;">فيصل خالد الغامدي</div>
                    <div style="font-size:0.72rem; color:#64748B;">مسار متقدم • 3 تسليمات</div>
                  </div>
                </div>
                <span style="font-weight:900; color:#1a73e8; font-size:0.88rem;">620 نقطة</span>
              </div>

              <div class="classera-leader-item">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span class="classera-rank-badge top-3">3</span>
                  <div>
                    <div style="font-weight:800; font-size:0.88rem; color:#0F172A;">بشرى محمد العتيبي</div>
                    <div style="font-size:0.72rem; color:#64748B;">مسار متوسط • 3 تسليمات</div>
                  </div>
                </div>
                <span style="font-weight:900; color:#1a73e8; font-size:0.88rem;">560 نقطة</span>
              </div>

              <div class="classera-leader-item">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span class="classera-rank-badge top-other">4</span>
                  <div>
                    <div style="font-weight:800; font-size:0.88rem; color:#0F172A;">لانا سلطان الجعيد</div>
                    <div style="font-size:0.72rem; color:#64748B;">مسار متقدم • تسليمان</div>
                  </div>
                </div>
                <span style="font-weight:900; color:#1a73e8; font-size:0.88rem;">510 نقاط</span>
              </div>

              <div class="classera-leader-item">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span class="classera-rank-badge top-other">5</span>
                  <div>
                    <div style="font-weight:800; font-size:0.88rem; color:#0F172A;">دانه محسن الذبياني</div>
                    <div style="font-size:0.72rem; color:#64748B;">مسار متوسط • تسليمان</div>
                  </div>
                </div>
                <span style="font-weight:900; color:#1a73e8; font-size:0.88rem;">490 نقطة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================================================================
           5. مختبر الويب التفاعلي الحي (view-playground)
           ==================================================================== -->
      <section class="app-page-view" id="view-playground">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <div>
            <h2 style="font-size:1.8rem; font-weight:900; color:#0F172A; margin:0;">🧪 مختبر الويب الحي (Web Lab Sandbox)</h2>
            <p style="color:#64748B; font-size:0.95rem; margin:4px 0 0 0;">محرر أكواد متكامل لمعاينة وتجربة HTML وCSS وJavaScript في بيئة معزولة وآمنة.</p>
          </div>
          
          <div style="display:flex; gap:10px; align-items:center;">
            <select id="codeTemplateSelect" class="search-input" style="padding:8px 14px; font-size:0.85rem;" onchange="loadCodeTemplate(this.value)">
              <option value="google_card">قالب 1: بطاقة هوية قوقل التفاعلية</option>
              <option value="kinetic_shapes">قالب 2: أشكال هندسية متحركة بـ CSS</option>
              <option value="js_counter">قالب 3: عداد تفاعلي بـ JavaScript</option>
            </select>
            <button class="btn-primary-google" onclick="runLiveCode()" style="background:#34A853;">
              <span>تشغيل الكود 🚀</span>
            </button>
          </div>
        </div>

        <div class="weblab-split-layout">
          <!-- Editor Column -->
          <div class="weblab-editor-pane">
            <div class="weblab-tabs-header">
              <div style="display:flex; gap:6px;">
                <button class="ide-lang-btn active" id="tabHtmlBtn" onclick="switchIdeTab('html')">index.html</button>
                <button class="ide-lang-btn" id="tabCssBtn" onclick="switchIdeTab('css')">styles.css</button>
                <button class="ide-lang-btn" id="tabJsBtn" onclick="switchIdeTab('js')">main.js</button>
              </div>
              <span style="font-size:0.75rem; color:#94A3B8;">UTF-8 • RTL Friendly</span>
            </div>

            <textarea class="weblab-code-area" id="codeEditorHtml" spellcheck="false" placeholder="اكتب كود HTML هنا..."></textarea>
            <textarea class="weblab-code-area" id="codeEditorCss" spellcheck="false" placeholder="اكتب كود CSS هنا..." style="display:none;"></textarea>
            <textarea class="weblab-code-area" id="codeEditorJs" spellcheck="false" placeholder="اكتب كود JavaScript هنا..." style="display:none;"></textarea>
          </div>

          <!-- Live Preview Column -->
          <div class="weblab-preview-pane">
            <div class="weblab-preview-header">
              <span>المعاينة الحية (Live Sandboxed Output)</span>
              <button class="btn-card-outline" style="padding:2px 8px; font-size:0.75rem;" onclick="runLiveCode()">تحديث ↺</button>
            </div>
            <iframe class="weblab-iframe-box" id="weblabPreviewIframe" sandbox="allow-scripts allow-modals"></iframe>
            
            <!-- Console Drawer -->
            <div style="background:#0F172A; color:#94A3B8; padding:8px 14px; font-family:var(--font-code); font-size:0.78rem; border-top:1px solid #334155;">
              <span style="color:#38BDF8;">console.log: </span>
              <span id="weblabConsoleLog">جاهز للتنفيذ...</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================================================================
           6. معرض الأعمال والمشاريع المميزة (view-showcase)
           ==================================================================== -->
      <section class="app-page-view" id="view-showcase">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <div>
            <h2 style="font-size:1.8rem; font-weight:900; color:#0F172A; margin:0;">🎨 معرض أعمال ومشاريع مسار الويب</h2>
            <p style="color:#64748B; font-size:0.95rem; margin:6px 0 0 0;">مشاريع وتطبيقات حقيقية أنجزها أعضاء المسار مع روابط معاينة ومستودعات GitHub.</p>
          </div>
          <button class="btn-primary-google" onclick="alert('لإضافة مشروعك في المعرض، سلّم رابط المشروع في قسم التحديات ليتم اعتماده ونشره مباشرة!')">إضافة مشروع للمعرض 📤</button>
        </div>

        <div class="magazine-grid">
          <!-- Project 1 -->
          <div class="magazine-card">
            <div class="magazine-cover-art" style="background: linear-gradient(135deg, #4285F4 0%, #1a73e8 100%);">
              <span>🏔️</span>
              <span class="magazine-badge-pill">معتمد رسمياً ⭐</span>
            </div>
            <div style="padding:20px; display:flex; flex-direction:column; justify-content:space-between; flex:1;">
              <div>
                <h3 style="font-size:1.2rem; font-weight:900; margin:0 0 6px 0; color:#0F172A;">بوابة معالم الطائف السياحية</h3>
                <p style="font-size:0.86rem; color:#475569; line-height:1.6; margin:0 0 12px 0;">
                  دليل تفاعلي يستعرض أبرز الأماكن التراثية والطبيعية في الطائف مع خرائط ومعلومات طقس حية.
                </p>
                <div style="margin-bottom:14px;">
                  <span class="tech-tag-badge">HTML5</span>
                  <span class="tech-tag-badge">CSS Grid</span>
                  <span class="tech-tag-badge">Vanilla JS</span>
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:12px;">
                <span style="font-size:0.8rem; color:#64748B;">بواسطة: <strong>فيصل الغامدي</strong></span>
                <a href="#" class="btn-card-outline" style="padding:4px 10px; font-size:0.8rem; text-decoration:none;" onclick="alert('جاري فتح المعاينة الحية للمشروع...'); return false;">معاينة حية ↗</a>
              </div>
            </div>
          </div>

          <!-- Project 2 -->
          <div class="magazine-card">
            <div class="magazine-cover-art" style="background: linear-gradient(135deg, #EA4335 0%, #B91C1C 100%);">
              <span>🎓</span>
              <span class="magazine-badge-pill">معتمد رسمياً ⭐</span>
            </div>
            <div style="padding:20px; display:flex; flex-direction:column; justify-content:space-between; flex:1;">
              <div>
                <h3 style="font-size:1.2rem; font-weight:900; margin:0 0 6px 0; color:#0F172A;">حاسبة المعدل الجامعي الذكية</h3>
                <p style="font-size:0.86rem; color:#475569; line-height:1.6; margin:0 0 12px 0;">
                  تطبيق لحساب وتوقع المعدل الفصلي والتراكمي لطلبة جامعة الطائف مع إمكانية تصدير التقرير PDF.
                </p>
                <div style="margin-bottom:14px;">
                  <span class="tech-tag-badge">Modern JS</span>
                  <span class="tech-tag-badge">Flexbox</span>
                  <span class="tech-tag-badge">LocalStorage</span>
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:12px;">
                <span style="font-size:0.8rem; color:#64748B;">بواسطة: <strong>دانه الشهري</strong></span>
                <a href="#" class="btn-card-outline" style="padding:4px 10px; font-size:0.8rem; text-decoration:none;" onclick="alert('جاري فتح المعاينة الحية للمشروع...'); return false;">معاينة حية ↗</a>
              </div>
            </div>
          </div>

          <!-- Project 3 -->
          <div class="magazine-card">
            <div class="magazine-cover-art" style="background: linear-gradient(135deg, #34A853 0%, #15803D 100%);">
              <span>🌿</span>
              <span class="magazine-badge-pill">معتمد رسمياً ⭐</span>
            </div>
            <div style="padding:20px; display:flex; flex-direction:column; justify-content:space-between; flex:1;">
              <div>
                <h3 style="font-size:1.2rem; font-weight:900; margin:0 0 6px 0; color:#0F172A;">منصة نباتات الطائف العطرية</h3>
                <p style="font-size:0.86rem; color:#475569; line-height:1.6; margin:0 0 12px 0;">
                  متجر استعراضي لمزارع الورد الطائفي والنباتات العطرية بتصميم بصري ناعم يدعم الوضع الليلي.
                </p>
                <div style="margin-bottom:14px;">
                  <span class="tech-tag-badge">CSS Animations</span>
                  <span class="tech-tag-badge">Dark Mode</span>
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:12px;">
                <span style="font-size:0.8rem; color:#64748B;">بواسطة: <strong>بشرى العتيبي</strong></span>
                <a href="#" class="btn-card-outline" style="padding:4px 10px; font-size:0.8rem; text-decoration:none;" onclick="alert('جاري فتح المعاينة الحية للمشروع...'); return false;">معاينة حية ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================================================================
           7. الألعاب والتجارب التفاعلية (view-games)
           ==================================================================== -->
      <section class="app-page-view" id="view-games">
        <div style="margin-bottom:24px;">
          <h2 style="font-size:1.8rem; font-weight:900; color:#0F172A; margin:0;">🎮 ألعاب وتجارب الويب التعليمية التفاعلية</h2>
          <p style="color:#64748B; font-size:0.95rem; margin:6px 0 0 0;">تجارب برمجية مصقولة لاختبار مهارتك في التنسيق وصيد الأخطاء البرمجية بطريقة ممتعة ومحفزة.</p>
        </div>

        <div class="games-layout-grid">
          <!-- Game 1: CSS Layout Fixer -->
          <div class="game-console-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="background:#E8F0FE; color:#1a73e8; padding:3px 10px; border-radius:9999px; font-size:0.75rem; font-weight:800;">لعبة تفاعلية 1</span>
                <h3 style="font-size:1.25rem; font-weight:900; margin:6px 0 0 0; color:#0F172A;">تحدي مصلح الواجهات (CSS Fixer)</h3>
              </div>
              <span style="font-size:1.8rem;">🎨</span>
            </div>

            <p style="font-size:0.86rem; color:#475569; margin:10px 0 0 0;">
              المهمة: العنصر الأصفر يجب أن يتمركز في منتصف الحاوية تماماً عمودياً وأفقياً! اختاري الخاصية الصحيحة:
            </p>

            <div class="game-stage-screen" id="cssFixerStage">
              <div id="cssFixerTargetBox" style="width:60px; height:60px; background:#FBBC04; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#854D0E;">
                مركزني!
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn-card-outline" style="text-align:right; font-family:var(--font-code);" onclick="checkCssFixer('wrong1')">
                A) display: block; margin: 0;
              </button>
              <button class="btn-card-outline" style="text-align:right; font-family:var(--font-code);" onclick="checkCssFixer('correct')">
                B) display: flex; justify-content: center; align-items: center;
              </button>
              <button class="btn-card-outline" style="text-align:right; font-family:var(--font-code);" onclick="checkCssFixer('wrong2')">
                C) position: absolute; top: 0; left: 0;
              </button>
            </div>

            <div id="cssFixerFeedback" style="margin-top:12px; font-size:0.88rem; font-weight:800; text-align:center;"></div>
          </div>

          <!-- Game 2: Bug Hunter -->
          <div class="game-console-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="background:#FEF2F2; color:#DC2626; padding:3px 10px; border-radius:9999px; font-size:0.75rem; font-weight:800;">لعبة تفاعلية 2</span>
                <h3 style="font-size:1.25rem; font-weight:900; margin:6px 0 0 0; color:#0F172A;">صائد الأخطاء البرمجية (Bug Hunter)</h3>
              </div>
              <span style="font-size:1.8rem;">🐛</span>
            </div>

            <p style="font-size:0.86rem; color:#475569; margin:10px 0 0 0;">
              المهمة: الكود التالي يحتوي على خطأ منطقي يمنع تنفيذ الشرط بصورة صحيحة. حددي السطر الذي يحتوي على الخطأ:
            </p>

            <div style="background:#1E293B; color:#F8FAFC; border-radius:14px; padding:16px; font-family:var(--font-code); font-size:0.88rem; margin:16px 0; direction:ltr; text-align:left;">
              <div style="padding:4px; cursor:pointer;" onclick="checkBugHunter(1)" id="bugLine1">1: const userRole = 'track_leader';</div>
              <div style="padding:4px; cursor:pointer;" onclick="checkBugHunter(2)" id="bugLine2">2: let isAuthorized = false;</div>
              <div style="padding:4px; cursor:pointer; background:rgba(234,67,53,0.15);" onclick="checkBugHunter(3)" id="bugLine3">3: if (userRole = 'track_leader') {</div>
              <div style="padding:4px; cursor:pointer;" onclick="checkBugHunter(4)" id="bugLine4">4:   isAuthorized = true;</div>
              <div style="padding:4px; cursor:pointer;" onclick="checkBugHunter(5)" id="bugLine5">5: }</div>
            </div>

            <div id="bugHunterFeedback" style="font-size:0.88rem; font-weight:800; text-align:center; min-height:24px;">
              اضغطي على السطر الذي يحتوي على الخطأ لاكتشافه!
            </div>
          </div>
        </div>
      </section>

      <!-- ====================================================================
           8. الملف الشخصي للعضو (view-profile)
           ==================================================================== -->
      <section class="app-page-view" id="view-profile">
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:24px; padding:32px; box-shadow:var(--shadow-sm); margin-bottom:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <div style="display:flex; align-items:center; gap:20px;">
              <div class="avatar-circle-sm" style="width:72px; height:72px; font-size:1.8rem;" id="profAvatarChar">غ</div>
              <div>
                <h2 style="font-size:1.8rem; font-weight:900; color:#0F172A; margin:0;" id="profFullName">غيداء تركي الشريف</h2>
                <div style="font-size:0.9rem; color:#64748B; margin-top:4px;" id="profMetaDesc">علوم حاسب • السنة الثالثة • قائدة مسار الويب</div>
              </div>
            </div>
            <div>
              <span class="role-badge-pill" id="profLevelBadge" style="font-size:0.92rem; padding:8px 18px;">مسار متقدم • معتمد رسمي 🛡️</span>
            </div>
          </div>

          <!-- Bio Section -->
          <div style="margin-top:24px; padding-top:20px; border-top:1px solid #F1F5F9;">
            <h4 style="font-size:1rem; font-weight:800; color:#0F172A; margin:0 0 8px 0;">النبذة الشخصية (Bio):</h4>
            <textarea id="profBioInput" class="search-input" style="width:100%; height:80px; padding:12px; font-size:0.9rem;" placeholder="اكتب نبذة شخصية عنك وعن اهتماماتك في تطوير الويب..."></textarea>
            <div style="text-align:left; margin-top:8px;">
              <button class="btn-card-outline" style="padding:4px 14px; font-size:0.8rem;" onclick="saveProfileBio()">حفظ النبذة الشخصية ✔</button>
            </div>
          </div>

          <!-- Skills Comparison Grid: Self-Reported vs Verified by Leaders -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:24px;">
            <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:18px; padding:18px;">
              <h4 style="font-size:0.92rem; font-weight:900; color:#475569; margin:0 0 10px 0;">المهارات التي صرح بها العضو (Self-Reported):</h4>
              <div id="profSelfSkillsList">
                <span class="tech-tag-badge">HTML5</span>
                <span class="tech-tag-badge">CSS3</span>
                <span class="tech-tag-badge">JavaScript</span>
                <span class="tech-tag-badge">Python</span>
                <span class="tech-tag-badge">GitHub</span>
              </div>
            </div>

            <div style="background:#F0FDF4; border:1px solid #DCFCE7; border-radius:18px; padding:18px;">
              <h4 style="font-size:0.92rem; font-weight:900; color:#15803D; margin:0 0 10px 0;">المهارات المعتمدة رسمياً من القيادة (Verified 🛡️):</h4>
              <div id="profVerifiedSkillsList">
                <span class="tech-tag-badge" style="background:#DCFCE7; color:#166534; font-weight:800;">دلالات HTML5 ✔</span>
                <span class="tech-tag-badge" style="background:#DCFCE7; color:#166534; font-weight:800;">التنسيق المرن بـ CSS ✔</span>
                <span class="tech-tag-badge" style="background:#DCFCE7; color:#166534; font-weight:800;">أساسيات جافاسكريبت ✔</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================================================================
           9. لوحة القادة الشاملة (view-leader — For Ghaidaa & Retal)
           ==================================================================== -->
      <section class="app-page-view" id="view-leader">
        <!-- Leaders Banner -->
        <div class="leader-banner-card" style="margin-bottom:24px;">
          <div class="leader-banner-content">
            <span class="role-badge-pill" style="background:rgba(255,255,255,0.22); color:#FFFFFF; border:1px solid rgba(255,255,255,0.4);">
              👑 لوحة تحكم وإدارة مسار الويب 2026
            </span>
            <h2 style="font-size:2rem; font-weight:900; margin:12px 0 6px 0;">
              لوحة قيادة المسار — غيداء الشريف & ريتال القثامي
            </h2>
            <p style="font-size:0.95rem; opacity:0.95; max-width:680px; margin:0; line-height:1.6;">
              صلاحيات كاملة لإدارة الأعضاء، ومراجعة التسليمات، وتوليد وتوزيع رموز التفعيل، وإنشاء ومنح المكافآت المرنة.
            </p>
          </div>
          <button class="btn-primary-google" style="background:#FFFFFF; color:#1a73e8; font-weight:900;" onclick="openExportTokensModal()">
            <span>تصدير رموز الدعوة (WhatsApp)</span>
            <span>📋</span>
          </button>
        </div>

        <!-- Leader Sub-Tabs Navigation -->
        <div class="rewards-subtab-strip">
          <button class="quick-fill-btn active" id="lSubTabMembers" onclick="switchLeaderSubTab('members')">
            👥 إدارة الأعضاء الـ 30 (أبجدي أ-ي)
          </button>
          <button class="quick-fill-btn" id="lSubTabReviews" onclick="switchLeaderSubTab('reviews')">
            📥 مراجعة التسليمات والتقييم
          </button>
          <button class="quick-fill-btn" id="lSubTabRewards" onclick="switchLeaderSubTab('rewards')">
            🎁 إدارة المكافآت المرنة
          </button>
          <button class="quick-fill-btn" id="lSubTabAudit" onclick="switchLeaderSubTab('audit')">
            📜 سجل العمليات الإدارية (Audit Log)
          </button>
        </div>

        <!-- Leader Sub-View 1: Members Table -->
        <div id="lSubViewMembers">
          <!-- Search & Filter Toolbar -->
          <div class="leader-controls-toolbar" style="margin-bottom:20px;">
            <div class="search-box-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" class="search-input" id="memberSearchInput" placeholder="البحث بالاسم أو اسم المستخدم أو رقم الجوال..." oninput="handleMemberSearch(this.value)">
            </div>

            <div class="level-filter-chips">
              <button class="filter-chip-btn active" onclick="setMemberFilter('all', this)">جميع الأعضاء (30)</button>
              <button class="filter-chip-btn" onclick="setMemberFilter('advanced', this)">متقدم (5)</button>
              <button class="filter-chip-btn" onclick="setMemberFilter('intermediate', this)">متوسط (20)</button>
              <button class="filter-chip-btn" onclick="setMemberFilter('beginner', this)">مبتدئ (5)</button>
            </div>

            <div style="display:flex; gap:8px;">
              <button class="btn-card-outline" onclick="sortMembersAlphabetically()">
                <span>ترتيب أبجدي (أ - ي)</span>
                <span>🔤</span>
              </button>
              <button class="btn-primary-google" style="padding:6px 14px; font-size:0.85rem;" onclick="approveAllPending()">
                <span>اعتماد الكل دفعة واحدة</span>
                <span>✔</span>
              </button>
            </div>
          </div>

          <!-- Table Container -->
          <div class="members-table-container">
            <table class="members-data-table">
              <thead>
                <tr>
                  <th style="width:40px;">#</th>
                  <th>الاسم الكامل والبيانات الأكاديمية</th>
                  <th>اسم المستخدم (Username)</th>
                  <th>المستوى المعتمد</th>
                  <th>رمز التفعيل (Invite Token)</th>
                  <th>الحالة والإجراءات</th>
                </tr>
              </thead>
              <tbody id="membersTableBody">
                <!-- Dynamically rendered with default Arabic alphabetical order -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Leader Sub-View 2: Submissions Reviews -->
        <div id="lSubViewReviews" style="display:none;">
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:24px;">
            <h3 style="font-size:1.3rem; font-weight:900; color:#0F172A; margin:0 0 16px 0;">تسليمات التحديات بانتظار المراجعة والاعتماد</h3>
            
            <div style="display:flex; flex-direction:column; gap:14px;" id="submissionsReviewList">
              <!-- Submission 1 -->
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:16px; padding:18px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-weight:900; color:#0F172A; font-size:1.05rem;">فيصل خالد الغامدي</span>
                    <span class="tech-tag-badge" style="background:#E8F0FE; color:#1a73e8;">تحدي التنسيق بـ Modern CSS</span>
                  </div>
                  <div style="font-size:0.84rem; color:#64748B; margin-top:4px;">
                    رابط المستودع: <a href="https://github.com/faisal/taif-showcase" target="_blank" style="color:#1a73e8;">github.com/faisal/taif-showcase</a>
                  </div>
                </div>
                <div style="display:flex; gap:8px;">
                  <button class="btn-primary-google" style="background:#34A853; padding:6px 14px; font-size:0.85rem;" onclick="approveSubmission('فيصل خالد الغامدي', 100)">
                    اعتماد (+100 نقطة) ✔
                  </button>
                  <button class="btn-card-outline" style="padding:6px 12px; font-size:0.85rem;" onclick="requestRevision('فيصل خالد الغامدي')">
                    طلب تعديلات 💬
                  </button>
                </div>
              </div>

              <!-- Submission 2 -->
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:16px; padding:18px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-weight:900; color:#0F172A; font-size:1.05rem;">بشرى محمد العتيبي</span>
                    <span class="tech-tag-badge" style="background:#FEF3C7; color:#B45309;">تحدي بناء صفحة هبوط HTML5</span>
                  </div>
                  <div style="font-size:0.84rem; color:#64748B; margin-top:4px;">
                    رابط المعاينة: <a href="https://bushra.dev/landing" target="_blank" style="color:#1a73e8;">bushra.dev/landing</a>
                  </div>
                </div>
                <div style="display:flex; gap:8px;">
                  <button class="btn-primary-google" style="background:#34A853; padding:6px 14px; font-size:0.85rem;" onclick="approveSubmission('بشرى محمد العتيبي', 100)">
                    اعتماد (+100 نقطة) ✔
                  </button>
                  <button class="btn-card-outline" style="padding:6px 12px; font-size:0.85rem;" onclick="requestRevision('بشرى محمد العتيبي')">
                    طلب تعديلات 💬
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Leader Sub-View 3: Flexible Rewards Management -->
        <div id="lSubViewRewards" style="display:none;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <!-- Left: Create New Reward Definition -->
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:22px;">
              <h3 style="font-size:1.2rem; font-weight:900; color:#0F172A; margin:0 0 16px 0;">✨ إنشاء تعريف مكافأة جديدة (On-The-Fly)</h3>
              
              <div class="form-field-group">
                <label class="field-label" for="newRewardName">اسم المكافأة:</label>
                <input type="text" class="field-input" id="newRewardName" placeholder="مثال: مكافأة التحدي المفاجئ">
              </div>

              <div class="form-field-group">
                <label class="field-label" for="newRewardType">نوع المكافأة:</label>
                <select class="field-input" id="newRewardType">
                  <option value="points">نقاط إضافية (+Points)</option>
                  <option value="badge">شارة أو لقب فخري (Badge)</option>
                  <option value="privilege">امتياز أو هدية خاصة (Privilege)</option>
                  <option value="custom">مكافأة مخصصة (Custom)</option>
                </select>
              </div>

              <div class="form-field-group">
                <label class="field-label" for="newRewardValue">القيمة أو الوصف:</label>
                <input type="text" class="field-input" id="newRewardValue" placeholder="مثال: 100 نقطة أو لقب مطوّر الأسبوع">
              </div>

              <div class="form-field-group">
                <label class="field-label" for="newRewardReason">سبب المنح / الملاحظات:</label>
                <input type="text" class="field-input" id="newRewardReason" placeholder="مثال: التميز في تسليم كود نظيف وتطبيقي">
              </div>

              <button class="btn-primary-google" style="width:100%;" onclick="createNewRewardDefinition()">
                حفظ تعريف المكافأة 💾
              </button>
            </div>

            <!-- Right: Grant Reward to Selected Members -->
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:22px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <h3 style="font-size:1.2rem; font-weight:900; color:#0F172A; margin:0 0 12px 0;">🎯 منح المكافأة للأعضاء المحددين</h3>
                
                <div class="form-field-group">
                  <label class="field-label">اختاري المكافأة المراد منحها:</label>
                  <select class="field-input" id="grantSelectReward">
                    <option value="rew-1">مكافأة التحدي المفاجئ (+100 نقطة)</option>
                    <option value="rew-2">شارة التميز في جافاسكريبت (لقب وشارة)</option>
                    <option value="rew-3">أسبقية حجز الورش التخصصية (امتياز)</option>
                  </select>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin:14px 0 8px 0;">
                  <span style="font-size:0.85rem; font-weight:800; color:#475569;">اختيار المستفيدين (مرتبين أبجدياً أ-ي):</span>
                  <button type="button" class="btn-card-outline" style="padding:2px 8px; font-size:0.75rem;" onclick="selectAllRewardMembers()">تحديد الكل</button>
                </div>

                <!-- Scrollable Multi-select list -->
                <div style="max-height:200px; overflow-y:auto; border:1px solid #E2E8F0; border-radius:12px; padding:10px;" id="rewardsMemberCheckboxList">
                  <!-- Rendered dynamically alphabetically -->
                </div>
              </div>

              <button class="btn-primary-google" style="background:#34A853; width:100%; margin-top:16px;" onclick="grantRewardToSelected()">
                تنفيذ المنح وحفظ في سجل التدقيق 🎁
              </button>
            </div>
          </div>
        </div>

        <!-- Leader Sub-View 4: Audit Trail -->
        <div id="lSubViewAudit" style="display:none;">
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-size:1.3rem; font-weight:900; color:#0F172A; margin:0;">سجل العمليات الإدارية وتدقيق النقاط (Audit Trail)</h3>
              <span class="sec-pill" style="font-size:0.75rem;">عمليات مسجلة وموثقة ضد التكرار</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px;" id="leaderAuditLogContainer">
              <!-- Audit logs dynamically populated -->
            </div>
          </div>
        </div>
      </section>

      <!-- ====================================================================
           10. لوحة الإشراف والمتابعة — Dedicated for Atheer & Amer (view-supervision)
           ==================================================================== -->
      <section class="app-page-view" id="view-supervision">
        <!-- Supervisor Executive Banner -->
        <div class="supervision-banner">
          <div>
            <div class="supervision-read-only-pill">
              <span>👁️ لوحة إشراف المجالات • صلاحية متابعة وتقارير</span>
            </div>
            <h2 style="font-size:1.9rem; font-weight:900; margin:12px 0 6px 0;">
              بوابة إشراف المجالات — أثير العتيبي & عامر الحارثي
            </h2>
            <p style="font-size:0.95rem; opacity:0.9; margin:0; line-height:1.6; max-width:680px;">
              شاشة موحدة لمتابعة مؤشرات أداء مسار الويب، وتوزيع المستويات، ومعدل إنجاز المهام دون التدخل في الإدارة التشغيلية اليومية.
            </p>
          </div>
          <button class="btn-card-outline" style="color:#FFFFFF; border-color:rgba(255,255,255,0.4);" onclick="alert('جاري تصدير التقرير الشامل لمسار الويب بصيغة PDF...')">
            تحميل تقرير المسار 📊
          </button>
        </div>

        <!-- KPI Grid -->
        <div class="supervision-kpi-row">
          <div class="supervision-kpi-card" style="border-right:4px solid #4285F4;">
            <div style="font-size:0.8rem; color:#64748B; font-weight:800;">إجمالي أعضاء المسار</div>
            <div class="val" style="color:#4285F4;">30</div>
            <div style="font-size:0.75rem; color:#15803D; font-weight:700;">100% نسبة الالتزام والتفعيل</div>
          </div>

          <div class="supervision-kpi-card" style="border-right:4px solid #34A853;">
            <div style="font-size:0.8rem; color:#64748B; font-weight:800;">إجمالي النقاط المكتسبة</div>
            <div class="val" style="color:#34A853;">4,850</div>
            <div style="font-size:0.75rem; color:#64748B;">موزعة على التحديات والمهارات</div>
          </div>

          <div class="supervision-kpi-card" style="border-right:4px solid #FBBC04;">
            <div style="font-size:0.8rem; color:#64748B; font-weight:800;">نسبة تسليم التحديات</div>
            <div class="val" style="color:#D97706;">86%</div>
            <div style="font-size:0.75rem; color:#15803D; font-weight:700;">أعلى من المستهدف الفصلي</div>
          </div>

          <div class="supervision-kpi-card" style="border-right:4px solid #EA4335;">
            <div style="font-size:0.8rem; color:#64748B; font-weight:800;">قيادة المسار</div>
            <div class="val" style="font-size:1.3rem; margin:12px 0; color:#0F172A;">غيداء & ريتال</div>
            <div style="font-size:0.75rem; color:#64748B;">إدارة تشغيلية مستقلة 🛡️</div>
          </div>
        </div>

        <!-- Level Distribution Chart & Insights -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:22px;">
            <h3 style="font-size:1.15rem; font-weight:900; color:#0F172A; margin:0 0 16px 0;">توزيع مستويات أعضاء مسار الويب</h3>
            
            <div style="margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between; font-size:0.84rem; font-weight:800; margin-bottom:4px;">
                <span>المستوى المتقدم (Advanced)</span>
                <span style="color:#8B5CF6;">5 أعضاء (16.7%)</span>
              </div>
              <div style="height:8px; background:#F1F5F9; border-radius:9999px; overflow:hidden;">
                <div style="width:16.7%; height:100%; background:#8B5CF6;"></div>
              </div>
            </div>

            <div style="margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between; font-size:0.84rem; font-weight:800; margin-bottom:4px;">
                <span>المستوى المتوسط (Intermediate)</span>
                <span style="color:#1a73e8;">20 عضواً (66.6%)</span>
              </div>
              <div style="height:8px; background:#F1F5F9; border-radius:9999px; overflow:hidden;">
                <div style="width:66.6%; height:100%; background:#1a73e8;"></div>
              </div>
            </div>

            <div style="margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between; font-size:0.84rem; font-weight:800; margin-bottom:4px;">
                <span>المستوى المبتدئ (Beginner)</span>
                <span style="color:#34A853;">5 أعضاء (16.7%)</span>
              </div>
              <div style="height:8px; background:#F1F5F9; border-radius:9999px; overflow:hidden;">
                <div style="width:16.7%; height:100%; background:#34A853;"></div>
              </div>
            </div>
          </div>

          <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:20px; padding:22px;">
            <h3 style="font-size:1.15rem; font-weight:900; color:#0F172A; margin:0 0 16px 0;">تقييم المسار العام (Track Health)</h3>
            <ul style="padding-right:20px; margin:0; line-height:2; font-size:0.9rem; color:#475569;">
              <li>كافة الأعضاء الـ 30 تم استيراد استبياناتهم واعتماد مستوياتهم بدون أي تكرار.</li>
              <li>تم فصل حسابات الإشراف (أثير وعامر) عن حسابات القيادة (غيداء وريتال) بنجاح.</li>
              <li>نظام التفاعل يحسب تلقائياً من الأحداث المعتمدة ويمنع تكرار النقاط.</li>
              <li>المسار جاهز للمرحلة القادمة وتحدي المجالات المشترك.</li>
            </ul>
          </div>
        </div>
      </section>

    </main>
  </div>

  <!-- ==========================================================================
       Modals: Export Tokens & Challenge Submission & Survey Details
       ========================================================================== -->

  <!-- Modal 1: Export Tokens Dialog -->
  <div class="celebration-modal-backdrop" id="exportTokensModalBackdrop">
    <div class="celebration-card-dialog export-modal-dialog">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3 style="font-size:1.3rem; font-weight:900; color:var(--text-main); margin:0;">
          📲 تصدير بيانات الدخول ورموز التفعيل للأعضاء
        </h3>
        <button class="btn-card-outline" style="padding:4px 10px; font-size:0.8rem;" onclick="closeExportTokensModal()">✕</button>
      </div>
      <p style="font-size:0.88rem; color:var(--text-secondary); margin:0 0 14px 0;">
        رسالة مجهزة بالكامل ومطابقة للمعايير المعتمدة، جاهزة للنسخ والإرسال في قروب الواتساب أو التيليجرام للأعضاء.
      </p>

      <textarea id="exportTokensTextarea" readonly></textarea>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
        <span id="copyTokensSuccessMsg" style="font-size:0.85rem; font-weight:800; color:var(--g-green);"></span>
        <div style="display:flex; gap:8px;">
          <button class="btn-card-outline" onclick="closeExportTokensModal()">إغلاق</button>
          <button class="btn-primary-google" onclick="copyAllTokensToClipboard()">
            <span>نسخ كافة البيانات للحافظة</span>
            <span>📋</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal 2: Challenge Submission Modal -->
  <div class="celebration-modal-backdrop" id="challengeSubmitModalBackdrop">
    <div class="celebration-card-dialog export-modal-dialog" style="max-width:540px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3 style="font-size:1.25rem; font-weight:900; color:var(--text-main); margin:0;" id="submitModalChallengeTitle">
          تسليم التحدي البرمجي
        </h3>
        <button class="btn-card-outline" style="padding:4px 10px; font-size:0.8rem;" onclick="closeChallengeSubmitModal()">✕</button>
      </div>

      <form onsubmit="handleChallengeSubmission(event)">
        <div class="form-field-group">
          <label class="field-label" for="submitGithubUrl">رابط مستودع المشروع على GitHub:</label>
          <input type="url" class="field-input" id="submitGithubUrl" placeholder="https://github.com/username/project" required>
        </div>

        <div class="form-field-group">
          <label class="field-label" for="submitLiveUrl">رابط المعاينة الحية (Live Demo) إن وجد:</label>
          <input type="url" class="field-input" id="submitLiveUrl" placeholder="https://username.github.io/project">
        </div>

        <div class="form-field-group">
          <label class="field-label" for="submitNotes">ملاحظاتك وشرح ما تم تنفيذه:</label>
          <textarea class="field-input" id="submitNotes" style="height:70px;" placeholder="أبرز التحديات التي واجهتك وكيف قمت بحلها..."></textarea>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px;">
          <button type="button" class="btn-card-outline" onclick="closeChallengeSubmitModal()">إلغاء</button>
          <button type="submit" class="btn-primary-google">إرسال للمراجعة والاعتماد 📤</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 3: Member Survey Details Modal Dialog -->
  <div class="celebration-modal-backdrop" id="memberDetailModalBackdrop">
    <div class="celebration-card-dialog export-modal-dialog" style="max-width:640px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div>
          <h3 style="font-size:1.3rem; font-weight:900; color:var(--text-main); margin:0;" id="modalMemberName">
            تفاصيل استبيان العضو
          </h3>
          <span style="font-size:0.82rem; color:var(--text-muted);" id="modalMemberMeta"></span>
        </div>
        <button class="btn-card-outline" style="padding:4px 10px; font-size:0.8rem;" onclick="closeMemberDetailModal()">✕ إغلاق</button>
      </div>

      <div class="member-detail-grid" id="modalMemberDetailGrid">
        <!-- Rendered dynamically -->
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
        <div id="modalMemberLevelBadge"></div>
        <div style="display:flex; gap:8px;">
          <button class="btn-card-outline" onclick="closeMemberDetailModal()">إغلاق</button>
          <button class="btn-primary-google" id="btnModalApproveMember" onclick="approveCurrentModalMember()">اعتماد الخطة</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="membersData.js"></script>
  <script src="script.js?v=chrome_exp_v4"></script>
</body>
</html>
`;

fs.writeFileSync("index.html", htmlContent, "utf8");
console.log("Updated index.html successfully with the grand expanded experience!");
