import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [ConfigModule.forRoot(), ExercisesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
