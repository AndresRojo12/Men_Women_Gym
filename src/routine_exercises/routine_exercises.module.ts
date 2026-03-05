import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineExercise } from '../routine_exercises/entities/Routine_Exercise.entity';
import { Routine } from '../routines/entities/routine.entity';
import { Exercise } from '../exercises/entities/Exercise.entity';
import { RoutineExercisesService } from './services/routine_exercises.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoutineExercise, Routine, Exercise])],
  controllers: [],
  providers: [RoutineExercisesService],
})
export class RoutineExercisesModule {}
