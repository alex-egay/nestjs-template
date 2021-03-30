import * as mongoose from 'mongoose';

export const UserSchema: mongoose.Schema = new mongoose.Schema({
  birthDayDate: Date,
  date: {type: Date, default: Date.now},
  email: String,
  features: [],
  friends:[String],
  hobby:[String],
  id: String,
  name: String,
  password: String,
  phone: String,
  surname: String,
  towns:[String],
});
