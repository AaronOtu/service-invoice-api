import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from './schemas/inventory.schemas';

@Injectable()
export class InventoryService {
  private logger = new Logger(InventoryService.name);
  constructor(@InjectModel(Inventory.name) private inventoryModel: Model<Inventory>) { }
  async addInventory(createInventoryDto: CreateInventoryDto) {
    try {

      const inventory = await this.inventoryModel.create(createInventoryDto)
      this.logger.log(`Inventory added:>>${inventory}`)
      return {
        message: 'Successfully added to inventory',
        material: inventory
      }


    } catch (error) {
      this.logger.log(error)
      throw new ConflictException(error.message || 'Something went wrong')

    }
  }

  async getAllMaterial() {
    try {
      const inventory = await this.inventoryModel.find().exec()
      console.log("Successfully retrieved all materials")
      return {
        message: "Successfully retrieved all materials",
        inventory: inventory
      };

    } catch (error) {
      this.logger.log(error)
      throw new ConflictException('Something went wrong!')

    }
  }

  async getOneMaterial(id: string) {
    try {
      const inventory = await this.inventoryModel.findById(id)

      if (!inventory) {
        throw new NotFoundException('material not found')
      }

      return {
        message: "Successfully retrieved material",
        inventory: inventory
      }

    } catch (error) {
      this.logger.error('error :>>', error)
      throw error

    }
  }

  async updateMaterial(id: string, updateInventoryDto: UpdateInventoryDto) {

    try {

      const inventory = await this.inventoryModel.findByIdAndUpdate(id, updateInventoryDto, { new: true })
      if (!inventory) {
        this.logger.log('inventory not found')
        throw new NotFoundException('Inventory not found')
      }

      console.log(`Successfully updated inventory ${id}`)

      return {
        message: "Successfully updated material details",
        inventory: inventory
      }

    } catch (error) {
      throw error
    }
  }

  async removeMaterial(id: string) {
    try {
      const inventory = await this.inventoryModel.findByIdAndDelete(id)

      this.logger.log(`Removing ${inventory.name}`)
      return ('Material successfully deleted')

    } catch (error) {
      throw new ConflictException('Something went wrong')
    }
  }
}
