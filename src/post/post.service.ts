import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from 'src/schema/post.schema';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostDocument> {
    const createdPost = new this.postModel({
      ...createPostDto,
    });
    return createdPost.save();
  }

  async findById(id: string): Promise<PostDocument> {
    return this.postModel
      .findById(id)
      .populate('user')
      .populate('disLikes')
      .populate('likes')
      .exec();
  }

  async updatePost(
    id: string,
    updatePostDto: CreatePostDto,
  ): Promise<PostDocument> {
    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  async deletePost(id: string): Promise<Post> {
    return this.postModel.findByIdAndDelete(id).exec();
  }
}
