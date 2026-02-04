import { Injectable } from '@nestjs/common';
import { CreateExerciseDto } from '../dtos/Exercise.dto';

@Injectable()
export class ExercisesService {

  create(data: CreateExerciseDto) {
    console.log('Exercise created:', data);
  }
}
