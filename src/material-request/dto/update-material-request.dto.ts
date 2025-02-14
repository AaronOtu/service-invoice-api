import { PartialType } from '@nestjs/swagger';
import { CreateMaterialRequestDto } from './create-material-request.dto';

export class UpdateMaterialRequestDto extends PartialType(CreateMaterialRequestDto) {}
