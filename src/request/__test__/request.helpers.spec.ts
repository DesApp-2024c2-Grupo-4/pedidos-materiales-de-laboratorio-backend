import { BackendException } from '../../shared/backend.exception';
import { checkItemsAvailability } from '../request.helpers';
import { EquipmentdbService } from '../../equipment/equipment-db.service';
import { ReactiveDbService } from '../../reactive/reactive-db.service';
import { MaterialDbService } from '../../material/material-db.service';

import { Types } from 'mongoose';

describe('Request Helpers', () => {
  let mockEquipmentDbService: Partial<EquipmentdbService>;
  let mockReactiveDbService: Partial<ReactiveDbService>;
  let mockMaterialDbService: Partial<MaterialDbService>;

  let mockRequest: {
    equipments: { id: Types.ObjectId; amount: number }[];
    materials: { id: Types.ObjectId; amount: number }[];
    reactives: { id: Types.ObjectId; amount: number }[];
  };

  beforeEach(() => {
    // Mock services
    mockEquipmentDbService = {
      getAll: jest.fn(),
    };
    mockReactiveDbService = {
      getAll: jest.fn(),
    };
    mockMaterialDbService = {
      getAll: jest.fn(),
    };

    // Initialize a reusable mock request
    mockRequest = {
      equipments: [{ id: new Types.ObjectId(), amount: 2 }],
      materials: [{ id: new Types.ObjectId(), amount: 5 }],
      reactives: [{ id: new Types.ObjectId(), amount: 3 }],
    };
  });

  describe('checkItemsAvailability', () => {
    it('should return available: true when all items are available', async () => {
      mockEquipmentDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.equipments[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);
      mockMaterialDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.materials[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);
      mockReactiveDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.reactives[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);

      const result = await checkItemsAvailability(
        mockRequest as any,
        mockEquipmentDbService as EquipmentdbService,
        mockReactiveDbService as ReactiveDbService,
        mockMaterialDbService as MaterialDbService,
      );

      expect(result).toEqual({ available: true });
    });

    it('should return available: true when an entity is not required any item', async () => {
      mockEquipmentDbService.getAll = jest.fn().mockResolvedValue([]);
      mockMaterialDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.materials[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);
      mockReactiveDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.reactives[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);

      const result = await checkItemsAvailability(
        { ...mockRequest, equipments: [] } as any,
        mockEquipmentDbService as EquipmentdbService,
        mockReactiveDbService as ReactiveDbService,
        mockMaterialDbService as MaterialDbService,
      );

      expect(result).toEqual({ available: true });
    });

    it('should throw a BackendException if fetching equipment fails', async () => {
      mockEquipmentDbService.getAll = jest.fn().mockRejectedValue('Error');

      await expect(
        checkItemsAvailability(
          mockRequest as any,
          mockEquipmentDbService as EquipmentdbService,
          mockReactiveDbService as ReactiveDbService,
          mockMaterialDbService as MaterialDbService,
        ),
      ).rejects.toThrow(BackendException);
    });

    it('should throw a BackendException if fetching materials fails', async () => {
      mockEquipmentDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.equipments[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);
      mockMaterialDbService.getAll = jest.fn().mockRejectedValue('Error');

      await expect(
        checkItemsAvailability(
          mockRequest as any,
          mockEquipmentDbService as EquipmentdbService,
          mockReactiveDbService as ReactiveDbService,
          mockMaterialDbService as MaterialDbService,
        ),
      ).rejects.toThrow(BackendException);
    });

    it('should throw a BackendException if fetching reactives fails', async () => {
      mockEquipmentDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.equipments[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);
      mockMaterialDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.materials[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);
      mockReactiveDbService.getAll = jest.fn().mockRejectedValue('Error');

      await expect(
        checkItemsAvailability(
          mockRequest as any,
          mockEquipmentDbService as EquipmentdbService,
          mockReactiveDbService as ReactiveDbService,
          mockMaterialDbService as MaterialDbService,
        ),
      ).rejects.toThrow(BackendException);
    });

    it('should return available: false if one or more materials are unavailable', async () => {
      mockEquipmentDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.equipments[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);
      mockMaterialDbService.getAll = jest.fn().mockResolvedValue([]); // No materials available
      mockReactiveDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.reactives[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);

      const result = await checkItemsAvailability(
        mockRequest as any,
        mockEquipmentDbService as EquipmentdbService,
        mockReactiveDbService as ReactiveDbService,
        mockMaterialDbService as MaterialDbService,
      );

      expect(result).toEqual({
        available: false,
        err: 'One or more materials are not available',
      });
    });

    it('should return available: false if one or more reactives are unavailable', async () => {
      mockEquipmentDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.equipments[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);
      mockMaterialDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.materials[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);
      mockReactiveDbService.getAll = jest.fn().mockResolvedValue([]); // No reactives available

      const result = await checkItemsAvailability(
        mockRequest as any,
        mockEquipmentDbService as EquipmentdbService,
        mockReactiveDbService as ReactiveDbService,
        mockMaterialDbService as MaterialDbService,
      );

      expect(result).toEqual({
        available: false,
        err: 'One or more reactives are not available',
      });
    });

    it('should return available: false if one or more equipments are unavailable', async () => {
      mockEquipmentDbService.getAll = jest.fn().mockResolvedValue([]); // No equipment available
      mockMaterialDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.materials[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);
      mockReactiveDbService.getAll = jest.fn().mockResolvedValue([
        {
          _id: mockRequest.reactives[0].id,
          hasEnoughStockAvailable: () => true,
        },
      ]);

      const result = await checkItemsAvailability(
        mockRequest as any,
        mockEquipmentDbService as EquipmentdbService,
        mockReactiveDbService as ReactiveDbService,
        mockMaterialDbService as MaterialDbService,
      );

      expect(result).toEqual({
        available: false,
        err: 'One or more equipments are not available',
      });
    });
  });
});
