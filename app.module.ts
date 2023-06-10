import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from './src/authentication/authentication.module';
import config from './config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './src/authentication/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './src/authentication/strategies/refreshToken.strategy';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger(AppModule.name);
        logger.log('Connecting to MongoDB Database Successsful...');
        return {
          uri: configService.get<string>('uri'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_access_secret'),
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [],
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
  exports: [
    JwtModule,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    PassportModule,
  ],
})
export class AppModule {}
