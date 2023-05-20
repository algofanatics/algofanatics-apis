import { Module,Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from './authentication/authentication.module';
import config from './config'
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './authentication/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './authentication/strategies/refreshToken.strategy';
import { DevtoolsModule } from '@nestjs/devtools-integration';


@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load:[config]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('uri'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({}),
    AuthenticationModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [],
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
  exports: [JwtModule, AccessTokenStrategy, RefreshTokenStrategy, PassportModule]
})
export class AppModule {}
