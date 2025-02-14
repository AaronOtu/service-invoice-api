import { Module } from '@nestjs/common';
import { MaterialRequestService } from './material-request.service';
import { MaterialRequestController } from './material-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MaterialRequest, MaterialRequestSchema,  } from './schemas/material-request.schemas';
import { InventoryModule } from 'src/inventory/inventory.module';
@Module({
  imports:[
    MongooseModule.forFeature(
    [{name:MaterialRequest.name, schema:MaterialRequestSchema}],),
    InventoryModule
  
  ],
  controllers:[MaterialRequestController],
  providers: [MaterialRequestService],
  
})
export class MaterialRequestModule {}
