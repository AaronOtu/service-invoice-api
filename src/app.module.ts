import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { AdminModule } from './admin/admin.module';
import { InventoryModule } from './inventory/inventory.module';
import { InvoiceModule } from './invoice/invoice.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from './guard/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { MaterialRequestModule } from './material-request/material-request.module';


@Module({

  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/service-invoice-api'),
    AdminModule, EmployeesModule,  InventoryModule, InvoiceModule, MaterialRequestModule,],
  controllers: [AppController],
  providers: [ AppService,],
})
export class AppModule {}
