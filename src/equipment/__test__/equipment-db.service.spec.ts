import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { EquipmentdbService } from '../equipment-db.service';
import { Equipment } from '../../schemas/requestable/equipment.schema';
import {
  cantCreateEquipment,
  cantGetEquipment,
  cantGetEquipmentById,
  cantUpdateEquipment,
  cantDeleteEquipment,
} from '../equipment.errors';

describe('EquipmentdbService', () => {
  let service: EquipmentdbService;
  let equipmentModel: any;

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

  const mockEquipmentModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipmentdbService,
        {
          provide: getModelToken(Equipment.name),
          useValue: mockEquipmentModel,
        },
      ],
    }).compile();

    service = module.get<EquipmentdbService>(EquipmentdbService);
    equipmentModel = module.get(getModelToken(Equipment.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEquipment', () => {
    it('should create a new equipment and return its ID', async () => {
      equipmentModel.create.mockResolvedValue(mockEquipment);

      const result = await service.createEquipment(
        mockEquipment as any as Equipment,
      );

      expect(result).toEqual(mockEquipment._id);
      expect(equipmentModel.create).toHaveBeenCalledWith(mockEquipment);
    });

    it('should throw an error when creation fails', async () => {
      const error = new Error('Creation failed');
      equipmentModel.create.mockRejectedValue(error);

      await expect(
        service.createEquipment(mockEquipment as Equipment),
      ).rejects.toThrow(cantCreateEquipment(error));
    });
  });

  describe('getEquipments', () => {
    it('should return an array of equipments', async () => {
      equipmentModel.find.mockResolvedValue([mockEquipment]);

      const result = await service.getEquipments(true);

      expect(result).toEqual([mockEquipment]);
      expect(equipmentModel.find).toHaveBeenCalledWith({ available: true });
    });

    it('should throw an error when retrieval fails', async () => {
      const error = new Error('Retrieval failed');
      equipmentModel.find.mockRejectedValue(error);

      await expect(service.getEquipments(true)).rejects.toThrow(
        cantGetEquipment(error),
      );
    });
  });

  describe('getEquipmentById', () => {
    it('should return a single equipment by ID', async () => {
      equipmentModel.findById.mockResolvedValue(mockEquipment);

      const result = await service.getEquipmentById(mockEquipment._id);

      expect(result).toEqual(mockEquipment);
      expect(equipmentModel.findById).toHaveBeenCalledWith(mockEquipment._id);
    });

    it('should throw an error when equipment is not found', async () => {
      const error = new Error('Not found');
      equipmentModel.findById.mockRejectedValue(error);

      await expect(service.getEquipmentById(mockEquipment._id)).rejects.toThrow(
        cantGetEquipmentById(mockEquipment._id, error),
      );
    });
  });

  describe('updateEquipmentById', () => {
    it('should update an equipment by ID', async () => {
      equipmentModel.updateOne.mockResolvedValue({ nModified: 1 });

      await service.updateEquipmentById(
        mockEquipment._id,
        mockEquipment as Equipment,
      );

      expect(equipmentModel.updateOne).toHaveBeenCalledWith(
        { _id: mockEquipment._id },
        mockEquipment,
        { new: true },
      );
    });

    it('should throw an error when update fails', async () => {
      const error = new Error('Update failed');
      equipmentModel.updateOne.mockRejectedValue(error);

      await expect(
        service.updateEquipmentById(
          mockEquipment._id,
          mockEquipment as Equipment,
        ),
      ).rejects.toThrow(cantUpdateEquipment(mockEquipment._id, error));
    });
  });

  describe('delete', () => {
    it('should soft-delete an equipment by ID', async () => {
      equipmentModel.updateOne.mockResolvedValue({ nModified: 1 });

      await service.delete(mockEquipment._id);

      expect(equipmentModel.updateOne).toHaveBeenCalledWith(
        { _id: mockEquipment._id },
        { $set: { isSoftDeleted: true } },
      );
    });

    it('should throw an error when deletion fails', async () => {
      const error = new Error('Delete failed');
      equipmentModel.updateOne.mockRejectedValue(error);

      await expect(service.delete(mockEquipment._id)).rejects.toThrow(
        cantDeleteEquipment(mockEquipment._id, error),
      );
    });
  });
});
