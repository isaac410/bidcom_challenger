import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ILinkTracker } from 'src/domain/interfaces/link-tracker.interface';

export class LinkTrackerDto implements ILinkTracker {
  @Expose({ name: '_id' })
  @Transform((params) => params.obj._id)
  @ApiProperty()
  id: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  target: string;

  @ApiProperty()
  valid: boolean;

  @ApiProperty()
  visited: number;

  @ApiProperty()
  password: string;

  @ApiProperty()
  expiration: string;
}
