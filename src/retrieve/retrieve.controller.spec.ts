import { Test, TestingModule } from '@nestjs/testing';
import { RetrieveController } from './retrieve.controller';
import { RetrieveService } from './retrieve.service';

describe('RetrieveController', () => {
  let controller: RetrieveController;
  let service: RetrieveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetrieveController],
      providers: [
        {
          provide: RetrieveService,
          useValue: {
            updateDatabase: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RetrieveController>(RetrieveController);
    service = module.get<RetrieveService>(RetrieveService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateDatabase', () => {
    it('should update the database with new movies', async () => {
      const mockResult = {
        message: 'Database updated successfully',
        updatedCount: 10,
      };
      jest.spyOn(service, 'updateDatabase').mockResolvedValue(mockResult);

      const result = await controller.updateDatabase();

      expect(result).toEqual(mockResult);
      expect(service.updateDatabase).toHaveBeenCalled();
    });

    it('should handle errors during database update', async () => {
      jest
        .spyOn(service, 'updateDatabase')
        .mockRejectedValue(new Error('Failed to update database'));

      await expect(controller.updateDatabase()).rejects.toThrow(
        'Failed to update database',
      );
      expect(service.updateDatabase).toHaveBeenCalled();
    });
  });
});
