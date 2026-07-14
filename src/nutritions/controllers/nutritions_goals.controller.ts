import { Controller, Get, Post, Param, ParseIntPipe, Body, Put, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { NutritionsGoalsService } from '../services/nutritions_goals.service';
import { CreateNutritionGoalDto } from '../dtos/Nutrition_Goals.dto';


@Controller('nutritions')
export class NutritionsController {
    constructor(private readonly nutritionsService: NutritionsGoalsService) {}

    @Post()
    createNutritionGoal(@Body() data: CreateNutritionGoalDto) {
        return this.nutritionsService.create(data);
    }

    @Get()
    getNutritionGoals() {
        return this.nutritionsService.findAll();
    }
}
