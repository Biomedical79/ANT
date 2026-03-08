import { prisma } from '../config/prisma.js';

const SYMBOL_LIBRARY = ['heavy base', 'smooth dome', 'central mark', 'rising lines', 'branching roads', 'dense wall residue', 'bird-like shapes', 'fish-like shapes', 'eye-like marks', 'circles', 'peaks', 'openings', 'drops', 'clustered dark areas', 'door-like spaces', 'path-like trails'];

const DEPTH_DETAILS = {
  basic: { symbolCount: 4, style: 'concise symbolic summary' },
  medium: { symbolCount: 6, style: 'balanced interpretation with practical signals' },
  advanced: { symbolCount: 8, style: 'multi-domain synthesis with nuance' },
  deep: { symbolCount: 10, style: 'layered analysis with timing and hidden influence depth' }
};

function randomSymbols(count) {
  return [...SYMBOL_LIBRARY].sort(() => Math.random() - 0.5).slice(0, count);
}

function zodiacFromBirthDate(birthDate) {
  if (!birthDate) return 'Unknown';
  const d = new Date(birthDate);
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const signs = [
    ['Capricorn', 1, 19], ['Aquarius', 2, 18], ['Pisces', 3, 20], ['Aries', 4, 19], ['Taurus', 5, 20],
    ['Gemini', 6, 20], ['Cancer', 7, 22], ['Leo', 8, 22], ['Virgo', 9, 22], ['Libra', 10, 22],
    ['Scorpio', 11, 21], ['Sagittarius', 12, 21], ['Capricorn', 12, 31]
  ];
  const match = signs.find(([, sm, sd], i) => (m < sm || (m === sm && day <= sd)) && i > 0);
  return match ? signs[signs.indexOf(match) - 1][0] : 'Capricorn';
}

function buildDepthNarrative(depth, symbols, zodiac, language) {
  const first = symbols.slice(0, 3).join(', ');
  if (language === 'ar') {
    const map = {
      basic: `تحليل أساسي: الرموز الأوضح (${first}) تشير إلى مسار عام يحتاج هدوءًا وخطوات عملية.`,
      medium: `تحليل متوسط: تفاعل الرموز (${first}) مع نمطك الفلكي (${zodiac}) يقترح قرارات تدريجية مع مراجعة الأولويات.`,
      advanced: `تحليل متقدم: تقاطع طبقات الرموز (${symbols.join('، ')}) مع تاريخ الميلاد يعطي مؤشرات متعددة للحب والعمل والمال بتوازن أدق.`,
      deep: `تحليل عميق: البنية الرمزية الكاملة (${symbols.join('، ')}) مع الخلفية الفلكية (${zodiac}) تكشف تأثيرات خفية، توقيتًا حساسًا، ومسارات بديلة تحتاج وعيًا عاليًا.`
    };
    return map[depth];
  }
  const map = {
    basic: `Basic analysis: primary symbols (${first}) indicate a general direction that benefits from calm, practical steps.`,
    medium: `Medium analysis: symbol interplay (${first}) with your zodiac context (${zodiac}) suggests phased decisions and priority review.`,
    advanced: `Advanced analysis: cross-layer symbolism (${symbols.join(', ')}) plus birth-date framing points to nuanced outcomes across love, work, and money.`,
    deep: `Deep analysis: full symbolic structure (${symbols.join(', ')}) with zodiac context (${zodiac}) highlights hidden influences, sensitive timing, and alternative paths.`
  };
  return map[depth];
}

export const aiReadingService = {
  async generate({ reading, language = 'ar' }) {
    const prompt = await prisma.promptTemplate.findFirst({ where: { language, isActive: true }, orderBy: { updatedAt: 'desc' } });
    const analysisDepth = reading.personalDetails?.analysisDepth || 'medium';
    const depthCfg = DEPTH_DETAILS[analysisDepth] || DEPTH_DETAILS.medium;
    const detected = randomSymbols(depthCfg.symbolCount);
    const zodiac = zodiacFromBirthDate(reading.personalDetails?.birthDate);
    const depthNarrative = buildDepthNarrative(analysisDepth, detected, zodiac, language);

    const payload = {
      user_name: reading.personalDetails?.fullName || 'Guest',
      birth_date: reading.personalDetails?.birthDate || null,
      language,
      zodiac_sign: zodiac,
      question_category: reading.questionCategory,
      selected_modes: reading.selectedModes,
      analysis_depth: analysisDepth,
      analysis_depth_style: depthCfg.style,
      detected_symbols: detected,
      summary: language === 'ar' ? 'تظهر إشارات تدريجية تدعم التأمل واتخاذ خطوات مدروسة.' : 'The cup suggests gradual momentum and reflective decision-making.',
      arabic_style_reading: language === 'ar' ? 'وجود خطوط صاعدة مع مركز واضح يدل على نضوج فكرة مهمة.' : 'Rising lines with a central mark suggest a mature idea taking shape.',
      oriental_style_reading: language === 'ar' ? 'تشير المسارات المتفرعة إلى خيارات متعددة تحتاج أولوية واضحة.' : 'Branching trails indicate multiple paths requiring clear prioritization.',
      tarot_overlay: language === 'ar' ? 'رمزية مشابهة لبطاقة الاعتدال: التوازن قبل القفز.' : 'Symbolically similar to Temperance: balance before a leap.',
      horoscope_overlay: language === 'ar' ? `الخلفية الفلكية (${zodiac}) تميل للصبر العملي والتخطيط المرحلي.` : `Zodiac framing (${zodiac}) favors practical patience and phased planning.`,
      depth_interpretation: depthNarrative,
      love: language === 'ar' ? 'تحسن تدريجي في التواصل مع الحاجة للوضوح.' : 'Communication improves gradually with a need for clarity.',
      work: language === 'ar' ? 'فرصة مهنية تتطلب ترتيب الأولويات.' : 'A career opening emerges when priorities are aligned.',
      money: language === 'ar' ? 'نمط مالي أفضل مع ضبط الإنفاق العاطفي.' : 'Financial patterns improve with reduced impulse spending.',
      travel: language === 'ar' ? 'إشارة خفيفة لتحرك قصير مفيد ذهنيًا.' : 'A light sign points to a short mentally refreshing trip.',
      hidden_influences: language === 'ar' ? 'تأثيرات محيطة داعمة لكن غير مباشرة.' : 'Supportive yet indirect influences are present.',
      timing: language === 'ar' ? 'التوقيت المناسب خلال 3 إلى 6 أسابيع.' : 'Favorable timing appears in 3 to 6 weeks.',
      final_message: language === 'ar' ? 'اتبع حدسك بهدوء وتقدم بخطوات ثابتة.' : 'Trust your intuition calmly and move in steady steps.',
      disclaimer: prompt?.disclaimer || 'Entertainment-only symbolic interpretation; no guaranteed outcomes.'
    };

    return payload;
  }
};
