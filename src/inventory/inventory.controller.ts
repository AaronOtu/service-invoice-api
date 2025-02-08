import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('api')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('inventory')
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.addInventory(createInventoryDto);
  }

  @Get('inventory')
  findAll() {
    return this.inventoryService.getAllMaterial();
  }

  @Get('inventory/:id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.getOneMaterial(id);
  }

  @Patch('inventory/:id')
  update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.updateMaterial(id, updateInventoryDto);
  }

  @Delete('inventory/:id')
  remove(@Param('id') id: string) {
    return this.inventoryService.removeMaterial(id);
  }
}
