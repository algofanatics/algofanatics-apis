import express from 'express';
import { BlogController } from '../controllers';

const router = express.Router();

const { create, update, remove, get } = BlogController;

router.post('/', create);
router.put('/:blogId', update);
router.delete('/:blogId', remove);
router.get('/', get);

export default router;
