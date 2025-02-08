import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateInventoryDto {

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNumber()
  @IsNotEmpty()
  quantity: number


  @IsNumber()
  @IsNotEmpty()
  cost: number


  @ApiProperty({ required: false, default: true })
  available: string




}
