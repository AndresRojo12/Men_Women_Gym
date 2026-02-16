import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesController } from './controller/exercises.controller';
import { ExercisesService } from './services/exercises.service';
import { Exercise } from './entities/Exercise.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Exercise, Category])],
    controllers: [ExercisesController],
    providers: [ExercisesService],
})
export class ExercisesModule {}
