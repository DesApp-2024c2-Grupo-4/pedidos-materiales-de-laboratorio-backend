import { Test, TestingModule } from '@nestjs/testing';
import { MaterialService } from '../material.service';
import { MaterialDbService } from '../material-db.service';
import { Types } from 'mongoose';
import { BackendException } from '../../shared/backend.exception';
import { HttpStatus } from '@nestjs/common';
import { UpdateMaterialDto } from '../../dto/material.dto';

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
    it('should call dbService.add and return nothing on success', async () => {
      mockMaterialDbService.add.mockResolvedValue(undefined);

      const result = await service.add(mockMaterial);

      expect(dbService.add).toHaveBeenCalledWith(mockMaterial);
      expect(result).toBeUndefined();
    });

    it('should return BackendException if dbService.add throws an error', async () => {
      const error = new Error('Add failed');
      mockMaterialDbService.add.mockRejectedValue(error);

      const result = await service.add(mockMaterial);

      expect(result).toBeInstanceOf(BackendException);
      expect(result.message).toBe(error.message);
      expect(result.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
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

      const result = await service.update(
        mockMaterial._id,
        mockUpdateMaterialDto,
      );

      expect(result).toBeInstanceOf(BackendException);
      expect(result.message).toBe(error.message);
      expect(result.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
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

      const result = await service.get(mockMaterial._id);

      expect(result).toBeInstanceOf(BackendException);
      expect((result as BackendException).getStatus()).toBe(
        HttpStatus.NOT_FOUND,
      );
    });

    it('should return BackendException if dbService.get throws an error', async () => {
      const error = new Error('Get failed');
      mockMaterialDbService.get.mockRejectedValue(error);

      const result = await service.get(mockMaterial._id);

      expect(result).toBeInstanceOf(BackendException);
      expect((result as BackendException).message).toBe(error.message);
      expect((result as BackendException).getStatus()).toBe(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

      const result = await service.getAll();

      expect(result).toBeInstanceOf(BackendException);
      expect((result as BackendException).message).toBe(error.message);
      expect((result as BackendException).getStatus()).toBe(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('delete', () => {
    it('should call dbService.delete and return nothing on success', async () => {
      mockMaterialDbService.delete.mockResolvedValue(undefined);

      const result = await service.delete(mockMaterial._id);

      expect(dbService.delete).toHaveBeenCalledWith(mockMaterial._id);
      expect(result).toBeUndefined();
    });

    it('should return BackendException if dbService.delete throws an error', async () => {
      const error = new Error('Delete failed');
      mockMaterialDbService.delete.mockRejectedValue(error);

      const result = await service.delete(mockMaterial._id);

      expect(result).toBeInstanceOf(BackendException);
      expect(result.message).toBe(error.message);
      expect(result.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
