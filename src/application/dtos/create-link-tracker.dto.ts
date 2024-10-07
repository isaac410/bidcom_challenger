import { Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CreateLinkTrackerDto {
  @Expose({ name: '_id' })
  @Transform((params) => params.obj._id)
  id?: string;

  @ApiProperty({ example: 'https://google.com' })
  target: string;

  @ApiProperty({ default: true })
  valid: boolean;

  @ApiProperty({ example: 'mysecurypassword' })
  password: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'The date must be in YYYYY-MM-DD format.',
  })
  @ApiProperty({ example: '2024-10-04' })
  expiration: string;

  link: string;
}
