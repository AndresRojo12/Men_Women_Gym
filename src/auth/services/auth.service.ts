import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../users/dtos/User.dto';
import { Role } from '../roles/rol.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    let role = Role.CUSTOMER;
    //const adminSecret = this.configService.get<string>('ADMIN_SECRET');
    //if (dto.admincode && dto.admincode === process.env.ADMIN_SECRET) {
      //role = Role.ADMIN;
    //}

    // hash de la contraseña antes de guardarla en la base de datos

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      isActive: true,
      role: Role.CUSTOMER,
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) return null;
    // Verificar si el usuario está activo antes de permitir la autenticación
    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }
    
        // hash de la contraseña ingresada y comparación con la contraseña
        // almacenada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      // la singn method de jwtService genera un token JWT con el payload proporcionado
      access_token: this.jwtService.sign(payload),
    };
  }
}
