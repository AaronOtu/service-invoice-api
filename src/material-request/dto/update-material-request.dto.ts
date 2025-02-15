import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMaterialRequestDto, } from './create-material-request.dto';
import { MaterialStatus } from 'src/enum/material-request.enum';

export class UpdateMaterialRequestDto extends PartialType(CreateMaterialRequestDto) {
  @ApiProperty({ required: false, default: MaterialStatus.PENDING })
  status?: MaterialStatus;
}