import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateEmployeeDto {

  @IsNotEmpty()
  @IsString()
  firstname: string

  @IsNotEmpty()
  @IsString()
  lastname: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  role: string
}
