import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nutrition_Plan } from '../entities/Nutrition_Plan.entity';
import { Nutrition_Goals } from '../../nutritions/entities/Nutrition_Goals.entity';
import {
  CreateNutritionPlanDto,
  UpdateNutritionPlanDto,
} from '../dtos/Nutrion_Plan.dto';

@Injectable()
export class NutritionPlanService {
  constructor(
    @InjectRepository(Nutrition_Plan)
    private readonly nutritionPlanRepository: Repository<Nutrition_Plan>,
    @InjectRepository(Nutrition_Goals)
    private readonly nutritionGoalsRepository: Repository<Nutrition_Goals>,
  ) {}

  async findAll(): Promise<Nutrition_Plan[]> {
    return this.nutritionPlanRepository.find({
      relations: ['nutritionGoals'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: CreateNutritionPlanDto): Promise<Nutrition_Plan> {
    const nutritionGoal = await this.nutritionGoalsRepository.findOne({
      where: { id: data.nutritionGoalsId },
    });

    if (!nutritionGoal) {
      throw new NotFoundException(
        `Nutrition goal with id ${data.nutritionGoalsId} not found`,
      );
    }

    const nutritionPlan = this.nutritionPlanRepository.create({
      name: data.name,
      description: data.description,
      nutritionGoals: nutritionGoal,
    });

    return this.nutritionPlanRepository.save(nutritionPlan);
  }

  async findOne(id: string): Promise<Nutrition_Plan> {
    const nutritionPlan = await this.nutritionPlanRepository.findOne({
      where: { id },
      relations: ['nutritionGoals'],
    });

    if (!nutritionPlan) {
      throw new NotFoundException(`Nutrition plan with id ${id} not found`);
    }

    return nutritionPlan;
  }

  async update(id: string, data: UpdateNutritionPlanDto): Promise<Nutrition_Plan> {
    const nutritionPlan = await this.nutritionPlanRepository.findOne({
      where: { id },
      relations: ['nutritionGoals'],
    });

    if (!nutritionPlan) {
      throw new NotFoundException(`Nutrition plan with id ${id} not found`);
    }

    const nutritionGoal = await this.nutritionGoalsRepository.findOne({
      where: { id: data.nutritionGoalsId },
    });

    if (!nutritionGoal) {
      throw new NotFoundException(
        `Nutrition goal with id ${data.nutritionGoalsId} not found`,
      );
    }

    this.nutritionPlanRepository.merge(nutritionPlan, {
      name: data.name,
      description: data.description,
      nutritionGoals: nutritionGoal,
    });

    return this.nutritionPlanRepository.save(nutritionPlan);
  }

  async remove(id: string): Promise<void> {
    const result = await this.nutritionPlanRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Nutrition plan with id ${id} not found`);
    }
  }
}