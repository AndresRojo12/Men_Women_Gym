import { IsEmail, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;
    admincode?: string;
}

export class UpdateUserDto extends CreateUserDto {}