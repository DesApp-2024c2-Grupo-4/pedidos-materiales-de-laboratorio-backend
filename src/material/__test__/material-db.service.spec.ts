import { Test, TestingModule } from '@nestjs/testing';
import { MaterialDbService } from '../material-db.service';

describe('MaterialDbService', () => {
  let service: MaterialDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialDbService],
    }).compile();

    service = module.get<MaterialDbService>(MaterialDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
