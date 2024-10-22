import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentService } from '../equipment.service';
import { EquipmentdbService } from '../equipment-db.service';
import { BackendException } from '../../shared/backend.exception';
import { Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Equipment } from '../../schemas/requestable/equipment.schema';

describe('EquipmentService', () => {
  let equipmentService: EquipmentService;
  let dbService: EquipmentdbService;

  const mockEquipmentModel = {
    add: jest.fn(),
    getAll: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

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
    getEquipments: jest.fn(),
    getEquipmentById: jest.fn(),
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
        {
          provide: getModelToken(Equipment.name),
          useValue: mockEquipmentModel,
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
      mockEquipmentDbService.add.mockResolvedValue([id, null]);

      const result = await equipmentService.add(mockEquipment);
      expect(result).toBe(id);
      expect(mockEquipmentDbService.add).toHaveBeenCalledWith(mockEquipment);
    });

    it('should throw BackendException when creation fails', async () => {
      const error = new Error('Creation failed');
      mockEquipmentDbService.add.mockResolvedValue([null, error]);

      await expect(equipmentService.add(mockEquipment)).rejects.toThrow(
        BackendException,
      );
    });
  });

  describe('getEquipments', () => {
    it('should return a list of equipments', async () => {
      const equipments = [mockEquipment];
      mockEquipmentDbService.getEquipments.mockResolvedValue([
        equipments,
        null,
      ]);

      const result = await equipmentService.getAll();
      expect(result).toEqual(equipments);
    });

    it('should return an empty array if no equipments found', async () => {
      mockEquipmentDbService.getEquipments.mockResolvedValue([null, null]);

      const result = await equipmentService.getAll();
      expect(result).toEqual([]);
    });

    it('should throw BackendException when retrieval fails', async () => {
      const error = new Error('Get failed');
      mockEquipmentDbService.getEquipments.mockResolvedValue([null, error]);

      await expect(equipmentService.getAll()).rejects.toThrow(BackendException);
    });
  });

  describe('getEquipmentById', () => {
    it('should return the equipment by ID', async () => {
      mockEquipmentDbService.getEquipmentById.mockResolvedValue([
        mockEquipment,
        null,
      ]);

      const result = await equipmentService.get(mockEquipment._id);
      expect(result).toEqual(mockEquipment);
    });

    it('should throw BackendException if equipment not found', async () => {
      mockEquipmentDbService.getEquipmentById.mockResolvedValue([null, null]);

      await expect(equipmentService.get(mockEquipment._id)).rejects.toThrow(
        BackendException,
      );
    });

    it('should throw BackendException when retrieval fails', async () => {
      const error = new Error('Get failed');
      mockEquipmentDbService.getEquipmentById.mockResolvedValue([null, error]);

      await expect(equipmentService.get(mockEquipment._id)).rejects.toThrow(
        BackendException,
      );
    });
  });

  describe('update', () => {
    it('should update the equipment successfully', async () => {
      mockEquipmentDbService.update.mockResolvedValue([null, null]);

      await equipmentService.update(mockEquipment._id, mockEquipment);
      expect(mockEquipmentDbService.update).toHaveBeenCalledWith(
        mockEquipment._id,
        mockEquipment,
      );
    });

    it('should throw BackendException when update fails', async () => {
      const error = new Error('Update failed');
      mockEquipmentDbService.update.mockResolvedValue([null, error]);

      await expect(
        equipmentService.update(mockEquipment._id, mockEquipment),
      ).rejects.toThrow(BackendException);
    });
  });

  describe('deleteEquipmentById', () => {
    it('should delete the equipment successfully', async () => {
      mockEquipmentDbService.delete.mockResolvedValue([null, null]);

      await equipmentService.delete(mockEquipment._id);
      expect(mockEquipmentDbService.delete).toHaveBeenCalledWith(
        mockEquipment._id,
      );
    });

    it('should throw BackendException when deletion fails', async () => {
      const error = new Error('Delete failed');
      mockEquipmentDbService.delete.mockResolvedValue([null, error]);

      await expect(equipmentService.delete(mockEquipment._id)).rejects.toThrow(
        BackendException,
      );
    });
  });
});
