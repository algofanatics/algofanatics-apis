import express from 'express';
import { Uploader } from '../middleware';
import { UserController } from '../controllers';

const router = express.Router();

const {
  upload,
  resetPin,
} = UserController;

router.post('/reset', resetPin);
router.post('/upload', Uploader.single('image'), upload);

export default router;
