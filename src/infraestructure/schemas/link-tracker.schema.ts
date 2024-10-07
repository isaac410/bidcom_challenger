import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ILinkTracker } from 'src/domain/interfaces/link-tracker.interface';

@Schema({ collection: 'link_tracker', timestamps: true })
export class LinkTracker implements ILinkTracker {
  _id: Types.ObjectId;

  @Prop()
  link: string;

  @Prop()
  target: string;

  @Prop()
  valid: boolean;

  @Prop()
  password: string;

  @Prop({ default: 0 })
  visited: number;

  @Prop()
  expiration: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type LinkTrackerDocument = HydratedDocument<LinkTracker>;
export const LinkTrackerSchema = SchemaFactory.createForClass(LinkTracker);
