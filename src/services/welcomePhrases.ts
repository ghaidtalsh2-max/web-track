// =============================================================================
// GDG on Campus — Taif University (Web Track Platform 2026)
// Welcome Phrases Engine: 32 Saudi Dialect Greetings (M/F) & Anti-repetition Logic
// =============================================================================

import { WelcomePhrase, UserProfile } from '../types';

export const INITIAL_WELCOME_PHRASES: WelcomePhrase[] = [
  // 1. عام (General)
  {
    id: 'wp-gen-1',
    category: 'general',
    text_m: 'يا هلا والله يا {name}! نوّرت مسار الويب 🚀',
    text_f: 'يا هلا والله يا {name}! نوّرتي مسار الويب 🚀',
    active: true,
  },
  {
    id: 'wp-gen-2',
    category: 'general',
    text_m: 'مرحباً بك {name}، جاهز لإبداع اليوم؟ ✨',
    text_f: 'مرحباً بكِ {name}، جاهزة لإبداع اليوم؟ ✨',
    active: true,
  },
  {
    id: 'wp-gen-3',
    category: 'general',
    text_m: 'حياك الله يا {name}، اليوم يوم برمجي مميز 🔥',
    text_f: 'حياكِ الله يا {name}، اليوم يوم برمجي مميز 🔥',
    active: true,
  },
  {
    id: 'wp-gen-4',
    category: 'general',
    text_m: 'يا مية أهلاً وسهلاً {name}، كودك ينتظرك!',
    text_f: 'يا مية أهلاً وسهلاً {name}، كودكِ ينتظرك!',
    active: true,
  },
  {
    id: 'wp-gen-5',
    category: 'general',
    text_m: 'يا هلا ببطل الويب {name}، خلنا نبدع سوى 💻',
    text_f: 'يا هلا ببطلة الويب {name}، خلنا نبدع سوى 💻',
    active: true,
  },
  {
    id: 'wp-gen-6',
    category: 'general',
    text_m: 'أهلاً {name}! القوقليين متحمّسين لجديدك 🌟',
    text_f: 'أهلاً {name}! القوقليات متحمّسات لجديدك 🌟',
    active: true,
  },

  // 2. صباحي (Morning)
  {
    id: 'wp-morn-1',
    category: 'morning',
    text_m: 'صباح الخير والهمّة العالية يا {name} ☀️',
    text_f: 'صباح الخير والهمّة العالية يا {name} ☀️',
    active: true,
  },
  {
    id: 'wp-morn-2',
    category: 'morning',
    text_m: 'صباح النشاط والأكواد الحلوة يا {name} ☕',
    text_f: 'صباح النشاط والأكواد الحلوة يا {name} ☕',
    active: true,
  },
  {
    id: 'wp-morn-3',
    category: 'morning',
    text_m: 'أحلى صباح مع قهوة وكود نظيف يا {name} 💻',
    text_f: 'أحلى صباح مع قهوة وكود نظيف يا {name} 💻',
    active: true,
  },
  {
    id: 'wp-morn-4',
    category: 'morning',
    text_m: 'صباح الورد والإنتاجية يا {name}! 🌸',
    text_f: 'صباح الورد والإنتاجية يا {name}! 🌸',
    active: true,
  },
  {
    id: 'wp-morn-5',
    category: 'morning',
    text_m: 'أهلاً بصباحك المشرق يا {name}، يومك موفق 🚀',
    text_f: 'أهلاً بصباحكِ المشرق يا {name}، يومكِ موفق 🚀',
    active: true,
  },
  {
    id: 'wp-morn-6',
    category: 'morning',
    text_m: 'صباح البدايات المتجددة في مسار الويب يا {name} ✨',
    text_f: 'صباح البدايات المتجددة في مسار الويب يا {name} ✨',
    active: true,
  },

  // 3. مسائي (Evening)
  {
    id: 'wp-eve-1',
    category: 'evening',
    text_m: 'مساء الإبداع والروقان يا {name} 🌙',
    text_f: 'مساء الإبداع والروقان يا {name} 🌙',
    active: true,
  },
  {
    id: 'wp-eve-2',
    category: 'evening',
    text_m: 'مساء الخير يا {name}، كيف كان يومك البرمجي؟ 🌆',
    text_f: 'مساء الخير يا {name}، كيف كان يومكِ البرمجي؟ 🌆',
    active: true,
  },
  {
    id: 'wp-eve-3',
    category: 'evening',
    text_m: 'يا هلا بمساء الجمال مع مطوّرنا {name} 🌟',
    text_f: 'يا هلا بمساء الجمال مع مطوّرتنا {name} 🌟',
    active: true,
  },
  {
    id: 'wp-eve-4',
    category: 'evening',
    text_m: 'مساء الأفكار العبقرية يا {name} 💡',
    text_f: 'مساء الأفكار العبقرية يا {name} 💡',
    active: true,
  },
  {
    id: 'wp-eve-5',
    category: 'evening',
    text_m: 'أحلى مساء لأرهب عضو في نادي قوقل {name} ⚡',
    text_f: 'أحلى مساء لأرهب عضوة في نادي قوقل {name} ⚡',
    active: true,
  },
  {
    id: 'wp-eve-6',
    category: 'evening',
    text_m: 'مساء السكينة والأكواد الراقية يا {name} 🌃',
    text_f: 'مساء السكينة والأكواد الراقية يا {name} 🌃',
    active: true,
  },

  // 4. سلسلة الدخول (Streak)
  {
    id: 'wp-strk-1',
    category: 'streak',
    text_m: 'كفو يا {name}! مستمر معنا لليوم {n} على التوالي 🔥',
    text_f: 'كفو يا {name}! مستمرة معنا لليوم {n} على التوالي 🔥',
    active: true,
  },
  {
    id: 'wp-strk-2',
    category: 'streak',
    text_m: 'استمرارك يا {name} فخر لنا، واصل يا مبدع 👏',
    text_f: 'استمراركِ يا {name} فخر لنا، واصلي يا مبدعة 👏',
    active: true,
  },
  {
    id: 'wp-strk-3',
    category: 'streak',
    text_m: 'ما شاء الله يا {name}! شغفك والتزامك سر تميزك 🚀',
    text_f: 'ما شاء الله يا {name}! شغفكِ والتزامكِ سر تميزكِ 🚀',
    active: true,
  },
  {
    id: 'wp-strk-4',
    category: 'streak',
    text_m: 'سلسلة دخول أسطورية يا {name}! واصل الطريق 🏔️',
    text_f: 'سلسلة دخول أسطورية يا {name}! واصلي الطريق 🏔️',
    active: true,
  },
  {
    id: 'wp-strk-5',
    category: 'streak',
    text_m: 'العادة البرمجية تصنع المستحيل، كفو يا {name} ⏱️',
    text_f: 'العادة البرمجية تصنع المستحيل، كفو يا {name} ⏱️',
    active: true,
  },
  {
    id: 'wp-strk-6',
    category: 'streak',
    text_m: 'يوم بعد يوم تثبت أنك قد التحدي يا {name} 💪',
    text_f: 'يوم بعد يوم تثبتين أنكِ قد التحدي يا {name} 💪',
    active: true,
  },

  // 5. إنجاز ونقاط (Achievement)
  {
    id: 'wp-ach-1',
    category: 'achievement',
    text_m: 'مبروك يا {name}! رصيدك الآن {points} نقطة، إنجاز كبير 🏆',
    text_f: 'مبروك يا {name}! رصيدكِ الآن {points} نقطة، إنجاز كبير 🏆',
    active: true,
  },
  {
    id: 'wp-ach-2',
    category: 'achievement',
    text_m: 'نقاطك وصلت {points} يا {name}! راية التميز بيدك 🎯',
    text_f: 'نقاطكِ وصلت {points} يا {name}! راية التميز بيدكِ 🎯',
    active: true,
  },
  {
    id: 'wp-ach-3',
    category: 'achievement',
    text_m: 'يا فخر المسار يا {name}، جمعت {points} نقطة بجدارة ⭐',
    text_f: 'يا فخر المسار يا {name}، جمعتِ {points} نقطة بجدارة ⭐',
    active: true,
  },
  {
    id: 'wp-ach-4',
    category: 'achievement',
    text_m: 'إنجازاتك تتحدث عنك يا {name}، أرقامك في تصاعد 📈',
    text_f: 'إنجازاتكِ تتحدث عنكِ يا {name}، أرقامكِ في تصاعد 📈',
    active: true,
  },
  {
    id: 'wp-ach-5',
    category: 'achievement',
    text_m: 'مستوى مبهر يا {name}! قربت من التتويج النهائي 👑',
    text_f: 'مستوى مبهر يا {name}! قربتِ من التتويج النهائي 👑',
    active: true,
  },
  {
    id: 'wp-ach-6',
    category: 'achievement',
    text_m: 'يا بطل الويب {name}، {points} نقطة تعكس جهدك الجبار 🏅',
    text_f: 'يا بطلة الويب {name}، {points} نقطة تعكس جهدكِ الجبار 🏅',
    active: true,
  },
  {
    id: 'wp-ach-7',
    category: 'achievement',
    text_m: 'إبداع لا يتوقف يا {name}، أثرك واضح في المسار ❤️',
    text_f: 'إبداع لا يتوقف يا {name}، أثركِ واضح في المسار ❤️',
    active: true,
  },
  {
    id: 'wp-ach-8',
    category: 'achievement',
    text_m: 'مع كل سطر كود ترسم مستقبلك يا {name}، فخورين فيك 🌟',
    text_f: 'مع كل سطر كود ترسمين مستقبلكِ يا {name}، فخورين فيكِ 🌟',
    active: true,
  },
];

const STORAGE_KEY = 'gdg_webtrack_welcome_phrases_v2';

export function getStoredPhrases(): WelcomePhrase[] {
  if (typeof window === 'undefined') return INITIAL_WELCOME_PHRASES;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WELCOME_PHRASES));
    return INITIAL_WELCOME_PHRASES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_WELCOME_PHRASES;
  }
}

export function savePhrases(phrases: WelcomePhrase[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases));
}

/**
 * يختار عبارة ترحيبية ذكية ومناسبة لسياق العضو مع منع تكرار نفس العبارة في دخولين متتاليين
 */
export function selectWelcomePhrase(
  user: UserProfile,
  streakCount = 3
): { text: string; phraseId: string } {
  const phrases = getStoredPhrases().filter((p) => p.active);
  const now = new Date();
  const hour = now.getHours(); // 0 - 23

  // تحديد الفئات المناسبة للوقت الحالي
  const suitableCategories: ('general' | 'morning' | 'evening' | 'streak' | 'achievement')[] = [
    'general',
  ];

  if (hour >= 5 && hour < 12) {
    suitableCategories.push('morning');
  } else {
    suitableCategories.push('evening');
  }

  if (streakCount >= 2) {
    suitableCategories.push('streak');
  }

  if ((user.points || 0) >= 50) {
    suitableCategories.push('achievement');
  }

  // فلترة العبارات النشطة التي تنتمي للفئات المناسبة مع استبعاد آخر عبارة عُرضت لهذا العضو
  let candidates = phrases.filter(
    (p) => suitableCategories.includes(p.category) && p.id !== user.last_phrase_id
  );

  // إذا لم يتبق مرشحون، نسمح بأي عبارة غير الأخيرة
  if (candidates.length === 0) {
    candidates = phrases.filter((p) => p.id !== user.last_phrase_id);
  }

  // إذا كانت القائمة لا تزال فارغة (مثلاً لو كانت هناك عبارة واحدة فقط)، نأخذ المتاح
  if (candidates.length === 0) {
    candidates = phrases;
  }

  const chosen = candidates[Math.floor(Math.random() * candidates.length)] || INITIAL_WELCOME_PHRASES[0];

  const isFemale = user.gender === 'female';
  const rawTemplate = isFemale ? chosen.text_f : chosen.text_m;
  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'المبدع';

  const interpolated = rawTemplate
    .replace(/{name}/g, firstName)
    .replace(/{points}/g, (user.points || 0).toString())
    .replace(/{n}/g, streakCount.toString());

  return {
    text: interpolated,
    phraseId: chosen.id,
  };
}
