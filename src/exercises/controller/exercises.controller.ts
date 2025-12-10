import { Controller, Get, HttpCode, Post, Param, ParseIntPipe } from '@nestjs/common';

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
  async findOneExercise(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    return `This action returns a #${id} exercise`;
  }
}
