import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { Nutrition_Goals } from '../entities/Nutrition_Goals.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateNutritionGoalDto,
  UpdateNutritionGoalDto,
} from '../dtos/Nutrition_Goals.dto';

@Injectable()
export class NutritionsService {
  constructor(
    @InjectRepository(Nutrition_Goals)
    private readonly nutritionGoalsRepository: Repository<Nutrition_Goals>,
  ) {}
  async findAll(): Promise<Nutrition_Goals[]> {
    const nutritionGoals = await this.nutritionGoalsRepository.find();
    return nutritionGoals;
  }

    async create(data: CreateNutritionGoalDto) {
        const existingNutritionGoal = await this.nutritionGoalsRepository.findOne({
            where: { name: data.name },
        });
        if (existingNutritionGoal) {
            throw new ConflictException(
                `Nutrition Goal with name ${data.name} already exists`,
            );
        }
        const newNutritionGoal = this.nutritionGoalsRepository.create(data);
        return this.nutritionGoalsRepository.save(newNutritionGoal);
    }
}
