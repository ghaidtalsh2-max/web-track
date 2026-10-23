const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const cssPath = path.join(rootDir, 'styles.css');
const jsPath = path.join(rootDir, 'script.js');

// 1. Read existing files
let html = fs.readFileSync(indexPath, 'utf8');
let js = fs.readFileSync(jsPath, 'utf8');

// =============================================================================
// A. Build Master Creative Director CSS
// =============================================================================
const creativeDirectorCss = `/* ==========================================================================
   منصة مجال تصميم وتطوير الويب — نادي قوقل للطلبة المطورين بجامعة الطائف (2026)
   Creative Web Director Edition: High-End Motion & Authentic Google Brand Identity
   ========================================================================== */

:root {
  /* Official Google Developer Groups on Campus - Taif University 2026 Guidelines */
  --g-blue: #4285F4;
  --g-blue-deep: #174EA6;
  --g-blue-dark: #0D3880;
  --g-blue-light: #E8F0FE;
  --g-blue-border: #C2E7FF;

  --g-red: #EA4335;
  --g-red-light: #FCE8E6;

  --g-green: #34A853;
  --g-green-light: #E6F4EA;

  --g-yellow: #F9AB00; /* Official Taif Amber from Brand Guidelines */
  --g-yellow-light: #FEF7E0;

  /* Editorial Surfaces */
  --bg-page: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-subtle: #F1F5F9;
  --bg-dark: #0F172A;

  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #64748B;
  --text-on-dark: #F8FAFC;

  --border-subtle: #E2E8F0;
  --border-strong: #CBD5E1;

  /* Typography */
  --font-arabic: 'IBM Plex Sans Arabic', 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif;
  --font-display: 'Cairo', 'IBM Plex Sans Arabic', system-ui, sans-serif;
  --font-latin: 'Arimo', system-ui, sans-serif;
  --font-code: 'JetBrains Mono', monospace;

  /* Precision Motion Curves */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-elastic: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

  /* Elevation */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 12px 28px -4px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 24px 48px -8px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 32px 64px -12px rgba(0, 0, 0, 0.22);
}

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-page);
  color: var(--text-primary);
  font-family: var(--font-arabic);
  direction: rtl;
  text-align: right;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

#confettiCanvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100000;
}

/* ==========================================================================
   1. الافتتاحية السينمائية الكاملة — Fullscreen Cinematic Opening Sequence
   ========================================================================== */
.cinematic-stage-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99990;
  background: radial-gradient(circle at 50% 50%, #4285F4 0%, #1a73e8 35%, #174ea6 70%, #0d3880 100%);
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: opacity 0.6s var(--ease-out-expo), transform 0.6s var(--ease-out-expo), visibility 0.6s;
}

.cinematic-stage-overlay.fade-out {
  opacity: 0;
  visibility: hidden;
  transform: scale(1.06);
  pointer-events: none;
}

.cinematic-top-controls {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  z-index: 20;
}

.intro-skip-pill {
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.32);
  color: #FFFFFF;
  padding: 8px 18px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.25s var(--ease-out-expo);
  backdrop-filter: blur(8px);
}
.intro-skip-pill:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-2px);
}
.skip-key-badge {
  background: rgba(0, 0, 0, 0.35);
  padding: 2px 8px;
  border-radius: 6px;
  font-family: var(--font-code);
  font-size: 0.72rem;
  font-weight: 700;
}

.intro-brand-stamp {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-latin);
}
.be-googley-tag {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.85;
}
.identity-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}
.identity-dot.y { background: var(--g-yellow); }
.identity-dot.r { background: var(--g-red); }
.identity-dot.b { background: var(--g-blue); }
.identity-dot.g { background: var(--g-green); }

/* The Choreography Canvas Core */
.cinematic-canvas-core {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 10;
}

/* Scene 1: The Anchor Point */
.intro-anchor-point {
  position: absolute;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: anchorKineticSequence 2.6s var(--ease-out-expo) forwards;
}

.anchor-svg {
  width: 100%;
  height: 100%;
}

@keyframes anchorKineticSequence {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-30deg);
  }
  30% {
    opacity: 1;
    transform: scale(1.1) rotate(0deg);
  }
  70% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: scale(1.6) rotate(15deg);
    visibility: hidden;
  }
}

/* Scene 2: Google Brand Shapes Constellation */
.intro-shapes-constellation {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.kinetic-brand-shape {
  position: absolute;
  opacity: 0;
  animation-fill-mode: forwards;
}

.shape-blue-ribbon {
  width: 90px;
  height: 90px;
  border-radius: 24px;
  background: var(--g-blue);
  top: 40%;
  left: 45%;
  animation: blueRibbonMotion 4.8s var(--ease-out-expo) forwards;
  animation-delay: 1.4s;
}

.shape-red-prism {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: var(--g-red);
  top: 42%;
  right: 42%;
  animation: redPrismMotion 4.8s var(--ease-out-expo) forwards;
  animation-delay: 1.6s;
}

.shape-amber-sparkle {
  width: 60px;
  height: 60px;
  background: var(--g-yellow);
  clip-path: polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%);
  bottom: 38%;
  left: 44%;
  animation: amberSparkleMotion 4.8s var(--ease-out-expo) forwards;
  animation-delay: 1.8s;
}

.shape-green-beam {
  width: 140px;
  height: 14px;
  border-radius: 9999px;
  background: var(--g-green);
  bottom: 36%;
  right: 40%;
  animation: greenBeamMotion 4.8s var(--ease-out-expo) forwards;
  animation-delay: 2.0s;
}

@keyframes blueRibbonMotion {
  0% { opacity: 0; transform: translate(0, 0) scale(0.2) rotate(-45deg); }
  30% { opacity: 0.9; transform: translate(-140px, -70px) scale(1) rotate(12deg); }
  75% { opacity: 0.9; transform: translate(-160px, -80px) scale(1.05) rotate(15deg); }
  100% { opacity: 0; transform: translate(-220px, -120px) scale(0.6); }
}

@keyframes redPrismMotion {
  0% { opacity: 0; transform: translate(0, 0) scale(0.2); }
  30% { opacity: 0.95; transform: translate(130px, -60px) scale(1.1); }
  75% { opacity: 0.95; transform: translate(145px, -70px) scale(1); }
  100% { opacity: 0; transform: translate(200px, -110px) scale(0.5); }
}

@keyframes amberSparkleMotion {
  0% { opacity: 0; transform: translate(0, 0) scale(0.2) rotate(0deg); }
  30% { opacity: 0.95; transform: translate(-110px, 90px) scale(1.2) rotate(45deg); }
  75% { opacity: 0.95; transform: translate(-120px, 105px) scale(1) rotate(90deg); }
  100% { opacity: 0; transform: translate(-180px, 150px) scale(0.4); }
}

@keyframes greenBeamMotion {
  0% { opacity: 0; transform: translate(0, 0) scaleX(0.2); }
  30% { opacity: 0.9; transform: translate(120px, 90px) scaleX(1); }
  75% { opacity: 0.9; transform: translate(135px, 100px) scaleX(1.1); }
  100% { opacity: 0; transform: translate(200px, 140px) scaleX(0.2); }
}

/* Scene 3: Monumental Typography «هلا بالمطور القوقلي» */
.intro-statement-stage {
  position: relative;
  z-index: 15;
  opacity: 0;
  animation: statementRevealStage 3.4s var(--ease-out-expo) forwards;
  animation-delay: 2.8s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes statementRevealStage {
  0% { opacity: 0; transform: translateY(32px) scale(0.96); }
  35% { opacity: 1; transform: translateY(0) scale(1); }
  85% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

.statement-hero-words {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: baseline;
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 7vw, 5.8rem);
  font-weight: 900;
  line-height: 1.15;
  margin: 0;
  text-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.word-reveal-wrap {
  display: inline-block;
  overflow: hidden;
}

.hero-word {
  display: inline-block;
  transform: translateY(100%);
  animation: wordSlideUp 1.1s var(--ease-out-expo) forwards;
}
.w-hala { animation-delay: 3.0s; color: #FFFFFF; }
.w-dev { animation-delay: 3.2s; color: #FFFFFF; }
.w-googley {
  animation-delay: 3.4s;
  color: var(--g-yellow);
  position: relative;
}
.w-googley::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--g-yellow);
  border-radius: 9999px;
  opacity: 0.7;
}

@keyframes wordSlideUp {
  0% { transform: translateY(110%); opacity: 0; }
  100% { transform: translateY(0%); opacity: 1; }
}

/* Google 4-Color Grounding Line (from Page 11 of Brand Guidelines) */
.brand-quad-line {
  display: flex;
  width: 220px;
  height: 5px;
  border-radius: 9999px;
  overflow: hidden;
  margin: 24px 0 18px 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
.q-bar { flex: 1; height: 100%; }
.bar-amber { background: var(--g-yellow); }
.bar-red { background: var(--g-red); }
.bar-blue { background: var(--g-blue); }
.bar-green { background: var(--g-green); }

.statement-sub-headline {
  font-size: 1.15rem;
  font-weight: 600;
  opacity: 0.9;
  letter-spacing: 0.5px;
  margin: 0 0 28px 0;
  max-width: 620px;
}

.statement-action-hub {
  display: flex;
  gap: 14px;
  align-items: center;
}

.btn-enter-stage {
  background: #FFFFFF;
  color: var(--g-blue-deep);
  border: none;
  font-family: var(--font-arabic);
  font-weight: 900;
  font-size: 1.05rem;
  padding: 14px 34px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  transition: all 0.25s var(--ease-out-expo);
}
.btn-enter-stage:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}
.enter-arrow-icon {
  font-size: 1.1rem;
  transition: transform 0.25s;
}
.btn-enter-stage:hover .enter-arrow-icon {
  transform: translateX(-4px);
}

/* ==========================================================================
   2. شاشة الدخول والتفعيل الأنيقة — Architectural Auth Dialog
   ========================================================================== */
.auth-stage-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99900;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
}

.auth-stage-overlay.active {
  display: flex !important;
  animation: modalFadeIn 0.3s var(--ease-out-expo);
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

.auth-card-frame {
  background: #FFFFFF;
  border-radius: 28px;
  box-shadow: var(--shadow-xl);
  max-width: 960px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  margin: auto;
}

.auth-intro-column {
  background: linear-gradient(145deg, #174EA6 0%, #1557B0 50%, #0D3880 100%);
  color: #FFFFFF;
  padding: 44px 36px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: right;
  position: relative;
  overflow: hidden;
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
  gap: 5px;
}
.bracket-l, .bracket-r { color: #FFFFFF; font-weight: 900; }
.google-dots-pair { display: inline-flex; gap: 4px; }
.g-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.g-dot.b { background: var(--g-blue); }
.g-dot.r { background: var(--g-red); }
.g-dot.y { background: var(--g-yellow); }
.g-dot.g { background: var(--g-green); }

.auth-header-text h2 {
  font-size: 1.2rem;
  font-weight: 900;
  margin: 0;
}
.auth-header-text p {
  font-size: 0.78rem;
  opacity: 0.85;
  margin: 2px 0 0 0;
  font-family: var(--font-latin);
}

.auth-manifesto-box {
  margin: 32px 0;
}
.auth-manifesto-box h3 {
  font-size: 1.45rem;
  font-weight: 900;
  margin: 0 0 12px 0;
  line-height: 1.35;
}
.auth-manifesto-box p {
  font-size: 0.92rem;
  opacity: 0.92;
  line-height: 1.7;
  margin: 0;
}

.security-badges-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
}
.sec-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
}

.btn-replay-splash-auth {
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.32);
  color: #FFFFFF;
  padding: 10px 18px;
  border-radius: 12px;
  font-family: var(--font-arabic);
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  margin-top: 14px;
}
.btn-replay-splash-auth:hover {
  background: rgba(255, 255, 255, 0.28);
}

.auth-form-column {
  padding: 40px 36px;
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
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border-subtle);
}

.quick-fill-btn {
  background: var(--bg-subtle);
  border: 1px solid var(--border-subtle);
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
  color: var(--text-primary);
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
  color: var(--text-primary);
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
  border: 1.5px solid var(--border-subtle);
  border-radius: 12px;
  font-family: var(--font-arabic);
  font-size: 0.92rem;
  color: var(--text-primary);
  outline: none;
  transition: all 0.2s ease;
}
.field-input:focus {
  border-color: var(--g-blue);
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.18);
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

.btn-primary-submit {
  width: 100%;
  background: var(--g-blue);
  color: #FFFFFF;
  border: none;
  padding: 13px 20px;
  border-radius: 12px;
  font-family: var(--font-arabic);
  font-weight: 900;
  font-size: 0.96rem;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.2s var(--ease-out-expo);
  box-shadow: 0 4px 14px rgba(66, 133, 244, 0.3);
}
.btn-primary-submit:hover {
  background: #1a73e8;
  transform: translateY(-1px);
}

/* ==========================================================================
   3. شريط التنقل العلوي — Editorial Studio Navbar
   ========================================================================== */
.main-navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 76px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  z-index: 1000;
  box-shadow: var(--shadow-xs);
}

.nav-brand-group {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  flex-shrink: 0;
}

.nav-brand-title h1 {
  font-size: 1rem;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}
.nav-brand-title p {
  font-size: 0.74rem;
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
  border: 1px solid var(--border-subtle);
  max-width: 65vw;
  overflow-x: auto;
  scrollbar-width: none;
}
.creative-tab-bar::-webkit-scrollbar { display: none; }

.creative-tab-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 8px 18px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 700;
  font-size: 0.86rem;
  cursor: pointer;
  transition: all 0.2s var(--ease-out-expo);
  white-space: nowrap;
}
.creative-tab-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.7);
}
.creative-tab-btn.active {
  background: var(--g-blue);
  color: #FFFFFF !important;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.32);
}

.nav-user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.role-switcher-toggle {
  background: var(--bg-subtle);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  padding: 7px 14px;
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
  color: var(--text-primary);
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
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
}

/* ==========================================================================
   4. الحاوية الرئيسية لكافة الصفحات — Main Viewport Container
   ========================================================================== */
.main-view-container {
  padding-top: 108px; /* Guaranteed clearance of fixed navbar */
  padding-bottom: 72px;
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 28px;
  padding-right: 28px;
}

.app-page-view {
  display: none;
}
.app-page-view.active {
  display: block;
  animation: pageFadeIn 0.35s var(--ease-out-expo);
}

@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==========================================================================
   5. الصفحة الرئيسية — Editorial Hero & Architectural Metrics
   ========================================================================== */
.hero-editorial-wrapper {
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: 32px;
  padding: 48px 44px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 40px;
  position: relative;
}

.hero-editorial-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 36px;
  align-items: center;
}

.hero-kicker-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--g-blue-light);
  color: var(--g-blue);
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 18px;
  border: 1px solid var(--g-blue-border);
}

.hero-editorial-headline {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.4vw, 3rem);
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
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
  border: 1px solid var(--border-subtle);
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

.hero-narrative-text {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.75;
  margin: 0 0 22px 0;
  max-width: 660px;
}

/* Member Capsule Card on Left */
.member-live-capsule {
  background: linear-gradient(145deg, #F8FAFC 0%, #EFF6FF 100%);
  border: 1.5px solid var(--g-blue-border);
  border-radius: 24px;
  padding: 28px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.capsule-header {
  display: flex;
  align-items: center;
  gap: 14px;
}
.capsule-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--g-blue);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 900;
  box-shadow: 0 4px 14px rgba(66, 133, 244, 0.35);
}
.capsule-name {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0;
}
.capsule-role {
  font-size: 0.8rem;
  color: var(--g-blue);
  font-weight: 800;
}

.capsule-streak-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  padding: 10px 14px;
}
.streak-num {
  font-weight: 900;
  color: #EA580C;
  font-size: 1rem;
}

/* 3 Architectural KPI Cards */
.kpi-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 36px;
}

.kpi-stat-card {
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: 24px;
  padding: 26px;
  box-shadow: var(--shadow-xs);
  transition: transform 0.25s var(--ease-out-expo), box-shadow 0.25s;
  position: relative;
  overflow: hidden;
}
.kpi-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.kpi-card-blue { border-top: 4px solid var(--g-blue); }
.kpi-card-amber { border-top: 4px solid var(--g-yellow); }
.kpi-card-green { border-top: 4px solid var(--g-green); }

.kpi-stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.kpi-stat-title {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--text-secondary);
}
.kpi-stat-icon { font-size: 1.35rem; }

.kpi-stat-val {
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--text-primary);
  margin: 10px 0 6px 0;
  letter-spacing: -0.5px;
}
.kpi-stat-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.55;
}

/* ==========================================================================
   6. رحلة التعلم التفاعلية — Subway / Milestone Journey
   ========================================================================== */
.roadmap-visual-box {
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: 28px;
  padding: 36px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 32px;
}

.roadmap-nodes-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  margin: 40px 0 24px 0;
}
.roadmap-nodes-row::before {
  content: '';
  position: absolute;
  top: 30px;
  right: 50px;
  left: 50px;
  height: 4px;
  background: #E2E8F0;
  z-index: 1;
}

.node-station-item {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 150px;
  cursor: pointer;
  transition: transform 0.2s var(--ease-out-expo);
}
.node-station-item:hover {
  transform: translateY(-2px);
}

.node-bubble {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 3.5px solid var(--border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.45rem;
  font-weight: 900;
  margin-bottom: 14px;
  box-shadow: var(--shadow-xs);
  transition: all 0.25s var(--ease-out-expo);
}

.node-station-item.done .node-bubble {
  background: var(--g-green);
  border-color: var(--g-green);
  color: #FFFFFF;
}
.node-station-item.current .node-bubble {
  background: var(--g-blue);
  border-color: var(--g-blue);
  color: #FFFFFF;
  box-shadow: 0 0 0 8px var(--g-blue-light);
}
.node-station-item.locked .node-bubble {
  background: var(--bg-subtle);
  border-color: var(--border-strong);
  color: var(--text-muted);
}

.node-title-text {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.4;
}

/* ==========================================================================
   7. معرض الأعمال الإبداعي — Digital Magazine Showcase
   ========================================================================== */
.magazine-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 28px;
}

.magazine-card {
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  transition: all 0.25s var(--ease-out-expo);
  display: flex;
  flex-direction: column;
}
.magazine-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.magazine-cover-art {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.magazine-badge-pill {
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(8px);
  padding: 4px 14px;
  border-radius: 9999px;
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--text-primary);
}

.tech-tag-badge {
  display: inline-block;
  background: var(--bg-subtle);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 8px;
  margin-left: 4px;
}

/* ==========================================================================
   8. لوحة القادة وقائمة الأعضاء — Modern Enterprise SaaS Table
   ========================================================================== */
.leader-banner-card {
  background: linear-gradient(135deg, #174EA6 0%, #1a73e8 60%, #0d3880 100%);
  color: #FFFFFF;
  border-radius: 28px;
  padding: 36px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-md);
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 20px;
}

.leader-banner-content h2 {
  font-size: 1.9rem;
  font-weight: 900;
  margin: 10px 0 6px 0;
}
.leader-banner-content p {
  font-size: 0.96rem;
  opacity: 0.92;
  max-width: 660px;
  margin: 0;
  line-height: 1.65;
}

.rewards-subtab-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 22px;
  background: #FFFFFF;
  padding: 8px;
  border-radius: 18px;
  border: 1px solid var(--border-subtle);
}

.leader-controls-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  padding: 16px 20px;
  margin-bottom: 18px;
  box-shadow: var(--shadow-xs);
}

.search-box-wrap {
  display: flex;
  align-items: center;
  background: var(--bg-subtle);
  border: 1.5px solid var(--border-subtle);
  border-radius: 12px;
  padding: 0 14px;
  flex: 1;
  max-width: 380px;
}
.search-icon { font-size: 0.95rem; color: var(--text-muted); }
.search-input {
  border: none;
  background: transparent;
  padding: 10px 8px;
  font-family: var(--font-arabic);
  font-size: 0.9rem;
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
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  padding: 7px 16px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.82rem;
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
  border: 1px solid var(--border-subtle);
  border-radius: 24px;
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
  font-size: 0.86rem;
  font-weight: 800;
  padding: 16px 22px;
  border-bottom: 2px solid var(--border-subtle);
  white-space: nowrap;
}

.members-data-table tbody tr {
  border-bottom: 1px solid var(--border-subtle);
  transition: background 0.15s ease;
}
.members-data-table tbody tr:hover {
  background: #F8FAFC;
}
.members-data-table tbody tr:last-child {
  border-bottom: none;
}

.members-data-table tbody td {
  padding: 16px 22px;
  font-size: 0.9rem;
  vertical-align: middle;
}

.member-name-main {
  font-weight: 900;
  color: var(--text-primary);
  font-size: 0.96rem;
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
  border: 1px solid var(--border-subtle);
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
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 4px 10px;
}
.token-val {
  font-family: var(--font-code);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
}
.btn-copy-token {
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
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
.btn-pending {
  background: var(--g-blue);
  color: #FFFFFF;
}

.btn-view-details {
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 6px 12px;
  font-family: var(--font-arabic);
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--text-secondary);
  cursor: pointer;
}

.btn-primary-google {
  background: var(--g-blue);
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 9999px;
  font-family: var(--font-arabic);
  font-weight: 800;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.28);
}
.btn-primary-google:hover {
  background: #1a73e8;
  transform: translateY(-1px);
}

.btn-card-outline {
  background: #FFFFFF;
  border: 1.5px solid var(--border-subtle);
  color: var(--text-primary);
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
  background: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 10001;
}
.celebration-modal-backdrop.show { display: flex !important; }

.celebration-card-dialog {
  background: #FFFFFF;
  border-radius: 28px;
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 640px;
  padding: 32px;
  text-align: right;
  border: 1px solid var(--border-subtle);
  max-height: 90vh;
  overflow-y: auto;
}

/* Respect Prefers-Reduced-Motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .intro-anchor-point { animation: none; opacity: 1; }
  .intro-statement-stage { animation: none; opacity: 1; }
  .hero-word { transform: none; animation: none; opacity: 1; }
}

@media (max-width: 992px) {
  .hero-editorial-grid { grid-template-columns: 1fr; }
  .kpi-cards-grid { grid-template-columns: 1fr; }
  .auth-card-frame { grid-template-columns: 1fr; }
  .auth-intro-column { padding: 28px 24px; }
  .main-navbar { padding: 12px 20px; height: auto; flex-wrap: wrap; }
  .creative-tab-bar { order: 3; width: 100%; overflow-x: auto; max-width: 100%; }
  .main-view-container { padding-top: 140px; }
}
`;

// Write to styles.css
fs.writeFileSync(cssPath, creativeDirectorCss, 'utf8');

// =============================================================================
// B. Build the Opening Sequence HTML & Hero HTML in index.html
// =============================================================================
// Replace old splash Overlay with the new 4-scene Cinematic Intro
const newCinematicIntroHtml = `  <!-- ==========================================================================
       الافتتاحية السينمائية الشاملة — Full-screen Cinematic Sequence
       (المشهد 1: النقطة الهندسية الزرقاء | المشهد 2: حوار الأشكال القوقلية | المشهد 3: «هلا بالمطور القوقلي» | المشهد 4: الانسياب التفاعلي إلى المنصة)
       ========================================================================== -->
  <div class="cinematic-stage-overlay" id="cinematicIntroStage">
    <!-- Top Right Controls -->
    <div class="cinematic-top-controls">
      <button type="button" class="intro-skip-pill" onclick="skipCinematicIntro()" title="تخطي للمنصة مباشرة (مفتاح Esc)">
        <span>تخطي للمنصة</span>
        <span class="skip-key-badge">Esc ✕</span>
      </button>

      <div class="intro-brand-stamp">
        <span class="be-googley-tag">Be Googley</span>
        <span class="identity-dot y"></span>
        <span class="identity-dot r"></span>
        <span class="identity-dot b"></span>
        <span class="identity-dot g"></span>
      </div>
    </div>

    <!-- The Kinetic Choreography Canvas -->
    <div class="cinematic-canvas-core" id="cinematicCanvasCore">
      
      <!-- Scene 1: The Geometric Anchor (Google Code Bracket) -->
      <div class="intro-anchor-point" id="introAnchorPoint">
        <svg viewBox="0 0 120 120" class="anchor-svg">
          <path d="M 45 30 L 15 60 L 45 90" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M 75 30 L 105 60 L 75 90" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="60" cy="60" r="10" fill="#F9AB00" />
        </svg>
      </div>

      <!-- Scene 2: Google Quad-Color Metamorphosis -->
      <div class="intro-shapes-constellation" id="introShapesConstellation">
        <div class="kinetic-brand-shape shape-blue-ribbon"></div>
        <div class="kinetic-brand-shape shape-red-prism"></div>
        <div class="kinetic-brand-shape shape-amber-sparkle"></div>
        <div class="kinetic-brand-shape shape-green-beam"></div>
      </div>

      <!-- Scene 3: The Monumental Typography «هلا بالمطور القوقلي» -->
      <div class="intro-statement-stage" id="introStatementStage">
        <div class="statement-hero-words">
          <span class="word-reveal-wrap"><span class="hero-word w-hala">هلا</span></span>
          <span class="word-reveal-wrap"><span class="hero-word w-dev">بالمطور</span></span>
          <span class="word-reveal-wrap"><span class="hero-word w-googley">القوقلي</span></span>
        </div>
        
        <!-- Google 4-Color Grounding Line (Page 11 Guidelines) -->
        <div class="brand-quad-line">
          <span class="q-bar bar-amber"></span>
          <span class="q-bar bar-red"></span>
          <span class="q-bar bar-blue"></span>
          <span class="q-bar bar-green"></span>
        </div>

        <p class="statement-sub-headline">
          مجال تصميم وتطوير الويب • Google Developer Groups on Campus — جامعة الطائف
        </p>

        <div class="statement-action-hub">
          <button type="button" class="btn-enter-stage" onclick="skipCinematicIntro()">
            <span>انطلق نحو المنصة</span>
            <span class="enter-arrow-icon">➔</span>
          </button>
        </div>
      </div>

    </div>
  </div>`;

// Replace the old splashOverlay in html
html = html.replace(/<!-- ==========================================================================\s*1\. شاشة البداية[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- ==========================================================================\s*2\. شاشة الدخول/g, `${newCinematicIntroHtml}\n\n  <!-- ==========================================================================\n       2. شاشة الدخول`);

// Embed the new Creative Director CSS into <style id="perfectModernStyle">
const styleTag = `<style id="perfectModernStyle">\n${creativeDirectorCss}\n</style>`;
if (html.includes('<style id="perfectModernStyle">')) {
  html = html.replace(/<style id="perfectModernStyle">[\s\S]*?<\/style>/, styleTag);
} else {
  html = html.replace('</head>', `${styleTag}\n</head>`);
}

// Ensure fonts include IBM Plex Sans Arabic and Arimo
const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;600;700&family=Cairo:wght@400;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">`;

html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?family=Tajawal[^\"]*\" rel=\"stylesheet\">/, fontLink);

// Cache-bust
html = html.replace(/styles\.css\?v=[^"]*/g, 'styles.css?v=2026_creative_v14');
html = html.replace(/script\.js\?v=[^"]*/g, 'script.js?v=2026_creative_v14');

fs.writeFileSync(indexPath, html, 'utf8');

// =============================================================================
// C. Update script.js with Cinematic Sequence Timer & Keyboard Listeners
// =============================================================================
const cinematicIntroJsSnippet = `
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
`;

// Replace old chrome card functions in script.js
if (js.includes('function nextChromeCard()')) {
  js = js.replace(/function nextChromeCard\(\)[\s\S]*?function transitionToAuth\(\) \{[\s\S]*?\}/, cinematicIntroJsSnippet);
}

// In DOMContentLoaded, call initCinematicIntro
if (!js.includes('initCinematicIntro()')) {
  js = js.replace('initConfettiCanvas();', 'initConfettiCanvas();\n  initCinematicIntro();');
}

fs.writeFileSync(jsPath, js, 'utf8');

console.log('Successfully implemented the complete Creative Director Edition across HTML, CSS, and JS!');
