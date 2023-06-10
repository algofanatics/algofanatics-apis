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
}

// async createPost(
//   createPostDto: CreatePostDto,
//   // userId: string,
// ): Promise<PostDocument> {
//   // Retrieve the user from the user table
//   // const user = await this.userModel.findById(userId).exec();

//   // if (!user) {
//   //   throw new NotFoundException('User not found and post cannot be created');
//   // }

//   const createdPost = new this.postModel({
//     ...createPostDto,
//     // user: user._id,
//   });
//   return createdPost.save();
// }
// }
