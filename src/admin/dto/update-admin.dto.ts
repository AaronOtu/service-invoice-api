import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/enum/admin-user';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsEnum(Role)
  @IsOptional() 
  role?: Role;  

}
