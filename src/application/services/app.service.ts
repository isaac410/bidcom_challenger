import { Request } from 'express';
import {
  Logger,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { LinkTrackerDto } from '../dtos/link-tracker.dto';
import { CreateLinkTrackerDto } from '../dtos/create-link-tracker.dto';

import AbstractAppService from './abstract-app.service';
import { IHealthStatus } from '../../domain/interfaces/health.interface';
import AbstractAppRepository from '../../domain/repositories/abstract-app.repository';

@Injectable()
export default class AppService extends AbstractAppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly repository: AbstractAppRepository) {
    super();
  }

  getHealth(): IHealthStatus {
    return {
      message: 'OK',
      timestamp: Date.now(),
      uptime: process.uptime(),
    };
  }

  async createLinkTracker(
    request: Request,
    createLinkTracker: CreateLinkTrackerDto,
  ): Promise<LinkTrackerDto> {
    try {
      const host = this.getHost(request);
      const maskedLink = this.newMaskedLink();
      const fullUrl = `${host}/${maskedLink}`;

      createLinkTracker.link = fullUrl;

      const linkTracker = await this.repository.create(createLinkTracker);

      const linkTrackerTransformed = plainToInstance(
        LinkTrackerDto,
        linkTracker,
        {
          excludePrefixes: ['__'],
        },
      );

      return linkTrackerTransformed;
    } catch (error) {
      this.logger.error(
        `error on ${AppService.name} | method create link tracker`,
        error['message'],
      );
      throw error;
    }
  }

  async findAll(): Promise<LinkTrackerDto[]> {
    const linksTracker = await this.repository.findAll();
    const linksTrackerTransformed = plainToInstance(
      LinkTrackerDto,
      linksTracker,
      {
        excludePrefixes: ['__'],
      },
    );

    return linksTrackerTransformed;
  }

  async redirect(
    request: Request,
    link: string,
    password: string,
  ): Promise<{ url: string }> {
    try {
      const linkTracker = await this.findLinkTrackerByLink(request, link);

      if (linkTracker.expiration) {
        const currentDate = new Date();
        const expirationDate = new Date(linkTracker.expiration);
        if (currentDate > expirationDate)
          throw new NotFoundException(
            `this link (${linkTracker.link}) has expired`,
          );
      }

      if (linkTracker.password && password !== linkTracker.password)
        throw new UnauthorizedException(
          `you are not authorised to access this link`,
        );

      linkTracker.visited++;
      const linkIncrementUpdated = plainToInstance(
        CreateLinkTrackerDto,
        linkTracker,
        {
          excludePrefixes: ['__'],
        },
      );

      await this.updateOneById(linkIncrementUpdated.id, linkIncrementUpdated);
      return { url: linkTracker.target };
    } catch (error) {
      this.logger.error(
        `error on ${AppService.name} | method redirect by link`,
        error['message'],
      );
      throw error;
    }
  }

  async findLinkTrackerByLink(
    request: Request,
    link: string,
  ): Promise<LinkTrackerDto> {
    try {
      const hostedLink = `${this.getHost(request)}/l/${link}`;
      const cleanedUrl = hostedLink.replace('/api', '');

      const linkTracker = await this.repository.findOneByKey(
        'link',
        cleanedUrl,
      );

      if (!linkTracker || linkTracker.valid === false)
        throw new NotFoundException(`this link (${hostedLink}) not found`);
      const linkTrackerTransformed = plainToInstance(
        LinkTrackerDto,
        linkTracker,
        {
          excludePrefixes: ['__'],
        },
      );

      return linkTrackerTransformed;
    } catch (error) {
      this.logger.error(
        `error on ${AppService.name} | method find link tracker by link`,
        error['message'],
      );
      throw error;
    }
  }

  async updateOneById(
    id: string,
    dto: CreateLinkTrackerDto,
  ): Promise<LinkTrackerDto> {
    try {
      const linkTracker = await this.repository.updateOneById(id, dto);
      const linkTrackerTransformed = plainToInstance(
        LinkTrackerDto,
        linkTracker,
        {
          excludePrefixes: ['__'],
        },
      );

      return linkTrackerTransformed;
    } catch (error) {
      throw error;
    }
  }

  async getStatsByLink(
    request: Request,
    link: string,
  ): Promise<{ visited: number }> {
    try {
      const { visited } = await this.findLinkTrackerByLink(request, link);
      return { visited };
    } catch (error) {
      throw error;
    }
  }

  async invalidLinkTrackerByLink(
    request: Request,
    link: string,
  ): Promise<LinkTrackerDto> {
    const hostedLink = `${this.getHost(request)}/l/${link}`;
    const cleanedUrl = hostedLink.replace('/api', '');
    const linkTracker = await this.repository.findOneByKey('link', cleanedUrl);
    linkTracker.valid = false;
    const linkInvalid = plainToInstance(CreateLinkTrackerDto, linkTracker, {
      excludePrefixes: ['__'],
    });

    const linkInvalidUpdated = await this.updateOneById(
      linkInvalid.id,
      linkInvalid,
    );
    return plainToInstance(LinkTrackerDto, linkInvalidUpdated, {
      excludePrefixes: ['__'],
    });
  }

  newMaskedLink(): string {
    let cadenaAleatoria = '';
    const caracteres = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 5; i++) {
      cadenaAleatoria += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length),
      );
    }
    return `l/${cadenaAleatoria}`;
  }

  getHost(request: Request): string {
    const host = request.get('host');
    const protocol = request.protocol;
    return `${protocol}://${host}`;
  }
}
