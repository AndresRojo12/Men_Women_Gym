import { Module } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';

@Module({
  providers: [CategoriesService]
})
export class CategoriesModule {}
