import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentService } from '../equipment.service';
import { EquipmentdbService } from '../equipment-db.service';
import { BackendException } from '../../shared/backend.exception';
import { Types } from 'mongoose';

describe('EquipmentService', () => {
  let equipmentService: EquipmentService;
  let dbService: any;

  const mockEquipment = {
    _id: new Types.ObjectId(),
    type: 'Test Equipment',
    description: 'Test Description',
    stock: 10,
    unitMeasure: 'pcs',
    inRepair: 0,
    available: true,
  };

  const mockEquipmentDbService = {
    add: jest.fn(),
    getAll: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipmentService,
        {
          provide: EquipmentdbService,
          useValue: mockEquipmentDbService,
        },
      ],
    }).compile();

    equipmentService = module.get<EquipmentService>(EquipmentService);
    dbService = module.get<EquipmentdbService>(EquipmentdbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should create an equipment and return its ID', async () => {
      const id = new Types.ObjectId();
      dbService.add.mockResolvedValue(id);

      const result = await equipmentService.add(mockEquipment);
      expect(result).toBe(id);
      expect(dbService.add).toHaveBeenCalledWith(mockEquipment);
    });

    it('should throw BackendException when creation fails', async () => {
      const error = new Error('Creation failed');
      dbService.add.mockRejectedValue([null, error]);

      await expect(equipmentService.add(mockEquipment)).rejects.toThrow(
        BackendException,
      );
    });
  });

  describe('getAll', () => {
    it('should return a list of equipments', async () => {
      const equipments = [mockEquipment];
      dbService.getAll.mockResolvedValue(equipments);

      const result = await equipmentService.getAll();
      expect(result).toEqual(equipments);
    });

    it('should return an empty array if no equipments found', async () => {
      dbService.getAll.mockResolvedValue(null);

      const result = await equipmentService.getAll();
      expect(result).toEqual([]);
    });

    it('should throw BackendException when retrieval fails', async () => {
      const error = new Error('Get failed');
      dbService.getAll.mockRejectedValue([null, error]);

      await expect(equipmentService.getAll()).rejects.toThrow(BackendException);
    });
  });

  describe('get', () => {
    it('should return the equipment by ID', async () => {
      dbService.get.mockResolvedValue(mockEquipment);

      const result = await equipmentService.get(mockEquipment._id);
      expect(result).toEqual(mockEquipment);
    });

    it('should throw BackendException if equipment not found', async () => {
      dbService.get.mockResolvedValue(null);

      await expect(equipmentService.get(mockEquipment._id)).rejects.toThrow(
        BackendException,
      );
    });

    it('should throw BackendException when retrieval fails', async () => {
      const error = new Error('Get failed');
      dbService.get.mockRejectedValue(error);

      await expect(equipmentService.get(mockEquipment._id)).rejects.toThrow(
        BackendException,
      );
    });
  });

  describe('update', () => {
    it('should update the equipment successfully', async () => {
      dbService.update.mockResolvedValue([null, null]);

      await equipmentService.update(mockEquipment._id, mockEquipment);
      expect(dbService.update).toHaveBeenCalledWith(
        mockEquipment._id,
        mockEquipment,
      );
    });

    it('should throw BackendException when update fails', async () => {
      const error = new Error('Update failed');
      dbService.update.mockRejectedValue([null, error]);

      await expect(
        equipmentService.update(mockEquipment._id, mockEquipment),
      ).rejects.toThrow(BackendException);
    });
  });

  describe('delete', () => {
    it('should delete the equipment successfully', async () => {
      dbService.delete.mockResolvedValue(null);

      const response = await equipmentService.delete(mockEquipment._id);
      expect(dbService.delete).toHaveBeenCalledWith(mockEquipment._id);
      expect(response).toBeUndefined();
    });

    it('should throw BackendException when deletion fails', async () => {
      const error = new Error('Delete failed');
      dbService.delete.mockRejectedValue(error);

      await expect(equipmentService.delete(mockEquipment._id)).rejects.toThrow(
        BackendException,
      );
    });
  });
});
