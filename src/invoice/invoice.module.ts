import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceItem, InvoiceItemSchema, InvoiceSchema } from './schemas/invoice.schemas';
import { InventoryModule } from 'src/inventory/inventory.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { AdminModule } from 'src/admin/admin.module';
import { MaterialRequestModule } from 'src/material-request/material-request.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: InvoiceItem.name, schema: InvoiceItemSchema }
    ]),
    InventoryModule,
    AdminModule,
    EmployeesModule,
    MaterialRequestModule
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService]
})
export class InvoiceModule {}
