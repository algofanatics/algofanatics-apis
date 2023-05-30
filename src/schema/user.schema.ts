import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret._v;
    },
  },
  toObject: {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
    },
  },
})
export class User {
  @Prop()
  id?: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  })
  profilePhoto: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  bio: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  postCount: number;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ enum: ['Admin', 'Guest', 'Blogger'], default: 'Guest' })
  role: string;

  @Prop({ default: false })
  isFollowing: boolean;

  @Prop({ default: false })
  isUnFollowing: boolean;

  @Prop({ default: false })
  isAccountVerified: boolean;

  @Prop()
  viewedBy: string[];

  @Prop()
  followers: string[];

  @Prop()
  following: string[];

  @Prop()
  passwordChangeAt: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExpires: Date;

  @Prop({ default: false })
  active: boolean;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
