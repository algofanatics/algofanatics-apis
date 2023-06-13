import { Document, Schema } from 'mongoose';

export interface BlogInterface extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const tagEnum = ['frontend', 'backend', 'devops', 'algorithms'];

export type BlogUpdateType = {
  title?: string;
  content?: string;
  tags?: string[];
}
