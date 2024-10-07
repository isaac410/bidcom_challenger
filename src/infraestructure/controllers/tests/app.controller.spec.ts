import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../app.controller';
import AppService from '../../../application/services/app.service';
import AbstractAppService from '../../../application/services/abstract-app.service';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;
  let appService: AbstractAppService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ useClass: AppService, provide: AbstractAppService }],
    }).compile();

    appController = app.get(AppController);
    appService = app.get(AbstractAppService);
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
    it('should return a valid masked link', () => {
      const result = appService['newMaskedLink']();
      expect(result).toMatch(/^l\/[a-z]{5}$/);
    });
  });
});
