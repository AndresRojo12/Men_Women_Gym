import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../../auth/roles/rol.enum';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from '../dtos/User.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      // Solo devuelve los usuarios que están activos
      where: { isActive: true },
    });
  }

  async create(data: Partial<User>) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
      );
    }
    const newUser = this.usersRepository.create(data);
    return await this.usersRepository.save(newUser);
  }

  async createAdmin(dto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.usersRepository.create({
      email: dto.email,
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    });
    return await this.usersRepository.save(newUser);
  }

  async countUsers(): Promise<number> {
    return await this.usersRepository.count();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUser = this.usersRepository.merge(user, data);
    return await this.usersRepository.save(updatedUser);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.isActive = false;
    await this.usersRepository.save(user);
    return { message: `User with id ${id} has been removed or deactivated` };
  }
}
