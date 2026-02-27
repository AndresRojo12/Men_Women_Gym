import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../entities/customer.entity';
import { User } from '../entities/user.entity';
import { CreateCustomerDto } from '../dtos/Customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: number, data: CreateCustomerDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['customer'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // impedir doble perfil de cliente para un mismo usuario
    if (user.customer) {
      throw new NotFoundException(`Customer already exists for user with id ${userId}`);
    }

    const newCustomer = this.customerRepository.create({
      ...data,
      user,
    });
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

  async update(id: number, data: CreateCustomerDto) {
    const customer = await this.findOne(id);
    Object.assign(customer, data);
    return await this.customerRepository.save(customer);
  }

  async remove(id: number) {
    const customer = await this.findOne(id);
    return await this.customerRepository.remove(customer);
  }
}
