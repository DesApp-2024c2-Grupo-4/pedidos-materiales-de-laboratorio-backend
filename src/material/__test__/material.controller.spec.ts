import { Test, TestingModule } from '@nestjs/testing';
import { MaterialDbService } from '../material-db.service';
import { getModelToken } from '@nestjs/mongoose';
import { Material } from '../../schemas/requestable/material.schema';
import { Types } from 'mongoose';
import { UpdateMaterialDto } from '../../dto/material.dto';
import { IS_SOFT_DELETED_KEY } from '../../schemas/common/soft-delete.schema';
import { cantUpdate } from '../material.error';

describe('MaterialDbService', () => {
  let service: MaterialDbService;
  let materialModel: any;

  const mockMaterial = {
    _id: new Types.ObjectId(),
    description: 'High-quality steel',
    unitMeasure: 'kg',
    type: 'Raw Material',
    stock: 100,
    inRepair: 10,
    isAvailable: true,
    save: jest.fn(),
  };

  const mockUpdateMaterialDto: UpdateMaterialDto = {
    description: 'Updated steel',
    unitMeasure: 'kg',
    type: 'Updated Material',
    stock: 150,
    inRepair: 5,
    isAvailable: false,
  };

  const materialModelMock = {
    create: jest.fn(),
    updateOne: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialDbService,
        {
          provide: getModelToken(Material.name),
          useValue: materialModelMock,
        },
      ],
    }).compile();

    service = module.get<MaterialDbService>(MaterialDbService);
    materialModel = module.get(getModelToken(Material.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should call materialModel.create and save the material on success', async () => {
      materialModel.create.mockResolvedValue(mockMaterial);

      await service.add(mockMaterial);

      expect(materialModel.create).toHaveBeenCalledWith(mockMaterial);
      expect(mockMaterial.save).toHaveBeenCalled();
    });

    it('should return an error if material creation fails', async () => {
      const error = new Error('Create failed');
      materialModel.create.mockResolvedValue({
        save: jest.fn().mockRejectedValue('Create failed'),
      });

      const result = await service.add(mockMaterial);

      expect(result).toEqual(
        new Error(
          `Cannot create material ${mockMaterial.type}. Reason: ${error}`,
        ),
      );
    });
  });

  describe('update', () => {
    it('should call materialModel.updateOne and update the material on success', async () => {
      materialModel.updateOne.mockResolvedValue(undefined);

      const result = await service.update(
        mockMaterial._id,
        mockUpdateMaterialDto,
      );

      expect(materialModel.updateOne).toHaveBeenCalledWith(
        { _id: mockMaterial._id },
        mockUpdateMaterialDto,
      );
      expect(result).toBeUndefined();
    });

    it('should return an error if material update fails', async () => {
      const error = new Error('Update failed');
      materialModel.updateOne.mockRejectedValue(error);

      await expect(
        service.update(mockMaterial._id, mockUpdateMaterialDto),
      ).rejects.toThrow(cantUpdate(mockMaterial._id, error));
    });
  });

  describe('get', () => {
    it('should return a material when found', async () => {
      materialModel.findOne.mockResolvedValue(mockMaterial);

      const result = await service.get(mockMaterial._id);

      expect(materialModel.findOne).toHaveBeenCalledWith({
        _id: mockMaterial._id,
      });
      expect(result).toEqual(mockMaterial);
    });

    it('should return an error if material retrieval fails', async () => {
      const error = new Error('Get failed');
      materialModel.findOne.mockRejectedValue(error);

      const result = await service.get(mockMaterial._id);

      expect(result).toEqual(
        new Error(
          `Cannot get material with id ${mockMaterial._id}. Reason: ${error}`,
        ),
      );
    });
  });

  describe('getAll', () => {
    it('should return all materials on success', async () => {
      materialModel.find.mockResolvedValue([mockMaterial]);

      const result = await service.getAll();

      expect(materialModel.find).toHaveBeenCalled();
      expect(result).toEqual([mockMaterial]);
    });

    it('should return an error if material retrieval fails', async () => {
      const error = new Error('Get all failed');
      materialModel.find.mockRejectedValue(error);

      const result = await service.getAll();

      expect(result).toEqual(
        new Error(`Cannot get materials. Reason: ${error}`),
      );
    });
  });

  describe('delete', () => {
    it('should call materialModel.updateOne to soft-delete a material by ID', async () => {
      materialModel.updateOne.mockResolvedValue(undefined);

      await service.delete(mockMaterial._id);

      const softDelete = {};
      softDelete[IS_SOFT_DELETED_KEY] = true;

      expect(materialModel.updateOne).toHaveBeenCalledWith(
        { _id: mockMaterial._id },
        { $set: softDelete },
      );
    });

    it('should return an error if material deletion fails', async () => {
      const error = new Error('Delete failed');
      materialModel.updateOne.mockRejectedValue(error);

      const result = await service.delete(mockMaterial._id);

      expect(result).toEqual(
        new Error(
          `Cannot delete material with id ${mockMaterial._id}. Reason: ${error}`,
        ),
      );
    });
  });
});
