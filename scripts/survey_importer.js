/**
 * آلية استيراد وتصنيف بيانات استبيان أعضاء مسار الويب (Google Forms CSV)
 * متوافقة مع متطلبات وثيقة PRD v1.5 والقرارات المعتمدة
 */

const fs = require('fs');
const path = require('path');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

function normalizePhone(rawPhone) {
  if (!rawPhone) return '';
  let p = rawPhone.toString().trim().replace(/[^0-9]/g, '');
  if (p.startsWith('966')) p = p.substring(3);
  if (p.length === 9 && p.startsWith('5')) {
    p = '0' + p;
  }
  return p;
}

function classifyLevel(programmingExp, priorTechs, tools) {
  const techsLower = (priorTechs || []).join(' ').toLowerCase();
  const toolsLower = (tools || []).join(' ').toLowerCase();

  const hasFramework = techsLower.includes('react') || techsLower.includes('next.js') || techsLower.includes('node.js') || techsLower.includes('typescript');
  const hasGit = toolsLower.includes('git') || toolsLower.includes('github');
  const hasWebBasics = techsLower.includes('html') || techsLower.includes('css') || techsLower.includes('javascript');

  if (programmingExp.includes('أستطيع تطوير مشاريع برمجية بشكل مستقل') && (hasFramework || hasGit)) {
    return 'advanced';
  } else if (
    programmingExp.includes('أستطيع كتابة الكود وبناء برامج بسيطة') || 
    programmingExp.includes('أستطيع تطوير مشاريع برمجية') || 
    hasWebBasics
  ) {
    return 'intermediate';
  } else {
    return 'beginner';
  }
}

function processSurveyCSV(csvFilePath) {
  const content = fs.readFileSync(csvFilePath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return null;

  const header = parseCSVLine(lines[0]);
  const rawRows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 5) continue;

    rawRows.push({
      rowIndex: i,
      timestamp: cols[0]?.trim(),
      fullName: cols[1]?.trim(),
      rawPhone: cols[2]?.trim(),
      phone: normalizePhone(cols[2]),
      major: cols[3]?.trim(),
      academicYear: cols[4]?.trim(),
      programmingExp: cols[5]?.trim() || '',
      priorTechs: cols[6] ? cols[6].split(';').map(s => s.trim()).filter(Boolean) : [],
      knownConcepts: cols[7] ? cols[7].split(';').map(s => s.trim()).filter(Boolean) : [],
      problemSolving: cols[8]?.trim() || '',
      uiUxExp: cols[9]?.trim() || '',
      toolsUsed: cols[10] ? cols[10].split(';').map(s => s.trim()).filter(Boolean) : [],
      targetSkills: cols[11] ? cols[11].split(';').map(s => s.trim()).filter(Boolean) : [],
      trackGoals: cols[12]?.trim() || '',
      workshopSuggestions: cols[13]?.trim() || ''
    });
  }

  // فرز وتمييز السجلات: المكررة، القادة، والأعضاء
  const phoneMap = new Map();
  const duplicateRecords = [];
  const leaderRecords = [];
  const validMemberRecords = [];

  for (const row of rawRows) {
    // 1. استثناء قائدتي المسار (غيداء وريتال)
    if (row.fullName.includes('غيداء تركي الشريف') || row.fullName.includes('ريتال')) {
      leaderRecords.push({
        ...row,
        role: 'track_leader',
        calculatedLevel: 'track_leader',
        status: 'excluded_leader',
        note: 'قائدة المسار — مستثناة من تصنيف مستويات الطلاب الاعتيادية وفقاً للـ PRD'
      });
      continue;
    }

    // 2. كشف السجلات المكررة بالهاتف والاسم
    const dedupeKey = `${row.fullName}_${row.phone}`;
    if (phoneMap.has(dedupeKey)) {
      const existing = phoneMap.get(dedupeKey);
      // اعتماد الاستجابة الأحدث وأرشفة الأقدم
      duplicateRecords.push({
        archivedRecord: existing,
        activeRecord: row,
        reason: 'تكرار إرسال الاستبيان من نفس الطالبة — تم اعتماد الاستجابة الأحدث'
      });
      // تحديث السجل إلى الأحدث
      phoneMap.set(dedupeKey, row);
    } else {
      phoneMap.set(dedupeKey, row);
    }
  }

  // تجميع السجلات الصالحة وتطبيق التصنيف
  for (const [key, row] of phoneMap.entries()) {
    const calculatedLevel = classifyLevel(row.programmingExp, row.priorTechs, row.toolsUsed);
    validMemberRecords.push({
      ...row,
      role: 'member',
      calculatedLevel,
      status: 'pending_review', // بانتظار اعتماد القائدة
      suggestedPlan: `خطة مسار الـ ${calculatedLevel === 'advanced' ? 'متقدم' : calculatedLevel === 'intermediate' ? 'متوسط' : 'مبتدئ'}`
    });
  }

  // توزيع إحصائي للمستويات
  const levelDistribution = {
    beginner: validMemberRecords.filter(m => m.calculatedLevel === 'beginner').length,
    intermediate: validMemberRecords.filter(m => m.calculatedLevel === 'intermediate').length,
    advanced: validMemberRecords.filter(m => m.calculatedLevel === 'advanced').length
  };

  return {
    totalRawSubmissions: rawRows.length,
    duplicatesCount: duplicateRecords.length,
    leadersCount: leaderRecords.length,
    validMembersCount: validMemberRecords.length,
    levelDistribution,
    duplicateRecords,
    leaderRecords,
    validMemberRecords
  };
}

module.exports = {
  processSurveyCSV,
  classifyLevel,
  normalizePhone
};

if (require.main === module) {
  const defaultCSV = '/Users/manalalshareef/Downloads/استبيان التعرف على أعضاء مسار الويب.csv';
  console.log('=== تشغيل محاكاة معالجة وتدقيق الاستبيان (Dry Run) ===');
  const report = processSurveyCSV(defaultCSV);
  console.log('إجمالي الردود المستلمة:', report.totalRawSubmissions);
  console.log('السجلات المكررة المعالجة:', report.duplicatesCount);
  console.log('سجلات القادة المستثناة من تصنيف الطلاب:', report.leadersCount);
  console.log('الأعضاء الصالحين المعتمدين لإنشاء الدعوات:', report.validMembersCount);
  console.log('توزيع المستويات المقترحة:', report.levelDistribution);
  console.log('\nتفاصيل السجلات المكررة:', report.duplicateRecords.map(d => ({
    name: d.activeRecord.fullName,
    phone: d.activeRecord.phone,
    timestamp: d.activeRecord.timestamp
  })));
  console.log('\nسجلات القيادة:', report.leaderRecords.map(l => ({ name: l.fullName, role: l.role })));
}
