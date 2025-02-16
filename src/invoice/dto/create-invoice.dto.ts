import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"
import { MaterialStatus } from "src/enum/material-request.enum";



export class CreateInvoiceDto {

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({required:true, default:'67a8d19138a1de11ad44f71a'})
  userId: string;

  // @IsNotEmpty()
  // @IsMongoId()
  // @ApiProperty({required:true, default:'67a8d19138a1de11ad44f71a'})
  // materialRequestId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  @ApiProperty({
    required: true,
    default: [
      {
        inventoryItem: '67a6962d540ed4c9b358af77',
        quantity: 10,
        cost: 30
      },
      {
        inventoryItem: '67a696f8f9387b4eed9a6a88',
        quantity: 60,
        cost:30
      }
    ]
  })
  items: InvoiceItemDto[];


}


class InvoiceItemDto {
  @IsMongoId()
  @ApiProperty({required:true, default:'67a8d19138a1de11ad44f71a'})
  inventoryItem: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({required:true, default:20})
  quantity: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({required:true, default:40})
  cost: number;
}



