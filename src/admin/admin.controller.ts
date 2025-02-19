import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guard/role.guard';
import { AdminService } from './admin.service';
import { CreateAdminDto, LoginAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/enum/public.decorator';

@Controller('api')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('admin/register')
  registerAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.registerAdmin(createAdminDto);
  }

  @ApiTags('Auth') 
  @Post('admin/login')
  loginAdmin(@Body() loginDto: LoginAdminDto) {
    return this.adminService.loginAdmin(loginDto);
  }

  @Public()
  @Get('admin')
  //@Roles(Role.ADMIN)
  //@UseGuards(AuthGuard, RoleGuard)
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
