import { Injectable, NotFoundException } from '@nestjs/common';
import { Exercise } from '../entities/Exercise.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExerciseDto } from '../dtos/Exercise.dto';

@Injectable()
export class ExercisesService {

  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  findAll(): Promise<Exercise[]> {
    return this.exercisesRepository.find();
  }

  create(data: CreateExerciseDto) {
    const newExercise = this.exercisesRepository.create(data);
    return this.exercisesRepository.save(newExercise);
  }

  async findOne(id: number) {
    const exercise = await this.exercisesRepository.findOneBy({ id });
    if(!exercise){
      throw new NotFoundException(`Exercise with id ${id} not found`);  
    }
    return exercise;
  } 

  async update(id: number, changes: Partial<CreateExerciseDto>) {
    const exercise = await this.exercisesRepository.findOneBy({ id });
    this.exercisesRepository.merge(exercise, changes);
    return this.exercisesRepository.save(exercise);
  }

  async remove(id: number) {
    return this.exercisesRepository.delete(id);
  }
}
