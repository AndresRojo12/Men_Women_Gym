import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/User.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() data: CreateUserDto) {
        return this.usersService.create(data);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
        return this.usersService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }
}