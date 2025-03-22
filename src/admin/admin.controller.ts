import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/guard/role.guard';
import { AdminService } from './admin.service';
import {
  CreateAdminDto,
  LoginAdminDto,
  LogoutAdminDto,
} from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/enum/public.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/enum/roles.decorator';
import { Role } from 'src/enum/role.enum';
@ApiBearerAuth('access-token')
@Controller('api')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('admin/register')
  registerAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.registerAdmin(createAdminDto);
  }

  @ApiTags('Auth')
  @Public()
  @Post('admin/login')
  loginAdmin(@Body() loginDto: LoginAdminDto) {
    return this.adminService.loginAdmin(loginDto);
  }

  // @Post('admin/logout')
  // async logoutAdmin(@Body() logoutDto: LogoutAdminDto) {
   

  //   return this.adminService.logoutAdmin(logoutDto);
  // }

  //@Public()
  @Get('admin')
  //@Roles(Role.ADMIN)
  //@UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
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
