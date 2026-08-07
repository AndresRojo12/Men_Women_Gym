import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateFoodDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  calories!: number;

  @IsNumber()
  protein!: number;

  @IsNumber()
  carbohydrates!: number;

  @IsNumber()
  fats!: number;
}

export class UpdateFoodDto extends CreateFoodDto {}