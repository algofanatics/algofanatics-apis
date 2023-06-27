import { Request, Response } from 'express';
import { ResponseCode, ResponseType, StatusCode, BlogUpdateType } from '../../@types';
import { Toolbox } from '../../utils';
import { blogService } from '../../service';
import mongoose from 'mongoose';

const { apiResponse } = Toolbox;

async function update(req: Request, res: Response) {
  try {
    const { title, content, tags } = req.body;
    const { blogId } = req.params;

    const blog = await blogService.getBlogById(blogId);
    // middleware already handles invalid and non-existent blogId

    await blogService.updateBlog(blogId, {
      title: title || blog!.title,
      content: content || blog!.content,
      tags: tags.length ? tags : blog!.tags,
    } as BlogUpdateType);

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
