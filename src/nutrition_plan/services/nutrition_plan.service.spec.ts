import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NutritionPlanService } from './nutrition_plan.service';
import { Nutrition_Plan } from '../entities/Nutrition_Plan.entity';
import { Nutrition_Goals } from '../../nutritions/entities/Nutrition_Goals.entity';

describe('NutritionPlanService', () => {
  let service: NutritionPlanService;
  let nutritionPlanRepository: any;
  let nutritionGoalsRepository: any;

  beforeEach(async () => {
    nutritionPlanRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    };

    nutritionGoalsRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NutritionPlanService,
        {
          provide: getRepositoryToken(Nutrition_Plan),
          useValue: nutritionPlanRepository,
        },
        {
          provide: getRepositoryToken(Nutrition_Goals),
          useValue: nutritionGoalsRepository,
        },
      ],
    }).compile();

    service = module.get<NutritionPlanService>(NutritionPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a nutrition plan linked to an existing nutrition goal', async () => {
    const goal = { id: 1, name: 'Weight Loss' };
    const plan = { id: 10, name: 'Plan A', description: 'Test plan' };

    nutritionGoalsRepository.findOne.mockResolvedValue(goal);
    nutritionPlanRepository.create.mockReturnValue(plan);
    nutritionPlanRepository.save.mockResolvedValue({ ...plan, nutritionGoals: goal });

    const result = await service.create({
      name: 'Plan A',
      description: 'Test plan',
      nutritionGoalsId: 1,
    });

    expect(nutritionGoalsRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(nutritionPlanRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Plan A',
        description: 'Test plan',
        nutritionGoals: goal,
      }),
    );
    expect(nutritionPlanRepository.save).toHaveBeenCalledWith(plan);
    expect(result).toEqual({ ...plan, nutritionGoals: goal });
  });
});
