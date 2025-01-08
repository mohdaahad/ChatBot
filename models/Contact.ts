import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  fullName: string;
  email: string;
  phone: string;
  useCase: string;
  turnover?: string;
  companyName?: string;
  country?: string;
}

const ContactSchema = new Schema<IContact>({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  useCase: {
    type: String,
    required: true,
    trim: true,
  },
  turnover: {
    type: String,
    required: false,
    trim: true,
  },
  companyName: {
    type: String,
    required: false,
    trim: true,
  },
  country: {
    type: String,
    required: false,
    trim: true,
  },
});

const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
