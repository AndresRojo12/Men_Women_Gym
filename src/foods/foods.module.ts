import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foods } from './entities/Foods.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Foods])],
    providers: [],
    exports: [],
    controllers: [],
})
export class FoodsModule {}
