import { Module } from '@nestjs/common';
import { NutritionsGoalsService } from './services/nutritions_goals.service';
import { NutritionsController } from './controllers/nutritions_goals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nutrition_Goals } from './entities/Nutrition_Goals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nutrition_Goals])],
  providers: [NutritionsGoalsService],
  controllers: [NutritionsController]
})
export class NutritionsModule {}
