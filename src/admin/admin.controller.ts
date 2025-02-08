import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guard/role.guard';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';


@Controller('api')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('admin/register')
  registerAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.registerAdmin(createAdminDto);
  }


  @Post('admin/login')
  loginAdmin(@Body() { email, password }: Pick<CreateAdminDto, 'email' | 'password'>) {
    return this.adminService.loginAdmin(email, password);
  }


  @Get('admin')
  //@UseGuards(AuthGuard)
  //@Roles(Role.ADMIN)
  getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @Get('admin/:id')
  getAdminProfile(@Param('id') id: string) {
    return this.adminService.getAdminProfile(id);
  }

  @Patch('admin/:id')
  updateAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdmin(id, updateAdminDto);
  }

  @Delete('admin/:id')
  removeAdmin(@Param('id') id: string) {
    return this.adminService.removeAdmin(id);
  }

}
