import {  IsString, IsNumber } from "class-validator"

export class CreateExerciseDto {
    @IsString()
    name: string;
    @IsString()
    description: string;
    @IsString()
    level: string;
    @IsString()
    image: string;

    @IsNumber()
    categoryId: number;
}

export class UpdateExerciseDto extends CreateExerciseDto {}