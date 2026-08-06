import { Test, TestingModule } from '@nestjs/testing';
import { NutritionPlanService } from './nutrition_plan.service';

describe('NutritionPlanService', () => {
  let service: NutritionPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutritionPlanService],
    }).compile();

    service = module.get<NutritionPlanService>(NutritionPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
