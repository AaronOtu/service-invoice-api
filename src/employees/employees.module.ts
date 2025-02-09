import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee, EmployeeSchema } from './schemas/employee.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/guard/auth.constants';


@Module({
  imports: [
    MongooseModule.forFeature([{name:Employee.name, schema:EmployeeSchema}]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
       global:true,
       secret:jwtConstants.secret,
      //secret: process.env.JWT_SECRET || 'my_secret_key', 
      signOptions: { expiresIn: '1h' }, 
    }),
   
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService,],
  exports : [MongooseModule]
})
export class EmployeesModule {}
