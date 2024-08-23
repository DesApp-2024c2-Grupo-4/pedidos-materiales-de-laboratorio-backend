import { Test, TestingModule } from '@nestjs/testing';
import { RegisterServiceService } from '../register.service';

describe('RegisterServiceService', () => {
  let service: RegisterServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterServiceService],
    }).compile();

    service = module.get<RegisterServiceService>(RegisterServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
