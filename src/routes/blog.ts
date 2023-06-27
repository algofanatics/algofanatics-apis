import express from 'express';
import { BlogController } from '../controllers';
import { Uploader, BlogMiddleware } from '../middleware';

const router = express.Router();

const { create, update, remove, get, upload } = BlogController;
const { inspectBlogId, inspectUploadBlogMedia, inspectBlogQuery } = BlogMiddleware;

router.post('/', create);
router.put('/:blogId', inspectBlogId, update);
router.delete('/:blogId', inspectBlogId, remove);
router.get('/', inspectBlogId, inspectBlogQuery, get);
router.post('/upload', inspectBlogId, Uploader.single('media'), inspectUploadBlogMedia, upload);

export default router;
