import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesController } from './controller/exercises.controller';
import { ExercisesService } from './services/exercises.service';
import { Exercise } from './entities/Exercise.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Exercise])],
    controllers: [ExercisesController],
    providers: [ExercisesService],
})
export class ExercisesModule {}
