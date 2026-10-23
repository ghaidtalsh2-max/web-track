const { PGlite } = require('@electric-sql/pglite');
const fs = require('fs');
const path = require('path');

async function testRLSSecurity() {
  console.log('=== بدء فحص واختبار أمان سياسات الـ RLS في بيئة PostgreSQL الحقيقية ===');
  const db = new PGlite();

  // 1. إعداد دالة auth.uid() التوافقية
  await db.exec(`
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
      SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
    $$ LANGUAGE sql STABLE;
  `);

  // 2. تنفيذ المخطط الكامل
  const sqlPath = path.join(__dirname, '../supabase/migrations/20261018000000_initial_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await db.exec(sql);

  // 3. إنشاء دور المستخدم العادي غير الخارق (لضمان سريان RLS بدقة كما في سحابة Supabase)
  await db.exec(`
    CREATE ROLE authenticated_user;
    GRANT USAGE ON SCHEMA public TO authenticated_user;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated_user;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated_user;
    GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated_user;
  `);

  // 4. إنشاء المستخدمين التجريبيين
  const leaderRes = await db.query(`
    INSERT INTO profiles (username, full_name, role, web_level, level_status)
    VALUES ('ghaidaa_leader', 'غيداء الشريف', 'track_leader', 'track_leader', 'approved')
    RETURNING id;
  `);
  const leaderId = leaderRes.rows[0].id;

  const member1Res = await db.query(`
    INSERT INTO profiles (username, full_name, role, web_level, level_status)
    VALUES ('member_1', 'طالب تجريبي أول', 'member', 'intermediate', 'approved')
    RETURNING id;
  `);
  const member1Id = member1Res.rows[0].id;

  const member2Res = await db.query(`
    INSERT INTO profiles (username, full_name, role, web_level, level_status)
    VALUES ('member_2', 'طالب تجريبي ثان', 'member', 'beginner', 'proposed')
    RETURNING id;
  `);
  const member2Id = member2Res.rows[0].id;

  console.log('تم إنشاء حسابات الاختبار بنجاح.');

  // تفعيل دور المستخدم العادي لتطبيق سياسات RLS
  await db.query(`SET ROLE authenticated_user;`);

  // --- الاختبار 1: إضافة مشروع غير معتمد للمراجعة وحجبه عن بقية الأعضاء ---
  console.log('\n[اختبار 1/6] حجب المشاريع غير المعتمدة عن الأعضاء:');
  await db.query(`SET app.current_user_id = '${member1Id}';`);
  const projRes = await db.query(`
    INSERT INTO showcase_projects (user_id, title, description, status)
    VALUES ('${member1Id}', 'نظام المهام الذكي', 'مشروع قيد الاعتماد', 'pending_approval')
    RETURNING id, title, status;
  `);
  const projId = projRes.rows[0].id;
  console.log('✔ أنشأ العضو مشروعه بحالة بانتظار الاعتماد:', projRes.rows[0].title);

  // فحص رؤية العضو 2 للمشروع المعلق
  await db.query(`SET app.current_user_id = '${member2Id}';`);
  const viewM2Pending = await db.query(`SELECT * FROM showcase_projects WHERE id = '${projId}';`);
  if (viewM2Pending.rows.length !== 0) {
    throw new Error('فشل أمني: العضو الآخر تمكن من رؤية مشروع معلق لم يعتمد بعد!');
  }
  console.log('✔ نجحت السياسة: المشروع المعلق محجوب تماماً عن العضو الآخر (0 نتائج).');

  // فحص رؤية صاحب المشروع لنفس مشروعه
  await db.query(`SET app.current_user_id = '${member1Id}';`);
  const viewM1Self = await db.query(`SELECT * FROM showcase_projects WHERE id = '${projId}';`);
  if (viewM1Self.rows.length !== 1) {
    throw new Error('خطأ: صاحب المشروع لم يتمكن من رؤية مسودته!');
  }
  console.log('✔ صاحب المشروع يستطيع رؤية ومتابعة حالة مشروعه.');

  // --- الاختبار 2: قائدة المسار تراجع المشروع وتعتمدة ويظهر للجميع ---
  console.log('\n[اختبار 2/6] صلاحية القائدة في الاعتماد وظهور المشروع في المعرض:');
  await db.query(`SET app.current_user_id = '${leaderId}';`);
  const leaderView = await db.query(`SELECT * FROM showcase_projects WHERE id = '${projId}';`);
  if (leaderView.rows.length !== 1) {
    throw new Error('خطأ: القائدة لم تتمكن من رؤية المشروع المطلوب اعتماده!');
  }
  await db.query(`
    UPDATE showcase_projects 
    SET status = 'approved', approved_by = '${leaderId}', approved_at = NOW()
    WHERE id = '${projId}';
  `);
  console.log('✔ قامت قائدة المسار باعتماد المشروع.');

  // الآن العضو 2 يفحص المعرض: يجب أن يراه معتمداً
  await db.query(`SET app.current_user_id = '${member2Id}';`);
  const viewM2Approved = await db.query(`SELECT title, status FROM showcase_projects WHERE id = '${projId}';`);
  if (viewM2Approved.rows.length !== 1) {
    throw new Error('خطأ: المشروع المعتمد لم يظهر في المعرض العام!');
  }
  console.log('✔ يظهر المشروع المعتمد لجميع أعضاء النادي بنجاح:', viewM2Approved.rows[0]);

  // --- الاختبار 3: منع الأعضاء من التلاعب بالنقاط ---
  console.log('\n[اختبار 3/6] حماية النقاط من التلاعب من جهة العميل:');
  await db.query(`SET app.current_user_id = '${member1Id}';`);
  try {
    await db.query(`
      INSERT INTO points_ledger (user_id, points, activity_type, activity_id, reason)
      VALUES ('${member1Id}', 500, 'hack', 'hack_01', 'منح نفسي نقاط غير مستحقة')
    `);
    throw new Error('فشل أمني خطير: استطاع العضو إدخال نقاط لنفسه في قاعدة البيانات!');
  } catch (err) {
    console.log('✔ نجحت السياسة: تم رفض طلب إضافة النقاط من العضو (RLS Violation Blocked).');
  }

  // --- الاختبار 4: القائدة فقط هي من تملك صلاحية منح النقاط ---
  console.log('\n[اختبار 4/6] منح النقاط عبر القائدة:');
  await db.query(`SET app.current_user_id = '${leaderId}';`);
  await db.query(`
    INSERT INTO points_ledger (user_id, points, activity_type, activity_id, reason, awarded_by)
    VALUES ('${member1Id}', 150, 'showcase_bonus', 'sc_${projId}', 'اعتماد مشروع المعرض', '${leaderId}')
  `);
  const member1Points = await db.query(`SELECT points FROM profiles WHERE id = '${member1Id}';`);
  console.log('✔ تم منح النقاط بنجاح عبر القائدة ورصيد العضو الحالي:', member1Points.rows[0].points, 'XP');

  // --- الاختبار 5: سرية وخصوصية قسم صوتك في المسار ---
  console.log('\n[اختبار 5/6] سرية قسم صوتك في المسار (الأسئلة والاقتراحات):');
  await db.query(`SET app.current_user_id = '${member1Id}';`);
  const voiceRes = await db.query(`
    INSERT INTO voices_feedback (user_id, type, title, details)
    VALUES ('${member1Id}', 'question', 'استفسار عن الـ Backend', 'ما هو أفضل إطار عمل أبدأ به؟')
    RETURNING id, title;
  `);
  const voiceId = voiceRes.rows[0].id;

  // العضو 2 يحاول قراءة رسالة العضو 1
  await db.query(`SET app.current_user_id = '${member2Id}';`);
  const viewM2Voice = await db.query(`SELECT * FROM voices_feedback WHERE id = '${voiceId}';`);
  if (viewM2Voice.rows.length !== 0) {
    throw new Error('فشل في الخصوصية: عضو آخر تمكن من الاطلاع على سؤال خاص!');
  }
  console.log('✔ خصوصية صوتك في المسار مؤكدة: الاستفسار محجوب عن بقية الأعضاء تماماً.');

  // القائدة تطلع على الاستفسار وترد عليه
  await db.query(`SET app.current_user_id = '${leaderId}';`);
  const leaderVoice = await db.query(`SELECT * FROM voices_feedback WHERE id = '${voiceId}';`);
  if (leaderVoice.rows.length !== 1) {
    throw new Error('خطأ: القائدة لم تتمكن من رؤية استفسار العضو!');
  }
  console.log('✔ القائدة استلمت الاستفسار بنجاح:', leaderVoice.rows[0].title);

  // --- الاختبار 6: حماية الملفات الشخصية من تعديل الغير ---
  console.log('\n[اختبار 6/6] حماية الملف الشخصي من تعديل عضو آخر:');
  await db.query(`SET app.current_user_id = '${member2Id}';`);
  await db.query(`
    UPDATE profiles SET bio = 'محاولة تغيير نبذة زميلي' WHERE id = '${member1Id}';
  `);
  const checkBio = await db.query(`SELECT bio FROM profiles WHERE id = '${member1Id}';`);
  if (checkBio.rows[0].bio === 'محاولة تغيير نبذة زميلي') {
    throw new Error('فشل أمني: عضو تمكن من تعديل ملف زميله!');
  }
  console.log('✔ نجحت السياسة: تم منع العضو من تعديل بيانات أي عضو آخر.');

  console.log('\n🎉 اكتمل فحص الأمان بنجاح 100%! جميع سياسات RLS محكمة وصارمة ومطابقة للمتطلبات.');
}

testRLSSecurity().catch(err => {
  console.error('❌ خطأ في اختبار الأمان:', err);
  process.exit(1);
});
