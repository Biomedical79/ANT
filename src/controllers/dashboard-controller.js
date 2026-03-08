import { userRepository } from '../repositories/user-repository.js';

export const dashboardController = {
  async index(req, res) {
    const summary = await userRepository.getDashboardSummary(req.session.user.id);
    res.render('dashboard/index', { title: 'Dashboard', summary });
  },
  settings: (req, res) => res.render('dashboard/settings', { title: 'Profile Settings' })
};
