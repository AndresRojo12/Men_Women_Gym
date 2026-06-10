import { Module } from '@nestjs/common';
import { NutritionsService } from './services/nutritions.service';

@Module({
  providers: [NutritionsService]
})
export class NutritionsModule {}
