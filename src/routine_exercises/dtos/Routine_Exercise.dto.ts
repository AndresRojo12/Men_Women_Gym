import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateRoutineExerciseDto {
    @IsInt()
    @IsNotEmpty()
    routineId: number;

    @IsInt()
    @IsNotEmpty()
    exerciseId: number;

    @IsInt()
    @Min(1)
    sets: number;

    @IsInt()
    @Min(1)
    reps: number;

    @IsInt()
    @Min(0)
    restTime: number;

    @IsInt()
    weight: number;
}