import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foods } from './entities/Foods.entity';
import { FoodsService } from './services/foods.service';

@Module({
    imports: [TypeOrmModule.forFeature([Foods])],
    providers: [FoodsService],
    exports: [],
    controllers: [],
})
export class FoodsModule {}
