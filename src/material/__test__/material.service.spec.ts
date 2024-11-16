import { Test, TestingModule } from '@nestjs/testing';
import { MaterialService } from '../material.service';
import { MaterialDbService } from '../material-db.service';
import { Types } from 'mongoose';
import { BackendException } from '../../shared/backend.exception';
import { HttpStatus } from '@nestjs/common';
import { UpdateMaterialDto } from '../../dto/material.dto';
import { IS_SOFT_DELETED_KEY } from '../../schemas/common/soft-delete.schema';

describe('MaterialService', () => {
  let service: MaterialService;
  let dbService: MaterialDbService;

  const mockMaterial = {
    _id: new Types.ObjectId(),
    description: 'test-description',
    unitMeasure: 'test-unit',
    type: 'test-type',
    stock: 50,
    inRepair: 10,
    isAvailable: true,
    hasEnoughStockAvailable: jest.fn(),
  };

  const mockUpdateMaterialDto: UpdateMaterialDto = {
    description: 'test-description-update',
    unitMeasure: 'test-unit-update',
    stock: 60,
  };

  const mockMaterialDbService = {
    add: jest.fn(),
    update: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialService,
        {
          provide: MaterialDbService,
          useValue: mockMaterialDbService,
        },
      ],
    }).compile();

    service = module.get<MaterialService>(MaterialService);
    dbService = module.get<MaterialDbService>(MaterialDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should call dbService.add and return id', async () => {
      mockMaterialDbService.add.mockResolvedValue(1234);

      const result = await service.add(mockMaterial);

      expect(dbService.add).toHaveBeenCalledWith(mockMaterial);
      expect(result).toStrictEqual({ id: 1234 });
    });

    it('should return BackendException if dbService.add throws an error', async () => {
      const error = 'Add failed';
      mockMaterialDbService.add.mockRejectedValue(error);

      try {
        await service.add(mockMaterial);
        fail('Expected add to throw BackendException');
      } catch (e) {
        expect(e).toBeInstanceOf(BackendException);
        expect(e.message).toBe(error);
        expect(e.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('update', () => {
    it('should call dbService.update and return nothing on success', async () => {
      mockMaterialDbService.update.mockResolvedValue(undefined);

      const result = await service.update(
        mockMaterial._id,
        mockUpdateMaterialDto,
      );

      expect(dbService.update).toHaveBeenCalledWith(
        mockMaterial._id,
        mockUpdateMaterialDto,
      );
      expect(result).toBeUndefined();
    });

    it('should return BackendException if dbService.update throws an error', async () => {
      const error = new Error('Update failed');
      mockMaterialDbService.update.mockRejectedValue(error);

      try {
        await service.update(mockMaterial._id, mockUpdateMaterialDto);
        fail('Expected update to throw BackendException');
      } catch (e) {
        expect(e).toBeInstanceOf(BackendException);
        expect(e.message).toBe(error.message);
        expect(e.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('get', () => {
    it('should return material if dbService.get resolves with material', async () => {
      mockMaterialDbService.get.mockResolvedValue(mockMaterial);

      const result = await service.get(mockMaterial._id);

      expect(dbService.get).toHaveBeenCalledWith(mockMaterial._id);
      expect(result).toEqual(mockMaterial);
    });

    it('should return BackendException with 404 if material is not found', async () => {
      mockMaterialDbService.get.mockResolvedValue(null);

      try {
        await service.get(mockMaterial._id);
        fail('Expected get to throw BackendException');
      } catch (e) {
        expect(e).toBeInstanceOf(BackendException);
        expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should return BackendException if dbService.get throws an error', async () => {
      const error = new Error('Get failed');
      mockMaterialDbService.get.mockRejectedValue(error);

      try {
        await service.get(mockMaterial._id);
        fail('Expected get to throw BackendException');
      } catch (e) {
        expect(e).toBeInstanceOf(BackendException);
        expect((e as any as BackendException).message).toBe(error.message);
        expect((e as any as BackendException).getStatus()).toBe(
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  });

  describe('getAll', () => {
    it('should return materials if dbService.getAll resolves with materials', async () => {
      mockMaterialDbService.getAll.mockResolvedValue([mockMaterial]);

      const result = await service.getAll();

      expect(dbService.getAll).toHaveBeenCalled();
      expect(result).toEqual([mockMaterial]);
    });

    it('should return BackendException if dbService.getAll throws an error', async () => {
      const error = new Error('Get all failed');
      mockMaterialDbService.getAll.mockRejectedValue(error);

      try {
        await service.getAll();
        fail('Expected getAll to throw BackendException');
      } catch (e) {
        expect(e).toBeInstanceOf(BackendException);
        expect(e.message).toBe(error.message);
        expect(e.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('delete', () => {
    const deletedBy = new Types.ObjectId();

    it('should delete the equipment successfully', async () => {
      const mockSoftDeleted = {
        [IS_SOFT_DELETED_KEY]: false,
        save: jest.fn(),
      };
      mockMaterialDbService.get.mockResolvedValue(mockSoftDeleted);
      mockMaterialDbService.delete.mockResolvedValue(null);

      const response = await service.delete(mockMaterial._id, deletedBy);

      expect(dbService.delete).toHaveBeenCalledWith(mockSoftDeleted, deletedBy);

      expect(response).toBeUndefined();
    });

    it('should throw BackendException when get fails', async () => {
      const mockSoftDeleted = {
        [IS_SOFT_DELETED_KEY]: false,
        save: jest.fn(),
      };
      mockMaterialDbService.get.mockRejectedValue(mockSoftDeleted);

      await expect(service.delete(mockMaterial._id, deletedBy)).rejects.toThrow(
        BackendException,
      );
    });

    it('should throw 404 when item is already soft deleted', async () => {
      const mockSoftDeleted = {
        [IS_SOFT_DELETED_KEY]: true,
        save: jest.fn(),
      };
      mockMaterialDbService.get.mockResolvedValue(mockSoftDeleted);

      await expect(service.delete(mockMaterial._id, deletedBy)).rejects.toThrow(
        BackendException,
      );
    });

    it('should throw BackendException when deletion fails', async () => {
      const mockSoftDeleted = {
        [IS_SOFT_DELETED_KEY]: false,
        save: jest.fn(),
      };
      mockMaterialDbService.get.mockResolvedValue(mockSoftDeleted);

      const error = new Error('Delete failed');
      mockMaterialDbService.delete.mockRejectedValue(error);

      await expect(service.delete(mockMaterial._id, deletedBy)).rejects.toThrow(
        BackendException,
      );
    });
  });
});
