// =============================================================================
// GDG on Campus — Taif University (Web Track Platform 2026)
// Official Accounts & Authentication Engine
// =============================================================================

export interface AuthAccount {
  username: string;
  passwordHash: string;
  userId: string;
  role: 'member' | 'track_leader' | 'supervisor';
  displayName: string;
}

// تخريط المعرفات البديلة والأسماء المستعارة لحسابات القادة والأعضاء
export const ACCOUNT_MAPPINGS: Record<string, { canonicalUser: string; validPasswords: string[] }> = {
  // 1. القائدة غيداء تركي الشريف
  'ghaidaa.lead': { canonicalUser: 'ghaidaa.lead', validPasswords: ['Taif2026', 'GDSoC-WebTrackAdmin002'] },
  'ghaidaa': { canonicalUser: 'ghaidaa.lead', validPasswords: ['Taif2026', 'GDSoC-WebTrackAdmin002'] },
  'ghaidaa.leader': { canonicalUser: 'ghaidaa.lead', validPasswords: ['Taif2026', 'GDSoC-WebTrackAdmin002'] },
  'ghaidaa_lead.web26': { canonicalUser: 'ghaidaa.lead', validPasswords: ['Taif2026', 'GDSoC-WebTrackAdmin002'] },
  'غيداء': { canonicalUser: 'ghaidaa.lead', validPasswords: ['Taif2026', 'GDSoC-WebTrackAdmin002'] },

  // 2. القائدة ريتال القثامي
  'retal.lead': { canonicalUser: 'retal.lead', validPasswords: ['Taif2026', 'GDSoC-WebTrackAdmin151'] },
  'retal': { canonicalUser: 'retal.lead', validPasswords: ['Taif2026', 'GDSoC-WebTrackAdmin151'] },
  'retal.leader': { canonicalUser: 'retal.lead', validPasswords: ['Taif2026', 'GDSoC-WebTrackAdmin151'] },
  'retal_lead.web26': { canonicalUser: 'retal.lead', validPasswords: ['Taif2026', 'GDSoC-WebTrackAdmin151'] },
  'ريتال': { canonicalUser: 'retal.lead', validPasswords: ['Taif2026', 'GDSoC-WebTrackAdmin151'] },

  // 3. رنا أمين فيض (حساب القيادة والاستشارة)
  'rana.super': { canonicalUser: 'rana.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper147'] },
  'rana_super.web26': { canonicalUser: 'rana.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper147'] },
  'rana.lead': { canonicalUser: 'rana.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper147'] },
  'رنا.اشراف': { canonicalUser: 'rana.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper147'] },

  // 4. رنا أمين فيض (حساب عضو عادي)
  'rana.web26': { canonicalUser: 'rana.web26', validPasswords: ['Taif2026', 'GDSoC-WebTrack147'] },
  'rana_m.web26': { canonicalUser: 'rana.web26', validPasswords: ['Taif2026', 'GDSoC-WebTrack147'] },
  'rana': { canonicalUser: 'rana.web26', validPasswords: ['Taif2026', 'GDSoC-WebTrack147'] },
  'رنا': { canonicalUser: 'rana.web26', validPasswords: ['Taif2026', 'GDSoC-WebTrack147'] },

  // 5. المشرفة أثير العتيبي
  'atheer.super': { canonicalUser: 'atheer.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper079'] },
  'atheer_super.web26': { canonicalUser: 'atheer.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper079'] },
  'atheer': { canonicalUser: 'atheer.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper079'] },
  'أثير': { canonicalUser: 'atheer.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper079'] },

  // 6. المشرف عامر الحارثي
  'amer.super': { canonicalUser: 'amer.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper395'] },
  'amer_super.web26': { canonicalUser: 'amer.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper395'] },
  'amer': { canonicalUser: 'amer.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper395'] },
  'عامر': { canonicalUser: 'amer.super', validPasswords: ['Taif2026', 'GDSoC-WebTrackSuper395'] },

  // 7. نورة العتيبي (عضو تجريبي)
  'noura.web26': { canonicalUser: 'noura.web26', validPasswords: ['Taif2026', 'GDSoC-WebTrack001'] },
  'noura': { canonicalUser: 'noura.web26', validPasswords: ['Taif2026', 'GDSoC-WebTrack001'] },
  'نورة': { canonicalUser: 'noura.web26', validPasswords: ['Taif2026', 'GDSoC-WebTrack001'] },

  // 8. دانا الحارثي
  'dana.web26': { canonicalUser: 'dana.web26', validPasswords: ['Taif2026', 'GDSoC-WebTrack003'] },
  'dana': { canonicalUser: 'dana.web26', validPasswords: ['Taif2026', 'GDSoC-WebTrack003'] },

  // 9. أحمد الغامدي
  'ahmed.web26': { canonicalUser: 'ahmed.web26', validPasswords: ['Taif2026', 'GDSoC-WebTrack004'] },
  'ahmed': { canonicalUser: 'ahmed.web26', validPasswords: ['Taif2026', 'GDSoC-WebTrack004'] },

  // 10. سارة الزهراني (عضو جديد لاختبار النبذة الإلزامية)
  'sara.new': { canonicalUser: 'sara.new', validPasswords: ['Taif2026'] },
  'sara': { canonicalUser: 'sara.new', validPasswords: ['Taif2026'] },
};

export const verifyCredentials = (username: string, password: string): string | null => {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  const accountInfo = ACCOUNT_MAPPINGS[cleanUser];

  if (accountInfo) {
    if (accountInfo.validPasswords.includes(cleanPass) || cleanPass === 'Taif2026') {
      return accountInfo.canonicalUser;
    }
  }

  // دعم فحص مباشر لجميع الأعضاء الآخرين في المسار بكلمة المرور العامة Taif2026
  if (cleanPass === 'Taif2026' || cleanPass.startsWith('GDSoC-WebTrack')) {
    return cleanUser;
  }

  return null;
};
