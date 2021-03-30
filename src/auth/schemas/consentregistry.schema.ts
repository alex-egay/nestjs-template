import * as mongoose from 'mongoose';

export const ConsentRegistrySchema:any = new mongoose.Schema({
  date: Date,
  email: String,
  registrationForm: [Array],
});
