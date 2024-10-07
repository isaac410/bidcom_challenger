import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../app.controller';
import AppService from '../../../application/services/app.service';
import AbstractAppService from '../../../application/services/abstract-app.service';
import AbstractAppRepository from '../../../domain/repositories/abstract-app.repository';
import { CreateLinkTrackerDto } from 'src/application/dtos/create-link-tracker.dto';
import { LinkTrackerDto } from 'src/application/dtos/link-tracker.dto';
import { Request } from 'express';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;
  let appService: AbstractAppService;

  const mockCreated = {
    _id: '2',
    id: '2',
    target: 'https://facebook.com',
    valid: true,
    password: null,
    expiration: '2024-10-04',
    link: 'http://localhost:4000/l/abcde',
    visited: 0,
  } as unknown as CreateLinkTrackerDto;

  const mockRequest: Request = {
    protocol: 'http',
    get: jest.fn().mockReturnValue('localhost:4000'),
  } as unknown as Request;

  const mockAppRepository = {
    create: jest.fn().mockResolvedValue(mockCreated),
    findOne: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([
      {
        _id: '1',
        target: 'https://example.com',
        visited: 10,
        valid: true,
        password: 'mypassword',
        expiration: '2024-10-04',
        link: 'http://localhost:4000/l/qetag',
      },
      {
        _id: '2',
        target: 'https://facebook.com',
        visited: 0,
        valid: true,
        password: null,
        expiration: '2024-10-04',
        link: 'http://localhost:4000/l/abcde',
      },
    ]),
  };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { useClass: AppService, provide: AbstractAppService },
        { useValue: mockAppRepository, provide: AbstractAppRepository },
      ],
    }).compile();

    appController = app.get(AppController);
    appService = app.get(AbstractAppService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHealth', () => {
    it('should return the health status', () => {
      const mockUptime = jest.spyOn(process, 'uptime').mockReturnValue(12345);
      const result = appController.getHealth();

      expect(result).toEqual({
        message: 'OK',
        timestamp: expect.any(Number),
        uptime: 12345,
      });

      mockUptime.mockRestore();
    });
  });

  describe('newMaskedLink', () => {
    it('should return a valid masked link', async () => {
      const result = await appService['newMaskedLink']();
      expect(result).toMatch(/^l\/[a-z]{5}$/);
    });
  });

  describe('createLinkTracker', () => {
    it('should create a link tracker and return the expected DTO', async () => {
      jest.spyOn(appService, 'newMaskedLink').mockReturnValue('l/abcde');

      const result = await appService.createLinkTracker(
        mockRequest,
        mockCreated,
      );

      const expectedLinkTrackerDto: LinkTrackerDto = {
        id: '2',
        target: 'https://facebook.com',
        valid: true,
        password: null,
        expiration: '2024-10-04',
        link: 'http://localhost:4000/l/abcde',
        visited: 0,
      };

      expect(result).toEqual(expectedLinkTrackerDto);
    });
  });
});
