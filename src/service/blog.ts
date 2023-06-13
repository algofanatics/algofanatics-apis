import Blog from '../models/Blog';
import { StatusCode, BlogInterface, BlogUpdateType } from '../@types';
import { ApiError } from '../utils';

class BlogService {
  async createBlog(BlogData: BlogInterface) {
    try {
      const blog = new Blog(BlogData);
      await blog.save();
      return Blog;
    } catch (error) {
      throw new ApiError(
        'algofanatics api',
        error as string,
        'createBlog',
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBlogById(BlogId: string) {
    try {
      const blog = await Blog.findById({
        $or: [{ _id: BlogId }, { author: BlogId }],
      });
      return blog;
    } catch (error) {
      throw new ApiError(
        'algofanatics api',
        error as string,
        'getBlogById',
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateBlog(BlogId: string, BlogData: BlogUpdateType) {
    try {
      const blog = await Blog.findByIdAndUpdate(BlogId, BlogData, {
        new: true,
      });
      return blog;
    } catch (error) {
      throw new ApiError(
        'algofanatics api',
        error as string,
        'updateBlog',
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  deleteBlog = async (BlogId: string) => {
    try {
      const blog = await Blog.findByIdAndDelete(BlogId);
      return blog;
    } catch (error) {
      throw new ApiError(
        'algofanatics api',
        error as string,
        'deleteBlog',
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  };

  getBlogByTag = async (tag: string) => {
    try {
      const blog = await Blog.find({ tags: tag });
      return blog;
    } catch (error) {
      throw new ApiError(
        'algofanatics api',
        error as string,
        'getBlogByTag',
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  };

  getAllBlogs = async () => {
    try {
      const blogs = await Blog.find();
      return blogs;
    } catch (error) {
      throw new ApiError(
        'algofanatics api',
        error as string,
        'getAllBlogs',
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  };
}

export default new BlogService();
