import { Types } from 'mongoose';
import {
  cantCreateEquipment,
  cantGetEquipment,
  cantGetEquipmentById,
  cantUpdateEquipment,
  cantDeleteEquipment,
} from '../equipment.errors';

describe('Equipment Errors', () => {
  const mockId = new Types.ObjectId();
  const mockReason = 'Some error occurred';

  describe('cantCreateEquipment', () => {
    it('should return the correct message for create error', () => {
      const result = cantCreateEquipment(mockReason);
      expect(result).toBe(`Cannot create Equipment. Reason: ${mockReason}`);
    });
  });

  describe('cantGetEquipment', () => {
    it('should return the correct message for get error', () => {
      const result = cantGetEquipment(mockReason);
      expect(result).toBe(`Cannot get equipments. Reason: ${mockReason}`);
    });
  });

  describe('cantGetEquipmentById', () => {
    it('should return the correct message for get by id error', () => {
      const result = cantGetEquipmentById(mockId, mockReason);
      expect(result).toBe(
        `Cannot get equipment with id ${mockId}. Reason: ${mockReason}`,
      );
    });
  });

  describe('cantUpdateEquipment', () => {
    it('should return the correct message for update error', () => {
      const result = cantUpdateEquipment(mockId, mockReason);
      expect(result).toBe(
        `Cannot update equipment with id ${mockId}. Reason: ${mockReason}`,
      );
    });
  });

  describe('cantDeleteEquipment', () => {
    it('should return the correct message for delete error', () => {
      const result = cantDeleteEquipment(mockId, mockReason);
      expect(result).toBe(
        `Cannot delete equipment with id ${mockId}. Reason: ${mockReason}`,
      );
    });
  });
});
