import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Nutrition_Goals } from '../../nutritions/entities/Nutrition_Goals.entity';

@Entity()
export class Nutrition_Plan {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column()
  name!: string;
  @Column()
  description!: string;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
  @ManyToOne(
    () => Nutrition_Goals,
    (nutritionGoals) => nutritionGoals.nutritionPlans,
    { nullable: false },
  )
  @JoinColumn({ name: 'nutrition_goals_id' })
  nutritionGoals!: Nutrition_Goals;
}
