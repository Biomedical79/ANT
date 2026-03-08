import { readingService } from '../services/reading-service.js';
import { readingRepository } from '../repositories/reading-repository.js';
import { billingService } from '../services/billing-service.js';

export const readingController = {
  wizard: (req, res) => res.render('readings/new', { title: 'New Reading' }),
  async create(req, res, next) {
    try {
      const draft = await readingService.createDraft({ ...req.validated, userId: req.session.user?.id || null });
      await billingService.createMockPayment({ userId: req.session.user?.id, readingId: draft.id, amountCents: 1900 });
      res.redirect(`/readings/${draft.id}/processing`);
    } catch (err) {
      next(err);
    }
  },
  processing: async (req, res) => res.render('readings/processing', { title: 'Processing', readingId: req.params.id }),
  async poll(req, res, next) {
    try {
      let reading = await readingRepository.findById(req.params.id);
      if (reading.status !== 'COMPLETED') reading = await readingService.process(req.params.id);
      res.json({ status: reading.status });
    } catch (err) {
      next(err);
    }
  },
  async result(req, res, next) {
    try {
      const reading = await readingRepository.findById(req.params.id);
      res.render('readings/result', { title: 'Your Reading', reading });
    } catch (err) {
      next(err);
    }
  }
};
