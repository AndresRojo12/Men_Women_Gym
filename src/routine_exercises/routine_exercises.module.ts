import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineExercise } from '../routine_exercises/entities/Routine_Exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoutineExercise])],
  controllers: [],
  providers: [],
})
export class RoutineExercisesModule {}
