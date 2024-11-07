import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { ReactiveDbService } from '../reactive-db.service';
import { Reactive } from '../../schemas/requestable/reactive.schema';
import { UpdateReactivelDto } from '../../dto/reactive.dto';
import {
  cantCreateReactive,
  cantGetRactives,
  cantGetReactive,
  cantUpdateReactive,
  cantDeleteReactive,
} from '../reactive.errors';
import { IS_SOFT_DELETED_KEY } from '../../schemas/common/soft-delete.schema';

describe('ReactiveDbService', () => {
  let service: ReactiveDbService;
  let model: any;

  const mockReactiveModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockReactive: Reactive = {
    description: 'test-description',
    cas: 'test-cas',
    stock: 50,
    isAvailable: true,
    isSoftDeleted: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactiveDbService,
        {
          provide: getModelToken(Reactive.name),
          useValue: mockReactiveModel,
        },
      ],
    }).compile();

    service = module.get<ReactiveDbService>(ReactiveDbService);
    model = module.get<Model<Reactive>>(getModelToken(Reactive.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should create a new reactive and return its ID', async () => {
      model.create.mockResolvedValue(new Types.ObjectId());

      const result = await service.add(mockReactive);
      expect(isValidObjectId(result)).toBeTruthy();
      expect(mockReactiveModel.create).toHaveBeenCalledWith(mockReactive);
    });

    it('should reject if fails to add', async () => {
      const error = new Error('Cannot add');
      model.create.mockRejectedValue(error);

      await expect(service.add(mockReactive)).rejects.toStrictEqual(
        cantCreateReactive(error),
      );

      expect(mockReactiveModel.create).toHaveBeenCalledWith(mockReactive);
    });
  });

  describe('getAll', () => {
    it('should return all available reactives', async () => {
      const mockReactives = [{ name: 'Reactive1' }, { name: 'Reactive2' }];
      mockReactiveModel.find.mockResolvedValue(mockReactives);

      const result = await service.getAll(true);
      expect(result).toEqual(mockReactives);
    });

    it('should reject if fails to get', async () => {
      const error = new Error('Cannot getAll');
      const available = true;
      model.find.mockRejectedValue(error);

      await expect(service.getAll(available)).rejects.toStrictEqual(
        cantGetRactives(error),
      );
    });
  });

  describe('get', () => {
    it('should return a reactive by ID', async () => {
      const mockReactive = { _id: new Types.ObjectId(), name: 'Test Reactive' };
      mockReactiveModel.findById.mockResolvedValue(mockReactive);

      const result = await service.get(mockReactive._id);
      expect(result).toEqual(mockReactive);
      expect(mockReactiveModel.findById).toHaveBeenCalledWith(mockReactive._id);
    });

    it('should reject if fails to get', async () => {
      const error = new Error('Cannot get');
      const mockReactive = { _id: new Types.ObjectId(), name: 'Test Reactive' };
      model.findById.mockRejectedValue(error);

      await expect(service.get(mockReactive._id)).rejects.toStrictEqual(
        cantGetReactive(mockReactive._id, error),
      );

      expect(mockReactiveModel.findById).toHaveBeenCalledWith(mockReactive._id);
    });
  });

  describe('update', () => {
    it('should update a reactive by ID', async () => {
      const mockId = new Types.ObjectId();
      const updateData: UpdateReactivelDto = {
        description: 'Updated Reactive',
      };
      mockReactiveModel.updateOne.mockResolvedValue({ nModified: 1 });

      await service.update(mockId, updateData);
      expect(mockReactiveModel.updateOne).toHaveBeenCalledWith(
        { _id: mockId },
        updateData,
        { new: true },
      );
    });

    it('should reject if fails to update', async () => {
      const error = new Error('Cannot update');
      const id = new Types.ObjectId();
      model.updateOne.mockRejectedValue(error);

      const updateData: UpdateReactivelDto = {
        description: 'Updated Reactive',
      };

      await expect(service.update(id, updateData)).rejects.toStrictEqual(
        cantUpdateReactive(id, error),
      );

      expect(mockReactiveModel.updateOne).toHaveBeenCalledWith(
        { _id: id },
        updateData,
        { new: true },
      );
    });
  });

  describe('delete', () => {
    const deletedBy = new Types.ObjectId();

    it('should delete a reactive by ID', async () => {
      const mockId = new Types.ObjectId();
      mockReactiveModel.updateOne.mockResolvedValue({});

      await service.delete(mockId, deletedBy);
      const softDelete = {
        [IS_SOFT_DELETED_KEY]: true,
        deletedBy,
        deletionDate: expect.any(Date),
      };

      expect(model.updateOne).toHaveBeenCalledWith(
        { _id: mockId },
        { $set: softDelete },
      );
    });

    it('should reject if fails to delete', async () => {
      const error = new Error('Cannot delete');
      const id = new Types.ObjectId();
      model.updateOne.mockRejectedValue(error);

      await expect(service.delete(id, deletedBy)).rejects.toStrictEqual(
        cantDeleteReactive(id, error),
      );
    });
  });
});
