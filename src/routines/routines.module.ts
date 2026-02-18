import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routine } from './entities/routine.entity';
import { RoutinesService } from './services/routines.service';

@Module({
  imports: [TypeOrmModule.forFeature([Routine])],
  providers: [RoutinesService],
})
export class RoutinesModule {}
