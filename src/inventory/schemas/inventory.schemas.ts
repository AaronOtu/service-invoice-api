import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { trueFalse } from "src/enum/inventory.enum";


export type InventoryDocument = HydratedDocument<Inventory>;
@Schema({timestamps:true})
export class Inventory {
static findById(inventoryItem: Types.ObjectId) {
  throw new Error("Method not implemented.");
}

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