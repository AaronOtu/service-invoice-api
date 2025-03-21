import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('api/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('')
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.addInventory(createInventoryDto);
  }

  @Get('')
  findAll() {
    return this.inventoryService.getAllMaterial();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.getOneMaterial(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.updateMaterial(id, updateInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.removeMaterial(id);
  }
}
