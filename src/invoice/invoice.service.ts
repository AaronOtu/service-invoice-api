import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/admin/schemas/admin.schemas';
import { Employee, EmployeeDocument } from 'src/employees/schemas/employee.schemas';
import { Inventory, InventoryDocument } from 'src/inventory/schemas/inventory.schemas';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoiceDocument, InvoiceItem } from './schemas/invoice.schemas';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(InvoiceItem.name) private invoiceItemModel: Model<InvoiceItem>,
    @InjectModel(Inventory.name) private inventoryModel: Model<InventoryDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) { }

  async createInvoice(createInvoiceDto: CreateInvoiceDto) {
    try {
      const { items, userId } = createInvoiceDto;

      let totalQuantity = 0;
      let totalCost = 0;
      const savedInvoiceItems = [];

      // Process each item and create invoice items
      for (const itemDto of items) {
        const inventoryItem = await this.inventoryModel.findById(itemDto.inventoryItem);

        if (!inventoryItem) {
          throw new NotFoundException(`Inventory item with ID ${itemDto.inventoryItem} not found`);
        }

        if (inventoryItem.quantity < itemDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantity}, Requested: ${itemDto.quantity}`
          );
        }

        // Create and save invoice item
        const invoiceItem = await this.invoiceItemModel.create({
          inventoryItem: inventoryItem._id,
          quantity: itemDto.quantity,
          cost: inventoryItem.cost * itemDto.quantity
        });

        // Update inventory quantity
        await this.inventoryModel.findByIdAndUpdate(
          inventoryItem._id,
          { $inc: { quantity: -itemDto.quantity } },
          { new: true }
        );

        savedInvoiceItems.push(invoiceItem._id);
        totalCost += invoiceItem.cost;
        totalQuantity += itemDto.quantity;
      }

      // Find user (admin or employee)
      const admin = await this.adminModel.findById(userId);
      const employee = await this.employeeModel.findById(userId);

      if (!admin && !employee) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Create invoice
      const invoice = await this.invoiceModel.create({
        items: savedInvoiceItems,
        totalCost,
        totalQuantity,
        ...(admin ? { admin: admin._id } : { employee: employee._id })
      });

      // Populate the response
      const populatedInvoice = await invoice.populate([
        {
          path: 'items',
          populate: {
            path: 'inventoryItem',
            select: 'name quantity cost available'
          }
        },
        { path: 'admin', select: 'firstname lastname email' },
        { path: 'employee', select: 'firstname lastname email' }
      ]);

      return {
        success: true,
        message: 'Invoice created successfully',
        invoice: populatedInvoice
      };






    } catch (error) {
      // Rollback in case of error
      // implement a proper rollback mechanism 
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async findAll() {
    return this.invoiceModel
      .find()
      .populate([
        {
          path: 'items',
          populate: {
            path: 'inventoryItem',
            select: 'name quantity cost available'
          }
        },
        { path: 'admin', select: 'firstname lastname email' },
        { path: 'employee', select: 'firstname lastname email' }
      ])
      .exec();
  }

  async findOne(id: string) {
    const invoice = await this.invoiceModel
      .findById(id)
      .populate([
        {
          path: 'items',
          populate: {
            path: 'inventoryItem',
            select: 'name quantity cost available'
          }
        },
        { path: 'admin', select: 'firstname lastname email' },
        { path: 'employee', select: 'firstname lastname email' }
      ])
      .exec();

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.invoiceModel
      .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
      .populate([
        {
          path: 'items',
          populate: {
            path: 'inventoryItem',
            select: 'name quantity cost available'
          }
        },
        { path: 'admin', select: 'firstname lastname email' },
        { path: 'employee', select: 'firstname lastname email' }
      ]);

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async remove(id: string) {
    const invoice = await this.invoiceModel.findByIdAndDelete(id);

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return { success: true, message: 'Invoice deleted successfully' };
  }
}



