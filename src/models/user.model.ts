import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Enter a username'],
      min: 3,
      max: 20,
    },
    firstName: {
      type: String,
      required: [true, 'Enter your first name'],
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: [true, 'Enter your last name'],
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: [true, 'Enter your email'],
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      min: 5,
      required: [true, 'Enter your password'],
      max: 200,
    },
    status: {
      type: String,
      enum: ['pending', 'active'],
      required: [true, 'Enter a status'],
      default: 'pending',
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
  },
  {
    toObject: {
      transform: function (doc, ret) {},
    },
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

export default model('User', UserSchema);
