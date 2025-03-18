import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The Crew Center API')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const documentFactory = (): any => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 491);
}
void bootstrap();
