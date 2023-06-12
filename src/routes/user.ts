import express from 'express';
import { Uploader } from '../middleware';
import { UserController } from '../controllers';

const router = express.Router();

const { upload, resetPassword } = UserController;

router.post('/reset', resetPassword);
router.post('/upload', Uploader.single('image'), upload);

export default router;
