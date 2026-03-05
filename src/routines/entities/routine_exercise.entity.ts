import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exercise } from "../../exercises/entities/Exercise.entity";
import { Routine } from "./routine.entity";

@Entity()
export class RoutineExercise {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Routine, (routine) => routine.routineExercises)
    routine: Routine;

    @ManyToOne(() => Exercise, (exercise) => exercise.routineExercises)
    exercise: Exercise;

    @Column()
    sets: number;

    @Column()
    reps: number;

    @Column({ nullable: true })
    restTime: number; // Rest time in seconds

    @Column({ nullable: true })
    weight: number; // Weight in kg
}