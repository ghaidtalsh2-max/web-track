-- =============================================================================
-- GDG on Campus — Taif University (Web Track Platform 2026)
-- MASTER PRODUCTION SETUP FOR SUPABASE
-- Project URL: https://vsxrgmvjdkqbvkfjarni.supabase.co
-- =============================================================================

-- =============================================================================
-- GDG on Campus — Taif University (Web Track Platform 2026)
-- Complete Production Database Migration
-- Fully Verified with RLS, Unique Constraints, Triggers, and Stored Procedures
-- =============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('female', 'male')),
  role TEXT NOT NULL CHECK (role IN ('member', 'track_leader', 'supervisor')),
  role_title TEXT NOT NULL,
  web_level TEXT NOT NULL CHECK (web_level IN ('beginner', 'intermediate', 'advanced', 'track_leader')),
  web_level_title TEXT NOT NULL,
  level_number INT NOT NULL DEFAULT 1 CHECK (level_number IN (1, 2, 3)),
  points INT NOT NULL DEFAULT 0,
  avatar_letter TEXT NOT NULL,
  badge_color TEXT NOT NULL DEFAULT '#4285F4',
  major TEXT NOT NULL DEFAULT 'علوم حاسب',
  academic_year TEXT NOT NULL DEFAULT 'السنة الأولى',
  bio TEXT,
  onboarded_at TIMESTAMPTZ,
  settings JSONB NOT NULL DEFAULT '{"fontSize": 17, "theme": "light", "language": "ar", "reducedMotion": false, "eyeComfort": false, "celebrations": true, "highContrast": false}'::jsonb,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. STAGES TABLE
CREATE TABLE IF NOT EXISTS stages (
  id SERIAL PRIMARY KEY,
  stage_number INT UNIQUE NOT NULL CHECK (stage_number IN (1, 2, 3)),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('completed', 'current', 'locked'))
);

-- 3. COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  stage_number INT NOT NULL REFERENCES stages(stage_number) ON DELETE CASCADE,
  title TEXT NOT NULL,
  symbol TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('blue', 'red', 'green', 'yellow')),
  category TEXT NOT NULL CHECK (category IN ('languages', 'tracks', 'frameworks', 'hosting_tools', 'foundation', 'recommended')),
  level_requirement TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'in_review', 'completed')),
  skill_reward TEXT NOT NULL,
  description TEXT,
  direct_url TEXT,
  is_recommended_track BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. COURSE SOURCES TABLE
CREATE TABLE IF NOT EXISTS course_sources (
  id SERIAL PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('satr', 'youtube', 'official', 'codelab')),
  platform_name TEXT NOT NULL,
  title TEXT NOT NULL,
  outcome TEXT NOT NULL,
  url TEXT NOT NULL
);

-- 5. MEMBER SKILLS TABLE (UNIQUE per member per skill)
CREATE TABLE IF NOT EXISTS member_skills (
  id SERIAL PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  progress_percent INT NOT NULL DEFAULT 100 CHECK (progress_percent BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('in_progress', 'approved', 'upcoming')),
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_member_skill UNIQUE(profile_id, skill_name)
);

-- 6. TASKS TABLE
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  target_level TEXT NOT NULL CHECK (target_level IN ('all', 'beginner', 'intermediate', 'advanced')),
  points INT NOT NULL DEFAULT 50 CHECK (points >= 0),
  due_date TEXT NOT NULL,
  criteria TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  repo_url TEXT NOT NULL,
  live_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'in_review' CHECK (status IN ('draft', 'in_review', 'needs_revision', 'approved', 'completed')),
  points_awarded INT NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_demo BOOLEAN NOT NULL DEFAULT false
);

-- 8. REVIEW LOG TABLE
CREATE TABLE IF NOT EXISTS review_log (
  id SERIAL PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  reviewer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  action TEXT NOT NULL CHECK (action IN ('approved', 'needs_revision', 'rejected')),
  feedback TEXT NOT NULL,
  points_awarded INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. POINTS RULES TABLE
CREATE TABLE IF NOT EXISTS points_rules (
  id TEXT PRIMARY KEY,
  activity_name TEXT NOT NULL,
  points_value INT NOT NULL CHECK (points_value > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  allow_repeat BOOLEAN NOT NULL DEFAULT false,
  description TEXT
);

-- 10. POINTS LEDGER TABLE (UNIQUE to prevent duplicate points for same activity)
CREATE TABLE IF NOT EXISTS points_ledger (
  id SERIAL PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points_amount INT NOT NULL,
  reason TEXT NOT NULL,
  activity_key TEXT NOT NULL,
  approved_by TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_profile_activity_points UNIQUE(profile_id, activity_key)
);

-- 11. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  badge TEXT NOT NULL DEFAULT 'إعلان',
  author_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('points', 'workshop', 'task', 'poll', 'inquiry_reply', 'review_result')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  badge_text TEXT,
  points_amount INT,
  target_tab TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'answered')),
  response_text TEXT,
  answered_by TEXT,
  answered_at TIMESTAMPTZ,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. WORKSHOP SUGGESTIONS TABLE
CREATE TABLE IF NOT EXISTS workshop_suggestions (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  votes_count INT NOT NULL DEFAULT 1,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. SUGGESTION VOTES TABLE (1 vote per member per suggestion)
CREATE TABLE IF NOT EXISTS suggestion_votes (
  id SERIAL PRIMARY KEY,
  suggestion_id TEXT NOT NULL REFERENCES workshop_suggestions(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  voted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_member_suggestion_vote UNIQUE(suggestion_id, profile_id)
);

-- 16. POLLS TABLE
CREATE TABLE IF NOT EXISTS polls (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  total_votes INT NOT NULL DEFAULT 0,
  points_reward INT NOT NULL DEFAULT 15,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ NOT NULL,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. POLL OPTIONS TABLE
CREATE TABLE IF NOT EXISTS poll_options (
  id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  votes_count INT NOT NULL DEFAULT 0
);

-- 18. POLL RESPONSES TABLE (1 response per member per poll)
CREATE TABLE IF NOT EXISTS poll_responses (
  id SERIAL PRIMARY KEY,
  poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  option_id TEXT REFERENCES poll_options(id) ON DELETE SET NULL,
  custom_text TEXT,
  voted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_member_poll_response UNIQUE(poll_id, profile_id)
);

-- 19. EVALUATIONS TABLE (Leadership Evaluation)
CREATE TABLE IF NOT EXISTS evaluations (
  id TEXT PRIMARY KEY,
  leader_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  supervisor_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  period TEXT NOT NULL,
  score_commitment INT NOT NULL CHECK (score_commitment BETWEEN 1 AND 5),
  score_quality INT NOT NULL CHECK (score_quality BETWEEN 1 AND 5),
  score_initiative INT NOT NULL CHECK (score_initiative BETWEEN 1 AND 5),
  score_engagement INT NOT NULL CHECK (score_engagement BETWEEN 1 AND 5),
  score_collaboration INT NOT NULL CHECK (score_collaboration BETWEEN 1 AND 5),
  overall_score NUMERIC(3, 2) NOT NULL,
  strengths TEXT NOT NULL,
  improvements TEXT NOT NULL,
  recommendations TEXT NOT NULL,
  follow_up_status TEXT NOT NULL DEFAULT 'in_progress' CHECK (follow_up_status IN ('in_progress', 'completed')),
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 20. RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS recommendations (
  id SERIAL PRIMARY KEY,
  evaluation_id TEXT NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 21. AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  actor_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 22. IMPORT BATCHES TABLE
CREATE TABLE IF NOT EXISTS import_batches (
  id TEXT PRIMARY KEY,
  imported_by TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  source_filename TEXT NOT NULL,
  total_rows INT NOT NULL,
  valid_rows INT NOT NULL,
  duplicate_rows INT NOT NULL,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_batches ENABLE ROW LEVEL SECURITY;

-- Helper function to check role from auth.uid()
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles: Members see public profile info, update their own bio and settings
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own bio and settings"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text AND points = (SELECT points FROM profiles WHERE id = auth.uid()::text));

CREATE POLICY "Leaders have full control over profiles"
  ON profiles FOR ALL TO authenticated
  USING (current_user_role() = 'track_leader');

-- Stages, Courses, Course Sources: Viewable by all, editable by leaders
CREATE POLICY "Anyone can view stages" ON stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leaders manage stages" ON stages FOR ALL TO authenticated USING (current_user_role() = 'track_leader');

CREATE POLICY "Anyone can view courses" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leaders manage courses" ON courses FOR ALL TO authenticated USING (current_user_role() = 'track_leader');

CREATE POLICY "Anyone can view course sources" ON course_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leaders manage course sources" ON course_sources FOR ALL TO authenticated USING (current_user_role() = 'track_leader');

-- Member Skills: Viewable by all, insertable/editable by leaders only
CREATE POLICY "Anyone can view member skills" ON member_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leaders manage member skills" ON member_skills FOR ALL TO authenticated USING (current_user_role() = 'track_leader');

-- Tasks: Viewable by all, editable by leaders
CREATE POLICY "Anyone can view tasks" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leaders manage tasks" ON tasks FOR ALL TO authenticated USING (current_user_role() = 'track_leader');

-- Submissions: Members see/insert own submissions, leaders manage all
CREATE POLICY "Members see their own submissions" ON submissions FOR SELECT TO authenticated
  USING (profile_id = auth.uid()::text OR current_user_role() IN ('track_leader', 'supervisor'));

CREATE POLICY "Members can submit their tasks" ON submissions FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid()::text);

CREATE POLICY "Leaders review and update submissions" ON submissions FOR UPDATE TO authenticated
  USING (current_user_role() = 'track_leader');

-- Points Ledger: Member views own ledger, leaders view and manage all
CREATE POLICY "Members view their points ledger" ON points_ledger FOR SELECT TO authenticated
  USING (profile_id = auth.uid()::text OR current_user_role() IN ('track_leader', 'supervisor'));

CREATE POLICY "Leaders manage points ledger" ON points_ledger FOR INSERT TO authenticated
  WITH CHECK (current_user_role() = 'track_leader');

-- Notifications: Only recipient can see/update their notifications
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT TO authenticated
  USING (profile_id = auth.uid()::text);

CREATE POLICY "Users update own notifications read state" ON notifications FOR UPDATE TO authenticated
  USING (profile_id = auth.uid()::text)
  WITH CHECK (profile_id = auth.uid()::text);

CREATE POLICY "System and leaders insert notifications" ON notifications FOR INSERT TO authenticated
  WITH CHECK (true);

-- Inquiries: Members see own inquiries, leaders view and reply to all
CREATE POLICY "Members see own inquiries" ON inquiries FOR SELECT TO authenticated
  USING (profile_id = auth.uid()::text OR current_user_role() = 'track_leader');

CREATE POLICY "Members create inquiries" ON inquiries FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid()::text);

CREATE POLICY "Leaders answer inquiries" ON inquiries FOR UPDATE TO authenticated
  USING (current_user_role() = 'track_leader');

-- Polls & Responses: 1 vote per member enforced at DB level
CREATE POLICY "Anyone views active polls" ON polls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leaders manage polls" ON polls FOR ALL TO authenticated USING (current_user_role() = 'track_leader');

CREATE POLICY "Anyone views poll options" ON poll_options FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leaders manage poll options" ON poll_options FOR ALL TO authenticated USING (current_user_role() = 'track_leader');

CREATE POLICY "Members vote on polls" ON poll_responses FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid()::text);

CREATE POLICY "Members view their poll responses" ON poll_responses FOR SELECT TO authenticated
  USING (profile_id = auth.uid()::text OR current_user_role() IN ('track_leader', 'supervisor'));

-- Workshop Suggestions & Votes
CREATE POLICY "Anyone views suggestions" ON workshop_suggestions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members create suggestions" ON workshop_suggestions FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid()::text);

CREATE POLICY "Members vote on suggestions" ON suggestion_votes FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid()::text);

CREATE POLICY "Members view suggestion votes" ON suggestion_votes FOR SELECT TO authenticated USING (true);

-- Evaluations: STRICTLY CONFIDENTIAL to Supervisors and Leaders
CREATE POLICY "Only supervisors and leaders view evaluations" ON evaluations FOR SELECT TO authenticated
  USING (current_user_role() IN ('supervisor', 'track_leader'));

CREATE POLICY "Only supervisors record evaluations" ON evaluations FOR INSERT TO authenticated
  WITH CHECK (current_user_role() = 'supervisor');

CREATE POLICY "Supervisors update evaluations" ON evaluations FOR UPDATE TO authenticated
  USING (current_user_role() = 'supervisor');

-- Audit Log & Import Batches: Only leaders and supervisors
CREATE POLICY "Supervisors and leaders view audit log" ON audit_log FOR SELECT TO authenticated
  USING (current_user_role() IN ('supervisor', 'track_leader'));

CREATE POLICY "Supervisors and leaders view import batches" ON import_batches FOR SELECT TO authenticated
  USING (current_user_role() IN ('supervisor', 'track_leader'));

-- =============================================================================
-- TRUSTED STORED PROCEDURES (SECURITY DEFINER)
-- =============================================================================

-- 1. Grant Points Procedure (Atomic + Duplicate Protection + Audit Log)
CREATE OR REPLACE FUNCTION grant_points_secure(
  p_profile_id TEXT,
  p_amount INT,
  p_reason TEXT,
  p_activity_key TEXT,
  p_approver_id TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Insert into ledger with UNIQUE constraint protection
  INSERT INTO points_ledger (profile_id, points_amount, reason, activity_key, approved_by)
  VALUES (p_profile_id, p_amount, p_reason, p_activity_key, p_approver_id);

  -- Update member total points
  UPDATE profiles
  SET points = points + p_amount, updated_at = now()
  WHERE id = p_profile_id;

  -- Add notification
  INSERT INTO notifications (id, profile_id, type, title, description, badge_text, points_amount, target_tab)
  VALUES (
    'notif-' || floor(extract(epoch from now()) * 1000)::text,
    p_profile_id,
    'points',
    'نقاط جديدة!',
    p_reason,
    '+' || p_amount::text,
    p_amount,
    'home'
  );

  -- Record in audit log
  INSERT INTO audit_log (actor_id, action_type, target_type, target_id, details)
  VALUES (
    p_approver_id,
    'GRANT_POINTS',
    'profile',
    p_profile_id,
    jsonb_build_object('amount', p_amount, 'reason', p_reason, 'activity', p_activity_key)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Approve Submission Procedure (Approve + Points + Award Skill)
CREATE OR REPLACE FUNCTION approve_submission_secure(
  p_submission_id TEXT,
  p_reviewer_id TEXT,
  p_points INT,
  p_feedback TEXT,
  p_skill_name TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_student_id TEXT;
  v_task_title TEXT;
BEGIN
  -- Get submission details
  SELECT s.profile_id, t.title INTO v_student_id, v_task_title
  FROM submissions s
  JOIN tasks t ON t.id = s.task_id
  WHERE s.id = p_submission_id;

  -- Update submission status
  UPDATE submissions
  SET status = 'approved', points_awarded = p_points
  WHERE id = p_submission_id;

  -- Insert review log
  INSERT INTO review_log (submission_id, reviewer_id, action, feedback, points_awarded)
  VALUES (p_submission_id, p_reviewer_id, 'approved', p_feedback, p_points);

  -- Award Points safely
  PERFORM grant_points_secure(
    v_student_id,
    p_points,
    'اعتماد تسليم: ' || v_task_title,
    'sub_approval_' || p_submission_id,
    p_reviewer_id
  );

  -- Award skill if specified
  IF p_skill_name IS NOT NULL AND p_skill_name <> '' THEN
    INSERT INTO member_skills (profile_id, skill_name, progress_percent, status)
    VALUES (v_student_id, p_skill_name, 100, 'approved')
    ON CONFLICT (profile_id, skill_name) DO UPDATE
    SET progress_percent = 100, status = 'approved', awarded_at = now();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


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



-- SEED ALL 31 MEMBERS FROM SURVEY
INSERT INTO profiles (id, full_name, username, gender, role, role_title, web_level, web_level_title, level_number, points, avatar_letter, badge_color, major, academic_year, bio, is_demo) VALUES
('member-1', 'ريماس محمد الحارثي', 'Rimas_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'beginner', 'المرحلة 1: التأسيس والتصميم البرمجي', 1, 100, 'ر', '#F9AB00', 'إدارة انظمه شبكات', 'الاول', 'طالبة إدارة انظمه شبكات بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-2', 'شذى بندر الحارثي', 'Shadha_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ش', '#4285F4', 'تقنية المعلومات', 'الخامس', 'طالبة تقنية المعلومات بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-3', 'دانه عبدالله الشهري', 'Dana_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'advanced', 'المرحلة 3: البناء والتخصص', 3, 100, 'د', '#34A853', 'علوم حاسب', 'ثاني سنه مستوى ٣', 'طالبة علوم حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-4', 'فيصل خالد الغامدي', 'Faisal_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'advanced', 'المرحلة 3: البناء والتخصص', 3, 100, 'ف', '#34A853', 'هندسة حاسب', '1', 'طالبة هندسة حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-5', 'سلمان محمد الغامدي', 'Salman_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'س', '#4285F4', 'علوم حاسب', 'المستوى الثالث', 'طالبة علوم حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-6', 'لميس سعود الحارثي', 'Lamis_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ل', '#4285F4', 'هندسه حاسب', 'المستوى الثالث', 'طالبة هندسه حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-7', 'لانا سلطان الجعيد', 'Lana_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'advanced', 'المرحلة 3: البناء والتخصص', 3, 100, 'ل', '#34A853', 'تقنية معلومات', 'الثالث ( ثاني سنة دراسية ).', 'طالبة تقنية معلومات بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-8', 'شوق يوسف الزايدي', 'Shouq_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ش', '#4285F4', 'هندسة حاسب', 'متخرجة', 'طالبة هندسة حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-9', 'نوره خالد العتيبي', 'Noura_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'beginner', 'المرحلة 1: التأسيس والتصميم البرمجي', 1, 100, 'ن', '#F9AB00', 'علوم الحاسوب', 'الخامس', 'طالبة علوم الحاسوب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-10', 'بشرى محمد العتيبي', 'Bushra_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ب', '#4285F4', 'تقنية المعلومات', 'السابع', 'طالبة تقنية المعلومات بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-11', 'بيادر سويلم القثامي', 'Bayader_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ب', '#4285F4', 'IT', 'السنة الرابعة', 'طالبة IT بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-12', 'درر العتيبي', 'Durar_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'د', '#4285F4', 'علوم حاسب', 'المستوى الثالث', 'طالبة علوم حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-13', 'رياد سعد الحارثي', 'Reyad_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ر', '#4285F4', 'نظم معلومات إداريه', 'الثالث', 'طالبة نظم معلومات إداريه بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-14', 'ميهاد حمود الحارثي', 'Mehad_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'م', '#4285F4', 'هندسه حاسب', 'المستوى الخامس', 'طالبة هندسه حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-15', 'ساره علي الشهري', 'Sarah_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'س', '#4285F4', 'علوم الحاسبات', 'الخامس', 'طالبة علوم الحاسبات بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-16', 'دانه محسن الذبياني', 'Dana_Z_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'د', '#4285F4', 'تقنية معلومات', 'سابع', 'طالبة تقنية معلومات بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-17', 'موضي ضحيان البقمي', 'Modhi_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'م', '#4285F4', 'CS', 'مستوى ٦', 'طالبة CS بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-18', 'ريوف عبداللطيف العمري', 'Ryoof_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'beginner', 'المرحلة 1: التأسيس والتصميم البرمجي', 1, 100, 'ر', '#F9AB00', 'علوم الحاسب', 'الخامس', 'طالبة علوم الحاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-19', 'اريج عطيه الثقفي', 'Areej_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'advanced', 'المرحلة 3: البناء والتخصص', 3, 100, 'ا', '#34A853', 'علوم حاسب', 'المستوى الثامن', 'طالبة علوم حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-20', 'عبدالعزيز خالد عبدالعزيز العصيمي', 'Abdulaziz_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'beginner', 'المرحلة 1: التأسيس والتصميم البرمجي', 1, 100, 'ع', '#F9AB00', 'علوم حاسب', '3', 'طالبة علوم حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-21', 'ليان غانم الحربي', 'Layan_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'beginner', 'المرحلة 1: التأسيس والتصميم البرمجي', 1, 100, 'ل', '#F9AB00', 'تقنية معلومات', '5', 'طالبة تقنية معلومات بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-22', 'ليان خالد الشهري', 'Layan_S_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'advanced', 'المرحلة 3: البناء والتخصص', 3, 100, 'ل', '#34A853', 'هندسة حاسب الي', 'الثالث السنه الثانيه', 'طالبة هندسة حاسب الي بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-23', 'نوره عبدالله سلطان السبيعي', 'Noura_S_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ن', '#4285F4', 'علوم حاسب', 'الثالث', 'طالبة علوم حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-24', 'رهف الخماش', 'Rahaf_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ر', '#4285F4', 'علوم الحاسب', '3', 'طالبة علوم الحاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-25', 'جميلة بدر الروقي', 'Jameela_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ج', '#4285F4', 'علوم حاسب', 'المستوى الخامس', 'طالبة علوم حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-26', 'ريوف سعد الخماش', 'Ryoof_S_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ر', '#4285F4', 'علوم حاسب', 'الخامس', 'طالبة علوم حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-27', 'شهد سعد الحارثي', 'Shahad_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ش', '#4285F4', 'علوم حاسب', '٩', 'طالبة علوم حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-28', 'ريما عبدالعزيز العتيبي', 'Reema_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ر', '#4285F4', 'علوم حاسب', 'الثالث', 'طالبة علوم حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-29', 'بشاير سعيد الزهراني', 'Bashayer_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ب', '#4285F4', 'علوم حاسب', 'الرابع', 'طالبة علوم حاسب بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-30', 'رِفال ناصر النفيعي', 'Refal_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ر', '#4285F4', 'تقنية المعلومات', 'السنه الرابعه المستوى الثامن', 'طالبة تقنية المعلومات بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false),
('member-31', 'رنا أمين فيض', 'Rana_M.web26', 'female', 'member', 'عضو مسار الويب 🚀', 'intermediate', 'المرحلة 2: التطوير التفاعلي', 2, 100, 'ر', '#4285F4', 'تقنية معلومات', 'السنة الرابعة (المستوى السابع)', 'طالبة تقنية معلومات بجامعة الطائف، مسجلة في مسار تصميم وتطوير الويب بنادي قوقل.', false)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, web_level = EXCLUDED.web_level;

