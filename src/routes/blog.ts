import express from 'express';
import { BlogController } from '../controllers';
import { Uploader, BlogMiddleware } from '../middleware';

const router = express.Router();

const { create, update, remove, get, upload } = BlogController;
const { inspectBlogId } = BlogMiddleware;

router.post('/', create);
router.put('/:blogId', inspectBlogId, update);
router.delete('/:blogId', inspectBlogId, remove);
router.get('/', inspectBlogId, get);
router.post('/upload', inspectBlogId, Uploader.single('media'), upload);


export default router;
