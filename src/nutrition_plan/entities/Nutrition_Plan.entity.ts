import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Nutrition_Goals } from '../../nutritions/entities/Nutrition_Goals.entity';
import { NutritionPlanItem } from '../../nutrition_plan_items/entities/Nutrition_Plan_Items.entity';

@Entity('nutrition_plans')
export class Nutrition_Plan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @ManyToOne(
    () => Nutrition_Goals,
    (nutritionGoals) => nutritionGoals.nutritionPlans,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'nutrition_goal_id' })
  nutritionGoals!: Nutrition_Goals;

  @OneToMany(
    () => NutritionPlanItem,
    (item) => item.plan,
  )
  items!: NutritionPlanItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}