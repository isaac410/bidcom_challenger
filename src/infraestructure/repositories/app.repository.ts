import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  LinkTracker,
  LinkTrackerDocument,
} from '../schemas/link-tracker.schema';
import { CreateLinkTrackerDto } from 'src/application/dtos/create-link-tracker.dto';
import AbstractAppRepository from 'src/domain/repositories/abstract-app.repository';

export default class AppRepository implements AbstractAppRepository {
  constructor(
    @InjectModel(LinkTracker.name)
    private model: Model<LinkTrackerDocument>,
  ) {}

  async create(dto: CreateLinkTrackerDto): Promise<LinkTracker> {
    const document = await this.model.create(dto);
    return document.toJSON();
  }

  async findOneByKey(key: keyof LinkTracker, value): Promise<LinkTracker> {
    const newKey: FilterQuery<Model<LinkTrackerDocument>> = { [key]: value };
    return this.model.findOne(newKey).lean().exec();
  }

  async updateOneById(
    id: string,
    dto: CreateLinkTrackerDto,
  ): Promise<LinkTracker> {
    return this.model.findByIdAndUpdate(id, dto, { new: true }).lean().exec();
  }

  async findAll(): Promise<LinkTracker[]> {
    const documents = await this.model.find().lean();
    return documents;
  }
}
