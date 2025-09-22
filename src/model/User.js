import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  credits: { type: Number, default: 50 },
  role: { type:String, enum: ['admin', 'user'], default:'user'}  
},{timestamps: true, versionKey: false});

export default model('users', userSchema);
