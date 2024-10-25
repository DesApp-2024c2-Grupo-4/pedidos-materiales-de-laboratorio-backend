import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentController } from '../equipment.controller';
import { EquipmentService } from '../equipment.service';
import { Types } from 'mongoose';

describe('EquipmentController', () => {
  let controller: EquipmentController;
  let service: EquipmentService;

  const mockEquipment = {
    _id: new Types.ObjectId(),
    type: 'test-type',
    description: 'test-description',
    stock: 5,
    unitMeasure: 'test-unit',
    inRepair: 1,
    available: true,
    isSoftDeleted: false,
  };

  const mockEquipmentService = {
    add: jest.fn(),
    getAll: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipmentController],
      providers: [
        {
          provide: EquipmentService,
          useValue: mockEquipmentService,
        },
      ],
    }).compile();

    controller = module.get<EquipmentController>(EquipmentController);
    service = module.get<EquipmentService>(EquipmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should call EquipmentService.add and return the result', async () => {
      mockEquipmentService.add.mockResolvedValue(mockEquipment._id);

      const result = await controller.add(mockEquipment);

      expect(mockEquipmentService.add).toHaveBeenCalledWith(mockEquipment);
      expect(result).toEqual(mockEquipment._id);
    });
  });

  describe('getAll', () => {
    it('should call EquipmentService.getEquipments and return the result', async () => {
      mockEquipmentService.getAll.mockResolvedValue([mockEquipment]);

      const result = await controller.getAll();

      expect(mockEquipmentService.get).toHaveBeenCalled();
      expect(result).toEqual([mockEquipment]);
    });
  });

  describe('get', () => {
    it('should call EquipmentService.get and return the equipment', async () => {
      mockEquipmentService.get.mockResolvedValue(mockEquipment);

      const result = await controller.get(mockEquipment._id);

      expect(mockEquipmentService.get).toHaveBeenCalledWith(mockEquipment._id);
      expect(result).toEqual(mockEquipment);
    });

    it('should return null if no equipment is found', async () => {
      mockEquipmentService.get.mockResolvedValue(null);

      const result = await controller.get(mockEquipment._id);

      expect(mockEquipmentService.get).toHaveBeenCalledWith(mockEquipment._id);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should call EquipmentService.delete and return the result', async () => {
      mockEquipmentService.delete.mockResolvedValue(undefined); // mock void return

      const result = await controller.delete(mockEquipment._id);

      expect(mockEquipmentService.delete).toHaveBeenCalledWith(
        mockEquipment._id,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should call EquipmentService.update and return the result', async () => {
      mockEquipmentService.update.mockResolvedValue(undefined); // mock void return

      const result = await controller.update(mockEquipment._id, mockEquipment);

      expect(mockEquipmentService.update).toHaveBeenCalledWith(
        mockEquipment._id,
        mockEquipment,
      );
      expect(result).toBeUndefined();
    });
  });
});
