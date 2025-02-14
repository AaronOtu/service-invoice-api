import { Module } from '@nestjs/common';
import { MaterialRequestService } from './material-request.service';
import { MaterialRequestController } from './material-request.controller';

@Module({
  controllers: [MaterialRequestController],
  providers: [MaterialRequestService],
})
export class MaterialRequestModule {}
