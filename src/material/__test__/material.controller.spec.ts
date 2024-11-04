import { Test, TestingModule } from '@nestjs/testing';
import { MaterialController } from '../material.controller';
import { MaterialService } from '../material.service';
import { Material } from '../../schemas/requestable/material.schema';
import { UpdateMaterialDto } from '../../dto/material.dto';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../../dto/authenticated-request.dto';

describe('MaterialController', () => {
  let controller: MaterialController;
  let service: MaterialService;

  const mockAuthenticatedRequest = {
    user: {
      id: new Types.ObjectId(),
    },
  } as AuthenticatedRequest;

  const mockMaterialService = {
    add: jest.fn(),
    update: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    delete: jest.fn(),
  };

  const mockMaterial = {
    description: 'Steel Rod',
    unitMeasure: 'kg',
    type: 'Metal',
    stock: 50,
    inRepair: 5,
    isAvailable: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialController],
      providers: [
        {
          provide: MaterialService,
          useValue: mockMaterialService,
        },
      ],
    }).compile();

    controller = module.get<MaterialController>(MaterialController);
    service = module.get<MaterialService>(MaterialService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add', () => {
    it('should call service.add and return the result', async () => {
      const material: Material = {
        ...mockMaterial,
      };
      mockMaterialService.add.mockResolvedValue(material);

      const result = await controller.add(material);

      expect(service.add).toHaveBeenCalledWith(material);
      expect(result).toEqual(material);
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const material: UpdateMaterialDto = {
        ...mockMaterial,
      };
      const id = new Types.ObjectId();
      mockMaterialService.update.mockResolvedValue(material);

      const result = await controller.update({ id }, material);

      expect(service.update).toHaveBeenCalledWith(id, material);
      expect(result).toEqual(material);
    });
  });

  describe('get', () => {
    it('should call service.get and return the result', async () => {
      const material = {
        ...mockMaterial,
      };
      const id = new Types.ObjectId();
      mockMaterialService.get.mockResolvedValue(material);

      const result = await controller.get({ id });

      expect(service.get).toHaveBeenCalledWith(id);
      expect(result).toEqual(material);
    });
  });

  describe('getAll', () => {
    it('should call service.getAll and return the result', async () => {
      const materials = [
        {
          ...mockMaterial,
        },
      ];
      mockMaterialService.getAll.mockResolvedValue(materials);

      const result = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(materials);
    });
  });

  describe('delete', () => {
    it('should call service.delete and return the result', async () => {
      const id = new Types.ObjectId();
      mockMaterialService.delete.mockResolvedValue(true);

      const result = await controller.delete(mockAuthenticatedRequest, { id });

      expect(service.delete).toHaveBeenCalledWith(
        id,
        mockAuthenticatedRequest.user.id,
      );
      expect(result).toEqual(true);
    });
  });
});
