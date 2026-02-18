import { IsString } from "class-validator";

export class CreateRoutineDto {
  @IsString()
  name: string;
  
  @IsString()
  description: string;
}

export class UpdateRoutineDto extends CreateRoutineDto {}