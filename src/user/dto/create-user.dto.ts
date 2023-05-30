import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Min,
  MinLength,
  isNotEmpty,
} from 'class-validator';

enum UserRole {
  Admin = 'Admin',
  Guest = 'Guest',
  Blogger = 'Blogger',
}

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user', required: true })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', required: true })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    description: 'Profile photo URL of the user',
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  })
  profilePhoto: string;

  @ApiProperty({ description: 'Email of the user', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user', required: true })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  @ApiProperty({ description: 'Biography of the user' })
  @IsNotEmpty({ message: 'Biography is required' })
  bio: string;

  @ApiProperty({ description: 'Number of posts by the user', default: 0 })
  @Min(0, { message: 'Minimum count cannot be less than 0' })
  postCount: number;

  @ApiProperty({ description: 'Whether the user is blocked', default: false })
  isBlocked: boolean;

  @ApiProperty({ description: 'Whether the user is an admin', default: false })
  @IsBoolean()
  @Exclude()
  isAdmin = false;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    default: UserRole.Guest,
  })
  @IsEnum(UserRole, { message: 'Invalid role' })
  role = UserRole.Guest;

  @ApiProperty({ description: 'Whether the user is following', default: false })
  isFollowing: boolean;

  @ApiProperty({
    description: 'Whether the user is unfollowing',
    default: false,
  })
  isUnFollowing: boolean;

  @ApiProperty({
    description: 'Whether the user account is verified',
    default: false,
  })
  isAccountVerified: boolean;

  @ApiProperty({ description: 'Array of user IDs who viewed the profile' })
  viewedBy: string[];

  @ApiProperty({ description: 'Array of user IDs who are followers' })
  followers: string[];

  @ApiProperty({ description: 'Array of user IDs who are being followed' })
  following: string[];

  @ApiProperty({ description: 'Timestamp of the password change' })
  passwordChangeAt: Date;

  @ApiProperty({ description: 'Token for password reset' })
  passwordResetToken: string;

  @ApiProperty({ description: 'Expiry date of the password reset token' })
  passwordResetExpires: Date;

  @ApiProperty({
    description: 'Whether the user account is active',
    default: false,
  })
  active: boolean;
}
