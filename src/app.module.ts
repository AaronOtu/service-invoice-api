import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { AdminModule } from './admin/admin.module';
import { InventoryModule } from './inventory/inventory.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [EmployeesModule, AdminModule, InventoryModule, InvoiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
