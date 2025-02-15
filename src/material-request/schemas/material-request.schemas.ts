import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { MaterialStatus } from "src/enum/material-request.enum";
import { Inventory, InventoryDocument } from "src/inventory/schemas/inventory.schemas";

export type MaterialRequestDocument = HydratedDocument<MaterialRequest>;

@Schema({ timestamps: true })
export class MaterialRequest {
  @Prop({ type: Types.ObjectId, ref: 'Inventory', required: true })
  inventoryItem: Types.ObjectId;

  @Prop({ required: true })  
  name: string;

  @Prop({ required: true })
  quantity: number;

 
  @Prop({required: true})
  costPerItem: number

  @Prop({required:true})
  totalCost:number

  @Prop({ required: false })
  purpose: string;

  @Prop({
    enum: MaterialStatus,
    type: String,
    default: MaterialStatus.PENDING
  })
  status: MaterialStatus;


}

export const MaterialRequestSchema = SchemaFactory.createForClass(MaterialRequest);


MaterialRequestSchema.pre('save', async function (next) {
  if (this.isNew) {
    const inventory = await this.model('Inventory').findById(this.inventoryItem) as InventoryDocument;
    if (inventory) {
      this.name = inventory.name;
      this.costPerItem = inventory.cost

    }
  }
  next();
});
