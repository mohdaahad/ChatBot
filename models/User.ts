import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IContact extends Document {
  email: string;
  phone: string;
  fullname: string;
  token?: number;
}

const UserSchema = new Schema<IContact>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[0-9]{10}$/,
        'Phone number must be a valid 10-digit number',
      ],
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    token: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Use the correct model name here
const User: Model<IContact> = mongoose.models.User || mongoose.model<IContact>('User', UserSchema);

export default User;
