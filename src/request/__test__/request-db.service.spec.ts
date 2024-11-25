import { Test, TestingModule } from '@nestjs/testing';
import { RequestDbService } from '../request-db.service';
import { getModelToken } from '@nestjs/mongoose';
import { Request } from '../../schemas/request.schema';
import { Types } from 'mongoose';
import { UpdateRequestDto } from '../request.dto';
import {
  cantCreateRequest,
  cantDelete,
  cantGet,
  cantGetRequests,
  cantUpdate,
} from '../request.error';
import { RequestStatuses } from '../request.const';

describe('RequestDbService', () => {
  let service: RequestDbService;
  let requestModel: any;

  const mockRequest: Request = {
    requestantUser: new Types.ObjectId(),
    assignedUser: new Types.ObjectId(),
    status: RequestStatuses.PENDING,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week later
    studentsAmount: 30,
    groupsAmount: 5,
    subject: 'Chemistry',
    tpNumber: 10,
    description: 'Chemistry lab request for TP10.',
    lab: 'MA101',
    observations: 'Handle with care',
    messages: new Types.ObjectId(),
    equipments: [
      {
        id: new Types.ObjectId(),
        amount: 10,
        missingAmount: 2,
      },
    ],
    reactives: [
      {
        id: new Types.ObjectId(),
        amount: 5,
        missingAmount: 1,
        unitMeasure: 'ml',
        quality: 'molec',
        concentrationType: 'puro',
        concentrationAmount: '95%',
        solvents: [
          {
            name: 'agua',
            description: 'Distilled water',
          },
        ],
      },
    ],
    materials: [
      {
        id: new Types.ObjectId(),
        amount: 20,
        missingAmount: 3,
      },
    ],
    isCompleted: jest.fn().mockReturnValue(false),
    isRejected: jest.fn().mockReturnValue(false),
    isExpired: jest.fn().mockReturnValue(false),
    updateExpiration: jest.fn(),
  };

  const mockId = new Types.ObjectId();

  const mockRequestDocument = {
    ...mockRequest,
    _id: mockId,
    save: jest.fn(),
  };

  const mockUpdateRequestDto: UpdateRequestDto = {
    ...mockRequest,
    status: RequestStatuses.APPROVED,
  };

  const requestModelMock = {
    create: jest.fn(),
    updateOne: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestDbService,
        {
          provide: getModelToken(Request.name),
          useValue: requestModelMock,
        },
      ],
    }).compile();

    service = module.get<RequestDbService>(RequestDbService);
    requestModel = module.get(getModelToken(Request.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should create a new request', async () => {
      requestModel.create.mockResolvedValue(mockRequestDocument);

      const result = await service.add(mockRequest.requestantUser, mockRequest);

      expect(requestModel.create).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockRequestDocument._id);
    });

    it('should return an error if creation fails', async () => {
      const error = new Error('Creation failed');
      requestModel.create.mockRejectedValue(error);

      await expect(
        service.add(requestModel.requestantUser, mockRequest),
      ).rejects.toEqual(cantCreateRequest(error));
    });
  });

  describe('update', () => {
    it('should update an existing request by ID', async () => {
      requestModel.updateOne.mockResolvedValue(undefined);

      await service.update(mockId, mockUpdateRequestDto);

      expect(requestModel.updateOne).toHaveBeenCalledWith(
        { _id: mockId },
        mockUpdateRequestDto,
      );
    });

    it('should return an error if updating fails', async () => {
      const error = new Error('Update failed');
      requestModel.updateOne.mockRejectedValue(error);

      await expect(
        service.update(mockId, mockUpdateRequestDto),
      ).rejects.toEqual(cantUpdate(mockId, error));
    });
  });

  describe('get', () => {
    it('should return a request by ID', async () => {
      requestModel.findOne.mockResolvedValue(mockRequest);

      const result = await service.get(mockId);

      expect(requestModel.findOne).toHaveBeenCalledWith({
        _id: mockId,
      });
      expect(result).toEqual(mockRequest);
    });

    it('should return an error if fetching fails', async () => {
      const error = new Error('Get failed');
      requestModel.findOne.mockRejectedValue(error);

      await expect(service.get(mockId)).rejects.toEqual(cantGet(mockId, error));
    });
  });

  describe('getAll', () => {
    it('should return all requests', async () => {
      requestModel.find.mockResolvedValue([mockRequest]);

      const result = await service.getAll();

      expect(requestModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual([mockRequest]);
    });

    it('should return requests filtered by status', async () => {
      requestModel.find.mockResolvedValue([mockRequest]);

      const result = await service.getAll(RequestStatuses.PENDING);

      expect(requestModel.find).toHaveBeenCalledWith({
        status: RequestStatuses.PENDING,
      });
      expect(result).toEqual([mockRequest]);
    });

    it('should return an error if fetching fails', async () => {
      const error = new Error('Get all failed');
      requestModel.find.mockRejectedValue(error);

      await expect(service.getAll()).rejects.toEqual(cantGetRequests(error));
    });
  });

  describe('delete', () => {
    const deletedBy = new Types.ObjectId();

    it('should soft delete a request', async () => {
      mockRequestDocument.save.mockResolvedValue(true);

      await service.delete(mockRequestDocument as any, deletedBy);

      expect(mockRequestDocument.save).toHaveBeenCalled();
    });

    it('should throw an error if delete fails', async () => {
      const error = new Error('Failed to save');
      mockRequestDocument.save.mockRejectedValue(error);

      await expect(
        service.delete(mockRequestDocument as any, deletedBy),
      ).rejects.toEqual(cantDelete(mockId, error));
    });
  });
});
