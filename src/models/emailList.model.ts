import { Schema, model } from 'mongoose';

const EmailListSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Enter your email'],
      max: 50,
      unique: true,
    },
  },
  {
    toObject: {
      transform: function (doc, ret) {},
    },
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
      },
    },
  }
);

export default model('EmailList', EmailListSchema);
