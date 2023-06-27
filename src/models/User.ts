import mongoose from 'mongoose';
import Validator from 'validator';

const { isEmail } = Validator;

const UserSchema = new mongoose.Schema(
  {
    expiresIn: Date,
    hasLoggedIn: {
      type: Boolean,
      default: false,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      required: [true, 'Please include username'],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      validate: [isEmail, 'Please add a valid email address'],
      sparse: true,
    },
    isActive: {
      type: Boolean,
      default: false,
      required: [true, 'Please include isActive'],
    },
    isDeleted: {
      // object type with status and date
      type: Object,
      default: {
        status: false,
        date: null,
        reason: null,
      },
    },
    address: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'NG',
    },
    dob: String,
    phoneNumber: {
      type: String,
      match: [/\d{10}$/, 'Please include valid phone number'],
    },
    password: {
      type: String,
    },
    tempToken: String,
    image: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

export default mongoose.model('User', UserSchema);
