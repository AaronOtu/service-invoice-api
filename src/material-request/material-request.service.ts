import { Injectable } from '@nestjs/common';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { UpdateMaterialRequestDto } from './dto/update-material-request.dto';

@Injectable()
export class MaterialRequestService {
  create(createMaterialRequestDto: CreateMaterialRequestDto) {
    return 'This action adds a new materialRequest';
  }

  findAll() {
    return `This action returns all materialRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialRequest`;
  }

  update(id: number, updateMaterialRequestDto: UpdateMaterialRequestDto) {
    return `This action updates a #${id} materialRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialRequest`;
  }
}
