import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards  } from '@nestjs/common';
import { RoutineExercisesService } from '../services/routine_exercises.service';
import { CreateRoutineExerciseDto, UpdateRoutineExerciseDto } from '../dtos/Routine_Exercise.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Add appropriate guards if needed, e.g., JwtAuthGuard   
@Controller('routine-exercises')
export class RoutineExercisesController {
  constructor(private readonly routineExercisesService: RoutineExercisesService) {}

  @Post()
  async create(@Body() data: CreateRoutineExerciseDto) {
    return await this.routineExercisesService.create(data);
  }

  @Get()
  async findAll() {
    return await this.routineExercisesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.routineExercisesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: UpdateRoutineExerciseDto) {
    return await this.routineExercisesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.routineExercisesService.remove(id);
  }
}