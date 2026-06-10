import { Test, TestingModule } from '@nestjs/testing';
import { NutritionsService } from './nutritions.service';

describe('NutritionsService', () => {
  let service: NutritionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutritionsService],
    }).compile();

    service = module.get<NutritionsService>(NutritionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
