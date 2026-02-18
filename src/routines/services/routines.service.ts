import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(): Promise<Routine[]> {
    return await this.routinesRepository.find();
  }

  async create(data: CreateRoutineDto) {
    const existingRoutine = await this.routinesRepository.findOne({
      where: { name: data.name },
    });
    if (existingRoutine) {
      throw new ConflictException(
        `Routine with name ${data.name} already exists`,
      );
    }
    const newRoutine = this.routinesRepository.create(data);

    return await this.routinesRepository.save(newRoutine);
  }

  async findOne(id: number) {
    const routine = await this.routinesRepository.findOneBy({ id });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    return routine;
  }

    async update(id: number, data: UpdateRoutineDto) {
    const routine = await this.routinesRepository.findOneBy({ id });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    const updatedRoutine = this.routinesRepository.merge(routine, data);
    return await this.routinesRepository.save(updatedRoutine);
  }
  
  async remove(id: number) {
    const routine = await this.routinesRepository.findOneBy({ id });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    await this.routinesRepository.delete(id);
    return { message: `Routine with id ${id} has been removed` };
  }
}
