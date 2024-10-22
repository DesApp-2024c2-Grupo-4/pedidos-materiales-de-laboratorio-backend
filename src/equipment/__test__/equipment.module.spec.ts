import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentModule } from '../equipment.module';
import { EquipmentController } from '../equipment.controller';
import { EquipmentService } from '../equipment.service';
import { getModelToken } from '@nestjs/mongoose';
import { Equipment } from '../../schemas/requestable/equipment.schema';

describe('EquipmentModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [EquipmentModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide the EquipmentController', () => {
    const controller = module.get<EquipmentController>(EquipmentController);
    expect(controller).toBeDefined();
  });

  it('should provide the EquipmentService', () => {
    const service = module.get<EquipmentService>(EquipmentService);
    expect(service).toBeDefined();
  });

  it('should register the Equipment model', () => {
    const model = module.get(getModelToken(Equipment.name));
    expect(model).toBeDefined();
  });
});
