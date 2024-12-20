import { Test, TestingModule } from '@nestjs/testing';
import { ReactiveService } from '../reactive.service';
import { ReactiveDbService } from '../reactive-db.service';
import { BackendException } from '../../shared/backend.exception';
import { Reactive } from '../../schemas/requestable/reactive.schema';
import { UpdateReactivelDto } from '../reactive.dto';
import { Types } from 'mongoose';
import { IS_SOFT_DELETED_KEY } from '../../schemas/common/soft-delete.schema';

describe('ReactiveService', () => {
  let service: ReactiveService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dbService: ReactiveDbService;

  const mockReactive: Reactive = {
    description: 'test-description',
    cas: 'test-cas',
    stock: 50,
    isAvailable: true,
    isSoftDeleted: false,
    hasEnoughStockAvailable: jest.fn(),
  };

  const mockId = new Types.ObjectId();

  const mockDbService = {
    add: jest.fn(),
    getAll: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactiveService,
        { provide: ReactiveDbService, useValue: mockDbService },
      ],
    }).compile();

    service = module.get<ReactiveService>(ReactiveService);
    dbService = module.get<ReactiveDbService>(ReactiveDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should call dbService.add and not throw an error', async () => {
      mockDbService.add.mockResolvedValueOnce(undefined);

      await expect(service.add(mockReactive)).resolves.not.toThrow();
      expect(mockDbService.add).toHaveBeenCalledWith(mockReactive);
    });

    it('should throw BackendException on dbService.add error', async () => {
      mockDbService.add.mockRejectedValueOnce(new Error('Database Error'));

      await expect(service.add(mockReactive)).rejects.toThrow(BackendException);
    });
  });

  describe('getAll', () => {
    it('should return all reactives if dbService.getAll succeeds', async () => {
      mockDbService.getAll.mockResolvedValueOnce([mockReactive]);

      const result = await service.getAll(true);
      expect(result).toEqual([mockReactive]);
      expect(mockDbService.getAll).toHaveBeenCalledWith(true);
    });

    it('should throw BackendException if dbService.getAll throws an error', async () => {
      mockDbService.getAll.mockRejectedValueOnce(new Error('Database Error'));

      await expect(service.getAll()).rejects.toThrow(BackendException);
    });

    it('should throw BackendException if no reactives are found', async () => {
      mockDbService.getAll.mockResolvedValueOnce(null);

      await expect(service.getAll()).rejects.toThrow(BackendException);
    });
  });

  describe('get', () => {
    it('should return a reactive if dbService.get succeeds', async () => {
      mockDbService.get.mockResolvedValueOnce(mockReactive);

      const result = await service.get(mockId);
      expect(result).toEqual(mockReactive);
      expect(mockDbService.get).toHaveBeenCalledWith(mockId);
    });

    it('should throw BackendException if dbService.get throws an error', async () => {
      mockDbService.get.mockRejectedValueOnce(new Error('Database Error'));

      await expect(service.get(mockId)).rejects.toThrow(BackendException);
    });

    it('should throw BackendException if reactive is not found', async () => {
      mockDbService.get.mockResolvedValueOnce(null);

      await expect(service.get(mockId)).rejects.toThrow(BackendException);
    });
  });

  describe('update', () => {
    it('should call dbService.update without error', async () => {
      const updateData: UpdateReactivelDto = { description: 'Updated Name' };
      mockDbService.update.mockResolvedValueOnce(undefined);

      await expect(service.update(mockId, updateData)).resolves.not.toThrow();
      expect(mockDbService.update).toHaveBeenCalledWith(mockId, updateData);
    });

    it('should throw BackendException if dbService.update fails', async () => {
      mockDbService.update.mockRejectedValueOnce(new Error('Database Error'));

      await expect(service.update(mockId, {})).rejects.toThrow(
        BackendException,
      );
    });
  });

  describe('delete', () => {
    const deletedBy = new Types.ObjectId();

    it('should delete the reactive successfully', async () => {
      const mockSoftDeleted = {
        [IS_SOFT_DELETED_KEY]: false,
        save: jest.fn(),
      };
      mockDbService.get.mockResolvedValue(mockSoftDeleted);
      mockDbService.delete.mockResolvedValue(null);

      const response = await service.delete(mockId, deletedBy);

      expect(mockDbService.delete).toHaveBeenCalledWith(
        mockSoftDeleted,
        deletedBy,
      );

      expect(response).toBeUndefined();
    });

    it('should throw BackendException when get fails', async () => {
      const mockSoftDeleted = {
        [IS_SOFT_DELETED_KEY]: false,
        save: jest.fn(),
      };
      mockDbService.get.mockRejectedValue(mockSoftDeleted);

      await expect(service.delete(mockId, deletedBy)).rejects.toThrow(
        BackendException,
      );
    });

    it('should throw 404 when item is already soft deleted', async () => {
      const mockSoftDeleted = {
        [IS_SOFT_DELETED_KEY]: true,
        save: jest.fn(),
      };
      mockDbService.get.mockResolvedValue(mockSoftDeleted);

      await expect(service.delete(mockId, deletedBy)).rejects.toThrow(
        BackendException,
      );
    });

    it('should throw BackendException when deletion fails', async () => {
      const mockSoftDeleted = {
        [IS_SOFT_DELETED_KEY]: false,
        save: jest.fn(),
      };
      mockDbService.get.mockResolvedValue(mockSoftDeleted);

      const error = new Error('Delete failed');
      mockDbService.delete.mockRejectedValue(error);

      await expect(service.delete(mockId, deletedBy)).rejects.toThrow(
        BackendException,
      );
    });
  });
});
