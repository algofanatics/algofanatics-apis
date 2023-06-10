import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Example Post',
    required: true,
  })
  title: string;

  @ApiProperty({ description: 'Post category', example: 'All', required: true })
  category: string;

  @ApiProperty({
    description: 'Post description',
    example: 'Lorem ipsum dolor sit amet',
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'URL of the post image',
    example: 'https://example.com/image.jpg',
  })
  image: string;

  @ApiProperty({ description: 'User ID', required: true })
  @IsNotEmpty({ message: 'User ID is required' })
  user: string;
}
