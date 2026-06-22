import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Exercise } from '../entities/Exercise.entity';
import { Category } from '../../categories/entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExerciseDto, UpdateExerciseDto } from '../dtos/Exercise.dto';
import { buildImageUrl } from '../../common/helpers/image.url.helper';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Exercise[]> {
    const exercises = await this.exercisesRepository.find();

    return exercises.map((exercise) => ({
      ...exercise,
      image: exercise.image ? buildImageUrl('exercises', exercise.image) : undefined,
    }));
  }

  async create(data: CreateExerciseDto) {
    /*const vUnique = this.exercisesRepository.findOne({ where: {name: data.name}, });
    if(!vUnique){
      throw new NotFoundException(`Exercise with name ${data.name} created`);  
      }*/
    const existingExercise = await this.exercisesRepository.findOne({
      where: { name: data.name },
    });
    if (existingExercise) {
      throw new ConflictException(
        `Exercise with name ${data.name} already exists`,
      );
    }
    const category = await this.categoriesRepository.findOne({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with id ${data.categoryId} not found`,
      );
    }
    const newExercise = this.exercisesRepository.create({
      ...data,
      category,
    });

    // }
    //if(newExercise){
    //throw new ConflictException(`Exercise with name ${data.name} already exists`);
    //}
    return await this.exercisesRepository.save(newExercise);
  }

  async findOne(id: number) {
    const exercise = await this.exercisesRepository.findOneBy({ id });

    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return {
      ...exercise,
      image: exercise.image ? buildImageUrl('exercises', exercise.image) : null,
    };
  }

  async update(id: number, changes: UpdateExerciseDto) {
    const exercise = await this.exercisesRepository.findOneBy({ id });
    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }
    this.exercisesRepository.merge(exercise, changes);
    return this.exercisesRepository.save(exercise);
  }

  async remove(id: number) {
    return this.exercisesRepository.delete(id);
  }
}
