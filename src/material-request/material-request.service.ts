import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMaterialRequestDto, StatusDto } from './dto/create-material-request.dto';
import { UpdateMaterialRequestDto } from './dto/update-material-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaterialRequest } from './schemas/material-request.schemas';
import { Inventory } from 'src/inventory/schemas/inventory.schemas';
import { MaterialStatus } from 'src/enum/material-request.enum';


@Injectable()
export class MaterialRequestService {
  private logger = new Logger(MaterialRequestService.name);
  constructor(
    @InjectModel(MaterialRequest.name) private materialRequestModel: Model<MaterialRequest>,
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>
  ) { }


  async requestMaterial(createMaterialRequestDto: CreateMaterialRequestDto) {

    try {

      const inventoryItem = await this.inventoryModel.findById(createMaterialRequestDto.inventoryItem)
      if (!inventoryItem) {
        throw new NotFoundException('Inventory Item not found')
      }

      if (inventoryItem.quantity < createMaterialRequestDto.quantity) {
        throw new BadRequestException(`Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantity}, Requested: ${createMaterialRequestDto.quantity}`)
      }

      const costPerItem = inventoryItem.cost
      const totalCost = costPerItem * createMaterialRequestDto.quantity


      const payload = {
        inventoryItem: createMaterialRequestDto.inventoryItem,
        name: inventoryItem.name,
        quantity: createMaterialRequestDto.quantity,
        costPerItem: costPerItem,
        totalCost: totalCost,
        purpose: createMaterialRequestDto.purpose,
        status: MaterialStatus.PENDING

      }



      const materialRequest = await this.materialRequestModel.create(payload)



      this.logger.log(`material requested :>> ${materialRequest}`)


      return {
        success: true,
        message: 'Successfully requested for a material',
        material: materialRequest
      }
    } catch (error) {
      this.logger.error('error :>>', error)
      throw error
    }
  }

  async getAllMaterialRequested() {

    try {
      const material = await this.materialRequestModel.find().sort({ createdAt: -1 }).exec()
      this.logger.log('material requested', material)
      return {
        success: true,
        message: "Successfully retrieved all material requested",
        data: material
      }

    } catch (error) {
      this.logger.log(error.message)
      throw error
    }

  }

  async getOneMaterialRequested(id: string) {
    try {
      const material = await this.materialRequestModel.findById(id).exec()
      if (!material) {
        this.logger.log('Material request not found')
        throw new NotFoundException("Material request item not found")
      }

      return {
        success: true,
        message: "Successfully retrieved a material request item",
        data: material
      }

    } catch (error) {
      this.logger.error(error)
      throw error
    }

  }

  async update(id: string, updateMaterialRequestDto: UpdateMaterialRequestDto) {
    try {

      const materialRequest = await this.materialRequestModel.findById(id).exec();
      if (!materialRequest) {
        throw new NotFoundException(`Material request with ID ${id} not found`);
      }


      const updatedMaterialRequest = await this.materialRequestModel.findByIdAndUpdate(
        id,
        updateMaterialRequestDto,
        { new: true },
      ).exec();


      this.logger.log(`Material request updated: ${updatedMaterialRequest}`);

      return {
        success: true,
        message: 'Material request updated successfully',
        data: updatedMaterialRequest,
      };
    } catch (error) {
      this.logger.error(`Error updating material request: ${error.message}`);
      throw error;
    }
  }

  async updateStatus(id: string, status: StatusDto) {
    try {
      
      const material = await this.materialRequestModel.findById(id);
      if (!material) {
        throw new NotFoundException(`Material with id ${id} not found`);
      }

      // Prevent re-approving an already approved material request
      if (material.status === MaterialStatus.APPROVED && status.status === MaterialStatus.APPROVED) {
        throw new BadRequestException('This material request has already been approved.');
      }

      if (material.status === MaterialStatus.CANCELLED && status.status === MaterialStatus.CANCELLED) {
        throw new BadRequestException('This material request has already been cancelled.');
      }

      // Handle inventory restoration when cancelling an approved material request
      if (material.status === MaterialStatus.APPROVED && status.status === MaterialStatus.CANCELLED) {
        const inventoryItem = await this.inventoryModel.findById(material.inventoryItem).exec();
        if (!inventoryItem) {
          throw new NotFoundException('Inventory item not found');
        }

        inventoryItem.quantity += material.quantity; 
        await inventoryItem.save();
      }

    
      material.status = status.status;
      await material.save();

      // Handle inventory update for APPROVED status
      if (status.status === MaterialStatus.APPROVED) {
        const inventoryItem = await this.inventoryModel.findById(material.inventoryItem).exec();
        if (!inventoryItem) {
          throw new NotFoundException('Inventory item not found');
        }

        if (inventoryItem.quantity < material.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantity}, Requested: ${material.quantity}`,
          );
        }

        inventoryItem.quantity -= material.quantity;
        await inventoryItem.save();
      }

      this.logger.log(`Material request updated: ${JSON.stringify(material)}`);

      return {
        success: true,
        message: `Successfully ${status.status} material request`,
        data: material
      };

    } catch (error) {
      this.logger.error(`Error updating status: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string) {
    try {

      const material = await this.materialRequestModel.findByIdAndDelete(id).exec()
      if (!material) {
        throw new NotFoundException(`Id ${id} not found`)
      }
      return {
        success: true,
        message: `Successfully deleted request item`
      }
    } catch (error) {
      throw error
    }

  }
}
