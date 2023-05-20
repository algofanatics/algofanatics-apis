import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            delete ret._id;
            delete ret._v
        }
    },
    toObject: {
        virtuals: true,
        transform(doc, ret) {
            doc.id = ret._id;
        }
    }
})
export class User {
    @Prop()
    id?: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    @Exclude()
    password: string;

    @Prop({ required: true })
    @IsEmail()
    email: string;

    @Prop()
    refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);