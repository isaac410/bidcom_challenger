import { Request } from 'express';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import {
  Req,
  Put,
  Get,
  Body,
  Post,
  Param,
  Query,
  Redirect,
  Controller,
  HttpStatus,
} from '@nestjs/common';

import { LinkTrackerDto } from '../../application/dtos/link-tracker.dto';
import { HealthStatusDto } from '../../application/dtos/health-status.dto';
import { CreateLinkTrackerDto } from '../../application/dtos/create-link-tracker.dto';

import AbstractAppService from '../../application/services/abstract-app.service';

@ApiTags('app')
@Controller('api')
export class AppController {
  constructor(private readonly service: AbstractAppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get app health' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Returns an object with key information about the state of the system, including a message, the time the response was generated and the uptime of the application process.',
    type: HealthStatusDto,
    example: { uptime: 12.462258044, message: 'OK', timestamp: 1728053298271 },
  })
  getHealth(): HealthStatusDto {
    return this.service.getHealth();
  }

  @Get('link-tracker/list')
  @ApiOperation({ summary: 'Get link tracker list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Returns an array of object with key information about the link trackers list.',
    type: LinkTrackerDto,
    isArray: true,
  })
  list(): Promise<LinkTrackerDto[]> {
    return this.service.findAll();
  }

  @Redirect()
  @ApiExcludeEndpoint()
  @Get('l/:link')
  async redirect(
    @Req() request: Request,
    @Param('link') link: string,
    @Query('password') password: string,
  ): Promise<{ url: string }> {
    return this.service.redirect(request, link, password);
  }

  @ApiOperation({ summary: 'Invalid link tracker by link' })
  @Put('l/:link')
  async invalidLink(
    @Req() request: Request,
    @Param('link') link: string,
  ): Promise<LinkTrackerDto> {
    return this.service.invalidLinkTrackerByLink(request, link);
  }

  @ApiOperation({ summary: 'Get stats of visit of some link tracker' })
  @Get('l/:link/stats')
  async stats(
    @Req() request: Request,
    @Param('link') link: string,
  ): Promise<{ visited: number }> {
    return this.service.getStatsByLink(request, link);
  }

  @Post('create-link-tracker')
  @ApiOperation({ summary: 'Create a new link tracker' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Creates a new link tracker based on the provided data. This method takes Body containing the details of the link tracker to be created and returns a Object representing the created link tracker.',
    type: LinkTrackerDto,
    example: {
      id: '6703ea1a8f2203e844ae9c80',
      visited: 0,
      valid: true,
      expiration: '2024-12-31',
      target: 'https://google.com',
      password: 'mysecurypassword',
      link: 'http://localhost:4000/l/absju',
    },
  })
  async create(
    @Req() request: Request,
    @Body() createLinkTrackerDto: CreateLinkTrackerDto,
  ): Promise<LinkTrackerDto> {
    return this.service.createLinkTracker(request, createLinkTrackerDto);
  }
}
