import { OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/enum/role.enum';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(

  OmitType(CreateEmployeeDto, ['role', 'password'] as const)) {
  // @IsEnum(Role)
  // @IsOptional()
  // role?: Role;
}
