import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;       // Optional — not present for OAuth users
  image?: string;          // Profile image (from Google OAuth)
  emailVerified?: Date;
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
    password: {
      type: String,
      // Not required — Google OAuth users have no password
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in dev hot-reload
const User = models.User || model<IUser>('User', UserSchema);
export default User;
