import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto, LoginAdminDto } from './dto/create-admin.dto';
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
        throw new ConflictException('This Admin already exits')
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
        admin: newAdmin
      }
    }
    catch (error) {
      this.logger.log(error)
      throw error
    }
  }


  async loginAdmin(loginDto: LoginAdminDto) {
    try {

      if (!loginDto.email || !loginDto.password) {
        throw new BadRequestException('Email and password are required');
      }
  
      const admin = await this.adminModel.findOne({email: loginDto.email}).exec();
      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }

      const isMatch = await bcrypt.compare(loginDto.password, admin.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = 
      { 
        id: admin._id, 
        email: admin.email, 
        role: admin.role, 
      };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload,{expiresIn : '7d'})

      this.logger.log(`Admin logged in: ${admin.firstname}. ${admin.email}`);
      this.logger.log("Generated JWT Payload:", payload)
      return {
        success: true,
        message: 'Login Successful',
        admin: {
          id: admin._id,
          firstname: admin.firstname,
          lastname: admin.lastname,
          email: admin.email,
          role: admin.role,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw error
    }

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
      this.logger.log(error)
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
      this.logger.log(error)
      throw error
    }
  }

  async removeAdmin(id: string) {
    try {
      await this.adminModel.findByIdAndDelete(id)
      return {
        message: `Successfully deleted admin`
      }
    } catch (error) {
      this.logger.log(error.message)
      throw new ConflictException('Something went wrong')
    }
  }
}
