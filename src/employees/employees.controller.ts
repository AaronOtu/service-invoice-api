import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/enum/role.enum';
import { Roles } from 'src/enum/roles.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/role.guard';
import {
  ChangePasswordDto,
  CreateEmployeeDto,
  LoginEmployeeDto,
} from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/enum/public.decorator';

@ApiBearerAuth('access-token')
@Controller('api')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('employee/register')
  registerEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.registerEmployee(createEmployeeDto);
  }
  @ApiTags('Auth')
  @Public()
  @Post('employee/login')
  loginEmployee(@Body() loginDto: LoginEmployeeDto) {
    return this.employeesService.loginEmployee(loginDto);
  }

  @Get('employee')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getAllEmployee(@Request() req: any) {
    console.log('Authenticated User:', req.user);
    return this.employeesService.getAllEmployee();
  }

  @Post('employee/change-password')
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.employeesService.changePassword(dto);
  }

  @Get('employee/:id')
  getEmployeeProfile(@Param('id') id: string) {
    return this.employeesService.getEmployeeProfile(id);
  }

  @Patch('employee/:id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete('employee/:id')
  removeEmployee(@Param('id') id: string) {
    return this.employeesService.removeEmployee(id);
  }
}
