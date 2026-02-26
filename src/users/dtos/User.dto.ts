import { IsEmail, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
   // @IsNotEmpty()
    //@IsString()
    //admincode?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}