import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types,} from "mongoose";
import { Admin } from "src/admin/schemas/admin.schemas";
import { Employee } from "src/employees/schemas/employee.schemas";
import { Status } from "src/enum/invoice.enum";
import { Inventory } from "src/inventory/schemas/inventory.schemas";


export type InvoiceItemDocument = HydratedDocument<InvoiceItem>;
export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({timestamps:true})
export class InvoiceItem {

  @Prop({type: Types.ObjectId, ref:'Inventory', required:true})
  inventoryItem:Types.ObjectId;

  @Prop({required:true})
  qunatity:number;

  @Prop({required:true})
  cost:number
}


export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem)





@Schema({timestamps:true})
export class Invoice {

@Prop({ type: [{ type: Types.ObjectId, ref: 'InvoiceItem' }], required: true })
items:Types.ObjectId[];

@Prop({required:true})
totalCost:number

@Prop({required:true})
totalQuantity:number

@Prop({
enum: Status,
type:String,
default:Status.PENDING
})
status:Status

@Prop({type:Types.ObjectId, ref:'Admin', required:false})
admin?:Admin

@Prop({type:Types.ObjectId, ref:'Employee', required:false})
employee?:Employee

}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice)
