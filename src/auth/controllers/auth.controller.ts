import { Controller, Body, Post  } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body() loginDto: any) {
      return this.authService.validateUser(loginDto.email, loginDto.password);
    }
}