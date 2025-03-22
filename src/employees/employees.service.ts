import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateEmployeeDto,
  LoginEmployeeDto,
} from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from './schemas/employee.schemas';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
    private readonly jwtService: JwtService,
  ) {}

  private generatePassword(): string {
    return crypto.randomBytes(6).toString('hex');
  }

  async registerEmployee(createEmployeeDto: CreateEmployeeDto) {
    try {
      const existingEmployee = await this.employeeModel.findOne({
        email: createEmployeeDto.email,
      });
      if (existingEmployee) {
        throw new ConflictException('This Employee already exist');
      }

      if(createEmployeeDto.role == 'ADMIN'){
        throw new ConflictException('Admin role is not allowed for this user');
      }
      //const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);
      const generatedPassword = this.generatePassword();
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      const newEmployee = new this.employeeModel({
        ...createEmployeeDto,
        password: hashedPassword,
      });
      this.logger.log(newEmployee);
      await newEmployee.save();

      return {
        message: 'Employee successfully created',
        employee: {
          firstname: newEmployee.firstname,
          lastname: newEmployee.lastname,
          email: newEmployee.email,
          role: newEmployee.role,
        },
        password: generatedPassword,
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async loginEmployee(loginDto: LoginEmployeeDto) {
    try {
      if (!loginDto.email || !loginDto.password) {
        throw new BadRequestException('Email and password are required');
      }

      const employee = await this.employeeModel
        .findOne({ email: loginDto.email })
        .exec();
      if (!employee) {
        throw new UnauthorizedException('Employee not found');
      }

      const isMatch = await bcrypt.compare(
        loginDto.password,
        employee.password,
      );
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        id: employee._id,
        email: employee.email,
        role: employee.role,
      };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload);

      this.logger.log(
        `Employee logged in: ${employee.firstname}. ${employee.email}`,
      );
      this.logger.log('Login successful', payload);
      return {
        success: true,
        message: 'Login Successful',
        employee: {
          employeeId: employee._id,
          firstname: employee.firstname,
          lastname: employee.lastname,
          email: employee.email,
          role: employee.role,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      this.logger.log(error.message);

      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(error.message || 'Something went wrong');
    }
  }

  async changePassword(changeDto: ChangePasswordDto) {
    try {
      const employee = await this.employeeModel
        .findOne({ email: changeDto.email })
        .exec();
      if (!employee) {
        throw new NotFoundException('User not found');
      }
   
      /*
      const isPasswordValid = await bcrypt.compare(
        changeDto.oldPassword,
        employee.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid old password');
      }
        */
      const generatedPassword = this.generatePassword();
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      await this.employeeModel
        .updateOne(
          { email: changeDto.email },
          { $set: { password: hashedPassword } },
        )
        .exec();

        this.logger.log(`Password changed for ${employee.email}`)

      return {
        success:true,
        message: `Password changed successfully for ${employee.email}`,
        password: generatedPassword,
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  async getAllEmployee() {
    try {
      const employee = await this.employeeModel.find();
      return {
        message: 'Successfully retrieved all employess',
        employees: employee,
      };
    } catch (error) {
      this.logger.log(error.message);
      throw new ConflictException('Something went wrong');
    }
  }

  async getEmployeeProfile(id: string) {
    try {
      const employee = await this.employeeModel.findById(id).exec();
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
      return {
        message: 'Successfully retrieved employee profile',
        employee: employee,
      };
    } catch (error) {
      this.logger.log(error.message);

      throw error;
    }
  }

  async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const employee = await this.employeeModel
        .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
        .exec();
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
      return {
        message: 'Successfully updated employee profile',
        employee: employee,
      };
    } catch (error) {
      this.logger.log(error.message);
      throw error;
    }
  }

  async removeEmployee(id: string) {
    try {
      const inventory = await this.employeeModel.findByIdAndDelete(id);
      if (!inventory) {
        throw new NotFoundException('Employee not found');
      }

      this.logger.log('Successfully deleted employee');
      return {
        message: 'Successfully deleted employee',
      };
    } catch (error) {
      this.logger.log(error.message);

      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException('Something went wrong');
    }
  }
}
