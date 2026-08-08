import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foods } from './entities/Foods.entity';
import { FoodsService } from './services/foods.service';
import { FoodsController } from './controllers/foods.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Foods])],
    providers: [FoodsService],
    exports: [],
    controllers: [FoodsController],
})
export class FoodsModule {}
