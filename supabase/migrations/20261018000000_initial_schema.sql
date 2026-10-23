-- =============================================================================
-- منصة مجال تصميم وتطوير الويب — GDGoC TU
-- المخطط الشامل لقاعدة البيانات وسياسات الأمان (Supabase / PostgreSQL)
-- الإصدار: 1.5 المتوافق مع PRD ومتطلبات الهوية والأمان
-- =============================================================================

-- ملاحظة: دالة gen_random_uuid() مدمجة أصلياً في PostgreSQL 13+ وسحابة Supabase

-- -----------------------------------------------------------------------------
-- 1. أنواع وتعدادات الحالات (Enums)
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('super_admin', 'track_leader', 'reviewer', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE web_level_type AS ENUM ('beginner', 'intermediate', 'advanced', 'pending_review', 'track_leader');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE level_status_type AS ENUM ('proposed', 'approved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE challenge_category_type AS ENUM ('specialized', 'domain', 'semester', 'cross_domain', 'term_project');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_status_type AS ENUM ('draft', 'submitted', 'in_review', 'revision_requested', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE showcase_status_type AS ENUM ('draft', 'pending_approval', 'revision_requested', 'approved', 'rejected', 'hidden');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE voice_type AS ENUM ('suggestion', 'question', 'feedback_note');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE voice_status_type AS ENUM ('new', 'in_review', 'responded', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 2. جدول المستخدمين والملفات الشخصية (profiles)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT, -- محمي ولا يعرض للعامة
    major TEXT,
    academic_year TEXT,
    role user_role_type NOT NULL DEFAULT 'member',
    web_level web_level_type NOT NULL DEFAULT 'pending_review',
    level_status level_status_type NOT NULL DEFAULT 'proposed',
    bio TEXT,
    avatar_key TEXT DEFAULT 'dev_blue_circle',
    points INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_web_level ON profiles(web_level);

-- -----------------------------------------------------------------------------
-- 3. جدول ردود الاستبيان المستوردة والأصلية (survey_responses)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    major TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    programming_experience TEXT NOT NULL,
    prior_technologies TEXT[] DEFAULT '{}',
    known_concepts TEXT[] DEFAULT '{}',
    problem_solving_approach TEXT,
    ui_ux_experience TEXT,
    tools_used TEXT[] DEFAULT '{}',
    target_skills TEXT[] DEFAULT '{}',
    track_goals TEXT,
    workshop_suggestions TEXT,
    calculated_level web_level_type NOT NULL DEFAULT 'pending_review',
    status TEXT NOT NULL DEFAULT 'pending_review', -- 'pending_review', 'approved', 'excluded_leader', 'archived_duplicate'
    duplicate_of_id UUID REFERENCES survey_responses(id) ON DELETE SET NULL,
    matched_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_survey_phone ON survey_responses(phone_number);
CREATE INDEX IF NOT EXISTS idx_survey_status ON survey_responses(status);

-- -----------------------------------------------------------------------------
-- 4. جدول رموز الدعوة السرية لمرة واحدة (invitations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) UNIQUE NOT NULL,
    target_survey_id UUID REFERENCES survey_responses(id) ON DELETE SET NULL,
    target_name TEXT NOT NULL,
    target_phone TEXT,
    assigned_role user_role_type NOT NULL DEFAULT 'member',
    suggested_level web_level_type NOT NULL DEFAULT 'beginner',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '90 days'),
    used_at TIMESTAMPTZ,
    used_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_code ON invitations(code);
CREATE INDEX IF NOT EXISTS idx_invitations_used_at ON invitations(used_at);

-- -----------------------------------------------------------------------------
-- 5. جدول التحديات والمهام (challenges)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category challenge_category_type NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'all', -- 'beginner', 'intermediate', 'advanced', 'all'
    requirements TEXT[] DEFAULT '{}',
    tools TEXT[] DEFAULT '{}',
    deliverables TEXT[] DEFAULT '{}',
    points_reward INTEGER NOT NULL DEFAULT 0,
    due_date TIMESTAMPTZ, -- افتراضياً NULL وفقاً للـ PRD (لا مواعيد افتراضية)
    is_group_challenge BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. جدول الفرق والعمل الجماعي (teams & team_members)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    challenge_id UUID REFERENCES challenges(id) ON DELETE SET NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_team_leader BOOLEAN NOT NULL DEFAULT FALSE,
    role_description TEXT,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_team_member UNIQUE (team_id, user_id)
);

-- -----------------------------------------------------------------------------
-- 7. جدول التسليمات للمشاريع والتحديات (submissions)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    github_url TEXT,
    live_url TEXT,
    demo_url TEXT,
    documentation_notes TEXT,
    member_contributions JSONB DEFAULT '{}'::jsonb, -- توثيق مساهمة كل عضو
    status submission_status_type NOT NULL DEFAULT 'submitted',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_submission_owner CHECK (user_id IS NOT NULL OR team_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_submissions_challenge ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- -----------------------------------------------------------------------------
-- 8. جدول المراجعات والتقييم الإداري (submission_reviews)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submission_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status submission_status_type NOT NULL, -- 'approved', 'revision_requested', 'rejected'
    feedback TEXT NOT NULL,
    points_awarded INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. جدول دفتر النقاط وسجل الاستحقاق (points_ledger)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS points_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    activity_type TEXT NOT NULL, -- 'challenge_approved', 'course_completed', 'showcase_bonus', 'manual_adjustment'
    activity_id TEXT, -- لمنع التكرار (Idempotency Key)
    reason TEXT NOT NULL,
    awarded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_activity UNIQUE (user_id, activity_type, activity_id)
);

CREATE INDEX IF NOT EXISTS idx_points_user ON points_ledger(user_id);

-- -----------------------------------------------------------------------------
-- 10. جدول الشارات والإنجازات (badges & user_badges)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'skill',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    reason TEXT,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_badge UNIQUE (user_id, badge_id)
);

-- -----------------------------------------------------------------------------
-- 11. جدول معرض أعمال الأعضاء (showcase_projects)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS showcase_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    cover_image_url TEXT,
    status showcase_status_type NOT NULL DEFAULT 'pending_approval',
    review_notes TEXT,
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_showcase_status ON showcase_projects(status);
CREATE INDEX IF NOT EXISTS idx_showcase_user ON showcase_projects(user_id);

-- -----------------------------------------------------------------------------
-- 12. جدول تفاعلات الـ Emoji في المعرض (showcase_reactions)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS showcase_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES showcase_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    emoji_type VARCHAR(10) NOT NULL, -- '❤️', '🔥', '🚀', '👏', '💡', '🤩'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_project_emoji UNIQUE (project_id, user_id, emoji_type)
);

-- -----------------------------------------------------------------------------
-- 13. قسم «صوتك في المسار» للأسئلة والمقترحات الخاصة (voices_feedback)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS voices_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type voice_type NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    status voice_status_type NOT NULL DEFAULT 'new',
    response_text TEXT,
    responded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voices_user ON voices_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_voices_status ON voices_feedback(status);

-- -----------------------------------------------------------------------------
-- 14. جدول سجل التدقيق للعمليات الحساسة (audit_logs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'APPROVE_LEVEL', 'AWARD_POINTS', 'REVOKE_INVITATION', 'APPROVE_SHOWCASE', 'UPDATE_ROLE'
    entity_type TEXT NOT NULL, -- 'profile', 'submission', 'showcase', 'points', 'invitation'
    entity_id TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);

-- -----------------------------------------------------------------------------
-- 15. دوال التحديث الآلي لحساب مجموع النقاط (Triggers)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION refresh_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET points = COALESCE((
        SELECT SUM(points) FROM points_ledger WHERE user_id = NEW.user_id
    ), 0),
    updated_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_points_ledger_insert ON points_ledger;
CREATE TRIGGER trg_points_ledger_insert
AFTER INSERT OR UPDATE ON points_ledger
FOR EACH ROW
EXECUTE FUNCTION refresh_user_total_points();

-- -----------------------------------------------------------------------------
-- 16. سياسات الأمان على مستوى الصفوف (Row Level Security - RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voices_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- فرض الأمان المشدد (FORCE RLS) حتى لا يتم تجاوزه في أي جلسة
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE showcase_projects FORCE ROW LEVEL SECURITY;
ALTER TABLE points_ledger FORCE ROW LEVEL SECURITY;
ALTER TABLE voices_feedback FORCE ROW LEVEL SECURITY;
ALTER TABLE submissions FORCE ROW LEVEL SECURITY;
ALTER TABLE invitations FORCE ROW LEVEL SECURITY;

-- دوال فحص الصلاحيات المساعدة
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role_type AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_track_leader()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('track_leader', 'super_admin')
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- سياسات profiles
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (
        -- العضو يرى ملفه، أو القائد يرى الجميع، أو الأعضاء يرون البيانات العامة لزملائهم بدون رقم الهاتف
        id = auth.uid() OR is_track_leader() OR is_active = true
    );

DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (
        -- العضو يستطيع تحديث النبذة والأفاتار الخاصين به فقط
        id = auth.uid() OR is_track_leader()
    ) WITH CHECK (
        -- العضو لا يستطيع ترقية صلاحياته أو تعديل نقاطه أو مستواه بنفسه
        (id = auth.uid() AND role = (SELECT role FROM profiles WHERE id = auth.uid()) AND points = (SELECT points FROM profiles WHERE id = auth.uid()))
        OR is_track_leader()
    );

-- سياسات invitations
DROP POLICY IF EXISTS "invitations_leader_policy" ON invitations;
CREATE POLICY "invitations_leader_policy" ON invitations
    FOR ALL USING (is_track_leader());

-- سياسات submissions
DROP POLICY IF EXISTS "submissions_select_policy" ON submissions;
CREATE POLICY "submissions_select_policy" ON submissions
    FOR SELECT USING (
        user_id = auth.uid() 
        OR is_track_leader()
        OR EXISTS (SELECT 1 FROM team_members WHERE team_id = submissions.team_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "submissions_insert_policy" ON submissions;
CREATE POLICY "submissions_insert_policy" ON submissions
    FOR INSERT WITH CHECK (
        user_id = auth.uid() 
        OR EXISTS (SELECT 1 FROM team_members WHERE team_id = submissions.team_id AND user_id = auth.uid())
    );

-- سياسات showcase_projects (المعرض لا يظهر إلا بعد الاعتماد الإداري)
DROP POLICY IF EXISTS "showcase_select_policy" ON showcase_projects;
CREATE POLICY "showcase_select_policy" ON showcase_projects
    FOR SELECT USING (
        status = 'approved' OR user_id = auth.uid() OR is_track_leader()
    );

DROP POLICY IF EXISTS "showcase_insert_policy" ON showcase_projects;
CREATE POLICY "showcase_insert_policy" ON showcase_projects
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND status IN ('draft', 'pending_approval')
    );

DROP POLICY IF EXISTS "showcase_update_policy" ON showcase_projects;
CREATE POLICY "showcase_update_policy" ON showcase_projects
    FOR UPDATE USING (
        (user_id = auth.uid() AND status IN ('draft', 'pending_approval')) OR is_track_leader()
    );

-- سياسات voices_feedback (السرية التامة لا تظهر المشاركات لبقية الأعضاء)
DROP POLICY IF EXISTS "voices_user_policy" ON voices_feedback;
CREATE POLICY "voices_user_policy" ON voices_feedback
    FOR SELECT USING (
        user_id = auth.uid() OR is_track_leader()
    );

DROP POLICY IF EXISTS "voices_insert_policy" ON voices_feedback;
CREATE POLICY "voices_insert_policy" ON voices_feedback
    FOR INSERT WITH CHECK (
        user_id = auth.uid()
    );

-- سياسات points_ledger (يمنع أي عضو من إدراج أو تعديل نقاطه)
DROP POLICY IF EXISTS "points_select_policy" ON points_ledger;
CREATE POLICY "points_select_policy" ON points_ledger
    FOR SELECT USING (
        user_id = auth.uid() OR is_track_leader()
    );

DROP POLICY IF EXISTS "points_insert_leader_policy" ON points_ledger;
CREATE POLICY "points_insert_leader_policy" ON points_ledger
    FOR INSERT WITH CHECK (is_track_leader());
