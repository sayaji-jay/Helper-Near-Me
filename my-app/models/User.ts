import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  gender: string;
  work: string[]; // Multiple work types (replaces skills)
  address: string;
  village: string;
  city: string;
  state: string;
  companyName: string;
  experience: string;
  description: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other'],
      trim: true,
    },
    work: {
      type: [String],
      required: [true, 'At least one work type is required'],
      validate: {
        validator: (work: string[]) => work && work.length > 0,
        message: 'At least one work type is required',
      },
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    village: {
      type: String,
      required: [true, 'Village is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    companyName: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    avatar: {
      type: String,
      default: function (this: IUser) {
        const name = this.name.replace(/\s+/g, '+');
        return `https://ui-avatars.com/api/?name=${name}&background=667eea&color=fff&size=200`;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
UserSchema.index({ name: 'text', description: 'text', work: 'text', city: 'text', village: 'text', state: 'text' });
UserSchema.index({ name: 1 });
UserSchema.index({ city: 1 });
UserSchema.index({ state: 1 });
UserSchema.index({ village: 1 });
UserSchema.index({ work: 1 });
UserSchema.index({ email: 1 }, { unique: true });

// Delete existing model if it exists (for hot reload in development)
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
