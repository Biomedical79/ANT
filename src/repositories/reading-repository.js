import { prisma } from '../config/prisma.js';

export const readingRepository = {
  create(data) {
    return prisma.reading.create({ data });
  },
  findById(id) {
    return prisma.reading.findUnique({
      where: { id },
      include: { images: true, result: { include: { sections: { orderBy: { sortOrder: 'asc' } } } } }
    });
  },
  addImages(readingId, images) {
    return prisma.readingImage.createMany({ data: images.map((img, i) => ({ ...img, readingId, sortOrder: i })) });
  },
  updateStatus(id, status) {
    return prisma.reading.update({ where: { id }, data: { status } });
  },
  saveResult(readingId, payload) {
    return prisma.readingResult.create({
      data: {
        readingId,
        summary: payload.summary,
        payload,
        sections: {
          create: [
            { key: 'summary', title: 'Summary', content: payload.summary, sortOrder: 1 },
            { key: 'arabic_style_reading', title: 'Arabic Style', content: payload.arabic_style_reading, sortOrder: 2 },
            { key: 'oriental_style_reading', title: 'Oriental Style', content: payload.oriental_style_reading, sortOrder: 3 },
            { key: 'final_message', title: 'Final Message', content: payload.final_message, sortOrder: 10 }
          ]
        }
      }
    });
  }
};
