import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialRequestService } from './material-request.service';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { UpdateMaterialRequestDto } from './dto/update-material-request.dto';

@Controller('api')
export class MaterialRequestController {
  constructor(private readonly materialRequestService: MaterialRequestService) {}

  @Post('material-request')
  create(@Body() createMaterialRequestDto: CreateMaterialRequestDto) {
    return this.materialRequestService.requestMaterial(createMaterialRequestDto);
  }

  @Get('material-request')
  findAll() {
    return this.materialRequestService.getAllMaterialRequested();
  }

  @Get('material-request/:id')
  findOne(@Param('id') id: string) {
    return this.materialRequestService.getOneMaterialRequested(id);
  }

  @Patch('material-request/:id')
  update(@Param('id') id: string, @Body() updateMaterialRequestDto: UpdateMaterialRequestDto) {
    return this.materialRequestService.update(id, updateMaterialRequestDto);
  }

  @Delete('material-request/:id')
  remove(@Param('id') id: string) {
    return this.materialRequestService.remove(id);
  }
}
