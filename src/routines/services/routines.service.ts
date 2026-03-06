import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Routine } from '../entities/routine.entity';
import { Customer } from 'src/users/entities/customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoutineDto, UpdateRoutineDto } from '../dtos/Routine.dto';
import { use } from 'passport';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private routinesRepository: Repository<Routine>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<Routine[]> {
    return await this.routinesRepository.find();
  }

  // traer rutinas del cliente logueado
  async findMyRoutines(userId: number) {
    return await this.routinesRepository.findOne({
      where: {
        customer: { 
          user: { id: userId },
         },
      },
      relations: ['customer', 'routineExercises', 'routineExercises.exercise'
      ],
    })
  }

  async create( userId: number, data: CreateRoutineDto) {
    const customer = await this.customerRepository.findOne({
      where: { user: { id: userId } },
      relations: ['routines'],
    });
    if (!customer) {
      throw new NotFoundException('Customer profile not found for the user');
    }

    // impedir rutina con mismo nombre para un mismo cliente
    const existingRoutine = await this.routinesRepository.findOne({
      where: { name: data.name, customer: { id: customer.id } },
    });

    if (existingRoutine) {
      throw new ConflictException(`Routine with name "${data.name}" already exists`);
    }
    
    const newRoutine = this.routinesRepository.create({ ...data, customer });
    return await this.routinesRepository.save(newRoutine);
  }

  async findOne(id: number) {
    const routine = await this.routinesRepository.findOneBy({ id });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    return routine;
  }

    async update(id: number, data: UpdateRoutineDto) {
    const routine = await this.routinesRepository.findOneBy({ id });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    const updatedRoutine = this.routinesRepository.merge(routine, data);
    return await this.routinesRepository.save(updatedRoutine);
  }
  
  async remove(id: number) {
    const routine = await this.routinesRepository.findOneBy({ id });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    await this.routinesRepository.delete(id);
    return { message: `Routine with id ${id} has been removed` };
  }
}
