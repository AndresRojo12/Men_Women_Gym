import { Controller, Post, Request, UseGuards  } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../decorators/public.decoractor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
    @UseGuards(AuthGuard('local'))
    @Public()
    @Post('/login')
    login(@Request() req) {
      return this.authService.login(req.user);
    }
}