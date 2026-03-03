import {
  Controller,
  Get,
  Post,
  ParseIntPipe,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RoutinesService } from '../services/routines.service';
import { CreateRoutineDto, UpdateRoutineDto } from '../dtos/Routine.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyRoutines(@Request() req) {
    return this.routinesService.findMyRoutines(req.user.id);
  }

  @Get()
  findAll() {
    return this.routinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.routinesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() data: CreateRoutineDto) {
    return this.routinesService.create(req.user.id, data);
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
