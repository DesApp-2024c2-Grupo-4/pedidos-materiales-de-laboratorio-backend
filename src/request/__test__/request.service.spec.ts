import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from '../request.service';
import { RequestDbService } from '../request-db.service';
import { ConfigService } from '@nestjs/config';
import { EquipmentdbService } from '../../equipment/equipment-db.service';
import { ReactiveDbService } from '../../reactive/reactive-db.service';
import { MaterialDbService } from '../../material/material-db.service';
import { Types } from 'mongoose';
import { BackendException } from '../../shared/backend.exception';
import { HttpStatus } from '@nestjs/common';
import { Request, RequestDocument } from '../../schemas/request.schema';
import { UpdateRequestDto } from '../../dto/request.dto';
import { checkItemsAvailability } from '../request.helpers';
import { IS_SOFT_DELETED_KEY } from '../../schemas/common/soft-delete.schema';

jest.mock('../request.helpers', () => ({
  checkItemsAvailability: jest.fn(),
}));

describe('RequestService', () => {
  let service: RequestService;
  let dbService: jest.Mocked<RequestDbService>;
  let configService: jest.Mocked<ConfigService>;
  let equipmentDbService: jest.Mocked<EquipmentdbService>;
  let reactiveDbService: jest.Mocked<ReactiveDbService>;
  let materialDbService: jest.Mocked<MaterialDbService>;

  const mockRequest: Partial<RequestDocument> = {
    _id: new Types.ObjectId(),
    updateExpiration: jest.fn(),
  };

  const mockCreatorId = new Types.ObjectId();
  const mockRequestData: Partial<Request> = {
    materials: [],
    reactives: [],
    endDate: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: RequestDbService,
          useValue: {
            add: jest.fn(),
            update: jest.fn(),
            get: jest.fn(),
            getAll: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('7') },
        },
        { provide: EquipmentdbService, useValue: {} },
        { provide: ReactiveDbService, useValue: {} },
        { provide: MaterialDbService, useValue: {} },
      ],
    }).compile();

    service = module.get<RequestService>(RequestService);
    dbService = module.get(RequestDbService);
    configService = module.get(ConfigService);
    equipmentDbService = module.get(EquipmentdbService);
    reactiveDbService = module.get(ReactiveDbService);
    materialDbService = module.get(MaterialDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should successfully add a request', async () => {
      dbService.add.mockResolvedValue(mockRequest._id);
      (checkItemsAvailability as jest.Mock).mockResolvedValue({
        available: true,
      });

      const result = await service.add(
        mockCreatorId,
        mockRequestData as Request,
      );

      expect(checkItemsAvailability).toHaveBeenCalledWith(
        mockRequestData,
        equipmentDbService,
        reactiveDbService,
        materialDbService,
      );
      expect(dbService.add).toHaveBeenCalledWith(
        mockCreatorId,
        mockRequestData,
      );
      expect(result).toEqual({ id: mockRequest._id });
    });

    it('should throw a BackendException on validation error', async () => {
      (checkItemsAvailability as jest.Mock).mockRejectedValue(
        new BackendException('Validation error', HttpStatus.BAD_REQUEST),
      );

      await expect(
        service.add(mockCreatorId, mockRequestData as Request),
      ).rejects.toThrow(BackendException);
    });

    it('should throw a BackendException on DB error', async () => {
      (checkItemsAvailability as jest.Mock).mockResolvedValue({
        available: true,
      });
      dbService.add.mockRejectedValue(new Error('DB error'));

      await expect(
        service.add(mockCreatorId, mockRequestData as Request),
      ).rejects.toThrow(BackendException);
    });
  });

  describe('update', () => {
    it('should successfully update a request', async () => {
      (checkItemsAvailability as jest.Mock).mockResolvedValue({
        available: true,
      });
      dbService.update.mockResolvedValue(null);

      await service.update(
        mockRequest._id,
        mockRequestData as UpdateRequestDto,
      );

      expect(checkItemsAvailability).toHaveBeenCalled();
      expect(dbService.update).toHaveBeenCalledWith(
        mockRequest._id,
        mockRequestData,
      );
    });

    it('should throw a BackendException on validation error', async () => {
      (checkItemsAvailability as jest.Mock).mockRejectedValue(
        new BackendException('Validation error', HttpStatus.BAD_REQUEST),
      );

      await expect(
        service.update(mockRequest._id, mockRequest as UpdateRequestDto),
      ).rejects.toThrow(BackendException);
    });
  });

  describe('get', () => {
    it('should return the request and update expiration', async () => {
      dbService.get.mockResolvedValue(mockRequest as any);

      const result = await service.get(mockRequest._id);

      expect(dbService.get).toHaveBeenCalledWith(mockRequest._id);
      expect(result.updateExpiration).toHaveBeenCalled();
    });

    it('should throw a BackendException if request is not found', async () => {
      dbService.get.mockResolvedValue(null);

      await expect(service.get(mockRequest._id)).rejects.toThrow(
        BackendException,
      );
    });
  });

  describe('getAll', () => {
    it('should return all requests', async () => {
      dbService.getAll.mockResolvedValue([mockRequest as any]);

      const result = await service.getAll();

      expect(dbService.getAll).toHaveBeenCalled();
      expect(result).toEqual([mockRequest]);
    });
  });

  describe('delete', () => {
    it('should delete a request successfully', async () => {
      jest
        .spyOn(service, 'get')
        .mockResolvedValue(mockRequest as RequestDocument);
      dbService.delete.mockResolvedValue(null);

      await service.delete(mockRequest._id, mockCreatorId);

      expect(service.get).toHaveBeenCalledWith(mockRequest._id);
      expect(dbService.delete).toHaveBeenCalledWith(mockRequest, mockCreatorId);
    });

    it('should throw a BackendException if request is already soft deleted', async () => {
      const softDeletedRequest = {
        ...mockRequest,
        [IS_SOFT_DELETED_KEY]: true,
      };

      jest
        .spyOn(service, 'get')
        .mockResolvedValue(softDeletedRequest as RequestDocument);

      await expect(
        service.delete(mockRequest._id, mockCreatorId),
      ).rejects.toThrow(BackendException);
    });
  });
});
