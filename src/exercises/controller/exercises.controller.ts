import { Controller, Get, HttpCode, Post, Param, ParseIntPipe, ValidationPipe, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { ExercisesService } from '../services/exercises.service';
import { CreateExerciseDto } from '../dtos/Exercise.dto';
import { Roles } from '../..//auth/decorators/roles.decorator';
import { Role } from '../../auth/roles/rol.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('exercises')
export class ExercisesController {
  constructor(private exerciseService: ExercisesService){}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  createExercise(@Body() data: CreateExerciseDto){
    return this.exerciseService.create(data);
  }
  
  @Get()
  getExercises() {
    return this.exerciseService.findAll();
  }

  @Get(':id')
  async findOneExercise(@Param('id', ParseIntPipe) id: number) {
    
    return this.exerciseService.findOne(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateExercise(@Param('id', ParseIntPipe) id: number, @Body() changes: CreateExerciseDto) {
    return this.exerciseService.update(id, changes);
  }

  @Delete(':id')
  async deleteExercise(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseService.remove(id);
  }
}
