import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';

import { Customer } from '../../users/entities/customer.entity';
import { RoutineExercise } from './routine_exercise.entity';

@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.routines)
  customer: Customer;

  @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.routine)
  routineExercises: RoutineExercise[];
}