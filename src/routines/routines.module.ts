import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routine } from './entities/routine.entity';
import { RoutinesService } from './services/routines.service';
import { RoutinesController } from './controllers/routines.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Routine])],
  providers: [RoutinesService],
  controllers: [RoutinesController],
})
export class RoutinesModule {}
