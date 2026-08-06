import { IsString, IsNotEmpty, IsInt, } from 'class-validator';
export class CreateNutritionPlanDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
  @IsInt()
  nutritionGoalsId!: number;
}

export class UpdateNutritionPlanDto extends CreateNutritionPlanDto {}