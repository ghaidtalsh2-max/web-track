const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const cssPath = path.join(rootDir, 'styles.css');

// 1. Read existing index.html
let html = fs.readFileSync(indexPath, 'utf8');

// 2. Remove all rogue geometric shape divs
// Remove kinetic-shapes-stage contents or the whole div
html = html.replace(/<div class="kinetic-shapes-stage"[^>]*>[\s\S]*?<\/div>\s*<!-- Interactive Card Deck/g, '<!-- Interactive Card Deck');
html = html.replace(/<div class="auth-geometric-backdrop">[\s\S]*?<\/div>/g, '');
html = html.replace(/<div class="geo-shape[^"]*"><\/div>/g, '');
html = html.replace(/<div class="geo-shape[^"]*"[^>]*><\/div>/g, '');
html = html.replace(/<div class="k-shape[^"]*"[^>]*><\/div>/g, '');

// 3. Build pristine CSS
const modernCss = `/* ==========================================================================
   منصة مجال تصميم وتطوير الويب — نادي قوقل للطلبة المطورين بجامعة الطائف (2026)
   نظام تصميم فائق الإتقان: Google Design + Clean Modern SaaS Dashboard
   ========================================================================== */

:root {
  /* Google Official Palette */
  --g-blue: #1a73e8;
  --g-blue-hover: #1557b0;
  --g-blue-light: #E8F0FE;
  --g-blue-border: #C2E7FF;
  --g-red: #EA4335;
  --g-red-light: #FCE8E6;
  --g-green: #34A853;
  --g-green-light: #E6F4EA;
  --g-yellow: #FBBC04;
  --g-yellow-light: #FEF7E0;

  /* Neutrals */
  --bg-page: #F8FAFC;
  --bg-card: #FFFFFF;
  --bg-subtle: #F1F5F9;
  --text-main: #0F172A;
  --text-secondary: #475569;
  --text-muted: #64748B;
  --border-light: #E2E8F0;
  --border-card: #CBD5E1;

  /* Typography */
  --font-arabic: 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif;
  --font-code: 'JetBrains Mono', monospace;

  /* Shadows */
  --shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 20px 40px -8px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 25px 60px -15px rgba(0, 0, 0, 0.25);
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

/* Hide all rogue shapes completely */
.geo-shape, .k-shape, .auth-geometric-backdrop, .kinetic-shapes-stage {
  display: none !important;
}

/* ==========================================================================
   1. شاشة البداية — Google Chrome Experiment
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
  padding: 8px 18px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 700;
  font-size: 0.88rem;
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
.skip-key-hint {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-family: var(--font-code);
}

.splash-top-identity {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 0.92rem;
}

.chrome-card-deck-wrapper {
  position: relative;
  width: 90%;
  max-width: 500px;
  height: 460px;
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
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: right;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.card-layer-1 { transform: scale(1) translateY(0); z-index: 3; opacity: 1; }
.card-layer-2 { transform: scale(0.94) translateY(24px); z-index: 2; opacity: 0.85; pointer-events: none; }
.card-layer-3 { transform: scale(0.88) translateY(44px); z-index: 1; opacity: 0.7; pointer-events: none; }

.chrome-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chrome-window-dots {
  display: flex;
  gap: 6px;
}
.c-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.c-dot.r { background: var(--g-red); }
.c-dot.y { background: var(--g-yellow); }
.c-dot.g { background: var(--g-green); }

.chrome-card-badge {
  background: var(--g-blue-light);
  color: var(--g-blue);
  font-size: 0.78rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 9999px;
}

.chrome-card-art {
  height: 120px;
  margin: 16px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chrome-card-title {
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 0 0 8px 0;
  line-height: 1.35;
}

.chrome-card-subtitle {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.chrome-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--border-light);
}

.btn-card-explore {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-arabic);
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}
.btn-card-explore:hover {
  background: var(--bg-subtle);
  color: var(--text-main);
}

.btn-card-next {
  background: var(--g-blue);
  color: #FFFFFF;
  border: none;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.9rem;
  padding: 10px 22px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(26, 115, 232, 0.35);
}
.btn-card-next:hover {
  background: var(--g-blue-hover);
  transform: translateY(-1px);
}

/* ==========================================================================
   2. شاشة الدخول والتفعيل — Auth Experience
   ========================================================================== */
.auth-stage-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
}

.auth-stage-overlay.active {
  display: flex !important;
}

.auth-card-frame {
  background: #FFFFFF;
  border-radius: 28px;
  box-shadow: var(--shadow-xl);
  max-width: 960px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  overflow: hidden;
  border: 1px solid var(--border-light);
  margin: auto;
}

.auth-intro-column {
  background: linear-gradient(145deg, #1a73e8 0%, #1557b0 60%, #0d3880 100%);
  color: #FFFFFF;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: right;
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
  font-size: 1.25rem;
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
  font-size: 0.78rem;
  opacity: 0.85;
  margin: 2px 0 0 0;
}

.auth-manifesto-box {
  margin: 28px 0;
}
.auth-manifesto-box h3 {
  font-size: 1.45rem;
  font-weight: 900;
  margin: 0 0 12px 0;
  line-height: 1.35;
}
.auth-manifesto-box p {
  font-size: 0.92rem;
  opacity: 0.9;
  line-height: 1.65;
  margin: 0;
}

.security-badges-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}
.sec-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 0.84rem;
  font-weight: 700;
}

.btn-replay-splash-auth {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #FFFFFF;
  padding: 10px 16px;
  border-radius: 12px;
  font-family: var(--font-arabic);
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  margin-top: 12px;
}
.btn-replay-splash-auth:hover {
  background: rgba(255, 255, 255, 0.25);
}

.auth-form-column {
  padding: 36px 32px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: right;
}

.quick-demo-fill-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

.quick-fill-btn {
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  padding: 5px 12px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-size: 0.78rem;
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
  border-color: var(--g-blue-border);
}

.auth-tabs-nav {
  display: flex;
  background: var(--bg-subtle);
  border-radius: 14px;
  padding: 4px;
  margin-bottom: 24px;
  gap: 4px;
}

.auth-tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 10px 14px;
  border-radius: 10px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.18s ease;
  text-align: center;
}
.auth-tab-btn.active {
  background: #FFFFFF;
  color: var(--g-blue);
  box-shadow: var(--shadow-xs);
}

.auth-error-banner {
  background: #FEF2F2;
  border: 1px solid #FCA5A5;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 18px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.error-icon { font-size: 1.2rem; }
.error-text strong { font-size: 0.85rem; color: #991B1B; display: block; }
.error-text p { font-size: 0.8rem; color: #B91C1C; margin: 2px 0 0 0; }
.error-close-btn { background: none; border: none; color: #991B1B; cursor: pointer; font-size: 0.9rem; margin-right: auto; }

.form-field-group {
  margin-bottom: 18px;
}

.field-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.field-label {
  font-size: 0.86rem;
  font-weight: 800;
  color: var(--text-main);
  display: block;
  margin-bottom: 6px;
}

.code-status-pill {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-family: var(--font-code);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.field-input {
  width: 100%;
  padding: 12px 16px;
  background: #FFFFFF;
  border: 1.5px solid var(--border-light);
  border-radius: 12px;
  font-family: var(--font-arabic);
  font-size: 0.92rem;
  color: var(--text-main);
  outline: none;
  transition: all 0.2s ease;
}
.field-input:focus {
  border-color: var(--g-blue);
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
}
.code-input {
  font-family: var(--font-code);
  font-weight: 700;
  letter-spacing: 1px;
}

.input-suffix-icon {
  position: absolute;
  left: 14px;
  font-size: 1.1rem;
  pointer-events: none;
}

.field-hint {
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.btn-primary-google {
  width: 100%;
  background: var(--g-blue);
  color: #FFFFFF;
  border: none;
  padding: 13px 20px;
  border-radius: 12px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(26, 115, 232, 0.3);
}
.btn-primary-google:hover {
  background: var(--g-blue-hover);
  transform: translateY(-1px);
}
.btn-primary-google:disabled {
  opacity: 0.75;
  cursor: not-allowed;
  transform: none;
}

.password-strength-wrap {
  margin-top: 6px;
}
.strength-track {
  height: 4px;
  background: var(--bg-subtle);
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 4px;
}
.strength-fill {
  height: 100%;
  width: 20%;
  background: var(--g-red);
  transition: width 0.3s, background 0.3s;
}
.strength-text {
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* ==========================================================================
   3. شريط التنقل العلوي — Top Navbar
   ========================================================================== */
.main-navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 76px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  z-index: 1000;
  box-shadow: var(--shadow-xs);
}

.nav-brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-shrink: 0;
}

.nav-brand-title h1 {
  font-size: 1rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 0;
  line-height: 1.2;
}
.nav-brand-title p {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin: 2px 0 0 0;
}

.creative-tab-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-subtle);
  padding: 5px;
  border-radius: 9999px;
  border: 1px solid var(--border-light);
}

.creative-tab-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 7px 16px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 700;
  font-size: 0.84rem;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
}
.creative-tab-btn:hover {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.6);
}
.creative-tab-btn.active {
  background: var(--g-blue);
  color: #FFFFFF !important;
  font-weight: 800;
  box-shadow: 0 3px 10px rgba(26, 115, 232, 0.28);
}

.nav-user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.role-switcher-toggle {
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  padding: 6px 14px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}
.role-switcher-toggle:hover {
  background: #E2E8F0;
  color: var(--text-main);
}

.user-profile-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 12px;
  transition: background 0.15s;
}
.user-profile-badge:hover {
  background: var(--bg-subtle);
}

.avatar-circle-sm {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--g-blue) 0%, #1557b0 100%);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.05rem;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.25);
}

/* ==========================================================================
   4. الحاوية الرئيسية لكافة الصفحات — Main Views Container
   ========================================================================== */
.main-view-container {
  padding-top: 104px; /* Critical: perfectly clears the fixed navbar */
  padding-bottom: 60px;
  max-width: 1260px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

.app-page-view {
  display: none;
}
.app-page-view.active {
  display: block;
  animation: fadeInView 0.25s ease-out;
}

@keyframes fadeInView {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==========================================================================
   5. الصفحة الرئيسية — Hero & KPI Section
   ========================================================================== */
.hero-center-box {
  background: #FFFFFF;
  border: 1px solid var(--border-light);
  border-radius: 28px;
  padding: 44px 32px 36px 32px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  position: relative;
  margin-bottom: 36px;
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
  margin-bottom: 14px;
  border: 1px solid var(--g-blue-border);
}

.hero-bold-headline {
  font-size: 2.4rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 0 0 14px 0;
  line-height: 1.25;
}

.dynamic-rotator-container {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-secondary);
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  padding: 6px 20px;
  border-radius: 9999px;
  margin-bottom: 16px;
}

.rotator-changing-word {
  color: var(--g-blue);
  font-weight: 900;
  min-width: 120px;
  display: inline-block;
  transition: opacity 0.25s, transform 0.25s;
}

.hero-tagline-text {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 680px;
  margin: 0 auto 28px auto;
  line-height: 1.7;
}

/* 3 Clean KPI Cards */
.kpi-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 920px;
  margin: 0 auto;
  text-align: right;
}

.kpi-stat-card {
  background: #FFFFFF;
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 22px;
  box-shadow: var(--shadow-xs);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}
.kpi-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.kpi-card-blue { border-top: 4px solid var(--g-blue); }
.kpi-card-green { border-top: 4px solid var(--g-green); }
.kpi-card-yellow { border-top: 4px solid var(--g-yellow); }

.kpi-stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.kpi-stat-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-secondary);
}
.kpi-stat-icon { font-size: 1.25rem; }

.kpi-stat-val {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 8px 0 4px 0;
}
.kpi-stat-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

/* ==========================================================================
   6. لوحة القادة الشاملة — Leader Dashboard & Tables
   ========================================================================== */
.leader-banner-card {
  background: linear-gradient(135deg, #1a73e8 0%, #1557b0 50%, #0d3880 100%);
  color: #FFFFFF;
  border-radius: 24px;
  padding: 32px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 20px;
}

.leader-banner-content h2 {
  font-size: 1.85rem;
  font-weight: 900;
  margin: 10px 0 6px 0;
}
.leader-banner-content p {
  font-size: 0.95rem;
  opacity: 0.92;
  max-width: 640px;
  margin: 0;
  line-height: 1.6;
}

.rewards-subtab-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  background: #FFFFFF;
  padding: 8px;
  border-radius: 16px;
  border: 1px solid var(--border-light);
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
  margin-bottom: 18px;
  box-shadow: var(--shadow-xs);
}

.search-box-wrap {
  display: flex;
  align-items: center;
  background: var(--bg-subtle);
  border: 1.5px solid var(--border-light);
  border-radius: 12px;
  padding: 0 12px;
  flex: 1;
  max-width: 360px;
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
  flex-wrap: wrap;
}
.filter-chip-btn {
  background: var(--bg-subtle);
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

/* The Enterprise Members Table */
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
  font-size: 0.85rem;
  font-weight: 800;
  padding: 16px 20px;
  border-bottom: 2px solid var(--border-light);
  white-space: nowrap;
}

.members-data-table tbody tr {
  border-bottom: 1px solid var(--border-light);
  transition: background 0.15s ease;
}
.members-data-table tbody tr:hover {
  background: #F8FAFC;
}
.members-data-table tbody tr:last-child {
  border-bottom: none;
}

.members-data-table tbody td {
  padding: 16px 20px;
  font-size: 0.88rem;
  vertical-align: middle;
}

.member-name-main {
  font-weight: 900;
  color: var(--text-main);
  font-size: 0.95rem;
  margin-bottom: 2px;
}
.member-sub-info {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.username-chip {
  background: #EFF6FF;
  color: #1D4ED8;
  font-family: var(--font-code);
  font-size: 0.84rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #DBEAFE;
  display: inline-block;
  direction: ltr;
}

.level-badge-custom {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.76rem;
  font-weight: 800;
}
.level-advanced { background: var(--g-green-light); color: #166534; }
.level-intermediate { background: var(--g-yellow-light); color: #854D0E; }
.level-beginner { background: var(--g-red-light); color: #991B1B; }

.level-select-inline {
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 4px 8px;
  font-family: var(--font-arabic);
  font-size: 0.76rem;
  font-weight: 700;
  background: #FFFFFF;
  cursor: pointer;
}

.token-copy-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 4px 10px;
}
.token-val {
  font-family: var(--font-code);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main);
}
.btn-copy-token {
  background: #FFFFFF;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: 2px 8px;
  font-family: var(--font-arabic);
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s;
}
.btn-copy-token:hover {
  background: var(--g-blue);
  color: #FFFFFF;
  border-color: var(--g-blue);
}

.action-cell-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-status-toggle {
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-family: var(--font-arabic);
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-approved {
  background: var(--g-green-light);
  color: #166534;
}
.btn-approved:hover {
  background: #BBF7D0;
}
.btn-pending {
  background: var(--g-blue);
  color: #FFFFFF;
}
.btn-pending:hover {
  background: var(--g-blue-hover);
}

.btn-view-details {
  background: #FFFFFF;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 6px 12px;
  font-family: var(--font-arabic);
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}
.btn-view-details:hover {
  background: var(--bg-subtle);
  color: var(--text-main);
}

.btn-card-outline {
  background: #FFFFFF;
  border: 1.5px solid var(--border-light);
  color: var(--text-main);
  padding: 8px 16px;
  border-radius: 12px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.86rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease;
}
.btn-card-outline:hover {
  border-color: var(--g-blue);
  color: var(--g-blue);
  background: var(--g-blue-light);
}

/* Modals */
.celebration-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 10001;
}
.celebration-card-dialog {
  background: #FFFFFF;
  border-radius: 24px;
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 600px;
  padding: 28px;
  text-align: right;
  border: 1px solid var(--border-light);
  max-height: 90vh;
  overflow-y: auto;
}
.export-modal-dialog textarea {
  width: 100%;
  height: 220px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 14px;
  font-family: var(--font-arabic);
  font-size: 0.88rem;
  color: var(--text-main);
  line-height: 1.6;
  resize: vertical;
}

/* Responsive */
@media (max-width: 992px) {
  .auth-card-frame {
    grid-template-columns: 1fr;
  }
  .auth-intro-column {
    padding: 28px 24px;
  }
  .kpi-cards-grid {
    grid-template-columns: 1fr;
  }
  .main-navbar {
    height: auto;
    padding: 12px 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .creative-tab-bar {
    order: 3;
    width: 100%;
    overflow-x: auto;
    justify-content: flex-start;
  }
  .main-view-container {
    padding-top: 140px;
  }
}
`;

// Write modernCss to styles.css
fs.writeFileSync(cssPath, modernCss, 'utf8');

// Also inject this exact modernCss inside <style id="perfectModernStyle"> in <head>
// so that Safari NEVER suffers from stylesheet caching issues!
const styleTag = `<style id="perfectModernStyle">\n${modernCss}\n</style>`;

if (html.includes('<style id="perfectModernStyle">')) {
  html = html.replace(/<style id="perfectModernStyle">[\s\S]*?<\/style>/, styleTag);
} else {
  // Inject before </head>
  html = html.replace('</head>', `${styleTag}\n</head>`);
}

// Update the external stylesheet link version just in case
html = html.replace(/styles\.css\?v=[^"]*/g, 'styles.css?v=2026_clean_v10');

// Write updated HTML
fs.writeFileSync(indexPath, html, 'utf8');

console.log('Successfully updated index.html and styles.css with zero rogue shapes and embedded pristine CSS!');
