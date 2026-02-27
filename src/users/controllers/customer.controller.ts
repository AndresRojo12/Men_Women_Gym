import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  Body,
  Request,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dtos/Customer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() data: CreateCustomerDto) {
    return this.customerService.create(req.user.userId, data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateCustomerDto,
  ) {
    return this.customerService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.remove(id);
  }
}
