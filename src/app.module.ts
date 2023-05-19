import { Module,Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config'


@Module({
  imports: [
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
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
