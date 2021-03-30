import * as bcrypt from 'bcryptjs';
import { Injectable, HttpException, HttpStatus, HttpService } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '../users/interfaces/user.interface';
import { UserDto } from '../users/dto/user.dto';
import { ConsentRegistry } from './interfaces/consentregistry.interface';


@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>,
              @InjectModel('ConsentRegistry') private readonly consentRegistryModel: Model<ConsentRegistry>) {
  }


  public async validateLogin(email: string, password: string): Promise<{ user: UserDto }> {
    const userFromDb: User = await this.userModel.findOne({ email: email });
    if (!userFromDb) {
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (!userFromDb.email) {
      throw new HttpException('LOGIN.EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN);
    }

    const isValidPass: boolean = await bcrypt.compare(password, userFromDb.password);

    if (isValidPass) {

      return { user: new UserDto(userFromDb) };
    } else {
      throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED);
    }

  }

  public async saveUserConsent(email: string): Promise<ConsentRegistry> {
    try {
      const http: HttpService = new HttpService();

      const newConsent: any = new this.consentRegistryModel();
      newConsent.email = email;
      newConsent.date = new Date();
      newConsent.registrationForm = ['name', 'surname', 'email', 'birthday date', 'password'];
      newConsent.checkboxText = 'I accept privacy policy';
      const privacyPolicyResponse: any = await http.get('https://www.XXXXXX.com/api/privacy-policy').toPromise();
      newConsent.privacyPolicy = privacyPolicyResponse.data.content;
      const cookiePolicyResponse: any = await http.get('https://www.XXXXXX.com/api/privacy-policy').toPromise();
      newConsent.cookiePolicy = cookiePolicyResponse.data.content;
      newConsent.acceptedPolicy = 'Y';

      return await newConsent.save();
    } catch (error) {
      console.error(error);
    }
  }

}
