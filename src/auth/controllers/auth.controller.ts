import { Body, Controller, Post, Request, UseGuards  } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../decorators/public.decoractor';
import { CreateUserDto } from 'src/users/dtos/User.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

    @Post('/register')
    @Public()
    async register(@Body() dto: CreateUserDto) {
      return this.authService.register(dto);
    }

    @UseGuards(AuthGuard('local'))
    @Public()
    @Post('/login')
    login(@Request() req) {
      return this.authService.login(req.user);
    }

}