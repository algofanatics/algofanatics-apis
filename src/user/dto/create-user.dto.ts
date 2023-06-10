import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Min,
  MinLength,
  Validate,
  isNotEmpty,
} from 'class-validator';

enum UserRole {
  Admin = 'Admin',
  Guest = 'Guest',
  Blogger = 'Blogger',
}

export class CreateUserDto {
  @ApiProperty({ description: 'Fulname is required', required: true })
  @IsNotEmpty({ message: 'Fullname is required' })
  fullName: string;

  @ApiProperty({ description: 'Username is required', required: true })
  @IsNotEmpty({ message: 'Username is required' })
  userName: string;

  @ApiProperty({ description: 'Email of the user', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user', required: true })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Confirm password', required: true })
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Equals('password', { message: 'Password does not match' })
  confirmPassword: string;

  @ApiHideProperty()
  @IsBoolean()
  @Exclude()
  isAdmin = false;
}
