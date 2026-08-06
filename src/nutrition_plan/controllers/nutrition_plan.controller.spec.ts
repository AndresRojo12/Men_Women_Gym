import { Test, TestingModule } from '@nestjs/testing';
import { NutritionPlanController } from './nutrition_plan.controller';

describe('NutritionPlanController', () => {
  let controller: NutritionPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutritionPlanController],
    }).compile();

    controller = module.get<NutritionPlanController>(NutritionPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
