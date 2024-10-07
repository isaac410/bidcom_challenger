import helmet from 'helmet';
//import * as csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './infraestructure/modules/app.module';
import { swaggerConfig } from './infraestructure/settings/swagger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  //app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.use(compression());
  app.use(cookieParser());

  swaggerConfig(app);
  await app.listen(4000).then(() => {
    console.log(`Server running on port ${4000}`);
  });
}
bootstrap();
