import { prisma } from '../config/prisma.js';
import { nanoid } from 'nanoid';

export const billingService = {
  async createMockPayment({ userId, readingId, amountCents, currency = 'USD' }) {
    const payment = await prisma.payment.create({
      data: {
        userId,
        readingId,
        amountCents,
        currency,
        status: 'SUCCEEDED',
        providerRef: `mock_${nanoid(10)}`
      }
    });

    if (userId) {
      await prisma.invoice.create({
        data: {
          userId,
          paymentId: payment.id,
          number: `INV-${Date.now()}`,
          lineItems: [{ item: 'Coffee Reading', quantity: 1, amountCents }],
          totalCents: amountCents
        }
      });
    }

    return payment;
  }
};
