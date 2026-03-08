import { readingRepository } from '../repositories/reading-repository.js';
import { aiReadingService } from './ai-reading-service.js';

export const readingService = {
  async createDraft({ userId, guestEmail, language, questionCategory, selectedModes, tone, analysisDepth = 'medium', personalDetails }) {
    return readingRepository.create({
      userId,
      guestEmail,
      language,
      questionCategory,
      selectedModes,
      tone,
      personalDetails: { ...personalDetails, analysisDepth },
      status: 'QUEUED'
    });
  },
  async process(readingId) {
    const reading = await readingRepository.findById(readingId);
    await readingRepository.updateStatus(readingId, 'ANALYZING');
    const payload = await aiReadingService.generate({ reading, language: reading.language });
    await readingRepository.updateStatus(readingId, 'GENERATING');
    await readingRepository.saveResult(readingId, payload);
    await readingRepository.updateStatus(readingId, 'COMPLETED');
    return readingRepository.findById(readingId);
  }
};
