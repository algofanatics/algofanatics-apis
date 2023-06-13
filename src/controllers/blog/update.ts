import { Request, Response } from 'express';
import {
  ResponseCode,
  ResponseType,
  StatusCode,
  BlogUpdateType,
} from '../../@types';
import { Toolbox } from '../../utils';
import { blogService } from '../../service';

const { apiResponse } = Toolbox;

async function update(req: Request, res: Response) {
  try {
    const appUser = req.user as any;

    const { title, content, tags } = req.body;
    const { blogId } = req.params;

    const author = appUser._id;

    const blog = await blogService.getBlogById(blogId);

    if (!blog) {
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.FAILURE,
        {},
        'Blog not found. Please try again.'
      );
    }

    if (author !== blog.author) {
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.FAILURE,
        {},
        'You are not authorized to perform this action.'
      );
    }

    let newTags = [];
    let oldTags = blog.tags

    if (tags.length) {
      newTags = tags.filter((tag: string) => !oldTags.includes(tag));
    };

    console.log(newTags)

    await blogService.updateBlog(blogId, {
      title: title || blog.title,
      content: content || blog.content,
      tags: newTags,
    } as BlogUpdateType)

    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      {},
      'Blog post updated successfully'
    );
  } catch (error) {
    return apiResponse(
      res,
      ResponseType.FAILURE,
      StatusCode.INTERNAL_SERVER_ERROR,
      ResponseCode.FAILURE,
      {},
      `looks like something went wrong: ${JSON.stringify(error)} `
    );
  }
}

export default update;
