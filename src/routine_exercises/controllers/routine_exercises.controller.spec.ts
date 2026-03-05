import { Test, TestingModule } from '@nestjs/testing';
import { RoutineExercisesController } from './routine_exercises.controller';

describe('RoutineExercisesController', () => {
  let controller: RoutineExercisesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoutineExercisesController],
    }).compile();

    controller = module.get<RoutineExercisesController>(RoutineExercisesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
