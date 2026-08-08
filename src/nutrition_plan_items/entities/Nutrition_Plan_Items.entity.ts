import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Nutrition_Plan } from '../../nutrition_plan/entities/Nutrition_Plan.entity';
import { Foods } from '../../foods/entities/Foods.entity';

@Entity('nutrition_plan_items')
export class NutritionPlanItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal' })
  quantity!: number;

  @Column()
  unit!: string;

  @Column()
  mealTime!: string;

  @ManyToOne(
    () => Nutrition_Plan,
    (plan) => plan.items,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'nutrition_plan_id' })
  plan!: Nutrition_Plan;

  @ManyToOne(
    () => Foods,
    (food) => food.planItems,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'food_id' })
  food!: Foods;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}