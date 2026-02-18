import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Routine } from '../entities/routine.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoutineDto, UpdateRoutineDto } from '../dtos/Routine.dto';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private routinesRepository: Repository<Routine>,
  ) {}
}