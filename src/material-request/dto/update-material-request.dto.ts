import { OmitType, PartialType, } from '@nestjs/swagger';
import { CreateMaterialRequestDto, } from './create-material-request.dto';

export class UpdateMaterialRequestDto extends PartialType(
  OmitType(CreateMaterialRequestDto, ['inventoryItem'] as const)
){}