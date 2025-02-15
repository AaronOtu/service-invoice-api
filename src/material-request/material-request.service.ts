import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
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
      if(!inventoryItem){
        throw new NotFoundException('Inventory Item not found')
      }

      if(inventoryItem.quantity < createMaterialRequestDto.quantity){
        throw new BadRequestException( `Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantity}, Requested: ${createMaterialRequestDto.quantity}`)
      }

     const costPerItem = inventoryItem.cost
     const totalCost = costPerItem * createMaterialRequestDto.quantity


     const payload = {
      inventoryItem: createMaterialRequestDto.inventoryItem,
      name: inventoryItem.name,
      quantity: createMaterialRequestDto.quantity,
      costPerItem: costPerItem,
      totalCost:totalCost,
      purpose: createMaterialRequestDto.purpose,
      status: MaterialStatus.PENDING

     }

   

    const materialRequest = await this.materialRequestModel.create(payload)

   

      this.logger.log(`material requested :>> ${materialRequest}`)


      return {
        success:true,
        message:'Successfully requested for a material',
        material:materialRequest
      }
    } catch (error) {
      this.logger.error('error :>>', error)
      throw new ConflictException('Something went wrong')
    }
  }

 async getAllMaterialRequested() {

  try{
    const material = await this.materialRequestModel.find().sort({createdAt: -1}).exec()
    this.logger.log('material requested', material)
    return{
      success:true,
      message:"Successfully retrieved all material requested",
      data: material
    }

  }catch(error){
    this.logger.log(error.message)
    throw error
  }
  }

  async getOneMaterialRequested(id: string) {
   try{
    const material = await this.materialRequestModel.findById(id).exec()
    if(!material){
      this.logger.log('Material request not found')
      throw new NotFoundException("Material request item not found")
    }
    
    return{
      success:true,
      message:"Successfully retrieved a material request item",
      data:material
    }

   }catch(error){
    this.logger.error(error)
    throw error
   }
  
  }

  update(id: string, updateMaterialRequestDto: UpdateMaterialRequestDto) {
    return `This action updates a #${id} materialRequest`;
  }

  async remove(id: string) {
    try{

      const material = await this.materialRequestModel.findByIdAndDelete(id).exec()
      if(!material){
        throw new NotFoundException(`Id ${id} not found`)
      }
     return{
      success: true,
      message: `Successfully deleted request item`
     }
    }catch(error){
      throw error
    }

  }
}
 