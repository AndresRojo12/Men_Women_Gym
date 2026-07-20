import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';

  import { Nutrition_Plan } from '../../nutrition_plan/entities/Nutrition_Plan.entity';
  
  @Entity()
  export class Nutrition_Goals {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ unique: true })
    name!: string;
  
    @Column()
    description!: string;
  
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    @OneToMany(() => Nutrition_Plan, (nutritionPlan) => nutritionPlan.nutritionGoals)
    nutritionPlans!: Nutrition_Plan[];
}