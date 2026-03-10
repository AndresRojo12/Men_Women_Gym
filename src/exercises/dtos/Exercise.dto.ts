import {  IsString, IsNumber, IsOptional } from "class-validator"

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

    @IsNumber()
    categoryId: number;
}

export class UpdateExerciseDto extends CreateExerciseDto {}