import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from './schemas/invoice.schemas';
import { Admin } from '../admin/schemas/admin.schemas';
import { Employee } from '../employees/schemas/employee.schemas';
import { Inventory } from '../inventory/schemas/inventory.schemas';
import { CreateInvoiceDto, StatusDto } from './dto/create-invoice.dto';
import { Status } from '../enum/invoice.enum';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { MaterialRequest } from 'src/material-request/schemas/material-request.schemas';
import { MaterialStatus } from 'src/enum/material-request.enum';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
   // @InjectModel(MaterialRequest.name) private materialRequestModel: Model<MaterialRequest>
  ) { }

  private async formatInvoiceResponse(invoice: any, includeUserInfo = true) {
    const formattedItems = await Promise.all(invoice.items.map(async (item) => {
      const inventory = await this.inventoryModel.findById(item.inventoryItem);
      return {
        _id: item.inventoryItem.toString(),
        name: item.name,
        quantity: item.quantity,
        cost: item.costPerItem,
        totalCost: item.cost,
        available: inventory?.quantity || 0
      };
    }));

    let userInfo = {};
   /* if (includeUserInfo) {
      const user = await (invoice.userAccount.userType === 'admin'
        ? this.adminModel.findById(invoice.userAccount.adminId)
        : this.employeeModel.findById(invoice.userAccount.employeeId));

        
      if (user) {
        userInfo = {
          name: `${user.firstname} ${user.lastname}`,
          email: user.email,
          role: user.role
        };
      }
    }
      */

    if (includeUserInfo){
      let user;
      if(invoice.userAccount.userType === 'admin'){
        user = await this.adminModel.findById(invoice.userAccount.adminId);
      }
      else{ 
        throw new ConflictException('User is not authorized to perform this action');
      }
      if(user){
        userInfo = {
          name: `${user.firstname} ${user.lastname}`,
          email: user.email,
          role: user.role
        };
      }



    }

    return {
      success: true,
      message: 'Invoice retrieved successfully',
      invoice: {
        _id: invoice._id.toString(),
        userInfo,
        items: formattedItems,
        totalQuantity: invoice.totalQuantity,
        totalCost: invoice.totalCost,
        VAT:invoice.totalCost * 0.125,
        amountPayable: invoice.totalCost + invoice.totalCost * 0.125,
        status: invoice.status,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt
      }
    };
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto) {
    try {
    
      let user = await this.adminModel.findById(createInvoiceDto.userId);
      let userType = 'admin';

      if (!user) {
        user = await this.employeeModel.findById(createInvoiceDto.userId);
        userType = 'employee';
        if (!user) {
          throw new NotFoundException('User not found');
        }
      }

      // const materialRequest = await this.materialRequestModel.findById(createInvoiceDto.materialRequestId)
      // if(!materialRequest){
      //   throw new NotFoundException('Material request not found');
      // }
      
      // if (materialRequest.status !== MaterialStatus.APPROVED) {
      //   throw new BadRequestException('Cannot create an invoice for a non-approved material request');
      // }
  


      // Process items
      const processedItems = [];
      let totalQuantity = 0;
      let totalCost = 0;
      
      for (const item of createInvoiceDto.items) {
        const inventory = await this.inventoryModel.findById(item.inventoryItem);
        if (!inventory) {
          throw new NotFoundException(`Inventory item ${item.inventoryItem} not found`);
        }

        if (inventory.quantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${inventory.name}. Available: ${inventory.quantity}, Requested: ${item.quantity}`
          );
        }


        const itemTotalCost = (item.cost ?? inventory.cost) * item.quantity;
       
        processedItems.push({
          inventoryItem: new Types.ObjectId(item.inventoryItem),
          name: inventory.name,
          costPerItem: item.cost ?? inventory.cost,
          quantity: item.quantity,
          cost: itemTotalCost
        });

        totalQuantity += item.quantity;
        totalCost += itemTotalCost;
      
       
      }

      // Create invoice
      const invoice = await this.invoiceModel.create({
        items: processedItems,
        totalQuantity,
        totalCost,
        userAccount: {
          userType,
          [`${userType}Id`]: user._id,
          firstname: user.firstname,
          lastname: user.lastname
        }
      });
      this.logger.log('Successfully created invoice', invoice)

      return this.formatInvoiceResponse(invoice);
    } catch (error) {
      this.logger.error('Error creating invoice:', error);
      throw error;
    }
  }

  async getInvoices() {
    try {
      const invoices = await this.invoiceModel.find().sort({ createdAt: -1 });

      return {
        success: true,
        message: 'Invoices retrieved successfully',
        invoice: invoices
      };

    }
    catch (error) {
      this.logger.log(error.message)
      throw error
    }

  }

  async getInvoiceById(id: string) {
    try {
      const invoice = await this.invoiceModel.findById(id);
      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      return this.formatInvoiceResponse(invoice);
    } catch (error) {
      this.logger.error('Error retrieving invoice:', error);
      throw error;
    }
  }

  async updateInvoiceStatus(id: string, status: Status) {
    try {
      const invoice = await this.invoiceModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      return this.formatInvoiceResponse(invoice);
    } catch (error) {
      this.logger.error('Error updating invoice status:', error);
      throw error;
    }
  }

  async updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const invoice = await this.invoiceModel.findByIdAndUpdate(id, updateInvoiceDto, { new: true })
      if (!invoice) {
        this.logger.log(`Invoice with id ${invoice}`)
        throw new NotFoundException('Invoice not found')
      }
      this.logger.log(`Successfully updated invoice with id ${invoice}`)
      return {
        success: true,
        message: "Successfully updated invoice",
        invoice: invoice
      }

    }
    catch (error) {
      throw error
    }
  }
  async updateStatusInvoice(id: string, statusDto: StatusDto) {
    try {
      // Validate ID
      if (!id) {
        throw new BadRequestException('Invoice ID is required');
      }
  
      // Validate status against enum
      if (!Object.values(Status).includes(statusDto.status)) {
        this.logger.error(`Invalid status provided: ${statusDto.status}`);
        throw new BadRequestException(
          `Invalid status. Must be one of: ${Object.values(Status).join(', ')}`
        );
      }
  
      const invoice = await this.invoiceModel.findByIdAndUpdate(
        id,
        { status: statusDto.status },
        { new: true }
      ).exec();
  
      if (!invoice) {
        this.logger.error(`Invoice not found with id: ${id}`);
        throw new NotFoundException('Invoice not found');
      }
  
      this.logger.log(`Invoice ${id} status updated ${statusDto.status}`);
  
      return {
        success: true,
        message: `Successfully updated status to ${statusDto.status}`,
        invoice
      };
    } catch (error) {
      this.logger.error(`Failed to update invoice status: ${error.message}`);
      throw error;
    }
  }
  async getUserInvoices(userId: string) {
    try {
      const invoices = await this.invoiceModel.find({
        $or: [
          { 'userAccount.adminId': userId },
          { 'userAccount.employeeId': userId }
        ]
      }).sort({ createdAt: -1 });

      const formattedInvoices = await Promise.all(
        invoices.map(invoice => this.formatInvoiceResponse(invoice))
      );

      return {
        success: true,
        message: 'User invoices retrieved successfully',
        invoices: formattedInvoices.map(response => response.invoice)
      };
    } catch (error) {
      this.logger.error('Error retrieving user invoices:', error);
      throw error;
    }
  }

  async deleteInvoice(id: string) {
    try {
      const invoice = await this.invoiceModel.findByIdAndDelete(id);
      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      return {
        success: true,
        message: 'Invoice deleted successfully'
      };
    } catch (error) {
      this.logger.error('Error deleting invoice:', error);
      throw error;
    }
  }
}