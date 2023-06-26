import { Request, Response } from 'express';
import {
  ResponseCode,
  ResponseType,
  StatusCode,
} from '../../@types';
import { Toolbox } from '../../utils';
import { blogService } from '../../service';

const { apiResponse } = Toolbox;

async function get(req: Request, res: Response) {
  try {
    const { blogId, tag, page, limit } = req.query;

    if (blogId) {
      const blog = await blogService.getBlogById(blogId as string);

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

      return apiResponse(
        res,
        ResponseType.SUCCESS,
        StatusCode.OK,
        ResponseCode.SUCCESS,
        blog,
        'Blog fetched successfully'
      );
    }

    let blogs = await blogService.getAllBlogs(Number(page), Number(limit));

    if (!blogs || !blogs.length) {
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.FAILURE,
        {},
        'Blog not found. Please try again.'
      );
    }

    if (tag) blogs = blogs.filter((blog) => blog.tags.includes(tag as string));

    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      blogs,
      'Blogs fetched successfully'
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

export default get;
