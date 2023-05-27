// ========== Main
// import all modules
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import fastifyCsrf from '@fastify/csrf-protection';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const port: number = app.get(ConfigService).get<number>('SERVICE_PORT');
  const appUrl: string = app.get(ConfigService).get<string>('SERVICE_APP_URL');
  const webClients: string[] = app
    .get(ConfigService)
    .get<string>('SERVICE_WEB_CLIENTS')
    .split(',');

  // Setup compression
  await app.register(compression);

  // Setup Helmet
  await app.register(helmet);

  // Setup Csrf
  await app.register(fastifyCsrf);

  // Setup Cors
  app.enableCors({
    origin: webClients,
  });

  // Setup API Base Url
  app.setGlobalPrefix('/api');

  // Setup Swagger UI
  const config = new DocumentBuilder()
    .setTitle('Personal Website API Docs')
    .setDescription('This is an RESTful API Documentation for Personal Website')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  Logger.log(`The RESTful API is being run at ${appUrl}`);
}
bootstrap();
