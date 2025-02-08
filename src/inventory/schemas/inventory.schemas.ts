import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { trueFalse } from "src/enum/inventory.enum";


export type InventoryDocument = HydratedDocument<Inventory>;
@Schema({timestamps:true})
export class Inventory {

@Prop()
name: string

@Prop()
quantity: number

@Prop()
cost: number

@Prop({default:trueFalse.TRUE})
available:boolean

}

export const InventorySchema = SchemaFactory.createForClass(Inventory);