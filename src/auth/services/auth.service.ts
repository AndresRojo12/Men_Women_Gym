import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../users/dtos/User.dto';
import { Role } from '../roles/rol.enum';
import th from 'zod/v4/locales/th.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto){
    let role = Role.CUSTOMER;
    if(dto.admincode && dto.admincode === process.env.ADMIN_SECRET){
      role = Role.ADMIN;
    }

    return this.usersService.create({
      email: dto.email,
      password: dto.password,
      isActive: true,
      role,
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async login(user: any) {
    const payload = { email: user.email, sub: user.id};
    return {
      // la singn method de jwtService genera un token JWT con el payload proporcionado
      access_token: this.jwtService.sign(payload),
    };
  }
}
