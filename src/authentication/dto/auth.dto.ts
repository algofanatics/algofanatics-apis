import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {
    @ApiProperty({ description: 'The email of the user' })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User password' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}