// ========== User Schema
// import all modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
    type: String,
  })
  firstName: string;

  @Prop({
    required: false,
    type: String,
    default: '',
  })
  lastName: string;

  @Prop({
    required: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
