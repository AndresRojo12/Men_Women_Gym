import { Controller, Get, HttpCode, Post, Param, ParseIntPipe, ValidationPipe, Body } from '@nestjs/common';
import { ExercisesService } from '../services/exercises.service';
import { CreateExerciseDto } from '../dtos/Exercise.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private exerciseService: ExercisesService){}
  @Post()
  @HttpCode(204)
  createExercise(@Body(new ValidationPipe()) createExerciseDto: CreateExerciseDto,){
    this.exerciseService.create(createExerciseDto)
  }

  @Get()
  getExercises(): string {
    return 'List of exercises';
  }

  @Get(':id')
  async findOneExercise(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    return `This action returns a #${id} exercise`;
  }
}
