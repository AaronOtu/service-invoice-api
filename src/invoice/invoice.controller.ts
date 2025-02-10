import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('api')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('invoice')
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get('invoice')
  findAll() {
    return this.invoiceService.getAllInvoices();
  }

  @Get('invoice/:id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
  //   return this.invoiceService.updateInvoiceStatus(id, updateInvoiceDto.status);
  // }


@Get('invoice/user/:id')
getUserInvoices(@Param('id') id:string){
  return this.invoiceService.getUserInvoices(id)
}


  @Delete('invoice/:id')
  remove(@Param('id') id: string) {
    return this.invoiceService.deleteInvoice(id);
  }
}
