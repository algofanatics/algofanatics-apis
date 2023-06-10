import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  refreshToken?: string;
}
