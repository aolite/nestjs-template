import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Seeder } from './seeder';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import MongoMemoryServer from 'mongodb-memory-server-core';
import {Logger} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  // Run with in-memory Mongo
  if (process.env.INMEMORY_MONGODB=== 'true') {
    Logger.log(`In Memory MongoDB configuration`)
    const mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri();

  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.enableCors({
    'origin': configService.get('ORIGIN', '*').split(','),
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204
  });
  const seeder = app.get(Seeder);
  await seeder.seed();

  const config = new DocumentBuilder()
    .setTitle('Hello World example')
    .setDescription('The Hello World API description')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT', 3000));

  Logger.log(`Successful server init at port:`+ configService.get('PORT', 3000))
}
bootstrap();
