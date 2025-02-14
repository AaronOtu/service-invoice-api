import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialRequestService } from './material-request.service';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { UpdateMaterialRequestDto } from './dto/update-material-request.dto';

@Controller('material-request')
export class MaterialRequestController {
  constructor(private readonly materialRequestService: MaterialRequestService) {}

  @Post()
  create(@Body() createMaterialRequestDto: CreateMaterialRequestDto) {
    return this.materialRequestService.create(createMaterialRequestDto);
  }

  @Get()
  findAll() {
    return this.materialRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialRequestDto: UpdateMaterialRequestDto) {
    return this.materialRequestService.update(+id, updateMaterialRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialRequestService.remove(+id);
  }
}
