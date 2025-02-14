import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { UpdateMaterialRequestDto } from './dto/update-material-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaterialRequest } from './schemas/material-request.schemas';
import { Inventory } from 'src/inventory/schemas/inventory.schemas';

@Injectable()
export class MaterialRequestService {
  private logger = new Logger(MaterialRequestService.name);
  constructor(
    @InjectModel(MaterialRequest.name) private materialRequestModel: Model<MaterialRequest>,
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>
  ) { }


  async requestMaterial(createMaterialRequestDto: CreateMaterialRequestDto) {

    try {
      const materialRequest = await this.materialRequestModel.create(createMaterialRequestDto)
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
 