import { ApiProperty } from '@nestjs/swagger';
import { IHealthStatus } from 'src/domain/interfaces/health.interface';

export class HealthStatusDto implements IHealthStatus {
  @ApiProperty()
  message: string;

  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  uptime: number;
}
