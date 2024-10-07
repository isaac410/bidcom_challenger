import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import AppRepository from '../repositories/app.repository';
import AbstractAppRepository from 'src/domain/repositories/abstract-app.repository';

import AppService from 'src/application/services/app.service';
import AbstractAppService from 'src/application/services/abstract-app.service';

import { AppController } from '../controllers/app.controller';
import { MongoConfig } from 'src/application/settings/mongo.config';
import { ApiPrefixMiddleware } from '../middlewares/api-prefix.middleware';
import { LinkTracker, LinkTrackerSchema } from '../schemas/link-tracker.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfig,
    }),
    MongooseModule.forFeature([
      { name: LinkTracker.name, schema: LinkTrackerSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [
    { useClass: AppService, provide: AbstractAppService },
    { useClass: AppRepository, provide: AbstractAppRepository },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiPrefixMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
