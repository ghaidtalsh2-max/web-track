-- =============================================================================
-- GDG on Campus — Taif University (Web Track Platform 2026)
-- Complete Seed Data with Test Accounts (Tagged is_demo = true)
--
-- SINGLE-COMMAND CLEANUP:
-- DELETE FROM profiles WHERE is_demo = true;
-- =============================================================================

-- Clean up any prior demo records cleanly
DELETE FROM profiles WHERE is_demo = true;

-- 1. SEED PROFILES
INSERT INTO profiles (
  id, full_name, username, gender, role, role_title, web_level, web_level_title, level_number, points, avatar_letter, badge_color, major, academic_year, bio, onboarded_at, is_demo
) VALUES
-- 1.1 Leader: Ghaidaa Al-Shareef
(
  'leader-ghaidaa',
  'غيداء تركي الشريف',
  'ghaidaa.lead',
  'female',
  'track_leader',
  'قائدة مسار الويب 🛡️',
  'track_leader',
  'قيادة وإدارة مسار الويب',
  3,
  1250,
  'غ',
  '#4285F4',
  'علوم حاسب',
  'السنة الرابعة',
  'قائدة مسار تصميم وتطوير الويب بنادي قوقل للطلبة المطورين بجامعة الطائف.',
  '2026-09-01 10:00:00+03',
  true
),
-- 1.2 Leader: Retal Al-Qathami
(
  'leader-retal',
  'ريتال القثامي',
  'retal.lead',
  'female',
  'track_leader',
  'قائدة مسار الويب 🛡️',
  'track_leader',
  'قيادة وإدارة مسار الويب',
  3,
  1250,
  'ر',
  '#34A853',
  'تقنية معلومات',
  'السنة الرابعة',
  'قائدة مسار تصميم وتطوير الويب وشغوفة بتطوير البرمجيات والواجهات السحابية.',
  '2026-09-01 10:00:00+03',
  true
),
-- 1.3 Supervisor: Atheer Al-Otaibi
(
  'supervisor-atheer',
  'أثير العتيبي',
  'atheer.super',
  'female',
  'supervisor',
  'قائدة المجالات 🌟',
  'advanced',
  'قيادة المجالات والإشراف',
  3,
  980,
  'أ',
  '#EA4335',
  'هندسة حاسب',
  'السنة الرابعة',
  'إشراف عام ومتابعة مسارات النادي وتطوير أداء الفرق.',
  '2026-09-01 10:00:00+03',
  true
),
-- 1.4 Supervisor: Amer Al-Harthi
(
  'supervisor-amer',
  'عامر الحارثي',
  'amer.super',
  'male',
  'supervisor',
  'نائب قائدة المجالات 🌟',
  'advanced',
  'إشراف ومتابعة مسارات النادي',
  3,
  950,
  'ع',
  '#4285F4',
  'علوم حاسب',
  'السنة الرابعة',
  'نائب قائدة المجالات بنادي الطلبة المطورين بجامعة الطائف ومتابع جودة المخرجات.',
  '2026-09-01 10:00:00+03',
  true
),
-- 1.5 Member (Intermediate): Noura Al-Otaibi (Main Reference Profile)
(
  'member-noura',
  'نورة العتيبي',
  'noura.web26',
  'female',
  'member',
  'عضو مسار الويب 🚀',
  'intermediate',
  'المرحلة 2: التطوير التفاعلي',
  2,
  350,
  'ن',
  '#4285F4',
  'علوم حاسب',
  'السنة الثالثة',
  'طالبة علوم حاسب بجامعة الطائف، شغوفة بتصميم وتطوير واجهات وتجارب الويب الحديثة التفاعلية.',
  '2026-10-20 10:00:00+03',
  true
),
-- 1.6 Member (Beginner): Dana Al-Harthi
(
  'member-dana',
  'دانا الحارثي',
  'dana.web26',
  'female',
  'member',
  'عضو مسار الويب 🚀',
  'beginner',
  'المرحلة 1: التأسيس والتصميم البرمجي',
  1,
  165,
  'د',
  '#F9AB00',
  'تقنية معلومات',
  'السنة الثانية',
  'طالبة تقنية معلومات شغوفة بتعلم بناء واجهات الويب التفاعلية الحديثة واستكشاف تقنيات قوقل.',
  '2026-10-01 10:00:00+03',
  true
),
-- 1.7 Member (Intermediate Male): Ahmed Al-Ghamdi
(
  'member-ahmed',
  'أحمد الغامدي',
  'ahmed.web26',
  'male',
  'member',
  'عضو مسار الويب 🚀',
  'intermediate',
  'المرحلة 2: التطوير التفاعلي',
  2,
  280,
  'أ',
  '#EA4335',
  'هندسة حاسب',
  'السنة الثالثة',
  'مهتم بتطوير الواجهات الأمامية والأنظمة التفاعلية وبناء حلول ويب عملية وجميلة.',
  '2026-10-02 10:00:00+03',
  true
),
-- 1.8 Member (New - Onboarding test): Sara Al-Zahrani (onboarded_at is NULL)
(
  'member-new',
  'سارة الزهراني',
  'sara.new',
  'female',
  'member',
  'عضو جديد (تجربة أول دخول) 🚀',
  'beginner',
  'المرحلة 1: التأسيس والتصميم البرمجي',
  1,
  50,
  'س',
  '#34A853',
  'نظم معلومات',
  'السنة الأولى',
  NULL,
  NULL,
  true
),
-- 1.9 Supervisor: Rana Amin Faydh
(
  'supervisor-rana',
  'رنا أمين فيض',
  'rana.super',
  'female',
  'supervisor',
  'مستشارة النادي ونائبة القادة 🌟',
  'advanced',
  'استشارة النادي ومتابعة الإشراف والقيادة',
  3,
  960,
  'ر',
  '#34A853',
  'تقنية معلومات',
  'السنة الرابعة',
  'مستشارة النادي ونائبة القادة بنادي قوقل للطلبة المطورين بجامعة الطائف، متابعة جودة المخرجات وتطوير المسارات.',
  '2026-10-23 02:27:34+03',
  true
),
-- 1.10 Member: Rana Amin Faydh
(
  'member-rana',
  'رنا أمين فيض',
  'rana.web26',
  'female',
  'member',
  'عضو مسار الويب 🚀',
  'intermediate',
  'المرحلة 2: التطوير التفاعلي',
  2,
  250,
  'ر',
  '#34A853',
  'تقنية معلومات',
  'السنة الرابعة',
  'طالبة تقنية معلومات، مهتمة بتطوير واجهات وتطبيقات الويب وربط الواجهات وتجربة المستخدم.',
  '2026-10-23 02:27:34+03',
  true
);

-- 2. SEED STAGES
INSERT INTO stages (stage_number, title, subtitle, status) VALUES
(1, 'التأسيس', 'مكتملة', 'completed'),
(2, 'التطوير التفاعلي', 'أنتِ هنا', 'current'),
(3, 'البناء والتخصص', 'تنفتح بعد المرحلة 2', 'locked')
ON CONFLICT (stage_number) DO UPDATE
SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, status = EXCLUDED.status;

-- 3. SEED MEMBER SKILLS
INSERT INTO member_skills (profile_id, skill_name, progress_percent, status) VALUES
('member-noura', 'HTML', 100, 'approved'),
('member-noura', 'CSS', 75, 'in_progress'),
('member-noura', 'JavaScript', 40, 'upcoming'),
('member-ahmed', 'HTML', 100, 'approved'),
('member-ahmed', 'CSS', 100, 'approved'),
('member-dana', 'HTML', 100, 'approved')
ON CONFLICT (profile_id, skill_name) DO NOTHING;

-- 4. SEED TASKS
INSERT INTO tasks (id, title, description, target_level, points, due_date, criteria, is_demo) VALUES
(
  'task-interactive-btn',
  'تحدي «زر يتفاعل»',
  'بناء زر تفاعلي باستخدام HTML و CSS مع تأثيرات الانتقال والتفاعل وإطلاق احتفال بصري.',
  'all',
  50,
  'باقي يومين · آخر موعد الخميس',
  'استخدام الانتقالات الناعمة Transition وتغيير الألوان والظلال عند Hover وActive.',
  true
),
(
  'task-css-card',
  'بطاقة ملف عضو تفاعلية',
  'تطبيق Flexbox لتنسيق بطاقة بروفايل مع ألوان الهوية وزر تواصل.',
  'beginner',
  35,
  'الأحد القادم',
  'استخدام التخطيط المرن وتقسيم العناصر بشكل صحيح.',
  true
)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 5. SEED SUBMISSIONS
INSERT INTO submissions (id, task_id, profile_id, repo_url, live_url, notes, status, points_awarded, is_demo) VALUES
(
  'sub-1',
  'task-interactive-btn',
  'member-noura',
  'https://github.com/gdgoc-taif/html-portfolio-demo',
  'https://gdgoc-taif.github.io/html-portfolio-demo',
  'تم إكمال التحدي وتطبيق الانتقالات والتأثيرات الحركية بدقة.',
  'in_review',
  0,
  true
)
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- 6. SEED NOTIFICATIONS
INSERT INTO notifications (id, profile_id, type, title, description, badge_text, points_amount, target_tab, read, is_demo) VALUES
(
  'notif-1',
  'member-noura',
  'points',
  'نقاط جديدة',
  'قبلنا تسليمك: صفحتك الأولى',
  '30+',
  30,
  'home',
  true,
  true
),
(
  'notif-2',
  'member-noura',
  'workshop',
  'ورشة جديدة',
  'Grid و Flexbox · الأحد ٨ مساءً',
  '◆',
  NULL,
  'community',
  true,
  true
),
(
  'notif-3',
  'member-noura',
  'task',
  'مهمة جديدة',
  'تحدي: زر يتفاعل · آخر موعد الخميس',
  '!',
  NULL,
  'home',
  true,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED POLLS & OPTIONS
INSERT INTO polls (id, title, total_votes, points_reward, is_active, expires_at, is_demo) VALUES
(
  'poll-weekly-workshop',
  'أي ورشة تبغون الأسبوع الجاي؟',
  24,
  15,
  true,
  now() + interval '3 days',
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO poll_options (id, poll_id, text, votes_count) VALUES
('opt-1', 'poll-weekly-workshop', 'Flexbox و Grid عملياً', 11),
('opt-2', 'poll-weekly-workshop', 'JavaScript والأحداث التفاعلية', 8),
('opt-3', 'poll-weekly-workshop', 'Git و GitHub من الصفر', 3),
('opt-4', 'poll-weekly-workshop', 'تصميم واجهات الويب UI', 2)
ON CONFLICT (id) DO NOTHING;

-- 8. SEED INQUIRIES
INSERT INTO inquiries (id, profile_id, user_name, title, details, status, response_text, answered_by, is_demo) VALUES
(
  'inq-1',
  'member-dana',
  'دانا الحارثي',
  'استفسار عن موعد الورشة القادمة',
  'متى موعد الورشة القادمة الخاصة بالـ CSS Flexbox؟',
  'new',
  NULL,
  NULL,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 9. SEED EVALUATIONS (Supervisor Performance Review)
INSERT INTO evaluations (
  id, leader_id, supervisor_id, period, score_commitment, score_quality, score_initiative, score_engagement, score_collaboration, overall_score, strengths, improvements, recommendations, follow_up_status, is_demo
) VALUES
(
  'eval-ghaidaa-q1',
  'leader-ghaidaa',
  'supervisor-atheer',
  'الربع الأول 2026',
  5, 5, 4, 5, 5,
  4.80,
  'التزام استثنائي بالمواعيد وتفاعل عالي مع الأعضاء وتنظيم ورش متميزة في مسار الويب.',
  'زيادة عدد جلسات الإرشاد الفردي وتوسيع التحديات المتقدمة للأعضاء المتميزين.',
  'إطلاق هاكاثون مصغر لمسار الويب في نهاية المرحلة الثانية لتعزيز العمل الجماعي.',
  'completed',
  true
),
(
  'eval-retal-q1',
  'leader-retal',
  'supervisor-amer',
  'الربع الأول 2026',
  5, 5, 5, 5, 4,
  4.90,
  'قيادة تقنية رفيعة وتنظيم فائق لمعايير المراجعة وإدارة بيئة سطر ومستودعات المشاريع.',
  'تشجيع مزيد من الأعضاء على النشر العام لمشاريعهم على GitHub Pages.',
  'عقد جلسة إرشادية شهرية مفتوحة لمراجعة أسئلة البرمجة والأنظمة التفاعلية.',
  'completed',
  true
)
ON CONFLICT (id) DO NOTHING;
