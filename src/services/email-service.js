export const emailService = {
  async send({ to, subject, html }) {
    console.log('[EMAIL]', { to, subject, html });
    return { delivered: true };
  }
};
