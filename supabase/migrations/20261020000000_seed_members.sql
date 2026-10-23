-- =============================================================================
-- بيانات أعضاء وقادة مسار الويب — GDG on Campus جامعة الطائف
-- إدراج القادة (2) والأعضاء الـ (30) مع اليوزرنيم وكلمات المرور ورموز الدعوة
-- =============================================================================

INSERT INTO profiles (username, full_name, phone_number, major, academic_year, role, web_level, level_status, points)
VALUES ('Ghaidaa_Lead.web26', 'غيداء تركي الشريف', '0530055002', 'علوم حاسب', 'الثالث', 'track_leader', 'track_leader', 'approved', 500)
ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name;
INSERT INTO profiles (username, full_name, phone_number, major, academic_year, role, web_level, level_status, points)
VALUES ('Retal_Lead.web26', 'ريتال القثامي', '05xxxxx151', 'تقنية معلومات', 'السابع', 'track_leader', 'track_leader', 'approved', 500)
ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name;

-- إدراج استجابات الأعضاء الـ 30 وتوليد الحسابات ورموز الدعوة
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'ريماس محمد الحارثي', '0535929390', 'إدارة انظمه شبكات', 'الاول',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['لغات البرمجة — Python'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','إدارة الأكواد — GitHub','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — أدوات أخرى للمساعدة في البرمجة'], 'beginner', 'pending_review',
  'اضافة مسار ل Cyber security'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1001', 'ريماس محمد الحارثي', '0535929390', 'beginner', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'شذى بندر الحارثي', '0566387571', 'تقنية المعلومات', 'الخامس',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['لغات البرمجة — C++','لغات البرمجة — Java','تقنيات الويب — HTML'],
  ARRAY['التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Gemini'], 'intermediate', 'pending_review',
  'الامن السبراني'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1002', 'شذى بندر الحارثي', '0566387571', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'دانه عبدالله الشهري', '0559433173', 'علوم حاسب', 'ثاني سنه مستوى ٣',
  'أستطيع تطوير مشاريع برمجية بشكل مستقل، ولدي خبرة في تنفيذ المشاريع.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java','تقنيات الويب — HTML','تقنيات الويب — CSS','تقنيات الويب — JavaScript'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','إدارة الأكواد — GitHub','التصميم — Canva','النشر والاستضافة والسحابة — Netlify','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Gemini'], 'advanced', 'pending_review',
  'ورش مفصله عن مواضيع مختلفه تخص الويب'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1003', 'دانه عبدالله الشهري', '0559433173', 'advanced', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'فيصل خالد الغامدي', '0509659566', 'هندسة حاسب', '1',
  'أستطيع تطوير مشاريع برمجية بشكل مستقل، ولدي خبرة في تنفيذ المشاريع.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java','تقنيات الويب — JavaScript','تقنيات الويب — Next.js'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','إدارة الأكواد — GitHub','التصميم — Canva','النشر والاستضافة والسحابة — Netlify','النشر والاستضافة والسحابة — Firebase','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini','الذكاء الاصطناعي — Replit AI'], 'advanced', 'pending_review',
  'لا يوجد'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1004', 'فيصل خالد الغامدي', '0509659566', 'advanced', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'سلمان محمد الغامدي', '0502440034', 'علوم حاسب', 'المستوى الثالث',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['لغات البرمجة — C++','لغات البرمجة — Java','لغات البرمجة — SQL','تقنيات الويب — HTML','تقنيات الويب — CSS'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini'], 'intermediate', 'pending_review',
  'اقتراحات ورش قادمة اقترح :١-ورشه  تشرح مفاهيم وطريقه استخدامه لينكدن٢-ورشة Github تشرح طريقه استخدامه والاستفاده منه بمجالنا٣- ورشة عامة تتكلم عن مجالنا من fort end الى Back end'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1005', 'سلمان محمد الغامدي', '0502440034', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'لميس سعود الحارثي', '0531932953', 'هندسه حاسب', 'المستوى الثالث',
  'أستطيع كتابة الكود وبناء برامج بسيطة بشكل مستقل.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java','تقنيات الويب — HTML','تقنيات الويب — JavaScript'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','التصميم — Canva'], 'intermediate', 'pending_review',
  'ورشات دقيقه عن الادوات المستخدمه'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1006', 'لميس سعود الحارثي', '0531932953', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'لانا سلطان الجعيد', '0543819485', 'تقنية معلومات', 'الثالث ( ثاني سنة دراسية ).',
  'أستطيع تطوير مشاريع برمجية بشكل مستقل، ولدي خبرة في تنفيذ المشاريع.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java','لغات البرمجة — SQL'],
  ARRAY['محررات وبيئات تطوير — Visual Studio','إدارة الأكواد — GitHub','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini'], 'advanced', 'pending_review',
  'مواضيع ورش من الممكن ان تكون: تصميم واجهات سهلة الاستخدام و مظهرها رائع بحيث المستمعين يطبقون معنا!!'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1007', 'لانا سلطان الجعيد', '0543819485', 'advanced', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'شوق يوسف الزايدي', '0555994636', 'هندسة حاسب', 'متخرجة',
  'أستطيع كتابة الكود وبناء برامج بسيطة بشكل مستقل.', ARRAY['لغات البرمجة — SQL','تقنيات الويب — HTML','تقنيات الويب — CSS'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','محررات وبيئات تطوير — Google Colab','إدارة الأكواد — Git','إدارة الأكواد — GitHub','التصميم — Figma','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini'], 'intermediate', 'pending_review',
  'اتمنى اشوف معسكرات تكون لمدة اقل شي اسبوع يتم فيها شرح لشي تقني مثلاً ورشة تصميم موقع خاص بك او تصميم واجهة لموقع خاص بك'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1008', 'شوق يوسف الزايدي', '0555994636', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'نوره خالد العتيبي', '0539146404', 'علوم الحاسوب', 'الخامس',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini','الذكاء الاصطناعي — أدوات أخرى للمساعدة في البرمجة'], 'beginner', 'pending_review',
  'اقتراح ورشه تساعد الطلاب في توضيح ما المهم لي كطالب حاسب ان يكون في سيرتي الذاتيه كحديث تخرج مثلاً توضيح ماهي المشاريع المطلوبه اللي اقدر احطها في cv كطالبه هل من الضروري ان تكون مشاريع كبيره ومبتكره؟'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1009', 'نوره خالد العتيبي', '0539146404', 'beginner', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'بشرى محمد العتيبي', '0563595856', 'تقنية المعلومات', 'السابع',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java','لغات البرمجة — PHP','لغات البرمجة — SQL','تقنيات الويب — HTML','تقنيات الويب — CSS','تقنيات الويب — JavaScript'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','محررات وبيئات تطوير — IntelliJ IDEA','محررات وبيئات تطوير — Google Colab','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini','الذكاء الاصطناعي — GitHub Copilot','الذكاء الاصطناعي — أدوات أخرى للمساعدة في البرمجة'], 'intermediate', 'pending_review',
  'نبغى شرح اكثر عن قيت هب وكيف نستخدمه وايضاً نبغى ورشات تطبيقيه اكثر نستفيد منهاا وشكرا لقادة قوقلي ومنظميها واييش خلّك قوقلي✨'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1010', 'بشرى محمد العتيبي', '0563595856', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'بيادر سويلم القثامي', '0532897560', 'IT', 'السنة الرابعة',
  'أستطيع تطوير مشاريع برمجية بشكل مستقل، ولدي خبرة في تنفيذ المشاريع.', ARRAY['لغات البرمجة — C++','لغات البرمجة — Java','لغات البرمجة — PHP','لغات البرمجة — SQL','تقنيات الويب — HTML','تقنيات الويب — CSS','تقنيات الويب — JavaScript'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','محررات وبيئات تطوير — Visual Studio','التصميم — Canva','النشر والاستضافة والسحابة — Netlify','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini','الذكاء الاصطناعي — Replit AI'], 'intermediate', 'pending_review',
  '.'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1011', 'بيادر سويلم القثامي', '0532897560', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'درر العتيبي', '0553316259', 'علوم حاسب', 'المستوى الثالث',
  'أستطيع كتابة الكود وبناء برامج بسيطة بشكل مستقل.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java','لغات البرمجة — SQL'],
  ARRAY['إدارة الأكواد — GitHub','إدارة الأكواد — GitLab','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini','الذكاء الاصطناعي — أدوات أخرى للمساعدة في البرمجة'], 'intermediate', 'pending_review',
  'في الوقت الحالي م املك اقتراح لكن لو عندي اقتراح يتم طرحه في وقت لاحق'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1012', 'درر العتيبي', '0553316259', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'رياد سعد الحارثي', '0570720284', 'نظم معلومات إداريه', 'الثالث',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['تقنيات الويب — HTML','تقنيات الويب — CSS'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','التصميم — Canva','النشر والاستضافة والسحابة — Vercel','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Gemini'], 'intermediate', 'pending_review',
  'لايوجد حاليا'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1013', 'رياد سعد الحارثي', '0570720284', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'ميهاد حمود الحارثي', '0566837382', 'هندسه حاسب', 'المستوى الخامس',
  'أستطيع كتابة الكود وبناء برامج بسيطة بشكل مستقل.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','تقنيات الويب — HTML','تقنيات الويب — CSS','تقنيات الويب — JavaScript','بايثون وجافا سكربت قيد التعلم'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','إدارة الأكواد — Git','إدارة الأكواد — GitHub','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Gemini'], 'intermediate', 'pending_review',
  'فقره اسبوعيه بحيث الجميع يشارك اش تعلم وتكون عفويه وبسيطه ولا تتطلب شي كبير الهدف تحفيز اللي لسى يتعلم او يبي يتطور'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1014', 'ميهاد حمود الحارثي', '0566837382', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'ساره علي الشهري', '0598685770', 'علوم الحاسبات', 'الخامس',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['لغات البرمجة — C++','لغات البرمجة — Java','تقنيات الويب — HTML','تقنيات الويب — CSS'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini','الذكاء الاصطناعي — أدوات أخرى للمساعدة في البرمجة'], 'intermediate', 'pending_review',
  'عرض البرامج الأسهل استخداما لبناء مواقع الويب. شرح الأكواد الاساسيه الي نحتاجها لبناء موقع ويب.'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1015', 'ساره علي الشهري', '0598685770', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'دانه محسن الذبياني', '0501677670', 'تقنية معلومات', 'سابع',
  'أستطيع كتابة الكود وبناء برامج بسيطة بشكل مستقل.', ARRAY['لغات البرمجة — C++','لغات البرمجة — Java','لغات البرمجة — PHP','لغات البرمجة — SQL','تقنيات الويب — HTML','تقنيات الويب — CSS','تقنيات الويب — JavaScript'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','التصميم — Figma','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini','الذكاء الاصطناعي — Replit AI'], 'intermediate', 'pending_review',
  'تطبيق فعلي للاستفادة'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1016', 'دانه محسن الذبياني', '0501677670', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'موضي ضحيان البقمي', '0509719238', 'CS', 'مستوى ٦',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['لغات البرمجة — C++','لغات البرمجة — Java','وحاليا ادرس sql + اتعلم html'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Gemini'], 'intermediate', 'pending_review',
  '-Git وGitHub ونشر المواقع'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1017', 'موضي ضحيان البقمي', '0509719238', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'ريوف عبداللطيف العمري', '0533839664', 'علوم الحاسب', 'الخامس',
  'بدأت أتعلم أساسيات البرمجة.', ARRAY['لغات البرمجة — C++'],
  ARRAY['ما سبق لي استخدام هذه الأدوات'], 'beginner', 'pending_review',
  'كيفية بدأ الرحلة البرمجية وتنظيم الوقت خاصة مع الانشغالات اليومية'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1018', 'ريوف عبداللطيف العمري', '0533839664', 'beginner', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'اريج عطيه الثقفي', '0544517972', 'علوم حاسب', 'المستوى الثامن',
  'أستطيع تطوير مشاريع برمجية بشكل مستقل، ولدي خبرة في تنفيذ المشاريع.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java','لغات البرمجة — PHP','لغات البرمجة — SQL','تقنيات الويب — HTML','تقنيات الويب — CSS','تقنيات الويب — JavaScript'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','محررات وبيئات تطوير — Visual Studio','محررات وبيئات تطوير — Google Colab','إدارة الأكواد — GitHub','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Gemini'], 'advanced', 'pending_review',
  'يكون مثلا بعد كل ورشه زي تاسك من مبتدئ لمتقدم يخص الويب والأعضاء ينفذونه يساعد على الاستفاده بشكل افضل'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1019', 'اريج عطيه الثقفي', '0544517972', 'advanced', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'عبدالعزيز خالد عبدالعزيز العصيمي', '0556201207', 'علوم حاسب', '3',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','محررات وبيئات تطوير — Replit','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini'], 'beginner', 'pending_review',
  'كيفيه تطوير الموقع والتعامل مع الاخطاء دون الاستعانه باي اداه او شخص'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1020', 'عبدالعزيز خالد عبدالعزيز العصيمي', '0556201207', 'beginner', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'ليان غانم الحربي', '0503389783', 'تقنية معلومات', '5',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Gemini'], 'beginner', 'pending_review',
  'ورش عن تطوير تجربة المستخدم (UX) وتحليل سلوك'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1021', 'ليان غانم الحربي', '0503389783', 'beginner', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'ليان خالد الشهري', '0554128016', 'هندسة حاسب الي', 'الثالث السنه الثانيه',
  'أستطيع تطوير مشاريع برمجية بشكل مستقل، ولدي خبرة في تنفيذ المشاريع.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java','تقنيات الويب — HTML','تقنيات الويب — CSS','تقنيات الويب — JavaScript'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','محررات وبيئات تطوير — Jupyter Notebook','محررات وبيئات تطوير — Google Colab','النشر والاستضافة والسحابة — Netlify','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini','الذكاء الاصطناعي — GitHub Copilot','الذكاء الاصطناعي — Replit AI','الذكاء الاصطناعي — أدوات أخرى للمساعدة في البرمجة'], 'advanced', 'pending_review',
  'تكون مسجله و اقدر ارجع لها ب اي وقت'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1022', 'ليان خالد الشهري', '0554128016', 'advanced', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'نوره عبدالله سلطان السبيعي', '0556517116', 'علوم حاسب', 'الثالث',
  'أستطيع كتابة الكود وبناء برامج بسيطة بشكل مستقل.', ARRAY['لغات البرمجة — C++','لغات البرمجة — Java','تقنيات الويب — HTML','تقنيات الويب — CSS'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','إدارة الأكواد — GitHub','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Gemini','الذكاء الاصطناعي — أدوات أخرى للمساعدة في البرمجة'], 'intermediate', 'pending_review',
  'لا يوجد'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1023', 'نوره عبدالله سلطان السبيعي', '0556517116', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'رهف الخماش', '0534642733', 'علوم الحاسب', '3',
  'أستطيع كتابة الكود وبناء برامج بسيطة بشكل مستقل.', ARRAY['لغات البرمجة — C++','لغات البرمجة — Java','تقنيات الويب — HTML'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','إدارة الأكواد — Git','إدارة الأكواد — GitHub','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — GitHub Copilot'], 'intermediate', 'pending_review',
  'لا يوجد'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1024', 'رهف الخماش', '0534642733', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'جميلة بدر الروقي', '0500378066', 'علوم حاسب', 'المستوى الخامس',
  'أستطيع كتابة الكود وبناء برامج بسيطة بشكل مستقل.', ARRAY['لغات البرمجة — C++','تقنيات الويب — HTML','تقنيات الويب — CSS','تقنيات الويب — JavaScript'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','التصميم — Canva','التصميم — Adobe Photoshop','النشر والاستضافة والسحابة — Firebase','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Gemini','الذكاء الاصطناعي — أدوات أخرى للمساعدة في البرمجة'], 'intermediate', 'pending_review',
  'بصراحة اتمنى يتم عقد اجتماعات حضورية واشوف فيها تصميمات المواقع الإلكترونية الي صممها الأقدم مني في هذا المجال'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1025', 'جميلة بدر الروقي', '0500378066', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'ريوف سعد الخماش', '0534643346', 'علوم حاسب', 'الخامس',
  'أستطيع كتابة الكود وبناء برامج بسيطة بشكل مستقل.', ARRAY['لغات البرمجة — C++','تقنيات الويب — HTML'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','محررات وبيئات تطوير — Visual Studio','محررات وبيئات تطوير — PyCharm','إدارة الأكواد — Git','إدارة الأكواد — GitHub','إدارة الأكواد — GitLab'], 'intermediate', 'pending_review',
  'لا يوجد'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1026', 'ريوف سعد الخماش', '0534643346', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'شهد سعد الحارثي', '0563794588', 'علوم حاسب', '٩',
  'أستطيع كتابة الكود وبناء برامج بسيطة بشكل مستقل.', ARRAY['لغات البرمجة — C++','تقنيات الويب — HTML','تقنيات الويب — CSS','تقنيات الويب — JavaScript'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','محررات وبيئات تطوير — Replit','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Gemini'], 'intermediate', 'pending_review',
  'تقديم ورش عمليه وتطبيق معًا بحيث محد يتاخر عن الاخر وايضا يفضل تكون في الويكند مثلا لمدة ثلاث ساعات او اقل وايضا توضيح البرنامج اللي لازم نحملها واذا فيه شيء نحتاج نفهمه قبل الورشه وشاكره لكم جهودكم بنوتاتي'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1027', 'شهد سعد الحارثي', '0563794588', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'ريما عبدالعزيز العتيبي', '0541408052', 'علوم حاسب', 'الثالث',
  'أستطيع كتابة الكود وبناء برامج بسيطة بشكل مستقل.', ARRAY['لغات البرمجة — C++','لغات البرمجة — Java','تقنيات الويب — HTML','تقنيات الويب — CSS'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','محررات وبيئات تطوير — Visual Studio','النشر والاستضافة والسحابة — Netlify','الذكاء الاصطناعي — Gemini','الذكاء الاصطناعي — أدوات أخرى للمساعدة في البرمجة'], 'intermediate', 'pending_review',
  'لا يوجد'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1028', 'ريما عبدالعزيز العتيبي', '0541408052', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'بشاير سعيد الزهراني', '0532075320', 'علوم حاسب', 'الرابع',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java','لغات البرمجة — SQL','تقنيات الويب — HTML'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code','محررات وبيئات تطوير — Visual Studio','محررات وبيئات تطوير — PyCharm','التصميم — Figma','التصميم — Canva','الذكاء الاصطناعي — ChatGPT','الذكاء الاصطناعي — Claude','الذكاء الاصطناعي — Gemini'], 'intermediate', 'pending_review',
  'تقترحون مشروع ونقسم افرقه يشتغلون ويكون فيه ديدلاين للمشروع يكون افضل للتعلم'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1029', 'بشاير سعيد الزهراني', '0532075320', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
INSERT INTO survey_responses (
  full_name, phone_number, major, academic_year, programming_experience,
  prior_technologies, tools_used, calculated_level, status, notes
) VALUES (
  'رِفال ناصر النفيعي', '0545268445', 'تقنية المعلومات', 'السنه الرابعه المستوى الثامن',
  'تعلمت الأساسيات وطبقتها في تمارين وأمثلة بسيطة.', ARRAY['لغات البرمجة — Python','لغات البرمجة — C++','لغات البرمجة — Java','لغات البرمجة — SQL','تقنيات الويب — HTML','تقنيات الويب — JavaScript'],
  ARRAY['محررات وبيئات تطوير — Visual Studio Code'], 'intermediate', 'pending_review',
  'لا يوجد'
);
INSERT INTO invitations (code, target_name, target_phone, suggested_level, assigned_role)
VALUES ('GDG-TU-2026-1030', 'رِفال ناصر النفيعي', '0545268445', 'intermediate', 'member')
ON CONFLICT (code) DO NOTHING;
