const fs = require('fs');

let fileContent = fs.readFileSync('membersData.js', 'utf8');

// The mapping for all 30 members to _M.web26
const memberUsernames = {
  1: 'Rimas_M.web26',       // ريماس محمد الحارثي
  2: 'Shadha_M.web26',      // شذى بندر الحارثي
  3: 'Dana_M.web26',        // دانه عبدالله الشهري (The primary Dana!)
  4: 'Faisal_M.web26',      // فيصل خالد الغامدي
  5: 'Salman_M.web26',      // سلمان محمد الغامدي
  6: 'Lamis_M.web26',       // لميس سعود الحارثي
  7: 'Lana_M.web26',        // لانا سلطان الجعيد
  8: 'Shouq_M.web26',       // شوق يوسف الزايدي
  9: 'Noura_M.web26',       // نوره خالد العتيبي
  10: 'Bushra_M.web26',     // بشرى محمد العتيبي
  11: 'Bayader_M.web26',    // بيادر سويلم القثامي
  12: 'Durar_M.web26',      // درر العتيبي
  13: 'Reyad_M.web26',      // رياد سعد الحارثي
  14: 'Mehad_M.web26',      // ميهاد حمود الحارثي
  15: 'Sarah_M.web26',      // ساره علي الشهري
  16: 'Dana_Z_M.web26',     // دانه محسن الذبياني (Z for Zahrani/Dhibyani to differentiate)
  17: 'Modhi_M.web26',      // موضي ضحيان البقمي
  18: 'Ryoof_M.web26',      // ريوف عبداللطيف العمري
  19: 'Areej_M.web26',      // اريج عطيه الثقفي
  20: 'Abdulaziz_M.web26',  // عبدالعزيز خالد العصيمي
  21: 'Layan_M.web26',      // ليان غانم الحربي
  22: 'Layan_S_M.web26',    // ليان خالد الشهري
  23: 'Noura_S_M.web26',    // نوره عبدالله السبيعي
  24: 'Rahaf_M.web26',      // رهف الخماش
  25: 'Jameela_M.web26',    // جميلة بدر الروقي
  26: 'Ryoof_S_M.web26',    // ريوف سعد الخماش
  27: 'Shahad_M.web26',     // شهد سعد الحارثي
  28: 'Reema_M.web26',      // ريما عبدالعزيز العتيبي
  29: 'Bashayer_M.web26',   // بشاير سعيد الزهراني
  30: 'Refal_M.web26'       // رفال ناصر النفيعي
};

// Update membersData.js
Object.entries(memberUsernames).forEach(([id, newUsername]) => {
  // Replace old usernames
  const regex = new RegExp(`("id":\\s*${id},[\\s\\S]*?"username":\\s*")[^"]+(")`);
  fileContent = fileContent.replace(regex, `$1${newUsername}$2`);
});

fs.writeFileSync('membersData.js', fileContent, 'utf8');
console.log('Standardized all usernames in membersData.js to _M.web26!');

// Update index.html presets
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replaceAll('Dana_A.web26', 'Dana_M.web26');
fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Updated index.html presets to Dana_M.web26!');

// Update script.js presets
let scriptJs = fs.readFileSync('script.js', 'utf8');
scriptJs = scriptJs.replaceAll('Dana_A.web26', 'Dana_M.web26');
fs.writeFileSync('script.js', scriptJs, 'utf8');
console.log('Updated script.js presets to Dana_M.web26!');

// Update full_setup_2026.sql
let fullSql = fs.readFileSync('supabase/full_setup_2026.sql', 'utf8');
fullSql = fullSql.replaceAll('Dana_A.web26', 'Dana_M.web26');
fs.writeFileSync('supabase/full_setup_2026.sql', fullSql, 'utf8');
console.log('Updated full_setup_2026.sql to Dana_M.web26!');
