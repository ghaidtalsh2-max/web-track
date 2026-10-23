const fs = require('fs');

const perfectCss = `/* ==========================================================================
   منصة مجال تصميم وتطوير الويب — نادي قوقل للطلبة المطورين بجامعة الطائف (2026)
   نظام التصميم المتقن: Google Aesthetics + Modern Clean UI
   ========================================================================== */

:root {
  /* Google Official Palette */
  --g-blue: #1a73e8;
  --g-blue-hover: #1557b0;
  --g-blue-light: #E8F0FE;
  --g-red: #EA4335;
  --g-green: #34A853;
  --g-green-light: #DCFCE7;
  --g-yellow: #FBBC04;
  --g-yellow-light: #FEF3C7;

  /* Neutrals */
  --bg-page: #F8FAFC;
  --bg-card: #FFFFFF;
  --text-main: #0F172A;
  --text-secondary: #475569;
  --text-muted: #64748B;
  --border-light: #E2E8F0;
  --border-card: #CBD5E1;

  /* Typography */
  --font-arabic: 'Cairo', 'Tajawal', system-ui, sans-serif;
  --font-code: 'JetBrains Mono', monospace;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.1);
}

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-page);
  color: var(--text-main);
  font-family: var(--font-arabic);
  direction: rtl;
  text-align: right;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

#confettiCanvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10000;
}

/* ==========================================================================
   1. شاشة البداية التفاعلية — Google Chrome Experiment
   ========================================================================== */
.splash-stage-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at 50% 30%, #1a73e8 0%, #174ea6 70%, #0d3880 100%);
  color: #FFFFFF;
  transition: opacity 0.4s ease, visibility 0.4s ease;
  overflow: hidden;
}

.splash-stage-overlay.fade-out {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.splash-top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 20;
}

.splash-skip-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #FFFFFF;
  padding: 8px 16px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.splash-skip-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.splash-top-identity {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 0.9rem;
}

/* Chrome Card Deck */
.chrome-card-deck-wrapper {
  position: relative;
  width: 90%;
  max-width: 490px;
  height: 440px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.chrome-stack-card {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 28px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--text-main);
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.chrome-stack-card.card-layer-1 {
  transform: translateY(0) scale(1);
  z-index: 3;
  opacity: 1;
}
.chrome-stack-card.card-layer-2 {
  transform: translateY(16px) scale(0.95);
  z-index: 2;
  opacity: 0.85;
}
.chrome-stack-card.card-layer-3 {
  transform: translateY(30px) scale(0.9);
  z-index: 1;
  opacity: 0.65;
}

.chrome-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #F1F5F9;
  padding-bottom: 12px;
}

.chrome-window-dots {
  display: flex;
  gap: 6px;
}
.c-dot { width: 11px; height: 11px; border-radius: 50%; }
.c-dot.r { background: var(--g-red); }
.c-dot.y { background: var(--g-yellow); }
.c-dot.g { background: var(--g-green); }

.chrome-card-badge {
  background: var(--g-blue-light);
  color: var(--g-blue);
  font-size: 0.76rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 9999px;
}

.chrome-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 16px 0;
}

.chrome-card-title {
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1.3;
  color: var(--text-main);
  margin: 12px 0 8px 0;
}

.chrome-card-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.chrome-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #F1F5F9;
  padding-top: 12px;
}

.btn-card-next {
  background: var(--g-blue);
  color: #FFFFFF;
  border: none;
  padding: 10px 22px;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.btn-card-next:hover {
  background: var(--g-blue-hover);
  transform: translateY(-2px);
}

.btn-card-explore {
  background: transparent;
  border: 1px solid #CBD5E1;
  color: var(--text-secondary);
  padding: 10px 18px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

/* ==========================================================================
   2. شاشة الدخول والتفعيل — Auth Overlay (Modal Dialog)
   ========================================================================== */
.auth-stage-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 8000;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(12px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.auth-stage-overlay.active {
  display: flex;
}

.auth-geometric-backdrop {
  display: none; /* Removed completely to prevent overlapping content */
}

.auth-card-frame {
  background: #FFFFFF;
  border-radius: 28px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  max-width: 960px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  overflow: hidden;
  border: 1px solid var(--border-light);
  max-height: 90vh;
}

.auth-intro-column {
  background: linear-gradient(145deg, #1a73e8 0%, #1557b0 100%);
  color: #FFFFFF;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.auth-identity-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gdg-logo-icon {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-code);
  font-weight: 900;
  font-size: 1.2rem;
  gap: 4px;
}
.google-dots-pair { display: inline-flex; gap: 3px; }
.g-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.g-dot.b { background: var(--g-blue); }
.g-dot.r { background: var(--g-red); }
.g-dot.y { background: var(--g-yellow); }
.g-dot.g { background: var(--g-green); }

.auth-header-text h2 {
  font-size: 1.15rem;
  font-weight: 900;
  margin: 0;
}
.auth-header-text p {
  font-size: 0.75rem;
  opacity: 0.85;
  margin: 2px 0 0 0;
}

.auth-manifesto-box h3 {
  font-size: 1.35rem;
  font-weight: 900;
  margin: 20px 0 10px 0;
}
.auth-manifesto-box p {
  font-size: 0.88rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 20px;
}

.security-badges-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sec-pill {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-replay-splash-auth {
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.4);
  color: #FFFFFF;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.78rem;
  cursor: pointer;
  margin-top: 14px;
}

.auth-form-column {
  padding: 32px 36px;
  background: #FFFFFF;
  overflow-y: auto;
}

.quick-demo-fill-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid #F1F5F9;
}

.quick-fill-btn {
  background: #F1F5F9;
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 0.76rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
}
.quick-fill-btn:hover {
  background: #E2E8F0;
  color: var(--text-main);
}
.quick-fill-btn.active {
  background: var(--g-blue-light);
  color: var(--g-blue);
  border-color: #C2E7FF;
}

.auth-tabs-nav {
  display: flex;
  background: #F1F5F9;
  border-radius: 14px;
  padding: 4px;
  margin-bottom: 22px;
}

.auth-tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 9px;
  border-radius: 10px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.86rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}
.auth-tab-btn.active {
  background: #FFFFFF;
  color: var(--g-blue);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-field-group {
  margin-bottom: 18px;
  text-align: right;
}

.field-label {
  display: block;
  font-size: 0.84rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 6px;
}

.field-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.code-status-pill {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  background: #F1F5F9;
  color: var(--text-muted);
}

.field-input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--border-light);
  border-radius: 12px;
  font-family: var(--font-arabic);
  font-size: 0.9rem;
  color: var(--text-main);
  background: #FFFFFF;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}
.field-input:focus {
  border-color: var(--g-blue);
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}
.input-suffix-icon {
  position: absolute;
  left: 12px;
  font-size: 0.95rem;
  pointer-events: none;
}
.btn-toggle-eye {
  position: absolute;
  left: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.field-hint {
  font-size: 0.74rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.password-meter-wrap {
  margin-top: 8px;
}
.meter-bar {
  display: flex;
  gap: 4px;
  height: 4px;
  margin-bottom: 4px;
}
.meter-segment {
  flex: 1;
  background: #E2E8F0;
  border-radius: 2px;
}
.meter-segment.active-medium { background: var(--g-yellow); }
.meter-segment.active-strong { background: var(--g-green); }
.meter-text-desc { font-size: 0.72rem; color: var(--text-muted); font-weight: 700; }

.btn-primary-submit {
  width: 100%;
  background: var(--g-blue);
  color: #FFFFFF;
  border: none;
  padding: 13px;
  border-radius: 12px;
  font-family: var(--font-arabic);
  font-weight: 900;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  transition: background 0.2s ease;
}
.btn-primary-submit:hover {
  background: var(--g-blue-hover);
}

/* ==========================================================================
   3. شاشة الترحيب الشخصية المؤقتة — Welcome Interstitial
   ========================================================================== */
.welcome-interstitial-stage {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 8500;
  background: radial-gradient(circle at 50% 40%, #1a73e8 0%, #174ea6 100%);
  display: none;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  text-align: center;
  padding: 24px;
}

.welcome-interstitial-stage.active {
  display: flex;
}

.welcome-center-card {
  background: #FFFFFF;
  color: var(--text-main);
  border-radius: 32px;
  padding: 44px 36px;
  max-width: 540px;
  width: 100%;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-avatar-holder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--g-blue);
  color: #FFFFFF;
  font-size: 2rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(26, 115, 232, 0.35);
}

.welcome-personalized-name {
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 12px 0 8px 0;
}

.welcome-inspiring-quote {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.welcome-progress-countdown {
  width: 100%;
  height: 6px;
  background: #F1F5F9;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 20px;
}
.welcome-bar-fill {
  width: 100%;
  height: 100%;
  background: var(--g-green);
  animation: barShrink 2.8s linear forwards;
}
@keyframes barShrink {
  from { width: 100%; }
  to { width: 0%; }
}

.btn-instant-enter {
  background: var(--g-blue);
  color: #FFFFFF;
  border: none;
  padding: 11px 24px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.92rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* ==========================================================================
   4. بيئة المنصة الرئيسية — Platform Shell & Navbar
   ========================================================================== */
.platform-shell-container {
  display: none;
  min-height: 100vh;
}
.platform-shell-container.visible {
  display: block;
}

.main-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.nav-brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.nav-brand-title h1 {
  font-size: 0.95rem;
  font-weight: 900;
  margin: 0;
  color: var(--text-main);
}
.nav-brand-title p {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin: 0;
}

/* Creative Tabs */
.creative-tab-bar {
  display: flex;
  gap: 4px;
  background: #F1F5F9;
  padding: 4px;
  border-radius: 16px;
  border: 1px solid var(--border-light);
  max-width: 65vw;
  overflow-x: auto;
  scrollbar-width: none;
}
.creative-tab-bar::-webkit-scrollbar { display: none; }

.creative-tab-btn {
  background: transparent;
  border: none;
  padding: 8px 14px;
  border-radius: 12px;
  font-family: var(--font-arabic);
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.18s ease;
}
.creative-tab-btn:hover {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.6);
}
.creative-tab-btn.active {
  background: #FFFFFF;
  color: var(--g-blue);
  font-weight: 900;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.nav-user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-switcher-toggle {
  background: var(--g-blue-light);
  border: 1px solid #C2E7FF;
  color: var(--g-blue);
  padding: 7px 14px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.78rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.user-profile-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 12px;
  transition: background 0.15s ease;
}
.user-profile-badge:hover {
  background: #F1F5F9;
}

.avatar-circle-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--g-blue);
  color: #FFFFFF;
  font-weight: 900;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main Viewport Container */
.main-view-container {
  padding-top: 96px;
  padding-bottom: 60px;
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

.app-page-view {
  display: none;
}
.app-page-view.active {
  display: block;
  animation: fadeIn 0.25s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==========================================================================
   5. الصفحة الرئيسية — Homepage & This Week
   ========================================================================== */
.hero-center-box {
  background: #FFFFFF;
  border: 1px solid var(--border-light);
  border-radius: 28px;
  padding: 48px 32px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  margin-bottom: 40px;
}

.geo-shape {
  display: none; /* Completely disabled rogue shapes that overlapped text */
}

.hero-welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--g-blue-light);
  color: var(--g-blue);
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.hero-bold-headline {
  font-size: 2.6rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 0 0 16px 0;
  line-height: 1.25;
}

.dynamic-rotator-container {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-secondary);
  background: #F1F5F9;
  border: 1px solid var(--border-light);
  padding: 6px 20px;
  border-radius: 9999px;
  margin-bottom: 18px;
}

.rotator-changing-word {
  color: var(--g-blue);
  font-weight: 900;
  min-width: 120px;
  display: inline-block;
  transition: opacity 0.25s, transform 0.25s;
}

.hero-tagline-text {
  max-width: 680px;
  margin: 0 auto;
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
}

/* ==========================================================================
   6. لوحة القادة وقائمة الأعضاء — Leader Dashboard & Modern SaaS Table
   ========================================================================== */
.leader-banner-card {
  background: linear-gradient(135deg, #1a73e8 0%, #174ea6 100%);
  color: #FFFFFF;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 12px 35px rgba(26, 115, 232, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.role-badge-pill {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 800;
}

.rewards-subtab-strip {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: #FFFFFF;
  padding: 6px;
  border-radius: 16px;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.leader-controls-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  background: #FFFFFF;
  border: 1px solid var(--border-light);
  border-radius: 18px;
  padding: 14px 18px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}

.search-box-wrap {
  display: flex;
  align-items: center;
  background: #F8FAFC;
  border: 1.5px solid var(--border-light);
  border-radius: 12px;
  padding: 0 12px;
  flex: 1;
  max-width: 380px;
}
.search-icon { font-size: 0.9rem; color: var(--text-muted); }
.search-input {
  border: none;
  background: transparent;
  padding: 10px 8px;
  font-family: var(--font-arabic);
  font-size: 0.88rem;
  width: 100%;
  outline: none;
}

.level-filter-chips {
  display: flex;
  gap: 6px;
}
.filter-chip-btn {
  background: #F8FAFC;
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  padding: 6px 14px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.filter-chip-btn.active {
  background: var(--g-blue);
  color: #FFFFFF;
  border-color: var(--g-blue);
}

/* The Professional Members Table */
.members-table-container {
  background: #FFFFFF;
  border: 1px solid var(--border-light);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.members-data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: right;
}

.members-data-table thead th {
  background: #F8FAFC;
  color: var(--text-secondary);
  font-size: 0.84rem;
  font-weight: 800;
  padding: 14px 18px;
  border-bottom: 2px solid var(--border-light);
}

.members-data-table tbody td {
  padding: 16px 18px;
  border-bottom: 1px solid #F1F5F9;
  vertical-align: middle;
  font-size: 0.88rem;
}

.members-data-table tbody tr:hover {
  background: #F8FAFC;
}

.member-name-main {
  font-weight: 800;
  color: var(--text-main);
  font-size: 0.95rem;
}
.member-sub-info {
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.level-badge-custom {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.76rem;
}
.level-advanced { background: #EDE9FE; color: #6D28D9; }
.level-intermediate { background: var(--g-blue-light); color: var(--g-blue); }
.level-beginner { background: var(--g-green-light); color: #15803D; }

.level-select-inline {
  background: #F8FAFC;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: 3px 6px;
  font-family: var(--font-arabic);
  font-size: 0.74rem;
  font-weight: 700;
}

.token-copy-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #F1F5F9;
  padding: 4px 10px;
  border-radius: 8px;
}
.token-val {
  font-family: var(--font-code);
  font-size: 0.8rem;
  color: var(--text-main);
}
.btn-copy-token {
  background: #FFFFFF;
  border: 1px solid var(--border-light);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.72rem;
  cursor: pointer;
  font-weight: 700;
}

.action-cell-btns {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-status-toggle {
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-family: var(--font-arabic);
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-status-toggle.btn-approved {
  background: var(--g-green-light);
  color: #15803D;
}
.btn-status-toggle.btn-pending {
  background: var(--g-blue-light);
  color: var(--g-blue);
  border: 1px solid #C2E7FF;
}

.btn-view-details {
  background: #FFFFFF;
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  padding: 6px 10px;
  border-radius: 8px;
  font-family: var(--font-arabic);
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary-google {
  background: var(--g-blue);
  color: #FFFFFF;
  border: none;
  padding: 9px 18px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.86rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
}
.btn-primary-google:hover { background: var(--g-blue-hover); }

.btn-card-outline {
  background: #FFFFFF;
  border: 1.5px solid var(--border-light);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-card-outline:hover {
  background: #F8FAFC;
  color: var(--text-main);
  border-color: #CBD5E1;
}

/* Modals */
.celebration-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  z-index: 9000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.celebration-modal-backdrop.show { display: flex; }

.celebration-card-dialog {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 28px;
  max-width: 680px;
  width: 100%;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-light);
}

.export-modal-dialog textarea {
  width: 100%;
  height: 240px;
  background: #F8FAFC;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 14px;
  font-family: var(--font-code);
  font-size: 0.82rem;
  line-height: 1.6;
  resize: vertical;
}

@media (max-width: 900px) {
  .auth-card-frame { grid-template-columns: 1fr; }
  .auth-intro-column { display: none; }
  .creative-tab-bar { max-width: 90vw; }
  .hero-bold-headline { font-size: 1.8rem; }
}
`;

fs.writeFileSync('styles.css', perfectCss, 'utf8');
console.log('Generated clean, bug-free, pixel-perfect styles.css!');
