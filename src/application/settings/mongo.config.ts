import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongoConfig implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: `mongodb://${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_NAME}`,
      user: process.env.MONGO_DB_USERNAME,
      pass: process.env.MONGO_DB_PASSWORD,
      authSource: process.env.AUTHSOURCE_DB_PASSWORD,
      autoCreate: true,
    };
  }
}
