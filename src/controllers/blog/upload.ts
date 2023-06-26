import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { ResponseCode, ResponseType, StatusCode, BlogInterface, BlogUpdateType } from '../../@types';
import { Toolbox } from '../../utils';
import { blogService } from '../../service';

const { apiResponse } = Toolbox;

async function upload(req: Request, res: Response) {
  try {
    const { blogId, author, mediaName } = req.body;

    const blog = await blogService.getBlogById(blogId as string);
    // middleware already handles invalid and non-existent blogId

    const media = req.file?.path ? req.file?.path : '';

    if (!media)
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.FAILURE,
        {},
        'media upload failed. Please try again.'
      );

    const updatedBlog = await blogService.updateBlog(blogId, {
      title: blog!.title,
      content: blog!.content,
      tags: blog!.tags,
      media: {
        ...blog!.media,
        [mediaName]: media,
      },
    } as BlogUpdateType);

    if (!updatedBlog)
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.FAILURE,
        {},
        'Blog not found. Please try again.'
      );

    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      updatedBlog as object,
      'Blog updated successfully.'
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

export default upload;
