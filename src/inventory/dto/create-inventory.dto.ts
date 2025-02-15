import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateInventoryDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({required:true, default:'Towels'})
  name: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({required:true, default:20})
  quantity: number


  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({required:true,default:30})
  cost: number


  @ApiProperty({ required: false, default: true })
  available: string


}

