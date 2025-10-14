import { Controller, Get, HttpCode, Post, Param } from '@nestjs/common';

@Controller('exercises')
export class ExercisesController {
  @Post()
  @HttpCode(204)
  createExercise(): string {
    return 'It Exercise created';
  }
  @Get()
  getExercises(): string {
    return 'List of exercises';
  }

  @Get(':id')
  findOneExercise(@Param('id') id: any): string {
    console.log(id);
    return `This action returns a #${id} exercise`;
  }
}
