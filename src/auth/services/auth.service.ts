import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}
}
