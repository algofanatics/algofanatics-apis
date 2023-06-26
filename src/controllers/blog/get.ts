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
    const { blogId, author } = req.query;

    if (blogId) {
      const blog = await blogService.getBlogById(blogId as string);
      // middleware already handles invalid and non-existent blogId

      return apiResponse(
        res,
        ResponseType.SUCCESS,
        StatusCode.OK,
        ResponseCode.SUCCESS,
        blog as object,
        'Blog fetched successfully'
      );
    }

    if (author) {
      const blogs = await blogService.getBlogsByAuthor(author as string);

      if (!blogs.length || !blogs) {
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
        blogs,
        'Blogs fetched successfully'
      );
    }

    const blogs = await blogService.getAllBlogs();

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
