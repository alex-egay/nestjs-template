import { Document } from 'mongoose';
export interface User extends Document{
  birthDayDate: Date;
  email: string;
  features: [];
  friends:[];
  hobby:[];
  id: string;
  name: string;
  password: string;
  phone: string;
  surname: string;
  towns:[];
}
