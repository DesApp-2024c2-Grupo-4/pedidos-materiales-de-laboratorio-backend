import { Test, TestingModule } from '@nestjs/testing';
import { MaterialDbService } from '../material-db.service';
import { getModelToken } from '@nestjs/mongoose';
import { Material } from '../../schemas/requestable/material.schema';
import { Types } from 'mongoose';
import { UpdateMaterialDto } from '../../dto/material.dto';
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
      const saveMaterial = {
        save: jest.fn().mockResolvedValue(mockMaterial),
      };
      materialModel.create.mockResolvedValue(saveMaterial);

      await service.add(mockMaterial);

      expect(materialModel.create).toHaveBeenCalledWith(mockMaterial);
      expect(saveMaterial.save).toHaveBeenCalled();
    });

    it('should return an error if creation fails', async () => {
      const error = new Error('Creation failed');
      materialModel.create.mockRejectedValue(error);

      const result = await service.add(mockMaterial);

      expect(result).toEqual(
        new Error(
          `Cannot create material ${mockMaterial.type}. Reason: ${error}`,
        ),
      );
    });

    it('should return an error if save fails', async () => {
      const error = new Error('Creation failed');
      materialModel.create.mockResolvedValue({
        save: jest.fn().mockRejectedValue(error),
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

      const result = await service.update(
        mockMaterial._id,
        mockUpdateMaterialDto,
      );

      expect(result).toEqual(
        new Error(
          `Cannot update material with id ${mockMaterial._id}. Reason: ${error}`,
        ),
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

      const result = await service.get(mockMaterial._id);

      expect(result).toEqual(
        new Error(
          `Cannot get material with id ${mockMaterial._id}. Reason: ${error}`,
        ),
      );
    });
  });

  describe('getAll', () => {
    it('should return all materials', async () => {
      materialModel.find.mockResolvedValue([mockMaterial]);

      const result = await service.getAll();

      expect(materialModel.find).toHaveBeenCalled();
      expect(result).toEqual([mockMaterial]);
    });

    it('should return an error if fetching all materials fails', async () => {
      const error = new Error('Get all failed');
      materialModel.find.mockRejectedValue(error);

      const result = await service.getAll();

      expect(result).toEqual(
        new Error(`Cannot get materials. Reason: ${error}`),
      );
    });
  });

  describe('delete', () => {
    it('should soft-delete a material by ID', async () => {
      materialModel.updateOne.mockResolvedValue(undefined);

      await service.delete(mockMaterial._id);

      const softDelete = {};
      softDelete[IS_SOFT_DELETED_KEY] = true;

      expect(materialModel.updateOne).toHaveBeenCalledWith(
        { _id: mockMaterial._id },
        { $set: softDelete },
      );
    });

    it('should return an error if deleting fails', async () => {
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
