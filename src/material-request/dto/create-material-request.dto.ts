import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsNotEmpty, IsString, IsMongoId } from "class-validator"

export class CreateMaterialRequestDto {

  @IsMongoId()
  @ApiProperty({required:true, default:'67a8d19138a1de11ad44f71a'})
  inventoryItem:string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({required:true, default: 50})
  quantity:number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({required:true, default:"Office use"})
  purpose:string
  
}
