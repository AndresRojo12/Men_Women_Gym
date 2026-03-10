import {  IsString, IsNumber, IsOptional } from "class-validator"
import { Type } from "class-transformer";

export class CreateExerciseDto {
    @IsString()
    name: string;
    @IsString()
    description: string;
    @IsString()
    level: string;
    @IsString()
    @IsOptional()
    image?: string;
    @Type(() => Number)
    @IsNumber()
    categoryId: number;
}

export class UpdateExerciseDto extends CreateExerciseDto {}