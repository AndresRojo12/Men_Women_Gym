import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dtos/Customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(data: CreateCustomerDto) {
    const newCustomer = this.customerRepository.create(data);
    return await this.customerRepository.save(newCustomer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }
}