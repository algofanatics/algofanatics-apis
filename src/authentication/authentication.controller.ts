import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { User } from '../schema/user.schema';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '../common/base/response.dto';
import { AuthToken } from '../utils/interface';
import { UserResponseDto } from '../user/dto/user-respose.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthenticationController {
    constructor(private authService: AuthenticationService) { }

    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<UserResponseDto & AuthToken>> {
        return await this.authService.signUp(createUserDto);
    }

    @Post('signin')
    async signin(@Body() data: AuthDto): Promise<ResponseDto<UserResponseDto & AuthToken>> {
        return await this.authService.signIn(data);
    }

    @ApiBearerAuth()
    @ApiResponse({})
    @UseGuards(AccessTokenGuard)
    @Get('logout')
    async logout(@GetUser() user: User) {
       return await this.authService.logout(user.id);
    }

    @ApiBearerAuth()
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@GetUser() user: User) {
        const userId = user.id;
        const refreshToken = user.refreshToken;
        return this.authService.refreshTokens(userId, refreshToken);
    }

}
