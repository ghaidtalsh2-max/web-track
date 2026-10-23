const { PGlite } = require('@electric-sql/pglite');
const fs = require('fs');
const path = require('path');

async function runSchemaVerification() {
  console.log('=== [1/3] بدء اختبار مخطط قاعدة البيانات في بيئة PostgreSQL الحقيقية ===');
  const db = new PGlite();

  // 1. قراءة وتنفيذ ملف الهيكلة
  const sqlPath = path.join(__dirname, '../supabase/migrations/20261018000000_initial_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // إنشاء دالة auth.uid() مؤقتة لتمكين اختبار دوال وسياسات الأمان في الجلسة المحلية
  await db.exec(`
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
      SELECT COALESCE(NULLIF(current_setting('request.jwt.claim.sub', true), ''), '00000000-0000-0000-0000-000000000000')::uuid;
    $$ LANGUAGE sql STABLE;
  `);

  console.log('جاري تنفيذ ملف الترحيل 20261018000000_initial_schema.sql...');
  await db.exec(sql);
  console.log('✔ تم إنشاء الجداول والأنواع والمفاهيم بنجاح تام.');

  // 2. التحقق من وجود الجداول الـ 14 المطلوبة
  const tablesRes = await db.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  const tableNames = tablesRes.rows.map(r => r.table_name);
  console.log('الجداول المفعلة في النظام:', tableNames);

  const requiredTables = [
    'profiles', 'survey_responses', 'invitations', 'challenges', 
    'teams', 'team_members', 'submissions', 'submission_reviews', 
    'points_ledger', 'badges', 'user_badges', 'showcase_projects', 
    'showcase_reactions', 'voices_feedback', 'audit_logs'
  ];

  for (const t of requiredTables) {
    if (!tableNames.includes(t)) {
      throw new Error(`خطأ: الجدول المطلوب ${t} غير موجود!`);
    }
  }
  console.log('✔ جميع الجداول الـ 15 موجودة ومطابقة للمتطلبات.');

  // 3. اختبار عمل التريجر (Trigger) لتحديث مجموع النقاط في الملف الشخصي تلقائياً
  console.log('\n=== [2/3] اختبار تريجر النقاط (Points Ledger Automation) ===');
  const testUserRes = await db.query(`
    INSERT INTO profiles (username, full_name, role, web_level, level_status)
    VALUES ('test_dev', 'طالب تجريبي', 'member', 'intermediate', 'approved')
    RETURNING id, points;
  `);
  const testUserId = testUserRes.rows[0].id;
  console.log('نقاط المستخدم الأولية:', testUserRes.rows[0].points); // يجب أن تكون 0

  // إضافة استحقاق نقاط في الدفتر
  await db.query(`
    INSERT INTO points_ledger (user_id, points, activity_type, activity_id, reason)
    VALUES ($1, 150, 'challenge_approved', 'ch_001', 'إنجاز تحدي تخطيط لوحة التحكم')
  `, [testUserId]);

  // فحص تحديث نقاط الملف الشخصي
  const updatedUserRes = await db.query(`SELECT points FROM profiles WHERE id = $1`, [testUserId]);
  console.log('النقاط بعد استحقاق التحدي الأول:', updatedUserRes.rows[0].points);
  if (updatedUserRes.rows[0].points !== 150) {
    throw new Error('فشل التريجر في مزامنة النقاط!');
  }

  // إضافة استحقاق ثانٍ
  await db.query(`
    INSERT INTO points_ledger (user_id, points, activity_type, activity_id, reason)
    VALUES ($1, 100, 'badge_bonus', 'bdg_002', 'شارة رائد الويب')
  `, [testUserId]);

  const updatedUserRes2 = await db.query(`SELECT points FROM profiles WHERE id = $1`, [testUserId]);
  console.log('النقاط بعد الاستحقاق الثاني:', updatedUserRes2.rows[0].points);
  if (updatedUserRes2.rows[0].points !== 250) {
    throw new Error('فشل تراكم النقاط!');
  }
  console.log('✔ تريجر حساب وتحديث النقاط يعمل بنجاح 100%.');

  // 4. اختبار منع تكرار منح النقاط لنفس الإنجاز (Idempotency Key / Unique Constraint)
  console.log('\n=== [3/3] اختبار منع مضاعفة النقاط لنفس العمل (Idempotency) ===');
  try {
    await db.query(`
      INSERT INTO points_ledger (user_id, points, activity_type, activity_id, reason)
      VALUES ($1, 150, 'challenge_approved', 'ch_001', 'محاولة تكرار منح النقاط')
    `, [testUserId]);
    throw new Error('خطأ أمني: سمحت قاعدة البيانات بتكرار النقاط لنفس العمل!');
  } catch (err) {
    if (err.message.includes('uq_user_activity')) {
      console.log('✔ نجح القيد: رفضت قاعدة البيانات تكرار منح النقاط للنشاط نفسه (uq_user_activity constraint).');
    } else {
      throw err;
    }
  }

  // 5. اختبار حقل الموعد الافتراضي للتحديات (يجب أن يكون NULL افتراضياً)
  const challengeRes = await db.query(`
    INSERT INTO challenges (title, description, category)
    VALUES ('تحدي فصلي جديد', 'وصف التحدي', 'semester')
    RETURNING due_date;
  `);
  if (challengeRes.rows[0].due_date !== null) {
    throw new Error('خطأ: الموعد النهائي يجب أن يكون فارغاً (NULL) افتراضياً بحسب وثيقة الـ PRD!');
  }
  console.log('✔ التحديات الجديدة تنشأ بدون مواعيد افتراضية (due_date = NULL) التزاماً بالـ PRD.');

  console.log('\n🎉 اكتمل اختبار مخطط قاعدة البيانات بنجاح تام 100% بدون أي أخطاء!');
}

runSchemaVerification().catch(err => {
  console.error('❌ خطأ أثناء اختبار المخطط:', err);
  process.exit(1);
});
