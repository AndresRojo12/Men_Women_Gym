import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionPlanService } from './services/nutrition_plan.service';
import { Nutrition_Plan } from './entities/Nutrition_Plan.entity';
import { Nutrition_Goals } from '../nutritions/entities/Nutrition_Goals.entity';
import { NutritionPlanController } from './controllers/nutrition_plan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Nutrition_Plan, Nutrition_Goals])],
  providers: [NutritionPlanService],
  exports: [NutritionPlanService],
  controllers: [NutritionPlanController],
})
export class NutritionPlanModule {}
