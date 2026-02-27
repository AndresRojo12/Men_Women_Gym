import { Controller, Get, Post, Put, Param, ParseIntPipe, Delete, Body } from "@nestjs/common";
import { CustomerService } from "../services/customer.service";
import { CreateCustomerDto } from "../dtos/Customer.dto";

@Controller('customers')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @Get()
    findAll() {
        return this.customerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.customerService.findOne(id);
    }
    
    @Post()
    create(@Body() data: CreateCustomerDto) {
        return this.customerService.create(data);
    }
    
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: CreateCustomerDto) {
        return this.customerService.update(id, data);
    }
    
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.customerService.remove(id);
    }
}

