import express from 'express';
import { BlogController } from '../controllers';

const router = express.Router();

const { create, update, remove } = BlogController;

router.post('/create', create);
router.put('/update/:blogId', update);
router.delete('/remove/:blogId', remove);

export default router;
