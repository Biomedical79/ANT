import { prisma } from '../config/prisma.js';

const SYMBOL_LIBRARY = ['heavy base', 'smooth dome', 'central mark', 'rising lines', 'branching roads', 'bird-like shapes', 'fish-like shapes', 'eye-like marks', 'path-like trails'];

function randomSymbols() {
  return SYMBOL_LIBRARY.sort(() => Math.random() - 0.5).slice(0, 5);
}

export const aiReadingService = {
  async generate({ reading, language = 'ar' }) {
    const prompt = await prisma.promptTemplate.findFirst({ where: { language, isActive: true }, orderBy: { updatedAt: 'desc' } });
    const detected = randomSymbols();

    const payload = {
      user_name: reading.personalDetails?.fullName || 'Guest',
      birth_date: reading.personalDetails?.birthDate || null,
      language,
      question_category: reading.questionCategory,
      selected_modes: reading.selectedModes,
      detected_symbols: detected,
      summary: language === 'ar' ? 'تظهر إشارات تدريجية تدعم التأمل واتخاذ خطوات مدروسة.' : 'The cup suggests gradual momentum and reflective decision-making.',
      arabic_style_reading: language === 'ar' ? 'وجود خطوط صاعدة مع مركز واضح يدل على نضوج فكرة مهمة.' : 'Rising lines with a central mark suggest a mature idea taking shape.',
      oriental_style_reading: language === 'ar' ? 'تشير المسارات المتفرعة إلى خيارات متعددة تحتاج أولوية واضحة.' : 'Branching trails indicate multiple paths requiring clear prioritization.',
      tarot_overlay: language === 'ar' ? 'رمزية مشابهة لبطاقة الاعتدال: التوازن قبل القفز.' : 'Symbolically similar to Temperance: balance before a leap.',
      horoscope_overlay: language === 'ar' ? 'الطاقة العامة تميل إلى الصبر العملي والتخطيط المرحلي.' : 'General energy favors practical patience and phased planning.',
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
