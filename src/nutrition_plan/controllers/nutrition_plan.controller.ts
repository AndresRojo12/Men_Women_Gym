import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateNutritionPlanDto,
  UpdateNutritionPlanDto,
} from '../dtos/Nutrion_Plan.dto';
import { NutritionPlanService } from '../services/nutrition_plan.service';

@Controller('nutrition-plan')
export class NutritionPlanController {
  constructor(private readonly nutritionPlanService: NutritionPlanService) {}

  @Post()
  create(@Body() data: CreateNutritionPlanDto) {
    return this.nutritionPlanService.create(data);
  }

  @Get()
  findAll() {
    return this.nutritionPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nutritionPlanService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateNutritionPlanDto) {
    return this.nutritionPlanService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nutritionPlanService.remove(id);
  }
}
