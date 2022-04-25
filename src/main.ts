import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Seeder } from './seeder';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import MongoMemoryServer from 'mongodb-memory-server-core';
import {Logger} from "@nestjs/common";

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
  await app.listen(configService.get('PORT', 3000));
}
bootstrap();
