import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentController } from '../equipment.controller';
import { EquipmentService } from '../equipment.service';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../../dto/authenticated-request.dto';
import { EquipmentTypes } from '../equipment.const';

describe('EquipmentController', () => {
  let controller: EquipmentController;
  let service: any;

  const mockAuthenticatedRequest = {
    user: {
      id: new Types.ObjectId(),
    },
  } as AuthenticatedRequest;

  const mockEquipment = {
    _id: new Types.ObjectId(),
    type: 'AGITADORES-CENTRIFUGAS' as any,
    description: 'test-description',
    stock: 5,
    inRepair: 1,
    isSoftDeleted: false,
    hasEnoughStockAvailable: jest.fn(),
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
      service.add.mockResolvedValue(mockEquipment._id);

      const result = await controller.add(mockEquipment);

      expect(service.add).toHaveBeenCalledWith(mockEquipment);
      expect(result).toEqual(mockEquipment._id);
    });
  });

  describe('getAll', () => {
    it('should call EquipmentService.getEquipments and return the result', async () => {
      service.getAll.mockResolvedValue([mockEquipment]);

      const result = await controller.getAll({});

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual([mockEquipment]);
    });
  });

  describe('get', () => {
    it('should call EquipmentService.get and return the equipment', async () => {
      service.get.mockResolvedValue(mockEquipment);

      const result = await controller.get(mockEquipment._id);

      expect(service.get).toHaveBeenCalledWith(mockEquipment._id);
      expect(result).toEqual(mockEquipment);
    });

    it('should return null if no equipment is found', async () => {
      service.get.mockResolvedValue(null);

      const result = await controller.get(mockEquipment._id);

      expect(service.get).toHaveBeenCalledWith(mockEquipment._id);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should call EquipmentService.delete and return the result', async () => {
      service.delete.mockResolvedValue(undefined); // mock void return

      const result = await controller.delete(mockAuthenticatedRequest, {
        id: mockEquipment._id,
      });

      expect(service.delete).toHaveBeenCalledWith(
        mockEquipment._id,
        mockAuthenticatedRequest.user.id,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should call EquipmentService.update and return the result', async () => {
      service.update.mockResolvedValue(undefined); // mock void return

      const result = await controller.update(mockEquipment._id, mockEquipment);

      expect(service.update).toHaveBeenCalledWith(
        mockEquipment._id,
        mockEquipment,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getTypes', () => {
    it('should return equipment types', () => {
      const result = controller.getTypes();
      expect(result).toEqual(EquipmentTypes);
    });
  });
});
