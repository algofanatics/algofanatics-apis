import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'user full name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'user email address' })
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({ description: 'user password' })
    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    @IsStrongPassword()
    password: string;

    @Exclude()
    refreshToken: string;
}
