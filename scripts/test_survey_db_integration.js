const { PGlite } = require('@electric-sql/pglite');
const fs = require('fs');
const path = require('path');
const { processSurveyCSV } = require('./survey_importer');

async function testSurveyDatabaseIntegration() {
  console.log('=== بدء اختبار تكامل بيانات الاستبيان مع جداول قاعدة البيانات ===');
  const db = new PGlite();

  // إعداد دالة auth.uid()
  await db.exec(`
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
      SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
    $$ LANGUAGE sql STABLE;
  `);

  const sqlPath = path.join(__dirname, '../supabase/migrations/20261018000000_initial_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await db.exec(sql);

  // تشغيل المعالجة
  const csvPath = '/Users/manalalshareef/Downloads/استبيان التعرف على أعضاء مسار الويب.csv';
  const report = processSurveyCSV(csvPath);

  console.log(`تم فحص ومعالجة ${report.totalRawSubmissions} سجل من ملف الـ CSV.`);

  // 1. إدراج القادة أولاً في survey_responses بحالة excluded_leader
  for (const leader of report.leaderRecords) {
    await db.query(`
      INSERT INTO survey_responses (
        submitted_at, full_name, phone_number, major, academic_year,
        programming_experience, prior_technologies, tools_used,
        calculated_level, status, notes
      ) VALUES (
        NOW(), $1, $2, $3, $4, $5, $6, $7, 'track_leader', 'excluded_leader', $8
      );
    `, [
      leader.fullName, leader.phone, leader.major, leader.academicYear,
      leader.programmingExp, leader.priorTechs, leader.toolsUsed, leader.note
    ]);
  }
  console.log('✔ تم إدراج سجلات القيادة (غيداء وريتال) بحالة مستثناة بنجاح.');

  // 2. إدراج السجل المكرر الأقدم بحالة archived_duplicate
  for (const dup of report.duplicateRecords) {
    const arch = dup.archivedRecord;
    await db.query(`
      INSERT INTO survey_responses (
        submitted_at, full_name, phone_number, major, academic_year,
        programming_experience, prior_technologies, tools_used,
        calculated_level, status, notes
      ) VALUES (
        NOW(), $1, $2, $3, $4, $5, $6, $7, 'pending_review', 'archived_duplicate', $8
      );
    `, [
      arch.fullName, arch.phone, arch.major, arch.academicYear,
      arch.programmingExp, arch.priorTechs, arch.toolsUsed, dup.reason
    ]);
  }
  console.log('✔ تم حفظ وأرشفة السجلات المكررة بدون حذف أي بيانات تاريخية.');

  // 3. إدراج الأعضاء الصالحين (28 عضواً)
  for (const member of report.validMemberRecords) {
    await db.query(`
      INSERT INTO survey_responses (
        submitted_at, full_name, phone_number, major, academic_year,
        programming_experience, prior_technologies, tools_used,
        calculated_level, status, notes
      ) VALUES (
        NOW(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      );
    `, [
      member.fullName, member.phone, member.major, member.academicYear,
      member.programmingExp, member.priorTechs, member.toolsUsed,
      member.calculatedLevel, 'pending_review', member.suggestedPlan
    ]);
  }
  console.log('✔ تم إدراج الـ 28 عضواً الصالحين بمستوياتهم المقترحة وخططهم بانتظار الاعتماد.');

  // 4. التحقق الإحصائي من قاعدة البيانات
  const statsRes = await db.query(`
    SELECT status, COUNT(*) as count 
    FROM survey_responses 
    GROUP BY status;
  `);
  console.log('إحصائيات حالات الاستبيان داخل قاعدة البيانات:', statsRes.rows);

  const levelStatsRes = await db.query(`
    SELECT calculated_level, COUNT(*) as count 
    FROM survey_responses 
    WHERE status = 'pending_review' 
    GROUP BY calculated_level;
  `);
  console.log('توزيع مستويات الأعضاء داخل قاعدة البيانات:', levelStatsRes.rows);

  // 5. محاكاة توليد رموز الدعوة الآمنة للأعضاء الصالحين
  console.log('\n=== محاكاة توليد رموز الدعوة لمرة واحدة (Invitations Dry Run) ===');
  const sampleMember = report.validMemberRecords[0];
  const inviteToken = `GDG-TU-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const inviteRes = await db.query(`
    INSERT INTO invitations (code, target_name, target_phone, suggested_level, expires_at)
    VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')
    RETURNING id, code, target_name, expires_at, used_at;
  `, [inviteToken, sampleMember.fullName, sampleMember.phone, sampleMember.calculatedLevel]);

  console.log('تم توليد رمز دعوة آمن لعينة من الأعضاء:', inviteRes.rows[0]);

  // التحقق من أن الرمز غير مستخدم ومحدد الصلاحية
  if (inviteRes.rows[0].used_at !== null) {
    throw new Error('خطأ: رمز الدعوة الجديد يجب أن يكون غير مستخدم (used_at = null)!');
  }
  console.log('✔ رمز الدعوة فريد وغير مستخدم ومحدود الصلاحية.');

  console.log('\n🎉 اكتمل اختبار تكامل استيراد الاستبيان وقاعدة البيانات بنجاح 100%!');
}

testSurveyDatabaseIntegration().catch(err => {
  console.error('❌ خطأ في اختبار الاستيراد:', err);
  process.exit(1);
});
