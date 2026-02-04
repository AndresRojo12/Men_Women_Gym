import { Module } from '@nestjs/common';
import { ExercisesController } from './controller/exercises.controller';
import { ExercisesService } from './services/exercises.service';

@Module({
    imports: [],
    controllers: [ExercisesController],
    providers: [ExercisesService],
})
export class ExercisesModule {}
