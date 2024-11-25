import { Test, TestingModule } from '@nestjs/testing';
import { ReactiveController } from '../reactive.controller';
import { ReactiveService } from '../reactive.service';
import { Reactive } from '../../schemas/requestable/reactive.schema';
import { IdDto } from '../../dto/id.dto';
import { UpdateReactivelDto } from '../reactive.dto';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../../dto/authenticated-request.dto';
import {
  ReactiveTypes,
  ReactiveQualities,
  ReactiveUnits,
  ReactiveSolvents,
} from '../reactive.const';

describe('ReactiveController', () => {
  let controller: ReactiveController;
  let service: any;

  const mockAuthenticatedRequest = {
    user: {
      id: new Types.ObjectId(),
    },
  } as AuthenticatedRequest;

  const mockReactive: Reactive = {
    description: 'test-description',
    cas: 'test-cas',
    stock: 50,
    isAvailable: true,
    isSoftDeleted: false,
    hasEnoughStockAvailable: jest.fn(),
  };

  const mockIdDto: IdDto = {
    id: new Types.ObjectId(),
  };

  const mockUpdateReactiveDto: UpdateReactivelDto = {
    description: 'Updated Description',
    cas: '1234-56-7',
    stock: 200,
    isAvailable: false,
  };

  const mockReactiveService = {
    add: jest.fn(),
    getAll: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getReactiveTypes: jest.fn().mockReturnValue(ReactiveTypes),
    getReactiveQualities: jest.fn().mockReturnValue(ReactiveQualities),
    getReactiveUnits: jest.fn().mockReturnValue(ReactiveUnits),
    getReactiveSolvents: jest.fn().mockReturnValue(ReactiveSolvents),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactiveController],
      providers: [{ provide: ReactiveService, useValue: mockReactiveService }],
    }).compile();

    controller = module.get<ReactiveController>(ReactiveController);
    service = module.get<ReactiveService>(ReactiveService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should call ReactiveService.add with the correct parameters', async () => {
      await controller.add(mockReactive);
      expect(service.add).toHaveBeenCalledWith(mockReactive);
    });
  });

  describe('getAll', () => {
    it('should call ReactiveService.getAll', async () => {
      await controller.getAll({});
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should call ReactiveService.get with the correct id', async () => {
      service.get.mockResolvedValueOnce(mockReactive);
      const result = await controller.get(mockIdDto);
      expect(service.get).toHaveBeenCalledWith(mockIdDto.id);
      expect(result).toEqual(mockReactive);
    });
  });

  describe('update', () => {
    it('should call ReactiveService.update with the correct parameters', async () => {
      await controller.update(mockIdDto, mockUpdateReactiveDto);
      expect(service.update).toHaveBeenCalledWith(
        mockIdDto.id,
        mockUpdateReactiveDto,
      );
    });
  });

  describe('delete', () => {
    it('should call ReactiveService.delete with the correct id', async () => {
      await controller.delete(mockAuthenticatedRequest, mockIdDto);
      expect(service.delete).toHaveBeenCalledWith(
        mockIdDto.id,
        mockAuthenticatedRequest.user.id,
      );
    });
  });

  describe('getReactiveTypes', () => {
    it('should return reactive types', () => {
      const result = controller.getReactiveTypes();
      expect(result).toEqual(ReactiveTypes);
    });
  });

  describe('getReactiveQualities', () => {
    it('should return reactive qualities', () => {
      const result = controller.getReactiveQualities();
      expect(result).toEqual(ReactiveQualities);
    });
  });

  describe('getReactiveUnits', () => {
    it('should return reactive units', () => {
      const result = controller.getReactiveUnits();
      expect(result).toEqual(ReactiveUnits);
    });
  });

  describe('getReactiveSolvents', () => {
    it('should return reactive solvents', () => {
      const result = controller.getReactiveSolvents();
      expect(result).toEqual(ReactiveSolvents);
    });
  });
});
