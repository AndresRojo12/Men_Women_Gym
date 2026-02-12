import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExercisesModule } from './exercises/exercises.module';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env`,
    isGlobal: true,
  }), ExercisesModule, DatabaseModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
