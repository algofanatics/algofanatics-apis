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

  async getBlogById(blogId: string) {
    try {
      const blog = await Blog.findById({
        _id: blogId,
      });
      return blog;
    } catch (error) {
      console.log(error);
      throw new ApiError(
        'algofanatics api',
        error as string,
        'getBlogById',
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBlogsByAuthor(author: string, page = 1, limit = 50) {
    try {
      const blog = await Blog.find({
        author,
      }).skip((page - 1) * limit).limit(limit);
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

  getAllBlogs = async (page = 1, limit = 50) => {
    try {
      const blogs = await Blog.find()
        .skip((page - 1) * limit)
        .limit(limit);;
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
