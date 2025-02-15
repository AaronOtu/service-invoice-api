import { BadGatewayException, BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateEmployeeDto, LoginEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from './schemas/employee.schemas';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  private logger = new Logger(EmployeesService.name);
  constructor(@InjectModel(Employee.name) private employeeModel: Model<Employee>, private jwtService: JwtService) { }



  async registerEmployee(createEmployeeDto: CreateEmployeeDto) {
    try {

      const existingEmployee = await this.employeeModel.findOne({ email: createEmployeeDto.email });
      if (existingEmployee) {
        throw new ConflictException('This Employee already exist')
      }
      const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10)
      const newEmployee = new this.employeeModel(
        {
          ...createEmployeeDto,
          password: hashedPassword
        }
      )
      this.logger.log(newEmployee)
      await newEmployee.save();

      return {
        message: "Employee successfully created",
        employee: newEmployee
      }

    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message)
    }

  }

  async loginEmployee(loginDto:LoginEmployeeDto) {
    try {

      if (!loginDto.email || !loginDto.password) {
        throw new BadRequestException('Email and password are required');
      }
  
      const employee = await this.employeeModel.findOne({ email: loginDto.email }).exec();
      if (!employee) {
        throw new UnauthorizedException('Employee not found')
      }

      const isMatch = await bcrypt.compare(loginDto.password, employee.password)
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = 
      { 
        id: employee._id, 
        email: employee.email,
        role: employee.role,
      }
      const accessToken = this.jwtService.sign(payload);

      return {
        message: "Login Successful",
        accessToken: accessToken,
        employee: {
          employeeId: employee._id,
          firstname: employee.firstname,
          lastname: employee.lastname,
          email: employee.email,
          role: employee.role,
        }

      };

    } catch (error) {
      this.logger.log(error.message)

      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(error.message || 'Something went wrong')
    }
  }


  async getAllEmployee() {
    try {
      const employee = await this.employeeModel.find();
      return {
        message: 'Successfully retrieved all employess',
        employees: employee
      }
    } catch (error) {
      this.logger.log(error.message)
      throw new ConflictException('Something went wrong')
    }

  }



  async getEmployeeProfile(id: string) {
    try {
      const employee = await this.employeeModel.findById(id).exec();
      if(!employee){
        throw new NotFoundException('Employee not found')
      }
      return {
        message: 'Successfully retrieved employee profile',
        employee:employee

      };
    } catch (error) {
      this.logger.log(error.message)
     
      throw error
      
    }
  }

  async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const employee = await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto,{new:true}).exec();
      if(!employee){
        throw new NotFoundException('Employee not found')
      }
      return{
        message: 'Successfully updated employee profile',
        employee:employee
      }
      
    } catch (error) {
      this.logger.log(error.messag)
      throw error
      
    }

  }

  async removeEmployee(id: string) {
    try {
   const inventory = await this.employeeModel.findByIdAndDelete(id)
   if(!inventory){
    throw new NotFoundException('Employee not found')
   }

   return{
    message: 'Successfully deleted employee'
   }

    } catch (error) {
      this.logger.log(error.message)

      if(error instanceof HttpException) {
        throw error
      }
      throw new ConflictException('Something went wrong')
  }
}
}
