import { Controller, Get, HttpCode, Post, Param, ParseIntPipe, ValidationPipe, Body, Put } from '@nestjs/common';
import { ExercisesService } from '../services/exercises.service';
import { CreateExerciseDto } from '../dtos/Exercise.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private exerciseService: ExercisesService){}
  @Post()
  //@HttpCode(204)
  createExercise(@Body() data: CreateExerciseDto){
    return this.exerciseService.create(data);
  }
  /*createExercise(@Body(new ValidationPipe()) createExerciseDto: CreateExerciseDto,){
    this.exerciseService.create(createExerciseDto)
  }*/

  @Get()
  getExercises(): string {
    return 'List of exercises';
  }

  @Get(':id')
  async findOneExercise(@Param('id', ParseIntPipe) id: number) {
    
    return this.exerciseService.findOne(id);
  }

  @Put(':id')
  async updateExercise(@Param('id', ParseIntPipe) id: number, @Body() changes: CreateExerciseDto) {
    return this.exerciseService.update(id, changes);
  }
}
