import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './schemas/admin.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AdminService {
  private logger = new Logger(AdminService.name);
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>, private jwtService: JwtService) { }

  async registerAdmin(createAdminDto: CreateAdminDto) {
    try {
      const existingAdmin = await this.adminModel.findOne({ email: createAdminDto.email }).exec();
      if (existingAdmin) {
        throw new ConflictException('User with this email already exits')
      }
      const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

      const newAdmin = new this.adminModel({
        ...createAdminDto,
        password: hashedPassword,
      })
      this.logger.log(newAdmin)
      await newAdmin.save();
      return {
        message: 'Successfully registered Admin',
        response: newAdmin
      }
    }
    catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


  async loginAdmin(email: string, password: string) {
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: admin.email, role: admin.role, id: admin._id };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Admin logged in: ${admin.email}`);

    return {
      message: 'Login Successful',
      accessToken,
      admin: {
        id: admin._id,
        firstname: admin.firstname,
        lastname: admin.lastname,
        email: admin.email,
        role: admin.role,
      },
    };
  }




  async getAllAdmins() {
    try {

      const admins = await this.adminModel.find();
      return {
        message: 'Successfully returned all admins',
        admins: admins
      }
    }
    catch (error) {
      throw new ConflictException('Something went wrong')
    }
  }

  async getAdminProfile(id) {

    try {
      const admins = await this.adminModel.findById(id).exec();

      if (!admins) {
        throw new NotFoundException('Admin not found')
      }
      return {
        message: "Successfully retrieved admin profile",
        admin: admins
      };
    } catch (error) {
      throw new ConflictException(error.message || 'Something went wrong')
    }
  }

  async updateAdmin(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const admin = await this.adminModel.findByIdAndUpdate(id, updateAdminDto, { new: true }).exec();

      if (!admin) {
        throw new NotFoundException('Admin not found')
      }
      return {
        message: 'Succefully updated admin profile',
        admin: admin
      }
    } catch (error) {
      throw new ConflictException(error.message || 'Something went wrong')
    }
  }

  async removeAdmin(id: string) {
    try {
      await this.adminModel.findByIdAndDelete(id)
      return {
        message: `Successfully deleted admin`
      }
    } catch (error) {

    }
  }
}
