import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/schema/user.schema';
import { ResponseDto } from 'src/common/base/response.dto';
import { PostDocument } from 'src/schema/post.schema';
import { ObjectId } from 'mongoose';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
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

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async fetchPost(@Param('id') id: ObjectId) {
    try {
      const post = await this.postService.findById(id);

      // Update number of views
      post.numViews += 1;
      await post.save();

      return new ResponseDto<PostDocument>(
        'post successfully fetched',
        post,
        200,
      );
    } catch (error) {
      // Handle error appropriately
      throw new BadRequestException('Failed to fetch post');
    }
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: CreatePostDto,
  ) {
    try {
      const post = await this.postService.updatePost(id, updatePostDto);
      return new ResponseDto<PostDocument>(
        'post successfully updated',
        post,
        200,
      );
    } catch (error) {
      // Handle error appropriately
      throw new BadRequestException('Failed to update post');
    }
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async deletePost(@Param('id') id: string) {
    try {
      const post = await this.postService.deletePost(id);
      return new ResponseDto<null>('post successfully deleted', null, 200);
    } catch (error) {
      // Handle error appropriately
      throw new BadRequestException('Failed to delete post');
    }
  }
}
