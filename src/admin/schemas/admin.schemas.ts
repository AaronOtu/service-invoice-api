import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Role } from "src/enum/admin-user";


export type AdminDocument = HydratedDocument<Admin>;
@Schema({timestamps :true})
export class Admin {

@Prop()
firstname : string;

@Prop()
lastname: string;

@Prop()
email: string;

@Prop()
password: string;

@Prop(
 { 
  enum: Role,
  type: String
}
)
role: Role

@Prop({type: Date})
createdAt?: Date;

@Prop({type: Date})
updatedAt?: Date;
 
}

export const AdminSchema = SchemaFactory.createForClass(Admin);