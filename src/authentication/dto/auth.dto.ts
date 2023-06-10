import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsEmailOrString } from '../../decorators/is-email-or-string.decorator';

export class AuthDto {
  @ApiProperty({ description: 'The email or username of the user' })
  @IsNotEmpty()
  @IsEmailOrString({ message: 'Invalid email or username' })
  emailOrUsername: string;

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
