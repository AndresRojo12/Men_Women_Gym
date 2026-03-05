import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutineExercise } from '../entities/Routine_Exercise.entity';
import { Routine } from '../../routines/entities/routine.entity';
import { Exercise } from '../../exercises/entities/Exercise.entity';
import { CreateRoutineExerciseDto, UpdateRoutineExerciseDto } from '../dtos/Routine_Exercise.dto';

@Injectable()
export class RoutineExercisesService {
  constructor(
    @InjectRepository(RoutineExercise)
    private routineExerciseRepository: Repository<RoutineExercise>,
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>,
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>
  ) {}

    async create(data: CreateRoutineExerciseDto) {
    const routine = await this.routineRepository.findOneBy({ id: data.routineId  });

    const exercise = await this.exerciseRepository.findOneBy({ id: data.exerciseId });

    if (!routine || !exercise) {
      throw new NotFoundException('Routine or Exercise not found');
    }

    const routineExercise = this.routineExerciseRepository.create({
      routine,
      exercise,
      sets: data.sets,
      reps: data.reps,
      restTime: data.restTime,
      weight: data.weight,
    });

    return await this.routineExerciseRepository.save(routineExercise);
  }

  async findAll() {
    return await this.routineExerciseRepository.find({ relations: ['routine', 'exercise'] });
  }

  async findOne(id: number) {
    const routineExercise = await this.routineExerciseRepository.findOne({
      where: { id },
      relations: ['routine', 'exercise'],
    });

    if (!routineExercise) {
      throw new NotFoundException(`RoutineExercise with ID ${id} not found`);
    }

    return routineExercise;
  }

  async update(id: number, data: UpdateRoutineExerciseDto) {
    const routineExercise = await this.findOne(id);

    if (data.sets !== undefined) routineExercise.sets = data.sets;
    if (data.reps !== undefined) routineExercise.reps = data.reps;
    if (data.restTime !== undefined) routineExercise.restTime = data.restTime;
    if (data.weight !== undefined) routineExercise.weight = data.weight;

    return await this.routineExerciseRepository.save(routineExercise);
  }

  async remove(id: number) {
    const routineExercise = await this.findOne(id);
    await this.routineExerciseRepository.remove(routineExercise);
    return { message: `RoutineExercise with ID ${id} has been removed` };
  }
}