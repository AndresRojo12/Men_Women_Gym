import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NutritionPlanItem } from '../../nutrition_plan_items/entities/Nutrition_Plan_Items.entity';

@Entity('foods')
export class Foods {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ type: 'decimal' })
  calories!: number;

  @Column({ type: 'decimal' })
  protein!: number;

  @Column({ type: 'decimal' })
  carbohydrates!: number;

  @Column({ type: 'decimal' })
  fats!: number;

  @OneToMany(
    () => NutritionPlanItem,
    (item) => item.food,
  )
  planItems!: NutritionPlanItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}