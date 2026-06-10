import { Module } from '@nestjs/common';
import { NutritionsService } from './services/nutritions.service';
import { NutritionsController } from './controllers/nutritions/nutritions.controller';

@Module({
  providers: [NutritionsService],
  controllers: [NutritionsController]
})
export class NutritionsModule {}
