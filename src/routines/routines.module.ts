import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routine } from './entities/routine.entity';
import { RoutineExercise } from './entities/routine_exercise.entity';
import { Customer } from '../users/entities/customer.entity';
import { RoutinesService } from './services/routines.service';
import { RoutinesController } from './controllers/routines.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Routine, RoutineExercise, Customer])],
  providers: [RoutinesService],
  controllers: [RoutinesController],
})
export class RoutinesModule {}
