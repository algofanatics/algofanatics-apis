import Joi from 'joi';
import joiDate from '@joi/date';
import { BlogUpdateType, BlogMediaUploadType, BlogQueryType } from '../@types';

const joi = Joi.extend(joiDate);

const blog = {
  async validateUpdateBlog(payload: BlogUpdateType) {
    const schema = joi.object({
      title: joi.string().optional().allow('', null).label('invalid title'),
      content: joi.string().optional().allow('', null).label('invalid content'),
      tags: joi.string().optional().allow('', null).label('invalid tags'),
    });
    const { error } = schema.validate(payload);
    if (error) throw error.details[0].context.label;
    return true;
  },
  async validateUploadBlogMedia(payload: BlogMediaUploadType) {
    const schema = joi.object({
      author: joi.string().required().allow('', null).label('invalid or missing author'),
      blogId: joi.string().required().allow('', null).label('invalid or missing blogId'),
      mediaName: joi.string().required().allow('', null).label('invalid or missing mediaName'),
    });
    const { error } = schema.validate(payload);
    if (error) throw error.details[0].context.label;
    return true;
  },
  async validateBlogQuery(payload: BlogQueryType) {
    const schema = joi.object({
      tag: joi.string().optional().allow('', null).label('invalid or missing tag'),
      page: joi
        .number()
        .min(1)
        .optional()
        .allow('', null)
        .label('invalid or missing page. Page number should be greater than 0'),
      limit: joi
        .number()
        .min(0)
        .optional()
        .allow('', null)
        .label('invalid or missing limit. Limit should be greater than 0'),
    });
    const { error } = schema.validate(payload);
    if (error) throw error.details[0].context.label;
    return true;
  },
};

export default blog;
