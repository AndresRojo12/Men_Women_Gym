import { Test, TestingModule } from '@nestjs/testing';
import { NutritionsController } from './nutritions.controller';

describe('NutritionsController', () => {
  let controller: NutritionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutritionsController],
    }).compile();

    controller = module.get<NutritionsController>(NutritionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
