import { Controller, Get, Post, ParseIntPipe, Delete, Put, Param, Body } from '@nestjs/common';
import { RoutinesService } from '../services/routines.service';
import { CreateRoutineDto, UpdateRoutineDto } from '../dtos/Routine.dto';

@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Get()
  findAll() {
    return this.routinesService.findAll();
  }

  @Post()
  create(@Body() data: CreateRoutineDto) {
    return this.routinesService.create(data);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.routinesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRoutineDto,
  ) {
    return this.routinesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.routinesService.remove(id);
  }
}