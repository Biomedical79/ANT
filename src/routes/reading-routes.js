import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { readingController } from '../controllers/reading-controller.js';
import { validate } from '../middleware/validate.js';
import { readingDraftSchema } from '../validators/reading-validator.js';

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) return cb(new Error('Invalid file type'));
    cb(null, true);
  }
});

const router = Router();

router.get('/new', readingController.wizard);
router.post('/', upload.array('images', 4), readingController.create);
router.post('/draft', validate(readingDraftSchema), readingController.create);
router.get('/:id/processing', readingController.processing);
router.get('/:id/result', readingController.result);
router.get('/:id/poll', readingController.poll);

export default router;
