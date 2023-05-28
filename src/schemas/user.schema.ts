// ========== User Schema
// import all modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    currentTime(): number {
      return Date.now();
    },
  },
})
export class User {
  _id?: string;

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

  @Prop({
    type: Number,
  })
  createdAt?: number;

  @Prop({
    type: Number,
  })
  updatedAt?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
