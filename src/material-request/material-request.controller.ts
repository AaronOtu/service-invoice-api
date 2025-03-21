import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MaterialRequestService } from './material-request.service';
import {
  CreateMaterialRequestDto,
  StatusDto,
} from './dto/create-material-request.dto';
import { UpdateMaterialRequestDto } from './dto/update-material-request.dto';
import { Public } from 'src/enum/public.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { MaterialStatus } from 'src/enum/material-request.enum';

@Controller('api')
export class MaterialRequestController {
  constructor(
    private readonly materialRequestService: MaterialRequestService,
  ) {}

  @Post('material-request')
  create(@Body() createMaterialRequestDto: CreateMaterialRequestDto) {
    return this.materialRequestService.requestMaterial(
      createMaterialRequestDto,
    );
  }

  @Public()
  @Get('material-request')
  findAll() {
    return this.materialRequestService.getAllMaterialRequested();
  }

  @Get('material-request/search')
  @ApiQuery({
    name: 'status',
    required: false,
    enum: MaterialStatus,
    description: 'Filter by material request status',
  })
  /*
  @ApiQuery({
    name: 'requestStartDate',
    required: false,
    type: String,
    description: 'Request start date (YYYY-MM-DD)'
  })
  @ApiQuery({
    name: 'requestEndDate',
    required: false,
    type: String,
    description: 'Request end date (YYYY-MM-DD)'
  })
  @ApiQuery({
    name: 'approvalStartDate',
    required: false,
    type: String,
    description: 'Approval start date (YYYY-MM-DD)'
  })
  @ApiQuery({
    name: 'approvalEndDate',
    required: false,
    type: String,
    description: 'Approval end date (YYYY-MM-DD)'
  })
    */
  async search(
    @Query('status') status?: string,
    // @Query('requestStartDate') requestStartDate?: string,
    // @Query('requestEndDate') requestEndDate?: string,
    // @Query('approvalStartDate') approvalStartDate?: string,
    // @Query('approvalEndDate') approvalEndDate?: string,
  ) {
    return this.materialRequestService.search(
      status,
      // requestStartDate,
      // requestEndDate,
      // approvalStartDate,
      // approvalEndDate,
    );                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  }

  @Get('material-request/:id')
  findOne(@Param('id') id: string) {
    return this.materialRequestService.getOneMaterialRequested(id);
  }

  @Patch('material-request/:id')
  update(
    @Param('id') id: string,
    @Body() updateMaterialRequestDto: UpdateMaterialRequestDto,
  ) {
    return this.materialRequestService.update(id, updateMaterialRequestDto);
  }
  @Patch('material-request/status/:id')
  updateStatus(@Param('id') id: string, @Body() status: StatusDto) {
    return this.materialRequestService.updateStatus(id, status);
  }

  @Delete('material-request/:id')
  remove(@Param('id') id: string) {
    return this.materialRequestService.remove(id);
  }
}
