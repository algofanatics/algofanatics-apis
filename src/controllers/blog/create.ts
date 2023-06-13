import { Request, Response } from 'express';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';
import { blogService } from '../../service';
import { BlogInterface } from '../../@types/blog';

const { apiResponse } = Toolbox;

async function create(req: Request, res: Response) {
  try {
    const appUser = req.user as any;

    const { title, content, tags } = req.body;

    const author = appUser._id;

    await blogService.createBlog({
      title,
      content,
      author,
      tags,
    } as BlogInterface);

    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      {},
      'Blog post created successfully'
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

export default create;
