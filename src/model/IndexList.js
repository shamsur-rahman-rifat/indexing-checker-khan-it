import { Schema, model } from 'mongoose';

const indexListSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  email: { type: String },
  url: { type: String },
  indexed: { type: Boolean},
  checkedAt: { type: Date, default: Date.now },
},{timestamps: true, versionKey: false});

export default model('indexlists', indexListSchema);
