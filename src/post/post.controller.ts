import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/schema/user.schema';
import { ResponseDto } from 'src/common/base/response.dto';
import { PostDocument } from 'src/schema/post.schema';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('post')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth() // Apply the Bearer Authentication decorator
  @ApiUnauthorizedResponse({ description: 'Unauthorized' }) // Apply the Unauthorized Response decorator
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() request,
  ): Promise<ResponseDto<PostDocument>> {
    const { _id: userId } = request.user;
    createPostDto.user = userId;
    try {
      const post = await this.postService.createPost(createPostDto);
      return new ResponseDto<PostDocument>(
        'new post successfully created',
        post,
        200,
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  // async getPostById(id: string): Promise<ResponseDto<PostDocument>> {
  //   return this.postModel
  //     .findById(id)
  //     .populate('user')
  //     .populate('disLikes')
  //     .populate('likes')
  //     .exec();
  // }
}
