import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env`,
    isGlobal: true,
  }), ExercisesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
