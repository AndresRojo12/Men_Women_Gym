import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routine } from './entities/routine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Routine])],
})
export class RoutinesModule {}
