import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const applicationContext: Promise<{  }> =
  NestFactory.createApplicationContext(AppModule).then((app) => {
    return {
      // catsService: app.select(CatsModule).get(CatsService, { strict: true }),
    };
  });

export default applicationContext;
