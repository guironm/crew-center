import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodFilter } from './shared/filters';
import { Logger } from '@nestjs/common';
import { config } from './config/env';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Register global filters
  app.useGlobalFilters(new ZodFilter());
  logger.log('Registered global ZodExceptionFilter');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The Crew Center API')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const documentFactory = (): any =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(config.API_BASE_PORT, config.HOST);
  logger.log(
    `Application is running on: http://${config.HOST}:${config.API_BASE_PORT}`,
  );
  logger.log(
    `Swagger documentation is available at: http://${config.HOST}:${config.API_BASE_PORT}/api`,
  );
}
void bootstrap();
