import { Request, Response } from 'express';
import {
  ResponseCode,
  ResponseType,
  StatusCode,
} from '../../@types';
import { Toolbox } from '../../utils';
import { blogService } from '../../service';

const { apiResponse } = Toolbox;

async function remove(req: Request, res: Response) {
  try {

    const { blogId } = req.params;

    await blogService.deleteBlog(blogId);

    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      {},
      'Blog post deleted successfully'
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

export default remove;
