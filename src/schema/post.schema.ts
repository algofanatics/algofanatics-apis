import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Post extends Document {
  @Prop({ required: [true, 'Post title is required'], trim: true })
  title: string;

  @Prop({ required: [true, 'Post category is required'], default: 'All' })
  category: string;

  @Prop({ default: false })
  isLiked: boolean;

  @Prop({ default: false })
  isDisliked: boolean;

  @Prop({ default: 0 })
  numViews: number;

  @Prop([{ type: 'ObjectId', ref: 'User' }])
  likes: string[];

  @Prop([{ type: 'ObjectId', ref: 'User' }])
  dislikes: string[];

  @Prop({
    type: 'ObjectId',
    ref: 'User',
    required: [true, 'Author is required'],
  })
  user: string;

  @Prop({ required: [true, 'Post description is required'] })
  description: string;

  @Prop({
    default:
      'https://cdn.pixabay.com/photo/2020/10/25/09/23/seagull-5683637_960_720.jpg',
  })
  image: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
