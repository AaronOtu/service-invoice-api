import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Role } from 'src/enum/role.enum';
import { Roles } from 'src/enum/roles.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/role.guard';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';

@Controller('api')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }


  @Post('employee/register')
  registerEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.registerEmployee(createEmployeeDto);
  }
  @Post('employee/login')
  loginEmployee(@Body() { email, password }: Pick<CreateEmployeeDto, 'email' | 'password'>) {
    return this.employeesService.loginEmployee(email, password);
  }

  @Get('employee')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getAllEmployee(@Request() req: any) {
    console.log('Authenticated User:', req.user);
    return this.employeesService.getAllEmployee();
  }

  @Get('employee/:id')
  getEmployeeProfile(@Param('id') id: string) {
    return this.employeesService.getEmployeeProfile(id);
  }

  @Patch('employee/:id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete('employee/:id')
  removeEmployee(@Param('id') id: string) {
    return this.employeesService.removeEmployee(id);
  }
}
