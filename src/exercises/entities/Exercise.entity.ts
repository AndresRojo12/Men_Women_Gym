import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { RoutineExercise } from '../../routine_exercises/entities/Routine_Exercise.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  level: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.exercises, {
    nullable: false,
  })
  
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(
    () => RoutineExercise,
    (routineExercise) => routineExercise.exercise,
  )
  routineExercises: RoutineExercise[];
}
