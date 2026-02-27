import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Customer } from './entities/customer.entity';
import { UsersService } from './services/users.service';
import { CustomerService } from './services/customer.service';
import { UsersController } from './controllers/users.controller';
import { CustomerController } from './controllers/customer.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Customer])],
    providers: [UsersService, CustomerService],
    controllers: [UsersController, CustomerController],
    exports: [UsersService]
})
export class UsersModule {}
