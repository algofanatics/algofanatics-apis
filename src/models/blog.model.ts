import mongoose from 'mongoose';
import { tagEnum } from '../@types';

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please include title'],
    },
    content: {
      type: String,
      required: [true, 'Please include body'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: tagEnum,
      default: ['algorithms'],
    },
    media: {
      type: Object,
      default: {},
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

export default mongoose.model('Blog', BlogSchema);
