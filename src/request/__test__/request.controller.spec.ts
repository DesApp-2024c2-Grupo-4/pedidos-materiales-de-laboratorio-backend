import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from '../request.controller';
import { RequestService } from '../request.service';
import { RequestStatuses, Labs } from '../request.const';
import { Types } from 'mongoose';

describe('RequestController', () => {
  let controller: RequestController;
  let service: RequestService;

  const mockRequestService = {
    add: jest.fn(),
    update: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    delete: jest.fn(),
  };

  const mockAuthenticatedRequest = {
    user: { id: new Types.ObjectId() },
  };

  const mockRequest = {
    id: new Types.ObjectId(),
    description: 'Lab session for TP1',
    status: RequestStatuses.PENDING,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        {
          provide: RequestService,
          useValue: mockRequestService,
        },
      ],
    }).compile();

    controller = module.get<RequestController>(RequestController);
    service = module.get<RequestService>(RequestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add', () => {
    it('should call service.add and return the result', async () => {
      mockRequestService.add.mockResolvedValue(mockRequest);

      const result = await controller.add(
        mockRequest as any,
        mockAuthenticatedRequest as any,
      );

      expect(service.add).toHaveBeenCalledWith(
        mockAuthenticatedRequest.user.id,
        mockRequest,
      );
      expect(result).toEqual(mockRequest);
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      mockRequestService.update.mockResolvedValue(mockRequest);

      const result = await controller.update(
        { id: mockRequest.id },
        mockRequest as any,
      );

      expect(service.update).toHaveBeenCalledWith(mockRequest.id, mockRequest);
      expect(result).toEqual(mockRequest);
    });
  });

  describe('get', () => {
    it('should call service.get and return the result', async () => {
      mockRequestService.get.mockResolvedValue(mockRequest);

      const result = await controller.get({ id: mockRequest.id });

      expect(service.get).toHaveBeenCalledWith(mockRequest.id);
      expect(result).toEqual(mockRequest);
    });
  });

  describe('getAll', () => {
    it('should call service.getAll and return the result', async () => {
      const mockRequests = [mockRequest];
      mockRequestService.getAll.mockResolvedValue(mockRequests);

      const result = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockRequests);
    });
  });

  describe('getStatuses', () => {
    it('should return request statuses', () => {
      const result = controller.getStatuses();
      expect(result).toEqual(RequestStatuses);
    });
  });

  describe('getLabs', () => {
    it('should return lab constants', () => {
      const result = controller.getLabs();
      expect(result).toEqual(Labs);
    });
  });

  describe('delete', () => {
    it('should call service.delete and return the result', async () => {
      mockRequestService.delete.mockResolvedValue(true);

      const result = await controller.delete(mockAuthenticatedRequest as any, {
        id: mockRequest.id,
      });

      expect(service.delete).toHaveBeenCalledWith(
        mockRequest.id,
        mockAuthenticatedRequest.user.id,
      );
      expect(result).toEqual(true);
    });
  });
});
