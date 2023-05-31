import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

const logger: Logger = new Logger('Main');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('ALGOFANATICS API')
    .setDescription(
      'The Algofanatics API provides access to blog posts and personal portfolios of developers, offering resources and guidance for young engineers to excel in their careers.',
    )
    .setVersion('1.0')
    .addBearerAuth() // Enable JWT authentication
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  await app.listen(port, () => {
    logger.log('---------------------------------');
    logger.log(`🚀 App is listening on ${port} 🚀`);
    logger.log('---------------------------------');
  });
}
bootstrap();
