import { Test, TestingModule } from '@nestjs/testing';
import { MaterialDbService } from '../material-db.service';
import { getModelToken } from '@nestjs/mongoose';
import { Material } from '../../schemas/requestable/material.schema';
import { Types } from 'mongoose';
import { UpdateMaterialDto } from '../material.dto';
import { cantDelete, cantGetMaterials } from '../material.error';
import { IS_SOFT_DELETED_KEY } from '../../schemas/common/soft-delete.schema';

describe('MaterialDbService', () => {
  let service: MaterialDbService;
  let materialModel: any;

  const mockMaterial = {
    _id: new Types.ObjectId(),
    description: 'Steel',
    unitMeasure: 'kg',
    type: 'Raw Material',
    stock: 100,
    inRepair: 10,
    isAvailable: true,
    save: jest.fn(),
    hasEnoughStockAvailable: jest.fn(),
  };

  const mockUpdateMaterialDto: UpdateMaterialDto = {
    description: 'Updated Steel',
    unitMeasure: 'kg',
    type: 'Updated Raw Material',
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
    it('should create and save a new material', async () => {
      materialModel.create.mockResolvedValue({});

      await service.add(mockMaterial);

      expect(materialModel.create).toHaveBeenCalledWith(mockMaterial);
    });

    it('should return an error if creation fails', async () => {
      const error = new Error('Creation failed');
      materialModel.create.mockRejectedValue(error);

      await expect(service.add(mockMaterial)).rejects.toEqual(
        `Cannot create material ${mockMaterial.type}. Reason: ${error}`,
      );
    });
  });

  describe('update', () => {
    it('should update an existing material by ID', async () => {
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

    it('should return an error if updating fails', async () => {
      const error = new Error('Update failed');
      materialModel.updateOne.mockRejectedValue(error);

      await expect(
        service.update(mockMaterial._id, mockUpdateMaterialDto),
      ).rejects.toEqual(
        `Cannot update material with id ${mockMaterial._id}. Reason: ${error}`,
      );
    });
  });

  describe('get', () => {
    it('should return a material by ID', async () => {
      materialModel.findOne.mockResolvedValue(mockMaterial);

      const result = await service.get(mockMaterial._id);

      expect(materialModel.findOne).toHaveBeenCalledWith({
        _id: mockMaterial._id,
      });
      expect(result).toEqual(mockMaterial);
    });

    it('should return an error if fetching fails', async () => {
      const error = new Error('Get failed');
      materialModel.findOne.mockRejectedValue(error);

      await expect(service.get(mockMaterial._id)).rejects.toEqual(
        `Cannot get material with id ${mockMaterial._id}. Reason: ${error}`,
      );
    });
  });

  describe('getAll', () => {
    const unavailableDoc = { ...mockMaterial, [IS_SOFT_DELETED_KEY]: true };

    it('should return an array of available materials', async () => {
      materialModel.find.mockResolvedValue([mockMaterial, unavailableDoc]);

      const result = await service.getAll(true);

      expect(result).toEqual([mockMaterial]);
    });

    it('should return an array of unavailable materials', async () => {
      materialModel.find.mockResolvedValue([mockMaterial, unavailableDoc]);

      const result = await service.getAll(false);

      expect(result).toStrictEqual([unavailableDoc]);
    });

    it('should return an array with all materials', async () => {
      materialModel.find.mockResolvedValue([mockMaterial, unavailableDoc]);

      const result = await service.getAll();

      expect(result).toStrictEqual([mockMaterial, unavailableDoc]);
    });

    it('should throw an error when retrieval fails', async () => {
      const error = new Error('Retrieval failed');
      materialModel.find.mockRejectedValue(error);

      await expect(service.getAll(true)).rejects.toStrictEqual(
        cantGetMaterials(error),
      );
    });
  });

  describe('delete', () => {
    const deletedBy = new Types.ObjectId();

    it('should soft delete a material', async () => {
      mockMaterial.save.mockResolvedValue(true);
      await service.delete(mockMaterial as any, deletedBy);
      expect(mockMaterial.save).toHaveBeenCalled();
    });

    it('should throw an error if delete fails', async () => {
      const err = new Error('Failed to save');
      mockMaterial.save.mockRejectedValue(err);
      await expect(
        service.delete(mockMaterial as any, deletedBy),
      ).rejects.toStrictEqual(cantDelete(mockMaterial._id, err));
    });
  });
});
