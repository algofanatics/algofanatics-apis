import {
  BadRequestException,
  ForbiddenException,
  Logger,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ResponseDto } from '../common/base/response.dto';
import { User } from '../schema/user.schema';
import { AuthToken } from '../utils/interface';
import { UserResponseDto } from '../user/dto/user-respose.dto';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<ResponseDto<UserResponseDto & AuthToken>> {
    // Convert email and username to lowercase
    const useremail = createUserDto.email.toLowerCase();
    const username = createUserDto.userName.toLowerCase();
    // Check if user exists
    const userExists = await this.usersService.findByEmail(useremail);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const userExistsByUsername = await this.usersService.findByUsername(
      username,
    );
    if (userExistsByUsername) {
      throw new BadRequestException('Username already exists');
    }
    // Check if passwords match
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    console.log(newUser, 'newUser');
    const { fullName, userName, email } = newUser;
    const tokens = await this.getTokens(newUser._id, newUser.email);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    const responseData = { fullName, userName, email, ...tokens };
    return new ResponseDto<UserResponseDto & AuthToken>(
      'sign up successful',
      responseData,
      200,
    );
  }

  async signIn(
    data: AuthDto,
  ): Promise<ResponseDto<UserResponseDto & AuthToken>> {
    const { password } = data;
    const emailOrUsername = data.emailOrUsername.toLowerCase();
    // Check if user exists
    const user = await this.usersService.findByEmailOrUsername(emailOrUsername);
    this.logger.log(user, 'USER');
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await this.verifyData(password, user.password);
    console.log(passwordMatches, 'PPPPP');
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    const { fullName, userName, email } = user;
    const responseData = { fullName, userName, email, ...tokens };
    return new ResponseDto<UserResponseDto & AuthToken>(
      'logged in successfully',
      responseData,
      200,
    );
  }

  async logout(userId: string) {
    const endSession = await this.usersService.update(userId, {
      refreshToken: null,
    });
    return new ResponseDto('Logged out successfully', {}, 200);
  }

  async hashData(data: string): Promise<string> {
    const saltRounds = 10;
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;
  }

  async verifyData(plainData: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(plainData, hashedData);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('jwt_access_secret'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await this.verifyData(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
