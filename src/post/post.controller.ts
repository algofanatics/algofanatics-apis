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

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth() // Apply the Bearer Authentication decorator
  @ApiOkResponse({ description: 'Post successfully created' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Post successfully fetched' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async fetchPost(@Param('id') id: string) {
    try {
      const post = await this.postService.findById(id);
      return new ResponseDto<PostDocument>(
        'post successfully fetched',
        post,
        200,
      );
    } catch (error) {
      // Handle error appropriately
      throw new Error('Failed to fetch post');
    }
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Post successfully updated' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
  @ApiOkResponse({ description: 'Post successfully deleted' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deletePost(@Param('id') id: string) {
    try {
      const post = await this.postService.deletePost(id);
      return new ResponseDto<null>('post successfully deleted', null, 200);
    } catch (error) {
      // Handle error appropriately
      throw new Error('Failed to delete post');
    }
  }
}
