import { Module } from '@nestjs/common';
import { NutritionPlanService } from './services/nutrition_plan.service';

@Module({
  providers: [NutritionPlanService]
})
export class NutritionPlanModule {}
