import { Request, Response, NextFunction } from 'express';
import { ResponseCode, ResponseType, StatusCode } from '../@types';
import { Toolbox } from '../utils';
import { blogService } from '../service';

const { apiResponse, validateMongooseId } = Toolbox;

const BlogMiddleware = {
  async inspectBlogId(req: Request, res: Response, next: NextFunction) {
    const appUser = req.user as any;
    try {
      let blogIdTruthy = true;
      if (req.body.blogId) {
        blogIdTruthy = validateMongooseId(req.body.blogId);

        if (!blogIdTruthy) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.BAD_REQUEST,
            ResponseCode.VALIDATION_ERROR,
            {},
            'invalid blog id'
          );
        }

        const blog = await blogService.getBlogById(req.body.blogId);

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

        if (appUser._id.toString() !== blog.author.toString()) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.UNAUTHORIZED,
            ResponseCode.FAILURE,
            {},
            'You are not the author of this blog.'
          );
        }
      } else if (req.params.blogId) {
        blogIdTruthy = validateMongooseId(req.params.blogId);

        if (!blogIdTruthy) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.BAD_REQUEST,
            ResponseCode.VALIDATION_ERROR,
            {},
            'invalid blog id'
          );
        }

        const blog = await blogService.getBlogById(req.params.blogId);

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

        if (appUser._id.toString() !== blog.author.toString()) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.UNAUTHORIZED,
            ResponseCode.FAILURE,
            {},
            'You are not the author of this blog.'
          );
        }
      } else if (req.query.blogId) {
        blogIdTruthy = validateMongooseId(req.query.blogId as string);

        if (!blogIdTruthy) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.BAD_REQUEST,
            ResponseCode.VALIDATION_ERROR,
            {},
            'invalid blog id'
          );
        }

        const blog = await blogService.getBlogById(req.query.blogId as string);

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

        if (appUser._id.toString() !== blog.author.toString()) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.UNAUTHORIZED,
            ResponseCode.FAILURE,
            {},
            'You are not the author of this blog.'
          );
        }
      }

      let authorIdTruthy = true;
      
      if (req.body.author) {
        authorIdTruthy = validateMongooseId(req.body.author);

        if (!authorIdTruthy) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.BAD_REQUEST,
            ResponseCode.VALIDATION_ERROR,
            {},
            'invalid author id'
          );
        }
          
        if (req.body.author !== appUser._id.toString()) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.BAD_REQUEST,
            ResponseCode.FAILURE,
            {},
            'You are not the author of this blog.'
          );
        }
      } else if (req.params.author) {
        authorIdTruthy = validateMongooseId(req.params.author);

        if (!authorIdTruthy) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.BAD_REQUEST,
            ResponseCode.VALIDATION_ERROR,
            {},
            'invalid author id'
          );
        }
          
        if (req.params.author !== appUser._id.toString()) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.BAD_REQUEST,
            ResponseCode.FAILURE,
            {},
            'You are not the author of this blog.'
          );
        }
      } else if (req.query.author) {
        authorIdTruthy = validateMongooseId(req.query.author as string);

        if (!authorIdTruthy) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.BAD_REQUEST,
            ResponseCode.VALIDATION_ERROR,
            {},
            'invalid author id'
          );
        }
        
        if (req.query.author !== appUser._id.toString()) {
          return apiResponse(
            res,
            ResponseType.FAILURE,
            StatusCode.BAD_REQUEST,
            ResponseCode.FAILURE,
            {},
            'You are not the author of this blog.'
          );
        }
      }

      next();
    } catch (error) {
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.VALIDATION_ERROR,
        {},
        error as string
      );
    }
  },
};

export default BlogMiddleware;
