import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';

import { Nutrition_Goals } from '../entities/Nutrition_Goals.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNutritionGoalDto, UpdateNutritionGoalDto } from '../dtos/Nutrition.dto';

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

