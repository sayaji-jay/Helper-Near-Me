import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  description: string;
  experience: string;
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
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (skills: string[]) => skills && skills.length > 0,
        message: 'At least one skill is required',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      trim: true,
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
UserSchema.index({ name: 'text', location: 'text', description: 'text', skills: 'text' });
UserSchema.index({ name: 1 });
UserSchema.index({ location: 1 });
UserSchema.index({ skills: 1 });
UserSchema.index({ email: 1 }, { unique: true });

// Delete existing model if it exists (for hot reload in development)
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
