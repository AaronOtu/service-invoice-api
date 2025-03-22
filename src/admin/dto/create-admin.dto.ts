import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Role } from "src/enum/role.enum"
export class CreateAdminDto {

@IsNotEmpty()
@IsString()
@ApiProperty({required:true, default:'Aaron'})
firstname:string

@IsNotEmpty()
@IsString()
@ApiProperty({required:true, default: 'Otu'})
lastname:string

@IsNotEmpty()
@IsEmail()
@ApiProperty({required:true, default:'aaronotu@gmail.com' })
email:string

@IsNotEmpty()
@IsString()
@ApiProperty({required:true, default:'password1234'})
password:string

@IsNotEmpty()
@IsString()
@ApiProperty({required:false, default:Role.ADMIN})
role:string

}


export class LoginAdminDto{
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({required:true, default:'aaronotu@gmail.com' })
  email:string
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty({required:true, default:'password1234'})
  password:string
}


export class LogoutAdminDto{
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty({required:true })
  token:string

}