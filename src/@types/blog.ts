import { Document, Schema } from 'mongoose';

export interface BlogInterface extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  media?: {
    [key: string]: string;
  };
}

export const tagEnum = ['frontend', 'backend', 'devops', 'algorithms'];

export type BlogUpdateType = {
  title?: string;
  content?: string;
  tags?: string[];
  media?: {
    [key: string]: string;
  };
};

export type BlogMediaUploadType = {
  mediaName: string;
  blogId: string;
  author: string;
};

export type BlogQueryType = {
  tag?: string;
  page?: number;
  limit?: number;
  title?: string;
};
