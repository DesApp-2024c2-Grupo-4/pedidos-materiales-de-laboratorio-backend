import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { EquipmentdbService } from '../equipment-db.service';
import { Equipment } from '../../schemas/requestable/equipment.schema';
import {
  cantCreateEquipment,
  cantDeleteEquipment,
  cantGetEquipment,
  cantGetEquipmentById,
  cantUpdateEquipment,
} from '../equipment.errors';
import { IS_SOFT_DELETED_KEY } from '../../schemas/common/soft-delete.schema';

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
    isAvailable: true,
    isSoftDeleted: false,
    save: jest.fn(),
    hasEnoughStockAvailable: jest.fn(),
  };

  const mockEquipmentModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
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

  describe('add', () => {
    it('should create a new equipment and return its ID', async () => {
      equipmentModel.create.mockResolvedValue(mockEquipment);

      const result = await service.add(mockEquipment as any as Equipment);

      expect(result).toEqual(mockEquipment._id);
      expect(equipmentModel.create).toHaveBeenCalledWith(mockEquipment);
    });

    it('should throw an error when creation fails', async () => {
      const error = new Error('Creation failed');
      equipmentModel.create.mockRejectedValue(error);

      await expect(
        service.add(mockEquipment as Equipment),
      ).rejects.toStrictEqual(cantCreateEquipment(error));
    });
  });

  describe('getAll', () => {
    const unavailableDoc = { ...mockEquipment, [IS_SOFT_DELETED_KEY]: true };

    it('should return an array of available equipments', async () => {
      equipmentModel.find.mockResolvedValue([mockEquipment, unavailableDoc]);

      const result = await service.getAll(true);

      expect(result).toEqual([mockEquipment]);
    });

    it('should return an array of unavailable equipments', async () => {
      equipmentModel.find.mockResolvedValue([mockEquipment, unavailableDoc]);

      const result = await service.getAll(false);

      expect(result).toStrictEqual([unavailableDoc]);
    });

    it('should return an array with all equipments', async () => {
      equipmentModel.find.mockResolvedValue([mockEquipment, unavailableDoc]);

      const result = await service.getAll();

      expect(result).toStrictEqual([mockEquipment, unavailableDoc]);
    });

    it('should throw an error when retrieval fails', async () => {
      const error = new Error('Retrieval failed');
      equipmentModel.find.mockRejectedValue(error);

      await expect(service.getAll(true)).rejects.toStrictEqual(
        cantGetEquipment(error),
      );
    });
  });

  describe('get', () => {
    it('should return a single equipment by ID', async () => {
      equipmentModel.findById.mockResolvedValue(mockEquipment);

      const result = await service.get(mockEquipment._id);

      expect(result).toEqual(mockEquipment);
      expect(equipmentModel.findById).toHaveBeenCalledWith(mockEquipment._id);
    });

    it('should throw an error when equipment is not found', async () => {
      const error = new Error('Not found');
      equipmentModel.findById.mockRejectedValue(error);

      await expect(service.get(mockEquipment._id)).rejects.toStrictEqual(
        cantGetEquipmentById(mockEquipment._id, error),
      );
    });
  });

  describe('update', () => {
    it('should update an equipment by ID', async () => {
      equipmentModel.updateOne.mockResolvedValue({ nModified: 1 });

      await service.update(mockEquipment._id, mockEquipment as Equipment);

      expect(equipmentModel.updateOne).toHaveBeenCalledWith(
        { _id: mockEquipment._id },
        mockEquipment,
      );
    });

    it('should throw an error when update fails', async () => {
      const error = new Error('Update failed');
      equipmentModel.updateOne.mockRejectedValue(error);

      await expect(
        service.update(mockEquipment._id, mockEquipment as Equipment),
      ).rejects.toStrictEqual(cantUpdateEquipment(mockEquipment._id, error));
    });
  });

  describe('delete', () => {
    const deletedBy = new Types.ObjectId();

    it('should soft delete a user', async () => {
      mockEquipment.save.mockResolvedValue(true);
      await service.delete(mockEquipment as any, deletedBy);
      expect(mockEquipment.save).toHaveBeenCalled();
    });

    it('should throw an error if delete fails', async () => {
      const err = new Error('Failed to save');
      mockEquipment.save.mockRejectedValue(err);
      await expect(
        service.delete(mockEquipment as any, deletedBy),
      ).rejects.toStrictEqual(cantDeleteEquipment(mockEquipment._id, err));
    });
  });
});
