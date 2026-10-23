const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const modernHeroHtml = `        <!-- Editorial Studio Hero Section -->
        <div class="hero-editorial-wrapper">
          <div class="hero-editorial-grid">
            <!-- Right Column: Narrative & Display Typography -->
            <div class="hero-editorial-main">
              <div class="hero-kicker-badge">
                <span class="g-dot b"></span>
                <span class="g-dot r"></span>
                <span class="g-dot y"></span>
                <span class="g-dot g"></span>
                <span id="heroWelcomeBadgeText">مجال تصميم وتطوير الويب • GDG on Campus TU</span>
              </div>

              <h1 class="hero-editorial-headline" id="heroMainHeading">
                الويب مساحة تُبنى بالأكواد، وتنبض بالأفكار.
              </h1>

              <!-- Dynamic Rotating Words Engine -->
              <div class="dynamic-rotator-container">
                <span>هنا مساحة لكل</span>
                <span class="rotator-changing-word" id="rotatorChangingWord">مبدع 🚀</span>
              </div>

              <!-- Google 4-Color Brand Line (Page 11 Identity Guidelines) -->
              <div class="brand-quad-line" style="margin: 14px 0 20px 0;">
                <span class="q-bar bar-amber"></span>
                <span class="q-bar bar-red"></span>
                <span class="q-bar bar-blue"></span>
                <span class="q-bar bar-green"></span>
              </div>

              <p class="hero-narrative-text">
                بيئة رقمية إبداعية وتفاعلية تجمع بين التعلم العملي، والتطبيق الحي، والتحديات الأسبوعية، والمكافآت المعتمدة لأعضاء نادي قوقل للطلبة المطورين بجامعة الطائف.
              </p>
            </div>

            <!-- Left Column: Live Member Status Capsule -->
            <div class="member-live-capsule">
              <div class="capsule-header">
                <div class="capsule-avatar" id="capsuleAvatar">غ</div>
                <div>
                  <h3 class="capsule-name" id="capsuleName">غيداء تركي الشريف</h3>
                  <div class="capsule-role" id="capsuleRole">قائدة ومؤسسة المسار 🛡️</div>
                </div>
              </div>

              <div class="capsule-streak-row">
                <span style="font-size:0.85rem; font-weight:800; color:var(--text-secondary);">🔥 حماس التفاعل المستمر</span>
                <span class="streak-num">5 أيام متتالية</span>
              </div>

              <div style="background:#FFFFFF; border:1px solid var(--border-subtle); border-radius:14px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">المهمة الحالية:</span>
                <span style="font-size:0.82rem; font-weight:800; color:var(--g-blue);">تحدي Flexbox & Grid</span>
              </div>

              <button class="btn-primary-google" style="padding:8px 14px; font-size:0.82rem;" onclick="showPlatformPage('challenges')">
                <span>متابعة مهامي الآن</span>
                <span>➔</span>
              </button>
            </div>
          </div>

          <!-- 3 Architectural Metric Tiles -->
          <div class="kpi-cards-grid">
            <div class="kpi-stat-card kpi-card-blue">
              <div class="kpi-stat-header">
                <span class="kpi-stat-title">1. مؤشر التفاعل الأسبوعي</span>
                <span class="kpi-stat-icon">⚡</span>
              </div>
              <div class="kpi-stat-val" id="kpiEngagementScore">92%</div>
              <p class="kpi-stat-desc">يقيس انتظام حضورك في الورش، وحل التحديات البرمجية، والمشاركة في مجتمع المسار.</p>
            </div>

            <div class="kpi-stat-card kpi-card-amber">
              <div class="kpi-stat-header">
                <span class="kpi-stat-title">2. مساهمة المبادرات</span>
                <span class="kpi-stat-icon">🤝</span>
              </div>
              <div class="kpi-stat-val" id="kpiInitiativesCount">2 مبادرات</div>
              <p class="kpi-stat-desc">المشاريع الإضافية والتعاون الإبداعي المشترك مع الفرق التقنية الأخرى بجامعة الطائف.</p>
            </div>

            <div class="kpi-stat-card kpi-card-green">
              <div class="kpi-stat-header">
                <span class="kpi-stat-title">3. التحديات المنجزة</span>
                <span class="kpi-stat-icon">🏆</span>
              </div>
              <div class="kpi-stat-val" id="kpiChallengesProgress">3 من 5 منجزة</div>
              <p class="kpi-stat-desc">التحديات التخصصية الثلاثة + تحدي تكامل المجالات + المشروع الفصلي التتويجي.</p>
            </div>
          </div>
        </div>`;

// Replace the old hero in html
html = html.replace(/<!-- Hero Box with Dynamic Rotator -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- قسم هذا الأسبوع/g, `${modernHeroHtml}\n\n        <!-- قسم هذا الأسبوع`);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully upgraded index.html Hero to Editorial Studio Edition!');
